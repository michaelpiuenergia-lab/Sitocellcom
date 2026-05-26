import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SECURITY_HEADERS: Array<[string, string]> = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["X-DNS-Prefetch-Control", "off"],
  [
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=()",
  ],
  [
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  ],
];

const applySecurityHeaders = (response: NextResponse) => {
  for (const [name, value] of SECURITY_HEADERS) {
    response.headers.set(name, value);
  }
  return response;
};

function buildCspHeader(): string {
  const isDev = process.env.NODE_ENV !== "production";
  const evalDirective = isDev ? "'unsafe-eval'" : "'wasm-unsafe-eval'";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${evalDirective} https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.vercel.app https://cdn.shopify.com https://*.shopifycdn.com https://cellcom.it https://www.cellcom.it https://italianparts.it https://www.italianparts.it https://fast-fix.it https://www.fast-fix.it https://*.global.ssl.fastly.net http://127.0.0.1:3000 http://localhost:3000 http://127.0.0.1:3001 http://localhost:3001 http://127.0.0.1:3002 http://localhost:3002",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "worker-src 'self' blob:",
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function handleHtmlRequest() {
  const csp = buildCspHeader();
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  return applySecurityHeaders(response);
}

const B2B_PUBLIC_PATHS = new Set<string>(["/b2b/login"]);
const B2B_SESSION_COOKIE = "b2b_session";

function b2bGate(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/b2b")) return null;
  if (B2B_PUBLIC_PATHS.has(pathname)) return null;

  // Edge runtime: non possiamo verificare la firma HMAC qui (no node:crypto).
  // Controlliamo solo la presenza del cookie — la verifica firma + customer
  // fresh avviene in lib/auth/guards.ts (Node runtime, Server Components).
  const cookie = request.cookies.get(B2B_SESSION_COOKIE);
  if (cookie?.value) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/b2b/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return applySecurityHeaders(NextResponse.redirect(url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return applySecurityHeaders(NextResponse.next());
  }

  const gateResponse = b2bGate(request);
  if (gateResponse) return gateResponse;

  return handleHtmlRequest();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icons/|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
