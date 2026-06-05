"use client";

import { useState } from "react";
import { getBrand } from "@/lib/repairs/devices";

/**
 * Logo brand via cdn.simpleicons.org. Si carica come <img> con fallback al
 * nome del brand stilizzato se il CDN non risponde (offline / brand non
 * in simple-icons).
 *
 * CDN format: https://cdn.simpleicons.org/<slug>/<hex-color-no-#>
 * Esempio: https://cdn.simpleicons.org/apple/0a0a0a
 *
 * Niente install npm di 3000 icone — bastano i nostri 20-30 brand serviti
 * staticamente dal CDN simple-icons (lo stesso che la community usa).
 */
export function BrandLogo({
  name,
  size = 40,
  color = "525252",
  className,
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const brand = getBrand(name);
  const slug = brand?.slug ?? name.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (errored || !slug) {
    return (
      <span
        className={className}
        style={{
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: `#${color}`,
        }}
      >
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={className}
      style={{
        objectFit: "contain",
        objectPosition: "center",
        maxWidth: "100%",
        height: "auto",
      }}
      onError={() => setErrored(true)}
    />
  );
}
