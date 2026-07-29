/**
 * Negozi Fast-Fix — fonte unica per /negozi, /riparazioni, /rivendi
 * e ovunque serva uno store picker.
 *
 * Unica ditta: FAST-FIX di Sarker Srabon. Due sedi operative, entrambe a
 * San Benedetto del Tronto, sotto la stessa partita IVA.
 *
 * Quando il CRM esporrà /api/v1/public/stores questa lista resta come
 * fallback offline.
 */

/** Dati fiscali della ditta — unici per tutte le sedi */
export const COMPANY = {
  legalName: "FAST-FIX di Sarker Srabon",
  vatNumber: "01802850675",
  taxCode: "SRKSBN88S16Z249Q",
  /** Codice destinatario per la fatturazione elettronica */
  sdi: "KRRH6B9",
  /** Sede legale (coincide con la sede di Piazza Garibaldi) */
  registeredAddress: "Piazza G. Garibaldi 31, 63074 San Benedetto del Tronto (AP)",
  email: "info@fast-fix.it",
  pec: "fast-fix@pec.it",
} as const;

export type Store = {
  /** Slug univoco (kebab-case città-sede) */
  id: string;
  /** Nome visibile della sede */
  name: string;
  /** Insegna di riferimento — usata per badge UI */
  brand: "Fast-Fix";
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
  /** P.IVA della ditta */
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
    id: "fast-fix-garibaldi",
    name: "Fast-Fix Piazza Garibaldi",
    brand: "Fast-Fix",
    legalName: COMPANY.legalName,
    address: "Piazza G. Garibaldi 31",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "0735 501637",
    mobile: "+39 320 857 4006",
    email: COMPANY.email,
    pec: COMPANY.pec,
    vatNumber: COMPANY.vatNumber,
    lat: 42.9434,
    lng: 13.8814,
    hours: "Lun-Sab 9-13 / 15:30-19:30",
    services: { repair: true, tradeIn: true, pickup: true, walkin: true },
  },
  {
    id: "fast-fix-calatafimi",
    name: "Fast-Fix Via Calatafimi",
    brand: "Fast-Fix",
    legalName: COMPANY.legalName,
    address: "Via Calatafimi 52",
    cap: "63074",
    city: "San Benedetto del Tronto",
    province: "AP",
    region: "Marche",
    phone: "0735 501637",
    mobile: "+39 320 857 4006",
    email: COMPANY.email,
    pec: COMPANY.pec,
    vatNumber: COMPANY.vatNumber,
    lat: 42.9434,
    lng: 13.8770,
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
