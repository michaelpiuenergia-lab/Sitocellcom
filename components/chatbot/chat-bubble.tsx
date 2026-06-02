"use client";

import { Fragment } from "react";
import type { ChatMessage, ChatToolEvent } from "@/lib/chatbot/types";
import { useLang } from "@/lib/i18n/lang-context";

/**
 * Render markdown minimo dei bubble bot: link `[testo](url)` cliccabili,
 * bold `**testo**`, line break. No HTML raw, no XSS — gli href accettati
 * sono solo path relativi (`/...`) o https/http espliciti.
 */
function renderMarkdownLine(text: string, baseKey: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      const safeHref =
        m[2].startsWith("/") ||
        /^https?:\/\//i.test(m[2]) ||
        m[2].startsWith("mailto:") ||
        m[2].startsWith("tel:");
      if (safeHref) {
        const external = /^https?:/i.test(m[2]);
        out.push(
          <a
            key={`${baseKey}-l-${i}`}
            href={m[2]}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            style={{ color: "#dc2626", fontWeight: 600, textDecoration: "underline" }}
          >
            {m[1]}
          </a>,
        );
      } else {
        out.push(`[${m[1]}](${m[2]})`);
      }
    } else if (m[3]) {
      out.push(<strong key={`${baseKey}-b-${i}`}>{m[3]}</strong>);
    } else if (m[4]) {
      out.push(
        <code
          key={`${baseKey}-c-${i}`}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "12.5px",
            backgroundColor: "rgba(0,0,0,0.06)",
            padding: "1px 4px",
            borderRadius: 4,
          }}
        >
          {m[4]}
        </code>,
      );
    }
    last = pattern.lastIndex;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderMarkdown(content: string, baseKey: string): React.ReactNode {
  const lines = content.split("\n");
  return lines.map((line, idx) => (
    <Fragment key={`${baseKey}-${idx}`}>
      {renderMarkdownLine(line, `${baseKey}-${idx}`)}
      {idx < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

/**
 * Bubble singolo: variante user (nero) o bot (off-white con bordo).
 *
 * Fix bug review:
 * #18 aria-busy=true durante streaming → screen-reader sospende l'annuncio
 *     fino al complete (no spam token-per-token); aria-live=polite SOLO sui
 *     bubble completati (assistant).
 * #22 Border #ececec sul bubble bot (era invisibile su sfondo #fafaf8).
 * #1  Badge "Risposta troncata" se msg.truncated=true: avviso UI senza
 *     inquinare il content del messaggio.
 */
export function ChatBubble({ msg }: { msg: ChatMessage }) {
  const { t } = useLang();
  const isUser = msg.role === "user";
  const isStreaming = msg.status === "streaming";
  const isComplete = msg.status === "complete";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className="max-w-[85%] px-3.5 py-2.5 rounded-2xl"
        style={{
          backgroundColor: isUser ? "#0a0a0a" : "#f4f3ee",
          color: isUser ? "#fafafa" : "#0a0a0a",
          border: isUser ? "none" : "1px solid #ececec",
          borderBottomLeftRadius: isUser ? 16 : 4,
          borderBottomRightRadius: isUser ? 4 : 16,
          fontSize: "14px",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        // #18: l'AT annuncia solo quando finito.
        aria-busy={isStreaming ? "true" : "false"}
        aria-live={!isUser && isComplete ? "polite" : undefined}
      >
        {msg.content ? (
          isUser ? (
            // User bubble: testo plain (l'utente non scrive markdown)
            msg.content
          ) : (
            renderMarkdown(msg.content, msg.id)
          )
        ) : isStreaming ? (
          <Caret />
        ) : null}
        {isStreaming && msg.content ? <Caret /> : null}
      </div>

      {!isUser && msg.toolEvents && msg.toolEvents.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1 max-w-[85%]">
          {msg.toolEvents.map((t) => (
            <ToolStatusBubble key={t.id} tool={t} />
          ))}
        </div>
      )}

      {msg.truncated && (
        <span
          className="mt-1 font-mono uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#92400e" }}
        >
          {t("chat.bubble.truncatedBadge")}
        </span>
      )}
      {msg.status === "error" && (
        <span
          className="mt-1 font-mono"
          style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#b91c1c" }}
        >
          {t("chat.bubble.errorBadge")}
        </span>
      )}
      {msg.status === "aborted" && (
        <span
          className="mt-1 font-mono uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}
        >
          {t("chat.bubble.abortedBadge")}
        </span>
      )}
    </div>
  );
}

function ToolStatusBubble({ tool }: { tool: ChatToolEvent }) {
  const { t } = useLang();
  const color =
    tool.status === "error" ? "#b91c1c" : tool.status === "ok" ? "#737373" : "#dc2626";
  // Server manda tool.label in IT (TOOL_LABELS in tools.ts); il client lo
  // sostituisce col label tradotto via dict (chiave chat.toolLabel.<name>).
  // Se la chiave non esiste nel dict, fallback al label server.
  type ToolKey =
    | "chat.toolLabel.searchProducts"
    | "chat.toolLabel.getProductBySlug"
    | "chat.toolLabel.searchUsedDevices"
    | "chat.toolLabel.lookupRepair"
    | "chat.toolLabel.listStores"
    | "chat.toolLabel.openRequestForm"
    | "chat.toolLabel.getHealth";
  const key = `chat.toolLabel.${tool.name}` as ToolKey;
  let label = tool.label;
  try {
    const translated = t(key);
    if (translated && translated !== key) label = translated;
  } catch {
    // chiave fuori dict: usa fallback server
  }
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full"
      style={{
        fontSize: "11px",
        backgroundColor: "#ffffff",
        border: "1px solid #ececec",
        color,
        alignSelf: "flex-start",
      }}
      aria-hidden="true"
    >
      {tool.status === "running" ? <Spinner /> : tool.status === "ok" ? <Check /> : <Bang />}
      <span style={{ color: "#525252" }}>{label}</span>
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 7,
        height: 14,
        verticalAlign: "-2px",
        marginLeft: 2,
        backgroundColor: "currentColor",
        opacity: 0.6,
        animation: "cellcom-chat-caret 1s steps(2, start) infinite",
      }}
    />
  );
}

function Spinner() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "cellcom-chat-spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="#fecaca" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l4 4 10-10" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Bang() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v10" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" fill="#b91c1c" />
    </svg>
  );
}
