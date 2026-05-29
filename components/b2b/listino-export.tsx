"use client";

import { useState } from "react";

type Format = "csv" | "xlsx" | "pdf";

const FORMATS: { value: Format; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (XLSX)" },
  { value: "pdf", label: "PDF" },
];

/**
 * Export listino B2B — delega al CRM via proxy /api/b2b/listino-export.
 * Il CRM genera file veri (XLSX HTML-Office, PDF jspdf landscape A4).
 */
export function ListinoExport({ disabled = false }: { disabled?: boolean }) {
  const [busy, setBusy] = useState<null | Format>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(format: Format) {
    setBusy(format);
    setError(null);
    try {
      const res = await fetch(`/api/b2b/listino-export?format=${format}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Errore ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filenameFromHeaders(res.headers, format);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore di export");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="font-mono uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}
        >
          Esporta listino
        </span>
        {FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => download(f.value)}
            disabled={disabled || busy !== null}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200 disabled:opacity-60"
            style={{
              border: "1px solid #e5e5e5",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              color: "#0a0a0a",
            }}
          >
            {busy === f.value ? "Genero…" : f.label}
          </button>
        ))}
      </div>
      {error && (
        <span
          className="rounded-lg px-3 py-1.5"
          style={{
            fontSize: "12px",
            color: "#b91c1c",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            alignSelf: "flex-start",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function filenameFromHeaders(headers: Headers, format: Format): string {
  const cd = headers.get("content-disposition") ?? "";
  const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (match?.[1]) return decodeURIComponent(match[1]);
  return `listino.${format}`;
}
