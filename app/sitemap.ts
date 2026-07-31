import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Sitemap delle pagine indicizzabili.
 *
 * Due correzioni rispetto alla versione precedente:
 *
 * 1. Niente più URL con àncora (/prodotti#slug). Per Google `#` non
 *    identifica una pagina: quelle 150+ entry erano tutte lo stesso
 *    indirizzo ripetuto, e una sitemap piena di duplicati fa perdere
 *    autorevolezza a quelle vere. Torneranno quando esisteranno le schede
 *    prodotto come pagine proprie.
 *
 * 2. Niente /b2b/login: robots.ts blocca "/b2b/", quindi dichiararla qui
 *    era una contraddizione: si chiede a Google di indicizzare una pagina
 *    che gli si vieta di leggere.
 */

const BASE = SITE_URL;

const ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },

  // Servizi: sono le pagine che devono posizionarsi sulle ricerche locali
  { path: "/riparazioni", changeFrequency: "weekly", priority: 0.95 },
  { path: "/riparazioni/richiedi", changeFrequency: "monthly", priority: 0.75 },
  { path: "/negozi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/usato", changeFrequency: "daily", priority: 0.9 },
  { path: "/rivendi", changeFrequency: "weekly", priority: 0.85 },

  // Catalogo
  { path: "/prodotti", changeFrequency: "daily", priority: 0.9 },
  { path: "/prodotti/telefoni", changeFrequency: "daily", priority: 0.85 },
  { path: "/prodotti/ricambi", changeFrequency: "daily", priority: 0.85 },
  { path: "/prodotti/accessori", changeFrequency: "daily", priority: 0.8 },

  // Formazione e canale professionale
  { path: "/corsi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/apri-negozio", changeFrequency: "monthly", priority: 0.65 },
  { path: "/diventa-partner", changeFrequency: "monthly", priority: 0.65 },

  // Istituzionali
  { path: "/chi-siamo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookie", changeFrequency: "yearly", priority: 0.3 },
  { path: "/termini", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Il sito serve entrambe le lingue sullo stesso indirizzo (la scelta vive in
 * un cookie), quindi gli alternates puntano alla stessa URL: è il modo
 * corretto di dichiararlo finché non esistono percorsi /en separati.
 */
function alternates(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const url = `${BASE}${path}`;
  return { languages: { it: url, en: url, "x-default": url } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: alternates(r.path),
  }));
}
