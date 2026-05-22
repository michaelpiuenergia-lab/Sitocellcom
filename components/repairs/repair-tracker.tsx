"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  REPAIR_STATUSES,
  REPAIR_STATUS_LABELS,
  findRepair,
  type RepairMock,
} from "@/lib/crm-client/mocks/repairs";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

const schema = z.object({
  ticket: z.string().min(1, "Inserisci il numero ticket"),
  phone: z.string().min(4, "Inserisci almeno 4 cifre").max(6, "Max 6 cifre"),
});

function maskImei(imei: string): string {
  if (imei.length < 8) return imei;
  return `${imei.slice(0, 2)}****${imei.slice(-4)}`;
}

function StatusTimeline({ repair }: { repair: RepairMock }) {
  const currentIndex = REPAIR_STATUSES.indexOf(repair.status);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center gap-2 min-w-max">
        {REPAIR_STATUSES.map((status, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div key={status} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all duration-500",
                    isCompleted && "bg-green-500 border-green-500",
                    isActive && "bg-brand-600 border-brand-600 shadow-[0_0_12px_rgba(220,38,38,0.6)] animate-pulse",
                    isFuture && "bg-transparent border-muted"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider whitespace-nowrap",
                    isCompleted && "text-green-500",
                    isActive && "text-brand-500 font-medium",
                    isFuture && "text-muted-foreground"
                  )}
                >
                  {REPAIR_STATUS_LABELS[status]}
                </span>
              </div>
              {idx < REPAIR_STATUSES.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-px transition-all duration-500",
                    isCompleted ? "bg-green-500/50" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RepairResult({ repair }: { repair: RepairMock }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE.smooth }}
      className="flex flex-col gap-8"
    >
      {/* Device info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Dispositivo
          </h3>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-serif italic text-foreground">
              {repair.deviceBrand} {repair.deviceModel}
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              IMEI: {maskImei(repair.imei)}
            </p>
            <p className="text-sm text-muted-foreground">
              {repair.defectReported}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Ticket
          </h3>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-mono text-foreground">{repair.ticketNumber}</p>
            <p className="text-sm text-muted-foreground">
              Stato attuale:{" "}
              <span className="text-brand-500 font-medium">
                {REPAIR_STATUS_LABELS[repair.status]}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
          Storico lavorazione
        </h3>
        <StatusTimeline repair={repair} />
        <div className="mt-6 flex flex-col gap-3">
          {repair.statusHistory.map((entry, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm text-foreground">
                  {REPAIR_STATUS_LABELS[entry.status]}
                </span>
                <span className="text-xs text-muted-foreground">{entry.note}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(entry.timestamp).toLocaleString("it-IT")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function RepairTracker() {
  const [ticket, setTicket] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepairMock | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const parsed = schema.safeParse({ ticket, phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    const found = findRepair(ticket, phone);
    if (!found) {
      setError("Ticket non trovato. Verifica i dati inseriti.");
      return;
    }

    setResult(found);
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8">
      <div className="text-center flex flex-col gap-4">
        <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
          Traccia la tua <span className="italic text-brand-500">riparazione</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Inserisci il numero ticket e le ultime cifre del telefono per vedere lo stato in tempo reale.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ticket" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Numero Ticket
            </label>
            <input
              id="ticket"
              type="text"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder="TKT-2026-0042"
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Telefono (ultime 4-6 cifre)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="4567"
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="self-start px-7 py-3.5 rounded-[10px] bg-linear-to-br from-brand-600 to-brand-800 text-white font-semibold text-[15px] hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.6)] transition-shadow duration-300"
        >
          Cerca riparazione
        </button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm text-brand-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence mode="wait">
        {result && <RepairResult key={result.ticketNumber} repair={result} />}
      </AnimatePresence>
    </div>
  );
}
