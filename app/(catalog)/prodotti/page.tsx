import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGrid } from "@/components/catalog/product-grid";
import { AnimatedNumber } from "@/components/ui/animated-number";
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
      "Smartphone nuovi sigillati, ricondizionati certificati grado A/B, usati testati con report tecnico. Apple, Samsung, Xiaomi, Google Pixel, Huawei, OnePlus e tutti i principali brand del mercato. IMEI verificato, batteria al di sopra dell'80% per il ricondizionato.",
  },
  {
    href: "/prodotti/ricambi",
    kind: "part",
    title: "Ricambi",
    italicWord: "Ricambi",
    description:
      "Display LCD e OLED, batterie originali e di qualità equivalente, scocche, schede madri, vetri posteriori, connettori di carica, altoparlanti. Filtra per modello compatibile e ricevi a casa il ricambio giusto al primo colpo — o passa a ritirarlo in negozio.",
  },
  {
    href: "/prodotti/accessori",
    kind: "accessory",
    title: "Accessori",
    italicWord: "Accessori",
    description:
      "Cover protettive, vetri temprati, caricabatterie veloci, cavi MFi e USB-C originali, cuffie wireless. Tutti gli accessori che servono per proteggere e usare al meglio il tuo device, con garanzia inclusa.",
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

async function getFeatured() {
  try {
    // 8 telefoni nuovi come "in evidenza" — quando il CRM esporrà un flag
    // bestseller dedicato si potrà sostituire questo filtro.
    const res = await getProducts({ kind: "device", condition: "new", limit: 8 });
    return res.items;
  } catch {
    return [];
  }
}

export default async function CatalogLanding() {
  const [counts, featured] = await Promise.all([
    Promise.all(sections.map((s) => getCount(s.kind))),
    getFeatured(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Prodotti" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
              <span className="text-brand-600">◢</span> Magazzino unificato del Gruppo
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              Il nostro <span className="italic shimmer-ruby">catalogo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tre famiglie di prodotti, un unico magazzino dietro le quinte.
              Quello che vedi è quello che hai: stock aggregato in tempo reale
              dai nostri cinque canali — Cellcom, Fast-Fix, ItalianParts,
              SmartphoneFix, FixHub. Niente "in attesa di rifornimento", niente
              prezzi che cambiano dopo l'ordine. Tutto verificato dal gestionale,
              spedito in 24-48h, con garanzia 12 mesi.
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
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-3xl italic text-foreground group-hover:text-brand-500 transition-colors">
                      {section.italicWord}
                    </h2>
                    {counts[i] !== null && (
                      <div className="flex flex-col items-end leading-none">
                        <AnimatedNumber
                          value={counts[i]}
                          duration={1500}
                          className="font-mono text-3xl font-medium text-brand-500 tabular-nums"
                        />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                          prodotti
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {section.description}
                  </p>
                  <span className="text-sm font-semibold text-brand-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all inline-flex items-center gap-2">
                    Esplora <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {featured.length > 0 && (
            <div className="flex flex-col gap-8 mt-8">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
                    <span className="text-brand-600">◢</span> In evidenza
                  </span>
                  <h2 className="font-serif text-3xl italic text-foreground">
                    I più richiesti del momento
                  </h2>
                </div>
                <Link
                  href="/prodotti/telefoni"
                  className="text-sm font-semibold text-brand-500 hover:text-brand-400 inline-flex items-center gap-2 group"
                >
                  Vedi tutti i telefoni
                  <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <ProductGrid
                initialProducts={featured}
                showConditionFilter={false}
                showCategoryFilter={false}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
