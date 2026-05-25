import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";
import type { B2bCustomer } from "@/lib/crm-client/types";

/**
 * Sessione B2B lato HUB: cookie HttpOnly firmato HMAC-SHA256.
 *
 * Niente NextAuth, niente DB locale. Il cookie trasporta solo il token opaque
 * rilasciato dal CRM (vedi POST /api/v1/b2b/login in CRM-BRIEF-B2B.md §2.2.1) +
 * meta minime ridondanti per evitare un roundtrip al CRM ad ogni request.
 *
 * Il `customer` "fresco" si ricarica via b2bMe() server-side quando serve.
 */

const COOKIE_NAME = "b2b_session";
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60; // 24h, allineato a CRM session TTL

type SessionPayload = {
  sessionToken: string; // token opaque CRM
  customerId: string;
  tierCode: string | null;
  expiresAt: string; // ISO
};

function getSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    // Fail-soft solo in dev: produce comunque una firma, ma con secret di
    // default insicuro. In prod questa è la causa più probabile di un session
    // hijack se non configurato.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_COOKIE_SECRET mancante o troppo corto in produzione (min 32 char)",
      );
    }
    return "dev-only-insecure-secret-do-not-use-in-prod-0000000000";
  }
  return secret;
}

function sign(value: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

function encode(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json, "utf8").toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

function decode(cookieValue: string): SessionPayload | null {
  const [body, sig] = cookieValue.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  // Confronto in tempo costante
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }
  try {
    const json = Buffer.from(body, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as SessionPayload;
    if (!parsed.sessionToken || !parsed.customerId || !parsed.expiresAt) {
      return null;
    }
    if (new Date(parsed.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setB2bSessionCookie(
  sessionToken: string,
  customer: B2bCustomer,
  expiresAt: string,
): Promise<void> {
  const payload: SessionPayload = {
    sessionToken,
    customerId: customer.id,
    tierCode: customer.pricingTier?.code ?? null,
    expiresAt,
  };
  const value = encode(payload);
  const jar = await cookies();
  jar.set({
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearB2bSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function readB2bSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const c = jar.get(COOKIE_NAME);
  if (!c) return null;
  return decode(c.value);
}

export const B2B_SESSION_COOKIE_NAME = COOKIE_NAME;
