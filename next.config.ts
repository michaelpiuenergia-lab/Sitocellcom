import type { NextConfig } from "next";
import path from "node:path";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Vercel region + runtime
  // https://vercel.com/docs/concepts/edge-network/regions
  // fra1 = Frankfurt (EU Central)

  // Path con spazi sotto OneDrive confondono Turbopack: ancoriamo la root.
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    // Next.js 16 blocca il fetch ottimizzato verso IP privati (127.0.0.1, ::1).
    // In dev parliamo col CRM locale → bypassiamo l'ottimizzazione lasciando
    // che il browser carichi le foto direttamente. In prod (Vercel) i CRM
    // images sono su https://cellcom.vercel.app, ottimizzazione attiva.
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.shopifycdn.com" },
      { protocol: "https", hostname: "cellcom.it" },
      { protocol: "https", hostname: "www.cellcom.it" },
      { protocol: "https", hostname: "italianparts.it" },
      { protocol: "https", hostname: "www.italianparts.it" },
      { protocol: "https", hostname: "fast-fix.it" },
      { protocol: "https", hostname: "www.fast-fix.it" },
      { protocol: "https", hostname: "cellcom.vercel.app" },
      // CRM dev locale: il CRM Next.js può girare su :3000, :3001 o :3002
      // a seconda del setup. Teniamo tutte e tre le porte per compat.
      { protocol: "http", hostname: "127.0.0.1", port: "3000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "127.0.0.1", port: "3001" },
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "http", hostname: "127.0.0.1", port: "3002" },
      { protocol: "http", hostname: "localhost", port: "3002" },
    ],
  },

  // Security headers applied at build time — middleware.ts adds dynamic CSP
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

/**
 * Bundle analyzer attivabile con `ANALYZE=true npm run build`.
 * Genera due report HTML (.next/analyze) — utili per individuare chunk
 * grossi (Three.js, framer-motion, react-three/drei).
 */
const analyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

export default analyzer(nextConfig);
