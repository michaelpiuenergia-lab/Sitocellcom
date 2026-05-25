import { NextRequest, NextResponse } from "next/server";
import { postSiteRequest } from "@/lib/crm-client";
import { optionalB2bSession } from "@/lib/auth/guards";
import { PublicRequestFormSchema } from "@/lib/requests/schemas";
import type {
  SiteRequestPayload,
  SiteRequestSource,
} from "@/lib/crm-client/types";

/**
 * Intake unificato richieste dal sito → CRM.
 *
 * Una sola route per:
 * - info prodotto (pubblico)
 * - ricambio (pubblico)
 * - riparazione (pubblico)
 * - preventivo B2B (b2b, con sessione)
 *
 * Lato CRM diventa un record `site_requests` con stato "da gestire".
 */

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body JSON non valido" } },
      { status: 400 },
    );
  }

  const parsed = PublicRequestFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: "Compila tutti i campi richiesti",
          detail: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        },
      },
      { status: 400 },
    );
  }

  const b2bSession = await optionalB2bSession();
  const source: SiteRequestSource = b2bSession ? "hub-b2b" : "hub-public";

  // Se autenticato B2B, sovrascriviamo i campi azienda con quelli del cliente
  // certificato — il form può essere stato compilato con dati diversi, ma
  // facciamo prevalere il customer autenticato.
  const customerPayload = b2bSession
    ? {
        name: b2bSession.customer.name,
        email: b2bSession.customer.email,
        phone: parsed.data.customer.phone,
        company: b2bSession.customer.company,
      }
    : parsed.data.customer;

  const meta = {
    userAgent: req.headers.get("user-agent") ?? "",
    referrer: req.headers.get("referer"),
    locale: req.headers.get("accept-language")?.split(",")[0] ?? "it-IT",
  };

  const payload: SiteRequestPayload = {
    kind: parsed.data.kind,
    source,
    customer: customerPayload,
    product: parsed.data.product,
    message: parsed.data.message,
    privacyAccepted: parsed.data.privacyAccepted,
    hpf: parsed.data.hpf,
    meta,
  };

  try {
    const created = await postSiteRequest(payload, b2bSession?.sessionToken);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: { code: "INTAKE_FAILED", message: msg } },
      { status: 502 },
    );
  }
}
