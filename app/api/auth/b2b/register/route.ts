import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { b2bRegister } from "@/lib/crm-client";
import { log } from "@/lib/log";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  companyName: z.string().min(1).max(180),
  vatNumber: z
    .string()
    .max(40)
    .regex(/^[A-Za-z0-9]*$/, "P.IVA non valida")
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(40)
    .regex(/^[+0-9 ()\-./]*$/, "Telefono non valido")
    .optional()
    .nullable(),
  // GDPR: consenso esplicito obbligatorio (checkbox del form). Senza, 400.
  privacyAccepted: z.literal(true, {
    message: "È necessario accettare l'informativa privacy per registrarsi",
  }),
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
          message: parsed.error.issues[0]?.message ?? "Dati non validi",
        },
      },
      { status: 400 },
    );
  }

  try {
    await b2bRegister(parsed.data);
    // Sempre 200 — no user-enumeration: anche se l'email è già registrata
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    log.warn("b2b register upstream error", {
      msg: e instanceof Error ? e.message : "unknown",
    });
    // Risponde comunque ok — no leak
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
