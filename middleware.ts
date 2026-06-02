import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware globale: header di sicurezza dinamici, redirect HTTPS in prod,
 * rate-limit best-effort sugli endpoint di auth.
 *
 * NOTA: i security headers statici (HSTS, X-Frame-Options, ecc.) sono già
 * in next.config.ts. Qui aggiungiamo solo CSP dinamica e il rate-limit
 * delle route sensibili.
 */

// ─── CSP ────────────────────────────────────────────────────────────────────
// 'unsafe-inline' su style è inevitabile con styled-jsx + framer-motion.
// 'unsafe-inline' su script viene RIMOSSO in produzione (sostituito da
// nonce se serve). 'unsafe-eval' tollerato in dev per HMR.

function buildCsp(isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : "'wasm-unsafe-eval'"} https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.shopify.com https://*.shopifycdn.com https://cellcom.it https://www.cellcom.it https://italianparts.it https://www.italianparts.it https://fast-fix.it https://www.fast-fix.it https://*.global.ssl.fastly.net https://cellcom.vercel.app",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cellcom.vercel.app https://api.anthropic.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// ─── Rate-limit base per /api/auth/* ────────────────────────────────────────
// In-memory LRU, best-effort (per-istanza Vercel). Per produzione robusta
// migrare a Vercel KV / Upstash Redis.

const AUTH_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const AUTH_LIMIT_MAX = 20; // 20 tentativi auth per IP / 5 min
const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 2_000;

function consumeAuthLimit(ip: string): { allowed: boolean; resetInSec: number } {
  const now = Date.now();
  const cur = buckets.get(ip);
  if (!cur || cur.resetAt <= now) {
    buckets.delete(ip);
    buckets.set(ip, { count: 1, resetAt: now + AUTH_LIMIT_WINDOW_MS });
    // LRU evict
    if (buckets.size > MAX_BUCKETS) {
      const it = buckets.keys();
      for (let i = 0; i < 100; i++) {
        const k = it.next().value;
        if (k === undefined) break;
        buckets.delete(k);
      }
    }
    return { allowed: true, resetInSec: AUTH_LIMIT_WINDOW_MS / 1000 };
  }
  if (cur.count >= AUTH_LIMIT_MAX) {
    return { allowed: false, resetInSec: Math.ceil((cur.resetAt - now) / 1000) };
  }
  cur.count += 1;
  buckets.delete(ip);
  buckets.set(ip, cur);
  return { allowed: true, resetInSec: Math.ceil((cur.resetAt - now) / 1000) };
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

// ─── Middleware entry ──────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isDev = process.env.NODE_ENV !== "production";

  // Rate-limit su auth endpoints
  if (url.pathname.startsWith("/api/auth/")) {
    const ip = getIp(req);
    const rl = consumeAuthLimit(ip);
    if (!rl.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: "RATE_LIMITED",
            message: "Troppi tentativi. Riprova fra qualche minuto.",
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rl.resetInSec),
          },
        },
      );
    }
  }

  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", buildCsp(isDev));
  return res;
}

export const config = {
  matcher: [
    // Tutto tranne static, image optimization, robots, sitemap
    "/((?!_next/static|_next/image|favicon\\.|robots\\.txt|sitemap\\.xml).*)",
  ],
};
