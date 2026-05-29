import { NextRequest, NextResponse } from "next/server";
import { requireB2bSession } from "@/lib/auth/guards";
import { acceptB2bQuote } from "@/lib/crm-client";

type RouteParams = Promise<{ id: string }>;

export async function POST(
  _req: NextRequest,
  { params }: { params: RouteParams },
) {
  const { id } = await params;
  const ctx = await requireB2bSession();

  try {
    const result = await acceptB2bQuote(ctx.sessionToken, id);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "NOT_FOUND") {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Preventivo non trovato" } },
        { status: 404 },
      );
    }
    if (err.code === "CONFLICT") {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "Preventivo non più accettabile" } },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova" } },
      { status: 502 },
    );
  }
}
