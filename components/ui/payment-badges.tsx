/**
 * Badge dei metodi di pagamento (Klarna, PayPal) come si vedono nei footer
 * e nei checkout degli e-commerce. Wordmark ricreati inline (niente asset
 * esterni: CSP-safe), colori brand ufficiali.
 */

export function KlarnaBadge({ height = 24 }: { height?: number }) {
  return (
    <span
      aria-label="Klarna"
      className="inline-flex items-center justify-center rounded-md"
      style={{
        height,
        paddingInline: height * 0.45,
        backgroundColor: "#FFB3C7",
        color: "#0A0B09",
        fontWeight: 800,
        fontSize: height * 0.5,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      Klarna.
    </span>
  );
}

export function PayPalBadge({ height = 24 }: { height?: number }) {
  return (
    <span
      aria-label="PayPal"
      className="inline-flex items-center justify-center rounded-md"
      style={{
        height,
        paddingInline: height * 0.45,
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5e5",
        fontStyle: "italic",
        fontWeight: 800,
        fontSize: height * 0.5,
        letterSpacing: "-0.01em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: "#003087" }}>Pay</span>
      <span style={{ color: "#0070BA" }}>Pal</span>
    </span>
  );
}

/**
 * Striscia "Pagamenti sicuri" con i badge, per footer (dark) o card (light).
 */
export function PaymentMethodsStrip({
  dark = false,
  height = 24,
}: {
  dark?: boolean;
  height?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          color: dark ? "#737373" : "#525252",
        }}
      >
        Pagamenti sicuri
      </span>
      <KlarnaBadge height={height} />
      <PayPalBadge height={height} />
    </div>
  );
}
