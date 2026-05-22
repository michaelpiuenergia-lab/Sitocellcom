import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/crm-client";
import type {
  PublicChannel,
  PublicCondition,
  PublicKind,
  PublicProductListItem,
} from "@/lib/crm-client/types";

/**
 * Proxy HUB → CRM per filtri prodotti client-side.
 * Il client (es. dropdown ricambi) chiama questa route con i filtri,
 * la route ricontatta il CRM lato server (la chiave API resta server-only).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // Il CRM v1 non supporta `compatibleModels` come filtro dedicato:
  // sfrutta `search` che cerca testualmente su name+brand+category+
  // compatibleModels. Mappiamo qui per restare API-compatible col client.
  const compatibleModels = sp.get("compatibleModels");
  const search = sp.get("search") ?? compatibleModels ?? undefined;
  const brandRaw = sp.get("brand");

  const baseFilters = {
    channel: (sp.get("channel") ?? undefined) as PublicChannel | undefined,
    search,
    category: sp.get("category") ?? undefined,
    condition: (sp.get("condition") ?? undefined) as PublicCondition | undefined,
    kind: (sp.get("kind") ?? undefined) as PublicKind | undefined,
    limit: sp.get("limit") ? Math.min(100, parseInt(sp.get("limit")!, 10)) : 48,
    offset: sp.get("offset") ? parseInt(sp.get("offset")!, 10) : 0,
  };

  try {
    // Brand match case-insensitive: nel CRM lo stesso brand può esistere come
    // "Xiaomi" e "XIAOMI". Non passiamo il filtro brand al CRM (che lo fa
    // case-exact); fetchiamo più pagine e filtriamo qui.
    if (brandRaw) {
      const target = brandRaw.trim().toLowerCase();
      const matched: PublicProductListItem[] = [];
      let offset = 0;
      const pageSize = 100;
      const maxBatches = 15; // safety cap 1500 records
      let total = 0;

      for (let i = 0; i < maxBatches; i++) {
        const res = await getProducts({
          ...baseFilters,
          limit: pageSize,
          offset,
        });
        total = res.total;
        for (const p of res.items) {
          if (p.brand && p.brand.trim().toLowerCase() === target) {
            matched.push(p);
          }
        }
        if (!res.hasMore) break;
        offset += pageSize;
      }

      // Applichiamo i pagination params richiesti dal client SULL'array filtrato
      const start = baseFilters.offset;
      const end = start + baseFilters.limit;
      const page = matched.slice(start, end);

      return NextResponse.json(
        {
          items: page,
          total: matched.length,
          hasMore: end < matched.length,
          // teniamo crmTotal per debug, non usato dal client
          crmTotal: total,
        },
        {
          headers: {
            "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
          },
        },
      );
    }

    const result = await getProducts(baseFilters);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: msg } },
      { status: 502 },
    );
  }
}
