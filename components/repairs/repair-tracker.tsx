"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  REPAIR_PUBLIC_STATUS_LABELS,
  REPAIR_PUBLIC_STATUS_FLOW,
  type RepairPublic,
  type RepairPublicStatus,
} from "@/lib/crm-client/types";
import { RepairStatusBadge } from "./repair-status-badge";

const schema = z.object({
  ticket: z.string().min(1, "Inserisci il numero ticket"),
  phone: z
    .string()
    .min(4, "Inserisci almeno 4 cifre")
    .max(6, "Massimo 6 cifre"),
});

function formatEur(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 transition-colors";
const inputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
} as const;

function StatusTimeline({ status }: { status: RepairPublicStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
        <span className="font-mono uppercase" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#b91c1c" }}>
          Riparazione annullata
        </span>
      </div>
    );
  }
  const currentIndex = REPAIR_PUBLIC_STATUS_FLOW.indexOf(status);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-1 min-w-max">
        {REPAIR_PUBLIC_STATUS_FLOW.map((s, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <div key={s} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-2 w-[84px]">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: done ? "#16a34a" : active ? "#dc2626" : "transparent",
                    border: `2px solid ${done ? "#16a34a" : active ? "#dc2626" : "#d4d4d4"}`,
                    boxShadow: active ? "0 0 0 4px rgba(220,38,38,0.15)" : undefined,
                  }}
                />
                <span
                  className="font-mono uppercase text-center leading-tight"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    color: done ? "#16a34a" : active ? "#dc2626" : "#a3a3a3",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {REPAIR_PUBLIC_STATUS_LABELS[s]}
                </span>
              </div>
              {idx < REPAIR_PUBLIC_STATUS_FLOW.length - 1 && (
                <div className="w-6 h-px mb-5" style={{ backgroundColor: done ? "#16a34a" : "#e5e5e5" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuotePanel({
  repair,
  ticket,
  phone,
  onUpdated,
}: {
  repair: RepairPublic;
  ticket: string;
  phone: string;
  onUpdated: (r: RepairPublic) => void;
}) {
  const [busy, setBusy] = useState<null | "accept" | "decline">(null);
  const [error, setError] = useState<string | null>(null);
  const q = repair.quote;

  if (q.status === "none") return null;

  async function respond(action: "accept" | "decline") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/repairs/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, phone, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Operazione non riuscita");
      }
      onUpdated(data as RepairPublic);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(null);
    }
  }

  const tone =
    q.status === "approved"
      ? { bg: "#ecfdf5", border: "#a7f3d0", color: "#047857", label: "Preventivo accettato" }
      : q.status === "declined"
        ? { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", label: "Preventivo rifiutato" }
        : { bg: "#fffbeb", border: "#fde68a", color: "#92400e", label: "Preventivo da approvare" };

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: tone.color }}>
            {tone.label}
          </span>
          {q.description && <span style={{ fontSize: "14px", color: "#404040" }}>{q.description}</span>}
          {q.validUntil && q.status === "sent" && (
            <span style={{ fontSize: "12px", color: "#737373" }}>
              Valido fino al {new Date(q.validUntil).toLocaleDateString("it-IT")}
            </span>
          )}
        </div>
        <span className="font-sans font-bold tabular-nums" style={{ fontSize: "26px", color: "#0a0a0a" }}>
          {formatEur(q.amountCents)}
        </span>
      </div>

      {q.status === "sent" && (
        <>
          {error && (
            <p className="rounded-lg px-3 py-2" style={{ fontSize: "13px", color: "#b91c1c", backgroundColor: "#fff" }}>
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => respond("accept")}
              className="flex-1 py-3 rounded-full transition-all disabled:opacity-60"
              style={{ backgroundColor: "#16a34a", color: "#fff", fontSize: "14px", fontWeight: 600 }}
            >
              {busy === "accept" ? "Attendi…" : "Accetta il preventivo"}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => respond("decline")}
              className="flex-1 py-3 rounded-full transition-all disabled:opacity-60"
              style={{ border: "1px solid #dc2626", color: "#dc2626", fontSize: "14px", fontWeight: 600, backgroundColor: "transparent" }}
            >
              {busy === "decline" ? "Attendi…" : "Rifiuta"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RepairResult({
  repair,
  ticket,
  phone,
  onUpdated,
}: {
  repair: RepairPublic;
  ticket: string;
  phone: string;
  onUpdated: (r: RepairPublic) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono" style={{ fontSize: "12px", color: "#737373" }}>{repair.ticketNumber}</span>
            <h3 className="font-sans font-semibold" style={{ fontSize: "20px", color: "#0a0a0a" }}>
              {repair.deviceBrand} {repair.deviceModel}
            </h3>
            <p style={{ fontSize: "14px", color: "#525252" }}>{repair.defectReported}</p>
            {repair.imeiMasked && (
              <p className="font-mono" style={{ fontSize: "12px", color: "#a3a3a3" }}>IMEI {repair.imeiMasked}</p>
            )}
          </div>
          <RepairStatusBadge status={repair.status} />
        </div>
      </div>

      <QuotePanel repair={repair} ticket={ticket} phone={phone} onUpdated={onUpdated} />

      <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
        <h4 className="font-mono uppercase mb-5" style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#737373" }}>
          Avanzamento
        </h4>
        <StatusTimeline status={repair.status} />
        <div className="mt-5 flex flex-col gap-3">
          {[...repair.statusHistory].reverse().map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: "#dc2626" }} />
              <div className="flex flex-col">
                <span style={{ fontSize: "14px", color: "#0a0a0a" }}>
                  {REPAIR_PUBLIC_STATUS_LABELS[entry.status]}
                </span>
                {entry.note && <span style={{ fontSize: "13px", color: "#737373" }}>{entry.note}</span>}
                <span className="font-mono" style={{ fontSize: "11px", color: "#a3a3a3" }}>
                  {new Date(entry.at).toLocaleString("it-IT")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function RepairTracker({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RepairPublic | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const parsed = schema.safeParse({ ticket, phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      const qs = new URLSearchParams({ ticket, phone }).toString();
      const res = await fetch(`/api/repairs/lookup?${qs}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Ticket non trovato.");
      }
      setResult(data as RepairPublic);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="font-mono uppercase" style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#dc2626" }}>
          Stato live dal laboratorio
        </span>
        <h2 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
          Traccia la tua riparazione
        </h2>
        <p style={{ fontSize: "16px", color: "#525252", maxWidth: "560px" }}>
          Inserisci il numero ticket (sulla ricevuta) e le ultime cifre del telefono.
          Vedi lo stato in tempo reale e, se c&apos;è un preventivo, lo accetti o rifiuti da qui.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ticket" className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}>
              Numero ticket
            </label>
            <input
              id="ticket"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder="TKT-2026-0042"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}>
              Telefono (ultime 4-6 cifre)
            </label>
            <input
              id="phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="4567"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="self-start px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-60"
          style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "15px", fontWeight: 600 }}
        >
          {busy ? "Cerco…" : "Cerca riparazione"}
        </button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ fontSize: "14px", color: "#dc2626" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <RepairResult
            key={result.ticketNumber}
            repair={result}
            ticket={ticket}
            phone={phone}
            onUpdated={setResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
