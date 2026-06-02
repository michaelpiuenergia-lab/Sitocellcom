"use client";

import { LogoC } from "@/components/marketing/logo-c";
import { useChatState, useChatActions } from "./chat-context";
import { useLang } from "@/lib/i18n/lang-context";

/**
 * Header del pannello chat: logo + wordmark + mono trust line + close.
 * Stile FastFix: linea rossa accent + label monospace.
 */
export function ChatHeader() {
  const { status } = useChatState();
  const { close } = useChatActions();
  const { t } = useLang();

  return (
    <header
      className="flex items-center gap-3 px-5 h-16 shrink-0"
      style={{ borderBottom: "1px solid #ececec", backgroundColor: "#ffffff" }}
    >
      <LogoC className="w-6 h-6 shrink-0" />
      <div className="flex flex-col min-w-0">
        <span
          className="font-sans"
          style={{ fontSize: "14px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}
        >
          {t("chat.header.title")}
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "9.5px", letterSpacing: "0.24em", color: "#737373" }}
          aria-live="polite"
        >
          {status === "streaming"
            ? t("chat.header.statusStreaming")
            : t("chat.header.statusOnline")}
        </span>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label={t("chat.header.closeAria")}
        className="ml-auto flex items-center justify-center rounded-full transition-colors hover:bg-[#f4f3ee]"
        style={{ width: 32, height: 32, color: "#525252" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}
