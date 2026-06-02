import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { b2bRequestPasswordReset } from "@/lib/crm-client";
import { log } from "@/lib/log";

const Body = z.object({
  email: z.string().email().max(180),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body non valido" } },
      { status: 400 },
    );
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: parsed.error.issues[0]?.message ?? "Email non valida",
        },
      },
      { status: 400 },
    );
  }
  try {
    await b2bRequestPasswordReset(parsed.data);
    // Risposta sempre 200 — no user-enumeration
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore";
    log.warn("b2b password request failed (silent to client)", { msg });
    // Anche su errore CRM rispondiamo 200 — no leak
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
