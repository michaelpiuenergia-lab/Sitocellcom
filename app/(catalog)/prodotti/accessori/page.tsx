import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Accessori — Cellcom Group",
  description:
    "Cover, caricabatterie, cavi, cuffie. Qualità certificata dai canali del Gruppo Cellcom.",
};

export const revalidate = 60;

export default async function AccessoriPage() {
  const [{ items, total }, showPrices, t] = await Promise.all([
    getProducts({ kind: "accessory", limit: 48 }),
    canSeePrices(),
    getT(),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t("bc.home"), href: "/" },
          { label: t("bc.products"), href: "/prodotti" },
          { label: t("bc.accessories") },
        ]}
      />
      <CatalogHero
        eyebrow={t("ch.accessories.eyebrow")}
        title={t("ch.accessories.title")}
        accent={t("ch.accessories.accent")}
        description={t("ch.accessories.description")}
        metrics={[{ label: t("ch.accessories.metric.inCatalog"), value: String(total) }]}
      />
      <Container className="pb-24">
        <ProductGrid initialProducts={items} canSeePrices={showPrices} />
      </Container>
    </>
  );
}
