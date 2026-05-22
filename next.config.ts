import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Vercel region + runtime
  // https://vercel.com/docs/concepts/edge-network/regions
  // fra1 = Frankfurt (EU Central)

  // Path con spazi sotto OneDrive confondono Turbopack: ancoriamo la root.
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
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

export default nextConfig;
