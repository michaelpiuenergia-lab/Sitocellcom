import { requireCustomerSession } from "@/lib/auth/customer-guards";
import { customerRepairs } from "@/lib/crm-client";
import { RepairStatusBadge } from "@/components/repairs/repair-status-badge";
import { RequestTrigger } from "@/components/forms/request-trigger";
import {
  B2B_SHIPMENT_STATUS_LABELS,
  type RepairPublic,
} from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

function formatEur(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function QuoteLine({ repair }: { repair: RepairPublic }) {
  const q = repair.quote;
  if (q.status === "none") return null;

  const tone =
    q.status === "approved"
      ? { bg: "#ecfdf5", border: "#a7f3d0", color: "#047857", label: "Preventivo accettato" }
      : q.status === "declined"
        ? { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", label: "Preventivo rifiutato" }
        : { bg: "#fffbeb", border: "#fde68a", color: "#92400e", label: "Preventivo in attesa di risposta" };

  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
      style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
    >
      <div className="flex flex-col">
        <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: tone.color }}>
          {tone.label}
        </span>
        {q.description && (
          <span style={{ fontSize: "13px", color: "#525252" }}>{q.description}</span>
        )}
      </div>
      <span className="font-sans font-semibold tabular-nums" style={{ fontSize: "18px", color: "#0a0a0a" }}>
        {formatEur(q.amountCents)}
      </span>
    </div>
  );
}

function RepairCard({ repair }: { repair: RepairPublic }) {
  const needsResponse = repair.quote.status === "sent";

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono" style={{ fontSize: "12px", color: "#737373" }}>
            {repair.ticketNumber}
          </span>
          <h3 className="font-sans font-semibold" style={{ fontSize: "18px", color: "#0a0a0a" }}>
            {repair.deviceBrand} {repair.deviceModel}
          </h3>
          <p style={{ fontSize: "13px", color: "#525252" }}>{repair.defectReported}</p>
        </div>
        <RepairStatusBadge status={repair.status} />
      </div>

      <QuoteLine repair={repair} />

      {repair.shipment && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-wrap"
          style={{ backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}
        >
          <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#0369a1" }}>
            Spedizione · {B2B_SHIPMENT_STATUS_LABELS[repair.shipment.status]}
          </span>
          {repair.shipment.trackingNumber && (
            <span className="font-mono" style={{ fontSize: "12px", color: "#525252" }}>
              {repair.shipment.trackingNumber}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#a3a3a3" }}>
          Aggiornato {new Date(repair.updatedAt).toLocaleDateString("it-IT")}
        </span>
        <a
          href={`/riparazioni/tracker?ticket=${encodeURIComponent(repair.ticketNumber)}`}
          className="rounded-full px-4 py-2 transition-colors"
          style={{
            backgroundColor: needsResponse ? "#dc2626" : "transparent",
            color: needsResponse ? "#ffffff" : "#dc2626",
            border: needsResponse ? "none" : "1px solid #dc2626",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {needsResponse ? "Vedi preventivo →" : "Dettagli →"}
        </a>
      </div>
    </div>
  );
}

export default async function ClientiDashboardPage() {
  const { customer, sessionToken } = await requireCustomerSession("/clienti");
  const { repairs } = await customerRepairs(sessionToken).catch(() => ({
    repairs: [] as RepairPublic[],
  }));

  return (
    <>
      <main className="pt-12 pb-16 px-6 lg:px-10 max-w-[900px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase" style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#dc2626" }}>
            Ciao {customer.name.split(" ")[0]}
          </span>
          <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
            Le tue riparazioni
          </h1>
          <p style={{ fontSize: "16px", color: "#525252" }}>
            Stato in tempo reale dal nostro laboratorio. Quando c&apos;è un preventivo, lo accetti o rifiuti da qui.
          </p>
        </div>

        {repairs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {repairs.map((r) => (
              <RepairCard key={r.ticketNumber} repair={r} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl p-10 text-center flex flex-col gap-4 items-center"
            style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
          >
            <p style={{ fontSize: "16px", color: "#525252" }}>
              Non hai riparazioni in corso. Quando porti o spedisci un dispositivo, lo trovi qui.
            </p>
            <a
              href="/riparazioni/richiedi"
              className="rounded-full px-6 py-3"
              style={{ backgroundColor: "#dc2626", color: "#ffffff", fontSize: "14px", fontWeight: 600 }}
            >
              Apri una riparazione →
            </a>
          </div>
        )}

        <div
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6"
          style={{ backgroundColor: "#fafaf8", border: "1px solid #ececec" }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-sans font-semibold" style={{ fontSize: "16px", color: "#0a0a0a" }}>
              Devi spedirci un dispositivo o farti spedire qualcosa?
            </span>
            <span style={{ fontSize: "14px", color: "#525252" }}>
              Apri una richiesta di spedizione: ti ricontattiamo con le istruzioni.
            </span>
          </div>
          <RequestTrigger
            kind="shipment"
            variant="outline"
            hideCompany
            defaultCustomer={{ name: customer.name, email: customer.email }}
            label="Richiedi una spedizione"
          />
        </div>

        <p className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#a3a3a3" }}>
          Account: {customer.email}
        </p>
      </main>
    </>
  );
}
