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
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata = {
  title: "Catalogo — Cellcom Group",
  description:
    "Telefoni, ricambi, accessori. Catalogo unificato dei brand del Gruppo Cellcom con disponibilità reale dal magazzino.",
};

export const revalidate = 60;

type Section = {
  href: string;
  kind: "device" | "part" | "accessory";
  titleKey: keyof Dict;
  descKey: keyof Dict;
};

const SECTIONS: Section[] = [
  {
    href: "/prodotti/telefoni",
    kind: "device",
    titleKey: "catalog.land.sec.phones.title",
    descKey: "catalog.land.sec.phones.description",
  },
  {
    href: "/prodotti/ricambi",
    kind: "part",
    titleKey: "catalog.land.sec.parts.title",
    descKey: "catalog.land.sec.parts.description",
  },
  {
    href: "/prodotti/accessori",
    kind: "accessory",
    titleKey: "catalog.land.sec.accessories.title",
    descKey: "catalog.land.sec.accessories.description",
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
  const [counts, featured, showPrices, t] = await Promise.all([
    Promise.all(SECTIONS.map((s) => getCount(s.kind))),
    getFeatured(),
    canSeePrices(),
    getT(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.products") }]} />

      <CatalogHero
        eyebrow={t("ch.products.eyebrow")}
        title={t("ch.products.title")}
        accent={t("ch.products.accent")}
        description={t("ch.products.description")}
      />

      <Container className="pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SECTIONS.map((section, i) => (
            <CategoryCard
              key={section.href}
              href={section.href}
              title={t(section.titleKey)}
              count={counts[i]}
              description={t(section.descKey)}
              delay={i * 0.08}
            />
          ))}
        </div>
      </Container>

      {featured.length > 0 && (
        <Container className="pb-24">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div className="flex flex-col gap-3">
              <Eyebrow>{t("catalog.land.featured.eyebrow")}</Eyebrow>
              <H2>
                {t("catalog.land.featured.titleA")} <Accent>{t("catalog.land.featured.accent")}</Accent> {t("catalog.land.featured.titleB")}
              </H2>
            </div>
            <Button href="/prodotti/telefoni" variant="link" iconEnd="→">
              {t("catalog.land.featured.cta")}
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
