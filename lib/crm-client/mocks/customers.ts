import type { CustomerProfile, RepairPublic } from "../types";

/**
 * Mock account cliente finale (B2C) — solo sviluppo locale, sostituiti
 * dalle API CRM quando esposte. Nessuna di queste credenziali in prod.
 */

type MockCustomerAccount = {
  customer: CustomerProfile;
  password: string;
  repairs: RepairPublic[];
};

export const MOCK_CUSTOMER_ACCOUNTS: MockCustomerAccount[] = [
  {
    customer: {
      id: "cust-001",
      name: "Mario Rossi",
      email: "cliente@demo.cellcom.it",
      phone: "3331234567",
    },
    password: "demo1234",
    repairs: [
      {
        ticketNumber: "TKT-2026-0042",
        status: "in_repair",
        deviceBrand: "Apple",
        deviceModel: "iPhone 15 Pro",
        imeiMasked: "35****0123",
        defectReported: "Schermo rotto, touch non risponde",
        defectDiagnosed: "Sostituzione display OLED",
        quote: {
          status: "approved",
          amountCents: 18900,
          description: "Sostituzione display OLED originale + sigillatura",
          validUntil: "2026-05-28T00:00:00.000Z",
          sentAt: "2026-05-20T14:00:00.000Z",
          respondedAt: "2026-05-20T16:15:00.000Z",
        },
        statusHistory: [
          { status: "accepted", note: "Dispositivo ricevuto in negozio", timestamp: "2026-05-20T09:00:00.000Z" },
          { status: "diagnosed", note: "Diagnosi: sostituzione display OLED", timestamp: "2026-05-20T11:30:00.000Z" },
          { status: "in_repair", note: "Sostituzione in corso", timestamp: "2026-05-21T08:00:00.000Z" },
        ],
        createdAt: "2026-05-20T09:00:00.000Z",
        updatedAt: "2026-05-21T08:00:00.000Z",
      },
      {
        ticketNumber: "TKT-2026-0051",
        status: "diagnosed",
        deviceBrand: "Samsung",
        deviceModel: "Galaxy S24 Ultra",
        imeiMasked: "35****9876",
        defectReported: "Batteria si scarica in poche ore",
        defectDiagnosed: "Batteria degradata",
        quote: {
          status: "sent",
          amountCents: 8900,
          description: "Sostituzione batteria originale Samsung",
          validUntil: "2026-06-05T00:00:00.000Z",
          sentAt: "2026-05-29T10:00:00.000Z",
          respondedAt: null,
        },
        statusHistory: [
          { status: "accepted", note: "Dispositivo ricevuto", timestamp: "2026-05-29T08:30:00.000Z" },
          { status: "diagnosed", note: "Diagnosi: batteria degradata", timestamp: "2026-05-29T10:00:00.000Z" },
        ],
        createdAt: "2026-05-29T08:30:00.000Z",
        updatedAt: "2026-05-29T10:00:00.000Z",
      },
    ],
  },
];

export function findMockCustomerByEmail(email: string) {
  return MOCK_CUSTOMER_ACCOUNTS.find(
    (a) => a.customer.email.toLowerCase() === email.toLowerCase(),
  );
}

export function findMockCustomerById(id: string) {
  return MOCK_CUSTOMER_ACCOUNTS.find((a) => a.customer.id === id);
}
