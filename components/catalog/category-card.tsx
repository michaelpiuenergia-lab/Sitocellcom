"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Eyebrow } from "@/components/ui/eyebrow";
import { H2 } from "@/components/ui/heading";

type CategoryCardProps = {
  href: string;
  title: string;
  count: number | null;
  description: string;
  delay?: number;
};

export function CategoryCard({
  href,
  title,
  count,
  description,
  delay = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <Link
        href={href}
        className="group relative flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-colors duration-300 hover:border-brand-600/40 hover:bg-card-hover h-full"
      >
        {/* Numero protagonista — grande ma non enorme */}
        <div className="flex flex-col items-start gap-6 p-8 pb-7">
          <Eyebrow>Categoria</Eyebrow>
          {count !== null && (
            <div className="flex items-baseline gap-2.5 leading-none">
              <AnimatedNumber
                value={count}
                duration={1400}
                className="font-serif text-[clamp(40px,5vw,72px)] text-foreground tabular-nums"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                prodotti
              </span>
            </div>
          )}
        </div>

        {/* Footer card */}
        <div className="border-t border-border p-7 flex flex-col gap-3">
          <H2 as="h3" className="text-2xl">
            <span className="italic font-normal">{title}</span>
          </H2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:text-brand-500 transition-colors">
            Esplora{" "}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
