import { cn } from "@/lib/utils/cn";
import { formatPriceCents } from "@/lib/pricing/resolver";
import type { DisplayPrice } from "@/lib/pricing/resolver";

/**
 * Mostra prezzo principale + (opzionale) prezzo pubblico barrato di confronto.
 * Usato sia in product card B2B sia in dettaglio prodotto.
 */
export function PriceDisplay({
  price,
  size = "md",
  className,
}: {
  price: DisplayPrice;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = {
    sm: { main: "text-base", compare: "text-xs", label: "text-[9px]" },
    md: { main: "text-lg", compare: "text-xs", label: "text-[10px]" },
    lg: { main: "text-2xl", compare: "text-sm", label: "text-xs" },
  }[size];

  if (price.needsQuote) {
    return (
      <div className={cn("flex flex-col gap-0.5", className)}>
        <span
          className={cn(
            "font-mono font-medium text-brand-500 tabular-nums",
            sizeClass.main,
          )}
        >
          Su richiesta
        </span>
        <span
          className={cn(
            "uppercase tracking-wider font-mono text-muted-foreground",
            sizeClass.label,
          )}
        >
          Prezzo riservato
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-mono font-medium text-foreground tabular-nums",
            sizeClass.main,
          )}
        >
          {formatPriceCents(price.displayCents)}
        </span>
        {price.comparePriceCents !== null && (
          <span
            className={cn(
              "font-mono text-muted-foreground line-through tabular-nums",
              sizeClass.compare,
            )}
          >
            {formatPriceCents(price.comparePriceCents)}
          </span>
        )}
      </div>
      <span
        className={cn(
          "uppercase tracking-wider font-mono",
          sizeClass.label,
          price.label === "Tuo prezzo" ? "text-brand-500" : "text-muted-foreground",
        )}
      >
        {price.label}
        {price.savingsCents && price.savingsCents > 0 ? (
          <span className="ml-2 text-brand-500/80">
            risparmi {formatPriceCents(price.savingsCents)}
          </span>
        ) : null}
      </span>
    </div>
  );
}
