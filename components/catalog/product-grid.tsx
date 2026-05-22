"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mockProducts,
  formatPrice,
  CONDITION_LABELS,
  CHANNEL_URLS,
  type ProductMock,
} from "@/lib/crm-client/mocks/products";
import type { PublicCondition } from "@/lib/crm-client/types";
import { PhoneSilhouette } from "@/components/marketing/phone-silhouette";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

const conditions: { value: PublicCondition | "all"; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "new", label: "Nuovo" },
  { value: "refurbished", label: "Ricondizionato" },
  { value: "used", label: "Usato" },
];

const categories = ["Tutte", "Smartphone", "Ricambio"];

function ProductCard({ product }: { product: ProductMock }) {
  const { stock } = product;
  const stockColor =
    stock.count === 0
      ? "text-brand-500"
      : !stock.capped && stock.count <= 3
        ? "text-yellow-400"
        : "text-green-400";

  const stockLabel =
    stock.count === 0
      ? "Esaurito"
      : !stock.capped && stock.count <= 3
        ? `Ultimi ${stock.count} pezzi`
        : "Disponibile";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ duration: DURATION.normal, ease: EASE.smooth }}
      className="group flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/20 transition-all duration-300"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Image placeholder */}
      <div className="aspect-[4/5] rounded-xl bg-gradient-to-b from-card-hover to-background border border-border flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
        <PhoneSilhouette
          variant={(parseInt(product.id.replace("p", "")) % 6 || 6) as 1 | 2 | 3 | 4 | 5 | 6}
          className="w-auto h-[85%] drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-600/10 text-brand-500 border border-brand-600/20">
            {product.brand}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted/20 text-muted-foreground border border-border">
            {product.condition ? CONDITION_LABELS[product.condition] : "—"}
          </span>
        </div>
        <h3 className="font-serif text-base italic text-foreground group-hover:text-brand-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">{product.category}</p>
      </div>

      <div className="mt-auto flex items-baseline justify-between">
        <span className="font-mono text-lg font-medium text-foreground tabular-nums">
          {formatPrice(product.priceCents)}
        </span>
        <span className={cn("text-[10px] uppercase tracking-wider font-mono", stockColor)}>
          {stockLabel}
        </span>
      </div>

      <a
        href={`${CHANNEL_URLS[product.channel]}/products/${product.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 w-full py-2.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold text-center hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300"
      >
        Acquista
      </a>
    </motion.div>
  );
}

export function ProductGrid() {
  const [activeCondition, setActiveCondition] = useState<PublicCondition | "all">("all");
  const [activeCategory, setActiveCategory] = useState("Tutte");

  const filtered = mockProducts.filter((p) => {
    const condMatch = activeCondition === "all" || p.condition === activeCondition;
    const catMatch = activeCategory === "Tutte" || p.category === activeCategory;
    return condMatch && catMatch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCondition(c.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                activeCondition === c.value
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-card text-muted-foreground border-border hover:border-brand-600/40"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                activeCategory === cat
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-card text-muted-foreground border-border hover:border-brand-600/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid with cover flow swap */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nessun prodotto trovato.</p>
      )}
    </div>
  );
}
