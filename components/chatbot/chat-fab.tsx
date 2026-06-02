"use client";

import { motion } from "framer-motion";
import { useChatState, useChatActions } from "./chat-context";

/**
 * Bottone fluttuante 56x56 in basso a destra. Rosso brand-600, icona che
 * ruota in X all'apertura. Badge unread (futuro). z-index alto ma sotto
 * il modal RequestForm.
 */
export function ChatFab() {
  const { isOpen } = useChatState();
  const { toggle } = useChatActions();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Chiudi chat assistenza" : "Apri chat assistenza"}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 rounded-full shadow-[0_8px_28px_-8px_rgba(220,38,38,0.55)] transition-shadow duration-300 hover:shadow-[0_14px_36px_-10px_rgba(220,38,38,0.7)]"
      style={{
        width: 56,
        height: 56,
        backgroundColor: "#dc2626",
        color: "#ffffff",
      }}
    >
      <motion.span
        className="block w-full h-full flex items-center justify-center"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        aria-hidden
      >
        {isOpen ? <CloseIcon /> : <BubbleIcon />}
      </motion.span>
    </button>
  );
}

function BubbleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H9l-3.5 3v-3h-.5C4.67 16 4 15.33 4 14.5v-9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
