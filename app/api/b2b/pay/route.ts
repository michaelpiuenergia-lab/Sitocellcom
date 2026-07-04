import { NextRequest, NextResponse } from "next/server";
import { optionalB2bSession } from "@/lib/auth/guards";
import { payB2bInvoiceKlarna } from "@/lib/crm-client";

/**
 * POST /api/b2b/pay { invoiceId }
 *
 * BFF: il rivenditore loggato chiede al CRM un link Klarna per pagare online
 * il residuo della propria fattura. Il CRM valida l'ownership; l'esito del
 * pagamento torna al CRM via webhook (qui rimbalziamo solo il link).
 */
export async function POST(req: NextRequest) {
  // In una API route niente redirect 307: sessione assente = 401 JSON, il
  // bottone client rimanda al login mantenendo la pagina di ritorno.
  const ctx = await optionalB2bSession();
  if (!ctx) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sessione scaduta, accedi di nuovo." } },
      { status: 401 },
    );
  }

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
    if (err.code === "INVALID_SESSION" || err.code === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sessione scaduta, accedi di nuovo." } },
        { status: 401 },
      );
    }
    // Errori applicativi del CRM (es. "Fattura gia' saldata"): inoltra il
    // messaggio invece di appiattirlo in un generico 502.
    if (err.code === "INVALID_PAYLOAD") {
      return NextResponse.json(
        { error: { code: "INVALID_PAYLOAD", message: err.message } },
        { status: 400 },
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
