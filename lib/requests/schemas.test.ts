import { describe, expect, it } from "vitest";
import {
  PublicRequestFormSchema,
  SiteRequestKindSchema,
  SiteRequestCustomerSchema,
  SiteRequestPayloadSchema,
} from "./schemas";

describe("requests schemas", () => {
  describe("SiteRequestKindSchema", () => {
    it.each([
      "info",
      "spare-part",
      "repair",
      "b2b-quote",
      "trade-in",
    ] as const)("accetta kind valido: %s", (kind) => {
      expect(SiteRequestKindSchema.safeParse(kind).success).toBe(true);
    });

    it("rifiuta kind sconosciuto", () => {
      expect(SiteRequestKindSchema.safeParse("foo").success).toBe(false);
    });
  });

  describe("SiteRequestCustomerSchema", () => {
    it("accetta customer minimo valido", () => {
      const ok = SiteRequestCustomerSchema.safeParse({
        name: "Mario Rossi",
        email: "mario@example.com",
      });
      expect(ok.success).toBe(true);
      if (ok.success) {
        expect(ok.data.phone).toBeNull();
        expect(ok.data.company).toBeNull();
      }
    });

    it("rifiuta email invalida", () => {
      const r = SiteRequestCustomerSchema.safeParse({
        name: "x",
        email: "not-an-email",
      });
      expect(r.success).toBe(false);
    });

    it("rifiuta name vuoto", () => {
      const r = SiteRequestCustomerSchema.safeParse({
        name: "",
        email: "valid@example.com",
      });
      expect(r.success).toBe(false);
    });

    it("accetta phone con formato libero (+39, spazi, trattini)", () => {
      const r = SiteRequestCustomerSchema.safeParse({
        name: "x",
        email: "x@x.it",
        phone: "+39 320 857 4006",
      });
      expect(r.success).toBe(true);
    });

    it("rifiuta phone con caratteri non numerici (lettere)", () => {
      const r = SiteRequestCustomerSchema.safeParse({
        name: "x",
        email: "x@x.it",
        phone: "ABC123",
      });
      expect(r.success).toBe(false);
    });

    it("max length email 180", () => {
      const longEmail = "a".repeat(180) + "@x.it";
      const r = SiteRequestCustomerSchema.safeParse({
        name: "x",
        email: longEmail,
      });
      expect(r.success).toBe(false);
    });
  });

  describe("PublicRequestFormSchema", () => {
    const validBase = {
      kind: "info" as const,
      customer: { name: "Mario", email: "mario@x.it" },
      product: null,
      message: "ciao",
      privacyAccepted: true as const,
      hpf: "",
    };

    it("accetta form base valido", () => {
      expect(PublicRequestFormSchema.safeParse(validBase).success).toBe(true);
    });

    it("rifiuta privacyAccepted = false", () => {
      const r = PublicRequestFormSchema.safeParse({
        ...validBase,
        privacyAccepted: false,
      });
      expect(r.success).toBe(false);
    });

    it("accetta message null", () => {
      const r = PublicRequestFormSchema.safeParse({
        ...validBase,
        message: null,
      });
      expect(r.success).toBe(true);
    });

    it("rifiuta message > 4000 char", () => {
      const r = PublicRequestFormSchema.safeParse({
        ...validBase,
        message: "x".repeat(4001),
      });
      expect(r.success).toBe(false);
    });

    it("accetta product con tutti i campi opzionali", () => {
      const r = PublicRequestFormSchema.safeParse({
        ...validBase,
        product: {
          id: "abc",
          slug: "iphone-15",
          name: "iPhone 15",
          variantId: "var1",
          variantLabel: "256GB blu",
        },
      });
      expect(r.success).toBe(true);
    });

    it("hpf di default è stringa vuota", () => {
      const r = PublicRequestFormSchema.safeParse({
        ...validBase,
        hpf: undefined,
      });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.hpf).toBe("");
    });
  });

  describe("SiteRequestPayloadSchema (full server-side payload)", () => {
    it("richiede source", () => {
      const r = SiteRequestPayloadSchema.safeParse({
        kind: "info",
        customer: { name: "x", email: "x@x.it" },
        product: null,
        message: null,
        privacyAccepted: true,
        meta: { userAgent: "", referrer: null, locale: "it-IT" },
      });
      expect(r.success).toBe(false);
    });

    it("accetta payload completo", () => {
      const r = SiteRequestPayloadSchema.safeParse({
        kind: "info",
        source: "hub-public",
        customer: { name: "x", email: "x@x.it" },
        product: null,
        message: null,
        privacyAccepted: true,
        meta: { userAgent: "Mozilla/5.0", referrer: null, locale: "it-IT" },
      });
      expect(r.success).toBe(true);
    });
  });
});
