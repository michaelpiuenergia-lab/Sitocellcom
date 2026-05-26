"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CONDITION_DESCRIPTIONS,
  findModel,
  listBrands,
  listModelsByBrand,
  type TradeInCondition,
} from "@/lib/trade-in/models";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

type Step = "model" | "contact" | "done";

/** Sentinel per modelli non in lista — free-text */
const OTHER_BRAND = "Altro / non in lista";

type FormState = {
  brand: string | null;
  modelId: string | null;
  customModelName: string;
  customStorage: string;
  storage: number | null;
  condition: TradeInCondition | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
  privacyAccepted: boolean;
  hpf: string;
};

const EMPTY: FormState = {
  brand: null,
  modelId: null,
  customModelName: "",
  customStorage: "",
  storage: null,
  condition: null,
  name: "",
  email: "",
  phone: "",
  notes: "",
  privacyAccepted: false,
  hpf: "",
};

export function TradeInCalculator() {
  const [step, setStep] = useState<Step>("model");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "submitting" | "error";
    error: string | null;
  }>({ status: "idle", error: null });

  const brands = useMemo(() => [...listBrands(), OTHER_BRAND], []);
  const isOther = form.brand === OTHER_BRAND;
  const models = useMemo(
    () => (form.brand && !isOther ? listModelsByBrand(form.brand) : []),
    [form.brand, isOther],
  );
  const model = useMemo(
    () => (form.modelId ? findModel(form.modelId) : null),
    [form.modelId],
  );

  const canContinue = isOther
    ? Boolean(form.customModelName.trim() && form.condition)
    : Boolean(model && form.storage && form.condition);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue) return;
    if (!form.privacyAccepted) {
      setSubmitState({
        status: "error",
        error: "Devi accettare l'informativa privacy per inviare la richiesta.",
      });
      return;
    }
    setSubmitState({ status: "submitting", error: null });

    const conditionLabel = form.condition
      ? CONDITION_DESCRIPTIONS[form.condition].label
      : "—";

    // slug=null sempre per trade-in: i modelli sono hardcoded HUB-side, non
    // ci sono prodotti corrispondenti nella tabella CRM.
    const productPayload = isOther
      ? {
          id: null,
          slug: null,
          name:
            form.customModelName.trim() +
            (form.customStorage ? ` ${form.customStorage}` : ""),
          variantId: null,
          variantLabel: `${conditionLabel} · valutazione manuale richiesta`,
        }
      : {
          id: null,
          slug: null,
          name: `${model!.name} ${form.storage}GB`,
          variantId: null,
          variantLabel: `${conditionLabel} · valutazione manuale richiesta`,
        };

    // Riga strutturata per parsing CRM + blocco human-readable per il tecnico.
    // Niente prezzi/range: la valutazione la fa il tecnico dopo aver ricevuto
    // le foto (richieste manualmente via email post-intake).
    const structuredLine = isOther
      ? `TRADE-IN | ${form.customModelName.trim()} | ${form.customStorage || "n/d"} | ${conditionLabel} | valutazione manuale`
      : `TRADE-IN | ${model!.brand} ${model!.name} | ${form.storage}GB | ${conditionLabel} | valutazione manuale`;

    const messageLines = isOther
      ? [
          structuredLine,
          "",
          `Modello (non in lista): ${form.customModelName.trim()}`,
          form.customStorage ? `Memoria indicata: ${form.customStorage}` : null,
          `Condizione dichiarata: ${conditionLabel}`,
          `Note utente: ${form.notes || "—"}`,
          "",
          `[Da chiedere al cliente]: 4-6 foto del telefono per la valutazione`,
        ]
      : [
          structuredLine,
          "",
          `Modello: ${model!.name} ${form.storage}GB`,
          `Brand: ${model!.brand}`,
          `Anno lancio: ${model!.year}`,
          `Condizione dichiarata: ${conditionLabel}`,
          `Note utente: ${form.notes || "—"}`,
          "",
          `[Da chiedere al cliente]: 4-6 foto del telefono per la valutazione`,
        ];

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "trade-in",
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            company: null,
          },
          product: productPayload,
          message: messageLines.filter(Boolean).join("\n"),
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
      setStep("done");
      setSubmitState({ status: "idle", error: null });
    } catch (e) {
      setSubmitState({
        status: "error",
        error: e instanceof Error ? e.message : "Errore sconosciuto",
      });
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // STEP "done": ricevuta richiesta
  // ────────────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, ease: EASE.smooth }}
        className="bg-card border border-border rounded-2xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-brand-600/10 border border-brand-600/30 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-500"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif italic text-3xl text-foreground">
            Richiesta ricevuta
          </h2>
          <p className="text-muted-foreground max-w-md">
            Un nostro tecnico ti contatta via email entro{" "}
            <strong className="text-foreground">24 ore lavorative</strong>:
            ti chiederà 4-6 foto del telefono per la valutazione personalizzata.
          </p>
        </div>
        <a
          href="/"
          className="text-sm font-mono uppercase tracking-wider text-brand-500 hover:text-brand-400 transition-colors"
        >
          ← Torna alla home
        </a>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 max-w-[1200px] mx-auto">
      {/* ── LEFT: form a step ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        <Stepper current={step} canContinue={canContinue} />

        <AnimatePresence mode="wait">
          {step === "model" && (
            <motion.div
              key="step-model"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE.smooth }}
              className="flex flex-col gap-6"
            >
              <SectionLabel num="01" title="Quale telefono vendi?" />

              <Field label="Marca">
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <Pill
                      key={b}
                      active={form.brand === b}
                      onClick={() =>
                        setForm({
                          ...form,
                          brand: b,
                          modelId: null,
                          storage: null,
                          customModelName: "",
                          customStorage: "",
                        })
                      }
                    >
                      {b}
                    </Pill>
                  ))}
                </div>
              </Field>

              {form.brand && !isOther && (
                <Field label="Modello">
                  <select
                    value={form.modelId ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        modelId: e.target.value || null,
                        storage: null,
                      })
                    }
                    className={fieldClass}
                  >
                    <option value="">Seleziona il modello…</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.year})
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {model && (
                <Field label="Memoria">
                  <div className="flex flex-wrap gap-2">
                    {model.storage.map((gb) => (
                      <Pill
                        key={gb}
                        active={form.storage === gb}
                        onClick={() => setForm({ ...form, storage: gb })}
                      >
                        {gb < 1024 ? `${gb} GB` : `${gb / 1024} TB`}
                      </Pill>
                    ))}
                  </div>
                </Field>
              )}

              {isOther && (
                <>
                  <Field label="Marca e modello del telefono">
                    <input
                      type="text"
                      placeholder="Es. iQOO 12 / Vivo X100 Pro / Doogee V Max…"
                      value={form.customModelName}
                      onChange={(e) =>
                        setForm({ ...form, customModelName: e.target.value })
                      }
                      maxLength={120}
                      className={fieldClass}
                    />
                    <p className="text-xs text-muted-foreground/80 mt-1.5">
                      Modello non trovato nella lista? Scrivilo qui — il
                      tecnico farà la valutazione a mano (sempre entro 24h).
                    </p>
                  </Field>
                  <Field label="Memoria (opzionale)">
                    <input
                      type="text"
                      placeholder="Es. 256GB / 12+512GB"
                      value={form.customStorage}
                      onChange={(e) =>
                        setForm({ ...form, customStorage: e.target.value })
                      }
                      maxLength={40}
                      className={fieldClass}
                    />
                  </Field>
                </>
              )}

              {((!isOther && model && form.storage) ||
                (isOther && form.customModelName.trim())) && (
                <Field label="Condizione del telefono">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {(
                      ["como-nuovo", "buono", "segni-uso"] as TradeInCondition[]
                    ).map((c) => (
                      <ConditionCard
                        key={c}
                        condition={c}
                        active={form.condition === c}
                        onClick={() => setForm({ ...form, condition: c })}
                      />
                    ))}
                  </div>
                </Field>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep("contact")}
                  className={cn(
                    "btn-shine px-6 py-3 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold inline-flex items-center gap-2",
                    "hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                  )}
                >
                  Continua
                  <span aria-hidden>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === "contact" && (
            <motion.form
              key="step-contact"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE.smooth }}
              className="flex flex-col gap-6"
            >
              <SectionLabel num="02" title="A chi mandiamo la valutazione?" />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome e cognome *">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Email *">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field label="Telefono (per dubbi)">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={fieldClass}
                />
              </Field>

              <Field label="Note aggiuntive (opzionale)">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  maxLength={1000}
                  placeholder="Es. scatola originale presente, cover dal day-1, sostituito vetro l'anno scorso, batteria già cambiata, …"
                  className={cn(fieldClass, "resize-none")}
                />
              </Field>

              <div className="bg-brand-600/5 border border-brand-600/20 rounded-lg p-4 text-sm leading-relaxed">
                <p className="text-foreground">
                  <strong className="text-brand-500">Prossimo step:</strong>{" "}
                  ti rispondiamo via email entro 24h chiedendoti 4-6 foto
                  del telefono. Dopo le foto, ricevi la nostra valutazione
                  personalizzata.
                </p>
              </div>

              {/* Honeypot anti-bot */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Non compilare
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

              <label className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={form.privacyAccepted}
                  onChange={(e) =>
                    setForm({ ...form, privacyAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-border bg-popover accent-brand-600 shrink-0"
                />
                <span>
                  Ho letto l&apos;
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 hover:underline"
                  >
                    informativa privacy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati per ricevere la
                  valutazione.
                  <span className="text-brand-500"> *</span>
                </span>
              </label>

              {submitState.error && (
                <p className="text-sm text-brand-500 bg-brand-600/10 border border-brand-600/30 rounded-lg px-4 py-2">
                  {submitState.error}
                </p>
              )}

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("model")}
                  className="px-6 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-brand-600/40 transition-colors"
                >
                  ← Modifica telefono
                </button>
                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  className={cn(
                    "btn-shine px-6 py-3 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold",
                    "hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {submitState.status === "submitting"
                    ? "Invio in corso…"
                    : "Invia richiesta"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ── RIGHT: pannello recap sticky (no prezzi) ────────────────────── */}
      <aside className="lg:sticky lg:top-24 self-start">
        <RecapPanel
          model={model}
          storage={form.storage}
          condition={form.condition}
          isOther={isOther}
          customModelName={form.customModelName}
          customStorage={form.customStorage}
        />
      </aside>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════════════════════

function Stepper({
  current,
  canContinue,
}: {
  current: Step;
  canContinue: boolean;
}) {
  const steps: { id: Step; label: string }[] = [
    { id: "model", label: "Telefono" },
    { id: "contact", label: "Contatti" },
    { id: "done", label: "Email" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider">
      {steps.map((s, i) => {
        const isActive = i === currentIdx;
        const isPast =
          i < currentIdx || (i === 0 && canContinue && current !== "model");
        return (
          <div key={s.id} className="flex items-center gap-3">
            <span
              className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center tabular-nums",
                isActive
                  ? "bg-brand-600 border-brand-600 text-white"
                  : isPast
                    ? "bg-brand-600/20 border-brand-600/50 text-brand-500"
                    : "border-border text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span
              className={isActive ? "text-foreground" : "text-muted-foreground"}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="w-8 h-px bg-border" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500 tabular-nums">
        {num}
      </span>
      <h2 className="font-serif italic text-2xl sm:text-3xl text-foreground">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldClass = cn(
  "w-full px-4 py-3 rounded-lg bg-popover border border-border",
  "text-sm text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40",
  "transition-colors duration-200",
);

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
        active
          ? "bg-brand-600 text-white border-brand-600"
          : "bg-card text-muted-foreground border-border hover:border-brand-600/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ConditionCard({
  condition,
  active,
  onClick,
}: {
  condition: TradeInCondition;
  active: boolean;
  onClick: () => void;
}) {
  const info = CONDITION_DESCRIPTIONS[condition];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-2",
        active
          ? "bg-brand-600/10 border-brand-600 shadow-[0_0_24px_-8px_rgba(220,38,38,0.4)]"
          : "bg-card border-border hover:border-brand-600/40",
      )}
    >
      <span
        className={cn(
          "font-serif italic text-lg",
          active ? "text-foreground" : "text-foreground/90",
        )}
      >
        {info.label}
      </span>
      <span className="text-xs text-muted-foreground leading-relaxed">
        {info.short}
      </span>
    </button>
  );
}

function RecapPanel({
  model,
  storage,
  condition,
  isOther,
  customModelName,
  customStorage,
}: {
  model: ReturnType<typeof findModel>;
  storage: number | null;
  condition: TradeInCondition | null;
  isOther: boolean;
  customModelName: string;
  customStorage: string;
}) {
  const conditionInfo = condition ? CONDITION_DESCRIPTIONS[condition] : null;
  const hasData = isOther
    ? customModelName.trim() && condition
    : model && storage && condition;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
          {hasData ? "Riepilogo" : "Come funziona"}
        </span>
        <h3 className="font-serif italic text-xl text-foreground">
          {hasData ? "Il tuo telefono" : "Quattro passi semplici"}
        </h3>
      </div>

      {hasData ? (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Modello</span>
            <span className="text-foreground text-right">
              {isOther ? customModelName : model?.name}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Memoria</span>
            <span className="text-foreground tabular-nums">
              {isOther
                ? customStorage || "—"
                : storage && storage < 1024
                  ? `${storage} GB`
                  : `${(storage ?? 0) / 1024} TB`}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Condizione</span>
            <span className="text-foreground">{conditionInfo?.label}</span>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Step n="1" text="Scegli marca, modello e condizione" />
          <Step n="2" text="Lascia nome ed email" />
          <Step n="3" text="Ti scriviamo per le foto del telefono" />
          <Step n="4" text="Ricevi la nostra valutazione via email" />
        </ul>
      )}

      <div className="border-t border-border pt-4 flex flex-col gap-2">
        <Bullet>Valutazione gratuita e senza impegno</Bullet>
        <Bullet>Risposta via email entro 24 ore lavorative</Bullet>
        <Bullet>Spedizione gratis o ritiro in negozio</Bullet>
        <Bullet>Bonus +10% se scegli credito Cellcom</Bullet>
      </div>
    </div>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded bg-card-hover border border-border shrink-0 mt-0.5">
        {n}
      </span>
      <span>{text}</span>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-500 shrink-0 mt-0.5"
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
