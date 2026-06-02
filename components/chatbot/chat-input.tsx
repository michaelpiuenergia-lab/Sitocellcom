"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useChatState, useChatActions } from "./chat-context";

const MAX_CHARS = 1500;
const COUNTER_THRESHOLD = MAX_CHARS - 200;

/**
 * Textarea auto-resize + bottone send.
 *
 * Fix bug review:
 * #20 readOnly invece di disabled (gli screen-reader saltano gli elementi
 *     disabled; readOnly resta navigabile + aria-readonly per spiegare il
 *     motivo). Placeholder + aria-describedby ad uno status sr-only
 *     aria-live polite annuncia "L'assistente sta rispondendo".
 * #24 maxLength HTML nativo + char counter dinamico vicino al limite
 *     (visuale + sr-only aria-live).
 */
export function ChatInput() {
  const { status } = useChatState();
  const { send, cancel } = useChatActions();
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const statusId = useId();
  const counterId = useId();

  const streaming = status === "streaming";

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text || streaming) return;
    send(text);
    setValue("");
    if (taRef.current) taRef.current.style.height = "auto";
  }, [value, streaming, send]);

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value.slice(0, MAX_CHARS);
    setValue(v);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault();
      handleSend();
    }
  }

  const remaining = MAX_CHARS - value.length;
  const showCounter = value.length >= COUNTER_THRESHOLD;

  return (
    <div
      className="shrink-0 px-4 pt-3 pb-4 flex flex-col gap-1.5"
      style={{ borderTop: "1px solid #ececec", backgroundColor: "#ffffff" }}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={taRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={streaming ? "Attendi la risposta…" : "Scrivi un messaggio…"}
          rows={1}
          // #20: readOnly invece di disabled — l'elemento resta in tab order
          // e gli AT lo vedono. La logica di handleSend ignora invii con
          // streaming=true.
          readOnly={streaming}
          aria-readonly={streaming || undefined}
          aria-describedby={`${statusId} ${showCounter ? counterId : ""}`.trim()}
          // #24: limite HTML nativo (blocca anche il paste oltre il cap)
          maxLength={MAX_CHARS}
          className="flex-1 resize-none rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 transition-all"
          style={{
            backgroundColor: streaming ? "#f4f3ee" : "#fafaf8",
            border: "1px solid #ececec",
            fontSize: "14px",
            color: "#0a0a0a",
            lineHeight: 1.5,
            maxHeight: 120,
            minHeight: 40,
          }}
          aria-label="Messaggio"
        />
        {streaming ? (
          <button
            type="button"
            onClick={cancel}
            aria-label="Ferma la risposta"
            className="shrink-0 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#0a0a0a",
              color: "#ffffff",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label="Invia messaggio"
            className="shrink-0 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 hover:shadow-[0_8px_22px_-6px_rgba(220,38,38,0.55)]"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#dc2626",
              color: "#ffffff",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* #20: status invisibile ma annunciato da AT */}
      <span
        id={statusId}
        className="sr-only"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {streaming ? "L'assistente sta rispondendo, attendi prima di scrivere" : ""}
      </span>

      {/* #24: char counter — visivo + aria-live solo sotto soglia */}
      {showCounter && (
        <span
          id={counterId}
          className="font-mono self-end"
          style={{ fontSize: "10px", color: remaining < 50 ? "#b91c1c" : "#737373" }}
          aria-live="polite"
        >
          {remaining} caratteri rimasti
        </span>
      )}
    </div>
  );
}
