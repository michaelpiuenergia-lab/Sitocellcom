"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  REPAIR_TYPES,
  SERVICE_MODES,
  type RepairTypeId,
  type ServiceMode,
} from "@/lib/repairs/types";
import { listRepairStores, type Store } from "@/lib/stores";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";
import {
  CATEGORIES,
  CATEGORY_TO_DB,
  getCategory,
  brandsForCategoryId,
  type DeviceCategoryId,
} from "@/lib/repairs/devices";
import {
  modelsForCategoryBrand,
  findModelById,
  modelImageUrl,
  realCodes,
  type RepairModel,
} from "@/lib/repairs/models-db";
import { BrandLogo } from "./brand-logo";
import { useLang } from "@/lib/i18n/lang-context";

type Step = "device" | "repairs" | "service" | "done";

const OTHER_BRAND = "Altro / non in lista";

type FormState = {
  // Step 1
  category: DeviceCategoryId | null;
  brand: string | null;
  modelId: string | null;
  customModelName: string;
  customStorage: string;
  storage: number | null;
  // Step 2
  repairTypes: Set<RepairTypeId>;
  problemNotes: string;
  // Step 3
  serviceMode: ServiceMode | null;
  storeId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCap: string;
  shippingProvince: string;
  /** Data appuntamento ISO YYYY-MM-DD (solo per in-store / at-home / pickup-at-home) */
  appointmentDate: string | null;
  /** Slot orario HH:mm */
  appointmentTime: string | null;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  hpf: string;
};

const EMPTY: FormState = {
  category: null,
  brand: null,
  modelId: null,
  customModelName: "",
  customStorage: "",
  storage: null,
  repairTypes: new Set(),
  problemNotes: "",
  serviceMode: null,
  storeId: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  shippingCity: "",
  shippingCap: "",
  shippingProvince: "",
  appointmentDate: null,
  appointmentTime: null,
  privacyAccepted: false,
  termsAccepted: false,
  hpf: "",
};

/**
 * 7 giorni rolling a partire da domani. Domenica skippata (chiuso).
 * Restituisce array di { iso: "2026-05-27", weekday: "mer", day: 27, isSunday: false }.
 */
function nextSevenDays() {
  const days: Array<{
    iso: string;
    weekday: string;
    day: number;
    month: string;
    isSunday: boolean;
  }> = [];
  const wkLabels = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
  const monthLabels = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const now = new Date();
  for (let i = 1; i <= 8; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      weekday: wkLabels[d.getDay()],
      day: d.getDate(),
      month: monthLabels[d.getMonth()],
      isSunday: d.getDay() === 0,
    });
  }
  return days;
}

