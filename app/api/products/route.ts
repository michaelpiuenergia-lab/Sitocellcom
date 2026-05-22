import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/crm-client";
import type {
  PublicChannel,
  PublicCondition,
  PublicKind,
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

  const filters = {
    channel: (sp.get("channel") ?? undefined) as PublicChannel | undefined,
    search,
    category: sp.get("category") ?? undefined,
    condition: (sp.get("condition") ?? undefined) as PublicCondition | undefined,
    brand: sp.get("brand") ?? undefined,
    kind: (sp.get("kind") ?? undefined) as PublicKind | undefined,
    limit: sp.get("limit") ? Math.min(100, parseInt(sp.get("limit")!, 10)) : 48,
    offset: sp.get("offset") ? parseInt(sp.get("offset")!, 10) : 0,
  };

  try {
    const result = await getProducts(filters);
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
