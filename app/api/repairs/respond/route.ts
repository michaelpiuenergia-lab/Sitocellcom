import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { respondToQuote } from "@/lib/crm-client";

const BodySchema = z.object({
  ticket: z.string().min(3).max(40),
  phone: z.string().regex(/^\d{4,6}$/, "Inserisci le ultime 4-6 cifre"),
  action: z.enum(["accept", "decline"]),
  reason: z.string().max(500).optional().nullable(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body JSON non valido" } },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_PAYLOAD", message: parsed.error.issues[0]?.message ?? "Dati non validi" } },
      { status: 400 },
    );
  }

  try {
    const repair = await respondToQuote(
      parsed.data.ticket,
      parsed.data.phone,
      parsed.data.action,
      parsed.data.reason ?? null,
    );
    return NextResponse.json(repair, { status: 200 });
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Ticket non trovato." } },
        { status: 404 },
      );
    }
    if (err.code === "CONFLICT") {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "Questo preventivo non è più in attesa di risposta." } },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 502 },
    );
  }
}
