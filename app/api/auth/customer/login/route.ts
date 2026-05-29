import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customerLogin } from "@/lib/crm-client";
import { CrmApiError } from "@/lib/crm-client/client";
import { setCustomerSessionCookie } from "@/lib/auth/customer-session";

const LoginBodySchema = z.object({
  email: z.string().email().max(180),
  password: z.string().min(1).max(200),
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

  const parsed = LoginBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_PAYLOAD", message: "Email o password non valida" } },
      { status: 400 },
    );
  }

  try {
    const result = await customerLogin(parsed.data);
    await setCustomerSessionCookie(
      result.sessionToken,
      result.customer,
      result.expiresAt,
    );
    return NextResponse.json(
      { customer: result.customer, expiresAt: result.expiresAt },
      { status: 200 },
    );
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Email o password non corretti" } },
        { status: 401 },
      );
    }
    if (err.code === "RATE_LIMITED") {
      const retryAfter = e instanceof CrmApiError && e.retryAfter ? e.retryAfter : 60;
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: `Troppi tentativi. Riprova fra ${Math.ceil(retryAfter / 60)} minuti.`,
          },
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Errore temporaneo, riprova tra qualche secondo" } },
      { status: 500 },
    );
  }
}
