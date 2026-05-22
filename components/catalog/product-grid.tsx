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

/** Costruisce l'URL di ricerca sul sito di vendita giusto.
 * Usa SEARCH invece di slug diretto perché lo slug del CRM non
 * coincide sempre con lo slug originale del sito sorgente (WC/Shopify).
 * La ricerca per nome è affidabile al 100%: l'utente atterra sulla
 * pagina risultati col prodotto già cercato. */
function buildBuyUrl(product: PublicProductListItem): string {
  const base = CHANNEL_URLS[product.channel];
  const query = encodeURIComponent(product.name);
  // WooCommerce (cellcom.it): ?s=...
  if (product.channel === "cellcom") return `${base}/?s=${query}&post_type=product`;
  // Shopify (italianparts, fastfix): /search?q=...
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

/** Icona generica ricambio — dipende dalla categoria (display/batteria/scocca/...) */
function PartIcon({ category }: { category: string | null }) {
  const c = (category ?? "").toLowerCase();
  if (c.includes("display") || c.includes("schermo")) {
    return (
      <svg viewBox="0 0 100 120" className="w-2/5 text-brand-500/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 120 60" className="w-3/5 text-brand-500/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="10" width="100" height="40" rx="4" />
        <rect x="105" y="22" width="10" height="16" rx="2" />
        <rect x="15" y="20" width="45" height="20" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }
  if (c.includes("scocca") || c.includes("housing") || c.includes("back")) {
    return (
      <svg viewBox="0 0 80 120" className="w-2/5 text-brand-500/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="64" height="104" rx="10" />
        <rect x="14" y="20" width="22" height="22" rx="4" />
        <circle cx="24" cy="31" r="4" />
      </svg>
    );
  }
  // generico — chip / scheda madre
  return (
    <svg viewBox="0 0 120 120" className="w-2/5 text-brand-500/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

/** Icona generica accessorio — cavo/caricabatterie */
function AccessoryIcon() {
  return (
    <svg viewBox="0 0 120 120" className="w-2/5 text-brand-500/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  // Difesa contro bug CRM: lo stock_total aggregato per product_id a volte
  // ritorna 0 anche se le varianti hanno disponibilità. Se il prodotto ha
  // varianti, evitiamo l'etichetta "Esaurito" definitiva e mandiamo l'utente
  // a verificare.
  const treatAsOutOfStock = stock.count === 0 && variantCount === 0;
  const treatAsCheckRequired = stock.count === 0 && variantCount > 0;

  const stockColor = treatAsOutOfStock
    ? "text-brand-500"
    : treatAsCheckRequired
      ? "text-muted-foreground"
      : !stock.capped && stock.count <= 3
        ? "text-yellow-400"
        : "text-green-400";

  const stockLabel = treatAsOutOfStock
    ? "Esaurito"
    : treatAsCheckRequired
      ? "Verifica disponibilità"
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
      {/* Image: foto reale dal CRM (assoluta) o icona-tipo specifica per kind */}
      <div className="aspect-[4/5] rounded-xl bg-gradient-to-b from-card-hover to-background border border-border flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        ) : product.kind === "part" ? (
          <PartIcon category={product.category} />
        ) : product.kind === "accessory" ? (
          <AccessoryIcon />
        ) : (
          <PhoneSilhouette
            variant={((Math.abs(product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
            className="w-auto h-[85%] drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        )}
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

      {treatAsOutOfStock ? (
        <button
          type="button"
          disabled
          className="mt-1 w-full py-2.5 rounded-lg bg-card-hover text-muted-foreground text-sm font-semibold text-center border border-border cursor-not-allowed"
        >
          Avvisami quando torna
        </button>
      ) : (
        <a
          href={buildBuyUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 w-full py-2.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold text-center hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300 inline-flex items-center justify-center gap-2"
          title={`Acquista su ${getChannelName(product.channel)}`}
        >
          <span>Acquista su {getChannelName(product.channel)}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      )}
    </motion.div>
  );
}

export function ProductGrid({
  initialProducts,
  showConditionFilter = true,
  showCategoryFilter = true,
}: {
  initialProducts: PublicProductListItem[];
  /** Nasconde le pillole Nuovo/Ricondizionato/Usato. Per la pagina ricambi: i ricambi non hanno questa distinzione. */
  showConditionFilter?: boolean;
  /** Nasconde le pillole Smartphone/Ricambio. Per la pagina ricambi: tutti i prodotti sono già ricambi. */
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
    <div className="flex flex-col gap-8">
      {/* Filters */}
      {showFilterRow && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {showConditionFilter ? (
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
          ) : (
            <div />
          )}
          {showCategoryFilter && (
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
          )}
        </div>
      )}

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
