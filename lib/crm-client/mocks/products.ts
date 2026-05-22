export type ProductCondition = "new" | "used" | "refurbished";
export type ProductChannel = "cellcom" | "italianparts" | "fastfix";

export interface ProductMock {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  condition: ProductCondition;
  priceCents: number;
  stockTotal: number;
  channel: ProductChannel;
  photoUrl?: string;
}

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "Nuovo",
  used: "Usato",
  refurbished: "Ricondizionato",
};

export const CHANNEL_URLS: Record<ProductChannel, string> = {
  cellcom: "https://cellcom.it",
  italianparts: "https://italianparts.it",
  fastfix: "https://fast-fix.it",
};

export const mockProducts: ProductMock[] = [
  {
    id: "p1",
    slug: "iphone-15-pro-128gb",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphone",
    condition: "new",
    priceCents: 124900,
    stockTotal: 12,
    channel: "cellcom",
  },
  {
    id: "p2",
    slug: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphone",
    condition: "new",
    priceCents: 89900,
    stockTotal: 8,
    channel: "cellcom",
  },
  {
    id: "p3",
    slug: "iphone-14-refurbished",
    name: "iPhone 14 Refurbished",
    brand: "Apple",
    category: "Smartphone",
    condition: "refurbished",
    priceCents: 67900,
    stockTotal: 3,
    channel: "cellcom",
  },
  {
    id: "p4",
    slug: "google-pixel-8",
    name: "Google Pixel 8",
    brand: "Google",
    category: "Smartphone",
    condition: "new",
    priceCents: 74900,
    stockTotal: 5,
    channel: "italianparts",
  },
  {
    id: "p5",
    slug: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    category: "Smartphone",
    condition: "new",
    priceCents: 109900,
    stockTotal: 2,
    channel: "fastfix",
  },
  {
    id: "p6",
    slug: "iphone-13-refurbished",
    name: "iPhone 13 Refurbished",
    brand: "Apple",
    category: "Smartphone",
    condition: "refurbished",
    priceCents: 54900,
    stockTotal: 2,
    channel: "cellcom",
  },
  {
    id: "p7",
    slug: "display-iphone-15-pro",
    name: "Display iPhone 15 Pro OLED",
    brand: "Apple",
    category: "Ricambio",
    condition: "new",
    priceCents: 18900,
    stockTotal: 24,
    channel: "italianparts",
  },
  {
    id: "p8",
    slug: "batteria-samsung-s24",
    name: "Batteria Samsung S24",
    brand: "Samsung",
    category: "Ricambio",
    condition: "new",
    priceCents: 4900,
    stockTotal: 18,
    channel: "italianparts",
  },
];

export function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}
