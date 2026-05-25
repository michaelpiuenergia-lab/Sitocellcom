import "server-only";

import { redirect } from "next/navigation";
import { readB2bSession } from "./session";
import { b2bMe } from "@/lib/crm-client";
import type { B2bCustomer } from "@/lib/crm-client/types";

/**
 * Guard per Server Components / Route Handlers nell'area B2B.
 *
 * - requireB2bSession(): redirect a /b2b/login se manca o invalida.
 * - optionalB2bSession(): ritorna null se manca, niente redirect.
 *
 * Il customer "fresco" viene letto dal CRM via b2bMe(sessionToken) — questo
 * permette di applicare in tempo reale eventuali cambi di listino/abilitazione
 * fatti dal gestionale, senza aspettare la scadenza del cookie.
 */

export type B2bSessionContext = {
  sessionToken: string;
  customer: B2bCustomer;
  tierCode: string | null;
};

export async function requireB2bSession(
  nextPath = "/b2b/prodotti",
): Promise<B2bSessionContext> {
  const session = await readB2bSession();
  if (!session) {
    redirect(`/b2b/login?next=${encodeURIComponent(nextPath)}`);
  }

  try {
    const customer = await b2bMe(session.sessionToken);
    return {
      sessionToken: session.sessionToken,
      customer,
      tierCode: customer.pricingTier?.code ?? null,
    };
  } catch {
    redirect(`/b2b/login?next=${encodeURIComponent(nextPath)}&reason=expired`);
  }
}

export async function optionalB2bSession(): Promise<B2bSessionContext | null> {
  const session = await readB2bSession();
  if (!session) return null;
  try {
    const customer = await b2bMe(session.sessionToken);
    return {
      sessionToken: session.sessionToken,
      customer,
      tierCode: customer.pricingTier?.code ?? null,
    };
  } catch {
    return null;
  }
}
