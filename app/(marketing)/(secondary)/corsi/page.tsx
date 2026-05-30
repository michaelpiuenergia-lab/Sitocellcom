import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";

export const metadata: Metadata = {
  title: "Corsi — Cellcom Group",
  description:
    "Corsi di riparazione smartphone per professionisti e hobbisti. Formazione pratica su tutti i modelli.",
};

const LEVELS = [
  {
    n: "01",
    title: "Base",
    duration: "2 giornate",
    text: "Smontaggio/montaggio iPhone e Android, sostituzione schermo e batteria, gestione adesivi e guarnizioni. Pensato per chi parte da zero o vuole formalizzare le basi.",
  },
  {
    n: "02",
    title: "Intermedio",
    duration: "3 giornate",
    text: "Riparazione scocca, vetro posteriore, fotocamera, connettore di ricarica. Calibrazione True Tone, sigillatura impermeabile. Uso del microscopio.",
  },
  {
    n: "03",
    title: "Avanzato · BGA",
    duration: "5 giornate",
    text: "Microsaldatura, riparazione scheda madre, gestione ball BGA, dump NAND, recupero dati. Postazioni ESD, stazione ad aria calda professionale.",
  },
];

const TOOLS = [
  "Microscopio Mantis triangolare",
  "Stazione ad aria calda + preheater",
  "Postazioni ESD a norma",
  "Multimetro da banco + oscilloscopio",
  "Programmatori NAND multi-modello",
  "Stencil BGA per i chip più diffusi",
];

export default function CorsiPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Corsi" }]} />

      {/* HERO bianco */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-20">
          <div className="max-w-3xl flex flex-col gap-5">
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
              Cellcom Academy
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
              Impara a riparare,{" "}
              <span style={{ color: "#dc2626" }}>come un tecnico vero.</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "19px",
                color: "#525252",
                maxWidth: "640px",
              }}
            >
              Tre livelli — base, intermedio, avanzato BGA. Postazioni ESD,
              strumentazione professionale, gli stessi formatori che addestrano
              i tecnici del Gruppo prima di mandarli in laboratorio. Attestato
              di frequenza e corsia preferenziale per assunzioni interne.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <RequestTrigger
                kind="info"
                product={{
                  id: null,
                  slug: null,
                  name: "Cellcom Academy — Corsi di riparazione",
                  variantId: null,
                  variantLabel: null,
                }}
                label="Richiedi info iscrizioni →"
                className="px-7 py-3.5 rounded-full"
              />
              <Link
                href="#livelli"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#0a0a0a",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "#ffffff",
                }}
              >
                Confronta i livelli
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 LIVELLI (nero) */}
      <section
        id="livelli"
        aria-label="Livelli del corso"
        style={{ backgroundColor: "#0a0a0a" }}
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
                Tre livelli, in crescita
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
                Dal primo screen{" "}
                <span style={{ color: "#dc2626" }}>alla microsaldatura BGA.</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "17px",
                color: "#a3a3a3",
                maxWidth: "520px",
              }}
            >
              Il percorso completo è pensato per crescere: ogni livello apre il
              successivo. Puoi anche entrare direttamente dal Base o
              dall'Intermedio se hai già esperienza — chiediamo solo una breve
              chiamata di valutazione.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {LEVELS.map((l) => (
              <div
                key={l.n}
                className="rounded-2xl p-7 lg:p-8 flex flex-col gap-4 transition-colors duration-300 hover:border-[#dc2626]"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #1f1f1f",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-sans tabular-nums leading-none"
                    style={{
                      fontSize: "32px",
                      letterSpacing: "-0.02em",
                      color: "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    {l.n}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.28em",
                      color: "#737373",
                    }}
                  >
                    {l.duration}
                  </span>
                </div>
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "22px",
                    letterSpacing: "-0.02em",
                    color: "#fafafa",
                    fontWeight: 700,
                  }}
                >
                  {l.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14px", color: "#a3a3a3" }}
                >
                  {l.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRUMENTAZIONE (bianco) */}
      <section
        aria-label="Strumentazione e laboratorio"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1fr,1.1fr] gap-10 lg:gap-20 items-start">
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
                Strumentazione
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
                Tutto quello che usano i{" "}
                <span style={{ color: "#dc2626" }}>nostri tecnici.</span>
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
              >
                Niente lezione frontale: dal primo giorno hai sotto le mani la
                stessa strumentazione professionale che usiamo in laboratorio,
                con un istruttore in postazione. Le aule sono limitate a 6
                allievi per garantire seguito reale.
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3">
              {TOOLS.map((t) => (
                <li
                  key={t}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{
                    backgroundColor: "#fafaf8",
                    border: "1px solid #ececec",
                  }}
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: "#dc2626" }}
                  />
                  <span
                    className="font-sans"
                    style={{
                      fontSize: "14px",
                      color: "#0a0a0a",
                      fontWeight: 500,
                      lineHeight: 1.45,
                    }}
                  >
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA finale (nero) */}
      <section
        aria-label="Iscrizioni"
        style={{ backgroundColor: "#0a0a0a" }}
      >
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
            Iscriviti al prossimo{" "}
            <span style={{ color: "#dc2626" }}>corso in partenza.</span>
          </h2>
          <p
            className="mx-auto mt-6 leading-relaxed"
            style={{
              fontSize: "17px",
              color: "#a3a3a3",
              maxWidth: "560px",
            }}
          >
            Calendario, prezzi tier (privati / centri assistenza / scuole) e
            agevolazioni: ti rispondiamo entro 24h con tutto quello che ti serve.
          </p>
          <div className="flex justify-center mt-8">
            <RequestTrigger
              kind="info"
              product={{
                id: null,
                slug: null,
                name: "Cellcom Academy — Iscrizione corso",
                variantId: null,
                variantLabel: null,
              }}
              label="Richiedi calendario e iscrizione →"
              className="px-7 py-3.5 rounded-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
