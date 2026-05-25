import { RepairTracker } from "@/components/repairs/repair-tracker";
import { HowItWorks } from "@/components/repairs/how-it-works";
import { IntakeOptions } from "@/components/repairs/intake-options";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";

export const metadata = {
  title: "Riparazioni — Cellcom Group",
  description:
    "Riparazione professionale di smartphone con garanzia 12 mesi. Diagnosi gratuita, ricambi originali, ritiro in negozio o spedizione gratuita. Traccia il tuo ticket in tempo reale.",
};

export default function RepairsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Riparazioni" }]} />
      <main className="min-h-screen">
        {/* Hero — due strade chiare */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-8 pb-20">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-12 lg:gap-20 items-start">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
                <span className="text-brand-600">◢</span> Centro riparazioni Cellcom
              </span>
              <h1 className="font-serif text-[clamp(40px,5.5vw,72px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
                Il tuo telefono <span className="italic shimmer-ruby">non è andato</span>.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Schermo rotto, batteria che non tiene più, telefono caduto in
                acqua, scheda madre che fa i capricci. Quasi tutto si ripara —
                spesso a meno di quanto costerebbe sostituirlo. Diagnosi
                gratuita, preventivo prima di mettere mano, garanzia 12 mesi.
                Lavoriamo in laboratorio interno con microscopio, calibrazione e
                ricambi originali.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <RequestTrigger
                  kind="repair"
                  label="Richiedi preventivo gratuito"
                  variant="primary"
                />
                <a
                  href="#tracker"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:border-brand-600 hover:bg-brand-600/5 transition-colors duration-200"
                >
                  Ho già un ticket → traccialo
                </a>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Diagnosi gratuita · Preventivo entro 24h · Nessun costo se rifiuti
              </p>
            </div>

            {/* Cards laterali con le 3 cose che si riparano più spesso */}
            <div className="flex flex-col gap-3">
              <QuickFix
                title="Cambio batteria"
                detail="iPhone, Samsung, Xiaomi — 24h"
                priceFrom="35 €"
              />
              <QuickFix
                title="Sostituzione schermo"
                detail="LCD o OLED originale — 24/48h"
                priceFrom="55 €"
              />
              <QuickFix
                title="Recupero dati / sblocco"
                detail="Acqua, codice dimenticato, IC danneggiato"
                priceFrom="su valutazione"
              />
              <QuickFix
                title="Microsaldatura BGA"
                detail="Scheda madre, IC carica, IC audio — 3-5 gg"
                priceFrom="su preventivo"
              />
            </div>
          </div>
        </section>

        {/* Come funziona */}
        <HowItWorks />

        {/* Come ce lo fai arrivare */}
        <IntakeOptions />

        {/* Tracker — chi ha già un ticket */}
        <section id="tracker" className="border-t border-border bg-card/30">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-16 py-20">
            <RepairTracker />
          </div>
        </section>
      </main>
    </>
  );
}

function QuickFix({
  title,
  detail,
  priceFrom,
}: {
  title: string;
  detail: string;
  priceFrom: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/30 transition-all duration-200">
      <div className="flex flex-col gap-0.5 min-w-0">
        <h3 className="font-serif italic text-base text-foreground truncate">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          da
        </span>
        <span className="font-mono text-sm font-medium text-brand-500 tabular-nums">
          {priceFrom}
        </span>
      </div>
    </div>
  );
}
