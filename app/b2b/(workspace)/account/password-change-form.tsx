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
const labelStyle = {
  fontSize: "10px",
  letterSpacing: "0.22em",
  color: "#737373",
} as const;

export function PasswordChangeForm() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNewp] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (newPassword.length < 8) {
      setError("La nuova password deve avere almeno 8 caratteri");
      return;
    }
    if (newPassword !== confirm) {
      setError("Le due password non coincidono");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/b2b/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message ?? "Cambio password non riuscito");
      setDone(true);
      setCurrent("");
      setNewp("");
      setConfirm("");
      setTimeout(() => setDone(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
      <Field label="Password attuale">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
          className={inputClass}
          style={inputStyle}
        />
      </Field>
      <Field label="Nuova password">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewp(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Min. 8 caratteri"
          className={inputClass}
          style={inputStyle}
        />
      </Field>
      <Field label="Conferma">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <div className="sm:col-span-3 flex flex-col gap-3">
        {error && (
          <p
            className="rounded-xl px-4 py-3"
            style={{
              fontSize: "14px",
              color: "#b91c1c",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </p>
        )}
        {done && (
          <p
            className="rounded-xl px-4 py-3"
            style={{
              fontSize: "14px",
              color: "#047857",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
            }}
          >
            Password aggiornata. Le altre sessioni sono state disconnesse.
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !currentPassword || !newPassword || !confirm}
          className="self-start px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-50"
          style={{
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {busy ? "Aggiorno…" : "Cambia password →"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono uppercase" style={labelStyle}>
        {label}
      </label>
      {children}
    </div>
  );
}
