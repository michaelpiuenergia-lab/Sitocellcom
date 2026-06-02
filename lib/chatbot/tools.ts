import "server-only";

import { z } from "zod";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import {
  getHealth,
  getProductBySlug,
  getProducts,
  getUsedDevices,
  lookupRepair,
} from "@/lib/crm-client";
import { STORES } from "@/lib/stores";

/**
 * Registro tool del chatbot pubblico:
 * - ANTHROPIC_TOOLS: schema esposto al modello (input_schema JSON Schema).
 * - TOOL_HANDLERS: handler server-side che validano input con zod, chiamano
 *   il crm-client, normalizzano l'output rimuovendo i campi sensibili
 *   (priceCents quando priceHidden=true, dati interni, ecc.).
 *
 * Il tool "openRequestForm" è VIRTUALE: non chiama nulla, restituisce
 * l'input al modello; la route /api/chat lo intercetta ed emette un evento
 * SSE "open-request" verso il client per aprire il <RequestForm/>.
 */

// ─── Mappatura nomi tool → label italiana mostrata nella tool-status bubble ──

export const TOOL_LABELS: Record<string, string> = {
  searchProducts: "Cerco nel catalogo…",
  getProductBySlug: "Apro la scheda prodotto…",
  searchUsedDevices: "Cerco tra l'usato garantito…",
  lookupRepair: "Cerco il ticket riparazione…",
  listStores: "Recupero i negozi…",
  openRequestForm: "Preparo la richiesta…",
  getHealth: "Verifico lo stato del sistema…",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const KIND_TO_SEGMENT: Record<string, string> = {
  device: "telefoni",
  part: "ricambi",
  accessory: "accessori",
  other: "telefoni",
};

// ─── Schemas Anthropic ─────────────────────────────────────────────────────

export const ANTHROPIC_TOOLS: Tool[] = [
  {
    name: "searchProducts",
    description:
      'Cerca nel catalogo pubblico unificato (Cellcom + Fast-Fix + ItalianParts): smartphone nuovi/ricondizionati, accessori, ricambi. Restituisce fino a 6 item con prezzo formattato, stock, slug. Se il prodotto ha priceHidden=true (tipicamente ricambi), il campo priceEur è null e priceLabel="Su richiesta".',
    input_schema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Testo libero: brand+modello." },
        channel: { type: "string", enum: ["cellcom", "fastfix", "italianparts"] },
        category: { type: "string" },
        brand: { type: "string" },
        condition: { type: "string", enum: ["new", "used", "refurbished"] },
        kind: { type: "string", enum: ["device", "part", "accessory", "other"] },
        compatibleModels: {
          type: "string",
          description: "Per ricambi: modello compatibile, es. 'iPhone 14'.",
        },
        limit: { type: "number", minimum: 1, maximum: 6, default: 6 },
      },
    },
  },
  {
    name: "getProductBySlug",
    description:
      "Dettaglio prodotto specifico, con varianti e prezzo. Usalo solo dopo searchProducts. Se ambiguo (stesso slug su più canali) ritorna ok=false code=SLUG_AMBIGUOUS e devi chiedere il canale all'utente.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        channel: { type: "string", enum: ["cellcom", "fastfix", "italianparts"] },
      },
      required: ["slug"],
    },
  },
  {
    name: "searchUsedDevices",
    description:
      "Catalogo usato garantito Cellcom: smartphone testati, IMEI verificato, fino 12 mesi di garanzia. Restituisce sempre prezzo.",
    input_schema: {
      type: "object",
      properties: {
        search: { type: "string" },
        brand: { type: "string" },
        condition: {
          type: "string",
          enum: ["ottimo", "buono", "discreto", "rotto"],
        },
        limit: { type: "number", minimum: 1, maximum: 6, default: 6 },
      },
    },
  },
  {
    name: "lookupRepair",
    description:
      "Stato corrente di una riparazione esistente. RICHIEDE: numero ticket + ultime 4-6 cifre del telefono che il cliente ha lasciato in negozio. Se null, ticket inesistente o cifre errate.",
    input_schema: {
      type: "object",
      properties: {
        ticket: {
          type: "string",
          description: "Es. R-2026-001234 o TKT-2026-0001.",
        },
        phoneSuffix: { type: "string", pattern: "^[0-9]{4,6}$" },
      },
      required: ["ticket", "phoneSuffix"],
    },
  },
  {
    name: "listStores",
    description:
      "I due punti vendita del Gruppo: Cellcom (via Calatafimi 52) e Fast-Fix (piazza Garibaldi 31), entrambi a San Benedetto del Tronto. Dato statico, sempre disponibile.",
    input_schema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          enum: ["repair", "tradeIn", "pickup", "walkin"],
          description: "Filtra per servizio.",
        },
      },
    },
  },
  {
    name: "openRequestForm",
    description:
      "Apre nel browser dell'utente il form di richiesta del sito, pre-compilato. È il MODO UFFICIALE per qualunque hand-off a un operatore umano: l'utente vede l'informativa privacy GDPR, controlla i campi, spunta il consenso e invia. NON inviare richieste in autonomia. Pre-compila solo i campi che hai raccolto in chat.",
    input_schema: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: ["info", "spare-part", "repair", "b2b-quote", "trade-in"],
        },
        defaultCustomer: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 120 },
            email: { type: "string", maxLength: 180 },
            phone: { type: "string", maxLength: 40 },
            company: { type: "string", maxLength: 180 },
            message: { type: "string", maxLength: 2000 },
          },
        },
        product: {
          type: "object",
          properties: {
            slug: { type: "string", maxLength: 200 },
            name: { type: "string", maxLength: 200 },
            variantLabel: { type: "string", maxLength: 200 },
          },
        },
      },
      required: ["kind"],
    },
  },
  {
    name: "getHealth",
    description:
      "Ping al backend. Usa SOLO se un tool ha appena fallito e vuoi capire se è un'interruzione generale. Non usarlo come saluto.",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
];

