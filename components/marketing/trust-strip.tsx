"use client";

import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";

/**
 * Trust strip — 4 punti rassicurazione tra l'Hero e il 3D scroll.
 * Ispirato alla sezione "trust" del sample design (sample-2 v2): valore grande
 * + descrizione sotto, 4 colonne orizzontali allineate al brand del Gruppo.
 *
 * Niente emoji nel design system — uso icone SVG inline. Niente animazioni
 * pesanti — questa sezione deve passare in fretta e dare conferma.
 */

type Item = {
  iconId: "shipping" | "warranty" | "technician" | "b2b";
  valueKey: keyof Dict;
  descKey: keyof Dict;
};

const ITEMS: Item[] = [
  { iconId: "shipping", valueKey: "trust.shipping.value", descKey: "trust.shipping.desc" },
  { iconId: "warranty", valueKey: "trust.warranty.value", descKey: "trust.warranty.desc" },
  { iconId: "technician", valueKey: "trust.technician.value", descKey: "trust.technician.desc" },
  { iconId: "b2b", valueKey: "trust.b2b.value", descKey: "trust.b2b.desc" },
];

export function TrustStrip() {
  const { t } = useLang();
  return (
    <section
      aria-label="Garanzie e servizi"
      style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {ITEMS.map((item) => (
            <div
              key={item.iconId}
              className="flex items-start gap-3 sm:gap-4"
            >
              <div
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ececec",
                  color: "#dc2626",
                }}
              >
                <TrustIcon id={item.iconId} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span
                  className="font-sans tracking-[-0.01em] leading-tight"
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#0a0a0a",
                  }}
                >
                  {t(item.valueKey)}
                </span>
                <span
                  className="leading-snug"
                  style={{ fontSize: "13px", color: "#525252" }}
                >
                  {t(item.descKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustIcon({ id }: { id: Item["iconId"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "shipping":
      return (
        <svg {...common}>
          <path d="M2.5 7h11v10H2.5z" />
          <path d="M13.5 10h4l3 3v4h-7" />
          <circle cx="6" cy="18.5" r="2" />
          <circle cx="17" cy="18.5" r="2" />
        </svg>
      );
    case "warranty":
      return (
        <svg {...common}>
          <path d="M12 2.5l8 3.5v6c0 4.5-3.4 7.5-8 9.5-4.6-2-8-5-8-9.5v-6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "technician":
      return (
        <svg {...common}>
          <path d="M14.5 4.5a3 3 0 1 0-3 5l-6 6a2 2 0 1 0 2.8 2.8l6-6a3 3 0 0 0 5-3l-2.4 2.4-2-2z" />
        </svg>
      );
    case "b2b":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="13" rx="1.5" />
          <path d="M8 8V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V8" />
          <path d="M3 13h18" />
          <path d="M11 12.5v2" />
        </svg>
      );
  }
}
