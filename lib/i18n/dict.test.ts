import { describe, expect, it } from "vitest";
import { getDict } from "./dict";

describe("i18n dict", () => {
  it("IT e EN hanno le stesse chiavi", () => {
    const it = getDict("it");
    const en = getDict("en");
    const itKeys = Object.keys(it).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(itKeys);
  });

  it("nessun valore vuoto in IT", () => {
    const dict = getDict("it");
    for (const [key, value] of Object.entries(dict)) {
      if (typeof value === "string") {
        expect(value.length, `IT key ${key} è vuoto`).toBeGreaterThan(0);
      }
    }
  });

  it("nessun valore vuoto in EN", () => {
    const dict = getDict("en");
    for (const [key, value] of Object.entries(dict)) {
      if (typeof value === "string") {
        expect(value.length, `EN key ${key} è vuoto`).toBeGreaterThan(0);
      }
    }
  });

  it("charsLeft è una funzione in entrambe le lingue", () => {
    const it = getDict("it");
    const en = getDict("en");
    expect(typeof it["chat.input.charsLeft"]).toBe("function");
    expect(typeof en["chat.input.charsLeft"]).toBe("function");
  });

  it("charsLeft produce stringa con il numero", () => {
    const itFn = getDict("it")["chat.input.charsLeft"];
    const enFn = getDict("en")["chat.input.charsLeft"];
    expect(itFn(42)).toMatch(/42/);
    expect(enFn(42)).toMatch(/42/);
  });

  it("enum repairStatus copre tutti gli stati CRM", () => {
    const dict = getDict("it");
    expect(dict["enum.repairStatus.accepted"]).toBe("Accettato");
    expect(dict["enum.repairStatus.diagnosed"]).toBe("Diagnosticato");
    expect(dict["enum.repairStatus.in_repair"]).toBe("In lavorazione");
    expect(dict["enum.repairStatus.awaiting_parts"]).toBe("Attesa ricambi");
    expect(dict["enum.repairStatus.ready_for_pickup"]).toBe("Pronto al ritiro");
    expect(dict["enum.repairStatus.delivered"]).toBe("Consegnato");
    expect(dict["enum.repairStatus.cancelled"]).toBe("Annullato");
  });

  it("welcome chatbot in IT inizia con 'Ciao'", () => {
    expect(getDict("it")["chat.welcome"]).toMatch(/^Ciao/);
  });

  it("welcome chatbot in EN inizia con 'Hi'", () => {
    expect(getDict("en")["chat.welcome"]).toMatch(/^Hi/);
  });
});
