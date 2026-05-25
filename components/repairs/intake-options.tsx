"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";
import { RequestTrigger } from "@/components/forms/request-trigger";

/**
 * Tre modi per farci arrivare il telefono. Spiega chiaramente al cliente
 * cosa deve fare in pratica: portarlo in negozio, spedirlo, farselo ritirare.
 */

const OPTIONS = [
  {
    eyebrow: "Opzione 1",
    title: "Portacelo in negozio",
    text: "Vieni in uno dei punti vendita del Gruppo. Diagnosi sul momento se è disponibile un tecnico, altrimenti ti rilasciamo ricevuta e ti chiamiamo entro 24h con il preventivo.",
    cta: { label: "Trova negozio più vicino", href: "/negozi" },
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    eyebrow: "Opzione 2",
    title: "Spediscilo a noi",
    text: "Se non hai un negozio vicino, ti mandiamo via email il modulo di spedizione assicurata: imbusti il telefono nel kit, lo lasci al corriere, te lo rispediamo gratis a riparazione conclusa.",
    cta: { label: "Richiedi kit di spedizione", kind: "repair" as const },
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    text: "Solo in alcune zone (Parma e provincia, principali città italiane su richiesta): un nostro incaricato passa a ritirare il telefono, te lo riporta riparato. Disponibile per riparazioni sopra una soglia minima.",
    cta: { label: "Verifica la tua zona", kind: "repair" as const },
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export function IntakeOptions() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20">
      <div className="flex flex-col gap-3 mb-12 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
          <span className="text-brand-600">◢</span> Come ce lo fai arrivare
        </span>
        <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.02em] text-foreground">
          Tre modi per <span className="italic shimmer-ruby">portarcelo</span> — scegli il più comodo.
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Non vendiamo solo nei negozi fisici: lavoriamo in tutta Italia.
          Qualunque opzione scegli, il telefono entra nel nostro gestionale e
          puoi seguirne lo stato in tempo reale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPTIONS.map((opt, i) => (
          <motion.div
            key={opt.title}
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: DURATION.normal,
              ease: EASE.smooth,
              delay: i * 0.08,
            }}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/30 hover:shadow-[0_12px_36px_-16px_rgba(220,38,38,0.30)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl border border-border bg-popover text-brand-500 group-hover:text-brand-400 group-hover:border-brand-600/30 transition-colors flex items-center justify-center">
              {opt.icon}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {opt.eyebrow}
              </span>
              <h3 className="font-serif italic text-2xl text-foreground">
                {opt.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opt.text}
              </p>
            </div>
            <div className="mt-2">
              {"href" in opt.cta && opt.cta.href ? (
                <a
                  href={opt.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-400"
                >
                  {opt.cta.label}
                  <span aria-hidden className="transition-transform duration-300 ease-snappy group-hover:translate-x-1">→</span>
                </a>
              ) : (
                <RequestTrigger
                  kind={opt.cta.kind!}
                  label={opt.cta.label}
                  variant="outline"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
