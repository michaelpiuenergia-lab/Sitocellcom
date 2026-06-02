import "server-only";

/**
 * Rate-limit best-effort per IP, in-memory (LRU semplice).
 *
 * Su deploy serverless multi-istanza ogni warm container ha il suo Map:
 * non è un vero distributed rate-limit, ma alza la barriera per scraping
 * sintetico del system prompt. Quando ci sarà bisogno di consistenza,
 * passare a Vercel KV o Upstash Redis.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 5 * 60 * 1000; // 5 minuti
const DEFAULT_MAX = 50;
const MAX_KEYS = 5_000;

const buckets = new Map<string, Bucket>();

function envMax(): number {
  const raw = process.env.CHATBOT_RATE_LIMIT_PER_IP;
  if (!raw) return DEFAULT_MAX;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_MAX;
}

function evictIfNeeded() {
  if (buckets.size <= MAX_KEYS) return;
  // Elimina i primi 200 (Map mantiene insertion order)
  const it = buckets.keys();
  for (let i = 0; i < 200; i++) {
    const k = it.next().value;
    if (k === undefined) break;
    buckets.delete(k);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInSec: number;
};

export function consumeRateLimit(ip: string | null | undefined): RateLimitResult {
  const key = (ip ?? "anon").slice(0, 64);
  const now = Date.now();
  const max = envMax();
  const cur = buckets.get(key);

  if (!cur || cur.resetAt <= now) {
    buckets.delete(key); // touch per LRU
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    evictIfNeeded();
    return { allowed: true, remaining: max - 1, resetInSec: WINDOW_MS / 1000 };
  }

  if (cur.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)),
    };
  }

  cur.count += 1;
  // touch per LRU
  buckets.delete(key);
  buckets.set(key, cur);
  return {
    allowed: true,
    remaining: max - cur.count,
    resetInSec: Math.ceil((cur.resetAt - now) / 1000),
  };
}

export function extractIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
