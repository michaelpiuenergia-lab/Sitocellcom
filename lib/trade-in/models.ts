/**
 * Database modelli per stima trade-in.
 *
 * Catalogo: ~220 modelli smartphone dal 2015 al 2025, ordinati per brand+anno.
 * Prezzi "come nuovo" indicativi al mercato 2026 (incrociati con i listini
 * Swappie / BackMarket / Apple GiveBack / Samsung trade-in). Vanno tarati
 * ogni 3-4 mesi insieme al CRM perché il mercato dell'usato si muove veloce
 * (in particolare l'autunno sui flagship dopo il lancio della generazione +1).
 *
 * Quando il CRM esporrà /api/v1/public/trade-in/quote (vedi
 * docs/architecture/CRM-BRIEF-TRADE-IN.md §3.1), questa lista diventa fallback
 * offline; il calcolo passa al backend.
 *
 * Logica: prezzo base ("come nuovo", taglio minimo) × moltiplicatore condizione
 * + bonus taglio (€40 per ogni step sopra il taglio minimo). Range UI = ±10%.
 *
 * Brand non in lista (es. iQOO, ZTE, Doogee, Cubot) → opzione "Altro / non
 * in lista" nel calculator → valutazione manuale entro 24h del tecnico.
 */

export type TradeInCondition = "como-nuovo" | "buono" | "segni-uso";

export type TradeInModel = {
  id: string;
  brand: string;
  name: string;
  year: number;
  storage: number[];
  basePriceEur: number;
};

export const CONDITION_DESCRIPTIONS: Record<
  TradeInCondition,
  { label: string; short: string; long: string; multiplier: number }
> = {
  "como-nuovo": {
    label: "Come nuovo",
    short: "Zero graffi, schermo perfetto, scatola e accessori",
    long: "Telefono in condizioni impeccabili, nessun segno d'uso anche sotto luce diretta. Schermo senza graffi neanche minimi. Scocca integra. Batteria ≥90%. Funziona perfettamente. Idealmente con scatola originale e cavo.",
    multiplier: 1.0,
  },
  buono: {
    label: "Buono",
    short: "Graffi leggeri non visibili a 30cm, schermo intatto",
    long: "Qualche micro-graffio sulla scocca visibile solo con luce radente. Schermo senza graffi e senza zone morte. Tutte le funzioni operative. Batteria 80-89%.",
    multiplier: 0.78,
  },
  "segni-uso": {
    label: "Con segni d'uso",
    short: "Graffi evidenti, vetro scheggiato o batteria scarica",
    long: "Graffi profondi sulla scocca, ammaccature, micro-scheggiature sui bordi. Schermo può avere graffi superficiali. Funziona ma con segni evidenti. Batteria <80%. Niente schermi rotti né funzioni guaste.",
    multiplier: 0.55,
  },
};

/** Sentinel brand per modelli non in lista — free-text */
export const OTHER_BRAND_ID = "altro";

