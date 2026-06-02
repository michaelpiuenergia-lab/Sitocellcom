import type { MetadataRoute } from "next";
import { getProducts, getUsedDevices, getCourses } from "@/lib/crm-client";

/**
 * Sitemap dinamico generato a build/ISR. Liste paginate dal CRM in modo
 * best-effort (fallback silent su errore: se il CRM è down il sitemap
 * contiene comunque le route statiche).
 *
 * Bilingue: ogni entry ha alternates IT/EN per il muRliR-language hint.
 */

const BASE = "https://sitocellcom.vercel.app";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/prodotti", changeFrequency: "daily", priority: 0.9 },
  { path: "/prodotti/telefoni", changeFrequency: "daily", priority: 0.85 },
  { path: "/prodotti/ricambi", changeFrequency: "daily", priority: 0.85 },
  { path: "/prodotti/accessori", changeFrequency: "daily", priority: 0.85 },
  { path: "/usato", changeFrequency: "daily", priority: 0.9 },
  { path: "/rivendi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/riparazioni", changeFrequency: "weekly", priority: 0.9 },
  { path: "/riparazioni/richiedi", changeFrequency: "weekly", priority: 0.75 },
  { path: "/riparazioni/tracker", changeFrequency: "monthly", priority: 0.5 },
  { path: "/corsi", changeFrequency: "weekly", priority: 0.7 },
  { path: "/negozi", changeFrequency: "monthly", priority: 0.8 },
  { path: "/chi-siamo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/apri-negozio", changeFrequency: "monthly", priority: 0.6 },
  { path: "/diventa-partner", changeFrequency: "monthly", priority: 0.6 },
  { path: "/b2b/login", changeFrequency: "yearly", priority: 0.3 },
];

function withAlternates(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: {
      it: `${BASE}${path}`,
      en: `${BASE}${path}`, // stessa URL con cookie lang=en
      "x-default": `${BASE}${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: withAlternates(r.path),
  }));

  // Dinamiche: prodotti pubblici (top 200), usato (top 100), corsi (top 50)
  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await getProducts({ limit: 100 });
    for (const p of products.items) {
      dynamicEntries.push({
        url: `${BASE}/prodotti#${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: withAlternates(`/prodotti#${p.slug}`),
      });
    }
  } catch {
    // CRM giù: sitemap statico va comunque bene
  }

  try {
    const used = await getUsedDevices({ limit: 50 });
    for (const d of used.items) {
      dynamicEntries.push({
        url: `${BASE}/usato#${d.id}`,
        lastModified: new Date(d.publishedAt),
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: withAlternates(`/usato#${d.id}`),
      });
    }
  } catch {
    // ignore
  }

  try {
    const courses = await getCourses();
    for (const c of courses.items) {
      dynamicEntries.push({
        url: `${BASE}/corsi#${c.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: withAlternates(`/corsi#${c.id}`),
      });
    }
  } catch {
    // ignore
  }

  return [...staticEntries, ...dynamicEntries];
}
