import "server-only";

import { crmFetch } from "./client";
import type {
  B2bCustomer,
  B2bLoginRequest,
  B2bLoginResponse,
  B2bPasswordRequestInput,
  B2bPasswordResetInput,
  B2bProfileUpdateInput,
} from "./types";

/**
 * Wrapper degli endpoint CRM B2B auth.
 * Vedi docs/architecture/CRM-BRIEF-B2B.md §2.2.1.
 *
 * Errori propagati come `CrmApiError` (proprietà `code`, `status`):
 *   - INVALID_CREDENTIALS (401) — login fallito
 *   - NOT_B2B            (403) — account valido ma non abilitato B2B
 *   - INVALID_SESSION    (401) — token sessione invalido/scaduto/revocato
 *   - RATE_LIMITED       (429) — troppi tentativi (Retry-After header)
 */

export async function b2bLogin(
  body: B2bLoginRequest,
): Promise<B2bLoginResponse> {
  return crmFetch<B2bLoginResponse>("/api/v1/b2b/login", {
    method: "POST",
    body,
  });
}

export async function b2bLogout(sessionToken: string): Promise<void> {
  await crmFetch<void>("/api/v1/b2b/logout", {
    method: "POST",
    extraHeaders: { "X-B2B-Session": sessionToken },
  });
}

export async function b2bMe(sessionToken: string): Promise<B2bCustomer> {
  // /b2b/me: refresh sliding +24h server-side, niente cache lato HUB.
  const res = await crmFetch<{ customer: B2bCustomer } | B2bCustomer>(
    "/api/v1/b2b/me",
    {
      cache: "no-store",
      extraHeaders: { "X-B2B-Session": sessionToken },
    },
  );
  // CRM ritorna direttamente il customer (allineato a §2.2.1: "Risposta uguale
  // al campo customer del login"). Tolleriamo anche envelope { customer } per
  // sicurezza in caso di evoluzioni future.
  return "customer" in res ? res.customer : res;
}

/**
 * Recupero password B2B (Brief §10 CRM). L'endpoint manda email con link
 * verso HUB_BASE_URL/b2b/reimposta-password?token=... ; risponde 200 anche
 * se l'email non esiste (no user-enumeration).
 */
export async function b2bRequestPasswordReset(
  body: B2bPasswordRequestInput,
): Promise<{ ok: true }> {
  return crmFetch<{ ok: true }>("/api/v1/b2b/password/request", {
    method: "POST",
    body,
  });
}

export async function b2bResetPassword(
  body: B2bPasswordResetInput,
): Promise<{ ok: true; sessionsRevoked?: number }> {
  return crmFetch<{ ok: true; sessionsRevoked?: number }>(
    "/api/v1/b2b/password/reset",
    {
      method: "POST",
      body,
    },
  );
}

/**
 * Modifica profilo + cambio password del cliente B2B autenticato.
 */
export async function b2bUpdateCustomer(
  sessionToken: string,
  body: B2bProfileUpdateInput,
): Promise<B2bCustomer> {
  const res = await crmFetch<{ customer: B2bCustomer } | B2bCustomer>(
    "/api/v1/b2b/customer/update",
    {
      method: "POST",
      body,
      extraHeaders: { "X-B2B-Session": sessionToken },
    },
  );
  return "customer" in res ? res.customer : res;
}

/**
 * Forza rigenerazione listino B2B (cache-bust lato CRM + ricalcolo).
 */
export async function b2bRegenerateListino(
  sessionToken: string,
): Promise<{ ok: true; regeneratedAt: string }> {
  return crmFetch<{ ok: true; regeneratedAt: string }>(
    "/api/v1/b2b/products/regenerate-listino",
    {
      method: "POST",
      body: {},
      extraHeaders: { "X-B2B-Session": sessionToken },
    },
  );
}
