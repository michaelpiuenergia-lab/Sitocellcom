import { notFound } from "next/navigation";
import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bOrder } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, orderTone } from "@/components/b2b/status-pill";
import { LineItems } from "@/components/b2b/line-items";
import {
  B2B_ORDER_STATUS_LABELS,
  type B2bAddress,
} from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

function AddressBlock({ title, address }: { title: string; address: B2bAddress }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
        {title}
      </span>
      <div style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.5 }}>
        <div>{address.line1}</div>
        {address.line2 && <div>{address.line2}</div>}
        <div>
          {address.postalCode} {address.city} ({address.province})
        </div>
        <div>{address.country}</div>
      </div>
    </div>
  );
}

type Params = Promise<{ id: string }>;

export default async function OrdineDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const ctx = await requireB2bSession(`/b2b/ordini/${id}`);

  let order;
  try {
    order = await getB2bOrder(ctx.sessionToken, id);
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
            <a href="/b2b/ordini" style={{ fontSize: "13px", color: "#737373" }}>
              ← Tutti gli ordini
            </a>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              {order.number}
            </h1>
            <span style={{ fontSize: "14px", color: "#737373" }}>Creato il {d(order.createdAt)}</span>
          </div>
          <StatusPill tone={orderTone(order.status)}>{B2B_ORDER_STATUS_LABELS[order.status]}</StatusPill>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <AddressBlock title="Spedizione" address={order.shippingAddress} />
          <AddressBlock title="Fatturazione" address={order.billingAddress} />
        </div>

        <LineItems lines={order.lines} />

        <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <div className="flex flex-col gap-1">
            {order.shippedAt && (
              <span style={{ fontSize: "13px", color: "#525252" }}>
                Spedito il {d(order.shippedAt)}
              </span>
            )}
            {order.deliveredAt && (
              <span style={{ fontSize: "13px", color: "#525252" }}>
                Consegnato il {d(order.deliveredAt)}
              </span>
            )}
            {order.shipmentId && (
              <a href={`/b2b/spedizioni/${order.shipmentId}`} style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>
                Traccia spedizione →
              </a>
            )}
            {order.notes && (
              <span style={{ fontSize: "13px", color: "#737373", fontStyle: "italic", maxWidth: "400px" }}>
                Note: {order.notes}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Totale ordine
            </span>
            <span className="tabular-nums" style={{ fontSize: "28px", fontWeight: 700, color: "#0a0a0a" }}>
              {eur(order.totalCents)}
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
