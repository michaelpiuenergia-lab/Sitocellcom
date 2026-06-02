"use client";

import { useEffect, useRef } from "react";
import { useChatContext } from "./chat-context";
import { ChatBubble } from "./chat-bubble";
import { ChatQuickReplies } from "./chat-quick-replies";

const WELCOME_TEXT =
  "Ciao — sono l'assistente Cellcom. Cerco prodotti, traccio riparazioni, indico negozi e ti apro la richiesta giusta. Da dove vuoi partire?";

/**
 * Scroll container con auto-scroll al bottom su ogni nuovo delta.
 * Mostra un welcome statico + quick replies finché non c'è history.
 */
export function ChatMessages() {
  const { messages } = useChatContext();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
      style={{ backgroundColor: "#fafaf8" }}
      role="log"
      aria-live="polite"
      aria-label="Conversazione chat"
    >
      <div
        className="px-3.5 py-2.5 rounded-2xl self-start max-w-[88%]"
        style={{
          backgroundColor: "#f4f3ee",
          color: "#0a0a0a",
          borderBottomLeftRadius: 4,
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {WELCOME_TEXT}
      </div>

      {messages.length === 0 && <ChatQuickReplies />}

      {messages.map((m) => (
        <ChatBubble key={m.id} msg={m} />
      ))}

      <div ref={endRef} />
    </div>
  );
}
