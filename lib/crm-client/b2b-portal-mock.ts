import "server-only";

import type {
  B2bAddress,
  B2bCreditNoteDetail,
  B2bCreditNoteListItem,
  B2bDocumentLine,
  B2bDocumentListItem,
  B2bInvoiceDetail,
  B2bInvoiceListItem,
  B2bListParams,
  B2bListResponse,
  B2bOrderDetail,
  B2bOrderListItem,
  B2bPayment,
  B2bQuoteAcceptResponse,
  B2bQuoteDetail,
  B2bQuoteListItem,
  B2bShipmentDetail,
  B2bShipmentListItem,
} from "./types";

/**
 * Mock portale B2B — solo dev locale. Pochi record per entità così la UI
 * funziona end-to-end senza CRM configurato. Switch-ready: i tipi e le
 * funzioni sono identici al client reale.
 */

const ADDR: B2bAddress = {
  line1: "Via Calatafimi 52",
  line2: null,
  city: "San Benedetto del Tronto",
  postalCode: "63074",
  province: "AP",
  country: "IT",
};

const LINES_A: B2bDocumentLine[] = [
  {
    productId: "prod-1",
    productName: "Display iPhone 15 Pro OEM",
    sku: "DSP-IP15P-OEM",
    qty: 10,
    unitPriceCents: 8900,
    lineTotalCents: 89000,
    notes: null,
  },
  {
    productId: "prod-2",
    productName: "Batteria Samsung S24 Ultra",
    sku: "BAT-S24U",
    qty: 5,
    unitPriceCents: 3200,
    lineTotalCents: 16000,
    notes: null,
  },
];

const LINES_B: B2bDocumentLine[] = [
  {
    productId: "prod-3",
    productName: "Cover protettiva universale 6.7\"",
    sku: "CVR-UNI-67",
    qty: 50,
    unitPriceCents: 280,
    lineTotalCents: 14000,
    notes: null,
  },
];

function paginate<T>(items: T[], params?: B2bListParams): B2bListResponse<T> {
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
    hasMore: offset + limit < items.length,
    limit,
    offset,
  };
}

// ─── Seed dati ─────────────────────────────────────────────────────────────

const orders: B2bOrderDetail[] = [
  {
    id: "ord-001",
    number: "ORD-2026-0042",
    createdAt: "2026-05-20T09:15:00.000Z",
    status: "shipped",
    totalCents: 105000,
    currency: "EUR",
    itemsCount: 2,
    shipmentId: "shp-001",
    customer: { id: "b2b-001", name: "Marco Bianchi", company: "TecnoStore Milano S.r.l." },
    shippingAddress: ADDR,
    billingAddress: ADDR,
    lines: LINES_A,
    notes: "Spedire entro venerdì",
    shippedAt: "2026-05-22T14:00:00.000Z",
    deliveredAt: null,
  },
  {
    id: "ord-002",
    number: "ORD-2026-0051",
    createdAt: "2026-05-26T11:30:00.000Z",
    status: "confirmed",
    totalCents: 14000,
    currency: "EUR",
    itemsCount: 1,
    shipmentId: null,
    customer: { id: "b2b-001", name: "Marco Bianchi", company: "TecnoStore Milano S.r.l." },
    shippingAddress: ADDR,
    billingAddress: ADDR,
    lines: LINES_B,
    notes: null,
    shippedAt: null,
    deliveredAt: null,
  },
];

const quotes: B2bQuoteDetail[] = [
  {
    id: "qte-001",
    number: "PRV-2026-0010",
    createdAt: "2026-05-28T10:00:00.000Z",
    validUntil: "2026-06-15T00:00:00.000Z",
    status: "sent",
    totalCents: 105000,
    currency: "EUR",
    itemsCount: 2,
    lines: LINES_A,
    notes: "Sconto 5% se ordine entro 15 giugno",
    terms: "Pagamento 30gg DF, spedizione standard inclusa",
    orderId: null,
  },
];

