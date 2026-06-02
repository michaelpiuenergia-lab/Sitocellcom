"use client";

import { useEffect, useRef } from "react";
import { useChatState } from "./chat-context";
import { ChatBubble } from "./chat-bubble";
import { ChatQuickReplies } from "./chat-quick-replies";
import { useLang } from "@/lib/i18n/lang-context";

/**
 * Scroll container.
 *
 * Fix bug review:
 * #13 + #23 Auto-scroll solo se l'utente è già near-bottom (non gli strappiamo
 *     lo scroll mentre legge in alto). Behavior 'auto' (instant) durante
 *     streaming + rispetto di prefers-reduced-motion.
 * #18 aria-live SOLO sul singolo bubble completato (chat-bubble.tsx), NON
 *     sul container — evita spam vocale dei delta a screen reader.
 */
const NEAR_BOTTOM_THRESHOLD = 96;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ChatMessages() {
  const { messages } = useChatState();
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const wasNearBottomRef = useRef(true);

  // Misura "near bottom" PRIMA del prossimo render layout
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    wasNearBottomRef.current = distance < NEAR_BOTTOM_THRESHOLD;
  });

  useEffect(() => {
    if (!wasNearBottomRef.current) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "auto";
    // Durante streaming usiamo sempre 'auto' (instant) per evitare animazioni
    // concorrenti e motion-sickness; 'smooth' avrebbe senso solo all'arrivo
    // di un messaggio completo, ma in pratica 'auto' è più stabile.
    endRef.current?.scrollIntoView({ behavior, block: "end" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
      style={{ backgroundColor: "#fafaf8" }}
    >
      {/* Welcome bubble statica — non in live-region (è sempre presente) */}
      <div
        className="px-3.5 py-2.5 rounded-2xl self-start max-w-[88%]"
        style={{
          backgroundColor: "#f4f3ee",
          color: "#0a0a0a",
          borderBottomLeftRadius: 4,
          border: "1px solid #ececec",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {t("chat.welcome")}
      </div>

      {messages.length === 0 && <ChatQuickReplies />}

      {/* #18: log con aria-live polite, ma aria-busy=true per il bubble
          in streaming sospende l'annuncio fino al complete (vedi
          ChatBubble) — evita spam token-per-token. */}
      <div role="log" aria-label={t("chat.regionAria")} className="flex flex-col gap-3">
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
      </div>

      <div ref={endRef} />
    </div>
  );
}
