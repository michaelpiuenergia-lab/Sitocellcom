"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Counter "count-up" che parte da 0 al primo ingresso in viewport.
 *
 * Accetta sia numeri puri (57, 1157) sia stringhe con prefisso/suffisso
 * (es. "1.2K+", "24-48h"). Per le stringhe estrae il primo gruppo numerico
 * e lo anima, mantenendo il resto del template invariato.
 */
export function AnimatedNumber({
  value,
  duration = 1400,
  className,
}: {
  value: string | number;
  duration?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(
    shouldReduce ? String(value) : prefillZero(String(value)),
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (shouldReduce || startedRef.current) {
      setDisplay(String(value));
      return;
    }

    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            io.disconnect();
            runCountUp(String(value), duration, setDisplay);
            return;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value, duration, shouldReduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function prefillZero(raw: string): string {
  const match = raw.match(/^(\D*)(\d[\d.,]*)(.*)$/);
  if (!match) return raw;
  const [, prefix, num, suffix] = match;
  // Sostituisce le cifre con 0, mantiene separatori decimali/migliaia
  const zeroed = num.replace(/\d/g, "0");
  return `${prefix}${zeroed}${suffix}`;
}

function runCountUp(
  raw: string,
  duration: number,
  setDisplay: (s: string) => void,
) {
  const match = raw.match(/^(\D*)(\d[\d.,]*)(.*)$/);
  if (!match) {
    setDisplay(raw);
    return;
  }
  const [, prefix, numStr, suffix] = match;

  // Normalizza per il calcolo numerico: rimuove punti migliaia it (1.157 → 1157)
  // e converte virgola decimale in punto se presente.
  const hasDecimalComma = /,\d+$/.test(numStr);
  const clean = hasDecimalComma
    ? numStr.replace(/\./g, "").replace(",", ".")
    : numStr.replace(/[.,]/g, "");
  const target = parseFloat(clean);
  if (Number.isNaN(target)) {
    setDisplay(raw);
    return;
  }

  const startTime = performance.now();
  const startVal = 0;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const current = startVal + (target - startVal) * eased;

    let rendered: string;
    if (hasDecimalComma) {
      rendered = current.toFixed(1).replace(".", ",");
    } else {
      rendered = Math.round(current).toLocaleString("it-IT");
    }

    setDisplay(`${prefix}${rendered}${suffix}`);

    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
