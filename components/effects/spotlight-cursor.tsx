"use client";

import { useEffect, useState } from "react";

/**
 * Spotlight cursor: aggiunge una "torcia" rubino che segue il mouse e
 * illumina la pagina nel punto in cui stai guardando.
 *
 * - position: fixed full-screen, mix-blend-mode: screen → luce additiva
 *   (più chiara la zona toccata, non sostituisce il colore sotto)
 * - z-index sopra agli ambient lights body::before/::after, sotto al
 *   contenuto interagibile (è pointer-events: none comunque)
 * - disattivato su touch device e su prefers-reduced-motion
 * - update via rAF throttle, niente re-render React eccessivi
 */
export function SpotlightCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    setEnabled(true);
    let raf = 0;
    let next = { x: -1000, y: -1000 };

    const onMove = (e: MouseEvent) => {
      next = { x: e.clientX, y: e.clientY };
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setPos(next);
          raf = 0;
        });
      }
    };

    const onLeave = () => setPos({ x: -1000, y: -1000 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] transition-opacity duration-300"
      style={{
        background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(239,68,68,0.20) 0%, rgba(220,38,38,0.10) 25%, transparent 65%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}
