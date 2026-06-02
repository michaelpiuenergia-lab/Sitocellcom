import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { b2bUpdateCustomer } from "@/lib/crm-client";
import { requireB2bSession } from "@/lib/auth/guards";

const Body = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().max(180).optional(),
    phone: z.string().max(40).optional(),
    currentPassword: z.string().min(1).max(200).optional(),
    newPassword: z.string().min(8, "Minimo 8 caratteri").max(200).optional(),
  })
  .refine(
    (d) => !d.newPassword || (d.currentPassword && d.currentPassword.length > 0),
    { message: "Per cambiare password serve la password attuale" },
  );

export async function POST(req: NextRequest) {
  const ctx = await requireB2bSession();

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
    const customer = await b2bUpdateCustomer(ctx.sessionToken, parsed.data);
    return NextResponse.json({ customer }, { status: 200 });
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: err.message } },
        { status: 401 },
      );
    }
    if (err.code === "INVALID_PAYLOAD") {
      return NextResponse.json(
        { error: { code: "INVALID_PAYLOAD", message: err.message } },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova" } },
      { status: 502 },
    );
  }
}
