import { NextResponse } from "next/server";
import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bProducts } from "@/lib/crm-client";
import type {
  B2bProductListItem,
  PublicKind,
} from "@/lib/crm-client/types";

/**
 * Vista stampa del listino B2B. Restituisce HTML grezzo stand-alone così
 * possiamo definire <html>/<head>/<style>/<body> senza essere wrappata dal
 * root layout. Auto-print on load → l'utente sceglie "Salva come PDF"
 * dal dialog di stampa del browser.
 */

export const dynamic = "force-dynamic";

const CRM_PAGE_SIZE = 100;

const KIND_LABEL: Record<string, string> = {
  device: "Telefono",
  part: "Ricambio",
  accessory: "Accessorio",
  other: "Altro",
};
const CONDITION_LABEL: Record<string, string> = {
  new: "Nuovo",
  used: "Usato",
  refurbished: "Ricondizionato",
};

async function fetchAllByKind(
  fetchCtx: { sessionToken: string; customerId: string; tierCode: string | null },
  kind: PublicKind,
  maxItems: number,
): Promise<B2bProductListItem[]> {
  const first = await getB2bProducts(fetchCtx, { kind, limit: CRM_PAGE_SIZE, offset: 0 });
  const cap = Math.min(maxItems, first.total);
  if (first.items.length >= cap) return first.items.slice(0, cap);
  const pages: number[] = [];
  for (let offset = CRM_PAGE_SIZE; offset < cap; offset += CRM_PAGE_SIZE) pages.push(offset);
  const rest = await Promise.all(
    pages.map((offset) => getB2bProducts(fetchCtx, { kind, limit: CRM_PAGE_SIZE, offset })),
  );
  return first.items.concat(...rest.map((r) => r.items)).slice(0, cap);
}

function eur(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function esc(v: unknown): string {
  if (v == null) return "";
  return String(v).replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

function rowHtml(p: B2bProductListItem): string {
  const cond = p.condition
    ? CONDITION_LABEL[p.condition] ?? p.condition
    : KIND_LABEL[p.kind] ?? "";
  return `<tr>
    <td>${esc(p.name)}</td>
    <td>${esc(p.brand ?? "—")}</td>
    <td>${esc(p.category ?? "—")}</td>
    <td>${esc(p.compatibleModels ?? "—")}</td>
    <td>${esc(cond)}</td>
    <td class="price">${p.stock.capped ? `${p.stock.count}+` : p.stock.count}</td>
    <td class="price"><strong>${esc(eur(p.priceCents))}</strong></td>
    <td class="price">${
      p.publicPriceCents != null ? `<span class="strike">${esc(eur(p.publicPriceCents))}</span>` : "—"
    }</td>
  </tr>`;
}

function sectionHtml(title: string, items: B2bProductListItem[]): string {
  if (items.length === 0) {
    return `<section><h2>${esc(title)} <span style="font-weight:400;color:#a3a3a3;font-size:11px">(0)</span></h2><div class="empty">Nessun articolo in questa categoria.</div></section>`;
  }
  const rows = items.map(rowHtml).join("");
  return `<section>
    <h2>${esc(title)} <span style="font-weight:400;color:#a3a3a3;font-size:11px">(${items.length})</span></h2>
    <table>
      <thead><tr>
        <th style="width:26%">Nome</th>
        <th>Brand</th>
        <th>Categoria</th>
        <th>Modelli</th>
        <th>Cond.</th>
        <th class="price">Stock</th>
        <th class="price">Prezzo B2B</th>
        <th class="price">Listino pubbl.</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

export async function GET() {
  const ctx = await requireB2bSession("/b2b/prodotti/stampa");
  const fetchCtx = {
    sessionToken: ctx.sessionToken,
    customerId: ctx.customer.id,
    tierCode: ctx.tierCode,
  };

  const [devices, parts, accessories] = await Promise.all([
    fetchAllByKind(fetchCtx, "device", 200).catch(() => [] as B2bProductListItem[]),
    fetchAllByKind(fetchCtx, "part", 1200).catch(() => [] as B2bProductListItem[]),
    fetchAllByKind(fetchCtx, "accessory", 200).catch(() => [] as B2bProductListItem[]),
  ]);

  const generatedAt = new Date().toLocaleString("it-IT");
  const tierName = ctx.customer.pricingTier?.name ?? "B2B";
  const headerSubtitle = ctx.customer.company ?? ctx.customer.name;

  const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<title>Listino ${esc(tierName)} — Cellcom</title>
<style>
  @page { size: A4 portrait; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #0a0a0a; margin: 0; padding: 24px; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 18px; }
  .header h1 { font-size: 22px; margin: 0 0 4px 0; letter-spacing: -0.02em; }
  .header .meta { font-size: 11px; color: #525252; line-height: 1.5; text-align: right; }
  .toolbar { display: flex; gap: 8px; margin-bottom: 12px; }
  .toolbar button { padding: 8px 14px; border: 1px solid #e5e5e5; background: #fff; border-radius: 999px; font-size: 12px; cursor: pointer; }
  h2 { font-size: 14px; margin: 18px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #ececec; letter-spacing: 0.04em; text-transform: uppercase; color: #525252; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  thead th { background: #fafaf8; border-bottom: 1px solid #d4d4d4; text-align: left; padding: 6px 8px; font-weight: 600; }
  tbody td { padding: 5px 8px; border-bottom: 1px solid #f0f0ed; vertical-align: top; }
  tbody tr:nth-child(even) td { background: #fcfcfa; }
  .price { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .strike { color: #a3a3a3; text-decoration: line-through; font-size: 9.5px; }
  .empty { padding: 10px; color: #737373; font-style: italic; font-size: 11px; }
  .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #ececec; font-size: 9.5px; color: #737373; text-align: center; }
  @media print {
    .toolbar { display: none; }
    body { padding: 0; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button type="button" onclick="window.print()">Stampa</button>
    <button type="button" onclick="window.close()">Chiudi</button>
  </div>
  <div class="header">
    <div>
      <h1>Listino ${esc(tierName)}</h1>
      <div style="font-size:12px;color:#525252">${esc(headerSubtitle)}</div>
    </div>
    <div class="meta">
      <div>Generato il ${esc(generatedAt)}</div>
      <div>Cellcom Group · b2b@cellcom.it</div>
      ${ctx.customer.vatNumber ? `<div>P.IVA cliente ${esc(ctx.customer.vatNumber)}</div>` : ""}
    </div>
  </div>
  ${sectionHtml("Telefoni", devices)}
  ${sectionHtml("Ricambi", parts)}
  ${sectionHtml("Accessori", accessories)}
  <div class="footer">
    Listino riservato — prezzi vincolati alle condizioni commerciali concordate.
    Cellcom SRLS · Via Calatafimi 52, 63074 San Benedetto del Tronto · b2b@cellcom.it
  </div>
  <script>
    // Auto-apri il dialog di stampa appena la pagina è pronta
    window.addEventListener("load", () => { setTimeout(() => window.print(), 200); });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
