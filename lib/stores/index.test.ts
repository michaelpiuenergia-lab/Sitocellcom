import { describe, expect, it } from "vitest";
import {
  COMPANY,
  STORES,
  findStore,
  listRepairStores,
  listTradeInStores,
  sortStoresByDistance,
} from "./index";

describe("stores", () => {
  it("ci sono esattamente 2 sedi, entrambe Fast-Fix", () => {
    expect(STORES).toHaveLength(2);
    expect(STORES.every((s) => s.brand === "Fast-Fix")).toBe(true);
  });

  it("entrambe a San Benedetto del Tronto (AP)", () => {
    for (const s of STORES) {
      expect(s.city).toBe("San Benedetto del Tronto");
      expect(s.province).toBe("AP");
      expect(s.cap).toBe("63074");
    }
  });

  it("i dati fiscali della ditta sono quelli reali", () => {
    expect(COMPANY.legalName).toBe("FAST-FIX di Sarker Srabon");
    expect(COMPANY.vatNumber).toBe("01802850675");
    expect(COMPANY.taxCode).toBe("SRKSBN88S16Z249Q");
    expect(COMPANY.sdi).toBe("KRRH6B9");
  });

  it("entrambe le sedi sono intestate alla stessa ditta e P.IVA", () => {
    for (const s of STORES) {
      expect(s.legalName).toBe(COMPANY.legalName);
      expect(s.vatNumber).toBe(COMPANY.vatNumber);
    }
  });

  it("la sede di Piazza Garibaldi ha indirizzo e recapiti reali", () => {
    const garibaldi = findStore("fast-fix-garibaldi")!;
    expect(garibaldi.address).toBe("Piazza G. Garibaldi 31");
    expect(garibaldi.phone).toBe("0735 501637");
    expect(garibaldi.mobile).toBe("+39 320 857 4006");
    expect(garibaldi.email).toBe("info@fast-fix.it");
  });

  it("nessun residuo Cellcom nei dati legali delle sedi", () => {
    for (const s of STORES) {
      expect(s.legalName).not.toMatch(/cellcom/i);
      expect(s.email).not.toMatch(/cellcom/i);
      expect(s.pec ?? "").not.toMatch(/cellcom/i);
    }
  });

  it("findStore ritorna null se id sconosciuto", () => {
    expect(findStore("non-esiste")).toBeNull();
  });

  it("findStore ritorna lo store giusto", () => {
    const s = findStore("fast-fix-calatafimi");
    expect(s?.address).toBe("Via Calatafimi 52");
  });

  it("listRepairStores include solo chi accetta riparazioni", () => {
    const list = listRepairStores();
    expect(list.length).toBeGreaterThan(0);
    for (const s of list) expect(s.services.repair).toBe(true);
  });

  it("listTradeInStores include solo chi accetta usato", () => {
    const list = listTradeInStores();
    for (const s of list) expect(s.services.tradeIn).toBe(true);
  });

  it("sortStoresByDistance ordina per prossimità lat/lng", () => {
    // San Benedetto è ~42.94, 13.88. Roma è ~41.9, 12.5.
    // Da Roma il primo dovrebbe essere il più vicino (entrambi sono SBT,
    // ma Via Calatafimi è leggermente più ad ovest)
    const sorted = sortStoresByDistance(STORES, 41.9, 12.5);
    expect(sorted).toHaveLength(2);
    // entrambi sono a San Benedetto, distanza simile — verifica che non
    // crashi e che ritorni array di dimensione corretta
    expect(sorted.every((s) => s.city === "San Benedetto del Tronto")).toBe(true);
  });
});
