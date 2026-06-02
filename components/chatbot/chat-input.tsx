"use client";

import { useCallback, useRef, useState } from "react";
import { useChatContext } from "./chat-context";

const MAX_CHARS = 1500;

/**
 * Textarea auto-resize + bottone send (cerchio rosso brand-600 con freccia).
 * Enter invia, Shift+Enter va a capo. Disabled durante streaming.
 */
export function ChatInput() {
  const { send, status, cancel } = useChatContext();
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const disabled = status === "streaming";

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    send(text);
    setValue("");
    if (taRef.current) taRef.current.style.height = "auto";
  }, [value, disabled, send]);

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value.slice(0, MAX_CHARS);
    setValue(v);
    // auto-resize
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="shrink-0 px-4 pt-3 pb-4 flex items-end gap-2"
      style={{ borderTop: "1px solid #ececec", backgroundColor: "#ffffff" }}
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={disabled ? "Sto rispondendo…" : "Scrivi un messaggio…"}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 transition-all"
        style={{
          backgroundColor: "#fafaf8",
          border: "1px solid #ececec",
          fontSize: "14px",
          color: "#0a0a0a",
          lineHeight: 1.5,
          maxHeight: 120,
          minHeight: 40,
        }}
        aria-label="Messaggio"
      />
      {disabled ? (
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
  );
}
