import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SpareParts } from "@/components/catalog/spare-parts";
import { getProducts } from "@/lib/crm-client";
import type { PublicProductListItem } from "@/lib/crm-client/types";

export const metadata = {
  title: "Ricambi — Cellcom Group",
  description:
    "Display, batterie, scocche, schede. Filtra per modello compatibile e trova il ricambio giusto.",
};

export const revalidate = 60;

// Per popolare il dropdown modelli con TUTTI i 1157 ricambi del CRM
// facciamo più fetch sequenziali (Vercel limit page-level = 100/req).
// Risultato cached lato server per 60s.
// Brand "fasulli" da escludere dal filtro: nomi di canali/store
// che a volte finiscono nel campo brand del CRM ma non sono produttori reali.
const NON_BRAND_VALUES = new Set([
  "italian parts",
  "italianparts",
  "cellcom",
  "fast-fix",
  "fastfix",
]);

/** Title-case su una stringa, gestendo bene parole "ALL CAPS" tipo XIAOMI → Xiaomi. */
function normalizeBrand(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function fetchAllPartsForModels(): Promise<{
  totalCount: number;
  models: string[];
  brands: string[];
}> {
  const models = new Set<string>();
  const brands = new Set<string>();
  let total = 0;
  let offset = 0;
  const limit = 100;
  const maxBatches = 15; // safety cap 1500 records

  for (let i = 0; i < maxBatches; i++) {
    const res = await getProducts({ kind: "part", limit, offset });
    total = res.total;
    res.items.forEach((p) => {
      if (p.compatibleModels) models.add(p.compatibleModels);
      if (p.brand) {
        const normalized = normalizeBrand(p.brand);
        // Esclude valori vuoti, canali/store finiti per errore nel campo brand
        if (normalized && !NON_BRAND_VALUES.has(normalized.toLowerCase())) {
          brands.add(normalized);
        }
      }
    });
    if (!res.hasMore) break;
    offset += limit;
  }

  return {
    totalCount: total,
    models: Array.from(models).sort((a, b) => a.localeCompare(b, "it")),
    brands: Array.from(brands).sort((a, b) => a.localeCompare(b, "it")),
  };
}

export default async function RicambiPage() {
  // Per il grid iniziale prendiamo i primi 100. Il filtro modello chiama
  // poi /api/products che cerca server-side in tutto il catalogo.
  const initial = await getProducts({ kind: "part", limit: 100 });

  // Lista modelli + brand unificata (server-cached) per popolare i dropdown.
  let modelsData: { totalCount: number; models: string[]; brands: string[] };
  try {
    modelsData = await fetchAllPartsForModels();
  } catch {
    modelsData = {
      totalCount: initial.total,
      models: Array.from(
        new Set(
          initial.items
            .map((p: PublicProductListItem) => p.compatibleModels)
            .filter((m): m is string => typeof m === "string" && m.length > 0),
        ),
      ).sort(),
      brands: Array.from(
        new Set(
          initial.items
            .map((p: PublicProductListItem) =>
              p.brand ? normalizeBrand(p.brand) : null,
            )
            .filter(
              (b): b is string =>
                typeof b === "string" &&
                b.length > 0 &&
                !NON_BRAND_VALUES.has(b.toLowerCase()),
            ),
        ),
      ).sort((a, b) => a.localeCompare(b, "it")),
    };
  }

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
              {modelsData.totalCount} ricambi a catalogo per{" "}
              {modelsData.models.length} modelli. Display, batterie, scocche e
              schede originali e compatibili. Filtra per modello per trovare il
              pezzo giusto.
            </p>
          </div>
          <SpareParts
            initialProducts={initial.items}
            availableModels={modelsData.models}
            availableBrands={modelsData.brands}
            totalCount={modelsData.totalCount}
          />
        </div>
      </main>
    </>
  );
}
