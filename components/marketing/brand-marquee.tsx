/**
 * Marquee orizzontale dei brand presenti nel catalogo. Loop infinito CSS-only,
 * 40s per giro. Effetto "tanti brand sotto un solo tetto" senza occupare spazio
 * verticale eccessivo.
 *
 * - Niente immagini esterne: nomi in font-mono uppercase con separatore "+".
 * - Su prefers-reduced-motion l'animazione si ferma.
 */

const BRANDS = [
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
] as const;

export function BrandMarquee() {
  return (
    <section className="relative border-y border-border bg-card/20 overflow-hidden py-6">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
        style={{
          background:
            "linear-gradient(to right, var(--color-background), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
        style={{
          background:
            "linear-gradient(to left, var(--color-background), transparent)",
        }}
      />
      <div className="marquee">
        <div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="font-mono text-sm tracking-[0.2em] uppercase text-muted-foreground/70 flex items-center gap-12 shrink-0"
            >
              {b}
              <span className="text-brand-600/50" aria-hidden>
                ◢
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
