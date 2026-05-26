/**
 * Costanti globali dell'HUB Cellcom.
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

/** Cube config */
export const CUBE = {
  size: 360,        // +40px = telefoni più grandi
  height: 600,
  depth: 220,       // ridotto da 277: telefoni laterali più vicini, meno persi nel buio
  angleStep: 60,
  autoInterval: 4500,
} as const;

/** Brand config — allineato con CRM brand-templates.ts */
export const BRAND = {
  name: "Cellcom",
  legalName: "Cellcom S.r.l.",
  primaryColor: "#dc2626",
  secondaryColor: "#991b1b",
  website: "cellcom.it",
  email: "info@cellcom.it",
  phone: "+39 000 000 0000",
} as const;

/** Channel mapping per link-out */
export const CHANNEL_URLS = {
  cellcom: "https://cellcom.it",
  italianparts: "https://www.italianparts.it",
  fastfix: "https://fast-fix.it",
  smartphonefix: "https://smartphonefix.it",
  fixhub: "https://fixhub.it",
} as const;

export type Channel = keyof typeof CHANNEL_URLS;
