"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/constants";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";
import {
  BoxesIcon,
  GraduationCapIcon,
  RepeatIcon,
  ShoppingBagIcon,
  WrenchIcon,
} from "./service-icons";

/**
 * Il ciclo di vita del telefono: le cinque attività raccontate come un
 * percorso invece che come cinque voci di elenco.
 *
 * Sostituisce la vecchia griglia dei pilastri, che ripeteva in forma estesa
 * gli stessi cinque pulsanti già presenti nell'hero. Qui il punto non è
 * elencare cosa facciamo, ma far vedere che un telefono entra, viene
 * riparato, rivenduto o comprato, e che dietro c'è sempre lo stesso
 * magazzino: è la ragione per cui le cinque attività stanno insieme.
 *
 * La linea si riempie quando la sezione entra nel viewport — una volta sola,
 * niente riavvolgimento allo scroll all'indietro, che darebbe l'idea di un
 * caricamento rotto.
 */

const STAGES: {
  titleKey: keyof Dict;
  bodyKey: keyof Dict;
  ctaKey: keyof Dict;
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  {
    titleKey: "cycle.s1.title",
    bodyKey: "cycle.s1.body",
    ctaKey: "cycle.s1.cta",
    href: "/riparazioni",
    Icon: WrenchIcon,
  },
  {
    titleKey: "cycle.s2.title",
    bodyKey: "cycle.s2.body",
    ctaKey: "cycle.s2.cta",
    href: "/prodotti",
    Icon: ShoppingBagIcon,
  },
  {
    titleKey: "cycle.s3.title",
    bodyKey: "cycle.s3.body",
    ctaKey: "cycle.s3.cta",
    href: "/rivendi",
    Icon: RepeatIcon,
  },
  {
    titleKey: "cycle.s4.title",
    bodyKey: "cycle.s4.body",
    ctaKey: "cycle.s4.cta",
    href: "/corsi",
    Icon: GraduationCapIcon,
  },
  {
    titleKey: "cycle.s5.title",
    bodyKey: "cycle.s5.body",
    ctaKey: "cycle.s5.cta",
    href: "/b2b",
    Icon: BoxesIcon,
  },
];

export function LifecycleTrack() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      aria-label={t("cycle.eyebrow")}
      style={{ backgroundColor: "#fafaf8" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* Intestazione */}
        <div className="max-w-[660px] flex flex-col gap-5 mb-14 lg:mb-16">
          <span
            className="font-mono uppercase inline-flex items-center gap-3"
            style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
          >
            <span
              aria-hidden
              className="inline-block h-px w-9"
              style={{ backgroundColor: "#dc2626" }}
            />
            {t("cycle.eyebrow")}
          </span>
          <h2
            className="font-sans tracking-[-0.025em]"
            style={{
              fontSize: "clamp(30px, 4.2vw, 54px)",
              lineHeight: 1.05,
              color: "#0a0a0a",
              fontWeight: 700,
            }}
          >
            {t("cycle.titleA")}{" "}
            <span style={{ color: "#dc2626" }}>{t("cycle.accent")}</span>
          </h2>
          <p
            className="leading-relaxed"
            style={{ fontSize: "17px", color: "#525252" }}
          >
            {t("cycle.intro")}
          </p>
        </div>

        {/* Percorso */}
        <div className="relative">
          {/*
            Binario e riempimento: solo da lg in su, dove le cinque tappe
            stanno davvero su una riga. Sotto quella soglia la linea
            attraverserebbe il vuoto tra colonne diverse.
           */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-0 right-0"
            style={{ top: "26px", height: "3px", backgroundColor: "#e5e5e5", borderRadius: "3px" }}
          />
          <motion.div
            aria-hidden
            className="hidden lg:block absolute left-0"
            style={{
              top: "26px",
              height: "3px",
              borderRadius: "3px",
              backgroundImage: "linear-gradient(90deg, #dc2626, #f87171)",
              boxShadow: "0 0 16px rgba(220,38,38,0.45)",
              transformOrigin: "left",
            }}
            initial={{ width: 0 }}
            animate={inView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1.6, ease: EASE.smooth }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.href}
                className="relative flex flex-col gap-3 lg:pt-[70px]"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.6,
                  ease: EASE.smooth,
                  delay: 0.15 + i * 0.12,
                }}
              >
                {/* Nodo sul binario (desktop) / pastiglia icona (mobile) */}
                <motion.div
                  className="lg:absolute lg:top-[14px] lg:left-0 flex items-center justify-center shrink-0 rounded-full"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: "#ffffff",
                    border: "3px solid #e5e5e5",
                    color: "#dc2626",
                  }}
                  animate={
                    inView
                      ? {
                          borderColor: "#dc2626",
                          boxShadow:
                            "0 0 0 6px rgba(220,38,38,0.12), 0 0 18px rgba(220,38,38,0.35)",
                        }
                      : {}
                  }
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.22 }}
                >
                  <stage.Icon className="w-[19px] h-[19px]" />
                </motion.div>

                <h3
                  className="font-sans tracking-[-0.02em] mt-1 lg:mt-0"
                  style={{ fontSize: "21px", color: "#0a0a0a", fontWeight: 700 }}
                >
                  {t(stage.titleKey)}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14.5px", color: "#525252" }}
                >
                  {t(stage.bodyKey)}
                </p>
                <Link
                  href={stage.href}
                  className="group inline-flex items-center gap-2 mt-auto pt-2 font-semibold transition-colors"
                  style={{ fontSize: "14px", color: "#dc2626" }}
                >
                  {t(stage.ctaKey)}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
