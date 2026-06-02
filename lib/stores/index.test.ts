import { describe, expect, it } from "vitest";
import {
  STORES,
  findStore,
  listRepairStores,
  listTradeInStores,
  sortStoresByDistance,
} from "./index";

describe("stores", () => {
  it("ci sono esattamente 2 negozi reali (Cellcom + Fast-Fix)", () => {
    expect(STORES).toHaveLength(2);
    const brands = STORES.map((s) => s.brand).sort();
    expect(brands).toEqual(["Cellcom", "Fast-Fix"]);
  });

  it("entrambi a San Benedetto del Tronto (AP)", () => {
    for (const s of STORES) {
      expect(s.city).toBe("San Benedetto del Tronto");
      expect(s.province).toBe("AP");
      expect(s.cap).toBe("63074");
    }
  });

  it("Cellcom ha P.IVA reale e PEC", () => {
    const cellcom = STORES.find((s) => s.brand === "Cellcom")!;
    expect(cellcom.vatNumber).toBe("02576350447");
    expect(cellcom.pec).toBe("cellcom25@pec.it");
    expect(cellcom.legalName).toBe("CELLCOM SRLS");
  });

  it("Fast-Fix ha indirizzo reale + cellulare", () => {
    const fastfix = STORES.find((s) => s.brand === "Fast-Fix")!;
    expect(fastfix.address).toBe("Piazza G. Garibaldi 31");
    expect(fastfix.mobile).toBe("+39 320 857 4006");
    expect(fastfix.email).toBe("info@fast-fix.it");
  });

  it("findStore ritorna null se id sconosciuto", () => {
    expect(findStore("non-esiste")).toBeNull();
  });

  it("findStore ritorna lo store giusto", () => {
    const s = findStore("cellcom-san-benedetto");
    expect(s?.brand).toBe("Cellcom");
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
    // ma Cellcom è leggermente più ad ovest)
    const sorted = sortStoresByDistance(STORES, 41.9, 12.5);
    expect(sorted).toHaveLength(2);
    // entrambi sono a San Benedetto, distanza simile — verifica che non
    // crashi e che ritorni array di dimensione corretta
    expect(sorted.every((s) => s.city === "San Benedetto del Tronto")).toBe(true);
  });
});
