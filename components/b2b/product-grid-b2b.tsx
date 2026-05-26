"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CONDITION_LABELS } from "@/lib/crm-client/mocks/products";
import type {
  B2bProductListItem,
  PublicCondition,
  PublicKind,
  SiteRequestKind,
} from "@/lib/crm-client/types";
import { PhoneSilhouette } from "@/components/marketing/phone-silhouette";
import { PriceDisplay } from "@/components/b2b/price-display";
import { RequestForm } from "@/components/forms/request-form";
import { resolvePrice } from "@/lib/pricing/resolver";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

type B2bViewer = {
  customerId: string;
  tierCode: string | null;
  tierName: string | null;
};

function ProductCard({
  product,
  viewer,
  onRequest,
}: {
  product: B2bProductListItem;
  viewer: B2bViewer;
  onRequest: (p: B2bProductListItem) => void;
}) {
  const price = resolvePrice(product, {
    kind: "b2b",
    customerId: viewer.customerId,
    tierCode: viewer.tierCode,
    tierName: viewer.tierName,
  });
  const { stock, variantCount } = product;
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
      ? "Verifica"
      : !stock.capped && stock.count <= 3
        ? `Ultimi ${stock.count}`
        : "Disponibile";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ duration: DURATION.normal, ease: EASE.smooth }}
      className="group flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-brand-600/50 hover:-translate-y-1 hover:shadow-[0_18px_48px_-18px_rgba(220,38,38,0.55)] transition-all duration-300"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="aspect-[4/5] rounded-xl bg-gradient-to-b from-card-hover to-background border border-border flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.30)_0%,rgba(220,38,38,0.08)_45%,transparent_75%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.50)_0%,rgba(220,38,38,0.15)_45%,transparent_75%)] transition-all duration-500" />
        <div className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-brand-600/60 to-transparent group-hover:via-brand-500 transition-colors duration-500" />
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        ) : (
          <PhoneSilhouette
            variant={
              ((Math.abs(
                product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
              ) %
                6) +
                1) as 1 | 2 | 3 | 4 | 5 | 6
            }
            className="w-auto h-[85%] drop-shadow-[0_8px_28px_rgba(220,38,38,0.35)]"
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

      <div className="mt-auto flex items-end justify-between gap-3">
        <PriceDisplay price={price} size="md" />
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider font-mono shrink-0",
            stockColor,
          )}
        >
          {stockLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRequest(product)}
        className="btn-shine mt-1 w-full py-2.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)] transition-shadow duration-300"
      >
        Richiedi disponibilità
      </button>
    </motion.div>
  );
}

const conditions: { value: PublicCondition | "all"; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "new", label: "Nuovo" },
  { value: "refurbished", label: "Ricondizionato" },
  { value: "used", label: "Usato" },
];

const kinds: { value: PublicKind | "all"; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: "device", label: "Telefoni" },
  { value: "part", label: "Ricambi" },
  { value: "accessory", label: "Accessori" },
];

export function ProductGridB2b({
  initialProducts,
  viewer,
}: {
  initialProducts: B2bProductListItem[];
  viewer: B2bViewer;
}) {
  const [activeCondition, setActiveCondition] = useState<
    PublicCondition | "all"
  >("all");
  const [activeKind, setActiveKind] = useState<PublicKind | "all">("all");
  const [activeProduct, setActiveProduct] =
    useState<B2bProductListItem | null>(null);

  const filtered = initialProducts.filter((p) => {
    if (activeCondition !== "all" && p.condition !== activeCondition) return false;
    if (activeKind !== "all" && p.kind !== activeKind) return false;
    return true;
  });

  const counts = {
    all: initialProducts.length,
    device: initialProducts.filter((p) => p.kind === "device").length,
    part: initialProducts.filter((p) => p.kind === "part").length,
    accessory: initialProducts.filter((p) => p.kind === "accessory").length,
    other: initialProducts.filter((p) => p.kind === "other").length,
  };

  const requestKind: SiteRequestKind =
    activeProduct?.kind === "part" ? "spare-part" : "b2b-quote";

  return (
    <div className="flex flex-col gap-8">
      {/* Filtro per tipo: Telefoni / Ricambi / Accessori */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Tipo
        </span>
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => {
            const count =
              k.value === "all"
                ? counts.all
                : counts[k.value as keyof typeof counts] ?? 0;
            return (
              <button
                key={k.value}
                onClick={() => setActiveKind(k.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 inline-flex items-center gap-1.5",
                  activeKind === k.value
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-card text-muted-foreground border-border hover:border-brand-600/40",
                )}
              >
                {k.label}
                <span
                  className={cn(
                    "tabular-nums text-[10px]",
                    activeKind === k.value
                      ? "opacity-80"
                      : "text-muted-foreground/70",
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtro per condition (rilevante solo per Telefoni) */}
      {(activeKind === "all" || activeKind === "device") && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Condizione
          </span>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCondition(c.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  activeCondition === c.value
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-card text-muted-foreground border-border hover:border-brand-600/40",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewer={viewer}
              onRequest={setActiveProduct}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Nessun prodotto trovato.
        </p>
      )}

      {activeProduct && (
        <RequestForm
          kind={requestKind}
          product={{
            id: activeProduct.id,
            slug: activeProduct.slug,
            name: activeProduct.name,
            variantId: null,
            variantLabel: null,
          }}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}
