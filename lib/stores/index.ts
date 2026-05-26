/**
 * Negozi del Gruppo Cellcom — fonte unica per /negozi, /riparazioni, /rivendi
 * e ovunque serva uno store picker.
 *
 * 2026-05-26: dati estratti da smartphonefix.it (Fast-Fix Service, King Cover,
 * Cover 360°) + Cellcom HQ Parma. Tre filiali Marche/Abruzzo sono reali, gli
 * altri sono placeholder finché Michael non conferma indirizzi esatti.
 *
 * Quando il CRM esporrà /api/v1/public/stores (master plan §1) questa lista
 * resta come fallback offline.
 */

export type Store = {
  /** Slug univoco (kebab-case città-brand) */
  id: string;
  /** Nome visibile, include brand quando rilevante */
  name: string;
  /** Brand di riferimento — usato per badge UI */
  brand: "Cellcom" | "Fast-Fix" | "ItalianParts" | "SmartphoneFix" | "Partner";
  address: string;
  cap: string;
  city: string;
  /** Provincia (sigla 2 caratteri) */
  province: string;
  region: string;
  phone: string;
  email: string | null;
  /** Coordinate per Leaflet map */
  lat: number;
  lng: number;
  /** Orari sintetici per UI (es. "Lun-Sab 9-13 / 15:30-19:30") */
  hours: string;
  /** Servizi disponibili — controllano se appaiono nello store-picker di /riparazioni */
  services: {
    repair: boolean;        // accetta telefoni da riparare
    tradeIn: boolean;       // accetta usato per rivendita
    pickup: boolean;        // ritiro ordini online
    walkin: boolean;        // vendita al banco
  };
};

export const STORES: Store[] = [
  {
    id: "fast-fix-san-benedetto",
    name: "Fast-Fix Assistenza San Benedetto",
    brand: "Fast-Fix",
    address: "Piazza G. Garibaldi 31",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "+39 320 857 4006",
    email: "info@smartphonefix.it",
    lat: 42.9434,
    lng: 13.8814,
    hours: "Lun-Sab 9-13 / 15:30-19:30",
    services: { repair: true, tradeIn: true, pickup: true, walkin: true },
  },
  {
    id: "king-cover-roseto",
    name: "King Cover Roseto",
    brand: "Partner",
    address: "Via Nazionale 39",
    cap: "64026",
    city: "Roseto degli Abruzzi",
    province: "TE",
    region: "Abruzzo",
    phone: "+39 327 941 5599",
    email: null,
    lat: 42.6792,
    lng: 14.0117,
    hours: "Lun-Sab 9-13 / 16-20",
    services: { repair: true, tradeIn: false, pickup: true, walkin: true },
  },
  {
    id: "cover-360-san-benedetto",
    name: "Cover 360° San Benedetto",
    brand: "Partner",
    address: "Piazza IV Novembre",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "+39 377 380 3532",
    email: null,
    lat: 42.9460,
    lng: 13.8838,
    hours: "Lun-Sab 9:30-13 / 16-20",
    services: { repair: true, tradeIn: false, pickup: true, walkin: true },
  },
  // ─── Cellcom HQ — placeholder finché Michael non conferma indirizzo reale ─
  {
    id: "cellcom-parma",
    name: "Cellcom Parma (HQ)",
    brand: "Cellcom",
    address: "Via — (indirizzo da confermare)",
    cap: "43100",
    city: "Parma",
    province: "PR",
    region: "Emilia-Romagna",
    phone: "+39 — da confermare",
    email: "info@cellcom.it",
    lat: 44.8015,
    lng: 10.328,
    hours: "Lun-Ven 9-18",
    services: { repair: true, tradeIn: true, pickup: true, walkin: true },
  },
];

/** Negozi che accettano riparazioni (subset di STORES) */
export function listRepairStores(): Store[] {
  return STORES.filter((s) => s.services.repair);
}

/** Negozi che accettano usato per trade-in */
export function listTradeInStores(): Store[] {
  return STORES.filter((s) => s.services.tradeIn);
}

export function findStore(id: string): Store | null {
  return STORES.find((s) => s.id === id) ?? null;
}

/**
 * Calcolo distanza grossolana (Euclidean su lat/lng, va benissimo per
 * ordering — non serve Haversine per 4 negozi su scala nazionale).
 */
export function sortStoresByDistance(
  stores: Store[],
  userLat: number,
  userLng: number,
): Store[] {
  return [...stores].sort((a, b) => {
    const da = (a.lat - userLat) ** 2 + (a.lng - userLng) ** 2;
    const db = (b.lat - userLat) ** 2 + (b.lng - userLng) ** 2;
    return da - db;
  });
}
