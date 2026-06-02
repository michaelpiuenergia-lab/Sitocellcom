import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { b2bLogin } from "@/lib/crm-client";
import { CrmApiError } from "@/lib/crm-client/client";
import { setB2bSessionCookie } from "@/lib/auth/session";

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
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: "Email o password non valida",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await b2bLogin(parsed.data);
    await setB2bSessionCookie(
      result.sessionToken,
      result.customer,
      result.expiresAt,
    );
    return NextResponse.json(
      {
        customer: result.customer,
        expiresAt: result.expiresAt,
      },
      { status: 200 },
    );
  } catch (e) {
    const err = e as Error & { code?: string };
    if (err.code === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Email o password non corretti",
          },
        },
        { status: 401 },
      );
    }
    if (err.code === "NOT_B2B") {
      return NextResponse.json(
        {
          error: {
            code: "NOT_B2B",
            message: "Account non abilitato all'area B2B",
          },
        },
        { status: 403 },
      );
    }
    if (err.code === "B2B_PENDING") {
      return NextResponse.json(
        {
          error: {
            code: "B2B_PENDING",
            message: "Account in attesa di approvazione",
          },
        },
        { status: 403 },
      );
    }
    if (err.code === "B2B_REJECTED") {
      return NextResponse.json(
        {
          error: {
            code: "B2B_REJECTED",
            message: "Richiesta B2B non approvata",
          },
        },
        { status: 403 },
      );
    }
    if (err.code === "RATE_LIMITED") {
      const retryAfter =
        e instanceof CrmApiError && e.retryAfter ? e.retryAfter : 60;
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
      {
        error: {
          code: "INTERNAL",
          message: "Errore temporaneo, riprova tra qualche secondo",
        },
      },
      { status: 500 },
    );
  }
}
