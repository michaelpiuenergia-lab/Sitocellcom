import { requireB2bSession } from "@/lib/auth/guards";
import { listB2bPayments } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { B2B_PAYMENT_METHOD_LABELS } from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string) => new Date(iso).toLocaleDateString("it-IT");

export default async function PagamentiPage() {
  const ctx = await requireB2bSession("/b2b/pagamenti");
  const { items, total } = await listB2bPayments(ctx.sessionToken, { limit: 100 }).catch(() => ({
    items: [],
    total: 0,
  }));

  const totalPaid = items.reduce((s, p) => s + p.amountCents, 0);

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
              Pagamenti · {total}
            </span>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              Pagamenti
            </h1>
          </div>
          {items.length > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
              <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#047857" }}>
                Totale registrato
              </span>
              <div className="tabular-nums" style={{ fontSize: "22px", fontWeight: 700, color: "#047857" }}>
                {eur(totalPaid)}
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <p style={{ fontSize: "16px", color: "#525252" }}>Nessun pagamento registrato.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <table className="w-full text-left" style={{ fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Data</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Metodo</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Riferimento</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Fatture</th>
                  <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Importo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p, i) => (
                  <tr key={p.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
                    <td className="px-5 py-4" style={{ color: "#0a0a0a" }}>{d(p.paidAt)}</td>
                    <td className="px-5 py-4" style={{ color: "#0a0a0a" }}>{B2B_PAYMENT_METHOD_LABELS[p.method]}</td>
                    <td className="px-5 py-4 font-mono" style={{ color: "#525252", fontSize: "12px" }}>{p.reference ?? "—"}</td>
                    <td className="px-5 py-4 font-mono" style={{ color: "#525252", fontSize: "12px" }}>
                      {p.invoiceIds.length > 0
                        ? p.invoiceIds.map((id, idx) => (
                            <span key={id}>
                              {idx > 0 && ", "}
                              <a href={`/b2b/fatture/${id}`} style={{ color: "#dc2626" }}>{id}</a>
                            </span>
                          ))
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums" style={{ color: "#0a0a0a", fontWeight: 600 }}>{eur(p.amountCents)}</td>
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
