import { notFound } from "next/navigation";
import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bInvoice } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, invoiceTone } from "@/components/b2b/status-pill";
import { B2B_INVOICE_STATUS_LABELS } from "@/lib/crm-client/types";
import { LineItems } from "@/components/b2b/line-items";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

type Params = Promise<{ id: string }>;

export default async function FatturaDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const ctx = await requireB2bSession(`/b2b/fatture/${id}`);

  let invoice;
  try {
    invoice = await getB2bInvoice(ctx.sessionToken, id);
  } catch (e) {
    if ((e as { code?: string }).code === "NOT_FOUND") notFound();
    throw e;
  }

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <a href="/b2b/fatture" style={{ fontSize: "13px", color: "#737373" }}>
              ← Tutte le fatture
            </a>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              {invoice.number}
            </h1>
            <span style={{ fontSize: "14px", color: "#737373" }}>
              Emessa il {d(invoice.issuedAt)}
              {invoice.dueAt && ` · Scadenza ${d(invoice.dueAt)}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill tone={invoiceTone(invoice.status)}>{B2B_INVOICE_STATUS_LABELS[invoice.status]}</StatusPill>
            {invoice.pdfAvailable && (
              <a
                href={`/api/b2b/download/invoices/${invoice.id}`}
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600 }}
              >
                Scarica PDF
              </a>
            )}
          </div>
        </div>

        <LineItems lines={invoice.lines} />

        {invoice.vatBreakdown.length > 0 && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <span className="font-mono uppercase mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Riepilogo IVA
            </span>
            <table className="w-full text-left" style={{ fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ececec" }}>
                  <th className="py-2 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Aliquota</th>
                  <th className="py-2 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Imponibile</th>
                  <th className="py-2 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>IVA</th>
                </tr>
              </thead>
              <tbody>
                {invoice.vatBreakdown.map((v, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #f4f3ee" }}>
                    <td className="py-2" style={{ color: "#0a0a0a" }}>{v.rate}%</td>
                    <td className="py-2 text-right tabular-nums" style={{ color: "#525252" }}>{eur(v.baseCents)}</td>
                    <td className="py-2 text-right tabular-nums" style={{ color: "#525252" }}>{eur(v.taxCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <SummaryBox label="Totale" value={eur(invoice.totalCents)} />
          <SummaryBox label="Pagato" value={eur(invoice.paidCents)} tone="success" />
          <SummaryBox
            label="Saldo aperto"
            value={eur(invoice.balanceCents)}
            tone={invoice.balanceCents > 0 ? "warn" : "success"}
          />
        </div>

        {(invoice.paymentTerms || invoice.paymentMethod) && (
          <div className="rounded-2xl p-6 flex flex-col gap-2" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Pagamento
            </span>
            {invoice.paymentTerms && <span style={{ fontSize: "14px", color: "#0a0a0a" }}>Termini: {invoice.paymentTerms}</span>}
            {invoice.paymentMethod && <span style={{ fontSize: "14px", color: "#0a0a0a" }}>Metodo: {invoice.paymentMethod}</span>}
          </div>
        )}
      </main>
    </>
  );
}

function SummaryBox({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "warn" }) {
  const colors = {
    neutral: { bg: "#ffffff", text: "#0a0a0a" },
    success: { bg: "#ecfdf5", text: "#15803d" },
    warn: { bg: "#fffbeb", text: "#92400e" },
  } as const;
  const c = colors[tone];
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: c.bg, border: "1px solid #ececec" }}>
      <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
        {label}
      </span>
      <div className="tabular-nums" style={{ fontSize: "22px", fontWeight: 700, color: c.text }}>
        {value}
      </div>
    </div>
  );
}
