import { ImageResponse } from "next/og";

/**
 * Immagine di anteprima per WhatsApp, Facebook, LinkedIn e Google.
 *
 * Prima i metadati puntavano a /og-image.png, che non è mai esistito: ogni
 * condivisione del sito mostrava un riquadro vuoto. Qui viene generata a
 * runtime da Next, quindi non c'è nessun file da mantenere allineato al
 * brand: se cambia il claim, cambia l'immagine.
 */

export const runtime = "edge";
export const alt =
  "Fast-Fix — riparazione smartphone a San Benedetto del Tronto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "72px",
        }}
      >
        {/* Mark + wordmark, gli stessi del sito */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "20px",
              backgroundColor: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 100 100">
              <path d="M58 12 L30 58 h16 l-6 30 L72 42 H54 z" fill="#ffffff" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            FAST-FIX
            <span style={{ color: "#dc2626" }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Riparazione smartphone
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "44px",
              color: "#dc2626",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            San Benedetto del Tronto
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            fontSize: "26px",
            color: "#a3a3a3",
            borderTop: "1px solid #262626",
            paddingTop: "28px",
          }}
        >
          <span>Diagnosi gratuita</span>
          <span style={{ color: "#404040" }}>·</span>
          <span>Preventivo in 24 ore</span>
          <span style={{ color: "#404040" }}>·</span>
          <span>Garanzia 12 mesi</span>
        </div>
      </div>
    ),
    size,
  );
}