const invoices: B2bInvoiceDetail[] = [
  {
    id: "inv-001",
    number: "FAT-2026-0042",
    issuedAt: "2026-05-22T00:00:00.000Z",
    dueAt: "2026-06-21T00:00:00.000Z",
    totalCents: 128100,
    paidCents: 0,
    balanceCents: 128100,
    currency: "EUR",
    status: "sent",
    pdfAvailable: true,
    orderId: "ord-001",
    customer: { name: "Marco Bianchi", company: "TecnoStore Milano S.r.l.", vatNumber: "IT01234567890" },
    lines: LINES_A,
    vatBreakdown: [{ rate: 22, baseCents: 105000, taxCents: 23100 }],
    paymentTerms: "30 gg DF",
    paymentMethod: "Bonifico",
    notes: null,
  },
];

const creditNotes: B2bCreditNoteDetail[] = [
  {
    id: "cn-001",
    number: "NC-2026-0003",
    issuedAt: "2026-05-25T00:00:00.000Z",
    dueAt: null,
    totalCents: 19520,
    paidCents: 0,
    balanceCents: 19520,
    currency: "EUR",
    status: "sent",
    pdfAvailable: true,
    orderId: "ord-001",
    invoiceId: "inv-001",
    reason: "Reso 2 display difettosi",
    customer: { name: "Marco Bianchi", company: "TecnoStore Milano S.r.l.", vatNumber: "IT01234567890" },
    lines: [LINES_A[0]],
    vatBreakdown: [{ rate: 22, baseCents: 16000, taxCents: 3520 }],
    paymentTerms: null,
    paymentMethod: null,
    notes: null,
  },
];

const payments: B2bPayment[] = [
  {
    id: "pay-001",
    paidAt: "2026-05-15T00:00:00.000Z",
    amountCents: 75000,
    currency: "EUR",
    method: "bonifico",
    reference: "CRO 20260515-7821",
    invoiceIds: ["inv-historic-099"],
    notes: null,
  },
];

const shipments: B2bShipmentDetail[] = [
  {
    id: "shp-001",
    orderId: "ord-001",
    carrier: "GLS",
    trackingNumber: "GLS-661881770",
    trackingUrl: "https://www.gls-italy.com/tracking?ddt=GLS-661881770",
    status: "in_transit",
    shippedAt: "2026-05-22T14:00:00.000Z",
    deliveredAt: null,
    events: [
      { at: "2026-05-22T14:00:00.000Z", status: "Preso in carico", location: "San Benedetto del Tronto", note: null },
      { at: "2026-05-22T20:15:00.000Z", status: "In transito", location: "Hub Bologna", note: null },
    ],
    recipient: { name: "Marco Bianchi", company: "TecnoStore Milano S.r.l.", phone: "0271234567" },
    shippingAddress: ADDR,
  },
];

const documents: B2bDocumentListItem[] = [
  {
    id: "doc-001",
    kind: "ddt",
    title: "DDT 0042 — ORD-2026-0042",
    issuedAt: "2026-05-22T00:00:00.000Z",
    pdfAvailable: true,
    relatedOrderId: "ord-001",
    relatedInvoiceId: null,
  },
  {
    id: "doc-002",
    kind: "ce_certificate",
    title: "Certificato CE batterie Samsung 2026",
    issuedAt: "2026-01-15T00:00:00.000Z",
    pdfAvailable: true,
    relatedOrderId: null,
    relatedInvoiceId: null,
  },
];

// ─── Mock functions ────────────────────────────────────────────────────────

function toListItem<T extends { id: string }, L>(detail: T, keys: (keyof L & keyof T)[]): L {
  const o: Partial<L> = {};
  for (const k of keys) (o as Record<string, unknown>)[k as string] = (detail as Record<string, unknown>)[k as string];
  return o as L;
}

const orderListKeys: (keyof B2bOrderListItem & keyof B2bOrderDetail)[] = [
  "id", "number", "createdAt", "status", "totalCents", "currency", "itemsCount", "shipmentId",
];

const invoiceListKeys: (keyof B2bInvoiceListItem & keyof B2bInvoiceDetail)[] = [
  "id", "number", "issuedAt", "dueAt", "totalCents", "paidCents", "balanceCents", "currency", "status", "pdfAvailable", "orderId",
];

