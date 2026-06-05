/**
 * Categorie di dispositivo supportate dal wizard riparazione + brand
 * elegibili per ciascuna categoria.
 *
 * Approccio: smartphone copre tutto il DB modelli locale (`lib/trade-in/models`).
 * Le altre categorie partono come "Diagnosi su richiesta" — il cliente sceglie
 * brand + scrive modello a mano, un tecnico richiama entro 24h.
 *
 * Brand logos vengono da cdn.simpleicons.org (slug standard simple-icons),
 * con fallback testuale se la richiesta fallisce. Niente install npm di
 * 3000 icone.
 */

export type DeviceCategoryId =
  | "smartphone"
  | "tablet"
  | "watch"
  | "laptop"
  | "desktop"
  | "console";

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
  /** Brand cards mostrate per questa categoria */
  brands: string[];
  /** True se il DB modelli locale copre questa categoria (smartphone unico per ora) */
  hasModelDb: boolean;
};

/**
 * Brand smartphone — combinazione del DB locale (lib/trade-in/models)
 * + brand del marquee, ordinati per riconoscibilità.
 * Slug = simple-icons slug per cdn.simpleicons.org/<slug>.
 */
export type Brand = {
  name: string;
  slug: string;
  /** Categorie in cui appare */
  categories: DeviceCategoryId[];
};

export const BRANDS: Brand[] = [
  { name: "Apple", slug: "apple", categories: ["smartphone", "tablet", "watch", "laptop", "desktop"] },
  { name: "Samsung", slug: "samsung", categories: ["smartphone", "tablet", "watch", "laptop"] },
  { name: "Google", slug: "google", categories: ["smartphone", "tablet", "watch", "laptop"] },
  { name: "Xiaomi", slug: "xiaomi", categories: ["smartphone", "tablet", "watch"] },
  { name: "Huawei", slug: "huawei", categories: ["smartphone", "tablet", "watch", "laptop"] },
  { name: "Honor", slug: "honor", categories: ["smartphone", "tablet", "watch"] },
  { name: "OnePlus", slug: "oneplus", categories: ["smartphone", "tablet", "watch"] },
  { name: "OPPO", slug: "oppo", categories: ["smartphone", "tablet", "watch"] },
  { name: "Realme", slug: "realme", categories: ["smartphone", "tablet"] },
  { name: "Motorola", slug: "motorola", categories: ["smartphone", "tablet"] },
  { name: "Nothing", slug: "nothing", categories: ["smartphone"] },
  { name: "Asus", slug: "asus", categories: ["smartphone", "tablet", "laptop", "desktop"] },
  { name: "Sony", slug: "sony", categories: ["smartphone", "tablet", "console", "laptop"] },
  { name: "Nokia", slug: "nokia", categories: ["smartphone", "tablet"] },
  { name: "alcatel", slug: "alcatel", categories: ["smartphone", "tablet"] },
  { name: "BlackBerry", slug: "blackberry", categories: ["smartphone"] },
  { name: "CAT", slug: "caterpillar", categories: ["smartphone"] },
  { name: "Fairphone", slug: "fairphone", categories: ["smartphone"] },
  { name: "HTC", slug: "htc", categories: ["smartphone"] },
  { name: "LG", slug: "lg", categories: ["smartphone", "tablet", "laptop", "desktop"] },
  { name: "Lenovo", slug: "lenovo", categories: ["smartphone", "tablet", "laptop", "desktop"] },
  { name: "Microsoft", slug: "microsoft", categories: ["smartphone", "tablet", "laptop", "desktop", "console"] },
  { name: "Nintendo", slug: "nintendo", categories: ["console"] },
  { name: "Dell", slug: "dell", categories: ["laptop", "desktop"] },
  { name: "HP", slug: "hp", categories: ["laptop", "desktop"] },
  { name: "Acer", slug: "acer", categories: ["laptop", "desktop"] },
  { name: "MSI", slug: "msi", categories: ["laptop", "desktop"] },
  { name: "Razer", slug: "razer", categories: ["laptop", "desktop"] },
  { name: "Garmin", slug: "garmin", categories: ["watch"] },
  { name: "Fitbit", slug: "fitbit", categories: ["watch"] },
];

export const CATEGORIES: DeviceCategory[] = [
  {
    id: "smartphone",
    labelKey: "rw.cat.smartphone",
    brands: BRANDS.filter((b) => b.categories.includes("smartphone")).map((b) => b.name),
    hasModelDb: true,
  },
  {
    id: "tablet",
    labelKey: "rw.cat.tablet",
    brands: BRANDS.filter((b) => b.categories.includes("tablet")).map((b) => b.name),
    hasModelDb: false,
  },
  {
    id: "watch",
    labelKey: "rw.cat.watch",
    brands: BRANDS.filter((b) => b.categories.includes("watch")).map((b) => b.name),
    hasModelDb: false,
  },
  {
    id: "laptop",
    labelKey: "rw.cat.laptop",
    brands: BRANDS.filter((b) => b.categories.includes("laptop")).map((b) => b.name),
    hasModelDb: false,
  },
  {
    id: "desktop",
    labelKey: "rw.cat.desktop",
    brands: BRANDS.filter((b) => b.categories.includes("desktop")).map((b) => b.name),
    hasModelDb: false,
  },
  {
    id: "console",
    labelKey: "rw.cat.console",
    brands: BRANDS.filter((b) => b.categories.includes("console")).map((b) => b.name),
    hasModelDb: false,
  },
];

export function getBrand(name: string): Brand | undefined {
  return BRANDS.find((b) => b.name === name);
}

export function getCategory(id: DeviceCategoryId): DeviceCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
