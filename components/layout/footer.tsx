import { LogoC } from "@/components/marketing/logo-c";
import { WowspaceCredit } from "@/components/credits/wowspace-credit";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

const LINKS: { key: keyof Dict; href: string }[] = [
  { key: "nav.products", href: "/prodotti" },
  { key: "nav.repairs", href: "/riparazioni" },
  { key: "nav.resell", href: "/rivendi" },
  { key: "nav.courses", href: "/corsi" },
  { key: "nav.stores", href: "/negozi" },
  { key: "nav.b2b", href: "/b2b" },
];

const LEGAL_LINKS: { key: keyof Dict; href: string }[] = [
  { key: "footer.legal.privacy", href: "#" },
  { key: "footer.legal.cookie", href: "#" },
  { key: "footer.legal.terms", href: "#" },
];

/**
 * Footer — minimalissimo, una sola riga.
 * Nero pieno, logo a sinistra, link inline, copyright a destra. Niente
 * colonne, niente 4 sezioni, niente padding gigante.
 */
export async function Footer() {
  const t = await getT();
  return (
    <footer
      aria-label="Footer"
      style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <a href="/" aria-label="Cellcom — home" className="shrink-0">
          <LogoC className="w-7 h-7" />
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-brand-500"
              style={{ fontSize: "13px", color: "#a3a3a3" }}
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="md:ml-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LEGAL_LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="font-mono uppercase transition-colors hover:text-brand-500"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: "#737373",
              }}
            >
              {t(l.key)}
            </a>
          ))}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "#525252",
            }}
          >
            © {new Date().getFullYear()} {t("footer.copyrightGroup")}
          </span>
        </div>
      </div>
      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-8"
        style={{ borderTop: "1px solid #1f1f1f", paddingTop: "24px" }}
      >
        <p
          className="text-center font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.06em",
            color: "#525252",
            lineHeight: 1.7,
          }}
        >
          CELLCOM SRLS · Via Calatafimi 52, 63074 San Benedetto del Tronto (AP) · P.IVA 02576350447 · PEC{" "}
          <a href="mailto:cellcom25@pec.it" className="hover:text-brand-500">cellcom25@pec.it</a> · Tel{" "}
          <a href="tel:+393444555678" className="hover:text-brand-500">+39 344 455 5678</a>
          <span className="mx-2">|</span>
          FAST-FIX di Sarker Srabon · Piazza G. Garibaldi 31, 63074 San Benedetto del Tronto (AP) · Tel{" "}
          <a href="tel:0735501637" className="hover:text-brand-500">0735 501637</a> · WhatsApp{" "}
          <a href="tel:+393208574006" className="hover:text-brand-500">320 857 4006</a>
        </p>
        <div className="flex justify-center mt-5">
          <WowspaceCredit variant="footer" />
        </div>
      </div>
    </footer>
  );
}
