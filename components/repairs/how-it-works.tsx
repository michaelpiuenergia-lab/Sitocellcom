"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Ci dici cos'è successo",
    text: "Apri una richiesta di preventivo qui sotto o chiama il negozio più vicino. Ti chiediamo modello, problema riscontrato (vetro rotto, batteria scarica, non si accende…) e una stima del danno. Non serve niente di tecnico — basta che sappia spiegarci cosa hai visto.",
  },
  {
    n: "02",
    title: "Diagnosi gratuita",
    text: "Un nostro tecnico verifica il telefono entro 24-48h dall'arrivo. Se serve smontarlo per capire, lo smontiamo, fotografiamo i componenti e ti mandiamo un preventivo scritto. Tu decidi se procedere — senza obbligo, senza costi se rifiuti.",
  },
  {
    n: "03",
    title: "Riparazione in laboratorio",
    text: "Approvato il preventivo, lavoriamo nel nostro laboratorio interno con ricambi originali o certificati. Microscopio per la microsaldatura, calibrazione True Tone, sigillatura impermeabile rifatta. Tempi tipici: 24h per cambio batteria/schermo, 3-5 giorni per scheda madre.",
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
    <section className="max-w-[1200px] mx-auto px-6 lg:px-16 py-20">
      <div className="flex flex-col gap-3 mb-12">
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
          <span className="text-brand-600">◢</span> Come funziona
        </span>
        <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[-0.02em] text-foreground">
          Dal primo messaggio al telefono <span className="italic shimmer-ruby">come nuovo</span>.
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Quattro passaggi semplici, tutto tracciato dal nostro gestionale.
          Niente sorprese sul prezzo, niente "richiami giovedì" — appena cambia
          qualcosa ti scriviamo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: DURATION.normal,
              ease: EASE.smooth,
              delay: i * 0.08,
            }}
            className="relative flex gap-5 p-6 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/30 transition-all duration-300"
          >
            <span className="font-serif text-[clamp(36px,3.5vw,52px)] leading-none text-brand-500 tabular-nums shrink-0">
              {step.n}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif italic text-xl text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
