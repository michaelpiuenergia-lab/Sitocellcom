"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";
import Link from "next/link";
import { RequestTrigger } from "@/components/forms/request-trigger";

const OPTIONS = [
  {
    eyebrow: "Opzione 1",
    title: "Portacelo in negozio",
    text: "Vieni in uno dei punti vendita del Gruppo. Diagnosi sul momento se è disponibile un tecnico, altrimenti ricevuta e chiamata entro 24h con preventivo.",
    cta: { label: "Trova negozio più vicino", href: "/negozi" } as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    eyebrow: "Opzione 2",
    title: "Spediscilo a noi",
    text: "Niente negozio vicino? Ti mandiamo il kit di spedizione assicurata: imbusti, lasci al corriere, te lo rispediamo gratis a riparazione conclusa.",
    cta: { label: "Richiedi kit di spedizione", kind: "repair" as const } as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    eyebrow: "Opzione 3",
    title: "Lo veniamo a prendere",
    text: "Solo in alcune zone (San Benedetto del Tronto e provincia, principali città di Marche e Abruzzo su richiesta). Passiamo a ritirare, riportiamo riparato. Disponibile sopra una soglia minima.",
    cta: { label: "Verifica la tua zona", kind: "repair" as const } as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export function IntakeOptions() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      aria-label="Modalità di intake"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
          <div className="flex flex-col gap-5">
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
              Come ce lo fai arrivare
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(32px, 4.2vw, 56px)",
                lineHeight: 1.05,
                color: "#fafafa",
                fontWeight: 700,
              }}
            >
              Tre modi per <span style={{ color: "#dc2626" }}>portarcelo</span> — scegli il più comodo.
            </h2>
          </div>
          <p
            className="leading-relaxed"
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
          >
            Non vendiamo solo nei negozi fisici: lavoriamo in tutta Italia.
            Qualunque opzione scegli, il telefono entra nel nostro gestionale
            e segui lo stato in tempo reale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {OPTIONS.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: DURATION.normal,
                ease: EASE.smooth,
                delay: i * 0.08,
              }}
              className="rounded-2xl p-7 lg:p-8 flex flex-col gap-5 transition-colors duration-300 hover:border-[#dc2626]"
              style={{
                backgroundColor: "#141414",
                border: "1px solid #1f1f1f",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(220,38,38,0.12)",
                  color: "#f87171",
                }}
              >
                {opt.icon}
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    color: "#737373",
                  }}
                >
                  {opt.eyebrow}
                </span>
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "19px",
                    letterSpacing: "-0.015em",
                    color: "#fafafa",
                    fontWeight: 600,
                  }}
                >
                  {opt.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14px", color: "#a3a3a3" }}
                >
                  {opt.text}
                </p>
              </div>
              <div className="mt-3">
                {"href" in opt.cta ? (
                  <Link
                    href={opt.cta.href as string}
                    className="group inline-flex items-center gap-2 transition-colors"
                    style={{
                      color: "#dc2626",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {opt.cta.label}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                ) : (
                  <RequestTrigger
                    kind={opt.cta.kind}
                    label={opt.cta.label}
                    variant="outline"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
