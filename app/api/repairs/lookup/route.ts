import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lookupRepair } from "@/lib/crm-client";

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
      { error: { code: "INVALID_PARAM", message: parsed.error.issues[0]?.message ?? "Dati non validi" } },
      { status: 400 },
    );
  }

  try {
    const repair = await lookupRepair(parsed.data.ticket, parsed.data.phone);
    if (!repair) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Ticket non trovato. Verifica i dati inseriti." } },
        { status: 404 },
      );
    }
    return NextResponse.json(repair, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 502 },
    );
  }
}
