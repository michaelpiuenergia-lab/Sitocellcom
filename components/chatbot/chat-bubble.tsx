"use client";

import type { ChatMessage, ChatToolEvent } from "@/lib/chatbot/types";

/**
 * Bubble singolo: variante user (nero) o bot (off-white).
 * Le tool-status si rendono come mini-bubble inline (sotto al bubble del bot).
 */
export function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className="max-w-[85%] px-3.5 py-2.5 rounded-2xl"
        style={{
          backgroundColor: isUser ? "#0a0a0a" : "#f4f3ee",
          color: isUser ? "#fafafa" : "#0a0a0a",
          borderBottomLeftRadius: isUser ? 16 : 4,
          borderBottomRightRadius: isUser ? 4 : 16,
          fontSize: "14px",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {msg.content || (msg.status === "streaming" ? <Caret /> : null)}
        {msg.status === "streaming" && msg.content ? <Caret /> : null}
      </div>
      {!isUser && msg.toolEvents && msg.toolEvents.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1 max-w-[85%]">
          {msg.toolEvents.map((t) => (
            <ToolStatusBubble key={t.id} tool={t} />
          ))}
        </div>
      )}
      {msg.status === "error" && (
        <span
          className="mt-1 font-mono"
          style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#b91c1c" }}
        >
          Errore — riprova
        </span>
      )}
      {msg.status === "aborted" && (
        <span
          className="mt-1 font-mono uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}
        >
          Risposta interrotta
        </span>
      )}
    </div>
  );
}

function ToolStatusBubble({ tool }: { tool: ChatToolEvent }) {
  const color =
    tool.status === "error" ? "#b91c1c" : tool.status === "ok" ? "#737373" : "#dc2626";
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
    >
      {tool.status === "running" ? <Spinner /> : tool.status === "ok" ? <Check /> : <Bang />}
      <span style={{ color: "#525252" }}>{tool.label}</span>
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