const TIME_SLOTS_MORNING = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
const TIME_SLOTS_AFTERNOON = ["15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];

/** Modalità servizio che richiedono appuntamento (data+ora) */
function needsAppointment(mode: ServiceMode | null): boolean {
  return mode === "in-store" || mode === "at-home" || mode === "pickup-at-home";
}

export function RepairWizard() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("device");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "submitting" | "error";
    error: string | null;
  }>({ status: "idle", error: null });

  const category = form.category ? getCategory(form.category) : null;
  const isOtherBrand = form.brand === OTHER_BRAND;
  const isSmartphone = form.category === "smartphone";

  // Brand mostrati per categoria, ordinati per popolarità. Per smartphone
  // aggiungiamo "Altro / non in lista" come escape hatch.
  const brands = useMemo(() => {
    if (!form.category) return [] as string[];
    const list = brandsForCategoryId(form.category).map((b) => b.name);
    if (isSmartphone) list.push(OTHER_BRAND);
    return list;
  }, [form.category, isSmartphone]);

  const models = useMemo<RepairModel[]>(
    () =>
      form.category && form.brand && !isOtherBrand
        ? modelsForCategoryBrand(CATEGORY_TO_DB[form.category], form.brand)
        : [],
    [form.category, form.brand, isOtherBrand],
  );

  // Search dentro la lista del brand corrente. La query filtra direttamente
  // la grid sotto (no dropdown autocomplete).
  const [modelQuery, setModelQuery] = useState("");
  const visibleModels = useMemo<RepairModel[]>(() => {
    if (!models.length) return [];
    const q = modelQuery.trim().toLowerCase();
    if (q.length < 2) return models;
    return models.filter((m) => {
      const blob = `${m.brand} ${m.name} ${m.codes.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [models, modelQuery]);

  const model = useMemo<RepairModel | null>(
    () => (form.modelId ? findModelById(parseInt(form.modelId, 10)) ?? null : null),
    [form.modelId],
  );
  const stores = useMemo(() => listRepairStores(), []);

  // deviceReady:
  //  - "Altro brand" (solo smartphone) → serve customModelName
  //  - brand noto → serve model (per smartphone serve anche storage)
  const deviceReady = !form.category
    ? false
    : isOtherBrand
      ? Boolean(form.customModelName.trim())
      : Boolean(model && (isSmartphone ? form.storage : true));

  const repairsReady = form.repairTypes.size > 0;

  const serviceReady = (() => {
    if (!form.serviceMode) return false;
    if (form.serviceMode === "in-store" && !form.storeId) return false;
    if (
      (form.serviceMode === "at-home" ||
        form.serviceMode === "pickup-at-home" ||
        form.serviceMode === "ship-to-us") &&
      !(form.shippingAddress && form.shippingCity && form.shippingCap)
    )
      return false;
    if (needsAppointment(form.serviceMode)) {
      if (!form.appointmentDate || !form.appointmentTime) return false;
    }
    return true;
  })();

  const sevenDays = useMemo(() => nextSevenDays(), []);

  function toggleRepair(id: RepairTypeId) {
    const next = new Set(form.repairTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setForm({ ...form, repairTypes: next });
  }

  function deviceLabel(): string {
    if (isOtherBrand) {
      return (
        form.customModelName.trim() +
        (form.customStorage ? ` ${form.customStorage}` : "")
      );
    }
    if (model) {
      if (isSmartphone && form.storage) {
        return `${model.brand} ${model.name} ${form.storage}GB`;
      }
      return `${model.brand} ${model.name}`;
    }
    return "—";
  }

  function repairLabels(): string[] {
    return REPAIR_TYPES.filter((r) => form.repairTypes.has(r.id)).map(
      (r) => r.label,
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceReady) return;
    if (!form.privacyAccepted) {
      setSubmitState({
        status: "error",
        error:
          "Devi accettare l'informativa privacy per inviare la richiesta.",
      });
      return;
    }
    if (!form.termsAccepted) {
      setSubmitState({
        status: "error",
        error:
          "Devi accettare i termini e condizioni per inviare la richiesta.",
      });
      return;
    }
    setSubmitState({ status: "submitting", error: null });

    const selectedStore =
      form.storeId ? stores.find((s) => s.id === form.storeId) : null;
    const serviceModeLabel =
      SERVICE_MODES.find((m) => m.id === form.serviceMode)?.label ?? "—";
    const labels = repairLabels();
    const appointment =
      needsAppointment(form.serviceMode) && form.appointmentDate && form.appointmentTime
        ? `${form.appointmentDate} ore ${form.appointmentTime}`
        : null;

    // Riga strutturata in cima per parsing CRM, blocco human-readable sotto.
    const structuredLine = `REPAIR | ${deviceLabel()} | ${labels.join(", ")} | ${serviceModeLabel}${selectedStore ? ` @ ${selectedStore.name}` : ""}${appointment ? ` | ${appointment}` : ""}`;

    const messageLines = [
      structuredLine,
      "",
      `Dispositivo: ${deviceLabel()}`,
      `Riparazioni richieste: ${labels.join(", ") || "—"}`,
      `Modalità servizio: ${serviceModeLabel}`,
      selectedStore
        ? `Negozio scelto: ${selectedStore.name} — ${selectedStore.address}, ${selectedStore.city} ${selectedStore.cap}`
        : null,
      appointment ? `Appuntamento: ${appointment}` : null,
      form.shippingAddress
        ? `Indirizzo cliente: ${form.shippingAddress}, ${form.shippingCap} ${form.shippingCity}${form.shippingProvince ? " " + form.shippingProvince : ""}`
        : null,
      form.problemNotes
        ? `Descrizione problema: ${form.problemNotes}`
        : null,
      "",
      `[Da fare]: contattare il cliente entro 24h per diagnosi e preventivo (no prezzi mostrati online).`,
    ].filter(Boolean);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "repair",
          customer: {
            name: form.customerName,
            email: form.customerEmail,
            phone: form.customerPhone || null,
            company: null,
          },
          product: {
            id: null,
            slug: null,
            name: deviceLabel(),
            variantId: null,
            variantLabel: `${labels.join(", ")} · ${serviceModeLabel}`,
          },
          message: messageLines.join("\n"),
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
  // STEP "done"
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
            Un nostro tecnico ti contatta via email o telefono entro{" "}
            <strong className="text-foreground">24 ore lavorative</strong> con
            diagnosi e preventivo. Riceverai anche il numero di ticket per
            tracciare la riparazione.
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
      {/* ── LEFT ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        <Stepper
          current={step}
          deviceReady={deviceReady}
          repairsReady={repairsReady}
          onStepClick={setStep}
        />

        <AnimatePresence mode="wait">
          {step === "device" && (
            <motion.div
              key="step-device"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE.smooth }}
              className="flex flex-col gap-6"
            >
              {/* ── STEP 1.1: Categoria dispositivo ─────────────────────── */}
              {!form.category && (
                <>
                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                      {t("rw.cat.heading")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("rw.cat.subheading")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                    {CATEGORIES.map((c) => (
                      <CategoryCard
                        key={c.id}
                        id={c.id}
                        label={t(c.labelKey)}
                        onClick={() =>
                          setForm({
                            ...EMPTY,
                            category: c.id,
                          })
                        }
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ── STEP 1.2: Brand ──────────────────────────────────────── */}
              {form.category && !form.brand && (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => setForm(EMPTY)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t("rw.brand.back")}
                    </button>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-600/30 text-brand-500 text-sm">
                      <strong className="font-serif italic">
                        {category ? t(category.labelKey) : ""}
                      </strong>
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                      {t("rw.brand.heading")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("rw.brand.subheading")}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {brands.map((b) => (
                      <BrandCard
                        key={b}
                        name={b}
                        active={false}
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
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ── STEP 1.3a: Modello smartphone ─────────────────────────── */}
              {form.category && form.brand && isSmartphone && (
                <>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          brand: null,
                          modelId: null,
                          storage: null,
                          customModelName: "",
                          customStorage: "",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span aria-hidden>←</span> {form.brand}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                      {t("rw.model.heading")}
                    </h2>
                  </div>

                  {/* SEARCH bar globale modelli smartphone */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder={t("rw.model.searchPh")}
                      value={modelQuery}
                      onChange={(e) => setModelQuery(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-12 py-4 rounded-2xl bg-popover border-2 border-brand-600/30",
                        "text-base text-foreground placeholder:text-muted-foreground/60",
                        "focus:outline-none focus:border-brand-600 transition-colors duration-200",
                      )}
                    />
                    {modelQuery && (
                      <button
                        type="button"
                        onClick={() => setModelQuery("")}
                        aria-label="Clear search"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-card-hover text-muted-foreground hover:text-foreground"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M6 6l12 12M6 18L18 6" />
                        </svg>
                      </button>
                    )}

                  </div>

                  {!isOtherBrand && models.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {!modelQuery && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                            {t("rw.model.orChoose")}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                      {modelQuery && visibleModels.length === 0 && (
                        <div
                          className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center"
                          style={{ fontSize: "14px", color: "#737373" }}
                        >
                          Nessun modello {form.brand} per &ldquo;{modelQuery}&rdquo;.
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                        {visibleModels.map((m) => (
                          <ModelCard
                            key={m.id}
                            model={m}
                            active={form.modelId === String(m.id)}
                            onClick={() =>
                              setForm({
                                ...form,
                                modelId: String(m.id),
                                storage: null,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {model && isSmartphone && (
                    <Field label="Memoria">
                      <div className="flex flex-wrap gap-2">
                        {[64, 128, 256, 512, 1024].map((gb) => (
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

                  {isOtherBrand && (
                    <>
                      <Field label="Marca e modello del telefono">
                        <input
                          type="text"
                          placeholder="Es. Vivo X100 Pro / Doogee S100 / Cubot…"
                          value={form.customModelName}
                          onChange={(e) =>
                            setForm({ ...form, customModelName: e.target.value })
                          }
                          maxLength={120}
                          className={fieldClass}
                        />
                      </Field>
                      <Field label="Memoria (opzionale)">
                        <input
                          type="text"
                          placeholder="Es. 128GB / 8+256GB"
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
                </>
              )}

              {/* ── STEP 1.3b: non-smartphone — modello free text ──────────── */}
              {form.category && form.brand && !isSmartphone && (
                <>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          brand: null,
                          customModelName: "",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span aria-hidden>←</span> {form.brand}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                      {t("rw.nonSmartphone.heading")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("rw.nonSmartphone.intro")}
                    </p>
                  </div>

                  <Field label={t("rw.nonSmartphone.modelLabel")}>
                    <input
                      type="text"
                      placeholder={t("rw.nonSmartphone.modelPh")}
                      value={form.customModelName}
                      onChange={(e) =>
                        setForm({ ...form, customModelName: e.target.value })
                      }
                      maxLength={120}
                      className={fieldClass}
                      autoFocus
                    />
                  </Field>
                </>
              )}

              {form.category && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    disabled={!deviceReady}
                    onClick={() => setStep("repairs")}
                    className={primaryBtnClass}
                  >
                    Continua
                    <span aria-hidden>→</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === "repairs" && (
            <motion.div
              key="step-repairs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE.smooth }}
              className="flex flex-col gap-6"
            >
              <SectionLabel num="02" title="Cosa devi riparare?" />
              <p className="text-sm text-muted-foreground -mt-3">
                Seleziona una o più voci. Se non sei sicuro, scegli{" "}
                <strong className="text-foreground">Altro / Diagnosi</strong>:
                ci pensiamo noi a capire il problema.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {REPAIR_TYPES.map((r) => (
                  <RepairTypeCard
                    key={r.id}
                    label={r.label}
                    description={r.description}
                    icon={r.icon}
                    active={form.repairTypes.has(r.id)}
                    onClick={() => toggleRepair(r.id)}
                  />
                ))}
              </div>

              <Field label="Descrizione del problema (opzionale)">
                <textarea
                  value={form.problemNotes}
                  onChange={(e) =>
                    setForm({ ...form, problemNotes: e.target.value })
                  }
                  rows={3}
                  maxLength={2000}
                  placeholder="Es. caduto in piscina ieri sera, ora il touch non risponde nella metà destra dello schermo…"
                  className={cn(fieldClass, "resize-none")}
                />
              </Field>

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("device")}
                  className={ghostBtnClass}
                >
                  ← Modifica telefono
                </button>
                <button
                  type="button"
                  disabled={!repairsReady}
                  onClick={() => setStep("service")}
                  className={primaryBtnClass}
                >
                  Continua
                  <span aria-hidden>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === "service" && (
            <motion.form
              key="step-service"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.normal, ease: EASE.smooth }}
              className="flex flex-col gap-6"
            >
              <SectionLabel
                num="03"
                title="Come ce lo facciamo arrivare?"
              />

              {/* Modalità servizio */}
              <Field label="Modalità">
                <div className="grid sm:grid-cols-2 gap-3">
                  {SERVICE_MODES.map((m) => (
                    <ServiceModeCard
                      key={m.id}
                      label={m.label}
                      description={m.description}
                      iconHint={m.iconHint}
                      priceLabel={m.priceLabel}
                      isFree={m.priceEur === 0}
                      active={form.serviceMode === m.id}
                      onClick={() => setForm({ ...form, serviceMode: m.id })}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/80 mt-2">
                  Le tariffe sopra sono solo le spese di logistica del corriere
                  — la riparazione resta sempre da preventivo dopo diagnosi.
                </p>
              </Field>

              {/* In-store: store picker */}
              {form.serviceMode === "in-store" && (
                <Field label="Quale negozio?">
                  <div className="flex flex-col gap-2">
                    {stores.map((s) => (
                      <StoreOption
                        key={s.id}
                        store={s}
                        active={form.storeId === s.id}
                        onClick={() => setForm({ ...form, storeId: s.id })}
                      />
                    ))}
                  </div>
                </Field>
              )}

              {/* Appuntamento — solo per servizi con presenza fisica */}
              {needsAppointment(form.serviceMode) && (
                <AppointmentPicker
                  days={sevenDays}
                  selectedDate={form.appointmentDate}
                  selectedTime={form.appointmentTime}
                  onDate={(iso) => setForm({ ...form, appointmentDate: iso, appointmentTime: null })}
                  onTime={(t) => setForm({ ...form, appointmentTime: t })}
                />
              )}

              {/* Ship-to-us: condizioni spedizione + indirizzo destinazione */}
              {form.serviceMode === "ship-to-us" && <ShippingBlock />}

              {/* Indirizzo cliente per spedisci / pickup / domicilio */}
              {(form.serviceMode === "ship-to-us" ||
                form.serviceMode === "pickup-at-home" ||
                form.serviceMode === "at-home") && (
                <Field label="Il tuo indirizzo">
                  <div className="grid sm:grid-cols-[1fr_120px] gap-3">
                    <input
                      type="text"
                      placeholder="Via / Piazza + numero civico"
                      value={form.shippingAddress}
                      onChange={(e) =>
                        setForm({ ...form, shippingAddress: e.target.value })
                      }
                      className={fieldClass}
                      required
                    />
                    <input
                      type="text"
                      placeholder="CAP"
                      value={form.shippingCap}
                      onChange={(e) =>
                        setForm({ ...form, shippingCap: e.target.value })
                      }
                      maxLength={5}
                      className={fieldClass}
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-[1fr_120px] gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Città"
                      value={form.shippingCity}
                      onChange={(e) =>
                        setForm({ ...form, shippingCity: e.target.value })
                      }
                      className={fieldClass}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Prov."
                      value={form.shippingProvince}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shippingProvince: e.target.value.toUpperCase(),
                        })
                      }
                      maxLength={2}
                      className={fieldClass}
                    />
                  </div>
                </Field>
              )}

              {/* Contatti */}
              <Field label="I tuoi contatti">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome e cognome *"
                    required
                    autoComplete="name"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className={fieldClass}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    autoComplete="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                    className={fieldClass}
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Telefono (consigliato per la diagnosi)"
                  autoComplete="tel"
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm({ ...form, customerPhone: e.target.value })
                  }
                  className={cn(fieldClass, "mt-3")}
                />
              </Field>

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

              <div className="flex flex-col gap-3 pt-2">
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
                    e acconsento al trattamento dei miei dati per gestire la
                    richiesta di riparazione.
                    <span className="text-brand-500"> *</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={form.termsAccepted}
                    onChange={(e) =>
                      setForm({ ...form, termsAccepted: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded border-border bg-popover accent-brand-600 shrink-0"
                  />
                  <span>
                    Accetto i{" "}
                    <a
                      href="/termini-e-condizioni"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline"
                    >
                      termini e condizioni
                    </a>{" "}
                    del servizio di riparazione (diagnosi gratuita, garanzia 12
                    mesi, possibilità di cancellare in ogni momento).
                    <span className="text-brand-500"> *</span>
                  </span>
                </label>
              </div>

              {submitState.error && (
                <p className="text-sm text-brand-500 bg-brand-600/10 border border-brand-600/30 rounded-lg px-4 py-2">
                  {submitState.error}
                </p>
              )}

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("repairs")}
                  className={ghostBtnClass}
                >
                  ← Modifica riparazioni
                </button>
                <button
                  type="submit"
                  disabled={submitState.status === "submitting" || !serviceReady}
                  className={primaryBtnClass}
                >
                  {submitState.status === "submitting"
                    ? "Invio…"
                    : "Conferma richiesta"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ── RIGHT: recap sticky ─────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-24 self-start">
        <RecapPanel
          deviceLabel={deviceLabel()}
          repairLabels={repairLabels()}
          serviceMode={form.serviceMode}
          storeName={
            form.storeId ? stores.find((s) => s.id === form.storeId)?.name : null
          }
          appointmentDate={form.appointmentDate}
          appointmentTime={form.appointmentTime}
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
  deviceReady,
  repairsReady,
  onStepClick,
}: {
  current: Step;
  deviceReady: boolean;
  repairsReady: boolean;
  onStepClick: (s: Step) => void;
}) {
  const { t } = useLang();
  const steps: { id: Step; label: string }[] = [
    { id: "device", label: t("rw.step.device") },
    { id: "repairs", label: t("rw.step.repairs") },
    { id: "service", label: t("rw.step.service") },
  ];
  const currentIdx = steps.findIndex((s) => s.id === current);

  // Uno step è raggiungibile se:
  //  - è quello corrente (no-op ma cliccabile per coerenza),
  //  - è uno step precedente (sempre tornabile),
  //  - è uno step successivo MA tutti i precedenti sono completi.
  function isReachable(idx: number): boolean {
    if (idx <= currentIdx) return true;
    if (idx === 1) return deviceReady;
    if (idx === 2) return deviceReady && repairsReady;
    return false;
  }

  return (
    <div className="flex items-center justify-center gap-0 mb-2">
      {steps.map((s, i) => {
        const isActive = i === currentIdx;
        const isPast =
          i < currentIdx ||
          (i === 0 && deviceReady && current !== "device") ||
          (i === 1 && repairsReady && current === "service");
        const reachable = isReachable(i);
        return (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => reachable && onStepClick(s.id)}
              disabled={!reachable}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex flex-col items-center gap-1.5 group transition-opacity duration-200",
                reachable
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-60",
              )}
            >
              <span
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center tabular-nums font-mono text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-brand-600 border-brand-600 text-white shadow-[0_0_16px_-2px_rgba(220,38,38,0.5)]"
                    : isPast
                      ? "bg-brand-600/20 border-brand-600/50 text-brand-500 group-hover:bg-brand-600/30 group-hover:border-brand-600"
                      : reachable
                        ? "border-border bg-card text-muted-foreground group-hover:border-brand-600/50 group-hover:text-foreground"
                        : "border-border bg-card text-muted-foreground",
                )}
              >
                {isPast && !isActive ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors",
                  isActive
                    ? "text-foreground"
                    : isPast
                      ? "text-brand-500/80 group-hover:text-brand-500"
                      : reachable
                        ? "text-muted-foreground group-hover:text-foreground"
                        : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-24 mx-2 sm:mx-3 mb-6 transition-colors duration-300",
                  isPast || (isActive && i < currentIdx)
                    ? "bg-brand-600/50"
                    : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CategoryCard({
  id,
  label,
  onClick,
}: {
  id: DeviceCategoryId;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "aspect-[5/4] rounded-2xl border-2 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-200",
        "bg-card border-border hover:border-brand-600 hover:bg-card-hover hover:shadow-[0_0_28px_-10px_rgba(220,38,38,0.45)]",
      )}
    >
      <CategoryIcon id={id} />
      <span
        className="font-mono uppercase text-[11px] sm:text-xs tracking-[0.18em] text-foreground"
      >
        {label}
      </span>
    </button>
  );
}

function CategoryIcon({ id }: { id: DeviceCategoryId }) {
  const common = {
    width: 44,
    height: 44,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-foreground/85",
  };
  switch (id) {
    case "smartphone":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M11 5h2" />
          <path d="M10 19h4" />
        </svg>
      );
    case "tablet":
      return (
        <svg {...common}>
          <rect x="3.5" y="3" width="17" height="18" rx="2" />
          <path d="M9 20h6" />
        </svg>
      );
    case "watch":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2.5" />
          <path d="M9 6V3h6v3" />
          <path d="M9 18v3h6v-3" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 18h20l-1.5 2H3.5z" />
          <path d="M10 18h4" />
        </svg>
      );
    case "desktop":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="13" rx="1.5" />
          <path d="M9 20h6" />
          <path d="M12 16v4" />
          <path d="M5.5 5.5h.01" />
        </svg>
      );
    case "console":
      return (
        <svg {...common}>
          <path d="M4 10h7v6a3 3 0 0 1-6 0V10z" />
          <rect x="13" y="3" width="6" height="18" rx="1.5" />
          <path d="M15 7h2" />
          <path d="M15 11h2" />
          <circle cx="16" cy="16" r="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

function BrandCard({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "aspect-[5/4] rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 px-3 py-3 transition-all duration-200",
        active
          ? "bg-brand-600/10 border-brand-600 shadow-[0_0_24px_-8px_rgba(220,38,38,0.4)]"
          : "bg-card border-border hover:border-brand-600/40 hover:bg-card-hover",
      )}
    >
      {name === OTHER_BRAND ? (
        <span
          className={cn(
            "font-serif text-sm italic tracking-tight",
            active ? "text-brand-500" : "text-foreground/80",
          )}
        >
          {name}
        </span>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center min-h-0 w-full">
            <BrandLogo name={name} size={32} color={active ? "dc2626" : "404040"} />
          </div>
          <span
            className={cn(
              "font-mono uppercase text-[10px] tracking-[0.18em] leading-none truncate max-w-full",
              active ? "text-brand-500" : "text-foreground/70",
            )}
          >
            {name}
          </span>
        </>
      )}
    </button>
  );
}

function ModelCard({
  model,
  active,
  onClick,
}: {
  model: RepairModel;
  active: boolean;
  onClick: () => void;
}) {
  const img = modelImageUrl(model);
  // Codici "veri" (filtra placeholder N/A del plugin sorgente)
  const codes = realCodes(model);
  const visibleCodes = codes.slice(0, 2).join(", ");
  const remainingCodes = codes.length > 2 ? codes.length - 2 : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2",
        active
          ? "bg-brand-600/10 border-brand-600 shadow-[0_0_24px_-8px_rgba(220,38,38,0.4)]"
          : "bg-card border-border hover:border-brand-600/40 hover:bg-card-hover",
      )}
    >
      <div className="aspect-square w-full flex items-center justify-center bg-card-hover rounded-lg overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={`${model.brand} ${model.name}`}
            width={140}
            height={140}
            unoptimized
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/60">
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <path d="M9 18h6" />
          </svg>
        )}
      </div>
      <span
        className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand-500/90 leading-none"
      >
        {model.brand}
      </span>
      <span
        className={cn(
          "font-sans text-[13px] leading-snug",
          active ? "text-foreground font-semibold" : "text-foreground/90 font-medium",
        )}
        title={model.name}
      >
        {model.name}
      </span>
      {visibleCodes && (
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground line-clamp-1">
          {visibleCodes}
          {remainingCodes > 0 && (
            <span className="text-brand-500/70"> · +{remainingCodes}</span>
          )}
        </span>
      )}
    </button>
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

const primaryBtnClass = cn(
  "btn-shine px-6 py-3 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold inline-flex items-center gap-2",
  "hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
);

const ghostBtnClass =
  "px-6 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-brand-600/40 transition-colors";

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

function RepairTypeCard({
  label,
  description,
  icon,
  active,
  onClick,
}: {
  label: string;
  description: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-4 rounded-xl border transition-all duration-200 flex gap-3 items-start",
        active
          ? "bg-brand-600/10 border-brand-600 shadow-[0_0_24px_-8px_rgba(220,38,38,0.4)]"
          : "bg-card border-border hover:border-brand-600/40",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          active
            ? "bg-brand-600/20 text-brand-500"
            : "bg-card-hover text-muted-foreground",
        )}
      >
        <RepairIcon name={icon} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className={cn(
            "font-serif italic text-base",
            active ? "text-foreground" : "text-foreground/90",
          )}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </span>
      </div>
    </button>
  );
}

function ServiceModeCard({
  label,
  description,
  iconHint,
  priceLabel,
  isFree,
  active,
  onClick,
}: {
  label: string;
  description: string;
  iconHint: string;
  priceLabel: string;
  isFree: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-5 rounded-xl border transition-all duration-200 flex flex-col gap-2 h-full relative",
        active
          ? "bg-brand-600/10 border-brand-600 shadow-[0_0_24px_-8px_rgba(220,38,38,0.4)]"
          : "bg-card border-border hover:border-brand-600/40",
      )}
    >
      <span
        className={cn(
          "absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border tabular-nums",
          isFree
            ? "bg-green-500/10 text-green-400 border-green-500/30"
            : "bg-brand-600/10 text-brand-500 border-brand-600/30",
        )}
      >
        {priceLabel}
      </span>
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          active ? "bg-brand-600/20 text-brand-500" : "bg-card-hover text-muted-foreground",
        )}
      >
        <ServiceIcon name={iconHint} />
      </div>
      <span className="font-serif italic text-lg text-foreground mt-1 pr-16">
        {label}
      </span>
      <span className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </span>
    </button>
  );
}

function StoreOption({
  store,
  active,
  onClick,
}: {
  store: Store;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-start gap-4",
        active
          ? "bg-brand-600/10 border-brand-600"
          : "bg-card border-border hover:border-brand-600/40",
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border",
              active
                ? "bg-brand-600/20 text-brand-500 border-brand-600/40"
                : "bg-card-hover text-muted-foreground border-border",
            )}
          >
            {store.brand}
          </span>
          <span className="font-serif italic text-foreground">
            {store.name}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {store.address}, {store.cap} {store.city} ({store.province})
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {store.phone} · {store.hours}
        </span>
      </div>
      {active && (
        <svg
          width="20"
          height="20"
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
      )}
    </button>
  );
}

/**
 * Date+time picker per appuntamento. 7 giorni rolling (domenica chiuso),
 * slot 9-12 mattina + 15:30-19:30 pomeriggio. Niente backend appuntamenti
 * (per ora) — sono solo preferenze inviate nel message al CRM, il tecnico
 * conferma manualmente via email/telefono.
 */
function AppointmentPicker({
  days,
  selectedDate,
  selectedTime,
  onDate,
  onTime,
}: {
  days: Array<{ iso: string; weekday: string; day: number; month: string; isSunday: boolean }>;
  selectedDate: string | null;
  selectedTime: string | null;
  onDate: (iso: string) => void;
  onTime: (t: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Quando vuoi portarcelo (o quando passiamo noi)?">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {days.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                disabled={d.isSunday}
                onClick={() => onDate(d.iso)}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border transition-all duration-200",
                  d.isSunday && "opacity-30 cursor-not-allowed",
                  isSelected
                    ? "bg-brand-600/10 border-brand-600 text-foreground"
                    : "bg-card border-border text-muted-foreground hover:border-brand-600/40 hover:text-foreground",
                )}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {d.weekday}
                </span>
                <span className="font-serif text-lg tabular-nums">
                  {d.day}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70">
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 mt-2">
          Domenica chiuso. Appuntamento da confermare via email/telefono.
        </p>
      </Field>

      {selectedDate && (
        <Field label="A che ora?">
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Mattina
              </span>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS_MORNING.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTime(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-mono tabular-nums border transition-all duration-200",
                      selectedTime === t
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-card text-muted-foreground border-border hover:border-brand-600/40 hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">
                Pomeriggio
              </span>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS_AFTERNOON.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTime(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-mono tabular-nums border transition-all duration-200",
                      selectedTime === t
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-card text-muted-foreground border-border hover:border-brand-600/40 hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Field>
      )}
    </div>
  );
}

/**
 * Condizioni di spedizione + indirizzo destinazione fisso (sede tecnica
 * Fast-Fix di San Benedetto del Tronto).
 */
function ShippingBlock() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card/50">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
          Spedisci il tuo dispositivo a
        </span>
        <p className="font-serif italic text-lg text-foreground">
          Fast-Fix Assistenza Smartphone &amp; Computer
        </p>
        <p className="text-sm text-muted-foreground">
          Piazza G. Garibaldi 31 — 63074 San Benedetto del Tronto (AP)
        </p>
      </div>

      <div className="border-t border-border pt-4 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          📦 Condizioni di spedizione
        </span>
        <ul className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
          <li>• Effettua un <strong className="text-foreground">backup dei dati</strong> prima della spedizione.</li>
          <li>• Imballa il dispositivo in modo sicuro, <strong className="text-foreground">senza accessori</strong> (cavi, cover, SIM, microSD).</li>
          <li>• Usa una spedizione <strong className="text-foreground">tracciabile</strong> a tua scelta.</li>
          <li>• Tempo medio di diagnosi: <strong className="text-foreground">1 giorno lavorativo</strong> dalla ricezione.</li>
          <li>• Dopo la diagnosi ti contattiamo con <strong className="text-foreground">preventivo + link di pagamento</strong>. Solo dopo il pagamento iniziamo la riparazione.</li>
          <li>• Tempo medio di riparazione: <strong className="text-foreground">3 giorni lavorativi</strong>.</li>
        </ul>
      </div>
    </div>
  );
}

function RecapPanel({
  deviceLabel,
  repairLabels,
  serviceMode,
  storeName,
  appointmentDate,
  appointmentTime,
}: {
  deviceLabel: string;
  repairLabels: string[];
  serviceMode: ServiceMode | null;
  storeName: string | null | undefined;
  appointmentDate: string | null;
  appointmentTime: string | null;
}) {
  const serviceLabel = serviceMode
    ? SERVICE_MODES.find((m) => m.id === serviceMode)?.label
    : null;
  const hasData = deviceLabel !== "—" || repairLabels.length > 0;
  const appointment =
    appointmentDate && appointmentTime
      ? `${appointmentDate.slice(8, 10)}/${appointmentDate.slice(5, 7)} ore ${appointmentTime}`
      : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
          {hasData ? "La tua richiesta" : "Come funziona"}
        </span>
        <h3 className="font-serif italic text-xl text-foreground">
          {hasData ? "Riepilogo" : "Tre passi, niente sorprese"}
        </h3>
      </div>

      {hasData ? (
        <div className="flex flex-col gap-2 text-sm">
          {deviceLabel !== "—" && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">Telefono</span>
              <span className="text-foreground text-right">{deviceLabel}</span>
            </div>
          )}
          {repairLabels.length > 0 && (
            <div className="flex justify-between gap-3 items-start">
              <span className="text-muted-foreground shrink-0">Riparazioni</span>
              <span className="text-foreground text-right">
                {repairLabels.join(", ")}
              </span>
            </div>
          )}
          {serviceLabel && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">Modalità</span>
              <span className="text-foreground text-right">{serviceLabel}</span>
            </div>
          )}
          {storeName && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">Negozio</span>
              <span className="text-foreground text-right">{storeName}</span>
            </div>
          )}
          {appointment && (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground shrink-0">Quando</span>
              <span className="text-foreground text-right font-mono tabular-nums">
                {appointment}
              </span>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <BulletStep n="1" text="Dicci che telefono hai" />
          <BulletStep n="2" text="Spiega cosa non va (anche più cose insieme)" />
          <BulletStep n="3" text="Scegli come farcelo arrivare" />
        </ul>
      )}

      <div className="border-t border-border pt-4 flex flex-col gap-2">
        <Bullet>Diagnosi gratuita, preventivo prima di toccare</Bullet>
        <Bullet>Garanzia 12 mesi su parti e lavoro</Bullet>
        <Bullet>Tecnici interni, ricambi originali o equivalenti</Bullet>
        <Bullet>Tracking ticket dopo la conferma</Bullet>
      </div>
    </div>
  );
}

function BulletStep({ n, text }: { n: string; text: string }) {
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

// ── Icone semplici inline ─────────────────────────────────────────────────
function RepairIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "screen":
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <path d="M9 18h6" />
        </svg>
      );
    case "battery":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="16" height="8" rx="1.5" />
          <path d="M19 11v2" />
          <path d="M6 11v2M9 11v2" />
        </svg>
      );
    case "back":
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <circle cx="9" cy="8" r="1.5" />
          <circle cx="9" cy="11" r="1.5" />
        </svg>
      );
    case "case":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <circle cx="12" cy="13" r="3.5" />
          <path d="M8 6l1.5-2h5L16 6" />
        </svg>
      );
    case "port":
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <rect x="10" y="18" width="4" height="2" rx="0.5" />
        </svg>
      );
    case "audio":
      return (
        <svg {...common}>
          <path d="M11 4L7 8H4v8h3l4 4z" />
          <path d="M15 9c1.5 1.5 1.5 4.5 0 6" />
        </svg>
      );
    case "water":
      return (
        <svg {...common}>
          <path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z" />
        </svg>
      );
    case "software":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "chip":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="1" />
          <path d="M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3" />
        </svg>
      );
    case "other":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17.5v.01" />
        </svg>
      );
  }
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "store":
      return (
        <svg {...common}>
          <path d="M3 7l1.5-3h15L21 7" />
          <path d="M4 7v13h16V7" />
          <path d="M3 7h18M9 14h6v6H9z" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M2 7h11v10H2zM13 10h5l3 3v4h-8" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2V11z" />
        </svg>
      );
    default:
      return null;
  }
}
