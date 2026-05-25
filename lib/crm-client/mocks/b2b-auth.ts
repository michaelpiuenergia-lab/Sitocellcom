import type { B2bCustomer, B2bPricingTier } from "../types";

/**
 * Mock B2B accounts. Sostituiti dalle API CRM quando esposte (vedi
 * docs/architecture/CRM-BRIEF-B2B.md §2.2.1).
 *
 * SOLO per sviluppo locale: nessuna di queste credenziali deve esistere in prod.
 */

export const MOCK_TIERS: Record<string, B2bPricingTier> = {
  rivenditore: {
    id: "tier-rivenditore",
    code: "RIVENDITORE",
    name: "Rivenditore",
  },
  operatore: {
    id: "tier-operatore",
    code: "OPERATORE",
    name: "Operatore",
  },
  vip: {
    id: "tier-vip",
    code: "VIP",
    name: "VIP Premium",
  },
};

type MockB2bAccount = {
  customer: B2bCustomer;
  password: string;
};

export const MOCK_B2B_ACCOUNTS: MockB2bAccount[] = [
  {
    customer: {
      id: "b2b-admin",
      name: "Admin Cellcom",
      company: "Gruppo Cellcom",
      vatNumber: null,
      email: "admin@cellcom.it",
      pricingTier: MOCK_TIERS.vip,
    },
    password: "admin",
  },
  {
    customer: {
      id: "b2b-001",
      name: "Marco Bianchi",
      company: "TecnoStore Milano S.r.l.",
      vatNumber: "IT01234567890",
      email: "rivenditore@demo.cellcom.it",
      pricingTier: MOCK_TIERS.rivenditore,
    },
    password: "demo1234",
  },
  {
    customer: {
      id: "b2b-002",
      name: "Giulia Rossi",
      company: "PhoneRepair Roma",
      vatNumber: "IT09876543210",
      email: "operatore@demo.cellcom.it",
      pricingTier: MOCK_TIERS.operatore,
    },
    password: "demo1234",
  },
  {
    customer: {
      id: "b2b-003",
      name: "Alessandro Verdi",
      company: "MobileGroup Italia S.p.A.",
      vatNumber: "IT11223344556",
      email: "vip@demo.cellcom.it",
      pricingTier: MOCK_TIERS.vip,
    },
    password: "demo1234",
  },
];

/**
 * Sconto applicato dai mock tiers al prezzo pubblico.
 * In prod il CRM applica il listino reale (tier_prices + customer_prices).
 */
export const MOCK_TIER_DISCOUNT: Record<string, number> = {
  RIVENDITORE: 0.18, // -18%
  OPERATORE: 0.12, // -12%
  VIP: 0.25, // -25%
};
