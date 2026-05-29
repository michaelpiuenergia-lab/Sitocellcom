import type { CustomerProfile } from "../types";

/**
 * Mock account cliente finale (B2C) — solo sviluppo locale, sostituiti
 * dalle API CRM quando esposte. Nessuna di queste credenziali in prod.
 *
 * Le riparazioni del cliente vivono in mocks/repairs.ts (fonte unica) e si
 * leggono via listRepairsByCustomer(customer.id).
 */

type MockCustomerAccount = {
  customer: CustomerProfile;
  password: string;
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
