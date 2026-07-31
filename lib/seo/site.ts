/**
 * Identità del sito per la SEO — fonte unica.
 *
 * Il dominio canonico stava scritto a mano in quattro punti (layout,
 * sitemap, robots, JSON-LD): bastava dimenticarne uno per dire a Google
 * che il sito "vero" è un altro. Da qui in poi si cambia solo questa riga.
 *
 * Il valore è sovrascrivibile con NEXT_PUBLIC_SITE_URL, così un ambiente di
 * staging non si annuncia con il dominio di produzione.
 */

const FALLBACK = "https://fast-fix.it";

function normalize(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = normalize(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK,
);

/** URL assoluto a partire da un path relativo ("/negozi" → "https://…/negozi") */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Dati usati in title, description e dati strutturati */
export const SITE = {
  name: "Fast-Fix",
  /** Città principale: è la leva della ricerca locale */
  city: "San Benedetto del Tronto",
  province: "AP",
  region: "Marche",
  /** Comuni serviti, citati nei testi e in areaServed */
  nearbyCities: [
    "Grottammare",
    "Cupra Marittima",
    "Monteprandone",
    "Porto d'Ascoli",
    "Martinsicuro",
    "Alba Adriatica",
    "Ascoli Piceno",
  ],
  ogImage: "/opengraph-image",
} as const;
