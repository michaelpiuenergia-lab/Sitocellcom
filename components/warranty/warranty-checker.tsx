"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

import type { WarrantyPublic } from "@/lib/crm-client/types";
import { WarrantyCard } from "./warranty-card";

/**
 * Ricerca garanzia a mano, per chi non ha il QR della ricevuta (o l'ha perso,
 * o e' stato servito prima che il QR esistesse).
 */

const schema = z.object({
  ticket: z.string().min(1, "Inserisci il numero della riparazione"),
  phone: z
    .string()
    .min(4, "Inserisci almeno 4 cifre")
    .max(6, "Massimo 6 cifre")
    .regex(/^\d+$/, "Solo cifre"),
});

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 transition-colors";
const inputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
} as const;

export function WarrantyChecker({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WarrantyPublic | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ ticket: ticket.trim(), phone: phone.trim() });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dati non validi");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const qs = new URLSearchParams({
        ticket: parsed.data.ticket,
        phone: parsed.data.phone,
      }).toString();
      const res = await fetch(`/api/warranty/lookup?${qs}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Errore, riprova");
        return;
      }
      setResult(json as WarrantyPublic);
    } catch {
      setError("Errore di rete, riprova tra qualche secondo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-[520px]">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label
            htmlFor="warranty-ticket"
            className="font-mono uppercase block mb-2"
            style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#737373" }}
          >
            Numero riparazione
          </label>
          <input
            id="warranty-ticket"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="es. TKT-2026-0001"
            className={inputClass}
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="warranty-phone"
            className="font-mono uppercase block mb-2"
            style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#737373" }}
          >
            Ultime cifre del telefono
          </label>
          <input
            id="warranty-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D+/g, "").slice(0, 6))}
            placeholder="es. 4321"
            inputMode="numeric"
            className={inputClass}
            style={inputStyle}
            autoComplete="off"
          />
          <p className="mt-2" style={{ fontSize: "12px", color: "#a3a3a3" }}>
            Le ultime 4-6 cifre del numero lasciato in negozio. Servono a verificare che la
            riparazione sia tua.
          </p>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full px-6 py-3 rounded-xl font-semibold transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#dc2626", color: "#ffffff", fontSize: "15px" }}
        >
          {busy ? "Verifica in corso…" : "Verifica garanzia"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              fontSize: "14px",
              color: "#b91c1c",
            }}
          >
            {error}
          </motion.p>
        )}
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <WarrantyCard data={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
