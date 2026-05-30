import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryCard } from "@/components/catalog/category-card";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { H2, Accent } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";

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
};

const sections: Section[] = [
  {
    href: "/prodotti/telefoni",
    kind: "device",
    title: "Telefoni",
    description:
      "Nuovi sigillati, ricondizionati certificati, usati testati. Apple, Samsung, Xiaomi, Google Pixel e tutti i principali brand.",
  },
  {
    href: "/prodotti/ricambi",
    kind: "part",
    title: "Ricambi",
    description:
      "Display, batterie, scocche, schede madri, vetri posteriori. Filtra per modello e ricevi il pezzo giusto al primo colpo.",
  },
  {
    href: "/prodotti/accessori",
    kind: "accessory",
    title: "Accessori",
    description:
      "Cover, vetri temprati, caricabatterie veloci, cavi MFi e USB-C, cuffie wireless. Tutto con garanzia inclusa.",
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
    const res = await getProducts({ kind: "device", condition: "new", limit: 8 });
    return res.items;
  } catch {
    return [];
  }
}

export default async function CatalogLanding() {
  const [counts, featured, showPrices] = await Promise.all([
    Promise.all(sections.map((s) => getCount(s.kind))),
    getFeatured(),
    canSeePrices(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Prodotti" }]} />

      <CatalogHero
        eyebrow="Magazzino unificato del Gruppo"
        title="Il nostro"
        accent="catalogo"
        description="Tre famiglie di prodotti, un unico magazzino dietro le quinte. Stock aggregato in tempo reale dai brand del Gruppo — Cellcom, Fast-Fix, ItalianParts. Niente esauriti che spuntano dopo l'ordine, niente prezzi che cambiano: tutto verificato dal gestionale, spedito in 24-48h, garanzia 12 mesi."
      />

      <Container className="pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section, i) => (
            <CategoryCard
              key={section.href}
              href={section.href}
              title={section.title}
              count={counts[i]}
              description={section.description}
              delay={i * 0.08}
            />
          ))}
        </div>
      </Container>

      {featured.length > 0 && (
        <Container className="pb-24">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div className="flex flex-col gap-3">
              <Eyebrow>In evidenza</Eyebrow>
              <H2>
                I più <Accent>richiesti</Accent> del momento
              </H2>
            </div>
            <Button href="/prodotti/telefoni" variant="link" iconEnd="→">
              Vedi tutti i telefoni
            </Button>
          </div>
          <ProductGrid
            initialProducts={featured}
            canSeePrices={showPrices}
            showConditionFilter={false}
            showCategoryFilter={false}
          />
        </Container>
      )}
    </>
  );
}
