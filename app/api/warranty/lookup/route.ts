import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lookupWarrantyByTicket } from "@/lib/crm-client";
import { CrmApiError } from "@/lib/crm-client/client";

/**
 * Proxy della ricerca garanzia a mano.
 *
 * Esiste perche' la chiamata al CRM deve restare server-to-server: una fetch
 * dal browser esporrebbe CRM_API_KEY e verrebbe comunque respinta dal
 * controllo di origine del CRM. Il percorso col token, invece, e' risolto
 * direttamente dalla pagina e non passa di qui.
 */

const QuerySchema = z.object({
  ticket: z.string().min(3).max(40),
  phone: z.string().regex(/^\d{4,6}$/, "Inserisci le ultime 4-6 cifre"),
});

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const parsed = QuerySchema.safeParse({
    ticket: sp.get("ticket") ?? "",
    phone: sp.get("phone") ?? "",
  });
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PARAM",
          message: parsed.error.issues[0]?.message ?? "Dati non validi",
        },
      },
      { status: 400 },
    );
  }

  try {
    const warranty = await lookupWarrantyByTicket(parsed.data.ticket, parsed.data.phone);
    if (!warranty) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message:
              "Nessuna riparazione trovata. Controlla il numero e le ultime cifre del telefono.",
          },
        },
        { status: 404 },
      );
    }
    return NextResponse.json(warranty, { status: 200 });
  } catch (e) {
    // Il CRM limita i tentativi: senza questo ramo un cliente bloccato
    // leggerebbe "errore temporaneo" e continuerebbe a ritentare a vuoto.
    if (e instanceof CrmApiError && e.status === 429) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Troppi tentativi. Riprova tra qualche minuto.",
          },
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 502 },
    );
  }
}
