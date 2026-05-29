import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customerSetPassword } from "@/lib/crm-client";

const BodySchema = z.object({
  token: z.string().min(8).max(200),
  password: z.string().min(8, "Minimo 8 caratteri").max(200),
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
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: parsed.error.issues[0]?.message ?? "Dati non validi",
        },
      },
      { status: 400 },
    );
  }

  try {
    await customerSetPassword(parsed.data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "INVALID_TOKEN") {
      return NextResponse.json(
        { error: { code: "INVALID_TOKEN", message: "Link non valido o scaduto. Chiedi un nuovo invito." } },
        { status: 400 },
      );
    }
    if (err.code === "INVALID_PAYLOAD") {
      return NextResponse.json(
        { error: { code: "INVALID_PAYLOAD", message: err.message } },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 500 },
    );
  }
}
