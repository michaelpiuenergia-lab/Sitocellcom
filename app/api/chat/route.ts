import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { CELLCOM_SYSTEM_PROMPT } from "@/lib/chatbot/system-prompt";
import {
  ANTHROPIC_TOOLS,
  TOOL_HANDLERS,
  TOOL_LABELS,
  parseOpenRequestPayload,
  type ToolResult,
} from "@/lib/chatbot/tools";
import { consumeRateLimit, extractIp } from "@/lib/chatbot/rate-limit";

/**
 * /api/chat — endpoint streaming SSE per il chatbot pubblico Cellcom.
 *
 * Flusso:
 * 1. Valida body (max 50 messaggi, body <32KB)
 * 2. Rate-limit per IP (best-effort)
 * 3. Stream Claude → emette text-delta in tempo reale
 * 4. Quando stop_reason='tool_use', esegue i tool in parallelo e ricomincia
 *    fino a MAX_ITERATIONS=5
 * 5. Forwarda eventi tool-use-start / tool-result / open-request / done
 * 6. AbortSignal del client interrompe lo stream upstream
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─── Validation ────────────────────────────────────────────────────────────

const ChatMessageInput = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const RequestBody = z.object({
  messages: z.array(ChatMessageInput).min(1).max(50),
});

// ─── Anthropic client (singleton via lazy init) ────────────────────────────

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY non configurata");
  _client = new Anthropic({ apiKey });
  return _client;
}

// ─── SSE helpers ───────────────────────────────────────────────────────────

const enc = new TextEncoder();

function sseEvent(controller: ReadableStreamDefaultController, name: string, data: unknown) {
  const payload = `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
  try {
    controller.enqueue(enc.encode(payload));
  } catch {
    // controller chiuso (client disconnesso): ignora
  }
}

function sseError(controller: ReadableStreamDefaultController, message: string) {
  sseEvent(controller, "error", { message });
}

// ─── Model + config ────────────────────────────────────────────────────────

const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_ITERATIONS = 5;

function envModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

function envMaxIterations(): number {
  const raw = process.env.CHATBOT_MAX_ITERATIONS;
  if (!raw) return DEFAULT_MAX_ITERATIONS;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n <= 10 ? Math.floor(n) : DEFAULT_MAX_ITERATIONS;
}

// ─── Tool execution ────────────────────────────────────────────────────────

async function runTool(name: string, input: unknown): Promise<ToolResult> {
  const handler = TOOL_HANDLERS[name];
  if (!handler) {
    return { ok: false, code: "UNKNOWN_TOOL", message: `Tool sconosciuto: ${name}` };
  }
  try {
    return await handler(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore interno";
    return { ok: false, code: "HANDLER_ERROR", message: msg };
  }
}

// ─── Tipi locali per il loop tool-use ──────────────────────────────────────

type AnthropicMessage = Anthropic.MessageParam;
type AnthropicContentBlock = Anthropic.Messages.ContentBlock;

function toAnthropicMessages(
  input: { role: "user" | "assistant"; content: string }[],
): AnthropicMessage[] {
  return input.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

// ─── POST handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Kill switch
  if (process.env.CHATBOT_DISABLED === "true") {
    return NextResponse.json(
      { error: { code: "DISABLED", message: "Chat temporaneamente non disponibile" } },
      { status: 503 },
    );
  }

  // Same-origin guard
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.endsWith(host)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN_ORIGIN", message: "Origin non consentita" } },
      { status: 403 },
    );
  }

  // Body size guard (best-effort, Next.js già limita ~1MB di default)
  const text = await req.text();
  if (text.length > 32_000) {
    return NextResponse.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Messaggio troppo lungo" } },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body non valido" } },
      { status: 400 },
    );
  }
  const parsed = RequestBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: parsed.error.issues[0]?.message ?? "Dati non validi",
        },
      },
      { status: 400 },
    );
  }

  // Rate-limit
  const ip = extractIp(req.headers);
  const rl = consumeRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Troppe richieste, riprova fra qualche minuto",
        },
      },
      { status: 429, headers: { "Retry-After": String(rl.resetInSec) } },
    );
  }

  // Verifica chiave (fail-fast prima di aprire lo stream)
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_CONFIGURED",
          message: "Chat non configurata (ANTHROPIC_API_KEY mancante)",
        },
      },
      { status: 503 },
    );
  }

  const model = envModel();
  const maxIterations = envMaxIterations();
  const messages: AnthropicMessage[] = toAnthropicMessages(parsed.data.messages);
  const client = getClient();
  const abortCtl = new AbortController();
  const upstreamSignal = abortCtl.signal;

  // Propaga AbortSignal del client → upstream
  req.signal.addEventListener("abort", () => abortCtl.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Prompt-cache: marca system + ultimo tool (= tutto il blocco prefix)
        const cachedSystem: Anthropic.Messages.TextBlockParam[] = [
          {
            type: "text",
            text: CELLCOM_SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ];
        const cachedTools = ANTHROPIC_TOOLS.map((t, i) =>
          i === ANTHROPIC_TOOLS.length - 1
            ? { ...t, cache_control: { type: "ephemeral" as const } }
            : t,
        );

        for (let iter = 0; iter < maxIterations; iter++) {
          if (upstreamSignal.aborted) {
            sseEvent(controller, "error", { message: "Interrotto dal client" });
            return;
          }

          const upstream = client.messages.stream(
            {
              model,
              max_tokens: 1024,
              system: cachedSystem,
              tools: cachedTools,
              messages,
            },
            { signal: upstreamSignal },
          );

          // Forwarda text deltas in tempo reale
          upstream.on("text", (delta: string) => {
            if (delta) sseEvent(controller, "text-delta", { text: delta });
          });

          const final = await upstream.finalMessage();
          const stopReason = final.stop_reason;
          const blocks = final.content as AnthropicContentBlock[];

          if (stopReason !== "tool_use") {
            // Fine turno: emetti done con usage
            sseEvent(controller, "done", {
              usage: {
                inputTokens: final.usage.input_tokens,
                outputTokens: final.usage.output_tokens,
                cacheReadTokens:
                  (final.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
              },
            });
            return;
          }

          // Estrai i tool_use blocks
          const toolUses = blocks.filter(
            (b): b is Extract<AnthropicContentBlock, { type: "tool_use" }> =>
              b.type === "tool_use",
          );

          if (toolUses.length === 0) {
            sseEvent(controller, "done", { usage: { inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens } });
            return;
          }

          // Notifica al client + esegui in parallelo
          for (const tu of toolUses) {
            sseEvent(controller, "tool-use-start", {
              id: tu.id,
              name: tu.name,
              label: TOOL_LABELS[tu.name] ?? "Verifico…",
            });
          }

          const results = await Promise.all(
            toolUses.map(async (tu) => {
              const result = await runTool(tu.name, tu.input);
              // Tool virtuale openRequestForm: emetti evento dedicato al client
              if (tu.name === "openRequestForm" && result.ok) {
                const payload = parseOpenRequestPayload(tu.input);
                if (payload) {
                  sseEvent(controller, "open-request", payload);
                }
              }
              return { tu, result };
            }),
          );

          for (const { tu, result } of results) {
            sseEvent(controller, "tool-result", {
              id: tu.id,
              name: tu.name,
              ok: result.ok,
            });
          }

          // Aggiungi alla history: assistant con tool_use + user con tool_result
          messages.push({
            role: "assistant",
            content: blocks as Anthropic.ContentBlockParam[],
          });
          messages.push({
            role: "user",
            content: results.map(({ tu, result }) => ({
              type: "tool_result" as const,
              tool_use_id: tu.id,
              content: JSON.stringify(result),
              is_error: !result.ok,
            })),
          });
        }

        // Loop limit raggiunto
        sseEvent(controller, "text-delta", {
          text: "\n\nNon riesco a chiudere la risposta in questo turno. Prova a riformulare oppure apri una richiesta diretta →",
        });
        sseEvent(controller, "done", {});
      } catch (e) {
        if (upstreamSignal.aborted) {
          // Cliente disconnesso: chiudi pulito
          return;
        }
        const err = e as { status?: number; message?: string };
        const status = err.status;
        let userMessage = "Il servizio chat non è disponibile, scrivici a info@cellcom.it";
        if (status === 429) userMessage = "Troppe richieste, riprova fra qualche minuto";
        else if (status === 401 || status === 403)
          userMessage = "Chat non disponibile (configurazione)";
        else if (status && status >= 500)
          userMessage = "Servizio temporaneamente non disponibile";
        // Log server-side senza esporre dettagli upstream
        console.error("[chat]", { status, message: err.message });
        sseError(controller, userMessage);
      } finally {
        try {
          controller.close();
        } catch {
          // già chiuso
        }
      }
    },
    cancel() {
      abortCtl.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
