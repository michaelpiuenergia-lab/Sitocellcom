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

type ProfileInitial = { name: string; email: string; phone: string };

export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    form.name !== initial.name ||
    form.email !== initial.email ||
    form.phone !== initial.phone;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || busy) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const body: Record<string, string> = {};
      if (form.name !== initial.name) body.name = form.name.trim();
      if (form.email !== initial.email) body.email = form.email.trim();
      if (form.phone !== initial.phone) body.phone = form.phone.trim();
      const res = await fetch("/api/auth/b2b/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message ?? "Salvataggio non riuscito");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <Field label="Referente">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          maxLength={120}
          className={inputClass}
          style={inputStyle}
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
          maxLength={180}
          className={inputClass}
          style={inputStyle}
        />
      </Field>
      <Field label="Telefono">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          autoComplete="tel"
          maxLength={40}
          placeholder="+39…"
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <div className="sm:col-span-2 flex flex-col gap-3">
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
            Dati salvati.
          </p>
        )}
        <button
          type="submit"
          disabled={!dirty || busy}
          className="self-start px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-50"
          style={{
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {busy ? "Salvo…" : "Salva modifiche →"}
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
