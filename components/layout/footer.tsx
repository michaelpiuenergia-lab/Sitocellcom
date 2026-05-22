import { LogoC } from "@/components/marketing/logo-c";

const brands = [
  { name: "Cellcom.it", role: "B2B", url: "https://cellcom.it" },
  { name: "Fast-Fix.it", role: "Negozi", url: "https://fast-fix.it" },
  { name: "ItalianParts.it", role: "Ricambi", url: "https://italianparts.it" },
  { name: "SmartphoneFix.it", role: "Corsi", url: "https://smartphonefix.it" },
  { name: "FixHub.it", role: "Gestionale per laboratori", url: "https://fixhub.it" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoC className="w-6 h-6" />
              <span className="font-sans font-semibold text-sm tracking-[0.12em] uppercase text-foreground">
                Cellcom Group
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Phone Lifecycle Hub. Un solo gruppo, cinque brand, una sola fiducia.
            </p>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="font-sans font-semibold text-sm text-foreground mb-4">
              Servizi
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="/prodotti"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prodotti
                </a>
              </li>
              <li>
                <a
                  href="/riparazioni"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Riparazioni
                </a>
              </li>
              <li>
                <a
                  href="/corsi"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Corsi
                </a>
              </li>
              <li>
                <a
                  href="/negozi"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Negozi
                </a>
              </li>
            </ul>
          </div>

          {/* I Nostri Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-sans font-semibold text-sm text-foreground mb-4">
              I Nostri Brand
            </h4>
            <ul className="flex flex-col gap-2">
              {brands.map((brand) => (
                <li key={brand.url}>
                  <a
                    href={brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex flex-col"
                  >
                    <span>{brand.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {brand.role}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-sans font-semibold text-sm text-foreground mb-4">
              Contatti
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">info@cellcom.it</li>
              <li className="text-sm text-muted-foreground">+39 000 000 0000</li>
              <li className="text-sm text-muted-foreground">
                Via Roma 1, 43100 Parma (PR), Italia
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans font-semibold text-sm text-foreground mb-4">
              Legal
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termini e Condizioni
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cellcom Group. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-muted-foreground">
            P.IVA IT00000000000 — Cellcom S.r.l.
          </p>
        </div>
      </div>
    </footer>
  );
}
