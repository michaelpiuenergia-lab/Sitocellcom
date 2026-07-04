import { requireB2bSession } from "@/lib/auth/guards";
import { listB2bInvoices } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, invoiceTone } from "@/components/b2b/status-pill";
import { B2B_INVOICE_STATUS_LABELS } from "@/lib/crm-client/types";
import { PayInvoiceButton } from "@/components/b2b/pay-invoice-button";
import { KlarnaBadge } from "@/components/ui/payment-badges";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

export default async function FatturePage() {
  const ctx = await requireB2bSession("/b2b/fatture");
  const { items, total } = await listB2bInvoices(ctx.sessionToken, { limit: 100 }).catch(() => ({
    items: [],
    total: 0,
  }));

  const openBalance = items.reduce((s, i) => s + i.balanceCents, 0);

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
              Le tue fatture · {total}
            </span>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              Fatture
            </h1>
          </div>
          {openBalance > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
              <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#92400e" }}>
                Saldo aperto
              </span>
              <div className="tabular-nums" style={{ fontSize: "22px", fontWeight: 700, color: "#92400e" }}>
                {eur(openBalance)}
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <p style={{ fontSize: "16px", color: "#525252" }}>Non ci sono fatture sul tuo account.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <table className="w-full text-left" style={{ fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Numero</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Emissione</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Scadenza</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Stato</th>
                  <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Totale</th>
                  <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Saldo</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((inv, i) => (
                  <tr key={inv.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
                    <td className="px-5 py-4 font-mono" style={{ color: "#0a0a0a", fontWeight: 600 }}>{inv.number}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(inv.issuedAt)}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(inv.dueAt)}</td>
                    <td className="px-5 py-4">
                      <StatusPill tone={invoiceTone(inv.status)}>{B2B_INVOICE_STATUS_LABELS[inv.status]}</StatusPill>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums" style={{ color: "#0a0a0a", fontWeight: 600 }}>{eur(inv.totalCents)}</td>
                    <td className="px-5 py-4 text-right tabular-nums" style={{ color: inv.balanceCents > 0 ? "#b91c1c" : "#15803d" }}>{eur(inv.balanceCents)}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {inv.balanceCents > 0 && (
                        <span className="mr-3 inline-block align-middle"><PayInvoiceButton invoiceId={inv.id} /></span>
                      )}
                      <a href={`/b2b/fatture/${inv.id}`} style={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                        Dettagli
                      </a>
                      {inv.pdfAvailable && (
                        <>
                          {" · "}
                          <a href={`/api/b2b/download/invoices/${inv.id}`} style={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                            PDF
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
