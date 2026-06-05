/**
 * Categorie di dispositivo supportate dal wizard riparazione + brand
 * elegibili per ciascuna categoria.
 *
 * I brand vengono derivati dal DB modelli (lib/repairs/models-db): 2886
 * modelli su 6 categorie (Smartphone, Tablet, Watch, Laptop, Desktop, Console).
 *
 * Brand logos vengono da cdn.simpleicons.org (slug standard simple-icons),
 * con fallback testuale se la richiesta fallisce.
 */

import { brandsForCategory, type RepairModel } from "./models-db";

export type DeviceCategoryId =
  | "smartphone"
  | "tablet"
  | "watch"
  | "laptop"
  | "desktop"
  | "console";

/** Mapping DeviceCategoryId (lowercase, URL-friendly) → RepairModel.category (capitalized). */
export const CATEGORY_TO_DB: Record<DeviceCategoryId, RepairModel["category"]> = {
  smartphone: "Smartphone",
  tablet: "Tablet",
  watch: "Watch",
  laptop: "Laptop",
  desktop: "Desktop",
  console: "Console",
};

export type DeviceCategory = {
  id: DeviceCategoryId;
  /** Etichetta dict (i18n) */
  labelKey:
    | "rw.cat.smartphone"
    | "rw.cat.tablet"
    | "rw.cat.watch"
    | "rw.cat.laptop"
    | "rw.cat.desktop"
    | "rw.cat.console";
  /** True se il DB ha modelli per questa categoria. */
  hasModels: boolean;
  /** Conteggio modelli totali. */
  modelCount: number;
};

/**
 * Slug simple-icons per i brand più comuni (caso-insensitive match sul nome).
 * I brand non in lista cadono nel fallback testuale di <BrandLogo>.
 */
const BRAND_SLUG: Record<string, string> = {
  apple: "apple",
  samsung: "samsung",
  google: "google",
  xiaomi: "xiaomi",
  huawei: "huawei",
  honor: "honor",
  oneplus: "oneplus",
  oppo: "oppo",
  realme: "realme",
  motorola: "motorola",
  nothing: "nothing",
  asus: "asus",
  sony: "sony",
  nokia: "nokia",
  alcatel: "alcatel",
  blackberry: "blackberry",
  cat: "caterpillar",
  fairphone: "fairphone",
  htc: "htc",
  lg: "lg",
  lenovo: "lenovo",
  microsoft: "microsoft",
  nintendo: "nintendo",
  dell: "dell",
  hp: "hp",
  acer: "acer",
  msi: "msi",
  razer: "razer",
  garmin: "garmin",
  fitbit: "fitbit",
};

/** Slug simple-icons per il brand (per cdn.simpleicons.org), o stringa vuota se sconosciuto. */
export function brandSlug(brand: string): string {
  const key = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BRAND_SLUG[key] ?? "";
}

/**
 * Categorie disponibili. `modelCount` zero = la categoria è mostrata nel wizard
 * con un sotto-form "Diagnosi su richiesta" (no catalogo).
 */
export const CATEGORIES: DeviceCategory[] = (
  ["smartphone", "tablet", "watch", "laptop", "desktop", "console"] as DeviceCategoryId[]
).map((id) => {
  const dbCat = CATEGORY_TO_DB[id];
  const brands = brandsForCategory(dbCat);
  const count = brands.reduce((a, b) => a + b.count, 0);
  return {
    id,
    labelKey: `rw.cat.${id}` as DeviceCategory["labelKey"],
    hasModels: count > 0,
    modelCount: count,
  };
});

/** Brand per categoria, già ordinati per popolarità (# modelli desc). */
export function brandsForCategoryId(id: DeviceCategoryId): { name: string; count: number }[] {
  return brandsForCategory(CATEGORY_TO_DB[id]);
}

/** Trova categoria. */
export function getCategory(id: DeviceCategoryId): DeviceCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