export const TRADE_IN_MODELS: TradeInModel[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // APPLE iPhone — 33 modelli (2015-2025)
  // ═════════════════════════════════════════════════════════════════════════
  // 2024 → linea 16 (rilasciata sett 2024)
  { id: "iphone-16-pro-max", brand: "Apple", name: "iPhone 16 Pro Max", year: 2024, storage: [256, 512, 1024], basePriceEur: 1080 },
  { id: "iphone-16-pro",     brand: "Apple", name: "iPhone 16 Pro",     year: 2024, storage: [128, 256, 512, 1024], basePriceEur: 900 },
  { id: "iphone-16-plus",    brand: "Apple", name: "iPhone 16 Plus",    year: 2024, storage: [128, 256, 512], basePriceEur: 760 },
  { id: "iphone-16",         brand: "Apple", name: "iPhone 16",         year: 2024, storage: [128, 256, 512], basePriceEur: 680 },
  { id: "iphone-16e",        brand: "Apple", name: "iPhone 16e",        year: 2025, storage: [128, 256, 512], basePriceEur: 580 },

  // 2023
  { id: "iphone-15-pro-max", brand: "Apple", name: "iPhone 15 Pro Max", year: 2023, storage: [256, 512, 1024], basePriceEur: 880 },
  { id: "iphone-15-pro",     brand: "Apple", name: "iPhone 15 Pro",     year: 2023, storage: [128, 256, 512, 1024], basePriceEur: 720 },
  { id: "iphone-15-plus",    brand: "Apple", name: "iPhone 15 Plus",    year: 2023, storage: [128, 256, 512], basePriceEur: 600 },
  { id: "iphone-15",         brand: "Apple", name: "iPhone 15",         year: 2023, storage: [128, 256, 512], basePriceEur: 540 },

  // 2022
  { id: "iphone-14-pro-max", brand: "Apple", name: "iPhone 14 Pro Max", year: 2022, storage: [128, 256, 512, 1024], basePriceEur: 700 },
  { id: "iphone-14-pro",     brand: "Apple", name: "iPhone 14 Pro",     year: 2022, storage: [128, 256, 512, 1024], basePriceEur: 580 },
  { id: "iphone-14-plus",    brand: "Apple", name: "iPhone 14 Plus",    year: 2022, storage: [128, 256, 512], basePriceEur: 480 },
  { id: "iphone-14",         brand: "Apple", name: "iPhone 14",         year: 2022, storage: [128, 256, 512], basePriceEur: 430 },
  { id: "iphone-se-3",       brand: "Apple", name: "iPhone SE (2022)",  year: 2022, storage: [64, 128, 256], basePriceEur: 180 },

  // 2021
  { id: "iphone-13-pro-max", brand: "Apple", name: "iPhone 13 Pro Max", year: 2021, storage: [128, 256, 512, 1024], basePriceEur: 540 },
  { id: "iphone-13-pro",     brand: "Apple", name: "iPhone 13 Pro",     year: 2021, storage: [128, 256, 512, 1024], basePriceEur: 450 },
  { id: "iphone-13",         brand: "Apple", name: "iPhone 13",         year: 2021, storage: [128, 256, 512], basePriceEur: 350 },
  { id: "iphone-13-mini",    brand: "Apple", name: "iPhone 13 mini",    year: 2021, storage: [128, 256, 512], basePriceEur: 310 },

  // 2020
  { id: "iphone-12-pro-max", brand: "Apple", name: "iPhone 12 Pro Max", year: 2020, storage: [128, 256, 512], basePriceEur: 380 },
  { id: "iphone-12-pro",     brand: "Apple", name: "iPhone 12 Pro",     year: 2020, storage: [128, 256, 512], basePriceEur: 320 },
  { id: "iphone-12",         brand: "Apple", name: "iPhone 12",         year: 2020, storage: [64, 128, 256], basePriceEur: 240 },
  { id: "iphone-12-mini",    brand: "Apple", name: "iPhone 12 mini",    year: 2020, storage: [64, 128, 256], basePriceEur: 200 },
  { id: "iphone-se-2",       brand: "Apple", name: "iPhone SE (2020)",  year: 2020, storage: [64, 128, 256], basePriceEur: 90 },

  // 2019
  { id: "iphone-11-pro-max", brand: "Apple", name: "iPhone 11 Pro Max", year: 2019, storage: [64, 256, 512], basePriceEur: 270 },
  { id: "iphone-11-pro",     brand: "Apple", name: "iPhone 11 Pro",     year: 2019, storage: [64, 256, 512], basePriceEur: 220 },
  { id: "iphone-11",         brand: "Apple", name: "iPhone 11",         year: 2019, storage: [64, 128, 256], basePriceEur: 170 },

  // 2018
  { id: "iphone-xs-max",     brand: "Apple", name: "iPhone XS Max",     year: 2018, storage: [64, 256, 512], basePriceEur: 160 },
  { id: "iphone-xs",         brand: "Apple", name: "iPhone XS",         year: 2018, storage: [64, 256, 512], basePriceEur: 130 },
  { id: "iphone-xr",         brand: "Apple", name: "iPhone XR",         year: 2018, storage: [64, 128, 256], basePriceEur: 110 },

  // 2017 e precedenti
  { id: "iphone-x",          brand: "Apple", name: "iPhone X",          year: 2017, storage: [64, 256], basePriceEur: 95 },
  { id: "iphone-8-plus",     brand: "Apple", name: "iPhone 8 Plus",     year: 2017, storage: [64, 128, 256], basePriceEur: 80 },
  { id: "iphone-8",          brand: "Apple", name: "iPhone 8",          year: 2017, storage: [64, 128, 256], basePriceEur: 60 },
  { id: "iphone-7-plus",     brand: "Apple", name: "iPhone 7 Plus",     year: 2016, storage: [32, 128, 256], basePriceEur: 55 },
  { id: "iphone-7",          brand: "Apple", name: "iPhone 7",          year: 2016, storage: [32, 128, 256], basePriceEur: 40 },
  { id: "iphone-se-1",       brand: "Apple", name: "iPhone SE (2016)",  year: 2016, storage: [16, 32, 64, 128], basePriceEur: 25 },
  { id: "iphone-6s-plus",    brand: "Apple", name: "iPhone 6s Plus",    year: 2015, storage: [32, 64, 128], basePriceEur: 35 },
  { id: "iphone-6s",         brand: "Apple", name: "iPhone 6s",         year: 2015, storage: [32, 64, 128], basePriceEur: 25 },

  // ═════════════════════════════════════════════════════════════════════════
  // SAMSUNG GALAXY S — 22 modelli (2017-2025)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "galaxy-s25-ultra", brand: "Samsung", name: "Galaxy S25 Ultra", year: 2025, storage: [256, 512, 1024], basePriceEur: 1020 },
  { id: "galaxy-s25-plus",  brand: "Samsung", name: "Galaxy S25+",      year: 2025, storage: [256, 512], basePriceEur: 760 },
  { id: "galaxy-s25",       brand: "Samsung", name: "Galaxy S25",       year: 2025, storage: [128, 256, 512], basePriceEur: 620 },
  { id: "galaxy-s24-ultra", brand: "Samsung", name: "Galaxy S24 Ultra", year: 2024, storage: [256, 512, 1024], basePriceEur: 820 },
  { id: "galaxy-s24-plus",  brand: "Samsung", name: "Galaxy S24+",      year: 2024, storage: [256, 512], basePriceEur: 600 },
  { id: "galaxy-s24",       brand: "Samsung", name: "Galaxy S24",       year: 2024, storage: [128, 256, 512], basePriceEur: 480 },
  { id: "galaxy-s24-fe",    brand: "Samsung", name: "Galaxy S24 FE",    year: 2024, storage: [128, 256, 512], basePriceEur: 380 },
  { id: "galaxy-s23-ultra", brand: "Samsung", name: "Galaxy S23 Ultra", year: 2023, storage: [256, 512, 1024], basePriceEur: 580 },
  { id: "galaxy-s23-plus",  brand: "Samsung", name: "Galaxy S23+",      year: 2023, storage: [256, 512], basePriceEur: 440 },
  { id: "galaxy-s23",       brand: "Samsung", name: "Galaxy S23",       year: 2023, storage: [128, 256, 512], basePriceEur: 360 },
  { id: "galaxy-s23-fe",    brand: "Samsung", name: "Galaxy S23 FE",    year: 2023, storage: [128, 256], basePriceEur: 260 },
  { id: "galaxy-s22-ultra", brand: "Samsung", name: "Galaxy S22 Ultra", year: 2022, storage: [128, 256, 512, 1024], basePriceEur: 380 },
  { id: "galaxy-s22-plus",  brand: "Samsung", name: "Galaxy S22+",      year: 2022, storage: [128, 256], basePriceEur: 280 },
  { id: "galaxy-s22",       brand: "Samsung", name: "Galaxy S22",       year: 2022, storage: [128, 256], basePriceEur: 240 },
  { id: "galaxy-s21-ultra", brand: "Samsung", name: "Galaxy S21 Ultra", year: 2021, storage: [128, 256, 512], basePriceEur: 280 },
  { id: "galaxy-s21-plus",  brand: "Samsung", name: "Galaxy S21+",      year: 2021, storage: [128, 256], basePriceEur: 200 },
  { id: "galaxy-s21",       brand: "Samsung", name: "Galaxy S21",       year: 2021, storage: [128, 256], basePriceEur: 170 },
  { id: "galaxy-s21-fe",    brand: "Samsung", name: "Galaxy S21 FE",    year: 2022, storage: [128, 256], basePriceEur: 160 },
  { id: "galaxy-s20-ultra", brand: "Samsung", name: "Galaxy S20 Ultra", year: 2020, storage: [128, 256, 512], basePriceEur: 200 },
  { id: "galaxy-s20-plus",  brand: "Samsung", name: "Galaxy S20+",      year: 2020, storage: [128, 256], basePriceEur: 150 },
  { id: "galaxy-s20",       brand: "Samsung", name: "Galaxy S20",       year: 2020, storage: [128, 256], basePriceEur: 130 },
  { id: "galaxy-s20-fe",    brand: "Samsung", name: "Galaxy S20 FE",    year: 2020, storage: [128, 256], basePriceEur: 120 },
  { id: "galaxy-s10-plus",  brand: "Samsung", name: "Galaxy S10+",      year: 2019, storage: [128, 512, 1024], basePriceEur: 130 },
  { id: "galaxy-s10",       brand: "Samsung", name: "Galaxy S10",       year: 2019, storage: [128, 512], basePriceEur: 110 },
  { id: "galaxy-s10e",      brand: "Samsung", name: "Galaxy S10e",      year: 2019, storage: [128, 256], basePriceEur: 90 },
  { id: "galaxy-s9-plus",   brand: "Samsung", name: "Galaxy S9+",       year: 2018, storage: [64, 128, 256], basePriceEur: 70 },
  { id: "galaxy-s9",        brand: "Samsung", name: "Galaxy S9",        year: 2018, storage: [64, 128, 256], basePriceEur: 50 },
  { id: "galaxy-s8-plus",   brand: "Samsung", name: "Galaxy S8+",       year: 2017, storage: [64, 128], basePriceEur: 40 },
  { id: "galaxy-s8",        brand: "Samsung", name: "Galaxy S8",        year: 2017, storage: [64, 128], basePriceEur: 30 },

  // ═════════════════════════════════════════════════════════════════════════
  // SAMSUNG Z FOLD / Z FLIP / NOTE — 14 modelli (2019-2024)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "galaxy-z-fold-6", brand: "Samsung", name: "Galaxy Z Fold6",  year: 2024, storage: [256, 512, 1024], basePriceEur: 1040 },
  { id: "galaxy-z-flip-6", brand: "Samsung", name: "Galaxy Z Flip6",  year: 2024, storage: [256, 512], basePriceEur: 640 },
  { id: "galaxy-z-fold-5", brand: "Samsung", name: "Galaxy Z Fold5",  year: 2023, storage: [256, 512, 1024], basePriceEur: 780 },
  { id: "galaxy-z-flip-5", brand: "Samsung", name: "Galaxy Z Flip5",  year: 2023, storage: [256, 512], basePriceEur: 460 },
  { id: "galaxy-z-fold-4", brand: "Samsung", name: "Galaxy Z Fold4",  year: 2022, storage: [256, 512, 1024], basePriceEur: 540 },
  { id: "galaxy-z-flip-4", brand: "Samsung", name: "Galaxy Z Flip4",  year: 2022, storage: [128, 256, 512], basePriceEur: 320 },
  { id: "galaxy-z-fold-3", brand: "Samsung", name: "Galaxy Z Fold3",  year: 2021, storage: [256, 512], basePriceEur: 360 },
  { id: "galaxy-z-flip-3", brand: "Samsung", name: "Galaxy Z Flip3",  year: 2021, storage: [128, 256], basePriceEur: 200 },
  { id: "galaxy-z-fold-2", brand: "Samsung", name: "Galaxy Z Fold2",  year: 2020, storage: [256, 512], basePriceEur: 240 },
  { id: "galaxy-note-20-ultra", brand: "Samsung", name: "Galaxy Note 20 Ultra", year: 2020, storage: [256, 512], basePriceEur: 240 },
  { id: "galaxy-note-20",       brand: "Samsung", name: "Galaxy Note 20",       year: 2020, storage: [256], basePriceEur: 180 },
  { id: "galaxy-note-10-plus",  brand: "Samsung", name: "Galaxy Note 10+",      year: 2019, storage: [256, 512], basePriceEur: 160 },
  { id: "galaxy-note-10",       brand: "Samsung", name: "Galaxy Note 10",       year: 2019, storage: [256], basePriceEur: 130 },
  { id: "galaxy-note-9",        brand: "Samsung", name: "Galaxy Note 9",        year: 2018, storage: [128, 512], basePriceEur: 90 },

  // ═════════════════════════════════════════════════════════════════════════
  // SAMSUNG GALAXY A — 12 modelli (mid-range gettonatissimi)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "galaxy-a55",   brand: "Samsung", name: "Galaxy A55 5G",   year: 2024, storage: [128, 256], basePriceEur: 220 },
  { id: "galaxy-a35",   brand: "Samsung", name: "Galaxy A35 5G",   year: 2024, storage: [128, 256], basePriceEur: 170 },
  { id: "galaxy-a25",   brand: "Samsung", name: "Galaxy A25 5G",   year: 2024, storage: [128, 256], basePriceEur: 130 },
  { id: "galaxy-a15",   brand: "Samsung", name: "Galaxy A15 5G",   year: 2024, storage: [128, 256], basePriceEur: 110 },
  { id: "galaxy-a54",   brand: "Samsung", name: "Galaxy A54 5G",   year: 2023, storage: [128, 256], basePriceEur: 180 },
  { id: "galaxy-a34",   brand: "Samsung", name: "Galaxy A34 5G",   year: 2023, storage: [128, 256], basePriceEur: 140 },
  { id: "galaxy-a14",   brand: "Samsung", name: "Galaxy A14",      year: 2023, storage: [64, 128], basePriceEur: 80 },
  { id: "galaxy-a53",   brand: "Samsung", name: "Galaxy A53 5G",   year: 2022, storage: [128, 256], basePriceEur: 130 },
  { id: "galaxy-a33",   brand: "Samsung", name: "Galaxy A33 5G",   year: 2022, storage: [128], basePriceEur: 100 },
  { id: "galaxy-a13",   brand: "Samsung", name: "Galaxy A13",      year: 2022, storage: [64, 128], basePriceEur: 60 },
  { id: "galaxy-a52",   brand: "Samsung", name: "Galaxy A52",      year: 2021, storage: [128, 256], basePriceEur: 90 },
  { id: "galaxy-a32",   brand: "Samsung", name: "Galaxy A32",      year: 2021, storage: [64, 128], basePriceEur: 70 },

  // ═════════════════════════════════════════════════════════════════════════
  // GOOGLE PIXEL — 17 modelli (2018-2025)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "pixel-9-pro-fold", brand: "Google", name: "Pixel 9 Pro Fold", year: 2024, storage: [256, 512], basePriceEur: 1180 },
  { id: "pixel-9-pro-xl",   brand: "Google", name: "Pixel 9 Pro XL",   year: 2024, storage: [128, 256, 512, 1024], basePriceEur: 780 },
  { id: "pixel-9-pro",      brand: "Google", name: "Pixel 9 Pro",      year: 2024, storage: [128, 256, 512, 1024], basePriceEur: 680 },
  { id: "pixel-9",          brand: "Google", name: "Pixel 9",          year: 2024, storage: [128, 256], basePriceEur: 580 },
  { id: "pixel-fold",       brand: "Google", name: "Pixel Fold",       year: 2023, storage: [256, 512], basePriceEur: 760 },
  { id: "pixel-8-pro",      brand: "Google", name: "Pixel 8 Pro",      year: 2023, storage: [128, 256, 512, 1024], basePriceEur: 540 },
  { id: "pixel-8",          brand: "Google", name: "Pixel 8",          year: 2023, storage: [128, 256], basePriceEur: 400 },
  { id: "pixel-8a",         brand: "Google", name: "Pixel 8a",         year: 2024, storage: [128, 256], basePriceEur: 320 },
  { id: "pixel-7-pro",      brand: "Google", name: "Pixel 7 Pro",      year: 2022, storage: [128, 256, 512], basePriceEur: 320 },
  { id: "pixel-7",          brand: "Google", name: "Pixel 7",          year: 2022, storage: [128, 256], basePriceEur: 240 },
  { id: "pixel-7a",         brand: "Google", name: "Pixel 7a",         year: 2023, storage: [128], basePriceEur: 220 },
  { id: "pixel-6-pro",      brand: "Google", name: "Pixel 6 Pro",      year: 2021, storage: [128, 256, 512], basePriceEur: 200 },
  { id: "pixel-6",          brand: "Google", name: "Pixel 6",          year: 2021, storage: [128, 256], basePriceEur: 160 },
  { id: "pixel-6a",         brand: "Google", name: "Pixel 6a",         year: 2022, storage: [128], basePriceEur: 130 },
  { id: "pixel-5",          brand: "Google", name: "Pixel 5",          year: 2020, storage: [128], basePriceEur: 130 },
  { id: "pixel-4-xl",       brand: "Google", name: "Pixel 4 XL",       year: 2019, storage: [64, 128], basePriceEur: 80 },
  { id: "pixel-4",          brand: "Google", name: "Pixel 4",          year: 2019, storage: [64, 128], basePriceEur: 60 },
  { id: "pixel-3-xl",       brand: "Google", name: "Pixel 3 XL",       year: 2018, storage: [64, 128], basePriceEur: 50 },

  // ═════════════════════════════════════════════════════════════════════════
  // XIAOMI + REDMI + POCO — 32 modelli (2021-2025)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "xiaomi-15-ultra",   brand: "Xiaomi", name: "Xiaomi 15 Ultra",   year: 2025, storage: [256, 512, 1024], basePriceEur: 920 },
  { id: "xiaomi-15-pro",     brand: "Xiaomi", name: "Xiaomi 15 Pro",     year: 2024, storage: [256, 512, 1024], basePriceEur: 720 },
  { id: "xiaomi-15",         brand: "Xiaomi", name: "Xiaomi 15",         year: 2024, storage: [256, 512], basePriceEur: 600 },
  { id: "xiaomi-14-ultra",   brand: "Xiaomi", name: "Xiaomi 14 Ultra",   year: 2024, storage: [256, 512, 1024], basePriceEur: 720 },
  { id: "xiaomi-14t-pro",    brand: "Xiaomi", name: "Xiaomi 14T Pro",    year: 2024, storage: [256, 512, 1024], basePriceEur: 420 },
  { id: "xiaomi-14t",        brand: "Xiaomi", name: "Xiaomi 14T",        year: 2024, storage: [256, 512], basePriceEur: 320 },
  { id: "xiaomi-14",         brand: "Xiaomi", name: "Xiaomi 14",         year: 2023, storage: [256, 512], basePriceEur: 460 },
  { id: "xiaomi-mix-fold-3", brand: "Xiaomi", name: "Mix Fold 3",        year: 2023, storage: [256, 512, 1024], basePriceEur: 880 },
  { id: "xiaomi-13-ultra",   brand: "Xiaomi", name: "Xiaomi 13 Ultra",   year: 2023, storage: [256, 512, 1024], basePriceEur: 520 },
  { id: "xiaomi-13-pro",     brand: "Xiaomi", name: "Xiaomi 13 Pro",     year: 2023, storage: [256, 512], basePriceEur: 360 },
  { id: "xiaomi-13",         brand: "Xiaomi", name: "Xiaomi 13",         year: 2023, storage: [128, 256, 512], basePriceEur: 290 },
  { id: "xiaomi-13t-pro",    brand: "Xiaomi", name: "Xiaomi 13T Pro",    year: 2023, storage: [256, 512, 1024], basePriceEur: 330 },
  { id: "xiaomi-12-pro",     brand: "Xiaomi", name: "Xiaomi 12 Pro",     year: 2022, storage: [128, 256], basePriceEur: 240 },
  { id: "xiaomi-12",         brand: "Xiaomi", name: "Xiaomi 12",         year: 2022, storage: [128, 256], basePriceEur: 180 },
  { id: "xiaomi-12t-pro",    brand: "Xiaomi", name: "Xiaomi 12T Pro",    year: 2022, storage: [128, 256], basePriceEur: 230 },
  { id: "xiaomi-11t-pro",    brand: "Xiaomi", name: "Xiaomi 11T Pro",    year: 2021, storage: [128, 256], basePriceEur: 160 },
  { id: "redmi-note-14-pro-plus", brand: "Xiaomi", name: "Redmi Note 14 Pro+", year: 2024, storage: [256, 512], basePriceEur: 220 },
  { id: "redmi-note-14-pro", brand: "Xiaomi", name: "Redmi Note 14 Pro", year: 2024, storage: [128, 256, 512], basePriceEur: 160 },
  { id: "redmi-note-14",     brand: "Xiaomi", name: "Redmi Note 14",     year: 2024, storage: [128, 256], basePriceEur: 110 },
  { id: "redmi-note-13-pro-plus", brand: "Xiaomi", name: "Redmi Note 13 Pro+", year: 2024, storage: [256, 512], basePriceEur: 180 },
  { id: "redmi-note-13-pro", brand: "Xiaomi", name: "Redmi Note 13 Pro", year: 2024, storage: [128, 256, 512], basePriceEur: 140 },
  { id: "redmi-note-13",     brand: "Xiaomi", name: "Redmi Note 13",     year: 2024, storage: [128, 256], basePriceEur: 90 },
  { id: "redmi-note-12-pro-plus", brand: "Xiaomi", name: "Redmi Note 12 Pro+", year: 2023, storage: [256], basePriceEur: 150 },
  { id: "redmi-note-12-pro", brand: "Xiaomi", name: "Redmi Note 12 Pro", year: 2023, storage: [128, 256], basePriceEur: 110 },
  { id: "redmi-note-12",     brand: "Xiaomi", name: "Redmi Note 12",     year: 2023, storage: [128, 256], basePriceEur: 80 },
  { id: "redmi-note-11-pro", brand: "Xiaomi", name: "Redmi Note 11 Pro", year: 2022, storage: [128, 256], basePriceEur: 80 },
  { id: "redmi-note-11",     brand: "Xiaomi", name: "Redmi Note 11",     year: 2022, storage: [64, 128], basePriceEur: 55 },
  { id: "poco-f6-pro",       brand: "Xiaomi", name: "POCO F6 Pro",       year: 2024, storage: [256, 512, 1024], basePriceEur: 320 },
  { id: "poco-f6",           brand: "Xiaomi", name: "POCO F6",           year: 2024, storage: [256, 512], basePriceEur: 240 },
  { id: "poco-x6-pro",       brand: "Xiaomi", name: "POCO X6 Pro",       year: 2024, storage: [256, 512], basePriceEur: 200 },
  { id: "poco-x6",           brand: "Xiaomi", name: "POCO X6",           year: 2024, storage: [256, 512], basePriceEur: 160 },
  { id: "poco-f5",           brand: "Xiaomi", name: "POCO F5",           year: 2023, storage: [256], basePriceEur: 180 },

  // ═════════════════════════════════════════════════════════════════════════
  // OPPO — 13 modelli (2022-2025) — assenti dalla v1, brand importante in IT
  // ═════════════════════════════════════════════════════════════════════════
  { id: "oppo-find-n5",     brand: "Oppo", name: "Find N5",      year: 2025, storage: [256, 512, 1024], basePriceEur: 1300 },
  { id: "oppo-find-x8-pro", brand: "Oppo", name: "Find X8 Pro",  year: 2024, storage: [256, 512, 1024], basePriceEur: 720 },
  { id: "oppo-find-x8",     brand: "Oppo", name: "Find X8",      year: 2024, storage: [256, 512], basePriceEur: 540 },
  { id: "oppo-find-x7-ultra", brand: "Oppo", name: "Find X7 Ultra", year: 2024, storage: [256, 512, 1024], basePriceEur: 640 },
  { id: "oppo-find-x7",     brand: "Oppo", name: "Find X7",      year: 2024, storage: [256, 512], basePriceEur: 460 },
  { id: "oppo-find-n3",     brand: "Oppo", name: "Find N3",      year: 2023, storage: [512, 1024], basePriceEur: 820 },
  { id: "oppo-find-n3-flip",brand: "Oppo", name: "Find N3 Flip", year: 2023, storage: [256], basePriceEur: 540 },
  { id: "oppo-find-x6-pro", brand: "Oppo", name: "Find X6 Pro",  year: 2023, storage: [256, 512], basePriceEur: 440 },
  { id: "oppo-find-x5-pro", brand: "Oppo", name: "Find X5 Pro",  year: 2022, storage: [256, 512], basePriceEur: 300 },
  { id: "oppo-reno-12-pro", brand: "Oppo", name: "Reno 12 Pro",  year: 2024, storage: [256, 512], basePriceEur: 320 },
  { id: "oppo-reno-12",     brand: "Oppo", name: "Reno 12",      year: 2024, storage: [256, 512], basePriceEur: 260 },
  { id: "oppo-reno-11-pro", brand: "Oppo", name: "Reno 11 Pro",  year: 2024, storage: [256, 512], basePriceEur: 240 },
  { id: "oppo-reno-10-pro", brand: "Oppo", name: "Reno 10 Pro",  year: 2023, storage: [256], basePriceEur: 200 },
  { id: "oppo-reno-8-pro",  brand: "Oppo", name: "Reno 8 Pro",   year: 2022, storage: [256], basePriceEur: 150 },

  // ═════════════════════════════════════════════════════════════════════════
  // VIVO — 11 modelli (2022-2025) — assenti dalla v1
  // ═════════════════════════════════════════════════════════════════════════
  { id: "vivo-x200-pro",  brand: "Vivo", name: "X200 Pro",  year: 2024, storage: [256, 512, 1024], basePriceEur: 720 },
  { id: "vivo-x200",      brand: "Vivo", name: "X200",      year: 2024, storage: [256, 512], basePriceEur: 540 },
  { id: "vivo-x100-ultra",brand: "Vivo", name: "X100 Ultra",year: 2024, storage: [512, 1024], basePriceEur: 760 },
  { id: "vivo-x100-pro",  brand: "Vivo", name: "X100 Pro",  year: 2024, storage: [256, 512], basePriceEur: 580 },
  { id: "vivo-x100",      brand: "Vivo", name: "X100",      year: 2024, storage: [256, 512], basePriceEur: 460 },
  { id: "vivo-x90-pro",   brand: "Vivo", name: "X90 Pro",   year: 2023, storage: [256, 512], basePriceEur: 380 },
  { id: "vivo-x90",       brand: "Vivo", name: "X90",       year: 2023, storage: [128, 256], basePriceEur: 280 },
  { id: "vivo-x80-pro",   brand: "Vivo", name: "X80 Pro",   year: 2022, storage: [256, 512], basePriceEur: 280 },
  { id: "vivo-v40-pro",   brand: "Vivo", name: "V40 Pro",   year: 2024, storage: [256, 512], basePriceEur: 320 },
  { id: "vivo-v30-pro",   brand: "Vivo", name: "V30 Pro",   year: 2024, storage: [256, 512], basePriceEur: 280 },
  { id: "vivo-v29-pro",   brand: "Vivo", name: "V29 Pro",   year: 2023, storage: [256, 512], basePriceEur: 220 },

  // ═════════════════════════════════════════════════════════════════════════
  // ONEPLUS — 16 modelli (2019-2025)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "oneplus-13",        brand: "OnePlus", name: "OnePlus 13",        year: 2025, storage: [256, 512, 1024], basePriceEur: 680 },
  { id: "oneplus-13r",       brand: "OnePlus", name: "OnePlus 13R",       year: 2025, storage: [256, 512], basePriceEur: 460 },
  { id: "oneplus-12",        brand: "OnePlus", name: "OnePlus 12",        year: 2024, storage: [256, 512], basePriceEur: 500 },
  { id: "oneplus-12r",       brand: "OnePlus", name: "OnePlus 12R",       year: 2024, storage: [128, 256], basePriceEur: 340 },
  { id: "oneplus-11",        brand: "OnePlus", name: "OnePlus 11",        year: 2023, storage: [128, 256], basePriceEur: 340 },
  { id: "oneplus-10-pro",    brand: "OnePlus", name: "OnePlus 10 Pro",    year: 2022, storage: [128, 256, 512], basePriceEur: 260 },
  { id: "oneplus-10t",       brand: "OnePlus", name: "OnePlus 10T",       year: 2022, storage: [128, 256], basePriceEur: 220 },
  { id: "oneplus-9-pro",     brand: "OnePlus", name: "OnePlus 9 Pro",     year: 2021, storage: [128, 256], basePriceEur: 180 },
  { id: "oneplus-9",         brand: "OnePlus", name: "OnePlus 9",         year: 2021, storage: [128, 256], basePriceEur: 150 },
  { id: "oneplus-8-pro",     brand: "OnePlus", name: "OnePlus 8 Pro",     year: 2020, storage: [128, 256], basePriceEur: 130 },
  { id: "oneplus-8",         brand: "OnePlus", name: "OnePlus 8",         year: 2020, storage: [128, 256], basePriceEur: 100 },
  { id: "oneplus-7-pro",     brand: "OnePlus", name: "OnePlus 7 Pro",     year: 2019, storage: [128, 256], basePriceEur: 80 },
  { id: "oneplus-nord-4",    brand: "OnePlus", name: "OnePlus Nord 4",    year: 2024, storage: [256, 512], basePriceEur: 280 },
  { id: "oneplus-nord-3",    brand: "OnePlus", name: "OnePlus Nord 3",    year: 2023, storage: [128, 256], basePriceEur: 180 },
  { id: "oneplus-nord-ce-3", brand: "OnePlus", name: "OnePlus Nord CE 3", year: 2023, storage: [128, 256], basePriceEur: 130 },
  { id: "oneplus-nord-2",    brand: "OnePlus", name: "OnePlus Nord 2",    year: 2021, storage: [128, 256], basePriceEur: 110 },

  // ═════════════════════════════════════════════════════════════════════════
  // HUAWEI — 13 modelli (no Google Services dal 2019)
  // ═════════════════════════════════════════════════════════════════════════
  { id: "huawei-pura-70-ultra",brand: "Huawei", name: "Pura 70 Ultra",year: 2024, storage: [512, 1024], basePriceEur: 540 },
  { id: "huawei-pura-70-pro", brand: "Huawei", name: "Pura 70 Pro",   year: 2024, storage: [256, 512], basePriceEur: 420 },
  { id: "huawei-pura-70",     brand: "Huawei", name: "Pura 70",       year: 2024, storage: [256, 512], basePriceEur: 340 },
  { id: "huawei-mate-x5",     brand: "Huawei", name: "Mate X5",       year: 2023, storage: [256, 512, 1024], basePriceEur: 820 },
  { id: "huawei-p60-pro",     brand: "Huawei", name: "P60 Pro",       year: 2023, storage: [256, 512], basePriceEur: 380 },
  { id: "huawei-p60",         brand: "Huawei", name: "P60",           year: 2023, storage: [128, 256], basePriceEur: 300 },
  { id: "huawei-p50-pro",     brand: "Huawei", name: "P50 Pro",       year: 2021, storage: [128, 256, 512], basePriceEur: 240 },
  { id: "huawei-p40-pro",     brand: "Huawei", name: "P40 Pro",       year: 2020, storage: [256, 512], basePriceEur: 180 },
  { id: "huawei-p40",         brand: "Huawei", name: "P40",           year: 2020, storage: [128, 256], basePriceEur: 130 },
  { id: "huawei-p30-pro",     brand: "Huawei", name: "P30 Pro",       year: 2019, storage: [128, 256, 512], basePriceEur: 120 },
  { id: "huawei-p30",         brand: "Huawei", name: "P30",           year: 2019, storage: [64, 128], basePriceEur: 80 },
  { id: "huawei-mate-50-pro", brand: "Huawei", name: "Mate 50 Pro",   year: 2022, storage: [256, 512], basePriceEur: 280 },
  { id: "huawei-mate-40-pro", brand: "Huawei", name: "Mate 40 Pro",   year: 2020, storage: [256, 512], basePriceEur: 200 },
  { id: "huawei-mate-30-pro", brand: "Huawei", name: "Mate 30 Pro",   year: 2019, storage: [256, 512], basePriceEur: 150 },
  { id: "huawei-mate-20-pro", brand: "Huawei", name: "Mate 20 Pro",   year: 2018, storage: [128, 256], basePriceEur: 90 },

  // ═════════════════════════════════════════════════════════════════════════
  // HONOR — 11 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "honor-magic-7-pro",  brand: "Honor", name: "Magic 7 Pro",  year: 2025, storage: [256, 512, 1024], basePriceEur: 740 },
  { id: "honor-magic-v3",     brand: "Honor", name: "Magic V3",     year: 2024, storage: [512, 1024], basePriceEur: 1180 },
  { id: "honor-magic-v2",     brand: "Honor", name: "Magic V2",     year: 2023, storage: [256, 512, 1024], basePriceEur: 740 },
  { id: "honor-magic-6-pro",  brand: "Honor", name: "Magic 6 Pro",  year: 2024, storage: [256, 512], basePriceEur: 580 },
  { id: "honor-magic-5-pro",  brand: "Honor", name: "Magic 5 Pro",  year: 2023, storage: [256, 512], basePriceEur: 380 },
  { id: "honor-200-pro",      brand: "Honor", name: "Honor 200 Pro",year: 2024, storage: [256, 512], basePriceEur: 380 },
  { id: "honor-200",          brand: "Honor", name: "Honor 200",    year: 2024, storage: [256, 512], basePriceEur: 280 },
  { id: "honor-100-pro",      brand: "Honor", name: "Honor 100 Pro",year: 2023, storage: [256, 512], basePriceEur: 280 },
  { id: "honor-90",           brand: "Honor", name: "Honor 90",     year: 2023, storage: [256, 512], basePriceEur: 200 },
  { id: "honor-70",           brand: "Honor", name: "Honor 70",     year: 2022, storage: [128, 256], basePriceEur: 140 },
  { id: "honor-50",           brand: "Honor", name: "Honor 50",     year: 2021, storage: [128, 256], basePriceEur: 110 },

  // ═════════════════════════════════════════════════════════════════════════
  // REALME — 9 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "realme-gt-7-pro",   brand: "Realme", name: "GT 7 Pro",     year: 2024, storage: [256, 512], basePriceEur: 440 },
  { id: "realme-gt-6",       brand: "Realme", name: "GT 6",         year: 2024, storage: [256, 512], basePriceEur: 340 },
  { id: "realme-gt-5-pro",   brand: "Realme", name: "GT 5 Pro",     year: 2024, storage: [256, 512], basePriceEur: 380 },
  { id: "realme-gt-3",       brand: "Realme", name: "GT 3",         year: 2023, storage: [256, 512], basePriceEur: 230 },
  { id: "realme-12-pro-plus",brand: "Realme", name: "12 Pro+",      year: 2024, storage: [256, 512], basePriceEur: 260 },
  { id: "realme-11-pro-plus",brand: "Realme", name: "11 Pro+",      year: 2023, storage: [256, 512], basePriceEur: 200 },
  { id: "realme-11-pro",     brand: "Realme", name: "11 Pro",       year: 2023, storage: [128, 256], basePriceEur: 160 },
  { id: "realme-10-pro-plus",brand: "Realme", name: "10 Pro+",      year: 2023, storage: [128, 256], basePriceEur: 150 },
  { id: "realme-9-pro-plus", brand: "Realme", name: "9 Pro+",       year: 2022, storage: [128, 256], basePriceEur: 110 },

  // ═════════════════════════════════════════════════════════════════════════
  // MOTOROLA — 11 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "moto-edge-50-ultra",brand: "Motorola", name: "Edge 50 Ultra",   year: 2024, storage: [512, 1024], basePriceEur: 540 },
  { id: "moto-edge-50-pro",  brand: "Motorola", name: "Edge 50 Pro",     year: 2024, storage: [256, 512], basePriceEur: 380 },
  { id: "moto-edge-50",      brand: "Motorola", name: "Edge 50",         year: 2024, storage: [256, 512], basePriceEur: 280 },
  { id: "moto-edge-40-pro",  brand: "Motorola", name: "Edge 40 Pro",     year: 2023, storage: [256], basePriceEur: 280 },
  { id: "moto-edge-30-ultra",brand: "Motorola", name: "Edge 30 Ultra",   year: 2022, storage: [128, 256, 512], basePriceEur: 200 },
  { id: "moto-edge-30",      brand: "Motorola", name: "Edge 30",         year: 2022, storage: [128, 256], basePriceEur: 130 },
  { id: "moto-razr-50-ultra",brand: "Motorola", name: "Razr 50 Ultra",   year: 2024, storage: [256, 512, 1024], basePriceEur: 580 },
  { id: "moto-razr-50",      brand: "Motorola", name: "Razr 50",         year: 2024, storage: [256], basePriceEur: 380 },
  { id: "moto-razr-40-ultra",brand: "Motorola", name: "Razr 40 Ultra",   year: 2023, storage: [256, 512], basePriceEur: 380 },
  { id: "moto-razr-40",      brand: "Motorola", name: "Razr 40",         year: 2023, storage: [256], basePriceEur: 280 },
  { id: "moto-g85",          brand: "Motorola", name: "Moto G85",        year: 2024, storage: [128, 256], basePriceEur: 140 },
  { id: "moto-g84",          brand: "Motorola", name: "Moto G84",        year: 2023, storage: [128, 256], basePriceEur: 110 },
  { id: "moto-g54",          brand: "Motorola", name: "Moto G54",        year: 2023, storage: [128, 256], basePriceEur: 100 },

  // ═════════════════════════════════════════════════════════════════════════
  // NOTHING — 5 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "nothing-phone-3a-pro", brand: "Nothing", name: "Phone (3a) Pro", year: 2025, storage: [256, 512], basePriceEur: 360 },
  { id: "nothing-phone-3a",     brand: "Nothing", name: "Phone (3a)",     year: 2025, storage: [128, 256], basePriceEur: 260 },
  { id: "nothing-phone-2a-plus",brand: "Nothing", name: "Phone (2a) Plus",year: 2024, storage: [256, 512], basePriceEur: 280 },
  { id: "nothing-phone-2a",     brand: "Nothing", name: "Phone (2a)",     year: 2024, storage: [128, 256], basePriceEur: 220 },
  { id: "nothing-phone-2",      brand: "Nothing", name: "Phone (2)",      year: 2023, storage: [128, 256, 512], basePriceEur: 320 },
  { id: "nothing-phone-1",      brand: "Nothing", name: "Phone (1)",      year: 2022, storage: [128, 256], basePriceEur: 180 },

  // ═════════════════════════════════════════════════════════════════════════
  // SONY XPERIA — 7 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "sony-xperia-1-vi",  brand: "Sony", name: "Xperia 1 VI",  year: 2024, storage: [256, 512], basePriceEur: 720 },
  { id: "sony-xperia-10-vi", brand: "Sony", name: "Xperia 10 VI", year: 2024, storage: [128], basePriceEur: 240 },
  { id: "sony-xperia-1-v",   brand: "Sony", name: "Xperia 1 V",   year: 2023, storage: [256, 512], basePriceEur: 540 },
  { id: "sony-xperia-5-v",   brand: "Sony", name: "Xperia 5 V",   year: 2023, storage: [128, 256], basePriceEur: 380 },
  { id: "sony-xperia-1-iv",  brand: "Sony", name: "Xperia 1 IV",  year: 2022, storage: [256, 512], basePriceEur: 360 },
  { id: "sony-xperia-5-iv",  brand: "Sony", name: "Xperia 5 IV",  year: 2022, storage: [128, 256], basePriceEur: 280 },
  { id: "sony-xperia-1-iii", brand: "Sony", name: "Xperia 1 III", year: 2021, storage: [256, 512], basePriceEur: 240 },

  // ═════════════════════════════════════════════════════════════════════════
  // ASUS — 5 modelli
  // ═════════════════════════════════════════════════════════════════════════
  { id: "asus-rog-9-pro",      brand: "Asus", name: "ROG Phone 9 Pro",    year: 2024, storage: [512, 1024], basePriceEur: 880 },
  { id: "asus-rog-8-pro",      brand: "Asus", name: "ROG Phone 8 Pro",    year: 2024, storage: [512, 1024], basePriceEur: 680 },
  { id: "asus-rog-7",          brand: "Asus", name: "ROG Phone 7",        year: 2023, storage: [256, 512], basePriceEur: 420 },
  { id: "asus-zenfone-11-ultra", brand: "Asus", name: "Zenfone 11 Ultra", year: 2024, storage: [256, 512], basePriceEur: 520 },
  { id: "asus-zenfone-10",     brand: "Asus", name: "Zenfone 10",         year: 2023, storage: [128, 256, 512], basePriceEur: 360 },
];

