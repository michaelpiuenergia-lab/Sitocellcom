import "server-only";

import { readCustomerSession } from "./customer-session";
import { readB2bSession } from "./session";

/**
 * Gating prezzi (brief §5): l'utente non registrato NON vede prezzi.
 * Vede il prezzo chi ha una sessione valida — cliente finale (B2C) o
 * rivenditore (B2B). Controllo solo sul cookie firmato (niente roundtrip
 * al CRM): la scadenza è già verificata in read*Session, e per la sola
 * visibilità del prezzo è sufficiente e veloce.
 */
export async function canSeePrices(): Promise<boolean> {
  const [customer, b2b] = await Promise.all([
    readCustomerSession(),
    readB2bSession(),
  ]);
  return Boolean(customer || b2b);
}
