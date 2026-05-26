import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/crm-client";
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

  const [allNew, allUsed, allRefurb, grid] = await Promise.all([
    getProducts({ kind: "device", condition: "new", limit: 1 }),
    getProducts({ kind: "device", condition: "used", limit: 1 }),
    getProducts({ kind: "device", condition: "refurbished", limit: 1 }),
    getProducts({ kind: "device", condition, limit: 100 }),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prodotti", href: "/prodotti" },
          { label: "Telefoni" },
        ]}
      />
      <CatalogHero
        eyebrow="Smartphone"
        title="I nostri"
        accent="telefoni"
        description="Apple, Samsung, Google, Xiaomi e tutti i brand principali. IMEI verificato, batteria sopra l'80% per il ricondizionato, report tecnico per l'usato."
        metrics={[
          { label: "Nuovi", value: String(allNew.total) },
          { label: "Ricondizionati", value: String(allRefurb.total) },
          { label: "Usati", value: String(allUsed.total) },
          { label: "Totale", value: String(allNew.total + allUsed.total + allRefurb.total) },
        ]}
      />
      <Container className="pb-24">
        <ProductGrid initialProducts={grid.items} />
      </Container>
    </>
  );
}
