"use client";

import { useState } from "react";
import type { B2bProductListItem } from "@/lib/crm-client/types";

const KIND_LABEL: Record<string, string> = {
  device: "Telefono",
  part: "Ricambio",
  accessory: "Accessorio",
  other: "Altro",
};
const CONDITION_LABEL: Record<string, string> = {
  new: "Nuovo",
  used: "Usato",
  refurbished: "Ricondizionato",
};

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",;\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function eur(cents: number | null): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function todayStamp(): string {
  // Esegue solo lato click handler, in browser → safe.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildCsv(items: B2bProductListItem[]): string {
  const header = [
    "SKU",
    "Nome",
    "Brand",
    "Categoria",
    "Tipo",
    "Condizione",
    "Modelli compatibili",
    "Stock",
    "Prezzo B2B (EUR)",
    "Prezzo pubblico (EUR)",
    "Canale",
  ];
  const rows = items.map((p) => [
    p.slug,
    p.name,
    p.brand ?? "",
    p.category ?? "",
    KIND_LABEL[p.kind] ?? p.kind,
    p.condition ? (CONDITION_LABEL[p.condition] ?? p.condition) : "",
    p.compatibleModels ?? "",
    p.stock.capped ? `${p.stock.count}+` : String(p.stock.count),
    eur(p.priceCents),
    eur(p.publicPriceCents),
    p.channel,
  ]);
  // BOM UTF-8 così Excel apre con encoding corretto
  return "﻿" + [header, ...rows].map((r) => r.map(csvEscape).join(";")).join("\r\n");
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ListinoExport({
  products,
  tierCode,
}: {
  products: B2bProductListItem[];
  tierCode: string | null;
}) {
  const [busy, setBusy] = useState<null | "csv">(null);

  function exportCsv() {
    setBusy("csv");
    try {
      const tier = tierCode ? tierCode.toLowerCase() : "b2b";
      downloadBlob(
        buildCsv(products),
        `listino-${tier}-${todayStamp()}.csv`,
        "text/csv;charset=utf-8",
      );
    } finally {
      setBusy(null);
    }
  }

  function openPrint() {
    window.open("/b2b/prodotti/stampa", "_blank", "noopener");
  }

  const baseBtn =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}>
        Esporta listino
      </span>
      <button
        type="button"
        onClick={exportCsv}
        disabled={busy !== null || products.length === 0}
        className={baseBtn}
        style={{
          border: "1px solid #e5e5e5",
          backgroundColor: "#ffffff",
          fontSize: "13px",
          fontWeight: 500,
          color: "#0a0a0a",
        }}
      >
        {busy === "csv" ? "Genero…" : "CSV / Excel"}
      </button>
      <button
        type="button"
        onClick={openPrint}
        disabled={products.length === 0}
        className={baseBtn}
        style={{
          border: "1px solid #e5e5e5",
          backgroundColor: "#ffffff",
          fontSize: "13px",
          fontWeight: 500,
          color: "#0a0a0a",
        }}
      >
        Stampa / PDF
      </button>
    </div>
  );
}
