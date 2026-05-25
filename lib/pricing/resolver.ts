import type {
  PricingViewer,
  PublicProductListItem,
  B2bProductListItem,
} from "@/lib/crm-client/types";

/**
 * Pricing resolver — un solo posto che decide cosa mostrare all'utente.
 *
 * REGOLA: l'HUB non calcola mai prezzi. Il prezzo arriva già "applicato"
 * dal CRM (endpoint pubblico vs B2B). Questo modulo serve solo a:
 *   1. Sapere quale endpoint chiamare (pubblico o B2B) in base al viewer
 *   2. Etichettare correttamente il prezzo in UI
 *   3. Gestire fallback ("Richiedi preventivo") quando il CRM non ha prezzo B2B
 */

export type DisplayPrice = {
  /** Prezzo principale da mostrare (in centesimi) */
  displayCents: number;
  /** Etichetta UI: "Prezzo pubblico" o "Tuo prezzo B2B" */
  label: "Prezzo pubblico" | "Tuo prezzo" | "Su richiesta";
  /** Prezzo barrato di confronto se diverso dal display, in centesimi */
  comparePriceCents: number | null;
  /** Risparmio in centesimi (positivo se display < compare) */
  savingsCents: number | null;
  /** Se true, l'UI mostra CTA "Richiedi preventivo" invece del prezzo */
  needsQuote: boolean;
};

export function resolvePrice(
  product: PublicProductListItem | B2bProductListItem,
  viewer: PricingViewer,
): DisplayPrice {
  if (viewer.kind === "public") {
    // CRM nasconde il prezzo (es. ricambi) → "Su richiesta" + CTA contatto.
    if (product.priceHidden || product.priceCents === null || product.priceCents <= 0) {
      return {
        displayCents: 0,
        label: "Su richiesta",
        comparePriceCents: null,
        savingsCents: null,
        needsQuote: true,
      };
    }
    return {
      displayCents: product.priceCents,
      label: "Prezzo pubblico",
      comparePriceCents: null,
      savingsCents: null,
      needsQuote: false,
    };
  }

  // viewer.kind === "b2b"
  if ("publicPriceCents" in product) {
    // B2B ha sempre priceCents number + priceHidden:false (vedi types.ts).
    if (product.priceCents <= 0) {
      return {
        displayCents: 0,
        label: "Su richiesta",
        comparePriceCents: null,
        savingsCents: null,
        needsQuote: true,
      };
    }
    const isFallback = product.priceSource === "public-fallback";
    const hasPublicRef = product.publicPriceCents !== null;
    const same = hasPublicRef && product.priceCents === product.publicPriceCents;
    // Se non c'è un prezzo pubblico di riferimento (es. ricambi) non possiamo
    // mostrare il confronto barrato. Il prezzo B2B resta valido.
    const showCompare = hasPublicRef && !same && !isFallback;
    return {
      displayCents: product.priceCents,
      label: isFallback || same ? "Prezzo pubblico" : "Tuo prezzo",
      comparePriceCents: showCompare ? product.publicPriceCents : null,
      savingsCents:
        showCompare && product.publicPriceCents !== null
          ? Math.max(0, product.publicPriceCents - product.priceCents)
          : null,
      needsQuote: false,
    };
  }

  // Edge: viewer B2B ma il prodotto è un PublicProductListItem
  // (es. fallback se l'endpoint B2B fallisce). Mostriamo prezzo pubblico
  // con CTA "Richiedi preventivo".
  return {
    displayCents: product.priceCents ?? 0,
    label: "Su richiesta",
    comparePriceCents: null,
    savingsCents: null,
    needsQuote: true,
  };
}

export function formatPriceCents(cents: number, locale = "it-IT"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
