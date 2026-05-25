"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

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
        throw new Error(
          data?.error?.message ?? "Credenziali non valide",
        );
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
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          className={cn(
            "w-full px-4 py-3 rounded-lg bg-popover border border-border",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40",
            "transition-colors duration-200",
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={cn(
            "w-full px-4 py-3 rounded-lg bg-popover border border-border",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600/40",
            "transition-colors duration-200",
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-brand-500 bg-brand-600/10 border border-brand-600/30 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={cn(
          "btn-shine w-full py-3 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold",
          "hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {busy ? "Accesso in corso…" : "Accedi all'area B2B"}
      </button>
    </form>
  );
}
