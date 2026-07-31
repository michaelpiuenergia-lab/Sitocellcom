"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";
import {
  BUSINESS_TYPES,
  COUNTRIES,
  DISCOVERY_SOURCES,
  ITALIAN_PROVINCES,
  type BusinessType,
  type DiscoverySource,
} from "@/lib/geo";

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors";
const inputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
} as const;

const labelClass = "font-mono uppercase";
const labelStyle = {
  fontSize: "10px",
  letterSpacing: "0.22em",
  color: "#737373",
} as const;

/** Etichette dei radio "tipologia attività", nell'ordine di BUSINESS_TYPES */
const BUSINESS_TYPE_KEYS: Record<BusinessType, keyof Dict> = {
  reseller: "auth.b2b.register.businessType.reseller",
  "repair-shop": "auth.b2b.register.businessType.repairShop",
  operator: "auth.b2b.register.businessType.operator",
  school: "auth.b2b.register.businessType.school",
  other: "auth.b2b.register.businessType.other",
};

const DISCOVERY_KEYS: Record<DiscoverySource, keyof Dict> = {
  search: "auth.b2b.register.discovery.search",
  social: "auth.b2b.register.discovery.social",
  "word-of-mouth": "auth.b2b.register.discovery.wordOfMouth",
  fair: "auth.b2b.register.discovery.fair",
  "sales-rep": "auth.b2b.register.discovery.salesRep",
  other: "auth.b2b.register.discovery.other",
};

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  emailConfirm: "",
  phone: "",
  companyName: "",
  vatNumber: "",
  taxCode: "",
  sdi: "",
  pec: "",
  website: "",
  country: "IT",
  province: "",
  city: "",
  address: "",
  streetNumber: "",
  businessType: "" as BusinessType | "",
  discoverySource: "" as DiscoverySource | "",
  notes: "",
  hpf: "",
};

function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span
        aria-hidden
        className="inline-block h-px w-6"
        style={{ backgroundColor: "#dc2626" }}
      />
      <h3
        className="font-mono uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#dc2626" }}
      >
        {title}
      </h3>
    </div>
  );
}

