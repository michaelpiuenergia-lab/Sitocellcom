import { describe, expect, it } from "vitest";
import { B2bRegisterFormSchema, buildStaffSummary } from "./b2b-register";

/** Payload minimo valido: tutti i campi obbligatori, nessun opzionale */
const valid = {
  firstName: "Mario",
  lastName: "Rossi",
  email: "mario@azienda.it",
  phone: "+39 320 1234567",
  companyName: "Rivenditore srl",
  vatNumber: "01234567890",
  country: "IT",
  province: "AP",
  city: "San Benedetto del Tronto",
  address: "Via Roma",
  streetNumber: "31",
  privacyAccepted: true as const,
};

describe("B2bRegisterFormSchema", () => {
  it("accetta il payload minimo valido", () => {
    const r = B2bRegisterFormSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("riempie i campi opzionali con stringa vuota e i select con null", () => {
    const r = B2bRegisterFormSchema.parse(valid);
    expect(r.taxCode).toBe("");
    expect(r.sdi).toBe("");
    expect(r.pec).toBe("");
    expect(r.website).toBe("");
    expect(r.notes).toBe("");
    expect(r.businessType).toBeNull();
    expect(r.discoverySource).toBeNull();
    expect(r.hpf).toBe("");
  });

  it("rifiuta senza consenso privacy", () => {
    const r = B2bRegisterFormSchema.safeParse({
      ...valid,
      privacyAccepted: false,
    });
    expect(r.success).toBe(false);
  });

  it("rifiuta una P.IVA con caratteri non alfanumerici", () => {
    const r = B2bRegisterFormSchema.safeParse({
      ...valid,
      vatNumber: "0123-456/789",
    });
    expect(r.success).toBe(false);
  });

  it("rifiuta un'email non valida", () => {
    const r = B2bRegisterFormSchema.safeParse({ ...valid, email: "mario@" });
    expect(r.success).toBe(false);
  });

  it("per l'Italia pretende una sigla provincia valida", () => {
    const missing = B2bRegisterFormSchema.safeParse({ ...valid, province: "" });
    expect(missing.success).toBe(false);

    const bogus = B2bRegisterFormSchema.safeParse({ ...valid, province: "ZZ" });
    expect(bogus.success).toBe(false);
  });

  it("per l'estero accetta la provincia come testo libero, anche vuota", () => {
    const free = B2bRegisterFormSchema.safeParse({
      ...valid,
      country: "DE",
      province: "Baviera",
    });
    expect(free.success).toBe(true);

    const empty = B2bRegisterFormSchema.safeParse({
      ...valid,
      country: "DE",
      province: "",
    });
    expect(empty.success).toBe(true);
  });

  it("accetta PEC vuota ma rifiuta una PEC malformata", () => {
    expect(B2bRegisterFormSchema.safeParse({ ...valid, pec: "" }).success).toBe(
      true,
    );
    expect(
      B2bRegisterFormSchema.safeParse({ ...valid, pec: "non-una-email" }).success,
    ).toBe(false);
  });

  it("rifiuta una nazione fuori lista", () => {
    const r = B2bRegisterFormSchema.safeParse({ ...valid, country: "ZZ" });
    expect(r.success).toBe(false);
  });
});

describe("buildStaffSummary", () => {
  it("include i dati obbligatori e la nota sui documenti", () => {
    const summary = buildStaffSummary(B2bRegisterFormSchema.parse(valid));
    expect(summary).toContain("RICHIESTA REGISTRAZIONE RIVENDITORE B2B");
    expect(summary).toContain("Nome: Mario Rossi");
    expect(summary).toContain("P.IVA: 01234567890");
    expect(summary).toContain("Indirizzo: Via Roma 31");
    expect(summary).toContain("Provincia: AP");
    expect(summary).toContain("visura camerale");
  });

  it("omette le righe dei campi non compilati", () => {
    const summary = buildStaffSummary(B2bRegisterFormSchema.parse(valid));
    expect(summary).not.toContain("Codice SDI:");
    expect(summary).not.toContain("PEC:");
    expect(summary).not.toContain("Sito web:");
  });

  it("include i campi opzionali quando ci sono", () => {
    const summary = buildStaffSummary(
      B2bRegisterFormSchema.parse({
        ...valid,
        sdi: "KRRH6B9",
        pec: "azienda@pec.it",
        businessType: "repair-shop",
        notes: "Servono display iPhone",
      }),
    );
    expect(summary).toContain("Codice SDI: KRRH6B9");
    expect(summary).toContain("PEC: azienda@pec.it");
    expect(summary).toContain("Tipologia attività: repair-shop");
    expect(summary).toContain("Note: Servono display iPhone");
  });

  it("resta entro il limite di 4000 caratteri del campo message", () => {
    const summary = buildStaffSummary(
      B2bRegisterFormSchema.parse({
        ...valid,
        taxCode: "X".repeat(40),
        sdi: "Y".repeat(20),
        website: "w".repeat(200),
        notes: "N".repeat(1000),
      }),
    );
    expect(summary.length).toBeLessThanOrEqual(4000);
  });
});
