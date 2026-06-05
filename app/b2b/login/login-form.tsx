"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";

export function LoginForm({ next }: { next?: string }) {
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
      const res = await fetch("/api/auth/b2b/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { code?: string; message?: string };
        };
        const code = data?.error?.code;
        if (code === "B2B_PENDING") throw new Error(t("auth.b2b.login.errPending"));
        if (code === "B2B_REJECTED") throw new Error(t("auth.b2b.login.errRejected"));
        if (code === "NOT_B2B") throw new Error(t("auth.b2b.login.errNotB2B"));
        throw new Error(data?.error?.message ?? t("auth.b2b.login.errInvalidCreds"));
      }
      router.push(next ?? "/b2b/prodotti");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.b2b.login.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          className="font-mono uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "#737373",
          }}
        >
          {t("auth.b2b.login.emailLabel")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          placeholder={t("auth.b2b.login.emailPlaceholder")}
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors duration-200"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5e5",
            fontSize: "15px",
            color: "#0a0a0a",
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-mono uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "#737373",
          }}
        >
          {t("auth.b2b.login.passwordLabel")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors duration-200"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5e5",
            fontSize: "15px",
            color: "#0a0a0a",
          }}
        />
        <a
          href="/b2b/password-dimenticata"
          className="font-mono uppercase self-end transition-colors hover:text-[#dc2626]"
          style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}
        >
          {t("auth.common.passwordForgot")}
        </a>
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
        {busy ? t("auth.b2b.login.ctaBusy") : t("auth.b2b.login.cta")}
      </button>

      <div
        className="flex items-center justify-center gap-2 mt-2 pt-4"
        style={{ borderTop: "1px solid #f1f5f9" }}
      >
        <span style={{ fontSize: "13px", color: "#737373" }}>
          {t("auth.b2b.login.newReseller")}
        </span>
        <a
          href="/b2b/registrati"
          className="transition-colors hover:text-[#dc2626]"
          style={{
            fontSize: "13px",
            color: "#0a0a0a",
            fontWeight: 600,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          {t("auth.b2b.login.newResellerCta")}
        </a>
      </div>
    </form>
  );
}
