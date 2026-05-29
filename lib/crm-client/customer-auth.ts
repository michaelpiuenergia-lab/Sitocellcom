import "server-only";

import { crmFetch } from "./client";
import type {
  CustomerLoginRequest,
  CustomerLoginResponse,
  CustomerProfile,
  CustomerRegisterRequest,
  CustomerRepairsResponse,
} from "./types";

/**
 * Wrapper degli endpoint CRM auth cliente finale (B2C).
 *
 * Speculari ai B2B (lib/crm-client/auth.ts) ma per i customer non-B2B
 * (category locale/riparazione). Header sessione: X-Customer-Session.
 *
 * RICHIEDE che il CRM esponga questi endpoint pubblici (vedi brief inviato):
 *   POST /api/v1/public/customer/login | register | logout
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

export async function customerRegister(
  body: CustomerRegisterRequest,
): Promise<CustomerLoginResponse> {
  return crmFetch<CustomerLoginResponse>("/api/v1/public/customer/register", {
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
