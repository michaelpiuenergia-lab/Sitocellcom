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
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https: wss: https://va.vercel-scripts.com https://vitals.vercel-insights.com",
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return applySecurityHeaders(NextResponse.next());
  }

  return handleHtmlRequest();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icons/|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
