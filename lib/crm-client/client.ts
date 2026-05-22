import type { PublicApiError } from "./types";

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
  ) {
    super(message);
  }
}

type FetchOpts = {
  revalidate?: number;
  tags?: string[];
};

export async function crmFetch<T>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  const url = `${CRM_BASE}${path}`;
  let lastErr: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "X-API-Key": CRM_KEY ?? "" },
        next: {
          revalidate: opts.revalidate ?? 60,
          tags: opts.tags ?? [],
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        let err: PublicApiError | null = null;
        try { err = await res.json(); } catch {}
        // retry solo su 5xx, non su 4xx
        if (res.status >= 500 && attempt < 2) {
          await sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        throw new CrmApiError(
          err?.error?.code ?? "UNKNOWN",
          res.status,
          err?.error?.message ?? `HTTP ${res.status}`,
          err?.error?.detail,
        );
      }
      return res.json() as Promise<T>;
    } catch (e) {
      lastErr = e;
      if (e instanceof CrmApiError && e.status < 500) throw e;
      if (attempt === 2) throw e;
      await sleep(1000 * Math.pow(2, attempt));
    }
  }
  throw lastErr;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
