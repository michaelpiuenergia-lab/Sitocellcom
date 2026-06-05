"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/lang-context";

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

export function RegisterForm() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/b2b/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          companyName: companyName.trim(),
          vatNumber: vatNumber.trim() || null,
          phone: phone.trim() || null,
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
      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.nameLabel")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          autoFocus
          placeholder={t("auth.b2b.register.namePh")}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={labelStyle}>
          {t("auth.b2b.register.emailLabel")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {t("auth.b2b.register.companyLabel")}
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          minLength={2}
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
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            maxLength={40}
            pattern="[A-Za-z0-9]*"
            autoComplete="off"
            placeholder={t("auth.b2b.register.vatPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            {t("auth.b2b.register.phoneLabel")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            autoComplete="tel"
            placeholder={t("auth.b2b.register.phonePh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

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

      <p style={{ fontSize: "12px", color: "#737373" }}>
        {t("auth.b2b.register.consent")}
      </p>

      <button
        type="submit"
        disabled={busy}
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
