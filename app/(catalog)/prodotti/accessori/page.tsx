import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";

export const metadata = {
  title: "Accessori — Cellcom Group",
  description:
    "Cover, caricabatterie, cavi, cuffie. Qualità certificata dai canali del Gruppo Cellcom.",
};

export const revalidate = 60;

export default async function AccessoriPage() {
  const [{ items, total }, showPrices] = await Promise.all([
    getProducts({ kind: "accessory", limit: 48 }),
    canSeePrices(),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prodotti", href: "/prodotti" },
          { label: "Accessori" },
        ]}
      />
      <CatalogHero
        eyebrow="Accessori"
        title="I nostri"
        accent="accessori"
        description="Cover, vetri temprati, caricabatterie veloci, cavi USB-C e Lightning originali, cuffie wireless. Compatibilità verificata, garanzia inclusa."
        metrics={[{ label: "A catalogo", value: String(total) }]}
      />
      <Container className="pb-24">
        <ProductGrid initialProducts={items} canSeePrices={showPrices} />
      </Container>
    </>
  );
}
