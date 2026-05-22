"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LogoC } from "./logo-c";
import { CubeCarousel } from "./cube-carousel";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EASE, DURATION } from "@/lib/constants";
import type { PublicProductListItem } from "@/lib/crm-client/types";

const words = [
  { text: "Il", italic: false },
  { text: "telefono", italic: false },
  { text: "ha", italic: false },
  { text: "una", italic: false },
  { text: "casa", italic: true },
  { text: "per", italic: false },
  { text: "tutta", italic: true },
  { text: "la vita.", italic: true },
];

export function Hero({ devices = [] }: { devices?: PublicProductListItem[] }) {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.1,
        delayChildren: shouldReduce ? 0 : 0.8,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.slow,
        ease: EASE.drift,
      },
    },
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 px-6 lg:px-16 pt-32 pb-20 max-w-[1600px] mx-auto">
      {/* Left column */}
      <div className="flex flex-col gap-8 items-start text-center lg:text-left flex-1 max-w-xl">
        <motion.span
          className="font-mono text-xs text-brand-500 uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: 0.6 }}
        >
          <span className="text-brand-600">◢</span> Phone Lifecycle Hub
        </motion.span>

        <motion.h1
          className="font-serif text-[clamp(48px,6vw,84px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className={`inline-block mr-[0.25em] ${w.italic ? "italic text-brand-500" : ""}`}
            >
              {w.text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground leading-relaxed max-w-[460px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: 1.7 }}
        >
          Compra, ripara, impara, rivendi. Un solo gruppo, cinque brand, oltre 20.000 prodotti — dal primo giorno fino al riciclo.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: 1.9 }}
        >
          <MagneticButton variant="primary" href="/prodotti" className="group">
            Esplora il catalogo
            <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1">→</span>
          </MagneticButton>
          <MagneticButton variant="ghost" href="/riparazioni">
            Traccia riparazione
          </MagneticButton>
        </motion.div>
      </div>

      {/* Right column — Cube carousel con i 6 telefoni veri che ruotano */}
      <motion.div
        className="flex-1 w-full flex items-center justify-center min-h-[500px] lg:min-h-[700px] relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE.smooth, delay: 0.4 }}
      >
        <CubeCarousel devices={devices} />
      </motion.div>
    </section>
  );
}
