import "server-only";

import { crmFetch } from "./client";
import type { RepairPublic, RepairQuoteAction } from "./types";

/**
 * Tracking riparazioni pubblico. RICHIEDE che il CRM esponga (vedi brief):
 *   GET  /api/v1/public/repairs/lookup?ticket=&phoneSuffix=
 *   POST /api/v1/public/repairs/{ticket}/accept | /decline
 *
 * lookup ritorna null su 404 (ticket+telefono non combaciano).
 */

export async function lookupRepair(
  ticket: string,
  phoneSuffix: string,
): Promise<RepairPublic | null> {
  const qs = new URLSearchParams({ ticket, phoneSuffix }).toString();
  try {
    return await crmFetch<RepairPublic>(
      `/api/v1/public/repairs/lookup?${qs}`,
      { cache: "no-store" },
    );
  } catch (e) {
    if ((e as { status?: number }).status === 404) return null;
    throw e;
  }
}

export async function respondToQuote(
  ticket: string,
  phoneSuffix: string,
  action: RepairQuoteAction,
  reason?: string | null,
): Promise<RepairPublic> {
  const path = `/api/v1/public/repairs/${encodeURIComponent(ticket)}/${action}`;
  return crmFetch<RepairPublic>(path, {
    method: "POST",
    body: { phoneSuffix, reason: reason ?? null },
  });
}
