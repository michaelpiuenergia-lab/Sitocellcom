"use client";

import { useChatContext } from "./chat-context";

const QUICK_REPLIES = [
  { label: "Compra un telefono", text: "Voglio comprare un telefono" },
  { label: "Mi si è rotto lo schermo", text: "Mi si è rotto lo schermo, come si fa?" },
  { label: "Vendo il mio usato", text: "Vorrei vendere il mio telefono usato" },
  { label: "Sono un rivenditore", text: "Sono un rivenditore, come accedo ai prezzi B2B?" },
];

/**
 * 4 pill iniziali mostrate solo quando non c'è ancora history.
 * Click → invia il testo associato.
 */
export function ChatQuickReplies() {
  const { send, status } = useChatContext();
  const disabled = status === "streaming";

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {QUICK_REPLIES.map((q) => (
        <button
          key={q.label}
          type="button"
          onClick={() => send(q.text)}
          disabled={disabled}
          className="rounded-full px-3 py-1.5 transition-colors disabled:opacity-60"
          style={{
            border: "1px solid #e5e5e5",
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
