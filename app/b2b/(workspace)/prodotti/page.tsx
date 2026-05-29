import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bProducts } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { ProductGridB2b } from "@/components/b2b/product-grid-b2b";
import { ListinoExport } from "@/components/b2b/listino-export";
import type {
  B2bProductListItem,
  PublicKind,
} from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const CRM_PAGE_SIZE = 100; // limite massimo per request CRM (1..100)

/**
 * Pagina il CRM in chunk da 100 finché non raggiungiamo `maxItems` o il CRM
 * dice `hasMore=false`. Prima chiamata seriale per leggere `total`, poi
 * fan-out parallelo sulle pagine successive (latenza totale ~= 2 round-trip).
 */
async function fetchAllByKind(
  fetchCtx: { sessionToken: string; customerId: string; tierCode: string | null },
  kind: PublicKind,
  maxItems: number,
): Promise<{ items: B2bProductListItem[]; total: number }> {
  const first = await getB2bProducts(fetchCtx, {
    kind,
    limit: CRM_PAGE_SIZE,
    offset: 0,
  });
  const total = first.total;
  const cap = Math.min(maxItems, total);
  if (first.items.length >= cap) {
    return { items: first.items.slice(0, cap), total };
  }
  const pages: number[] = [];
  for (let offset = CRM_PAGE_SIZE; offset < cap; offset += CRM_PAGE_SIZE) {
    pages.push(offset);
  }
  const rest = await Promise.all(
    pages.map((offset) =>
      getB2bProducts(fetchCtx, { kind, limit: CRM_PAGE_SIZE, offset }),
    ),
  );
  const all = first.items.concat(...rest.map((r) => r.items));
  return { items: all.slice(0, cap), total };
}

export default async function B2bProductsPage() {
  const ctx = await requireB2bSession("/b2b/prodotti");

  const fetchCtx = {
    sessionToken: ctx.sessionToken,
    customerId: ctx.customer.id,
    tierCode: ctx.tierCode,
  };

  // Fetch separato per kind, paginato (CRM limita a 100 per request).
  // Cap diversi per controllare il peso della pagina: ricambi sono il pezzo
  // forte del B2B, quindi raccogliamo molti più; telefoni e accessori meno.
  const [devicesRes, partsRes, accessoriesRes] = await Promise.all([
    fetchAllByKind(fetchCtx, "device", 200).catch((e) => {
      console.error("[b2b/prodotti] devices fetch failed:", e?.message ?? e);
      return null;
    }),
    fetchAllByKind(fetchCtx, "part", 1200).catch((e) => {
      console.error("[b2b/prodotti] parts fetch failed:", e?.message ?? e);
      return null;
    }),
    fetchAllByKind(fetchCtx, "accessory", 200).catch((e) => {
      console.error("[b2b/prodotti] accessories fetch failed:", e?.message ?? e);
      return null;
    }),
  ]);

  const allItems = [
    ...(devicesRes?.items ?? []),
    ...(partsRes?.items ?? []),
    ...(accessoriesRes?.items ?? []),
  ];

  const totals = {
    devices: devicesRes?.total ?? 0,
    parts: partsRes?.total ?? 0,
    accessories: accessoriesRes?.total ?? 0,
  };

  return (
    <>
      <B2bNavbar customer={ctx.customer} />

      <main className="pt-24 pb-16 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-500">
              Listino riservato {ctx.customer.pricingTier?.name ?? "B2B"}
            </span>
            <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground">
              I tuoi prodotti, ai tuoi prezzi
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Catalogo completo del magazzino Cellcom — {totals.devices} telefoni,{" "}
              {totals.parts} ricambi, {totals.accessories} accessori. Disponibilità
              in tempo reale. Per condizioni dedicate o grandi quantità, premi{" "}
              <em>Richiedi disponibilità</em> sul prodotto.
            </p>
          </div>
          <ListinoExport disabled={allItems.length === 0} />
        </div>

        <ProductGridB2b
          initialProducts={allItems}
          viewer={{
            customerId: ctx.customer.id,
            tierCode: ctx.tierCode,
            tierName: ctx.customer.pricingTier?.name ?? null,
          }}
        />
      </main>
    </>
  );
}
