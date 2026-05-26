"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { EASE } from "@/lib/constants";

type Tone = "light" | "dark";

type Pillar = {
  tone: Tone;
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: readonly string[];
  cta: { label: string; href: string };
};

const PILLARS: readonly Pillar[] = [
  {
    tone: "light",
    eyebrow: "Compra",
    title: (
      <>
        Il prossimo telefono.{" "}
        <span style={{ color: "#dc2626" }}>Anche ricondizionato.</span>
      </>
    ),
    body:
      "Nuovi, ricondizionati e usati testati. Tutti i brand, un solo magazzino, garanzia 12 mesi su tutto.",
    bullets: [
      "Spedizione 24-48h in Italia",
      "Ritiro gratis nei negozi",
      "Rate Klarna/Scalapay disponibili",
    ],
    cta: { label: "Sfoglia il catalogo", href: "/prodotti" },
  },
  {
    tone: "dark",
    eyebrow: "Ripara",
    title: (
      <>
        Quasi tutto si ripara,{" "}
        <span style={{ color: "#dc2626" }}>e in 24 ore.</span>
      </>
    ),
    body:
      "Schermo, batteria, scheda madre, scocca. Diagnosi gratuita, preventivo prima di toccarlo, sigillo davanti a te.",
    bullets: [
      "Garanzia 12 mesi su lavoro e ricambi",
      "Microsaldatura BGA in laboratorio",
      "Ritiro, spedizione o negozio",
    ],
    cta: { label: "Richiedi riparazione", href: "/riparazioni" },
  },
  {
    tone: "dark",
    eyebrow: "Rivendi",
    title: (
      <>
        Il tuo vecchio telefono{" "}
        <span style={{ color: "#dc2626" }}>vale ancora.</span>
      </>
    ),
    body:
      "Valutazione gratis dalle foto in 24 ore. Spedizione o ritiro gratis, pagamento entro 48 ore.",
    bullets: [
      "Bonus +10% in credito Cellcom",
      "Quotazione scritta, niente trucchi",
      "Ritiriamo anche telefoni rotti",
    ],
    cta: { label: "Valuta il tuo usato", href: "/rivendi" },
  },
  {
    tone: "light",
    eyebrow: "Impara",
    title: (
      <>
        Diventa{" "}
        <span style={{ color: "#dc2626" }}>tecnico riparatore.</span>
      </>
    ),
    body:
      "Tre livelli alla SmartphoneFix Academy: base, intermedio, microsaldatura BGA. Gli stessi formatori dei nostri tecnici.",
    bullets: [
      "Postazioni ESD professionali",
      "Aule limitate a 6 allievi",
      "Attestato + sbocco interno",
    ],
    cta: { label: "Scopri i corsi", href: "/corsi" },
  },
];

export function PillarsGrid() {
  return (
    <section
      aria-label="Quattro modi di toccare un telefono"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE.drift }}
            className="flex flex-col gap-5"
          >
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: "#dc2626",
              }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              Phone lifecycle hub
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(36px, 4.8vw, 64px)",
                lineHeight: 1.04,
                color: "#0a0a0a",
                fontWeight: 700,
              }}
            >
              Quattro cose,{" "}
              <span style={{ color: "#dc2626" }}>un solo posto.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE.drift, delay: 0.15 }}
            className="leading-relaxed"
            style={{
              fontSize: "17px",
              color: "#525252",
              maxWidth: "520px",
            }}
          >
            Compri, ripari, rivendi, impari. Stesso magazzino, stesse persone,
            stessa garanzia.
          </motion.p>
        </div>

        {/* Griglia 2×2: scacchiera tone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.eyebrow} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const isDark = pillar.tone === "dark";
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 130, damping: 22 });
  const smoothY = useSpring(my, { stiffness: 130, damping: 22 });
  const sx = useTransform(smoothX, (v) => `${v * 100}%`);
  const sy = useTransform(smoothY, (v) => `${v * 100}%`);

  // Fanale rosso INTENSO solo sui pannelli dark.
  const spotlight = useTransform([sx, sy], (latest) => {
    const [x, y] = latest as [string, string];
    return `radial-gradient(circle 520px at ${x} ${y}, rgba(220,38,38,0.42) 0%, rgba(220,38,38,0.16) 30%, rgba(220,38,38,0.04) 55%, transparent 75%)`;
  });

  function onPointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (!isDark) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  const bg = isDark ? "#0a0a0a" : "#fafaf8";
  const surfaceBorder = isDark ? "#1f1f1f" : "#ececec";
  const titleColor = isDark ? "#fafafa" : "#0a0a0a";
  const bodyColor = isDark ? "#a3a3a3" : "#525252";
  const bulletColor = isDark ? "#d4d4d4" : "#404040";
  const eyebrowChipBg = isDark ? "rgba(220,38,38,0.14)" : "#fef2f2";

  return (
    <motion.a
      ref={ref}
      href={pillar.cta.href}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        ease: EASE.drift,
        delay: 0.08 * index,
      }}
      className="group relative overflow-hidden rounded-3xl block transition-colors duration-300"
      style={{
        backgroundColor: bg,
        border: `1px solid ${surfaceBorder}`,
        minHeight: "320px",
      }}
    >
      {/* fanale rosso solo se dark */}
      {isDark && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative h-full flex flex-col gap-5 sm:gap-6 p-7 sm:p-9 lg:p-12">
        <span
          className="font-mono uppercase self-start px-2.5 py-1 rounded-md"
          style={{
            fontSize: "11px",
            letterSpacing: "0.28em",
            backgroundColor: eyebrowChipBg,
            color: "#dc2626",
          }}
        >
          {pillar.eyebrow}
        </span>

        <h3
          className="font-sans tracking-[-0.02em] max-w-md"
          style={{
            fontSize: "clamp(26px, 2.6vw, 36px)",
            lineHeight: 1.1,
            color: titleColor,
            fontWeight: 700,
          }}
        >
          {pillar.title}
        </h3>

        <p
          className="leading-relaxed max-w-md"
          style={{
            color: bodyColor,
            fontSize: "16px",
          }}
        >
          {pillar.body}
        </p>

        <ul className="flex flex-col gap-2.5 mt-1">
          {pillar.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3"
              style={{ color: bulletColor }}
            >
              <span
                aria-hidden
                className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#dc2626" }}
              />
              <span style={{ fontSize: "14px", lineHeight: 1.5 }}>{b}</span>
            </li>
          ))}
        </ul>

        <span
          className="mt-auto inline-flex items-center gap-2 pt-5 font-medium"
          style={{
            color: "#dc2626",
            fontSize: "15px",
          }}
        >
          {pillar.cta.label}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </motion.a>
  );
}
