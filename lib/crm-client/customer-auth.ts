import "server-only";

import { crmFetch } from "./client";
import type {
  CustomerLoginRequest,
  CustomerLoginResponse,
  CustomerProfile,
  CustomerRepairsResponse,
  CustomerSetPasswordRequest,
} from "./types";

/**
 * Wrapper degli endpoint CRM auth cliente finale (B2C).
 * Speculari ai B2B ma con header X-Customer-Session.
 *
 * Onboarding: NO self-register. Lo staff CRM invita il cliente via email
 * (token monouso, 7gg) → la pagina HUB /imposta-password chiama setPassword.
 *
 * Endpoint CRM:
 *   POST /api/v1/public/customer/login | logout | set-password
 *   GET  /api/v1/public/customer/me | repairs
 */

export async function customerLogin(
  body: CustomerLoginRequest,
): Promise<CustomerLoginResponse> {
  return crmFetch<CustomerLoginResponse>("/api/v1/public/customer/login", {
    method: "POST",
    body,
  });
}

export async function customerSetPassword(
  body: CustomerSetPasswordRequest,
): Promise<{ ok: true }> {
  return crmFetch<{ ok: true }>("/api/v1/public/customer/set-password", {
    method: "POST",
    body,
  });
}

export async function customerLogout(sessionToken: string): Promise<void> {
  await crmFetch<void>("/api/v1/public/customer/logout", {
    method: "POST",
    extraHeaders: { "X-Customer-Session": sessionToken },
  });
}

export async function customerMe(
  sessionToken: string,
): Promise<CustomerProfile> {
  const res = await crmFetch<{ customer: CustomerProfile } | CustomerProfile>(
    "/api/v1/public/customer/me",
    {
      cache: "no-store",
      extraHeaders: { "X-Customer-Session": sessionToken },
    },
  );
  return "customer" in res ? res.customer : res;
}

export async function customerRepairs(
  sessionToken: string,
): Promise<CustomerRepairsResponse> {
  return crmFetch<CustomerRepairsResponse>(
    "/api/v1/public/customer/repairs",
    {
      cache: "no-store",
      extraHeaders: { "X-Customer-Session": sessionToken },
    },
  );
}
