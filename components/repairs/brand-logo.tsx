"use client";

import { useState } from "react";
import { brandSlug } from "@/lib/repairs/devices";

/**
 * Logo brand servito dal CDN locale `/brand-logos/<slug>.svg` (file SVG
 * monocromi simple-icons scaricati una volta in public/brand-logos/).
 *
 * Niente piu' dipendenza runtime da cdn.simpleicons.org. Fallback al nome
 * stilizzato per brand non disponibili (Realme, alcatel, Nothing).
 *
 * Per colorare: applica un CSS filter alla img cosi' il SVG nero diventa
 * della tonalita' giusta. Soluzione robusta per asset monocromi.
 */
export function BrandLogo({
  name,
  size = 40,
  color = "525252",
  className,
}: {
  name: string;
  size?: number;
  /** Hex senza #. 525252 = grigio scuro default, dc2626 = brand rosso quando attivo. */
  color?: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const slug = brandSlug(name);

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

  // CSS filter per colorare l'SVG nero → tonalita' target.
  // brightness(0) porta tutto a nero puro, poi invert + saturate + hue-rotate
  // posizionano sul colore. Per i 2 colori usati (525252 grigio, dc2626 rosso)
  // pre-calcolo i filter (calcolati con https://codepen.io/sosuke/pen/Pjoqqp).
  const filter = COLOR_FILTERS[color] ?? COLOR_FILTERS["525252"];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand-logos/${slug}.svg`}
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
        filter,
      }}
      onError={() => setErrored(true)}
    />
  );
}

// Filter CSS pre-calcolati per portare un SVG nero al colore target.
// Tool: https://codepen.io/sosuke/pen/Pjoqqp
const COLOR_FILTERS: Record<string, string> = {
  // 525252 (grigio scuro)
  "525252":
    "brightness(0) saturate(100%) invert(32%) sepia(0%) saturate(0%) hue-rotate(151deg) brightness(94%) contrast(86%)",
  // dc2626 (rosso brand)
  dc2626:
    "brightness(0) saturate(100%) invert(20%) sepia(89%) saturate(2950%) hue-rotate(348deg) brightness(86%) contrast(92%)",
  // 404040 (grigio piu scuro per active state)
  "404040":
    "brightness(0) saturate(100%) invert(22%) sepia(2%) saturate(0%) hue-rotate(159deg) brightness(96%) contrast(89%)",
  // 0a0a0a (quasi nero)
  "0a0a0a":
    "brightness(0) saturate(100%) invert(4%) sepia(11%) saturate(7%) hue-rotate(316deg) brightness(94%) contrast(101%)",
};