const quoteListKeys: (keyof B2bQuoteListItem & keyof B2bQuoteDetail)[] = [
  "id", "number", "createdAt", "validUntil", "status", "totalCents", "currency", "itemsCount",
];

const shipmentListKeys: (keyof B2bShipmentListItem & keyof B2bShipmentDetail)[] = [
  "id", "orderId", "carrier", "trackingNumber", "trackingUrl", "status", "shippedAt", "deliveredAt",
];

export async function listB2bOrders(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(orders.map((o) => toListItem<B2bOrderDetail, B2bOrderListItem>(o, orderListKeys)), params);
}
export async function getB2bOrder(_token: string, id: string): Promise<B2bOrderDetail> {
  void _token;
  const o = orders.find((x) => x.id === id);
  if (!o) throw notFound();
  return o;
}

export async function listB2bQuotes(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(quotes.map((q) => toListItem<B2bQuoteDetail, B2bQuoteListItem>(q, quoteListKeys)), params);
}
export async function getB2bQuote(_token: string, id: string): Promise<B2bQuoteDetail> {
  void _token;
  const q = quotes.find((x) => x.id === id);
  if (!q) throw notFound();
  return q;
}
export async function acceptB2bQuote(_token: string, id: string): Promise<B2bQuoteAcceptResponse> {
  void _token;
  const q = quotes.find((x) => x.id === id);
  if (!q) throw notFound();
  if (q.status !== "sent") throw conflict();
  q.status = "accepted";
  const newOrder: B2bOrderDetail = {
    ...orders[0],
    id: `ord-from-${q.id}`,
    number: q.number.replace("PRV", "ORD"),
    createdAt: new Date().toISOString(),
    status: "confirmed",
    totalCents: q.totalCents,
    itemsCount: q.itemsCount,
    lines: q.lines,
    shipmentId: null,
    shippedAt: null,
    deliveredAt: null,
  };
  q.orderId = newOrder.id;
  orders.unshift(newOrder);
  return { quote: q, order: newOrder };
}

export async function listB2bInvoices(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(invoices.map((i) => toListItem<B2bInvoiceDetail, B2bInvoiceListItem>(i, invoiceListKeys)), params);
}
export async function getB2bInvoice(_token: string, id: string): Promise<B2bInvoiceDetail> {
  void _token;
  const i = invoices.find((x) => x.id === id);
  if (!i) throw notFound();
  return i;
}

export async function listB2bCreditNotes(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(
    creditNotes.map((c) => ({
      ...toListItem<B2bCreditNoteDetail, B2bInvoiceListItem>(c, invoiceListKeys),
      invoiceId: c.invoiceId,
      reason: c.reason,
    })) as B2bCreditNoteListItem[],
    params,
  );
}
export async function getB2bCreditNote(_token: string, id: string): Promise<B2bCreditNoteDetail> {
  void _token;
  const c = creditNotes.find((x) => x.id === id);
  if (!c) throw notFound();
  return c;
}

export async function listB2bPayments(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(payments, params);
}

export async function listB2bShipments(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(
    shipments.map((s) => toListItem<B2bShipmentDetail, B2bShipmentListItem>(s, shipmentListKeys)),
    params,
  );
}
export async function getB2bShipment(_token: string, id: string): Promise<B2bShipmentDetail> {
  void _token;
  const s = shipments.find((x) => x.id === id);
  if (!s) throw notFound();
  return s;
}

export async function listB2bDocuments(_token: string, params?: B2bListParams) {
  void _token;
  return paginate(documents, params);
}

export function b2bDownloadCrmPath(): string {
  return ""; // mock: i download non sono disponibili senza CRM reale
}

function notFound(): Error {
  const e = new Error("Non trovato");
  (e as Error & { code?: string }).code = "NOT_FOUND";
  return e;
}
function conflict(): Error {
  const e = new Error("Operazione non consentita nello stato attuale");
  (e as Error & { code?: string }).code = "CONFLICT";
  return e;
}
