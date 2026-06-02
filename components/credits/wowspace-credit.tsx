/**
 * Credit creatore: logo Wowspace + wordmark + tagline, link a wowspaceweb.com.
 * Pattern già usato su Ristorantino e altri siti del network.
 *
 * Variants:
 * - "footer": compatto, due righe (nome + tagline), per il fondo pagina
 * - "inline": orizzontale, una riga (per nav o pannelli compatti)
 */

type Variant = "footer" | "inline";

const TARGET_URL = "https://wowspaceweb.com";

export function WowspaceCredit({ variant = "footer" }: { variant?: Variant }) {
  if (variant === "inline") {
    return (
      <a
        href={TARGET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-100"
        style={{ opacity: 0.7 }}
        aria-label="Sito realizzato da Wowspace"
      >
        <img
          src="/wowspace-logo.svg"
          alt=""
          width={14}
          height={14}
          style={{ display: "block" }}
        />
        <span
          className="font-mono uppercase"
          style={{ fontSize: "9.5px", letterSpacing: "0.22em", color: "#525252" }}
        >
          by Wowspace
        </span>
      </a>
    );
  }

  return (
    <a
      href={TARGET_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-100"
      style={{ opacity: 0.75 }}
      aria-label="Sito progettato e realizzato da Wowspace — wowspaceweb.com"
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}
      >
        Progettato e realizzato da
      </span>
      <img
        src="/wowspace-logo.svg"
        alt=""
        width={18}
        height={18}
        style={{ display: "block" }}
      />
      <span className="flex flex-col leading-tight">
        <span
          className="font-sans"
          style={{
            fontSize: "13px",
            color: "#fafafa",
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          Wowspace
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8.5px", letterSpacing: "0.24em", color: "#737373" }}
        >
          Sites · CRM · AI Systems
        </span>
      </span>
    </a>
  );
}
