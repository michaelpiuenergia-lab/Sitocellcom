"use client";

// TODO: sostituire con SVG ufficiale Cellcom (file vettoriale
//       in arrivo dal cliente). Mantenere stessa viewBox 100x100
//       e stroke-dasharray per compatibilità con l'animazione esistente.

import { motion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";

export function LogoC({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-label="Cellcom"
      width="32"
      height="32"
    >
      <motion.path
        d="M 80,25 A 30,30 0 1,0 80,75"
        fill="none"
        stroke="#dc2626"
        strokeWidth="18"
        strokeLinecap="round"
        initial={{ strokeDasharray: 280, strokeDashoffset: 280 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: DURATION.cinematic,
          ease: EASE.smooth,
          delay: 0.3,
        }}
      />
    </svg>
  );
}
