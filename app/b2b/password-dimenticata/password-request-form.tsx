"use client";

import { useState } from "react";

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors";
const inputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  color: "#0a0a0a",
} as const;

export function PasswordRequestForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/b2b/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message ?? "Errore");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
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
        <span className="font-semibold">Richiesta inviata.</span>
        <span>
          Se l&apos;email è registrata come account B2B, riceverai un link entro
          qualche minuto. Controlla anche la cartella spam.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          className="font-mono uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          placeholder="azienda@email.it"
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
        {busy ? "Invio…" : "Manda il link →"}
      </button>
    </form>
  );
}
