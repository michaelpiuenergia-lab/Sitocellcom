import "server-only";

import { crmFetch } from "./client";
import type {
  B2bProductDetail,
  B2bProductListResponse,
  PublicChannel,
  PublicCondition,
  PublicKind,
} from "./types";

/**
 * Stessa shape del mock (lib/crm-client/mocks/b2b-products.ts). Il mock usa
 * customerId/tierCode per simulare il pricing; il real li ignora e si affida
 * a `sessionToken` (il CRM risolve customer + tier dalla sessione).
 */
type B2bContext = {
  sessionToken: string;
  customerId: string;
  tierCode: string | null;
};

type ListFilters = {
  channel?: PublicChannel;
  search?: string;
  category?: string;
  condition?: PublicCondition;
  brand?: string;
  kind?: PublicKind;
  compatibleModels?: string;
  limit?: number;
  offset?: number;
};

/**
 * Wrapper degli endpoint CRM B2B products.
 * Vedi docs/architecture/CRM-BRIEF-B2B.md §2.2.2.
 *
 * Cache: no-store (i prezzi sono per-customer, non condividere fra sessioni).
 * Header obbligatorio: X-B2B-Session.
 */

export async function getB2bProducts(
  ctx: B2bContext,
  filters: ListFilters = {},
): Promise<B2bProductListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  const path = `/api/v1/b2b/products${qs ? `?${qs}` : ""}`;

  return crmFetch<B2bProductListResponse>(path, {
    cache: "no-store",
    extraHeaders: { "X-B2B-Session": ctx.sessionToken },
  });
}

export async function getB2bProductBySlug(
  ctx: B2bContext,
  slug: string,
  channel?: PublicChannel,
): Promise<B2bProductDetail> {
  const qs = channel ? `?channel=${channel}` : "";
  return crmFetch<B2bProductDetail>(
    `/api/v1/b2b/products/${encodeURIComponent(slug)}${qs}`,
    {
      cache: "no-store",
      extraHeaders: { "X-B2B-Session": ctx.sessionToken },
    },
  );
}
