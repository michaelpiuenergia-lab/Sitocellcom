import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";
import type { CustomerProfile } from "@/lib/crm-client/types";

/**
 * Sessione cliente finale (B2C) lato HUB: cookie HttpOnly firmato HMAC-SHA256.
 * Speculare a lib/auth/session.ts (B2B) ma con cookie separato, così le due
 * sessioni coesistono (un rivenditore può anche avere un account cliente).
 *
 * Il cookie trasporta il token opaque rilasciato dal CRM. Il profilo "fresco"
 * si ricarica via customerMe() quando serve.
 */

const COOKIE_NAME = "customer_session";
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60;

type CustomerSessionPayload = {
  sessionToken: string;
  customerId: string;
  expiresAt: string;
};

function getSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
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
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encode(payload: CustomerSessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(cookieValue: string): CustomerSessionPayload | null {
  const [body, sig] = cookieValue.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as CustomerSessionPayload;
    if (!parsed.sessionToken || !parsed.customerId || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setCustomerSessionCookie(
  sessionToken: string,
  customer: CustomerProfile,
  expiresAt: string,
): Promise<void> {
  const value = encode({ sessionToken, customerId: customer.id, expiresAt });
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

export async function clearCustomerSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function readCustomerSession(): Promise<CustomerSessionPayload | null> {
  const jar = await cookies();
  const c = jar.get(COOKIE_NAME);
  if (!c) return null;
  return decode(c.value);
}

export const CUSTOMER_SESSION_COOKIE_NAME = COOKIE_NAME;
