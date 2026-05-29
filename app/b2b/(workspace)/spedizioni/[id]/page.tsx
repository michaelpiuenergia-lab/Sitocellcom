import { notFound } from "next/navigation";
import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bShipment } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, shipmentTone } from "@/components/b2b/status-pill";
import { B2B_SHIPMENT_STATUS_LABELS } from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const dt = (iso: string) => new Date(iso).toLocaleString("it-IT");

type Params = Promise<{ id: string }>;

export default async function SpedizioneDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const ctx = await requireB2bSession(`/b2b/spedizioni/${id}`);

  let shipment;
  try {
    shipment = await getB2bShipment(ctx.sessionToken, id);
  } catch (e) {
    if ((e as { code?: string }).code === "NOT_FOUND") notFound();
    throw e;
  }

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1100px] mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <a href="/b2b/spedizioni" style={{ fontSize: "13px", color: "#737373" }}>
              ← Tutte le spedizioni
            </a>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              {shipment.carrier} · {shipment.trackingNumber ?? "—"}
            </h1>
            {shipment.orderId && (
              <a href={`/b2b/ordini/${shipment.orderId}`} style={{ fontSize: "13px", color: "#dc2626" }}>
                Vai all&apos;ordine →
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StatusPill tone={shipmentTone(shipment.status)}>
              {B2B_SHIPMENT_STATUS_LABELS[shipment.status]}
            </StatusPill>
            {shipment.trackingUrl && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600 }}
              >
                Tracking corriere ↗
              </a>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <span className="font-mono uppercase mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
            Destinatario
          </span>
          <div style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.6 }}>
            {shipment.recipient.company && <div><strong>{shipment.recipient.company}</strong></div>}
            <div>{shipment.recipient.name}</div>
            {shipment.recipient.phone && <div>{shipment.recipient.phone}</div>}
            <div>{shipment.shippingAddress.line1}</div>
            {shipment.shippingAddress.line2 && <div>{shipment.shippingAddress.line2}</div>}
            <div>
              {shipment.shippingAddress.postalCode} {shipment.shippingAddress.city} (
              {shipment.shippingAddress.province})
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <span className="font-mono uppercase mb-4 block" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
            Storico eventi
          </span>
          {shipment.events.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#737373", fontStyle: "italic" }}>
              Eventi di tracking non disponibili — controlla sul sito del corriere.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {[...shipment.events].reverse().map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full shrink-0" style={{ backgroundColor: i === 0 ? "#dc2626" : "#d4d4d4" }} />
                  <div className="flex flex-col">
                    <span style={{ fontSize: "14px", color: "#0a0a0a", fontWeight: i === 0 ? 600 : 400 }}>{ev.status}</span>
                    {ev.location && <span style={{ fontSize: "13px", color: "#525252" }}>{ev.location}</span>}
                    {ev.note && <span style={{ fontSize: "12px", color: "#737373", fontStyle: "italic" }}>{ev.note}</span>}
                    <span className="font-mono" style={{ fontSize: "11px", color: "#a3a3a3" }}>{dt(ev.at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
