import { NextRequest, NextResponse } from "next/server";
import { requireB2bSession } from "@/lib/auth/guards";
import { payB2bInvoiceKlarna } from "@/lib/crm-client";

/**
 * POST /api/b2b/pay { invoiceId }
 *
 * BFF: il rivenditore loggato chiede al CRM un link Klarna per pagare online
 * il residuo della propria fattura. Il CRM valida l'ownership; l'esito del
 * pagamento torna al CRM via webhook (qui rimbalziamo solo il link).
 */
export async function POST(req: NextRequest) {
  const ctx = await requireB2bSession();

  const body = (await req.json().catch(() => ({}))) as { invoiceId?: unknown };
  const invoiceId = typeof body.invoiceId === "string" ? body.invoiceId.trim() : "";
  if (!invoiceId) {
    return NextResponse.json(
      { error: { code: "INVALID_PAYLOAD", message: "invoiceId obbligatorio" } },
      { status: 400 },
    );
  }

  try {
    const result = await payB2bInvoiceKlarna(ctx.sessionToken, invoiceId);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Fattura non trovata" } },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM",
          message: "Pagamento online non disponibile al momento. Riprova piu' tardi.",
        },
      },
      { status: 502 },
    );
  }
}
