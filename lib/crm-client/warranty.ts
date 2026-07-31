import "server-only";

import { crmFetch } from "./client";
import type { WarrantyPublic } from "./types";

/**
 * Verifica garanzia. Consuma dal CRM:
 *   GET /api/v1/public/warranty?token=            (QR sulla ricevuta)
 *   GET /api/v1/public/warranty/lookup?ticket=&phoneSuffix=   (ricerca a mano)
 *
 * Entrambi rispondono con la stessa forma, cosi' la pagina ha un tipo solo.
 * 404 -> null (token inesistente, oppure ticket e telefono che non combaciano).
 */

export async function lookupWarrantyByToken(token: string): Promise<WarrantyPublic | null> {
  const qs = new URLSearchParams({ token }).toString();
  try {
    return await crmFetch<WarrantyPublic>(`/api/v1/public/warranty?${qs}`, {
      cache: "no-store",
    });
  } catch (e) {
    if ((e as { status?: number }).status === 404) return null;
    throw e;
  }
}

export async function lookupWarrantyByTicket(
  ticket: string,
  phoneSuffix: string,
): Promise<WarrantyPublic | null> {
  const qs = new URLSearchParams({ ticket, phoneSuffix }).toString();
  try {
    return await crmFetch<WarrantyPublic>(`/api/v1/public/warranty/lookup?${qs}`, {
      cache: "no-store",
    });
  } catch (e) {
    if ((e as { status?: number }).status === 404) return null;
    throw e;
  }
}
