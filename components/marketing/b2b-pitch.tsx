"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";

/**
 * Banner B2B persuasivo. Vive nella landing pubblica per intercettare
 * rivenditori, operatori e aziende che atterrano sul sito vetrina e
 * indirizzarli all'area riservata.
 *
 * Argomenti di vendita concreti, non slogan: prezzi tier, disponibilità
 * prioritaria, condizioni di pagamento, account manager dedicato.
 */

const BENEFITS = [
  {
    title: "Listino tier",
    text: "Prezzi differenziati per Rivenditore, Operatore e VIP. Più volumi fai, più scendi di listino — automaticamente.",
  },
  {
    title: "Disponibilità prioritaria",
    text: "I tuoi ordini hanno corsia preferenziale in magazzino. Se un ricambio è scarso, lo riserviamo prima per chi ha contratto attivo.",
  },
  {
    title: "Condizioni di pagamento",
    text: "Bonifico a 30 o 60 giorni in base al rating, RID/SDD per ordini ricorrenti, fattura elettronica automatica.",
  },
  {
    title: "Un solo interlocutore",
    text: "Account manager dedicato che conosce la tua azienda. Email diretta, WhatsApp business, no centralino, no ticket persi.",
  },
];

export function B2bPitch() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative max-w-[1600px] mx-auto px-6 lg:px-16 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-brand-600/30 bg-card p-8 md:p-12 lg:p-16">
        {/* Glow ambient brand-rosso solo dentro a questo blocco */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-brand-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-brand-800/20 blur-3xl" />

        <div className="relative grid lg:grid-cols-[1.1fr,1fr] gap-12 items-start">
          {/* Left — Pitch principale */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: DURATION.slow, ease: EASE.drift }}
            className="flex flex-col gap-6"
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              Per rivenditori, operatori, aziende
            </span>

            <h2 className="font-serif text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              Vendi telefoni o ripari per mestiere?
              <br />
              <span className="italic shimmer-ruby">
                Il listino giusto fa la differenza.
              </span>
            </h2>

            <div className="flex flex-col gap-3 text-muted-foreground text-base leading-relaxed max-w-[560px]">
              <p>
                Il nostro magazzino lavora già con centinaia di rivenditori,
                centri assistenza autorizzati e operatori sparsi in tutta Italia.
                Lo stesso stock che vedi sul sito pubblico è quello a cui accedi
                tu, ma con prezzi pensati per chi compra a volumi e disponibilità
                garantita prima che il pubblico la veda.
              </p>
              <p>
                Niente moduli infiniti per aprire il conto, niente minimi
                d'ordine assurdi: serve solo P.IVA, un nostro commerciale ti
                richiama in giornata, le credenziali arrivano entro 24 ore.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="/b2b/login"
                className="btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.6)] transition-shadow duration-300"
              >
                Accedi all'area B2B
                <span aria-hidden>→</span>
              </a>
              <a
                href="mailto:b2b@cellcom.it?subject=Richiesta%20attivazione%20account%20B2B"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:border-brand-600 hover:bg-brand-600/5 transition-colors duration-200"
              >
                Richiedi attivazione account
              </a>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              b2b@cellcom.it · risposta entro 24 ore lavorative
            </p>
          </motion.div>

          {/* Right — 4 benefits in griglia 2x2 */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.drift,
              delay: 0.15,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card-hover/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brand-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-base italic text-foreground">
                    {b.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {b.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
