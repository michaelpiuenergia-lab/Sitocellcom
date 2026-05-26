"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatPrice,
  CONDITION_LABELS,
  CHANNEL_URLS,
} from "@/lib/crm-client/mocks/products";
import type {
  PublicCondition,
  PublicProductListItem,
} from "@/lib/crm-client/types";
import { PhoneSilhouette } from "@/components/marketing/phone-silhouette";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";

function buildBuyUrl(product: PublicProductListItem): string {
  const base = CHANNEL_URLS[product.channel];
  const query = encodeURIComponent(product.name);
  if (product.channel === "cellcom") return `${base}/?s=${query}&post_type=product`;
  return `${base}/search?q=${query}`;
}

function getChannelName(channel: PublicProductListItem["channel"]): string {
  switch (channel) {
    case "cellcom":
      return "Cellcom";
    case "italianparts":
      return "ItalianParts";
    case "fastfix":
      return "Fast-Fix";
  }
}

function PartIcon({ category }: { category: string | null }) {
  const c = (category ?? "").toLowerCase();
  if (c.includes("display") || c.includes("schermo")) {
    return (
      <svg viewBox="0 0 100 120" className="w-2/5 text-brand-500/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="15" y="10" width="70" height="100" rx="8" />
        <line x1="15" y1="22" x2="85" y2="22" />
        <line x1="50" y1="100" x2="50" y2="105" />
        <line x1="30" y1="40" x2="70" y2="40" opacity="0.4" />
        <line x1="30" y1="55" x2="70" y2="55" opacity="0.4" />
        <line x1="30" y1="70" x2="55" y2="70" opacity="0.4" />
      </svg>
    );
  }
  if (c.includes("batter")) {
    return (
      <svg viewBox="0 0 120 60" className="w-3/5 text-brand-500/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="10" width="100" height="40" rx="4" />
        <rect x="105" y="22" width="10" height="16" rx="2" />
        <rect x="15" y="20" width="45" height="20" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }
  if (c.includes("scocca") || c.includes("housing") || c.includes("back")) {
    return (
      <svg viewBox="0 0 80 120" className="w-2/5 text-brand-500/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="64" height="104" rx="10" />
        <rect x="14" y="20" width="22" height="22" rx="4" />
        <circle cx="24" cy="31" r="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="w-2/5 text-brand-500/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="25" width="70" height="70" rx="6" />
      <rect x="40" y="40" width="40" height="40" rx="2" fill="currentColor" opacity="0.2" />
      {[15, 35, 55, 75, 95].map((y) => (
        <g key={y}>
          <line x1="10" y1={y} x2="25" y2={y} />
          <line x1="95" y1={y} x2="110" y2={y} />
        </g>
      ))}
      {[15, 35, 55, 75, 95].map((x) => (
        <g key={x}>
          <line x1={x} y1="10" x2={x} y2="25" />
          <line x1={x} y1="95" x2={x} y2="110" />
        </g>
      ))}
    </svg>
  );
}

function AccessoryIcon() {
  return (
    <svg viewBox="0 0 120 120" className="w-2/5 text-brand-500/70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="35" r="22" />
      <path d="M 60 57 Q 60 80 80 90 Q 100 100 100 110" />
      <rect x="50" y="20" width="20" height="6" rx="1" />
      <rect x="55" y="26" width="10" height="14" />
    </svg>
  );
}

const conditions: { value: PublicCondition | "all"; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "new", label: "Nuovo" },
  { value: "refurbished", label: "Ricondizionato" },
  { value: "used", label: "Usato" },
];

const categories = ["Tutte", "Smartphone", "Ricambio"];

function ProductCard({ product }: { product: PublicProductListItem }) {
  const { stock, variantCount } = product;

  const treatAsOutOfStock = stock.count === 0 && variantCount === 0;
  const treatAsCheckRequired = stock.count === 0 && variantCount > 0;

  const stockLabel = treatAsOutOfStock
    ? "Esaurito"
    : treatAsCheckRequired
      ? "Verifica disponibilità"
      : !stock.capped && stock.count <= 3
        ? `Ultimi ${stock.count} pezzi`
        : "Disponibile";

  const stockToneClass = treatAsOutOfStock
    ? "text-brand-600"
    : treatAsCheckRequired
      ? "text-muted-foreground"
      : !stock.capped && stock.count <= 3
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: DURATION.normal, ease: EASE.smooth }}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card hover:border-brand-600/40 transition-colors duration-300 overflow-hidden"
    >
      {/* Media — telefono protagonista 3:4 */}
      <div className="aspect-[3/4] relative bg-card-hover flex items-center justify-center overflow-hidden">
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-7 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : product.kind === "part" ? (
          <PartIcon category={product.category} />
        ) : product.kind === "accessory" ? (
          <AccessoryIcon />
        ) : (
          <PhoneSilhouette
            variant={((Math.abs(product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
            className="w-auto h-[80%]"
          />
        )}
      </div>

      <div className="px-5 pt-1 flex flex-col gap-3">
        {/* Brand chip + condition */}
        <div className="flex items-center gap-2">
          {product.brand && (
            <Chip tone="ink" size="sm">
              {product.brand}
            </Chip>
          )}
          {product.condition && (
            <Chip tone="outline" size="sm">
              {CONDITION_LABELS[product.condition]}
            </Chip>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-base leading-snug text-foreground line-clamp-2">
          {product.name}
        </h3>

        {product.category && (
          <p className="text-xs text-muted-foreground">{product.category}</p>
        )}
      </div>

      {/* Price + stock */}
      <div className="px-5 pb-5 mt-auto flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "font-sans font-semibold tabular-nums",
              product.priceHidden
                ? "text-brand-600 italic font-serif text-base"
                : "text-foreground text-xl",
            )}
            title={
              product.priceHidden
                ? "Il prezzo pubblico non è esposto per questo articolo. Contattaci per il listino."
                : undefined
            }
          >
            {product.priceHidden ? "Su richiesta" : formatPrice(product.priceCents)}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.18em]",
              stockToneClass,
            )}
          >
            {stockLabel}
          </span>
        </div>

        {treatAsOutOfStock ? (
          <Button variant="secondary" size="sm" disabled className="w-full">
            Avvisami quando torna
          </Button>
        ) : (
          <Button
            href={buildBuyUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            shine
            iconEnd="↗"
            className="w-full"
          >
            Acquista su {getChannelName(product.channel)}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function ProductGrid({
  initialProducts,
  showConditionFilter = true,
  showCategoryFilter = true,
}: {
  initialProducts: PublicProductListItem[];
  showConditionFilter?: boolean;
  showCategoryFilter?: boolean;
}) {
  const [activeCondition, setActiveCondition] = useState<PublicCondition | "all">("all");
  const [activeCategory, setActiveCategory] = useState("Tutte");

  const filtered = initialProducts.filter((p) => {
    const condMatch =
      !showConditionFilter || activeCondition === "all" || p.condition === activeCondition;
    const catMatch =
      !showCategoryFilter || activeCategory === "Tutte" || p.category === activeCategory;
    return condMatch && catMatch;
  });

  const showFilterRow = showConditionFilter || showCategoryFilter;

  return (
    <div className="flex flex-col gap-10">
      {showFilterRow && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {showConditionFilter ? (
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <Chip
                  key={c.value}
                  size="md"
                  active={activeCondition === c.value}
                  onClick={() => setActiveCondition(c.value)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          ) : (
            <div />
          )}
          {showCategoryFilter && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  size="md"
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          )}
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Nessun prodotto trovato.
        </p>
      )}
    </div>
  );
}
