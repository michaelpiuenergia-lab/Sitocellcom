import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getT } from "@/lib/i18n/server";
import type { PublicCondition } from "@/lib/crm-client/types";

export const metadata = {
  title: "Telefoni — Cellcom Group",
  description:
    "Smartphone nuovi, usati e ricondizionati. Disponibilità reale dai canali del Gruppo Cellcom.",
};

export const revalidate = 60;

type SearchParams = Promise<{ condition?: string }>;

export default async function TelefoniPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const condition = sp.condition as PublicCondition | undefined;

  const [allNew, allUsed, allRefurb, grid, showPrices, t] = await Promise.all([
    getProducts({ kind: "device", condition: "new", limit: 1 }),
    getProducts({ kind: "device", condition: "used", limit: 1 }),
    getProducts({ kind: "device", condition: "refurbished", limit: 1 }),
    getProducts({ kind: "device", condition, limit: 100 }),
    canSeePrices(),
    getT(),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t("bc.home"), href: "/" },
          { label: t("bc.products"), href: "/prodotti" },
          { label: t("bc.phones") },
        ]}
      />
      <CatalogHero
        eyebrow={t("ch.phones.eyebrow")}
        title={t("ch.phones.title")}
        accent={t("ch.phones.accent")}
        description={t("ch.phones.description")}
        metrics={[
          { label: t("ch.phones.metric.new"), value: String(allNew.total) },
          { label: t("ch.phones.metric.refurbished"), value: String(allRefurb.total) },
          { label: t("ch.phones.metric.used"), value: String(allUsed.total) },
          { label: t("ch.phones.metric.total"), value: String(allNew.total + allUsed.total + allRefurb.total) },
        ]}
      />
      <Container className="pb-24">
        <ProductGrid initialProducts={grid.items} canSeePrices={showPrices} />
      </Container>
    </>
  );
}
