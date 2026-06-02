"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useChat, type ChatStatus } from "@/lib/chatbot/use-chat";
import type { ChatMessage } from "@/lib/chatbot/types";

/**
 * Due context separati per non riscrivere TUTTI i consumer ad ogni delta SSE:
 * - StateCtx: messages + status + error + isOpen (cambia ad ogni token)
 * - ActionsCtx: send + cancel + reset + open + close + toggle (identità stabili)
 *
 * Fix bug review #15: ChatInput/ChatFab/ChatHeader consumano solo le azioni
 * o lo stato che gli serve. Una textarea controllata non re-renderizza più
 * ad ogni token dell'assistente.
 */

type ChatState = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  isOpen: boolean;
};

type ChatActions = {
  send: (text: string) => void;
  cancel: () => void;
  reset: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const StateCtx = createContext<ChatState | null>(null);
const ActionsCtx = createContext<ChatActions | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const state = useMemo<ChatState>(
    () => ({
      messages: chat.messages,
      status: chat.status,
      error: chat.error,
      isOpen,
    }),
    [chat.messages, chat.status, chat.error, isOpen],
  );

  const actions = useMemo<ChatActions>(
    () => ({
      send: chat.send,
      cancel: chat.cancel,
      reset: chat.reset,
      open,
      close,
      toggle,
    }),
    [chat.send, chat.cancel, chat.reset, open, close, toggle],
  );

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useChatState(): ChatState {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useChatState deve essere usato dentro <ChatProvider/>");
  return ctx;
}

export function useChatActions(): ChatActions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error("useChatActions deve essere usato dentro <ChatProvider/>");
  return ctx;
}

/**
 * Helper legacy che restituisce stato+azioni combinati. Da usare solo dove
 * davvero servono entrambi (raro). I componenti che leggono solo stato o
 * solo azioni devono usare gli hook specifici per evitare re-render.
 */
export function useChatContext() {
  const state = useChatState();
  const actions = useChatActions();
  return { ...state, ...actions };
}
