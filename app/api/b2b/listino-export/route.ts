import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireB2bSession } from "@/lib/auth/guards";

/**
 * Proxy verso GET /api/v1/b2b/products/export?format=... del CRM.
 * Il CRM genera CSV/XLSX/PDF veri (XLSX=HTML-Office Excel-compat, PDF=jspdf
 * landscape A4). HUB nasconde l'API-key e streama il file al browser.
 */

const QuerySchema = z.object({
  format: z.enum(["csv", "xlsx", "pdf"]),
});

const CONTENT_TYPE: Record<string, string> = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
};

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ctx = await requireB2bSession("/b2b/prodotti");

  const parsed = QuerySchema.safeParse({
    format: req.nextUrl.searchParams.get("format"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAM", message: "format non valido" } },
      { status: 400 },
    );
  }
  const { format } = parsed.data;

  const base = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;
  if (!base || !key) {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "CRM non configurato" } },
      { status: 502 },
    );
  }

  const res = await fetch(`${base}/api/v1/b2b/products/export?format=${format}`, {
    headers: {
      "X-API-Key": key,
      "X-B2B-Session": ctx.sessionToken,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30000), // export può essere lungo
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: { code: "UPSTREAM", message: `Export non disponibile (${res.status})` } },
      { status: 502 },
    );
  }

  const tier = (ctx.tierCode ?? "b2b").toLowerCase();
  const filename = `listino-${tier}.${format}`;
  const contentDisposition =
    res.headers.get("content-disposition") ?? `attachment; filename="${filename}"`;

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? CONTENT_TYPE[format],
      "Content-Disposition": contentDisposition,
      "Cache-Control": "no-store",
    },
  });
}
