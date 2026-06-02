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
 *
 * Fix dal review:
 * #9  Turn-guard ref: dopo cancel() gli eventi SSE già bufferizzati non
 *     mutano più lo stato del messaggio aborted.
 * #10 sendingRef sincrono: evita doppio fetch per click ravvicinati prima
 *     che il setState di "streaming" propaghi al rerender.
 * #11 initialRunRef: il primo run del save-effect dopo l'hydration non
 *     scrive "[]" in sessionStorage.
 * #12 try/finally + reader.cancel(): rilascia il reader e chiude il body
 *     su throw/error/cancel.
 * #14 Save debounce 300ms durante streaming, flush sincrono su pagehide.
 * #1  Done event con truncated=true segna il messaggio senza inquinare
 *     content (prima si appendeva un text-delta sintetico).
 */

const STORAGE_KEY = "cellcom:chat:v1";
const MAX_HISTORY = 30;
const SAVE_DEBOUNCE_MS = 300;

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
  const sendingRef = useRef(false);              // #10
  const currentTurnRef = useRef<{ id: string; cancelled: boolean } | null>(null); // #9
  const hydratedRef = useRef(false);
  const initialSaveSkipRef = useRef(true);       // #11
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // #14
  const pendingSaveRef = useRef<ChatMessage[] | null>(null); // #14
  // Mirror sincrono dello stato messages — usato in send() per costruire
  // il body senza dipendere dalla closure (che con useCallback deps=[] è
  // stale) né dal setState callback (che in React 19 Strict Mode può
  // generare un body vuoto).
  const messagesRef = useRef<ChatMessage[]>([]);

  // Hydrate da sessionStorage al mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const history = loadHistory();
    if (history.length > 0) setMessages(history);
  }, []);

  // Mirror messages → messagesRef per accesso sincrono in send()
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Persisti — debounce 300ms (fix #14: evita setItem sync per ogni delta)
  useEffect(() => {
    if (!hydratedRef.current) return;
    // Fix #11: il primo run post-hydration vede messages=[] (closure del
    // render iniziale) e sovrascriverebbe la history caricata
    if (initialSaveSkipRef.current) {
      initialSaveSkipRef.current = false;
      return;
    }
    pendingSaveRef.current = messages;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (pendingSaveRef.current) {
        saveHistory(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [messages]);

  // Flush sincrono su pagehide (Safari iOS) + beforeunload
  useEffect(() => {
    function flush() {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (pendingSaveRef.current) {
        saveHistory(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }
    }
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, []);

  const cancel = useCallback(() => {
    // #9: marca il turno corrente come cancellato — gli eventi SSE già
    // bufferizzati nel parser non muteranno più lo stato.
    if (currentTurnRef.current) currentTurnRef.current.cancelled = true;
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
      // #10: guard sincrono via ref. Non dipendere da `status` (closure stale)
      if (!trimmed || sendingRef.current) return;
      sendingRef.current = true;

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

      // Snapshot sincrono via ref (no closure stale, no Strict Mode race)
      const snapshotForFetch: ChatMessage[] = [
        ...messagesRef.current,
        userMsg,
        assistantMsg,
      ];
      messagesRef.current = snapshotForFetch;
      setMessages(snapshotForFetch);
      setStatus("streaming");

      const ctl = new AbortController();
      abortRef.current = ctl;
      currentTurnRef.current = { id: assistantId, cancelled: false };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: snapshotForFetch
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
          // #9: gate su turn-guard. Ignora eventi se cancellato/turno cambiato.
          const turn = currentTurnRef.current;
          if (!turn || turn.id !== assistantId || turn.cancelled) return;

          if (event.type === "text-delta") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + event.text } : m,
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
            if (typeof window !== "undefined") {
              const detail: OpenRequestEventDetail = {
                kind: event.kind,
                product: event.product ?? null,
                defaultCustomer: event.defaultCustomer ?? {},
                hideCompany: event.kind !== "b2b-quote",
              };
              window.dispatchEvent(new CustomEvent(OPEN_REQUEST_EVENT, { detail }));
            }
          } else if (event.type === "done") {
            // #1: truncated=true → flag su messaggio, NO append al content
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      status: "complete",
                      truncated: event.truncated === true ? true : m.truncated,
                    }
                  : m,
              ),
            );
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        });

        setStatus("idle");
        abortRef.current = null;
        currentTurnRef.current = null;
      } catch (e) {
        if (ctl.signal.aborted) {
          abortRef.current = null;
          currentTurnRef.current = null;
          return;
        }
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
                    m.content || "Connessione persa. Riprova o apri una richiesta diretta →",
                }
              : m,
          ),
        );
        abortRef.current = null;
        currentTurnRef.current = null;
      } finally {
        sendingRef.current = false;
      }
    },
    [],
  );

  return { messages, status, error, send, cancel, reset };
}

// ─── SSE parser ────────────────────────────────────────────────────────────

/**
 * Legge una ReadableStream SSE (event: name\ndata: json\n\n) e chiama
 * onEvent per ciascun blocco completo. Rilascia il reader in finally per
 * non lasciare la connessione locked su throw (fix #12).
 */
async function consumeSse(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ChatStreamEvent) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

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
  } finally {
    try {
      await reader.cancel().catch(() => {});
    } catch {
      // ignore
    }
    try {
      reader.releaseLock();
    } catch {
      // già rilasciato
    }
  }
}
