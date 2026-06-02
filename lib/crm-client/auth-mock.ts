import "server-only";

import type {
  B2bCustomer,
  B2bLoginRequest,
  B2bLoginResponse,
  B2bPasswordRequestInput,
  B2bPasswordResetInput,
  B2bProfileUpdateInput,
} from "./types";
import { MOCK_B2B_ACCOUNTS } from "./mocks/b2b-auth";

/**
 * Mock dell'auth B2B. Sostituisce ./auth.ts finché il CRM non espone i veri
 * endpoint (vedi CRM-BRIEF-B2B.md §2.2.1).
 *
 * Il token sessione mock è semplicemente `mock-<customerId>-<random>` —
 * non confondere con un token sicuro. La firma del cookie HttpOnly avviene
 * comunque in lib/auth/session.ts indipendentemente dal mock.
 */

// Persist mock store su globalThis per resistere al module reload di
// Next.js HMR. Senza questo, ogni route handler/Server Component ricarica
// auth-mock.ts con un Map vuoto e il login appena fatto risulta "scaduto".
type GlobalWithSessions = typeof globalThis & {
  __b2bMockSessions?: Map<string, { customerId: string; expiresAt: string }>;
};
const g = globalThis as GlobalWithSessions;
const SESSIONS =
  g.__b2bMockSessions ?? (g.__b2bMockSessions = new Map());

function generateToken(customerId: string): string {
  return `mock-${customerId}-${Math.random().toString(36).slice(2, 14)}`;
}

export async function b2bLogin(
  body: B2bLoginRequest,
): Promise<B2bLoginResponse> {
  const account = MOCK_B2B_ACCOUNTS.find(
    (a) => a.customer.email.toLowerCase() === body.email.toLowerCase(),
  );
  if (!account || account.password !== body.password) {
    const err = new Error("Credenziali non valide");
    (err as Error & { code?: string }).code = "INVALID_CREDENTIALS";
    throw err;
  }
  const token = generateToken(account.customer.id);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  SESSIONS.set(token, { customerId: account.customer.id, expiresAt });

  return {
    sessionToken: token,
    expiresAt,
    customer: account.customer,
  };
}

export async function b2bLogout(sessionToken: string): Promise<void> {
  SESSIONS.delete(sessionToken);
}

export async function b2bMe(sessionToken: string): Promise<B2bCustomer> {
  const session = SESSIONS.get(sessionToken);
  if (!session) {
    const err = new Error("Sessione non valida");
    (err as Error & { code?: string }).code = "UNAUTHORIZED";
    throw err;
  }
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    SESSIONS.delete(sessionToken);
    const err = new Error("Sessione scaduta");
    (err as Error & { code?: string }).code = "UNAUTHORIZED";
    throw err;
  }
  const account = MOCK_B2B_ACCOUNTS.find(
    (a) => a.customer.id === session.customerId,
  );
  if (!account) {
    const err = new Error("Cliente non trovato");
    (err as Error & { code?: string }).code = "UNAUTHORIZED";
    throw err;
  }
  return account.customer;
}

/**
 * Mock recupero password: in dev usa token `b2b-reset-<customerId>-demo`.
 * Es: /b2b/reimposta-password?token=b2b-reset-b2b-001-demo
 */
export async function b2bRequestPasswordReset(
  _body: B2bPasswordRequestInput,
): Promise<{ ok: true }> {
  // Mock no-op: il CRM reale risponde 200 anche se l'email non esiste
  return { ok: true };
}

export async function b2bResetPassword(
  body: B2bPasswordResetInput,
): Promise<{ ok: true; sessionsRevoked: number }> {
  const match = body.token.match(/^b2b-reset-(.+?)-[a-z0-9]+$/i);
  if (!match) {
    const err = new Error("Link non valido o scaduto");
    (err as Error & { code?: string }).code = "INVALID_TOKEN";
    throw err;
  }
  const customerId = match[1];
  const account = MOCK_B2B_ACCOUNTS.find((a) => a.customer.id === customerId);
  if (!account) {
    const err = new Error("Link non valido o scaduto");
    (err as Error & { code?: string }).code = "INVALID_TOKEN";
    throw err;
  }
  if (body.password.length < 8) {
    const err = new Error("Minimo 8 caratteri");
    (err as Error & { code?: string }).code = "INVALID_PAYLOAD";
    throw err;
  }
  account.password = body.password;
  // Mock: revoca tutte le sessioni del customer
  let revoked = 0;
  for (const [tok, s] of SESSIONS) {
    if (s.customerId === customerId) {
      SESSIONS.delete(tok);
      revoked++;
    }
  }
  return { ok: true, sessionsRevoked: revoked };
}

export async function b2bUpdateCustomer(
  sessionToken: string,
  body: B2bProfileUpdateInput,
): Promise<B2bCustomer> {
  const session = SESSIONS.get(sessionToken);
  if (!session) {
    const err = new Error("Sessione non valida");
    (err as Error & { code?: string }).code = "INVALID_SESSION";
    throw err;
  }
  const account = MOCK_B2B_ACCOUNTS.find(
    (a) => a.customer.id === session.customerId,
  );
  if (!account) {
    const err = new Error("Cliente non trovato");
    (err as Error & { code?: string }).code = "INVALID_SESSION";
    throw err;
  }
  // Cambio password: serve currentPassword corretta
  if (body.newPassword) {
    if (!body.currentPassword || body.currentPassword !== account.password) {
      const err = new Error("Password attuale non corretta");
      (err as Error & { code?: string }).code = "INVALID_CREDENTIALS";
      throw err;
    }
    if (body.newPassword.length < 8) {
      const err = new Error("Minimo 8 caratteri");
      (err as Error & { code?: string }).code = "INVALID_PAYLOAD";
      throw err;
    }
    account.password = body.newPassword;
  }
  if (body.name) account.customer = { ...account.customer, name: body.name };
  if (body.email) account.customer = { ...account.customer, email: body.email };
  return account.customer;
}

export async function b2bRegenerateListino(
  sessionToken: string,
): Promise<{ ok: true; regeneratedAt: string }> {
  const session = SESSIONS.get(sessionToken);
  if (!session) {
    const err = new Error("Sessione non valida");
    (err as Error & { code?: string }).code = "INVALID_SESSION";
    throw err;
  }
  return { ok: true, regeneratedAt: new Date().toISOString() };
}
