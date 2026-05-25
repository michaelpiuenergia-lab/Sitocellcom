import type {
  SiteRequestPayload,
  SiteRequestCreatedResponse,
} from "../types";

/**
 * Mock dell'intake richieste. In prod il CRM persiste in `site_requests`
 * (vedi CRM-BRIEF-B2B.md §2.1.6).
 *
 * In sviluppo logga la richiesta + ritorna un id finto. Nessuna persistenza:
 * a ogni hot-reload la lista riparte da zero.
 */

// Persist su globalThis per resistere al module reload Next.js HMR.
type GlobalWithStore = typeof globalThis & {
  __siteRequestsMockStore?: Array<
    SiteRequestPayload & { id: string; createdAt: string }
  >;
};
const g = globalThis as GlobalWithStore;
const memoryStore =
  g.__siteRequestsMockStore ?? (g.__siteRequestsMockStore = []);

export async function postSiteRequest(
  payload: SiteRequestPayload,
): Promise<SiteRequestCreatedResponse> {
  const id = `req-mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const createdAt = new Date().toISOString();
  memoryStore.push({ ...payload, id, createdAt });

  if (process.env.NODE_ENV !== "test") {
    console.info("[mock] site_requests insert", {
      id,
      kind: payload.kind,
      source: payload.source,
      customer: payload.customer.email,
      product: payload.product?.slug ?? null,
    });
  }

  return { id, status: "da-gestire", createdAt };
}

/** Solo per debug locale — non riflette dati CRM reali */
export function listMockRequests() {
  return [...memoryStore];
}
