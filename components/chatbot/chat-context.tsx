"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useChat, type ChatStatus } from "@/lib/chatbot/use-chat";
import type { ChatMessage } from "@/lib/chatbot/types";

type ChatContextValue = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  send: (text: string) => void;
  cancel: () => void;
  reset: () => void;
};

const Ctx = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo<ChatContextValue>(
    () => ({
      ...chat,
      isOpen,
      open,
      close,
      toggle,
    }),
    [chat, isOpen, open, close, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChatContext deve essere usato dentro <ChatProvider/>");
  return ctx;
}
