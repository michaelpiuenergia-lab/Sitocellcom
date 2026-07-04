import "server-only";

import { crmFetch } from "./client";
import type {
  B2bCreditNoteDetail,
  B2bCreditNoteListItem,
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
 * Client portale B2B. Auth: X-API-Key + X-B2B-Session. Ownership server-side
 * lato CRM (un B2B vede solo i record che gli appartengono).
 *
 * I download (invoices/credit-notes/documents) restituiscono 302 verso un
 * signed URL; il proxy HUB inoltra il redirect al browser.
 */

function buildQuery(params?: B2bListParams): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.offset != null) qs.set("offset", String(params.offset));
  if (params.fromDate) qs.set("fromDate", params.fromDate);
  if (params.toDate) qs.set("toDate", params.toDate);
  if (params.status) qs.set("status", params.status);
  const s = qs.toString();
  return s ? `?${s}` : "";
}

function authHeaders(sessionToken: string): Record<string, string> {
  return { "X-B2B-Session": sessionToken };
}

// ─── Ordini ────────────────────────────────────────────────────────────────

export async function listB2bOrders(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bOrderListItem>> {
  return crmFetch(`/api/v1/b2b/orders${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function getB2bOrder(
  sessionToken: string,
  id: string,
): Promise<B2bOrderDetail> {
  return crmFetch(`/api/v1/b2b/orders/${encodeURIComponent(id)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Preventivi ────────────────────────────────────────────────────────────

export async function listB2bQuotes(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bQuoteListItem>> {
  return crmFetch(`/api/v1/b2b/quotes${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function getB2bQuote(
  sessionToken: string,
  id: string,
): Promise<B2bQuoteDetail> {
  return crmFetch(`/api/v1/b2b/quotes/${encodeURIComponent(id)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function acceptB2bQuote(
  sessionToken: string,
  id: string,
): Promise<B2bQuoteAcceptResponse> {
  return crmFetch(`/api/v1/b2b/quotes/${encodeURIComponent(id)}/accept`, {
    method: "POST",
    body: {},
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Fatture ───────────────────────────────────────────────────────────────

export async function listB2bInvoices(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bInvoiceListItem>> {
  return crmFetch(`/api/v1/b2b/invoices${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function getB2bInvoice(
  sessionToken: string,
  id: string,
): Promise<B2bInvoiceDetail> {
  return crmFetch(`/api/v1/b2b/invoices/${encodeURIComponent(id)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Note di credito ───────────────────────────────────────────────────────

export async function listB2bCreditNotes(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bCreditNoteListItem>> {
  return crmFetch(`/api/v1/b2b/credit-notes${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function getB2bCreditNote(
  sessionToken: string,
  id: string,
): Promise<B2bCreditNoteDetail> {
  return crmFetch(`/api/v1/b2b/credit-notes/${encodeURIComponent(id)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Pagamenti ─────────────────────────────────────────────────────────────

export async function listB2bPayments(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bPayment>> {
  return crmFetch(`/api/v1/b2b/payments${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Spedizioni ────────────────────────────────────────────────────────────

export async function listB2bShipments(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bShipmentListItem>> {
  return crmFetch(`/api/v1/b2b/shipments${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

export async function getB2bShipment(
  sessionToken: string,
  id: string,
): Promise<B2bShipmentDetail> {
  return crmFetch(`/api/v1/b2b/shipments/${encodeURIComponent(id)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

// ─── Documenti ─────────────────────────────────────────────────────────────

export async function listB2bDocuments(
  sessionToken: string,
  params?: B2bListParams,
): Promise<B2bListResponse<B2bDocumentListItem>> {
  return crmFetch(`/api/v1/b2b/documents${buildQuery(params)}`, {
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}

/**
 * Path CRM da chiamare per scaricare un asset (fattura/NC/documento).
 * Restituisce 302 verso il signed URL — il proxy HUB inoltra il redirect.
 */
export function b2bDownloadCrmPath(
  kind: "invoices" | "credit-notes" | "documents",
  id: string,
): string {
  return `/api/v1/b2b/${kind}/${encodeURIComponent(id)}/download`;
}

// ─── Pagamento online fattura (Klarna via CRM) ─────────────────────────────

export type B2bPayInvoiceResult = {
  data: { redirectUrl: string; qrCodeUrl: string | null; dueCents: number };
};

/**
 * Genera sul CRM un link Klarna per pagare online il residuo di una fattura
 * del rivenditore. L'esito del pagamento torna al CRM via webhook (la fattura
 * si aggiorna da sola).
 */
export async function payB2bInvoiceKlarna(
  sessionToken: string,
  invoiceId: string,
): Promise<B2bPayInvoiceResult> {
  return crmFetch(`/api/v1/b2b/payments/klarna-link`, {
    method: "POST",
    body: { invoiceId },
    cache: "no-store",
    extraHeaders: authHeaders(sessionToken),
  });
}
