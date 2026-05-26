"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Ci dici cos'è successo",
    text: "Apri una richiesta qui sotto o chiama il negozio più vicino. Modello, problema (vetro rotto, batteria, non si accende…), una stima del danno. Niente di tecnico — basta spiegare cosa hai visto.",
  },
  {
    n: "02",
    title: "Diagnosi gratuita",
    text: "Un nostro tecnico verifica il telefono entro 24-48h dall'arrivo. Se serve smontarlo, lo smontiamo, fotografiamo i componenti e ti mandiamo un preventivo scritto. Decidi tu — nessun obbligo, nessun costo se rifiuti.",
  },
  {
    n: "03",
    title: "Riparazione in laboratorio",
    text: "Approvato il preventivo, lavoriamo nel laboratorio interno con ricambi originali o certificati. Microscopio per microsaldatura, calibrazione True Tone, sigillatura impermeabile rifatta. Tipici: 24h batteria/schermo, 3-5 giorni scheda madre.",
  },
  {
    n: "04",
    title: "Ritiro o consegna",
    text: "Quando è pronto ti avvisiamo via SMS/email. Vieni a ritirarlo in negozio oppure te lo rispediamo gratis. Garanzia 12 mesi sul ricambio E sulla manodopera — se torna il problema entro l'anno, intervento gratuito.",
  },
];

export function HowItWorks() {
  const shouldReduce = useReducedMotion();
  return (
    <section
      aria-label="Come funziona la riparazione"
      style={{ backgroundColor: "#ffffff" }}
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
              Come funziona
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(32px, 4.2vw, 56px)",
                lineHeight: 1.05,
                color: "#0a0a0a",
                fontWeight: 700,
              }}
            >
              Dal primo messaggio al telefono{" "}
              <span style={{ color: "#dc2626" }}>come nuovo.</span>
            </h2>
          </div>
          <p
            className="leading-relaxed"
            style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
          >
            Quattro passi tracciati dal nostro gestionale. Nessuna sorpresa sul
            prezzo, niente &quot;richiami giovedì&quot;: appena cambia qualcosa
            ti scriviamo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: DURATION.normal,
                ease: EASE.smooth,
                delay: i * 0.08,
              }}
              className="rounded-2xl p-7 lg:p-8 flex gap-6 transition-colors duration-300 hover:border-[#dc2626]"
              style={{
                backgroundColor: "#fafaf8",
                border: "1px solid #ececec",
              }}
            >
              <span
                className="font-sans tabular-nums shrink-0 leading-none"
                style={{
                  fontSize: "clamp(34px, 3.4vw, 48px)",
                  letterSpacing: "-0.02em",
                  color: "#dc2626",
                  fontWeight: 700,
                }}
              >
                {step.n}
              </span>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "19px",
                    letterSpacing: "-0.015em",
                    color: "#0a0a0a",
                    fontWeight: 600,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14px", color: "#525252" }}
                >
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
