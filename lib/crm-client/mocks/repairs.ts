import type { RepairPublic, RepairQuoteAction } from "../types";

/**
 * Mock riparazioni allineato agli stati REALI del CRM (lib/repairs/types.ts:
 * accepted/diagnosed/in_repair/awaiting_parts/ready_for_pickup/delivered/
 * cancelled). Fonte unica usata sia dal tracker pubblico (lookup ticket +
 * ultime cifre telefono) sia dalla dashboard area clienti.
 *
 * I campi `phoneSuffix` e `ownerCustomerId` sono interni: vengono rimossi
 * prima di restituire un RepairPublic (toPublic).
 */

export type MockRepairRecord = RepairPublic & {
  phoneSuffix: string;
  ownerCustomerId: string | null;
};

function seed(): MockRepairRecord[] {
  return [
    {
      ticketNumber: "TKT-2026-0042",
      phoneSuffix: "4567",
      ownerCustomerId: "cust-001",
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
        declineReason: null,
      },
      statusHistory: [
        { status: "accepted", note: "Dispositivo ricevuto in negozio", at: "2026-05-20T09:00:00.000Z" },
        { status: "diagnosed", note: "Diagnosi: sostituzione display OLED", at: "2026-05-20T11:30:00.000Z" },
        { status: "in_repair", note: "Sostituzione in corso", at: "2026-05-21T08:00:00.000Z" },
      ],
      shipment: null,
      createdAt: "2026-05-20T09:00:00.000Z",
      updatedAt: "2026-05-21T08:00:00.000Z",
    },
    {
      ticketNumber: "TKT-2026-0051",
      phoneSuffix: "4567",
      ownerCustomerId: "cust-001",
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
        declineReason: null,
      },
      statusHistory: [
        { status: "accepted", note: "Dispositivo ricevuto", at: "2026-05-29T08:30:00.000Z" },
        { status: "diagnosed", note: "Diagnosi: batteria degradata", at: "2026-05-29T10:00:00.000Z" },
      ],
      shipment: null,
      createdAt: "2026-05-29T08:30:00.000Z",
      updatedAt: "2026-05-29T10:00:00.000Z",
    },
    {
      ticketNumber: "TKT-2026-0033",
      phoneSuffix: "1122",
      ownerCustomerId: null,
      status: "ready_for_pickup",
      deviceBrand: "Google",
      deviceModel: "Pixel 8 Pro",
      imeiMasked: "35****4432",
      defectReported: "Vetro posteriore rotto",
      defectDiagnosed: "Sostituzione back cover",
      quote: {
        status: "approved",
        amountCents: 7900,
        description: "Sostituzione vetro posteriore",
        validUntil: "2026-05-26T00:00:00.000Z",
        sentAt: "2026-05-23T10:00:00.000Z",
        respondedAt: "2026-05-23T12:00:00.000Z",
        declineReason: null,
      },
      statusHistory: [
        { status: "accepted", note: "Ricevuto", at: "2026-05-23T09:00:00.000Z" },
        { status: "diagnosed", note: "Diagnosi: back cover", at: "2026-05-23T10:00:00.000Z" },
        { status: "in_repair", note: "Sostituzione", at: "2026-05-24T09:00:00.000Z" },
        { status: "ready_for_pickup", note: "Pronto al ritiro in negozio", at: "2026-05-25T15:00:00.000Z" },
      ],
      shipment: null,
      createdAt: "2026-05-23T09:00:00.000Z",
      updatedAt: "2026-05-25T15:00:00.000Z",
    },
    {
      // Riparazione conclusa e RISPEDITA al cliente via corriere — mostra il
      // blocco spedizione (tracking + timeline) nel tracker e in area clienti.
      ticketNumber: "TKT-2026-0028",
      phoneSuffix: "4567",
      ownerCustomerId: "cust-001",
      status: "delivered",
      deviceBrand: "Apple",
      deviceModel: "iPhone 14",
      imeiMasked: "35****7788",
      defectReported: "Connettore di ricarica non funziona",
      defectDiagnosed: "Sostituzione modulo di ricarica",
      quote: {
        status: "approved",
        amountCents: 6900,
        description: "Sostituzione connettore di ricarica + test",
        validUntil: "2026-05-12T00:00:00.000Z",
        sentAt: "2026-05-06T09:00:00.000Z",
        respondedAt: "2026-05-06T10:30:00.000Z",
        declineReason: null,
      },
      statusHistory: [
        { status: "accepted", note: "Ricevuto via spedizione", at: "2026-05-05T09:00:00.000Z" },
        { status: "diagnosed", note: "Diagnosi: modulo di ricarica", at: "2026-05-06T09:00:00.000Z" },
        { status: "in_repair", note: "Sostituzione modulo", at: "2026-05-07T08:00:00.000Z" },
        { status: "ready_for_pickup", note: "Riparazione completata, in spedizione", at: "2026-05-08T14:00:00.000Z" },
        { status: "delivered", note: "Consegnato al cliente", at: "2026-05-10T11:00:00.000Z" },
      ],
      shipment: {
        carrier: "DHL",
        trackingNumber: "JD0002028761500",
        trackingUrl:
          "https://www.dhl.com/it-it/home/tracciamento.html?tracking-id=JD0002028761500",
        status: "delivered",
        shippedAt: "2026-05-08T16:00:00.000Z",
        deliveredAt: "2026-05-10T11:00:00.000Z",
        events: [
          { at: "2026-05-08T16:00:00.000Z", status: "Spedizione presa in carico", location: "San Benedetto del Tronto", note: null },
          { at: "2026-05-09T07:30:00.000Z", status: "In transito", location: "Hub DHL Bologna", note: null },
          { at: "2026-05-10T08:15:00.000Z", status: "In consegna", location: "Filiale di destinazione", note: null },
          { at: "2026-05-10T11:00:00.000Z", status: "Consegnato", location: "Destinatario", note: "Firmato dal destinatario" },
        ],
      },
      createdAt: "2026-05-05T09:00:00.000Z",
      updatedAt: "2026-05-10T11:00:00.000Z",
    },
  ];
}

