import { z } from "zod";
import {
  BUSINESS_TYPES,
  COUNTRY_CODES,
  DISCOVERY_SOURCES,
  PROVINCE_CODES,
} from "@/lib/geo";

/**
 * Schema della registrazione rivenditore B2B (form completo).
 *
 * Il CRM accetta solo 5 campi su `POST /api/v1/public/b2b/register`; tutto il
 * resto viaggia allo staff come richiesta sito con il riassunto nel `message`
 * (vedi buildStaffSummary + app/api/auth/b2b/register/route.ts).
 */

const optionalText = (max: number) =>
  z.string().max(max).trim().optional().default("");

export const B2bRegisterFormSchema = z
  .object({
    // --- Referente ---
    firstName: z.string().min(1, "Nome obbligatorio").max(80).trim(),
    lastName: z.string().min(1, "Cognome obbligatorio").max(80).trim(),
    email: z.string().email("Email non valida").max(180).trim(),
    phone: z
      .string()
      .min(1, "Cellulare obbligatorio")
      .max(40)
      .regex(/^[+0-9 ()\-./]*$/, "Telefono non valido")
      .trim(),

    // --- Azienda ---
    companyName: z
      .string()
      .min(1, "Ragione sociale obbligatoria")
      .max(180)
      .trim(),
    vatNumber: z
      .string()
      .min(1, "P.IVA obbligatoria")
      .max(40)
      .regex(/^[A-Za-z0-9]+$/, "P.IVA non valida")
      .trim(),
    taxCode: optionalText(40),
    sdi: optionalText(20),
    pec: z
      .union([z.string().email("PEC non valida").max(180), z.literal("")])
      .optional()
      .default(""),
    website: optionalText(200),

    // --- Sede legale ---
    country: z.enum(COUNTRY_CODES as [string, ...string[]]),
    // Sigla ISTAT per l'Italia, testo libero per l'estero (vedi refine)
    province: z.string().max(80).trim().optional().default(""),
    city: z.string().min(1, "Città obbligatoria").max(120).trim(),
    address: z.string().min(1, "Indirizzo obbligatorio").max(200).trim(),
    streetNumber: z.string().min(1, "Numero civico obbligatorio").max(20).trim(),

    // --- Profilo ---
    businessType: z.enum(BUSINESS_TYPES).optional().nullable().default(null),
    discoverySource: z
      .enum(DISCOVERY_SOURCES)
      .optional()
      .nullable()
      .default(null),
    notes: optionalText(1000),

    // GDPR — senza consenso esplicito non trattiamo nulla
    privacyAccepted: z.literal(true, {
      message: "È necessario accettare l'informativa privacy",
    }),
    // Honeypot: vuoto per gli utenti reali
    hpf: z.string().max(200).optional().default(""),
  })
  // Per l'Italia la provincia deve essere una sigla valida; per l'estero
  // accettiamo testo libero (region/state) e lo staff normalizza.
  .refine((d) => d.country !== "IT" || PROVINCE_CODES.includes(d.province), {
    message: "Provincia obbligatoria",
    path: ["province"],
  });

export type B2bRegisterFormInput = z.infer<typeof B2bRegisterFormSchema>;

/**
 * Riassunto leggibile per lo staff — finisce nel `message` della richiesta.
 * Le righe vuote separano i blocchi; i campi non compilati sono omessi.
 */
export function buildStaffSummary(d: B2bRegisterFormInput): string {
  const line = (label: string, value: string | null | undefined) =>
    value ? `${label}: ${value}` : null;

  return [
    "RICHIESTA REGISTRAZIONE RIVENDITORE B2B",
    "",
    "-- Referente --",
    line("Nome", `${d.firstName} ${d.lastName}`),
    line("Email", d.email),
    line("Cellulare", d.phone),
    "",
    "-- Azienda --",
    line("Ragione sociale", d.companyName),
    line("P.IVA", d.vatNumber),
    line("Codice fiscale", d.taxCode),
    line("Codice SDI", d.sdi),
    line("PEC", d.pec),
    line("Sito web", d.website),
    "",
    "-- Sede legale --",
    line("Indirizzo", `${d.address} ${d.streetNumber}`),
    line("Città", d.city),
    line("Provincia", d.province),
    line("Nazione", d.country),
    "",
    "-- Profilo --",
    line("Tipologia attività", d.businessType),
    line("Come ci ha conosciuto", d.discoverySource),
    line("Note", d.notes),
    "",
    "-- Documenti --",
    "Da richiedere via email: visura camerale + autocertificazione reverse charge.",
  ]
    .filter((r) => r !== null)
    .join("\n");
}