// ─── Zod input schemas + handlers ──────────────────────────────────────────

const PUBLIC_CHANNEL = z.enum(["cellcom", "fastfix", "italianparts"]);
const PUBLIC_KIND = z.enum(["device", "part", "accessory", "other"]);
const PUBLIC_CONDITION = z.enum(["new", "used", "refurbished"]);
const USED_CONDITION = z.enum(["ottimo", "buono", "discreto", "rotto"]);

const SearchProductsInput = z.object({
  search: z.string().max(120).optional(),
  channel: PUBLIC_CHANNEL.optional(),
  category: z.string().max(80).optional(),
  brand: z.string().max(80).optional(),
  condition: PUBLIC_CONDITION.optional(),
  kind: PUBLIC_KIND.optional(),
  compatibleModels: z.string().max(120).optional(),
  limit: z.number().int().min(1).max(6).optional(),
});

const GetProductBySlugInput = z.object({
  slug: z.string().min(1).max(200),
  channel: PUBLIC_CHANNEL.optional(),
});

const SearchUsedDevicesInput = z.object({
  search: z.string().max(120).optional(),
  brand: z.string().max(80).optional(),
  condition: USED_CONDITION.optional(),
  limit: z.number().int().min(1).max(6).optional(),
});

const LookupRepairInput = z.object({
  ticket: z.string().min(3).max(40),
  phoneSuffix: z.string().regex(/^[0-9]{4,6}$/),
});

const ListStoresInput = z.object({
  service: z.enum(["repair", "tradeIn", "pickup", "walkin"]).optional(),
});

const OpenRequestFormInput = z.object({
  kind: z.enum(["info", "spare-part", "repair", "b2b-quote", "trade-in"]),
  defaultCustomer: z
    .object({
      name: z.string().max(120).optional(),
      email: z.string().email().max(180).optional(),
      phone: z.string().max(40).optional(),
      company: z.string().max(180).optional(),
      message: z.string().max(2000).optional(),
    })
    .optional(),
  product: z
    .object({
      slug: z.string().max(200).optional(),
      name: z.string().max(200).optional(),
      variantLabel: z.string().max(200).optional(),
    })
    .optional(),
});

