/**
 * Costanti globali dell'HUB Fast-Fix.
 *
 * Curve di easing cinematiche — estratte dal mockup cube-carousel.html
 * e normalizzate per Framer Motion (array di 4 numeri) + Tailwind.
 */

export const EASE = {
  /** Cube carousel, hero entrances, scroll-driven — bilanciato decelera */
  smooth: [0.65, 0, 0.35, 1] as const,

  /** UI interactions, button presses, modal open — overshoot leggero */
  snappy: [0.34, 1.56, 0.64, 1] as const,

  /** Word-by-word reveal, caption crossfade — decelera forte */
  drift: [0.16, 1, 0.3, 1] as const,
} as const;

/** Durations in seconds — Framer Motion usa seconds nativamente */
export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.8,
  cinematic: 1.2,
} as const;

/** Brand config — allineato con CRM brand-templates.ts */
export const BRAND = {
  name: "Fast-Fix",
  legalName: "FAST-FIX di Sarker Srabon",
  primaryColor: "#dc2626",
  secondaryColor: "#991b1b",
  website: "fast-fix.it",
  email: "info@fast-fix.it",
  phone: "0735 501637",
} as const;

/**
 * Channel mapping per link-out.
 * ATTENZIONE: le chiavi sono gli identificatori dei canali lato CRM
 * (product.channel) — non rinominarle nel rebranding o la mappatura
 * dei prodotti si rompe.
 */
export const CHANNEL_URLS = {
  cellcom: "https://cellcom.it",
  italianparts: "https://www.italianparts.it",
  fastfix: "https://fast-fix.it",
  smartphonefix: "https://smartphonefix.it",
  fixhub: "https://fixhub.it",
} as const;

export type Channel = keyof typeof CHANNEL_URLS;
