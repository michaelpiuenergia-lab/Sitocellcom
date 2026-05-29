import { NextRequest, NextResponse } from "next/server";
import { requireB2bSession } from "@/lib/auth/guards";
import { b2bDownloadCrmPath } from "@/lib/crm-client";

/**
 * Proxy download asset B2B (fatture / note credito / documenti).
 * Il CRM risponde 302 verso un signed URL pubblico (token HMAC).
 * Inoltriamo il redirect al browser così il download avviene direttamente.
 */

const ALLOWED = ["invoices", "credit-notes", "documents"] as const;
type Kind = (typeof ALLOWED)[number];

function isAllowed(v: string): v is Kind {
  return (ALLOWED as readonly string[]).includes(v);
}

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ kind: string; id: string }>;

export async function GET(
  _req: NextRequest,
  { params }: { params: RouteParams },
) {
  const { kind, id } = await params;
  if (!isAllowed(kind)) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAM", message: "Tipo non valido" } },
      { status: 400 },
    );
  }

  const ctx = await requireB2bSession("/b2b/prodotti");

  const base = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;
  if (!base || !key) {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Download non disponibile in modalità mock" } },
      { status: 502 },
    );
  }

  const path = b2bDownloadCrmPath(kind, id);
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    headers: { "X-API-Key": key, "X-B2B-Session": ctx.sessionToken },
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  // 302 → inoltro il redirect al browser
  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, 302);
    }
  }

  // 200 → streamma il body direttamente (PDF inline)
  if (res.ok) {
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition":
          res.headers.get("content-disposition") ?? `attachment; filename="${kind}-${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(
    { error: { code: "UPSTREAM", message: `Download non disponibile (${res.status})` } },
    { status: 502 },
  );
}
