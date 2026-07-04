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
        Pagamenti sicuri · anche in 3 rate
      </span>
      <KlarnaBadge height={height} />
      <PayPalBadge height={height} />
    </div>
  );
}

/**
 * Banner "Paga in 3 rate": comunica al cliente che riparazioni e acquisti
 * si possono pagare subito o in 3 rate senza interessi con Klarna/PayPal.
 */
export function PayIn3Banner() {
  return (
    <section aria-label="Pagamenti a rate" style={{ backgroundColor: "#fafaf8" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14">
        <div
          className="flex flex-col items-center gap-5 rounded-2xl px-8 py-10 text-center"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ececec",
            boxShadow: "0 24px 60px -28px rgba(0,0,0,0.10)",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
          >
            Pagamenti flessibili
          </span>
          <h2
            className="font-sans tracking-[-0.02em]"
            style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.1 }}
          >
            Paga subito o in 3 rate senza interessi
          </h2>
          <p style={{ fontSize: "15px", color: "#525252", maxWidth: "560px", lineHeight: 1.65 }}>
            Riparazioni e acquisti si possono pagare anche in 3 comode rate
            mensili, senza interessi, con Klarna o PayPal. Chiedi il link di
            pagamento in negozio oppure ricevilo direttamente su WhatsApp:
            paghi dal telefono in pochi secondi.
          </p>
          <div className="flex items-center gap-4">
            <KlarnaBadge height={30} />
            <PayPalBadge height={30} />
          </div>
        </div>
      </div>
    </section>
  );
}
