"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next }: { next?: string }) {
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
      const res = await fetch("/api/auth/b2b/login", {
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
      router.push(next ?? "/b2b/prodotti");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore di accesso");
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
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          placeholder="nome@azienda.it"
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
          Password
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
        {busy ? "Accesso in corso…" : "Accedi all'area B2B →"}
      </button>
    </form>
  );
}
