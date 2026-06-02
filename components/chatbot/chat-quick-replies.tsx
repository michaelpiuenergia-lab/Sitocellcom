"use client";

import { useChatState, useChatActions } from "./chat-context";

const QUICK_REPLIES = [
  { label: "Compra un telefono", text: "Voglio comprare un telefono" },
  { label: "Mi si è rotto lo schermo", text: "Mi si è rotto lo schermo, come si fa?" },
  { label: "Vendo il mio usato", text: "Vorrei vendere il mio telefono usato" },
  { label: "Sono un rivenditore", text: "Sono un rivenditore, come accedo ai prezzi B2B?" },
];

/**
 * 4 pill iniziali mostrate solo quando non c'è history.
 *
 * Fix bug review #21:
 * - role="group" + aria-label sul container per chiarire scopo agli AT.
 * - Tap target ingrandito (gap-2.5, padding più ampio) per evitare mis-tap
 *   tra "Vendo il mio usato" e "Sono un rivenditore" su mobile.
 */
export function ChatQuickReplies() {
  const { status } = useChatState();
  const { send } = useChatActions();
  const disabled = status === "streaming";

  return (
    <div
      role="group"
      aria-label="Suggerimenti di partenza"
      className="flex flex-wrap gap-2.5 mt-1"
    >
      {QUICK_REPLIES.map((q) => (
        <button
          key={q.label}
          type="button"
          onClick={() => send(q.text)}
          disabled={disabled}
          className="rounded-full px-3.5 py-2 transition-colors disabled:opacity-60 hover:border-[#dc2626] hover:text-[#dc2626]"
          style={{
            border: "1px solid #e5e5e5",
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            fontSize: "12.5px",
            fontWeight: 500,
            minHeight: 36,
          }}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
