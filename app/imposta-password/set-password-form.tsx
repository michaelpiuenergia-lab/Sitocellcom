"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors";
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

export function SetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri");
      return;
    }
    if (password !== confirm) {
      setError("Le due password non coincidono");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/customer/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Operazione non riuscita");
      }
      setSuccess(true);
      setTimeout(() => router.push("/clienti/login"), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div
        className="rounded-xl px-4 py-4 text-center flex flex-col gap-2"
        style={{
          fontSize: "14px",
          color: "#047857",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
        }}
      >
        <span className="font-semibold">Password impostata.</span>
        <span>Ti porto al login…</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-mono uppercase" style={labelStyle}>
          Nuova password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          autoFocus
          placeholder="••••••••"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono uppercase" style={labelStyle}>
          Conferma password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
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
        {busy ? "Attendi…" : "Imposta password →"}
      </button>
    </form>
  );
}
