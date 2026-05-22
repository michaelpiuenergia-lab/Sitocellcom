import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getProducts } from "@/lib/crm-client";

export const metadata = {
  title: "Catalogo — Cellcom Group",
  description:
    "Telefoni, ricambi, accessori. Catalogo unificato dei brand del Gruppo Cellcom con disponibilità reale dal magazzino.",
};

export const revalidate = 60;

type Section = {
  href: string;
  kind: "device" | "part" | "accessory";
  title: string;
  description: string;
  italicWord: string;
};

const sections: Section[] = [
  {
    href: "/prodotti/telefoni",
    kind: "device",
    title: "Telefoni",
    italicWord: "Telefoni",
    description:
      "Smartphone nuovi e ricondizionati dei principali brand. Disponibilità reale aggregata dai cinque canali del Gruppo.",
  },
  {
    href: "/prodotti/ricambi",
    kind: "part",
    title: "Ricambi",
    italicWord: "Ricambi",
    description:
      "Display, batterie, scocche, schede. Filtra per modello compatibile e trovi quello che cerchi in pochi click.",
  },
  {
    href: "/prodotti/accessori",
    kind: "accessory",
    title: "Accessori",
    italicWord: "Accessori",
    description:
      "Cover, caricabatterie, cavi, cuffie. Qualità certificata e garanzia inclusa.",
  },
];

async function getCount(kind: Section["kind"]): Promise<number | null> {
  try {
    const res = await getProducts({ kind, limit: 1 });
    return res.total;
  } catch {
    return null;
  }
}

export default async function CatalogLanding() {
  const counts = await Promise.all(sections.map((s) => getCount(s.kind)));

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Prodotti" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              Il nostro <span className="italic text-brand-500">catalogo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Tre famiglie di prodotti, una sola fonte di verità. Disponibilità
              reale aggregata in tempo reale dai canali del Gruppo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section, i) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative flex flex-col gap-4 p-8 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col gap-4 h-full">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-serif text-3xl italic text-foreground group-hover:text-brand-500 transition-colors">
                      {section.italicWord}
                    </h2>
                    {counts[i] !== null && (
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {counts[i]} prodotti
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {section.description}
                  </p>
                  <span className="text-sm font-medium text-brand-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    Esplora →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
