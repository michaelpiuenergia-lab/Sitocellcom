"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";
import { AnimatedNumber } from "@/components/ui/animated-number";

/**
 * Strip "Numeri" sotto l'Hero. Comunica scala + credibilità prima di
 * spiegare i servizi. I numeri sono passati dal Server Component padre
 * (vivono in props per essere refreshati dal CRM).
 */
export type StatItem = {
  value: string; // es. "1.157", "20K+", "5"
  label: string; // es. "Ricambi a magazzino"
  hint?: string; // es. "aggiornati ogni 60 s"
};

export function StatsStrip({ stats }: { stats: StatItem[] }) {
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative border-y border-border bg-card/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduce ? 0 : 0.08,
              },
            },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: DURATION.slow, ease: EASE.drift },
                },
              }}
              className="relative flex flex-col items-start gap-1"
            >
              {i > 0 && (
                <span className="hidden md:block absolute -left-3 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-brand-600/30 to-transparent" />
              )}
              <AnimatedNumber
                value={stat.value}
                duration={1400 + i * 120}
                className="font-serif text-[clamp(36px,4vw,56px)] leading-none font-normal text-brand-500 tabular-nums"
              />
              <span className="font-sans text-sm font-medium text-foreground">
                {stat.label}
              </span>
              {stat.hint && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {stat.hint}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
