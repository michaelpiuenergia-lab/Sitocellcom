"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatContext } from "./chat-context";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

/**
 * Pannello chat — desktop: 380x600 ancorato bottom-right.
 * Mobile (<sm): full-bleed con margine 8px.
 * Animazione: slide+fade. ESC chiude.
 */
export function ChatPanel() {
  const { isOpen, close } = useChatContext();

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Chat assistenza Cellcom"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
          className="fixed z-40 flex flex-col overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ececec",
            borderRadius: 20,
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.22)",
            // posizionamento adattivo via style + media query nel className
          }}
        >
          {/* Wrap interno per gestire desktop vs mobile via classi */}
          <div className="flex flex-col chat-panel-shell">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </div>

          <style jsx>{`
            div[role="dialog"] {
              right: 12px;
              bottom: 88px;
              width: calc(100vw - 24px);
              max-width: 380px;
              height: min(600px, calc(100vh - 120px));
            }
            @media (min-width: 640px) {
              div[role="dialog"] {
                right: 24px;
                bottom: 96px;
                width: 380px;
                height: 600px;
              }
            }
            .chat-panel-shell {
              height: 100%;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
