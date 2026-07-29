"use client";

// Mark Fast-Fix: fulmine bianco su tessera rossa arrotondata.
// Geometria pura (nessun <text>), così il rendering è identico su ogni
// piattaforma e regge anche a 16px come favicon.
// Sorgente statica gemella: public/logo-fast-fix.svg (usata da JSON-LD e OG).

import { motion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-label="Fast-Fix"
      width="32"
      height="32"
    >
      <rect width="100" height="100" rx="22" fill="#dc2626" />
      <motion.path
        d="M58 12 L30 58 h16 l-6 30 L72 42 H54 z"
        fill="#ffffff"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "50px 50px" }}
        transition={{
          duration: DURATION.slow,
          ease: EASE.smooth,
          delay: 0.2,
        }}
      />
    </svg>
  );
}
