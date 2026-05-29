"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        throw new Error(data?.error?.message ?? "Credenziali non valide");
      }
      router.push(next ?? "/clienti");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
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
          Accedi
        </h1>
        <p style={{ fontSize: "14px", color: "#525252" }}>
          Vedi le tue riparazioni, i preventivi e i prezzi riservati.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono uppercase" style={labelStyle}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            placeholder="nome@email.it"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono uppercase" style={labelStyle}>
            Password
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
          {busy ? "Accesso in corso…" : "Accedi →"}
        </button>
      </form>

      <p className="text-center" style={{ fontSize: "14px", color: "#525252" }}>
        Non hai ancora le credenziali?{" "}
        <span style={{ color: "#0a0a0a" }}>
          Porta un dispositivo in riparazione: ti arriverà via email un link per
          impostare la password.
        </span>
      </p>
    </div>
  );
}
