import { RepairTracker } from "@/components/repairs/repair-tracker";
import { HowItWorks } from "@/components/repairs/how-it-works";
import { IntakeOptions } from "@/components/repairs/intake-options";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata = {
  title: "Riparazioni — Cellcom Group",
  description:
    "Riparazione professionale di smartphone con garanzia 12 mesi. Diagnosi gratuita, ricambi originali, ritiro in negozio o spedizione. Traccia il tuo ticket in tempo reale.",
};

export default function RepairsPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Riparazioni" }]}
      />
      <main className="min-h-screen">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative pt-8 pb-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
          <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_60%)]" />

          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <span className="font-mono text-xs text-brand-500 uppercase tracking-[0.2em]">
              <span className="text-brand-600">◢</span> Centro riparazioni Cellcom
            </span>
            <h1 className="font-serif text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-foreground">
              Quale telefono{" "}
              <span className="italic text-brand-500">vuoi riparare?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Trova il tuo modello, dicci cosa non va, scegli se portarcelo,
              spedirlo o farti ritirare a casa. Diagnosi gratuita, preventivo
              entro 24 ore, garanzia 12 mesi su lavoro e ricambi.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <a
                href="/riparazioni/richiedi"
                className="btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300"
              >
                Richiedi riparazione
                <span aria-hidden>→</span>
              </a>
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
