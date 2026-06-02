import type { MetadataRoute } from "next";

const BASE = "https://sitocellcom.vercel.app";

/**
 * Regole crawler:
 * - Indicizza il pubblico (catalogo, riparazioni, marketing).
 * - Esclude: API, area B2B autenticata, area clienti autenticata,
 *   reset-password, tracker (ha query-string sensibili), preview Vercel.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/b2b/",
          "/clienti/",
          "/imposta-password",
          "/riparazioni/tracker",
        ],
      },
      // Blocca esplicitamente i bot AI scraper aggressivi (opt-out
      // training). Lascia Google/Bing/DuckDuckGo che usano allow="/".
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
