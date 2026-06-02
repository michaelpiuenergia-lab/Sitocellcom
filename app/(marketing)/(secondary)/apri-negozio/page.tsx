import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";

export const metadata: Metadata = {
  title: "Apri un negozio — Cellcom Group",
  description:
    "Vuoi aprire il tuo negozio di telefonia? Cellcom ti accompagna passo per passo: consulenza, formazione tecnica, fornitura ricambi e accessori, setup negozio e accesso al CRM. Supporto continuo dopo l'apertura.",
};

const STEPS = [
  {
    n: "01",
    title: "Consulenza iniziale",
    text: "Analizziamo zona, target e investimento. Definiamo insieme format del punto vendita, mix prodotti, listino e margini realistici.",
  },
  {
    n: "02",
    title: "Formazione e Academy",
    text: "Mandiamo te o il tuo tecnico in Cellcom Academy: base, intermedio o avanzato BGA. Esci con un attestato e operatività vera dal primo giorno.",
  },
  {
    n: "03",
    title: "Fornitura e magazzino",
    text: "Listino B2B Cellcom riservato: telefoni nuovi, ricondizionati, ricambi originali, accessori. Ordini rapidi dal portale, spedizione 24-48h.",
  },
  {
    n: "04",
    title: "Setup negozio + CRM",
    text: "Layout, banco di lavoro, strumentazione consigliata, branding. Accesso al gestionale Cellcom per ticket riparazione, magazzino, fatture.",
  },
  {
    n: "05",
    title: "Supporto continuo",
    text: "Linea diretta con il laboratorio Fast-Fix per le riparazioni difficili. Aggiornamenti su nuovi modelli, prezzi, listini stagionali.",
  },
];

const INCLUDED = [
  "Consulenza pre-apertura (zona, format, mix prodotti)",
  "Accesso al listino B2B Cellcom riservato",
  "Formazione tecnica Academy (1-3 livelli)",
  "Setup CRM e account B2B per ordini rapidi",
  "Supporto laboratorio Fast-Fix sulle riparazioni complesse",
  "Aggiornamenti su nuovi modelli e listini",
];

export default function ApriNegozioPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apri un negozio" }]} />

      {/* HERO bianco */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-20">
          <div className="max-w-3xl flex flex-col gap-5">
            <span
              className="font-mono uppercase inline-flex items-center gap-3"
              style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-9"
                style={{ backgroundColor: "#dc2626" }}
              />
              Apri il tuo negozio
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
              Da zero al tuo{" "}
              <span style={{ color: "#dc2626" }}>negozio aperto.</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
            >
              Ti accompagniamo passo per passo: consulenza, formazione, fornitura,
              setup negozio, accesso al CRM e supporto continuo. Niente franchising,
              niente royalty — solo i nostri prezzi B2B + il know-how del gruppo.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <RequestTrigger
                kind="info"
                product={{
                  id: null,
                  slug: null,
                  name: "Apri un negozio Cellcom — richiesta consulenza",
                  variantId: null,
                  variantLabel: null,
                }}
                label="Parla con un consulente →"
                className="px-7 py-3.5 rounded-full"
              />
              <Link
                href="#percorso"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#0a0a0a",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "#ffffff",
                }}
              >
                Vedi il percorso
              </Link>
            </div>
            <p
              className="font-mono uppercase mt-2"
              style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
            >
              Risposta entro 24h · Consulenza iniziale gratuita
            </p>
          </div>
        </div>
      </section>

      {/* PERCORSO 5 step (nero) */}
      <section
        id="percorso"
        aria-label="Percorso passo per passo"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
            <div className="flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                Il percorso, 5 step
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
                Dalla prima chiamata{" "}
                <span style={{ color: "#dc2626" }}>al primo cliente.</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
            >
              Niente promesse vaghe — ogni step ha un esito misurabile e tempi
              chiari. Quando arrivi all'apertura sai già come stai, cosa hai in
              magazzino e a chi rivolgerti se serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl p-7 lg:p-8 flex flex-col gap-4 transition-colors duration-300 hover:border-[#dc2626]"
                style={{ backgroundColor: "#141414", border: "1px solid #1f1f1f" }}
              >
                <span
                  className="font-sans tabular-nums leading-none"
                  style={{
                    fontSize: "32px",
                    letterSpacing: "-0.02em",
                    color: "#dc2626",
                    fontWeight: 700,
                  }}
                >
                  {s.n}
                </span>
                <h3
                  className="font-sans"
                  style={{ fontSize: "20px", color: "#fafafa", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p className="leading-relaxed" style={{ fontSize: "14px", color: "#a3a3a3" }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSA INCLUDE (bianco) */}
      <section aria-label="Cosa è incluso" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1fr,1.1fr] gap-10 lg:gap-20 items-start">
            <div className="flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                Cosa è incluso
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
                Quello che ti serve davvero —{" "}
                <span style={{ color: "#dc2626" }}>nient'altro.</span>
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
              >
                Non vendiamo franchising in scatola, vendiamo ricambi e telefoni
                e un metodo. Il negozio resta tuo, il listino resta nostro.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {INCLUDED.map((i) => (
                <li
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ backgroundColor: "#fafaf8", border: "1px solid #ececec" }}
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: "#dc2626" }}
                  />
                  <span
                    className="font-sans"
                    style={{ fontSize: "14px", color: "#0a0a0a", fontWeight: 500, lineHeight: 1.45 }}
                  >
                    {i}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA finale (nero) */}
      <section aria-label="Inizia" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24 lg:py-28 text-center">
          <h2
            className="font-sans tracking-[-0.025em]"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: 1.05,
              color: "#fafafa",
              fontWeight: 700,
            }}
          >
            Partiamo dalla{" "}
            <span style={{ color: "#dc2626" }}>chiacchierata.</span>
          </h2>
          <p
            className="mx-auto mt-6 leading-relaxed"
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "560px" }}
          >
            Lasciaci 3 informazioni — chi sei, dove vuoi aprire, cosa hai già.
            Un nostro consulente ti richiama entro 24 ore.
          </p>
          <div className="flex justify-center mt-8">
            <RequestTrigger
              kind="info"
              product={{
                id: null,
                slug: null,
                name: "Apri un negozio Cellcom — primo contatto",
                variantId: null,
                variantLabel: null,
              }}
              label="Richiedi consulenza gratuita →"
              className="px-7 py-3.5 rounded-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