/** Restituisce i brand unici nell'ordine alfabetico, eccetto Apple in cima. */
export function listBrands(): string[] {
  const brands = Array.from(new Set(TRADE_IN_MODELS.map((m) => m.brand)));
  return brands.sort((a, b) => {
    if (a === "Apple") return -1;
    if (b === "Apple") return 1;
    return a.localeCompare(b);
  });
}

/** Modelli di un brand, ordinati per anno desc poi alfabetico. */
export function listModelsByBrand(brand: string): TradeInModel[] {
  return TRADE_IN_MODELS.filter((m) => m.brand === brand).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.name.localeCompare(b.name);
  });
}

export function findModel(id: string): TradeInModel | null {
  return TRADE_IN_MODELS.find((m) => m.id === id) ?? null;
}

export type Estimate = {
  centerEur: number;
  minEur: number;
  maxEur: number;
};

export function estimatePrice(
  model: TradeInModel,
  storageGb: number,
  condition: TradeInCondition,
): Estimate {
  const conditionMult = CONDITION_DESCRIPTIONS[condition].multiplier;
  const storageIdx = model.storage.indexOf(storageGb);
  const storageBonus = storageIdx > 0 ? storageIdx * 40 : 0;

  const centerEur = Math.round(model.basePriceEur * conditionMult + storageBonus);
  return {
    centerEur,
    minEur: Math.round(centerEur * 0.9),
    maxEur: Math.round(centerEur * 1.1),
  };
}
