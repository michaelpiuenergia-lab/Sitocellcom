import "server-only";

import type { PublicApiError } from "./types";
import { getLang } from "@/lib/i18n/lang";

const CRM_BASE = process.env.CRM_API_URL;
const CRM_KEY = process.env.CRM_API_KEY;

if (!CRM_BASE || !CRM_KEY) {
  // log in dev, fail-soft in prod (mock fallback)
}

export class CrmApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public detail?: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

type FetchOpts = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  revalidate?: number;
  tags?: string[];
  cache?: "no-store";
  extraHeaders?: Record<string, string>;
};

export async function crmFetch<T>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  // i18n: appende ?lang=en quando il cookie utente è "en" (default it = niente).
  // Il CRM traduce automaticamente label derivate (conditionLabel, status
  // labels) ed email. Gli enum grezzi (status code) restano IT e l'HUB li
  // mappa coi suoi dict.
  const lang = await getLang().catch(() => "it" as const);
  const langSuffix =
    lang === "en"
      ? path.includes("?")
        ? "&lang=en"
        : "?lang=en"
      : "";
  const url = `${CRM_BASE}${path}${langSuffix}`;
  const method = opts.method ?? "GET";
  const isMutation = method !== "GET";

  const headers: Record<string, string> = {
    "X-API-Key": CRM_KEY ?? "",
    ...(opts.extraHeaders ?? {}),
  };
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(8000),
  };
  if (opts.body !== undefined) {
    init.body = JSON.stringify(opts.body);
  }

  // POST/DELETE e GET con opts.cache="no-store" → no-cache.
  // GET di default → cache ISR con next.revalidate.
  if (isMutation || opts.cache === "no-store") {
    init.cache = "no-store";
  } else {
    (init as RequestInit & { next?: { revalidate?: number; tags?: string[] } }).next = {
      revalidate: opts.revalidate ?? 60,
      tags: opts.tags ?? [],
    };
  }

  // POST/DELETE non sono idempotenti: niente retry.
  const maxAttempts = isMutation ? 1 : 3;
  let lastErr: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(url, init);

      if (!res.ok) {
        let err: PublicApiError | null = null;
        try { err = await res.json(); } catch {}

        const retryAfterHeader = res.headers.get("retry-after");
        const retryAfter = retryAfterHeader
          ? Number.parseInt(retryAfterHeader, 10)
          : undefined;

        // retry solo su 5xx, solo per GET
        if (!isMutation && res.status >= 500 && attempt < maxAttempts - 1) {
          await sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        throw new CrmApiError(
          err?.error?.code ?? "UNKNOWN",
          res.status,
          err?.error?.message ?? `HTTP ${res.status}`,
          err?.error?.detail,
          Number.isFinite(retryAfter) ? retryAfter : undefined,
        );
      }
      // 204 No Content
      if (res.status === 204) return undefined as T;
      return res.json() as Promise<T>;
    } catch (e) {
      lastErr = e;
      if (e instanceof CrmApiError && e.status < 500) throw e;
      if (attempt === maxAttempts - 1) throw e;
      await sleep(1000 * Math.pow(2, attempt));
    }
  }
  throw lastErr;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
