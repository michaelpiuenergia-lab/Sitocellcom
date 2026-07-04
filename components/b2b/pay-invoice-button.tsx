"use client";

import { useState } from "react";

/**
 * "Paga online": chiede al BFF un link Klarna per la fattura e reindirizza
 * il rivenditore alla pagina di pagamento. L'esito aggiorna la fattura sul
 * CRM in automatico (webhook) — al ritorno basta ricaricare la pagina.
 */
export function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/b2b/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const json = (await r.json().catch(() => null)) as {
        data?: { redirectUrl?: string };
        error?: { message?: string };
      } | null;
      if (r.status === 401) {
        // Sessione scaduta: al login e poi di nuovo qui sulle fatture.
        window.location.assign(
          "/b2b/login?next=" + encodeURIComponent(window.location.pathname),
        );
        return;
      }
      const url = json?.data?.redirectUrl;
      if (!r.ok || !url) {
        throw new Error(json?.error?.message ?? "Pagamento non disponibile");
      }
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore, riprova");
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void pay()}
        disabled={loading}
        className="rounded-lg px-3 py-1.5 transition-opacity disabled:opacity-60"
        style={{
          backgroundColor: "#15803d",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        {loading ? "Apro il pagamento..." : "Paga online"}
      </button>
      {error && (
        <span style={{ fontSize: "11px", color: "#b91c1c" }}>{error}</span>
      )}
    </span>
  );
}