export function RegisterForm() {
  const { t } = useLang();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState(false);

  const isItaly = f.country === "IT";
  const emailMismatch =
    f.emailConfirm.length > 0 && f.email.trim() !== f.emailConfirm.trim();

  function field<K extends keyof typeof EMPTY>(key: K) {
    return {
      value: f[key],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => setF((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailMismatch) {
      setError(t("auth.b2b.register.emailMismatch"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/b2b/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          companyName: f.companyName.trim(),
          vatNumber: f.vatNumber.trim(),
          taxCode: f.taxCode.trim(),
          sdi: f.sdi.trim(),
          pec: f.pec.trim(),
          website: f.website.trim(),
          country: f.country,
          province: f.province.trim(),
          city: f.city.trim(),
          address: f.address.trim(),
          streetNumber: f.streetNumber.trim(),
          businessType: f.businessType || null,
          discoverySource: f.discoverySource || null,
          notes: f.notes.trim(),
          privacyAccepted: true,
          hpf: f.hpf,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(data?.error?.message ?? t("auth.b2b.register.errGeneric"));
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.b2b.register.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        className="rounded-xl px-4 py-4 flex flex-col gap-2"
        style={{
          fontSize: "14px",
          color: "#047857",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
        }}
      >
        <span className="font-semibold">{t("auth.b2b.register.done.title")}</span>
        <span>{t("auth.b2b.register.done.body")}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p style={{ fontSize: "12px", color: "#737373" }}>
        {t("auth.b2b.register.optionalHint")}
      </p>

      {/* ============ REFERENTE ============ */}
      <Section title={t("auth.b2b.register.sec.contact")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.firstNameLabel")}
          </label>
          <input
            type="text"
            {...field("firstName")}
            required
            maxLength={80}
            autoComplete="given-name"
            autoFocus
            placeholder={t("auth.b2b.register.firstNamePh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.lastNameLabel")}
          </label>
          <input
            type="text"
            {...field("lastName")}
            required
            maxLength={80}
            autoComplete="family-name"
            placeholder={t("auth.b2b.register.lastNamePh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.emailLabel")}
          </label>
          <input
            type="email"
            {...field("email")}
            required
            maxLength={180}
            autoComplete="email"
            placeholder={t("auth.b2b.register.emailPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.emailConfirmLabel")}
          </label>
          <input
            type="email"
            {...field("emailConfirm")}
            required
            maxLength={180}
            autoComplete="off"
            placeholder={t("auth.b2b.register.emailPh")}
            className={inputClass}
            style={{
              ...inputStyle,
              border: emailMismatch ? "1px solid #dc2626" : inputStyle.border,
            }}
            aria-invalid={emailMismatch}
          />
          {emailMismatch && (
            <span style={{ fontSize: "12px", color: "#dc2626" }}>
              {t("auth.b2b.register.emailMismatch")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.phoneLabel")}
        </label>
        <input
          type="tel"
          {...field("phone")}
          required
          maxLength={40}
          autoComplete="tel"
          placeholder={t("auth.b2b.register.phonePh")}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* ============ AZIENDA ============ */}
      <Section title={t("auth.b2b.register.sec.company")} />

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.companyLabel")}
        </label>
        <input
          type="text"
          {...field("companyName")}
          required
          maxLength={180}
          autoComplete="organization"
          placeholder={t("auth.b2b.register.companyPh")}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.vatLabel")}
          </label>
          <input
            type="text"
            {...field("vatNumber")}
            required
            maxLength={40}
            pattern="[A-Za-z0-9]+"
            autoComplete="off"
            placeholder={t("auth.b2b.register.vatPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.taxCodeLabel")}
          </label>
          <input
            type="text"
            {...field("taxCode")}
            maxLength={40}
            autoComplete="off"
            placeholder={t("auth.b2b.register.taxCodePh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.sdiLabel")}
          </label>
          <input
            type="text"
            {...field("sdi")}
            maxLength={20}
            autoComplete="off"
            placeholder={t("auth.b2b.register.sdiPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.pecLabel")}
          </label>
          <input
            type="email"
            {...field("pec")}
            maxLength={180}
            autoComplete="off"
            placeholder={t("auth.b2b.register.pecPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.websiteLabel")}
        </label>
        <input
          type="text"
          {...field("website")}
          maxLength={200}
          autoComplete="url"
          placeholder={t("auth.b2b.register.websitePh")}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* ============ SEDE LEGALE ============ */}
      <Section title={t("auth.b2b.register.sec.address")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.countryLabel")}
          </label>
          <select
            {...field("country")}
            required
            autoComplete="country"
            className={inputClass}
            style={inputStyle}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.provinceLabel")}
          </label>
          {isItaly ? (
            <select
              {...field("province")}
              required
              className={inputClass}
              style={inputStyle}
            >
              <option value="">{t("auth.b2b.register.provincePh")}</option>
              {ITALIAN_PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...field("province")}
              maxLength={80}
              autoComplete="address-level1"
              placeholder={t("auth.b2b.register.provincePh")}
              className={inputClass}
              style={inputStyle}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.cityLabel")}
        </label>
        <input
          type="text"
          {...field("city")}
          required
          maxLength={120}
          autoComplete="address-level2"
          placeholder={t("auth.b2b.register.cityPh")}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-[1fr,110px] gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.addressLabel")}
          </label>
          <input
            type="text"
            {...field("address")}
            required
            maxLength={200}
            autoComplete="address-line1"
            placeholder={t("auth.b2b.register.addressPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.streetNumberLabel")}
          </label>
          <input
            type="text"
            {...field("streetNumber")}
            required
            maxLength={20}
            placeholder={t("auth.b2b.register.streetNumberPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* ============ PROFILO ============ */}
      <Section title={t("auth.b2b.register.sec.profile")} />

      <fieldset className="flex flex-col gap-2">
        <legend className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.businessTypeLabel")}
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
          {BUSINESS_TYPES.map((bt) => (
            <label
              key={bt}
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{ fontSize: "14px", color: "#404040" }}
            >
              <input
                type="radio"
                name="businessType"
                value={bt}
                checked={f.businessType === bt}
                onChange={() => setF((prev) => ({ ...prev, businessType: bt }))}
                style={{ accentColor: "#dc2626" }}
              />
              {t(BUSINESS_TYPE_KEYS[bt])}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.discoveryLabel")}
        </label>
        <select
          {...field("discoverySource")}
          className={inputClass}
          style={inputStyle}
        >
          <option value="">{t("auth.b2b.register.discovery.placeholder")}</option>
          {DISCOVERY_SOURCES.map((d) => (
            <option key={d} value={d}>
              {t(DISCOVERY_KEYS[d])}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.notesLabel")}
        </label>
        <textarea
          {...field("notes")}
          maxLength={1000}
          rows={3}
          placeholder={t("auth.b2b.register.notesPh")}
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* ============ DOCUMENTI ============ */}
      <div
        className="rounded-xl px-4 py-3 flex flex-col gap-1 mt-1"
        style={{
          backgroundColor: "#fafaf8",
          border: "1px solid #ececec",
        }}
      >
        <span
          className="font-semibold"
          style={{ fontSize: "13px", color: "#0a0a0a" }}
        >
          {t("auth.b2b.register.docs.title")}
        </span>
        <span style={{ fontSize: "13px", color: "#525252", lineHeight: 1.6 }}>
          {t("auth.b2b.register.docs.body")}
        </span>
      </div>

      {/*
        Honeypot anti-bot: fuori dal viewport, mai letto da chi compila a mano.
        Se arriva popolato il CRM marca la richiesta come spam.
       */}
      <input
        type="text"
        {...field("hpf")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      />

      {error && (
        <p
          className="rounded-xl px-4 py-3"
          style={{
            fontSize: "14px",
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </p>
      )}

      <label
        className="flex items-start gap-3 cursor-pointer mt-1"
        style={{ fontSize: "13px", color: "#404040" }}
      >
        <input
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          required
          className="mt-0.5"
          style={{ accentColor: "#dc2626" }}
        />
        <span>
          {t("auth.b2b.register.privacyCheckbox")}{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 underline"
            // Il consenso non è valido se l'informativa non è raggiungibile
            // dal punto in cui lo si presta: apre in una scheda nuova per non
            // far perdere i dati già digitati nel form.
            onClick={(e) => e.stopPropagation()}
          >
            {t("auth.b2b.register.privacyLinkLabel")}
          </a>
        </span>
      </label>

      <p style={{ fontSize: "12px", color: "#737373" }}>
        {t("auth.b2b.register.consent")}
      </p>

      <button
        type="submit"
        disabled={busy || !privacy || emailMismatch}
        className="w-full py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        style={{
          backgroundColor: "#dc2626",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {busy ? t("auth.b2b.register.ctaBusy") : t("auth.b2b.register.cta")}
      </button>
    </form>
  );
}
