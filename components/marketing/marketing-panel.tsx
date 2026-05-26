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

type Feature = {
  title: string;
  body: string;
};

type MarketingPanelProps = {
  tone: Tone;
  eyebrow: string;
  /** Titolo principale; usa <Accent>parola</Accent> per evidenziare in rosso */
  title: ReactNode;
  /** Paragrafo introduttivo sotto il titolo */
  intro: ReactNode;
  /** 3 micro-feature in fila sotto */
  features?: readonly Feature[];
  /** CTA primaria a pillola rossa */
  primaryCta: { label: string; href: string };
  /** CTA secondaria testuale */
  secondaryCta?: { label: string; href: string };
  /** Slot opzionale (es. riga stats) */
  extra?: ReactNode;
};

const COLORS = {
  light: {
    bg: "#ffffff",
    surface: "#fafaf8",
    surfaceBorder: "#ececec",
    title: "#0a0a0a",
    body: "#525252",
    softText: "#737373",
    chipBg: "#fef2f2",
    chipText: "#dc2626",
    eyebrow: "#dc2626",
  },
  dark: {
    bg: "#0a0a0a",
    surface: "#141414",
    surfaceBorder: "#1f1f1f",
    title: "#fafafa",
    body: "#a3a3a3",
    softText: "#737373",
    chipBg: "rgba(220,38,38,0.12)",
    chipText: "#f87171",
    eyebrow: "#dc2626",
  },
} as const;

/**
 * MarketingPanel — pannello FastFix-style con accenti nero/bianco/rosso.
 *
 * Layout: header (eyebrow + titolo grosso + body), griglia 3 micro-feature
 * card bordo sottile, CTA rosso a pillola + link secondario. Su pannello
 * dark il fanale rosso segue il mouse sullo sfondo.
 */
export function MarketingPanel({
  tone,
  eyebrow,
  title,
  intro,
  features,
  primaryCta,
  secondaryCta,
  extra,
}: MarketingPanelProps) {
  const c = COLORS[tone];
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 110, damping: 26 });
  const smoothY = useSpring(my, { stiffness: 110, damping: 26 });
  const sx = useTransform(smoothX, (v) => `${v * 100}%`);
  const sy = useTransform(smoothY, (v) => `${v * 100}%`);
  const spotlight = useTransform([sx, sy], (latest) => {
    const [x, y] = latest as [string, string];
    return `radial-gradient(circle 780px at ${x} ${y}, rgba(220,38,38,0.45) 0%, rgba(220,38,38,0.16) 32%, rgba(220,38,38,0.04) 55%, transparent 75%)`;
  });
  // Fanale rosso SOLO sui pannelli neri.
  const spotlightOn = tone === "dark";

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!spotlightOn) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative overflow-hidden"
      style={{ backgroundColor: c.bg }}
    >
      {spotlightOn && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header: due colonne — intro a sinistra, paragrafo a destra */}
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14 lg:mb-20">
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
                color: c.eyebrow,
              }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              {eyebrow}
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(36px, 4.8vw, 64px)",
                lineHeight: 1.04,
                color: c.title,
                fontWeight: 700,
              }}
            >
              {title}
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
              color: c.body,
              maxWidth: "560px",
            }}
          >
            {intro}
          </motion.p>
        </div>

        {/* 3 feature cards FastFix-style: bordo sottile, padding generoso */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-12 lg:mb-16">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  ease: EASE.drift,
                  delay: 0.1 + i * 0.08,
                }}
                className="rounded-2xl p-7 flex flex-col gap-3 transition-colors duration-300 hover:border-[#dc2626]"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.surfaceBorder}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono tabular-nums px-2.5 py-1 rounded-md"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      backgroundColor: c.chipBg,
                      color: c.chipText,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-sans"
                    style={{
                      fontSize: "17px",
                      letterSpacing: "-0.01em",
                      color: c.title,
                      fontWeight: 600,
                    }}
                  >
                    {f.title}
                  </h3>
                </div>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "14px",
                    color: c.body,
                  }}
                >
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {extra && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: EASE.drift, delay: 0.3 }}
            className="mb-12 lg:mb-16"
          >
            {extra}
          </motion.div>
        )}

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE.drift, delay: 0.4 }}
          className="flex flex-wrap items-center gap-x-7 gap-y-4"
        >
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)]"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {primaryCta.label}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="group inline-flex items-center gap-2"
              style={{
                color: c.title,
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {secondaryCta.label}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: "#dc2626" }}
              >
                →
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span style={{ color: "#dc2626" }}>{children}</span>;
}

export function PanelStat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: Tone;
}) {
  const c = COLORS[tone];
  return (
    <div
      className="flex flex-col gap-1.5 rounded-2xl p-7"
      style={{
        backgroundColor: c.surface,
        border: `1px solid ${c.surfaceBorder}`,
      }}
    >
      <span
        className="font-sans tabular-nums leading-none"
        style={{
          fontSize: "clamp(36px, 4vw, 56px)",
          letterSpacing: "-0.025em",
          color: c.title,
          fontWeight: 700,
        }}
      >
        {value}
      </span>
      <span
        className="font-sans font-medium mt-1"
        style={{
          fontSize: "13px",
          color: c.body,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
