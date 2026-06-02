"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatState, useChatActions } from "./chat-context";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

/**
 * Pannello chat — desktop: 380x600 ancorato bottom-right.
 * Mobile (<sm): full-bleed con margine 12px.
 *
 * Fix bug review:
 * #16 Focus management: all'apertura il focus va sull'header (non sulla
 *     textarea: su mobile aprirebbe la tastiera virtuale subito). Alla
 *     chiusura il focus torna sul FAB.
 * #17 role="region" + aria-label invece di role="dialog" aria-modal="false"
 *     senza focus trap (più onesto semanticamente per widget non-modale).
 *     Annuncio "Chat aperta" via span sr-only aria-live=polite.
 * #19 ESC: skip se altro modal sopra (aria-modal=true), skip durante IME
 *     composition, skip se defaultPrevented.
 */
export function ChatPanel() {
  const { isOpen } = useChatState();
  const { close } = useChatActions();
  const headerRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // #16: salva focus precedente all'apertura, ripristina alla chiusura
  useEffect(() => {
    if (isOpen) {
      const active = document.activeElement as HTMLElement | null;
      if (active && active.tagName !== "BODY") restoreFocusRef.current = active;
      // Focus dopo l'animazione di apertura
      const t = setTimeout(() => headerRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else if (restoreFocusRef.current) {
      try {
        restoreFocusRef.current.focus();
      } catch {
        // elemento smontato: ignora
      }
      restoreFocusRef.current = null;
    }
  }, [isOpen]);

  // #19: ESC che rispetta IME, defaultPrevented, modali superiori
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (e.defaultPrevented) return;
      // Composizione IME (cinese/giapponese/coreano, autocorrect mobile)
      if ((e as KeyboardEvent & { isComposing?: boolean }).isComposing) return;
      if (e.keyCode === 229) return;
      // Modale sopra al pannello chat (es. RequestForm aperto da openRequestForm)
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* #17: annuncio apertura per screen reader (montato in DOM solo
              quando isOpen, quindi aria-live polite lo annuncia) */}
          <span
            className="sr-only"
            aria-live="polite"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Chat assistenza aperta
          </span>

          <motion.div
            ref={headerRef}
            // #16: tabIndex=-1 rende il pannello focusabile programmaticamente
            tabIndex={-1}
            // #17: region è semanticamente onesto per widget non-modale
            role="region"
            aria-label="Chat assistenza Cellcom"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
            className="fixed z-40 flex flex-col overflow-hidden chat-panel-anchor focus:outline-none"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ececec",
              borderRadius: 20,
              boxShadow: "0 24px 60px -20px rgba(0,0,0,0.22)",
            }}
          >
            <div className="flex flex-col h-full">
              <ChatHeader />
              <ChatMessages />
              <ChatInput />
            </div>

            <style jsx>{`
              .chat-panel-anchor {
                right: 12px;
                bottom: 88px;
                width: calc(100vw - 24px);
                max-width: 380px;
                height: min(600px, calc(100vh - 120px));
              }
              @media (min-width: 640px) {
                .chat-panel-anchor {
                  right: 24px;
                  bottom: 96px;
                  width: 380px;
                  height: 600px;
                }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
