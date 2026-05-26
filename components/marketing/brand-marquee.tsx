/**
 * BrandStrip — banner ROSSO Cellcom che cammina.
 *
 * Striscia stretta (py-3.5 lg:py-4) montata in cima alla pagina, subito
 * sotto la navbar. Fondo rosso brand pieno, testi bianchi, marquee
 * orizzontale infinita. Sempre visibile nel primo fold.
 */

const ITEMS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Google Pixel",
  "Huawei",
  "OnePlus",
  "OPPO",
  "Honor",
  "Realme",
  "Motorola",
  "Nothing",
  "Asus",
  "Spedizione 24-48h",
  "Garanzia 12 mesi",
  "Ritiro gratis in negozio",
  "Stock verificato dal CRM",
] as const;

export function BrandMarquee() {
  return (
    <section
      aria-label="Brand e servizi"
      className="relative"
      style={{ backgroundColor: "#dc2626" }}
    >
      <div className="py-3 sm:py-3.5 lg:py-4">
        <div className="marquee">
          <div className="marquee-track">
            {[...ITEMS, ...ITEMS].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="font-mono uppercase flex items-center gap-8 sm:gap-10 shrink-0"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.28em",
                  color: "#ffffff",
                }}
              >
                {b}
                <span
                  aria-hidden
                  className="w-px h-3 inline-block"
                  style={{ background: "#ffffff", opacity: 0.45 }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
