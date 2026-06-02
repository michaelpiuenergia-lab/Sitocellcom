"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Pulsante "Aggiorna listino": forza il CRM a rigenerare i prezzi B2B del
 * cliente (cache-bust + ricalcolo) e ricarica la pagina così l'utente vede
 * subito i prezzi freschi.
 */
export function RegenerateListinoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/b2b/regenerate-listino", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message ?? "Rigenerazione non riuscita");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 3500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200 disabled:opacity-60 hover:border-[#dc2626] hover:text-[#dc2626]"
        style={{
          border: "1px solid #e5e5e5",
          backgroundColor: "#ffffff",
          fontSize: "13px",
          fontWeight: 500,
          color: "#0a0a0a",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            animation: busy ? "cellcom-spin 0.8s linear infinite" : undefined,
          }}
        >
          <path
            d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {busy ? "Rigenero…" : "Aggiorna listino"}
      </button>
      {error && (
        <span
          className="rounded-lg px-3 py-1.5 self-start"
          style={{
            fontSize: "12px",
            color: "#b91c1c",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </span>
      )}
      {done && (
        <span
          className="rounded-lg px-3 py-1.5 self-start"
          style={{
            fontSize: "12px",
            color: "#047857",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
          }}
        >
          Listino aggiornato
        </span>
      )}
      <style jsx>{`
        @keyframes cellcom-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
