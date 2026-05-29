import "server-only";

import type {
  CustomerLoginRequest,
  CustomerLoginResponse,
  CustomerProfile,
  CustomerRepairsResponse,
  CustomerSetPasswordRequest,
} from "./types";
import {
  MOCK_CUSTOMER_ACCOUNTS,
  findMockCustomerByEmail,
  findMockCustomerById,
} from "./mocks/customers";
import { listRepairsByCustomer } from "./mocks/repairs";

/**
 * Mock auth cliente B2C. Sostituisce ./customer-auth.ts finché il CRM non
 * espone i veri endpoint. Token mock non sicuro; il cookie HttpOnly è
 * comunque firmato in lib/auth/customer-session.ts.
 *
 * Mock invite token: per testare set-password in dev usa
 *   /imposta-password?token=invite-cust-001-demo
 * (associa la nuova password a cliente@demo.cellcom.it).
 */

type GlobalWithSessions = typeof globalThis & {
  __customerMockSessions?: Map<string, { customerId: string; expiresAt: string }>;
};
const g = globalThis as GlobalWithSessions;
const SESSIONS =
  g.__customerMockSessions ?? (g.__customerMockSessions = new Map());

function generateToken(customerId: string): string {
  return `mockc-${customerId}-${Math.random().toString(36).slice(2, 14)}`;
}

function issueSession(customer: CustomerProfile): CustomerLoginResponse {
  const token = generateToken(customer.id);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  SESSIONS.set(token, { customerId: customer.id, expiresAt });
  return { sessionToken: token, expiresAt, customer };
}

function authError(code: string, message: string): Error {
  const err = new Error(message);
  (err as Error & { code?: string }).code = code;
  return err;
}

export async function customerLogin(
  body: CustomerLoginRequest,
): Promise<CustomerLoginResponse> {
  const account = findMockCustomerByEmail(body.email);
  if (!account || account.password !== body.password) {
    throw authError("INVALID_CREDENTIALS", "Credenziali non valide");
  }
  return issueSession(account.customer);
}

/**
 * Mock set-password. Token format: `invite-<customerId>-<random>`.
 * In dev usa `invite-cust-001-demo` per il seed account.
 */
export async function customerSetPassword(
  body: CustomerSetPasswordRequest,
): Promise<{ ok: true }> {
  const match = body.token.match(/^invite-(.+?)-[a-z0-9]+$/i);
  if (!match) {
    throw authError("INVALID_TOKEN", "Link non valido o scaduto");
  }
  const customerId = match[1];
  const account = MOCK_CUSTOMER_ACCOUNTS.find((a) => a.customer.id === customerId);
  if (!account) {
    throw authError("INVALID_TOKEN", "Link non valido o scaduto");
  }
  if (body.password.length < 8) {
    throw authError("INVALID_PAYLOAD", "Minimo 8 caratteri");
  }
  account.password = body.password;
  return { ok: true };
}

export async function customerLogout(sessionToken: string): Promise<void> {
  SESSIONS.delete(sessionToken);
}

function requireSession(sessionToken: string): string {
  const session = SESSIONS.get(sessionToken);
  if (!session) throw authError("INVALID_SESSION", "Sessione non valida");
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    SESSIONS.delete(sessionToken);
    throw authError("INVALID_SESSION", "Sessione scaduta");
  }
  return session.customerId;
}

export async function customerMe(
  sessionToken: string,
): Promise<CustomerProfile> {
  const customerId = requireSession(sessionToken);
  const account = findMockCustomerById(customerId);
  if (!account) throw authError("INVALID_SESSION", "Cliente non trovato");
  return account.customer;
}

export async function customerRepairs(
  sessionToken: string,
): Promise<CustomerRepairsResponse> {
  const customerId = requireSession(sessionToken);
  // In lista lo statusHistory è vuoto (vedi doc CRM §3) — per il dettaglio
  // si chiama lookupRepair.
  const repairs = listRepairsByCustomer(customerId).map((r) => ({
    ...r,
    statusHistory: [],
  }));
  return { repairs };
}
