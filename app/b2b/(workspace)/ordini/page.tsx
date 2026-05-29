import { requireB2bSession } from "@/lib/auth/guards";
import { listB2bOrders } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, orderTone } from "@/components/b2b/status-pill";
import { B2B_ORDER_STATUS_LABELS } from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

export default async function OrdiniPage() {
  const ctx = await requireB2bSession("/b2b/ordini");
  const { items, total } = await listB2bOrders(ctx.sessionToken, { limit: 100 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
            I tuoi ordini · {total}
          </span>
          <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
            Ordini
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <table className="w-full text-left" style={{ fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Numero</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Data</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Articoli</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Stato</th>
                  <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Totale</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
                    <td className="px-5 py-4 font-mono" style={{ color: "#0a0a0a", fontWeight: 600 }}>{o.number}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(o.createdAt)}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{o.itemsCount}</td>
                    <td className="px-5 py-4">
                      <StatusPill tone={orderTone(o.status)}>{B2B_ORDER_STATUS_LABELS[o.status]}</StatusPill>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums" style={{ color: "#0a0a0a", fontWeight: 600 }}>{eur(o.totalCents)}</td>
                    <td className="px-5 py-4 text-right">
                      <a href={`/b2b/ordini/${o.id}`} style={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                        Dettagli →
                      </a>
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

function EmptyState() {
  return (
    <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
      <p style={{ fontSize: "16px", color: "#525252" }}>
        Non ci sono ancora ordini sul tuo account.
      </p>
      <a
        href="/b2b/prodotti"
        className="inline-block mt-4 px-5 py-2.5 rounded-full"
        style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "14px", fontWeight: 600 }}
      >
        Sfoglia il listino →
      </a>
    </div>
  );
}
