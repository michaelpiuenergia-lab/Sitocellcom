/**
 * Database modelli del wizard riparazione HUB.
 * 2886 modelli, 6 categorie (Smartphone/Tablet/Watch/Laptop/Desktop/Console),
 * codici parte (es. A3520, A3258 per iPhone 17) + filename immagine.
 *
 * Source: lib/repairs/models-data.json (build dump auto-contenuto).
 * Immagini: servite da public/repair-models/<category>/<brand>/<id>-<filename>.
 */

import raw from "./models-data.json";

export type RepairModel = {
  id: number;
  /** Nome commerciale: "iPhone 17 Pro Max", "Galaxy S24 Ultra", ecc. */
  name: string;
  /** Codici parte / model code dichiarati dal produttore (es. A3526, A3257, ...). */
  codes: string[];
  /** Categoria dispositivo. */
  category: "Smartphone" | "Tablet" | "Watch" | "Laptop" | "Desktop" | "Console";
  /** Brand (case-sensitive come stored — "Apple", "Samsung", "OPPO", ecc.). */
  brand: string;
  /** Filename immagine modello — null se non disponibile. */
  image: {
    /** Filename base servito dal nostro CDN (es. "3068-69eaa7805ff36.webp"). */
    filename: string;
  } | null;
};

type Db = {
  stats: {
    files: number;
    files_parsed: number;
    models_total: number;
    unique_image_urls: number;
    brand_breakdown: Record<string, number>;
  };
  models: RepairModel[];
};

const DB = raw as Db;

/** Tutti i modelli, immutabile. */
export const ALL_MODELS: ReadonlyArray<RepairModel> = DB.models;

/** Numero totale modelli nel DB. */
export const TOTAL_MODELS = DB.models.length;

/** Lista categorie effettivamente presenti, ordinate. */
export const CATEGORIES_AVAILABLE = (() => {
  const set = new Set<RepairModel["category"]>();
  for (const m of DB.models) set.add(m.category);
  return Array.from(set).sort();
})();

/** Brand per categoria, ordinati per # modelli desc. */
const BRANDS_BY_CAT = (() => {
  const map = new Map<string, Map<string, number>>();
  for (const m of DB.models) {
    if (!map.has(m.category)) map.set(m.category, new Map());
    const b = map.get(m.category)!;
    b.set(m.brand, (b.get(m.brand) ?? 0) + 1);
  }
  const out: Record<string, { name: string; count: number }[]> = {};
  for (const [cat, brands] of map) {
    out[cat] = Array.from(brands.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
  return out;
})();

/** Brand disponibili per una categoria, ordinati per # modelli desc. */
export function brandsForCategory(category: RepairModel["category"]): { name: string; count: number }[] {
  return BRANDS_BY_CAT[category] ?? [];
}

/** Modelli per (category, brand), ordinati per id desc (più recenti prima). */
const BY_CAT_BRAND = (() => {
  const m = new Map<string, RepairModel[]>();
  for (const model of DB.models) {
    const key = `${model.category}::${model.brand}`;
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(model);
  }
  for (const list of m.values()) list.sort((a, b) => b.id - a.id);
  return m;
})();

export function modelsForCategoryBrand(
  category: RepairModel["category"],
  brand: string,
): RepairModel[] {
  return BY_CAT_BRAND.get(`${category}::${brand}`) ?? [];
}

/** Trova un modello per id. */
const BY_ID = new Map<number, RepairModel>(DB.models.map((m) => [m.id, m]));
export function findModelById(id: number): RepairModel | undefined {
  return BY_ID.get(id);
}

/** Ricerca globale fuzzy su nome + brand + codici. */
export function searchModels(query: string, limit = 12): RepairModel[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: RepairModel[] = [];
  for (const m of DB.models) {
    const blob = `${m.brand} ${m.name} ${m.codes.join(" ")}`.toLowerCase();
    if (blob.includes(q)) {
      out.push(m);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/**
 * URL pubblica della foto modello (servita dal CDN HUB).
 *
 * I file sono in `public/repair-models/<category>/<brand>/<id>-<filename>`.
 * Se la foto non c'è, ritorna null (la UI mostra placeholder).
 */
export function modelImageUrl(model: RepairModel): string | null {
  if (!model.image) return null;
  const cat = model.category.toLowerCase();
  const brand = model.brand.replace(/[^a-zA-Z0-9]/g, "_");
  return `/repair-models/${cat}/${brand}/${model.id}-${model.image.filename}`;
}

/** Stat di runtime per debug. */
export const DB_STATS = DB.stats;
