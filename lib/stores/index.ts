/**
 * Negozi del Gruppo Cellcom — fonte unica per /negozi, /riparazioni, /rivendi
 * e ovunque serva uno store picker.
 *
 * Dati estratti dai brief contatti aziendali (CELLCOM_Contatti srls ditta,
 * FastFix_Contatti per dati ditta — Desktop/integrazione cellcom). Due sedi
 * reali, entrambe a San Benedetto del Tronto.
 *
 * Quando il CRM esporrà /api/v1/public/stores questa lista resta come
 * fallback offline.
 */

export type Store = {
  /** Slug univoco (kebab-case città-brand) */
  id: string;
  /** Nome visibile, include brand quando rilevante */
  name: string;
  /** Brand di riferimento — usato per badge UI */
  brand: "Cellcom" | "Fast-Fix";
  /** Ragione sociale completa (per fatturazione e legal) */
  legalName: string;
  address: string;
  cap: string;
  city: string;
  /** Provincia (sigla 2 caratteri) */
  province: string;
  region: string;
  phone: string;
  /** Cellulare/WhatsApp se distinto dal fisso */
  mobile: string | null;
  email: string;
  pec: string | null;
  /** P.IVA / C.F. */
  vatNumber: string | null;
  /** Coordinate per Leaflet map — entrambe in San Benedetto del Tronto */
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
    id: "cellcom-san-benedetto",
    name: "Cellcom San Benedetto",
    brand: "Cellcom",
    legalName: "CELLCOM SRLS",
    address: "Via Calatafimi 52",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "+39 344 455 5678",
    mobile: null,
    email: "info@cellcom.it",
    pec: "cellcom25@pec.it",
    vatNumber: "02576350447",
    lat: 42.9434,
    lng: 13.8770,
    hours: "Lun-Sab 9-13 / 15:30-19:30",
    services: { repair: true, tradeIn: true, pickup: true, walkin: true },
  },
  {
    id: "fast-fix-san-benedetto",
    name: "Fast-Fix Assistenza San Benedetto",
    brand: "Fast-Fix",
    legalName: "FAST-FIX di Sarker Srabon",
    address: "Piazza G. Garibaldi 31",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "0735 501637",
    mobile: "+39 320 857 4006",
    email: "info@fast-fix.it",
    pec: "fast-fix@pec.it",
    vatNumber: null,
    lat: 42.9434,
    lng: 13.8814,
    hours: "Lun-Sab 9-13 / 15:30-19:30",
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
 * Calcolo distanza grossolana (Euclidean su lat/lng) — sufficiente per
 * ordering con pochi negozi sulla stessa città.
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