export type ToolResult =
  | { ok: true; data: unknown }
  | { ok: false; code: string; message: string };

export type ToolHandler = (input: unknown) => Promise<ToolResult>;

/**
 * Output di openRequestForm raw: la route /api/chat lo legge per emettere
 * l'evento SSE "open-request" al client. Il modello vede solo il summary.
 */
export type OpenRequestPayload = {
  kind: z.infer<typeof OpenRequestFormInput>["kind"];
  defaultCustomer?: z.infer<typeof OpenRequestFormInput>["defaultCustomer"];
  product?: z.infer<typeof OpenRequestFormInput>["product"];
};

function badInput(err: z.ZodError): ToolResult {
  return {
    ok: false,
    code: "INVALID_INPUT",
    message: err.issues[0]?.message ?? "Input non valido",
  };
}

function upstream(e: unknown): ToolResult {
  const msg = e instanceof Error ? e.message : "Errore upstream";
  return { ok: false, code: "UPSTREAM", message: msg };
}

export const TOOL_HANDLERS: Record<string, ToolHandler> = {
  async searchProducts(input) {
    const p = SearchProductsInput.safeParse(input ?? {});
    if (!p.success) return badInput(p.error);
    const { limit = 6, ...filters } = p.data;
    try {
      const res = await getProducts({ ...filters, limit });
      const items = res.items.slice(0, limit).map((i) => {
        const hidden = i.priceHidden || i.priceCents == null;
        return {
          slug: i.slug,
          name: i.name,
          brand: i.brand,
          kind: i.kind,
          channel: i.channel,
          category: i.category,
          condition: i.condition,
          stock: i.stock.capped ? `${i.stock.count}+` : i.stock.count,
          priceEur: hidden ? null : formatEur(i.priceCents as number),
          priceLabel: hidden ? "Su richiesta" : null,
          url: `/prodotti/${KIND_TO_SEGMENT[i.kind] ?? "telefoni"}#${i.slug}`,
        };
      });
      return {
        ok: true,
        data: {
          items,
          total: res.total,
          hasMore: res.hasMore,
        },
      };
    } catch (e) {
      return upstream(e);
    }
  },

  async getProductBySlug(input) {
    const p = GetProductBySlugInput.safeParse(input);
    if (!p.success) return badInput(p.error);
    try {
      const d = await getProductBySlug(p.data.slug, p.data.channel);
      const hidden = d.priceHidden || d.priceCents == null;
      return {
        ok: true,
        data: {
          slug: d.slug,
          name: d.name,
          brand: d.brand,
          kind: d.kind,
          channel: d.channel,
          category: d.category,
          condition: d.condition,
          description: d.description,
          stock: d.stock.capped ? `${d.stock.count}+` : d.stock.count,
          priceEur: hidden ? null : formatEur(d.priceCents as number),
          priceLabel: hidden ? "Su richiesta" : null,
          variants: d.variants.slice(0, 6).map((v) => {
            const vh = v.priceHidden || v.priceCents == null;
            return {
              id: v.id,
              label: v.label,
              color: v.color,
              storage: v.storage,
              size: v.size,
              stock: v.stock.capped ? `${v.stock.count}+` : v.stock.count,
              priceEur: vh ? null : formatEur(v.priceCents as number),
              priceLabel: vh ? "Su richiesta" : null,
            };
          }),
          url: `/prodotti/${KIND_TO_SEGMENT[d.kind] ?? "telefoni"}#${d.slug}`,
        },
      };
    } catch (e) {
      // Bug fix #25: CrmApiError espone `code` come property (non come Error.message).
      // Il mock invece lancia `new Error("SLUG_AMBIGUOUS")` quindi facciamo entrambi.
      const code = (e as { code?: string }).code;
      const msg = e instanceof Error ? e.message : "";
      if (code === "SLUG_AMBIGUOUS" || /SLUG_AMBIGUOUS/i.test(msg)) {
        return {
          ok: false,
          code: "SLUG_AMBIGUOUS",
          message:
            "Slug presente su più canali — chiedi all'utente quale canale.",
        };
      }
      if (code === "NOT_FOUND" || /NOT_FOUND/i.test(msg)) {
        return { ok: false, code: "NOT_FOUND", message: "Prodotto non trovato" };
      }
      return upstream(e);
    }
  },

  async searchUsedDevices(input) {
    const p = SearchUsedDevicesInput.safeParse(input ?? {});
    if (!p.success) return badInput(p.error);
    const { limit = 6, ...filters } = p.data;
    try {
      const res = await getUsedDevices({ ...filters, limit });
      const items = res.items.slice(0, limit).map((d) => ({
        id: d.id,
        brand: d.brand,
        model: d.model,
        variant: d.variant,
        color: d.color,
        conditionLabel: d.conditionLabel,
        functional: d.functional,
        warrantyMonths: d.warrantyMonths,
        priceEur: d.priceEur,
        title: d.title,
        url: `/usato#${d.id}`,
      }));
      return { ok: true, data: { items, total: res.total } };
    } catch (e) {
      return upstream(e);
    }
  },

  async lookupRepair(input) {
    const p = LookupRepairInput.safeParse(input);
    if (!p.success) return badInput(p.error);
    try {
      const r = await lookupRepair(p.data.ticket, p.data.phoneSuffix);
      if (!r) {
        return {
          ok: true,
          data: {
            found: false,
            hint: "Ticket non trovato o cifre telefono errate. Linka /riparazioni/tracker.",
          },
        };
      }
      return {
        ok: true,
        data: {
          found: true,
          ticketNumber: r.ticketNumber,
          status: r.status,
          deviceBrand: r.deviceBrand,
          deviceModel: r.deviceModel,
          imeiMasked: r.imeiMasked,
          defectReported: r.defectReported,
          defectDiagnosed: r.defectDiagnosed,
          quote: r.quote,
          lastEvent: r.statusHistory.at(-1) ?? null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          trackerUrl: "/riparazioni/tracker",
        },
      };
    } catch (e) {
      return upstream(e);
    }
  },

  async listStores(input) {
    const p = ListStoresInput.safeParse(input ?? {});
    if (!p.success) return badInput(p.error);
    const filter = p.data.service;
    const items = STORES.filter((s) => (filter ? s.services[filter] : true)).map(
      (s) => ({
        id: s.id,
        name: s.name,
        brand: s.brand,
        legalName: s.legalName,
        address: s.address,
        city: s.city,
        province: s.province,
        cap: s.cap,
        phone: s.phone,
        mobile: s.mobile,
        email: s.email,
        hours: s.hours,
        services: s.services,
        url: "/negozi",
      }),
    );
    return { ok: true, data: { items, total: items.length } };
  },

  async openRequestForm(input) {
    const p = OpenRequestFormInput.safeParse(input);
    if (!p.success) return badInput(p.error);
    // Tool VIRTUALE: la route legge il payload e emette l'evento SSE
    // "open-request" al client. Il summary che torna al modello è minimo.
    const payload: OpenRequestPayload = p.data;
    return {
      ok: true,
      data: {
        opened: true,
        kind: payload.kind,
        message:
          "Modal di richiesta aperto nel browser dell'utente con i campi pre-compilati. L'utente vedrà l'informativa privacy e dovrà spuntare il consenso prima di inviare.",
      },
    };
  },

  async getHealth() {
    try {
      const h = await getHealth();
      return { ok: true, data: h };
    } catch (e) {
      return upstream(e);
    }
  },
};

/**
 * Type-guard usato dalla route /api/chat per estrarre il payload completo
 * di openRequestForm — quel tool è virtuale: il payload validato torna al
 * client come evento SSE separato.
 */
export function parseOpenRequestPayload(input: unknown): OpenRequestPayload | null {
  const p = OpenRequestFormInput.safeParse(input);
  return p.success ? p.data : null;
}