type GlobalWithRepairs = typeof globalThis & {
  __mockRepairs?: MockRepairRecord[];
};
const g = globalThis as GlobalWithRepairs;
const STORE: MockRepairRecord[] = g.__mockRepairs ?? (g.__mockRepairs = seed());

function toPublic(r: MockRepairRecord): RepairPublic {
  const { phoneSuffix: _ps, ownerCustomerId: _oc, ...pub } = r;
  void _ps;
  void _oc;
  return pub;
}

export function findRepairPublic(
  ticket: string,
  phoneSuffix: string,
): RepairPublic | null {
  const r = STORE.find(
    (x) =>
      x.ticketNumber.toLowerCase() === ticket.toLowerCase() &&
      x.phoneSuffix === phoneSuffix,
  );
  return r ? toPublic(r) : null;
}

export function listRepairsByCustomer(customerId: string): RepairPublic[] {
  return STORE.filter((x) => x.ownerCustomerId === customerId).map(toPublic);
}

export function respondToQuoteMock(
  ticket: string,
  phoneSuffix: string,
  action: RepairQuoteAction,
  reason?: string | null,
): RepairPublic {
  const r = STORE.find(
    (x) =>
      x.ticketNumber.toLowerCase() === ticket.toLowerCase() &&
      x.phoneSuffix === phoneSuffix,
  );
  if (!r) {
    const err = new Error("Ticket non trovato");
    (err as Error & { code?: string }).code = "NOT_FOUND";
    throw err;
  }
  if (r.quote.status !== "sent") {
    const err = new Error("Nessun preventivo in attesa di risposta");
    (err as Error & { code?: string }).code = "CONFLICT";
    throw err;
  }
  r.quote = {
    ...r.quote,
    status: action === "accept" ? "approved" : "declined",
    respondedAt: new Date().toISOString(),
    declineReason: action === "decline" ? (reason ?? null) : null,
  };
  if (action === "accept") {
    r.status = "in_repair";
  }
  r.updatedAt = new Date().toISOString();
  return toPublic(r);
}
