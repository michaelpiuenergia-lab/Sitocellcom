import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SpareParts } from "@/components/catalog/spare-parts";
import { getProducts } from "@/lib/crm-client";

export const metadata = {
  title: "Ricambi — Cellcom Group",
  description:
    "Display, batterie, scocche, schede. Filtra per modello compatibile e trova il ricambio giusto.",
};

export const revalidate = 60;

export default async function RicambiPage() {
  // Per MVP fetchiamo fino a 100 ricambi e filtriamo lato client per modello.
  // In Phase 2 spostiamo il filtro a server-side via query string + fetch on-demand.
  const { items, total } = await getProducts({ kind: "part", limit: 100 });

  // Estrai elenco unico di modelli compatibili dai prodotti
  const models = Array.from(
    new Set(
      items
        .map((p) => p.compatibleModels)
        .filter((m): m is string => Boolean(m) && m!.length > 0),
    ),
  ).sort();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prodotti", href: "/prodotti" },
          { label: "Ricambi" },
        ]}
      />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              I nostri <span className="italic text-brand-500">ricambi</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {total} ricambi a catalogo. Display, batterie, scocche e schede
              originali e compatibili. Filtra per modello per trovare il pezzo
              giusto.
            </p>
          </div>
          <SpareParts initialProducts={items} availableModels={models} />
        </div>
      </main>
    </>
  );
}
