import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RepairWizard } from "@/components/repairs/repair-wizard";

export const metadata = {
  title: "Richiedi riparazione — Cellcom Group",
  description:
    "Wizard riparazione: scegli telefono, problema, modalità (negozio / spedizione / domicilio) e appuntamento. Diagnosi gratuita, garanzia 12 mesi.",
};

export default function RichiediPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Riparazioni", href: "/riparazioni" },
          { label: "Richiedi riparazione" },
        ]}
      />
      <main className="min-h-screen">
        <section className="relative pt-8 pb-10 px-6 lg:px-16 max-w-[1200px] mx-auto">
          <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_60%)]" />
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-brand-500 uppercase tracking-[0.2em]">
              <span className="text-brand-600">◢</span> Wizard riparazione
            </span>
            <h1 className="font-serif text-[clamp(32px,4.5vw,56px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              Quale telefono{" "}
              <span className="italic text-brand-500">vuoi riparare?</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tre passi rapidi: telefono → problema → come fartelo arrivare.
              Diagnosi gratuita, nessun impegno fino al preventivo.
            </p>
          </div>
        </section>

        <section className="px-6 lg:px-16 pb-20">
          <RepairWizard />
        </section>
      </main>
    </>
  );
}
