import { Metadata } from "next";
import { FadeInView } from "@/components/ui/fade-in-view";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Chi siamo — Cellcom Group",
  description:
    "Il Gruppo Cellcom è il punto di riferimento italiano per il ciclo di vita completo dello smartphone: vendita, riparazione, formazione e ricambistica.",
};

const stats = [
  { value: "20.000+", label: "prodotti a catalogo" },
  { value: "5", label: "brand verticali integrati" },
  { value: "24-48h", label: "consegna in Italia" },
  { value: "12 mesi", label: "garanzia ricambi originali" },
];

const brands = [
  {
    name: "Cellcom.it",
    description:
      "Il magazzino centrale. Distribuzione all'ingrosso per negozi, rivenditori e aziende.",
    url: "https://cellcom.it",
  },
  {
    name: "Fast-Fix.it",
    description:
      "Il laboratorio fisico. Riparazioni rapide e vendita locale.",
    url: "https://fast-fix.it",
  },
  {
    name: "ItalianParts.it",
    description:
      "I ricambi. Schermi, batterie, scocche e tools per i professionisti del settore.",
    url: "https://italianparts.it",
  },
  {
    name: "SmartphoneFix.it",
    description:
      "La scuola. Corsi di riparazione smartphone per chi vuole imparare il mestiere.",
    url: "https://smartphonefix.it",
  },
  {
    name: "FixHub.it",
    description:
      "Il software. Gestionale cloud per laboratori di riparazione e catene multi-negozio.",
    url: "https://fixhub.it",
  },
];

const statements = [
  {
    num: "01",
    title: "TRASPARENZA",
    description:
      "Niente trucchi. Niente offerte civetta. Niente prodotti senza storia. Ogni device ha una scheda tecnica, una garanzia, un'origine certa.",
  },
  {
    num: "02",
    title: "TRACCIABILITÀ",
    description:
      "Ogni riparazione è registrata, fotografata, archiviata. Puoi seguirla in tempo reale dal momento in cui ce la consegni.",
  },
  {
    num: "03",
    title: "SPECIALIZZAZIONE",
    description:
      "Cinque marchi che fanno una cosa sola, ognuno con la sua competenza. Insieme coprono l'intero ciclo di vita del telefono.",
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chi siamo" }]} />
      <main className="flex flex-col gap-24 pt-8 pb-20 px-6 lg:px-16 max-w-[1600px] mx-auto">
      {/* SEZIONE 1 — Hero */}
      <FadeInView className="flex flex-col gap-6 text-center max-w-3xl mx-auto">
        <span className="font-mono text-xs text-brand-500 uppercase tracking-[0.2em]">
          <span className="text-brand-600">◢</span> Il gruppo
        </span>
        <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
          Cinque brand. Una sola <span className="italic text-brand-500">fiducia</span>.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Un'impresa italiana che segue il telefono per tutta la sua vita — dalla scatola al riciclo,
          passando per la riparazione, i ricambi e la formazione.
        </p>
      </FadeInView>

      {/* SEZIONE 2 — Numeri */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeInView key={stat.label} delay={i * 0.1}>
            <div className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card">
              <span className="font-serif text-4xl italic text-brand-500">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          </FadeInView>
        ))}
      </section>

      {/* SEZIONE 3 — I Nostri Brand */}
      <section className="flex flex-col gap-8">
        <FadeInView className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-[clamp(28px,3vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] text-foreground">
            I nostri <span className="italic text-brand-500">brand</span>
          </h2>
        </FadeInView>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <FadeInView key={brand.name} delay={i * 0.1}>
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/30 transition-colors duration-300 h-full"
              >
                <h3 className="font-serif text-xl italic text-foreground group-hover:text-brand-500 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {brand.description}
                </p>
                <span className="mt-auto text-sm font-medium text-brand-500 group-hover:text-brand-400 inline-flex items-center gap-1">
                  Visita il sito
                  <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </span>
              </a>
            </FadeInView>
          ))}
        </div>
      </section>

      {/* SEZIONE 4 — Cosa ci distingue */}
      <section className="flex flex-col gap-8">
        <FadeInView className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-[clamp(28px,3vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] text-foreground">
            Cosa ci <span className="italic text-brand-500">distingue</span>
          </h2>
        </FadeInView>
        <div className="flex flex-col gap-6">
          {statements.map((s, i) => (
            <FadeInView key={s.num} delay={i * 0.15}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-6 lg:p-8 rounded-2xl border border-border bg-card">
                <span className="font-mono text-sm text-brand-500 shrink-0">{s.num}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-lg italic text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </section>
    </main>
  </>
  );
}
