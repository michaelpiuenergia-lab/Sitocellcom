import { notFound } from "next/navigation";
import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bQuote } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { StatusPill, quoteTone } from "@/components/b2b/status-pill";
import { LineItems } from "@/components/b2b/line-items";
import { B2B_QUOTE_STATUS_LABELS } from "@/lib/crm-client/types";
import { AcceptQuoteButton } from "./accept-button";

export const dynamic = "force-dynamic";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);
const d = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("it-IT") : "—";

type Params = Promise<{ id: string }>;

export default async function PreventivoDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const ctx = await requireB2bSession(`/b2b/preventivi/${id}`);

  let quote;
  try {
    quote = await getB2bQuote(ctx.sessionToken, id);
  } catch (e) {
    if ((e as { code?: string }).code === "NOT_FOUND") notFound();
    throw e;
  }

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <a href="/b2b/preventivi" style={{ fontSize: "13px", color: "#737373" }}>
              ← Tutti i preventivi
            </a>
            <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
              {quote.number}
            </h1>
            <span style={{ fontSize: "14px", color: "#737373" }}>
              Emesso il {d(quote.createdAt)}
              {quote.validUntil && ` · Valido fino al ${d(quote.validUntil)}`}
            </span>
          </div>
          <StatusPill tone={quoteTone(quote.status)}>{B2B_QUOTE_STATUS_LABELS[quote.status]}</StatusPill>
        </div>

        <LineItems lines={quote.lines} />

        {quote.terms && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <span className="font-mono uppercase mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Termini
            </span>
            <p style={{ fontSize: "14px", color: "#0a0a0a", whiteSpace: "pre-line" }}>{quote.terms}</p>
          </div>
        )}

        {quote.notes && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <span className="font-mono uppercase mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Note
            </span>
            <p style={{ fontSize: "14px", color: "#0a0a0a", whiteSpace: "pre-line" }}>{quote.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <div className="flex flex-col items-start gap-1">
            <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>
              Totale preventivo
            </span>
            <span className="tabular-nums" style={{ fontSize: "32px", fontWeight: 700, color: "#0a0a0a" }}>
              {eur(quote.totalCents)}
            </span>
            {quote.orderId && (
              <a href={`/b2b/ordini/${quote.orderId}`} style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>
                Ordine collegato → {quote.orderId}
              </a>
            )}
          </div>
          {quote.status === "sent" && <AcceptQuoteButton quoteId={quote.id} />}
        </div>
      </main>
    </>
  );
}
