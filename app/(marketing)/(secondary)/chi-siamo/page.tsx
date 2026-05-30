import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Chi siamo — Cellcom Group",
  description:
    "Il Gruppo Cellcom è il punto di riferimento italiano per il ciclo di vita completo dello smartphone: vendita, riparazione, formazione e ricambistica.",
};

const stats = [
  { value: "20K+", label: "Prodotti a catalogo" },
  { value: "5", label: "Brand verticali" },
  { value: "24-48h", label: "Consegna in Italia" },
  { value: "12 mesi", label: "Garanzia ricambi" },
];

const brands = [
  {
    name: "Cellcom.it",
    role: "Magazzino B2B",
    description:
      "L'ingrosso del gruppo. Vendiamo a rivenditori, centri assistenza e aziende con listini a volumi.",
    url: "https://cellcom.it",
  },
  {
    name: "Fast-Fix.it",
    role: "Negozi e riparazioni",
    description:
      "I punti vendita fisici dove porti il telefono a riparare o vieni a comprarne uno nuovo.",
    url: "https://fast-fix.it",
  },
  {
    name: "ItalianParts.it",
    role: "Ricambi",
    description:
      "Display, batterie, scocche, schede madri. Per chi ripara smartphone di mestiere.",
    url: "https://www.italianparts.it",
  },
  {
    name: "Cellcom Academy",
    role: "Academy",
    description:
      "La scuola interna dove formiamo i nostri tecnici. Aperta anche a chi vuole imparare il mestiere.",
    url: "/corsi",
  },
];

const statements = [
  {
    num: "01",
    title: "Prezzi onesti",
    description:
      "Stessi listini su tutti i nostri canali. Quello che vedi al pubblico è quello che paga il pubblico — il B2B paga meno, ma solo se compra a volumi.",
  },
  {
    num: "02",
    title: "Ogni intervento tracciato",
    description:
      "Sei riparazioni o ordini entrano nel gestionale, lo vedi anche tu in tempo reale. Foto del device, ricambi usati, tecnico responsabile — tutto registrato.",
  },
  {
    num: "03",
    title: "Una specializzazione per brand",
    description:
      "I brand del Gruppo fanno ognuno una cosa sola e la fanno seriamente. Mettendoli insieme copriamo tutto il ciclo di vita del telefono.",
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chi siamo" }]} />

      {/* HERO bianco */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-16">
          <div className="max-w-4xl flex flex-col gap-5">
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: "#dc2626",
              }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              Il gruppo
            </span>
            <h1
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.02,
                color: "#0a0a0a",
                fontWeight: 700,
              }}
            >
              Cinque brand. Una sola{" "}
              <span style={{ color: "#dc2626" }}>fiducia.</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "19px",
                color: "#525252",
                maxWidth: "640px",
              }}
            >
              Vendiamo, ripariamo e riforniamo telefoni. Siamo di San Benedetto
              del Tronto, ma lavoriamo in tutta Italia. Tre brand specializzati,
              un magazzino solo, le stesse persone dietro a tutto.
            </p>
          </div>
        </div>
      </section>

      {/* STATS (nero) */}
      <section
        aria-label="Numeri del gruppo"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 lg:gap-x-12">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <span
                  className="font-sans tabular-nums leading-none"
                  style={{
                    fontSize: "clamp(40px, 4.5vw, 64px)",
                    letterSpacing: "-0.025em",
                    color: "#fafafa",
                    fontWeight: 700,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#a3a3a3",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 BRAND (bianco) */}
      <section
        aria-label="I cinque brand del gruppo"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
            <div className="flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.32em",
                  color: "#dc2626",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                I 5 brand
              </span>
              <h2
                className="font-sans tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(32px, 4.2vw, 56px)",
                  lineHeight: 1.05,
                  color: "#0a0a0a",
                  fontWeight: 700,
                }}
              >
                Un gruppo,{" "}
                <span style={{ color: "#dc2626" }}>cinque specializzazioni.</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
            >
              Ogni marchio fa una cosa sola e la fa bene. Insieme coprono
              l'intero ciclo di vita del telefono: vendita, riparazione,
              ricambi, formazione, software. Stesso magazzino, stessi
              standard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {brands.map((brand) => (
              <a
                key={brand.name}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl p-7 lg:p-8 flex flex-col gap-3 transition-colors duration-300 hover:border-[#dc2626]"
                style={{
                  backgroundColor: "#fafaf8",
                  border: "1px solid #ececec",
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className="font-sans"
                    style={{
                      fontSize: "22px",
                      letterSpacing: "-0.02em",
                      color: "#0a0a0a",
                      fontWeight: 700,
                    }}
                  >
                    {brand.name}
                  </h3>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: "#dc2626", fontSize: "18px" }}
                  >
                    ↗
                  </span>
                </div>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    color: "#dc2626",
                  }}
                >
                  {brand.role}
                </span>
                <p
                  className="leading-relaxed mt-1"
                  style={{ fontSize: "14px", color: "#525252" }}
                >
                  {brand.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO (nero) */}
      <section
        aria-label="I principi del gruppo"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="flex flex-col gap-5 max-w-2xl mb-16">
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: "#dc2626",
              }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              Cosa ci distingue
            </span>
            <h2
              className="font-sans tracking-[-0.025em]"
              style={{
                fontSize: "clamp(32px, 4.2vw, 56px)",
                lineHeight: 1.05,
                color: "#fafafa",
                fontWeight: 700,
              }}
            >
              Tre principi,{" "}
              <span style={{ color: "#dc2626" }}>non negoziabili.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {statements.map((s) => (
              <div
                key={s.num}
                className="flex flex-col gap-4 pt-7"
                style={{ borderTop: "1px solid #1f1f1f" }}
              >
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.28em",
                    color: "#dc2626",
                  }}
                >
                  {s.num}
                </span>
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "26px",
                    letterSpacing: "-0.02em",
                    color: "#fafafa",
                    fontWeight: 700,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "15px", color: "#a3a3a3" }}
                >
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
