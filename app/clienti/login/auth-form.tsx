"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { RequestTrigger } from "@/components/forms/request-trigger";

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors duration-200";
const inputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
} as const;
const labelStyle = {
  fontSize: "10px",
  letterSpacing: "0.22em",
  color: "#737373",
} as const;

export function AuthForm({ next }: { next?: string }) {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(data?.error?.message ?? t("auth.customer.errInvalidCreds"));
      }
      router.push(next ?? "/clienti");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.customer.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1
          className="font-sans tracking-[-0.02em]"
          style={{ fontSize: "28px", color: "#0a0a0a", fontWeight: 700, lineHeight: 1.1 }}
        >
          {t("auth.customer.inlineTitle")}
        </h1>
        <p style={{ fontSize: "14px", color: "#525252" }}>
          {t("auth.customer.inlineSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono uppercase" style={labelStyle}>
            {t("auth.customer.emailLabel")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            placeholder={t("auth.customer.emailPh")}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono uppercase" style={labelStyle}>
            {t("auth.customer.passwordLabel")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
            style={inputStyle}
          />
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
          {busy ? t("auth.customer.ctaBusy") : t("auth.customer.cta")}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <p style={{ fontSize: "14px", color: "#525252" }}>
          {t("auth.customer.noCredentials")}{" "}
          <span style={{ color: "#0a0a0a" }}>
            {t("auth.customer.noCredentialsHint")}
          </span>
        </p>
        <RequestTrigger
          kind="info"
          variant="outline"
          hideCompany
          defaultCustomer={{ message: t("auth.customer.requestAccessMsg") }}
          label={t("auth.customer.requestAccess")}
        />
      </div>
    </div>
  );
}
