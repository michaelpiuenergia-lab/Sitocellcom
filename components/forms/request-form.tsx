"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";
import type {
  SiteRequestKind,
  SiteRequestProductPayload,
} from "@/lib/crm-client/types";

/**
 * Form di richiesta unificato. Usato sia lato pubblico (info, ricambio,
 * riparazione) sia lato B2B (preventivo). Submit a /api/requests.
 *
 * Renderizzato come dialog overlay. Usa native <dialog>-like pattern con
 * Framer Motion per fade/slide.
 */

const KIND_LABELS: Record<SiteRequestKind, { title: string; cta: string }> = {
  info: {
    title: "Richiedi informazioni",
    cta: "Invia richiesta",
  },
  "spare-part": {
    title: "Richiedi un ricambio",
    cta: "Invia richiesta ricambio",
  },
  repair: {
    title: "Richiedi una riparazione",
    cta: "Invia richiesta riparazione",
  },
  "b2b-quote": {
    title: "Richiedi preventivo B2B",
    cta: "Invia richiesta preventivo",
  },
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  privacyAccepted: boolean;
  /** Honeypot anti-bot — utenti reali lo lasciano vuoto. */
  hpf: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  privacyAccepted: false,
  hpf: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function RequestForm({
  kind,
  product = null,
  defaultCustomer,
  hideCompany = false,
  onClose,
}: {
  kind: SiteRequestKind;
  product?: SiteRequestProductPayload | null;
  defaultCustomer?: Partial<FormState>;
  /** Nasconde il campo azienda. True per richieste pubbliche non commerciali */
  hideCompany?: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, ...defaultCustomer });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacyAccepted) {
      setErrorMsg(
        "Per inviare la richiesta è necessario accettare il trattamento dei dati personali.",
      );
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            company: hideCompany ? null : form.company || null,
          },
          product,
          message: form.message || null,
          privacyAccepted: true,
          hpf: form.hpf,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(data?.error?.message ?? "Errore invio richiesta");
      }
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Errore sconosciuto");
      setStatus("error");
    }
  }

  const labels = KIND_LABELS[kind];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DURATION.fast }}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: DURATION.normal, ease: EASE.smooth }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <h2 className="font-serif text-2xl italic text-foreground mb-1">
            {labels.title}
          </h2>
          {product?.name ? (
            <p className="text-sm text-muted-foreground mb-6">
              Prodotto: <span className="font-mono">{product.name}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-6">
              Ti rispondiamo entro 24 ore lavorative.
            </p>
          )}

          {status === "success" ? (
            <div className="flex flex-col gap-4 items-center text-center py-6">
              <div className="w-12 h-12 rounded-full bg-brand-600/10 border border-brand-600/30 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-500"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h3 className="font-serif italic text-xl">Richiesta ricevuta</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                La tua richiesta è arrivata al nostro gestionale. Un nostro
                operatore ti risponderà al più presto.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Honeypot anti-bot: visivamente nascosto ma presente nel DOM.
                  Bot rotanti riempiranno questo input → il CRM marca spam.
                  Utenti reali (e screen reader, grazie ad aria-hidden) lo
                  lasciano vuoto. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label>
                  Non compilare questo campo
                  <input
                    type="text"
                    name="hpf"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.hpf}
                    onChange={(e) => setForm({ ...form, hpf: e.target.value })}
                  />
                </label>
              </div>
              <FormField
                label="Nome e cognome *"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                autoComplete="name"
              />
              <FormField
                label="Email *"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                autoComplete="email"
              />
              <FormField
                label="Telefono"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                autoComplete="tel"
              />
              {!hideCompany && (
                <FormField
                  label="Azienda"
                  value={form.company}
                  onChange={(v) => setForm({ ...form, company: v })}
                  autoComplete="organization"
                />
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Messaggio
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={4}
                  maxLength={4000}
                  placeholder={
                    kind === "repair"
                      ? "Descrivi il problema, modello del telefono…"
                      : kind === "spare-part"
                        ? "Modello compatibile, quantità, urgenza…"
                        : kind === "b2b-quote"
                          ? "Quantità richiesta, eventuali condizioni…"
                          : "Dettagli della richiesta…"
                  }
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-popover border border-border",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40",
                    "transition-colors duration-200 resize-none",
                  )}
                />
              </div>

              <label className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={form.privacyAccepted}
                  onChange={(e) =>
                    setForm({ ...form, privacyAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-border bg-popover accent-brand-600 cursor-pointer shrink-0"
                />
                <span>
                  Ho letto l&apos;
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 hover:text-brand-400 underline-offset-2 hover:underline"
                  >
                    informativa privacy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati personali per
                  rispondere alla richiesta (art. 13 GDPR — Reg. UE 2016/679).
                  <span className="text-brand-500"> *</span>
                </span>
              </label>

              {errorMsg && (
                <p className="text-sm text-brand-500 bg-brand-600/10 border border-brand-600/30 rounded-lg px-4 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting" || !form.privacyAccepted}
                className={cn(
                  "w-full py-3 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold",
                  "hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {status === "submitting" ? "Invio in corso…" : labels.cta}
              </button>

              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">
                I dati raccolti vengono trattati esclusivamente per gestire la
                richiesta — non vengono ceduti a terzi.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          "w-full px-4 py-3 rounded-lg bg-popover border border-border",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40",
          "transition-colors duration-200",
        )}
      />
    </div>
  );
}
