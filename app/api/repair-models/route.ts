import { NextRequest, NextResponse } from "next/server";

import { ALL_MODELS, modelImageUrl } from "@/lib/repairs/models-db";

/**
 * GET /api/repair-models?q=iphone&category=Smartphone&limit=20
 *
 * Catalogo modelli del wizard (2886 device con foto) esposto come API, così il
 * CRM può mostrare la foto del telefono nella ricerca modello di una
 * riparazione — senza duplicare il database lato CRM.
 *
 * Pubblico (dati non sensibili: solo nomi modello + URL immagine assoluto).
 * Risposta: { items: [{ brand, model, category, imageUrl }] }.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const category = url.searchParams.get("category")?.trim().toLowerCase() || null;
  const limit = Math.min(40, Math.max(1, Number(url.searchParams.get("limit")) || 20));

  if (q.length < 2) {
    return NextResponse.json({ items: [] }, { headers: corsHeaders(req) });
  }

  const terms = q.split(/\s+/).filter(Boolean).slice(0, 6);
  const origin = url.origin;
  const items: Array<{
    brand: string;
    model: string;
    category: string;
    imageUrl: string | null;
  }> = [];

  for (const m of ALL_MODELS) {
    if (category && m.category.toLowerCase() !== category) continue;
    const hay = `${m.brand} ${m.name}`.toLowerCase();
    if (!terms.every((t) => hay.includes(t))) continue;
    const img = modelImageUrl(m);
    items.push({
      brand: m.brand,
      model: m.name,
      category: m.category,
      imageUrl: img ? `${origin}${img}` : null,
    });
    if (items.length >= limit) break;
  }

  return NextResponse.json(
    { items },
    {
      headers: {
        ...corsHeaders(req),
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/**
 * CORS aperto in lettura: l'endpoint serve solo nomi modello + URL foto
 * pubblici, e va consumato dal CRM (origin diverso).
 */
function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
