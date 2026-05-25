import "server-only";

import { crmFetch } from "./client";
import type {
  SiteRequestPayload,
  SiteRequestCreatedResponse,
} from "./types";

/**
 * Wrapper degli endpoint CRM intake richieste.
 * Vedi docs/architecture/CRM-BRIEF-B2B.md §2.2.3.
 *
 * - Se `sessionToken` è presente → /api/v1/b2b/requests (X-B2B-Session,
 *   rate-limit 30/h, source forzato lato CRM a "hub-b2b").
 * - Altrimenti → /api/v1/public/requests (rate-limit 10/h per IP, honeypot
 *   `hpf` propagato nel body).
 *
 * Il body include sempre `hpf` (anche stringa vuota): è il campo honeypot
 * popolato dal form HTML pubblico ma normalmente vuoto. Se il CRM lo riceve
 * non-vuoto risponde 201 "finta" e marca il record spam server-side.
 */

export async function postSiteRequest(
  payload: SiteRequestPayload,
  sessionToken?: string,
): Promise<SiteRequestCreatedResponse> {
  if (sessionToken) {
    return crmFetch<SiteRequestCreatedResponse>("/api/v1/b2b/requests", {
      method: "POST",
      body: payload,
      extraHeaders: { "X-B2B-Session": sessionToken },
    });
  }
  return crmFetch<SiteRequestCreatedResponse>("/api/v1/public/requests", {
    method: "POST",
    body: payload,
  });
}
