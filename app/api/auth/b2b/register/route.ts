import { NextRequest, NextResponse } from "next/server";
import { b2bRegister, postSiteRequest } from "@/lib/crm-client";
import { log } from "@/lib/log";
import {
  B2bRegisterFormSchema,
  buildStaffSummary,
} from "@/lib/requests/b2b-register";
import type { SiteRequestPayload } from "@/lib/crm-client/types";

/**
 * Registrazione rivenditore B2B.
 *
 * Il form raccoglie l'anagrafica completa (referente, azienda, sede legale,
 * dati di fatturazione), ma `POST /api/v1/public/b2b/register` del CRM accetta
 * solo 5 campi. Per non perdere il resto facciamo due chiamate:
 *
 * 1. b2bRegister con i campi core → crea il customer in stato PENDING
 * 2. postSiteRequest(kind="info") con tutto il dettaglio nel `message` → lo
 *    staff ha l'anagrafica completa sotto mano quando approva
 *
 * Quando il CRM estenderà l'endpoint di registrazione, i campi extra possono
 * migrare dal `message` al payload strutturato e il passo 2 sparisce.
 *
 * Visura camerale e autocertificazione reverse charge NON si caricano qui: il
 * sito non ha storage per allegati, li richiede lo staff via email dopo
 * l'invio (stesso schema delle foto del trade-in).
 */

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body non valido" } },
      { status: 400 },
    );
  }

  const parsed = B2bRegisterFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: parsed.error.issues[0]?.message ?? "Dati non validi",
        },
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const fullName = `${d.firstName} ${d.lastName}`;

  // 1) Registrazione core sul CRM (customer PENDING)
  try {
    await b2bRegister({
      name: fullName,
      email: d.email,
      companyName: d.companyName,
      vatNumber: d.vatNumber,
      phone: d.phone,
    });
  } catch (e) {
    log.warn("b2b register upstream error", {
      msg: e instanceof Error ? e.message : "unknown",
    });
    // Nessun leak: si prosegue e si risponde ok comunque (vedi sotto)
  }

  // 2) Anagrafica completa allo staff come richiesta sito. Un fallimento qui
  //    non invalida la registrazione: il customer PENDING esiste già.
  const payload: SiteRequestPayload = {
    kind: "info",
    source: "hub-public",
    customer: {
      name: fullName,
      email: d.email,
      phone: d.phone,
      company: d.companyName,
    },
    product: null,
    message: buildStaffSummary(d),
    privacyAccepted: true,
    hpf: d.hpf,
    meta: {
      userAgent: req.headers.get("user-agent") ?? "",
      referrer: req.headers.get("referer"),
      locale: req.headers.get("accept-language")?.split(",")[0] ?? "it-IT",
    },
  };

  try {
    await postSiteRequest(payload);
  } catch (e) {
    log.warn("b2b register detail request failed", {
      msg: e instanceof Error ? e.message : "unknown",
    });
  }

  // Sempre 200 — no user-enumeration: anche se l'email è già registrata
  return NextResponse.json({ ok: true }, { status: 200 });
}
