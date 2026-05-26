import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SpareParts } from "@/components/catalog/spare-parts";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/crm-client";
import type { PublicProductListItem } from "@/lib/crm-client/types";

export const metadata = {
  title: "Ricambi — Cellcom Group",
  description:
    "Display, batterie, scocche, schede. Filtra per modello compatibile e trova il ricambio giusto.",
};

export const revalidate = 60;

const NON_BRAND_VALUES = new Set([
  "italian parts",
  "italianparts",
  "cellcom",
  "fast-fix",
  "fastfix",
]);

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
  const maxBatches = 15;

  for (let i = 0; i < maxBatches; i++) {
    const res = await getProducts({ kind: "part", limit, offset });
    total = res.total;
    res.items.forEach((p) => {
      if (p.compatibleModels) models.add(p.compatibleModels);
      if (p.brand) {
        const normalized = normalizeBrand(p.brand);
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
  const initial = await getProducts({ kind: "part", limit: 100 });

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
      <CatalogHero
        eyebrow="Ricambi"
        title="I nostri"
        accent="ricambi"
        description="Display, batterie, scocche, schede madri e vetri posteriori. Originali e compatibili certificati. Filtra per brand e modello: il pezzo giusto al primo colpo."
        metrics={[
          { label: "A catalogo", value: String(modelsData.totalCount) },
          { label: "Modelli compatibili", value: String(modelsData.models.length) },
        ]}
      />
      <Container className="pb-24">
        <SpareParts
          initialProducts={initial.items}
          availableModels={modelsData.models}
          availableBrands={modelsData.brands}
          totalCount={modelsData.totalCount}
        />
      </Container>
    </>
  );
}
