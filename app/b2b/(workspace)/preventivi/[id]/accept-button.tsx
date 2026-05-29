"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AcceptQuoteButton({ quoteId }: { quoteId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    if (!confirm("Confermi l'accettazione del preventivo? Verrà generato un ordine.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/b2b/quotes/${encodeURIComponent(quoteId)}/accept`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Operazione non riuscita");
      }
      // Vai all'ordine generato
      if (data?.order?.id) {
        router.push(`/b2b/ordini/${data.order.id}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <button
        type="button"
        onClick={accept}
        disabled={busy}
        className="rounded-full px-6 py-3 transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)] disabled:opacity-60"
        style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "14px", fontWeight: 600 }}
      >
        {busy ? "Genero ordine…" : "Accetta e genera ordine →"}
      </button>
      {error && (
        <span
          className="rounded-lg px-3 py-1.5"
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
    </div>
  );
}
