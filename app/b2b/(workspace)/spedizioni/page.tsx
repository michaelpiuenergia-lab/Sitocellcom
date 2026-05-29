import { requireB2bSession } from "@/lib/auth/guards";
import { listB2bShipments } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, shipmentTone } from "@/components/b2b/status-pill";
import { B2B_SHIPMENT_STATUS_LABELS } from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

export default async function SpedizioniPage() {
  const ctx = await requireB2bSession("/b2b/spedizioni");
  const { items, total } = await listB2bShipments(ctx.sessionToken, { limit: 100 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
            Spedizioni · {total}
          </span>
          <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
            Spedizioni e tracking
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <p style={{ fontSize: "16px", color: "#525252" }}>Nessuna spedizione in corso.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <table className="w-full text-left" style={{ fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Ordine</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Corriere</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Tracking</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Spedito</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Consegnato</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Stato</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
                    <td className="px-5 py-4 font-mono" style={{ color: "#0a0a0a" }}>
                      {s.orderId ? (
                        <a href={`/b2b/ordini/${s.orderId}`} style={{ color: "#dc2626", fontWeight: 500 }}>{s.orderId}</a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#0a0a0a" }}>{s.carrier}</td>
                    <td className="px-5 py-4 font-mono" style={{ color: "#525252", fontSize: "12px" }}>
                      {s.trackingUrl && s.trackingNumber ? (
                        <a href={s.trackingUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#dc2626" }}>
                          {s.trackingNumber} ↗
                        </a>
                      ) : s.trackingNumber ?? "—"}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(s.shippedAt)}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(s.deliveredAt)}</td>
                    <td className="px-5 py-4">
                      <StatusPill tone={shipmentTone(s.status)}>{B2B_SHIPMENT_STATUS_LABELS[s.status]}</StatusPill>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a href={`/b2b/spedizioni/${s.id}`} style={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
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
