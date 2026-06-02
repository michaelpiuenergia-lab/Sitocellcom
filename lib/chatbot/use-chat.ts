"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatMessage,
  ChatStreamEvent,
  ChatToolEvent,
  OpenRequestEventDetail,
} from "./types";
import { OPEN_REQUEST_EVENT } from "./types";

/**
 * Hook lato browser: gestisce history messaggi, streaming SSE, abort,
 * persistenza sessione (sessionStorage) e dispatch dell'evento
 * window "cellcom:open-request" verso il <RequestFormBridge/>.
 */

const STORAGE_KEY = "cellcom:chat:v1";
const MAX_HISTORY = 30;

export type ChatStatus = "idle" | "streaming" | "error";

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
  } catch {
    // quota piena o SSR: ignora
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hydratedRef = useRef(false);

  // Hydrate da sessionStorage al mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const history = loadHistory();
    if (history.length > 0) setMessages(history);
  }, []);

  // Persisti ad ogni update
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveHistory(messages);
  }, [messages]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === "assistant" && last.status === "streaming") {
        return [...prev.slice(0, -1), { ...last, status: "aborted" }];
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    cancel();
    setMessages([]);
    setError(null);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [cancel]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "streaming") return;

      setError(null);
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        status: "complete",
      };
      const assistantId = uid();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        status: "streaming",
        toolEvents: [],
      };

      const newMessages = [...messages, userMsg, assistantMsg];
      setMessages(newMessages);
      setStatus("streaming");

      const ctl = new AbortController();
      abortRef.current = ctl;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .filter((m) => m.content.length > 0)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: ctl.signal,
        });

        if (!res.ok || !res.body) {
          const errBody = await res.json().catch(() => null);
          const msg =
            errBody?.error?.message ??
            (res.status === 429
              ? "Troppe richieste, riprova fra qualche minuto"
              : "Errore di rete");
          throw new Error(msg);
        }

        await consumeSse(res.body, (event) => {
          if (event.type === "text-delta") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + event.text }
                  : m,
              ),
            );
          } else if (event.type === "tool-use-start") {
            const tool: ChatToolEvent = {
              id: event.id,
              name: event.name,
              label: event.label,
              status: "running",
            };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, toolEvents: [...(m.toolEvents ?? []), tool] }
                  : m,
              ),
            );
          } else if (event.type === "tool-result") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      toolEvents: (m.toolEvents ?? []).map((t) =>
                        t.id === event.id
                          ? { ...t, status: event.ok ? "ok" : "error" }
                          : t,
                      ),
                    }
                  : m,
              ),
            );
          } else if (event.type === "open-request") {
            // Hand-off a <RequestFormBridge/>
            if (typeof window !== "undefined") {
              const detail: OpenRequestEventDetail = {
                kind: event.kind,
                product: event.product ?? null,
                defaultCustomer: event.defaultCustomer ?? {},
                hideCompany: event.kind !== "b2b-quote",
              };
              window.dispatchEvent(
                new CustomEvent(OPEN_REQUEST_EVENT, { detail }),
              );
            }
          } else if (event.type === "done") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, status: "complete" } : m,
              ),
            );
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        });

        setStatus("idle");
        abortRef.current = null;
      } catch (e) {
        if (ctl.signal.aborted) return; // gestito in cancel()
        const msg = e instanceof Error ? e.message : "Errore";
        setError(msg);
        setStatus("error");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  status: "error",
                  content:
                    m.content ||
                    "Connessione persa. Riprova o apri una richiesta diretta →",
                }
              : m,
          ),
        );
        abortRef.current = null;
      }
    },
    [messages, status],
  );

  return { messages, status, error, send, cancel, reset };
}

// ─── SSE parser ────────────────────────────────────────────────────────────

async function consumeSse(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ChatStreamEvent) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Spezza per blocchi di evento (separati da \n\n)
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      if (!block.trim()) continue;

      let eventName = "message";
      let data = "";
      for (const line of block.split("\n")) {
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      try {
        const parsed = JSON.parse(data) as Record<string, unknown>;
        onEvent({ type: eventName, ...parsed } as unknown as ChatStreamEvent);
      } catch {
        // chunk non valido: ignora
      }
    }
  }
}
