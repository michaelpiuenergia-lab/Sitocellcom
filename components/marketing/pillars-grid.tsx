"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE } from "@/lib/constants";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";

/** true se il device usa solo input touch (no mouse): allora niente spotlight. */
function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setTouch(mq.matches);
    const cb = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return touch;
}

type Tone = "light" | "dark";

type PillarKeys = {
  tone: Tone;
  href: string;
  eyebrow: keyof Dict;
  titleA: keyof Dict;
  accent: keyof Dict;
  body: keyof Dict;
  bullets: readonly (keyof Dict)[];
  cta: keyof Dict;
};

const PILLARS: readonly PillarKeys[] = [
  {
    tone: "light",
    href: "/prodotti",
    eyebrow: "pillars.buy.eyebrow",
    titleA: "pillars.buy.titleA",
    accent: "pillars.buy.accent",
    body: "pillars.buy.body",
    bullets: ["pillars.buy.b1", "pillars.buy.b2", "pillars.buy.b3"],
    cta: "pillars.buy.cta",
  },
  {
    tone: "dark",
    href: "/riparazioni",
    eyebrow: "pillars.repair.eyebrow",
    titleA: "pillars.repair.titleA",
    accent: "pillars.repair.accent",
    body: "pillars.repair.body",
    bullets: ["pillars.repair.b1", "pillars.repair.b2", "pillars.repair.b3"],
    cta: "pillars.repair.cta",
  },
  {
    tone: "dark",
    href: "/rivendi",
    eyebrow: "pillars.resell.eyebrow",
    titleA: "pillars.resell.titleA",
    accent: "pillars.resell.accent",
    body: "pillars.resell.body",
    bullets: ["pillars.resell.b1", "pillars.resell.b2", "pillars.resell.b3"],
    cta: "pillars.resell.cta",
  },
  {
    tone: "light",
    href: "/corsi",
    eyebrow: "pillars.learn.eyebrow",
    titleA: "pillars.learn.titleA",
    accent: "pillars.learn.accent",
    body: "pillars.learn.body",
    bullets: ["pillars.learn.b1", "pillars.learn.b2", "pillars.learn.b3"],
    cta: "pillars.learn.cta",
  },
];

export function PillarsGrid() {
  const { t } = useLang();
  return (
    <section
      aria-label={t("pillars.section.eyebrow")}
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
              {t("pillars.section.eyebrow")}
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
              {t("pillars.section.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("pillars.section.accent")}</span>
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
            {t("pillars.section.intro")}
          </motion.p>
        </div>

        {/* Griglia 2×2: scacchiera tone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.href} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: PillarKeys; index: number }) {
  const { t } = useLang();
  const isDark = pillar.tone === "dark";
  const isTouch = useIsTouch();
  const spotlightActive = isDark && !isTouch;
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
    if (!spotlightActive) return;
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
      href={pillar.href}
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
      {/* fanale rosso solo se dark + non touch */}
      {spotlightActive && (
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
          {t(pillar.eyebrow)}
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
          {t(pillar.titleA)}{" "}
          <span style={{ color: "#dc2626" }}>{t(pillar.accent)}</span>
        </h3>

        <p
          className="leading-relaxed max-w-md"
          style={{
            color: bodyColor,
            fontSize: "16px",
          }}
        >
          {t(pillar.body)}
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
              <span style={{ fontSize: "14px", lineHeight: 1.5 }}>{t(b)}</span>
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
          {t(pillar.cta)}
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
