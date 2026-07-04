/* eslint-disable @next/next/no-img-element */

/**
 * Badge UFFICIALI dei metodi di pagamento (SVG originali in /public/payments,
 * same-origin: CSP-safe). Klarna = badge rosa ufficiale; PayPal = wordmark
 * ufficiale, su chip bianco per restare leggibile anche su sfondi scuri.
 */

export function KlarnaBadge({ height = 24 }: { height?: number }) {
  return (
    <img
      src="/payments/klarna.svg"
      alt="Klarna"
      style={{ height, width: "auto", display: "inline-block" }}
    />
  );
}

export function PayPalBadge({ height = 24 }: { height?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md"
      style={{
        height,
        paddingInline: height * 0.35,
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5e5",
      }}
    >
      <img
        src="/payments/paypal.svg"
        alt="PayPal"
        style={{ height: height * 0.55, width: "auto", display: "inline-block" }}
      />
    </span>
  );
}

/**
 * Striscia "Pagamenti sicuri" con i badge, per footer (dark) o card (light).
 */
export function PaymentMethodsStrip({
  dark = false,
  height = 26,
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
