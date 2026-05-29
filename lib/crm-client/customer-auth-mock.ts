import "server-only";

import type {
  CustomerLoginRequest,
  CustomerLoginResponse,
  CustomerProfile,
  CustomerRegisterRequest,
  CustomerRepairsResponse,
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

export async function customerRegister(
  body: CustomerRegisterRequest,
): Promise<CustomerLoginResponse> {
  if (findMockCustomerByEmail(body.email)) {
    throw authError("EMAIL_EXISTS", "Email già registrata");
  }
  const customer: CustomerProfile = {
    id: `cust-${Math.random().toString(36).slice(2, 8)}`,
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  MOCK_CUSTOMER_ACCOUNTS.push({ customer, password: body.password });
  return issueSession(customer);
}

export async function customerLogout(sessionToken: string): Promise<void> {
  SESSIONS.delete(sessionToken);
}

function requireSession(sessionToken: string): string {
  const session = SESSIONS.get(sessionToken);
  if (!session) throw authError("UNAUTHORIZED", "Sessione non valida");
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    SESSIONS.delete(sessionToken);
    throw authError("UNAUTHORIZED", "Sessione scaduta");
  }
  return session.customerId;
}

export async function customerMe(
  sessionToken: string,
): Promise<CustomerProfile> {
  const customerId = requireSession(sessionToken);
  const account = findMockCustomerById(customerId);
  if (!account) throw authError("UNAUTHORIZED", "Cliente non trovato");
  return account.customer;
}

export async function customerRepairs(
  sessionToken: string,
): Promise<CustomerRepairsResponse> {
  const customerId = requireSession(sessionToken);
  const items = listRepairsByCustomer(customerId);
  return { items, total: items.length };
}
