import { z } from "zod";

/**
 * Zod schemas per l'intake richieste dal sito HUB → CRM.
 *
 * Lo schema lato CRM (vedi CRM-BRIEF-B2B.md §2.2.3) deve essere identico:
 * questo file è la fonte di verità del contratto API.
 */

export const SiteRequestKindSchema = z.enum([
  "info",
  "spare-part",
  "repair",
  "b2b-quote",
  "trade-in",
  "shipment",
]);

export const SiteRequestSourceSchema = z.enum(["hub-public", "hub-b2b"]);

export const SiteRequestCustomerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  phone: z
    .string()
    .max(40)
    .regex(/^[+0-9 ()\-./]*$/, "Formato telefono non valido")
    .nullable()
    .default(null),
  company: z.string().max(180).nullable().default(null),
});

export const SiteRequestProductSchema = z
  .object({
    id: z.string().nullable().default(null),
    slug: z.string().max(200).nullable().default(null),
    name: z.string().max(200).nullable().default(null),
    variantId: z.string().nullable().default(null),
    variantLabel: z.string().max(200).nullable().default(null),
  })
  .nullable()
  .default(null);

export const SiteRequestMetaSchema = z.object({
  userAgent: z.string().max(500).default(""),
  referrer: z.string().max(500).nullable().default(null),
  locale: z.string().max(20).default("it-IT"),
});

export const SiteRequestPayloadSchema = z.object({
  kind: SiteRequestKindSchema,
  source: SiteRequestSourceSchema,
  customer: SiteRequestCustomerSchema,
  product: SiteRequestProductSchema,
  message: z.string().max(4000).nullable().default(null),
  // GDPR: l'utente deve aver dato consenso esplicito al trattamento dati
  // prima dell'invio. Salvato sul CRM per dimostrare la base legale.
  privacyAccepted: z.literal(true, {
    message:
      "È necessario accettare l'informativa privacy per inviare la richiesta",
  }),
  meta: SiteRequestMetaSchema,
});

export type SiteRequestPayloadInput = z.infer<
  typeof SiteRequestPayloadSchema
>;

/**
 * Schema per il form lato browser (subset più stretto):
 * - source viene impostato server-side
 * - meta viene impostato server-side dalle headers
 * - product opzionale: form contatto generico non lo richiede
 * - privacyAccepted DEVE essere true (consenso GDPR)
 * - hpf: honeypot anti-bot (input nascosto via CSS). Utenti reali → "",
 *   bot rotanti → valore non vuoto → CRM marca spam server-side.
 */
export const PublicRequestFormSchema = z.object({
  kind: SiteRequestKindSchema,
  customer: SiteRequestCustomerSchema,
  product: SiteRequestProductSchema,
  message: z.string().max(4000).nullable().default(null),
  privacyAccepted: z.literal(true, {
    message:
      "È necessario accettare l'informativa privacy per inviare la richiesta",
  }),
  hpf: z.string().max(200).optional().default(""),
});

export type PublicRequestFormInput = z.infer<
  typeof PublicRequestFormSchema
>;
