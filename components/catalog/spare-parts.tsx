"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGrid } from "./product-grid";
import type { PublicProductListItem } from "@/lib/crm-client/types";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

interface SparePartsProps {
  initialProducts: PublicProductListItem[];
  availableModels: string[];
  availableBrands: string[];
  totalCount: number;
}

export function SpareParts({
  initialProducts,
  availableModels,
  availableBrands,
  totalCount,
}: SparePartsProps) {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [filteredProducts, setFilteredProducts] =
    useState<PublicProductListItem[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Chiudi dropdown clickando fuori
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen]);

  // Quando cambia modello/brand, fai fetch server-side per cercare in
  // TUTTI i 1157 ricambi del CRM (non solo nei primi 100 caricati).
  useEffect(() => {
    if (!selectedModel && !selectedBrand) {
      setFilteredProducts(initialProducts);
      return;
    }
    const ctrl = new AbortController();
    setIsLoading(true);
    const params = new URLSearchParams({ kind: "part", limit: "100" });
    if (selectedModel) params.set("compatibleModels", selectedModel);
    if (selectedBrand) params.set("brand", selectedBrand);
    fetch(`/api/products?${params}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
      .then((data) => setFilteredProducts(data.items ?? []))
      .catch((e) => {
        if (e.name !== "AbortError") setFilteredProducts([]);
      })
      .finally(() => setIsLoading(false));
    return () => ctrl.abort();
  }, [selectedModel, selectedBrand, initialProducts]);

  const visibleModels = useMemo(() => {
    if (!query) return availableModels;
    const q = query.toLowerCase();
    return availableModels.filter((m) => m.toLowerCase().includes(q));
  }, [query, availableModels]);

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setIsOpen(false);
    setQuery("");
  };

  const displayedCount =
    selectedModel || selectedBrand ? filteredProducts.length : totalCount;

  return (
    <div className="flex flex-col gap-6">
      {/* Riga BRAND — pillole cliccabili (come magazzino: Apple, Samsung, ecc.) */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
          Brand
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedBrand("")}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200",
              selectedBrand === ""
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-card text-muted-foreground border-border hover:border-brand-600/60 hover:text-foreground",
            )}
          >
            Tutti
          </button>
          {availableBrands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() =>
                setSelectedBrand((cur) => (cur === brand ? "" : brand))
              }
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 uppercase tracking-wider",
                selectedBrand === brand
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-card text-muted-foreground border-border hover:border-brand-600/60 hover:text-foreground",
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col gap-2 w-full sm:w-auto" ref={wrapperRef}>
          <label className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
            Compatibile con
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={cn(
                "min-w-[280px] flex items-center justify-between gap-3",
                "px-4 py-2.5 rounded-lg",
                "bg-card border border-border text-foreground",
                "font-sans text-sm text-left",
                "hover:border-brand-600/60 hover:bg-card-hover",
                "focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600",
                "transition-all duration-200",
                isOpen && "border-brand-600 ring-2 ring-brand-600",
              )}
            >
              <span className={cn(!selectedModel && "text-muted-foreground")}>
                {selectedModel || "Tutti i modelli"}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("transition-transform duration-300", isOpen && "rotate-180")}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: DURATION.fast, ease: EASE.smooth }}
                  className="absolute z-50 mt-2 w-full min-w-[280px] rounded-lg bg-card border border-border shadow-2xl shadow-black/60 overflow-hidden"
                >
                  {/* Search input dentro dropdown */}
                  <div className="p-2 border-b border-border bg-card-hover">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cerca modello…"
                      autoFocus
                      className={cn(
                        "w-full px-3 py-2 rounded-md text-sm",
                        "bg-card border border-border text-foreground",
                        "placeholder:text-muted-foreground",
                        "focus:outline-none focus:border-brand-600",
                      )}
                    />
                  </div>

                  <ul
                    role="listbox"
                    className="max-h-72 overflow-y-auto custom-scrollbar"
                  >
                    <li role="option">
                      <button
                        type="button"
                        onClick={() => selectModel("")}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm font-sans",
                          "transition-colors duration-150",
                          "hover:bg-brand-600 hover:text-white",
                          !selectedModel
                            ? "bg-brand-600/10 text-brand-500"
                            : "text-foreground",
                        )}
                      >
                        Tutti i modelli
                      </button>
                    </li>
                    {visibleModels.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                        Nessun modello trovato
                      </li>
                    ) : (
                      visibleModels.map((model) => (
                        <li key={model} role="option">
                          <button
                            type="button"
                            onClick={() => selectModel(model)}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm font-sans",
                              "transition-colors duration-150",
                              "hover:bg-brand-600 hover:text-white",
                              selectedModel === model
                                ? "bg-brand-600/10 text-brand-500"
                                : "text-foreground",
                            )}
                          >
                            {model}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedModel && (
            <button
              onClick={() => setSelectedModel("")}
              className="text-xs text-muted-foreground hover:text-brand-500 transition-colors underline underline-offset-2"
            >
              Rimuovi filtro
            </button>
          )}
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {isLoading ? "…" : `${displayedCount} ricambi`}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <p className="font-serif italic text-xl text-muted-foreground">
            Caricamento ricambi per “{selectedModel}”…
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
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
        <ProductGrid
          initialProducts={filteredProducts}
          showConditionFilter={false}
          showCategoryFilter={false}
        />
      )}
    </div>
  );
}
