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
import { fileToCompressedDataUrl } from "@/lib/images/compress-image";

const MAX_PHOTOS = 6;

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
  photos: string[];
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
  photos: [],
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
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  async function handleAddPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_PHOTOS - form.photos.length;
    if (room <= 0) return;
    setUploadingPhotos(true);
    try {
      const picked = Array.from(files).slice(0, room);
      const dataUrls = await Promise.all(
        picked.map((f) => fileToCompressedDataUrl(f)),
      );
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...dataUrls] }));
    } catch {
      setSubmitState({
        status: "error",
        error: "Una foto non è valida. Usa JPG o PNG.",
      });
    } finally {
      setUploadingPhotos(false);
    }
  }

  function removePhoto(idx: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  }

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
          photos: form.photos,
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
        className="rounded-2xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center gap-6"
        style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2
            className="font-sans tracking-[-0.02em]"
            style={{ fontSize: "28px", color: "#0a0a0a", fontWeight: 700 }}
          >
            Richiesta ricevuta
          </h2>
          <p style={{ color: "#525252", maxWidth: "30rem" }}>
            Un nostro tecnico ti contatta via email entro{" "}
            <strong style={{ color: "#0a0a0a" }}>24 ore lavorative</strong>:
            ti chiederà 4-6 foto del telefono per la valutazione personalizzata.
          </p>
        </div>
        <a
          href="/"
          className="font-mono uppercase hover:underline"
          style={{
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#dc2626",
            fontWeight: 500,
          }}
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
                    style={fieldStyle}
                  >
                    <option value="">Seleziona il modello…</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
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
                      style={fieldStyle}
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
                      style={fieldStyle}
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
                  className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Continua
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
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
                    style={fieldStyle}
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
                    style={fieldStyle}
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
                  style={fieldStyle}
                />
              </Field>

              <Field label={`Foto del telefono (consigliato — max ${MAX_PHOTOS})`}>
                <div className="flex flex-wrap gap-3">
                  {form.photos.map((src, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Foto ${i + 1}`}
                        className="h-20 w-20 rounded-lg object-cover"
                        style={{ border: "1px solid #e5e5e5" }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        aria-label="Rimuovi foto"
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full leading-none"
                        style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "13px" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {form.photos.length < MAX_PHOTOS && (
                    <label
                      className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg text-center"
                      style={{ border: "1px dashed #d4d4d4", color: "#737373", fontSize: "11px" }}
                    >
                      {uploadingPhotos ? "…" : "+ Foto"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          void handleAddPhotos(e.target.files);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/80 mt-1.5">
                  Aggiungi foto di fronte, retro, schermo acceso ed eventuali
                  danni: velocizzi la valutazione. (Puoi anche inviarle dopo via
                  email.)
                </p>
              </Field>

              <div
                className="rounded-xl p-4 leading-relaxed"
                style={{
                  fontSize: "14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#0a0a0a",
                }}
              >
                <p>
                  <strong style={{ color: "#dc2626" }}>Prossimo step:</strong>{" "}
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

              <label
                className="flex items-start gap-3 leading-relaxed cursor-pointer select-none"
                style={{ fontSize: "12px", color: "#525252" }}
              >
                <input
                  type="checkbox"
                  required
                  checked={form.privacyAccepted}
                  onChange={(e) =>
                    setForm({ ...form, privacyAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded shrink-0"
                  style={{
                    accentColor: "#dc2626",
                  }}
                />
                <span>
                  Ho letto l&apos;
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "#dc2626" }}
                  >
                    informativa privacy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati per ricevere la
                  valutazione.
                  <span style={{ color: "#dc2626" }}> *</span>
                </span>
              </label>

              {submitState.error && (
                <p
                  className="rounded-xl px-4 py-3"
                  style={{
                    fontSize: "14px",
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                  }}
                >
                  {submitState.error}
                </p>
              )}

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("model")}
                  className="rounded-full px-6 py-3 transition-colors hover:border-[#dc2626] hover:text-[#0a0a0a]"
                  style={{
                    border: "1px solid #e5e5e5",
                    fontSize: "14px",
                    color: "#525252",
                    backgroundColor: "#ffffff",
                    fontWeight: 500,
                  }}
                >
                  ← Modifica telefono
                </button>
                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  {submitState.status === "submitting"
                    ? "Invio in corso…"
                    : "Invia richiesta"}
                  {submitState.status !== "submitting" && (
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  )}
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
    <div className="flex items-center gap-3 font-mono uppercase tracking-wider">
      {steps.map((s, i) => {
        const isActive = i === currentIdx;
        const isPast =
          i < currentIdx || (i === 0 && canContinue && current !== "model");
        const bg = isActive
          ? "#dc2626"
          : isPast
            ? "#fef2f2"
            : "#f5f5f4";
        const bd = isActive
          ? "#dc2626"
          : isPast
            ? "#fecaca"
            : "#e5e5e5";
        const fg = isActive ? "#ffffff" : isPast ? "#dc2626" : "#a3a3a3";
        return (
          <div key={s.id} className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center tabular-nums"
              style={{
                backgroundColor: bg,
                border: `1px solid ${bd}`,
                color: fg,
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: isActive ? "#0a0a0a" : "#737373",
              }}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className="w-8 h-px"
                style={{ backgroundColor: "#e5e5e5" }}
                aria-hidden
              />
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
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize: "10px",
          letterSpacing: "0.28em",
          color: "#dc2626",
        }}
      >
        {num}
      </span>
      <h2
        className="font-sans tracking-[-0.02em]"
        style={{
          fontSize: "clamp(22px, 2.4vw, 32px)",
          color: "#0a0a0a",
          fontWeight: 700,
        }}
      >
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
      <label
        className="font-mono uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          color: "#737373",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldClass = cn(
  "w-full px-4 py-3 rounded-xl",
  "focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626]",
  "transition-colors duration-200",
);

const fieldStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
};

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
      className="rounded-full transition-all duration-200"
      style={{
        backgroundColor: active ? "#dc2626" : "#ffffff",
        border: `1px solid ${active ? "#dc2626" : "#e5e5e5"}`,
        color: active ? "#ffffff" : "#0a0a0a",
        fontSize: "14px",
        fontWeight: 500,
        padding: "8px 16px",
      }}
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
      className="text-left rounded-2xl transition-all duration-200 flex flex-col gap-2 p-5"
      style={{
        backgroundColor: active ? "#fef2f2" : "#ffffff",
        border: `1px solid ${active ? "#dc2626" : "#ececec"}`,
        boxShadow: active
          ? "0 18px 44px -18px rgba(220,38,38,0.35)"
          : undefined,
      }}
    >
      <span
        className="font-sans"
        style={{
          fontSize: "17px",
          color: "#0a0a0a",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {info.label}
      </span>
      <span
        className="leading-relaxed"
        style={{ fontSize: "12px", color: "#525252" }}
      >
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
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #ececec",
        boxShadow: "0 24px 60px -28px rgba(0,0,0,0.12)",
      }}
    >
      <div className="flex flex-col gap-2">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.28em",
            color: "#dc2626",
          }}
        >
          {hasData ? "Riepilogo" : "Come funziona"}
        </span>
        <h3
          className="font-sans tracking-[-0.01em]"
          style={{
            fontSize: "20px",
            color: "#0a0a0a",
            fontWeight: 700,
          }}
        >
          {hasData ? "Il tuo telefono" : "Quattro passi semplici"}
        </h3>
      </div>

      {hasData ? (
        <div className="flex flex-col gap-2" style={{ fontSize: "14px" }}>
          <div className="flex justify-between gap-3">
            <span style={{ color: "#737373" }}>Modello</span>
            <span
              style={{ color: "#0a0a0a", textAlign: "right", fontWeight: 500 }}
            >
              {isOther ? customModelName : model?.name}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: "#737373" }}>Memoria</span>
            <span
              className="tabular-nums"
              style={{ color: "#0a0a0a", fontWeight: 500 }}
            >
              {isOther
                ? customStorage || "—"
                : storage && storage < 1024
                  ? `${storage} GB`
                  : `${(storage ?? 0) / 1024} TB`}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: "#737373" }}>Condizione</span>
            <span style={{ color: "#0a0a0a", fontWeight: 500 }}>
              {conditionInfo?.label}
            </span>
          </div>
        </div>
      ) : (
        <ul
          className="flex flex-col gap-2"
          style={{ fontSize: "14px", color: "#525252" }}
        >
          <Step n="1" text="Scegli marca, modello e condizione" />
          <Step n="2" text="Lascia nome ed email" />
          <Step n="3" text="Ti scriviamo per le foto del telefono" />
          <Step n="4" text="Ricevi la nostra valutazione via email" />
        </ul>
      )}

      <div
        className="pt-4 flex flex-col gap-2"
        style={{ borderTop: "1px solid #ececec" }}
      >
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
      <span
        className="font-mono tabular-nums shrink-0 px-2 py-0.5 rounded mt-0.5"
        style={{
          fontSize: "10px",
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
          fontWeight: 600,
        }}
      >
        {n}
      </span>
      <span>{text}</span>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2"
      style={{ fontSize: "12px", color: "#525252" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5"
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
