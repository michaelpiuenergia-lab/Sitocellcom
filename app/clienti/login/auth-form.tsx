"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

const inputClass =
  "w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 focus:border-[#dc2626] transition-colors duration-200";
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

export function AuthForm({
  next,
  initialMode = "login",
}: {
  next?: string;
  initialMode?: Mode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/customer/login" : "/api/auth/customer/register";
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password, phone: phone || null };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(data?.error?.message ?? "Operazione non riuscita");
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
          {mode === "login" ? "Accedi" : "Crea il tuo account"}
        </h1>
        <p style={{ fontSize: "14px", color: "#525252" }}>
          {mode === "login"
            ? "Vedi le tue riparazioni, i preventivi e i prezzi riservati."
            : "Registrati per seguire le riparazioni e vedere i prezzi."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div className="flex flex-col gap-2">
            <label className={labelClass} style={labelStyle}>
              Nome e cognome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Mario Rossi"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="nome@email.it"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {mode === "register" && (
          <div className="flex flex-col gap-2">
            <label className={labelClass} style={labelStyle}>
              Telefono (opzionale)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="333 1234567"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className={labelClass} style={labelStyle}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
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
          {busy
            ? "Attendi…"
            : mode === "login"
              ? "Accedi →"
              : "Crea account →"}
        </button>
      </form>

      <p className="text-center" style={{ fontSize: "14px", color: "#525252" }}>
        {mode === "login" ? (
          <>
            Non hai un account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className="hover:underline"
              style={{ color: "#dc2626", fontWeight: 500 }}
            >
              Registrati
            </button>
          </>
        ) : (
          <>
            Hai già un account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className="hover:underline"
              style={{ color: "#dc2626", fontWeight: 500 }}
            >
              Accedi
            </button>
          </>
        )}
      </p>
    </div>
  );
}
