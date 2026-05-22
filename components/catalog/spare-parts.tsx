"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "./product-grid";
import type { PublicProductListItem } from "@/lib/crm-client/types";
import { cn } from "@/lib/utils/cn";

interface SparePartsProps {
  initialProducts: PublicProductListItem[];
  availableModels: string[];
}

export function SpareParts({ initialProducts, availableModels }: SparePartsProps) {
  const [selectedModel, setSelectedModel] = useState<string>("");

  const filtered = useMemo(() => {
    if (!selectedModel) return initialProducts;
    const q = selectedModel.toLowerCase();
    return initialProducts.filter((p) =>
      p.compatibleModels?.toLowerCase().includes(q) ?? false,
    );
  }, [selectedModel, initialProducts]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter row — modello dropdown + count */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label
            htmlFor="model-filter"
            className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.15em]"
          >
            Compatibile con
          </label>
          <select
            id="model-filter"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={cn(
              "min-w-[280px] px-4 py-2.5 rounded-lg",
              "bg-card border border-border text-foreground",
              "font-sans text-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600",
              "hover:border-brand-600/40 transition-colors duration-200",
              "cursor-pointer appearance-none",
              "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23a3a3a3%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem] pr-10",
            )}
          >
            <option value="">Tutti i modelli</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {selectedModel && (
            <button
              onClick={() => setSelectedModel("")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Rimuovi filtro
            </button>
          )}
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {filtered.length} ricambi
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 flex flex-col gap-4">
          <p className="font-serif italic text-2xl text-muted-foreground">
            Nessun ricambio per “{selectedModel}”.
          </p>
          <button
            onClick={() => setSelectedModel("")}
            className="mx-auto text-sm text-brand-500 hover:text-brand-400 underline underline-offset-2"
          >
            Vedi tutti i ricambi
          </button>
        </div>
      ) : (
        <ProductGrid initialProducts={filtered} />
      )}
    </div>
  );
}
