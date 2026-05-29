import type {
  UsedDevice,
  UsedDeviceListParams,
  UsedDeviceListResponse,
} from "../types";

/**
 * Mock catalogo usato — usato quando il CRM non è configurato (CRM_API_URL
 * assente) o in test. Foto vuote → la card mostra la silhouette di fallback,
 * così niente immagini rotte in locale.
 */
export const mockUsedDevices: UsedDevice[] = [
  {
    id: "mock-used-0001",
    channel: "cellcom",
    brand: "Apple",
    model: "iPhone 13 Pro",
    variant: "256GB",
    color: "Grigio Siderale",
    condition: "buono",
    conditionLabel: "Buono",
    functional: true,
    accessories: "Scatola originale + cavo",
    warrantyMonths: 6,
    priceCents: 58000,
    priceEur: "580,00",
    title: "iPhone 13 Pro 256GB Grigio Siderale",
    description: "Ottime condizioni, batteria 92%, garanzia Cellcom 6 mesi.",
    photos: [],
    publishedAt: "2026-05-27T22:14:00.000Z",
  },
  {
    id: "mock-used-0002",
    channel: "cellcom",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    variant: "512GB",
    color: "Nero",
    condition: "ottimo",
    conditionLabel: "Ottimo",
    functional: true,
    accessories: "Solo dispositivo",
    warrantyMonths: 12,
    priceCents: 72000,
    priceEur: "720,00",
    title: "Galaxy S23 Ultra 512GB Nero",
    description: "Come nuovo, nessun graffio, garanzia 12 mesi.",
    photos: [],
    publishedAt: "2026-05-26T10:00:00.000Z",
  },
  {
    id: "mock-used-0003",
    channel: "cellcom",
    brand: "Apple",
    model: "iPhone 12",
    variant: "128GB",
    color: "Blu",
    condition: "discreto",
    conditionLabel: "Discreto",
    functional: true,
    accessories: null,
    warrantyMonths: 3,
    priceCents: 34000,
    priceEur: "340,00",
    title: "iPhone 12 128GB Blu",
    description: "Segni d'uso sul telaio, schermo perfetto. Garanzia 3 mesi.",
    photos: [],
    publishedAt: "2026-05-24T09:30:00.000Z",
  },
  {
    id: "mock-used-0004",
    channel: "cellcom",
    brand: "Google",
    model: "Pixel 7",
    variant: "128GB",
    color: "Snow",
    condition: "buono",
    conditionLabel: "Buono",
    functional: true,
    accessories: "Scatola originale",
    warrantyMonths: 6,
    priceCents: 29000,
    priceEur: "290,00",
    title: "Pixel 7 128GB Snow",
    description: "Buone condizioni generali, batteria in salute.",
    photos: [],
    publishedAt: "2026-05-22T15:45:00.000Z",
  },
];

export async function getUsedDevices(
  params: UsedDeviceListParams = {},
): Promise<UsedDeviceListResponse> {
  let items = [...mockUsedDevices];

  if (params.channel) items = items.filter((d) => d.channel === params.channel);
  if (params.brand) {
    const b = params.brand.toLowerCase();
    items = items.filter((d) => d.brand.toLowerCase() === b);
  }
  if (params.condition) {
    items = items.filter((d) => d.condition === params.condition);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (d) =>
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        (d.variant?.toLowerCase().includes(q) ?? false),
    );
  }

  const offset = params.offset ?? 0;
  const limit = params.limit ?? 50;
  const paginated = items.slice(offset, offset + limit);

  return {
    items: paginated,
    total: items.length,
    hasMore: offset + limit < items.length,
  };
}
