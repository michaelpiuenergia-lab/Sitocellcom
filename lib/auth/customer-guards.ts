import "server-only";

import { redirect } from "next/navigation";
import { readCustomerSession } from "./customer-session";
import { customerMe } from "@/lib/crm-client";
import type { CustomerProfile } from "@/lib/crm-client/types";

/**
 * Guard per Server Components / Route Handlers nell'area clienti (B2C).
 *
 * - requireCustomerSession(): redirect a /clienti/login se manca/invalida.
 * - optionalCustomerSession(): ritorna null se manca, niente redirect.
 *
 * Il profilo "fresco" è letto dal CRM via customerMe(sessionToken).
 */

export type CustomerSessionContext = {
  sessionToken: string;
  customer: CustomerProfile;
};

export async function requireCustomerSession(
  nextPath = "/clienti",
): Promise<CustomerSessionContext> {
  const session = await readCustomerSession();
  if (!session) {
    redirect(`/clienti/login?next=${encodeURIComponent(nextPath)}`);
  }
  try {
    const customer = await customerMe(session.sessionToken);
    return { sessionToken: session.sessionToken, customer };
  } catch {
    redirect(`/clienti/login?next=${encodeURIComponent(nextPath)}&reason=expired`);
  }
}

export async function optionalCustomerSession(): Promise<CustomerSessionContext | null> {
  const session = await readCustomerSession();
  if (!session) return null;
  try {
    const customer = await customerMe(session.sessionToken);
    return { sessionToken: session.sessionToken, customer };
  } catch {
    return null;
  }
}
