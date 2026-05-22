import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
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
  // Filtro condizione via query string (?condition=used / new / refurbished)
  // Per default carichiamo TUTTI fino a 100 + visualizziamo conteggi per categoria.
  const sp = (await searchParams) ?? {};
  const condition = sp.condition as PublicCondition | undefined;

  // Fetch parallelo: total per condizione + grid filtrato
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
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              I nostri <span className="italic text-brand-500">telefoni</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {allNew.total} nuovi · {allUsed.total} usati ·{" "}
              {allRefurb.total} ricondizionati. Apple, Samsung, Google, Xiaomi e
              altri, con stato di disponibilità reale dal magazzino.
            </p>
          </div>
          <ProductGrid initialProducts={grid.items} />
        </div>
      </main>
    </>
  );
}
