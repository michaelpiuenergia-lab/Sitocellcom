import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customerRegister } from "@/lib/crm-client";
import { setCustomerSessionCookie } from "@/lib/auth/customer-session";

const RegisterBodySchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email().max(180),
  password: z.string().min(8, "Minimo 8 caratteri").max(200),
  phone: z.string().max(40).optional().nullable(),
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

  const parsed = RegisterBodySchema.safeParse(body);
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
    const result = await customerRegister({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone ?? null,
    });
    await setCustomerSessionCookie(
      result.sessionToken,
      result.customer,
      result.expiresAt,
    );
    return NextResponse.json(
      { customer: result.customer, expiresAt: result.expiresAt },
      { status: 201 },
    );
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: { code: "EMAIL_EXISTS", message: "Email già registrata. Accedi invece." } },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 500 },
    );
  }
}
