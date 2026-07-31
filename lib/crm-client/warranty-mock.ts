import "server-only";

import type { WarrantyPublic } from "./types";

/**
 * Dati finti per sviluppo offline e per la suite di test (con NODE_ENV=test
 * l'indice forza i mock ovunque). Coprono i tre stati che la pagina deve
 * saper mostrare: attiva, scaduta, e consegnata senza garanzia registrata.
 */

const ACTIVE: WarrantyPublic = {
  device: "iPhone 14 Pro Max",
  deliveredAt: "2026-06-01T10:30:00.000Z",
  warranty: {
    months: 6,
    validUntil: "2026-12-01T10:30:00.000Z",
    daysRemaining: 123,
    active: true,
  },
};

const EXPIRED: WarrantyPublic = {
  device: "Samsung Galaxy S22",
  deliveredAt: "2025-01-15T09:00:00.000Z",
  warranty: {
    months: 3,
    validUntil: "2025-04-15T09:00:00.000Z",
    daysRemaining: -472,
    active: false,
  },
};

const NO_WARRANTY: WarrantyPublic = {
  device: "Xiaomi Redmi Note 12",
  deliveredAt: "2026-05-20T16:00:00.000Z",
  warranty: null,
};

const BY_TOKEN: Record<string, WarrantyPublic> = {
  "token-attiva": ACTIVE,
  "token-scaduta": EXPIRED,
  "token-senza": NO_WARRANTY,
};

export async function lookupWarrantyByToken(token: string): Promise<WarrantyPublic | null> {
  return BY_TOKEN[token] ?? null;
}

export async function lookupWarrantyByTicket(
  ticket: string,
  phoneSuffix: string,
): Promise<WarrantyPublic | null> {
  // Come il CRM: senza il suffisso telefonico giusto non si trova nulla.
  if (phoneSuffix.replace(/\D+/g, "").length < 4) return null;
  if (ticket === "TKT-2026-0001") return ACTIVE;
  if (ticket === "TKT-2025-0007") return EXPIRED;
  if (ticket === "TKT-2026-0042") return NO_WARRANTY;
  return null;
}
