import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";
import { getCourses } from "@/lib/crm-client";
import { COURSE_LEVEL_LABELS, type CoursePublic } from "@/lib/crm-client/types";

export const metadata: Metadata = {
  title: "Corsi — Cellcom Group",
  description:
    "Corsi di riparazione smartphone per professionisti e hobbisti. Formazione pratica su tutti i modelli.",
};

export const revalidate = 300;

const TOOLS = [
  "Microscopio Mantis triangolare",
  "Stazione ad aria calda + preheater",
  "Postazioni ESD a norma",
  "Multimetro da banco + oscilloscopio",
  "Programmatori NAND multi-modello",
  "Stencil BGA per i chip più diffusi",
];

const eur = (cents: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

export default async function CorsiPage() {
  // Source-of-truth: CRM Cellcom Academy. Fallback su lista vuota se CRM giù.
  const data = await getCourses().catch(() => ({ items: [] as CoursePublic[], total: 0 }));
  const courses = data.items;

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Corsi" }]} />

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
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
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
                  name: "Cellcom Academy — Richiesta iscrizione",
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
            <p
              className="font-mono uppercase mt-2"
              style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
            >
              Iscrizione su approvazione · Pagamento online · Materiale incluso
            </p>
          </div>
        </div>
      </section>

      {/* LIVELLI dinamici dal CRM (nero) */}
      <section id="livelli" aria-label="Livelli del corso" style={{ backgroundColor: "#0a0a0a" }}>
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
                I livelli
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
              style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
            >
              Il percorso completo è pensato per crescere: ogni livello apre il
              successivo. Puoi anche entrare direttamente dal Base o
              dall&apos;Intermedio se hai già esperienza — chiediamo solo una
              breve chiamata di valutazione.
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              {courses.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i + 1} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "15px", color: "#737373" }}>
              Calendario in aggiornamento. Apri una richiesta info per le
              prossime date in partenza →
            </p>
          )}
        </div>
      </section>

      {/* STRUMENTAZIONE (bianco) */}
      <section aria-label="Strumentazione e laboratorio" style={{ backgroundColor: "#ffffff" }}>
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
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA finale (nero) */}
      <section aria-label="Iscrizioni" style={{ backgroundColor: "#0a0a0a" }}>
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
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "560px" }}
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

function CourseCard({ course, index }: { course: CoursePublic; index: number }) {
  return (
    <div
      className="rounded-2xl p-7 lg:p-8 flex flex-col gap-4 transition-colors duration-300 hover:border-[#dc2626]"
      style={{ backgroundColor: "#141414", border: "1px solid #1f1f1f" }}
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
          {String(index).padStart(2, "0")}
        </span>
        {course.durationLabel && (
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
          >
            {course.durationLabel}
          </span>
        )}
      </div>
      <h3
        className="font-sans"
        style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#fafafa", fontWeight: 700 }}
      >
        {course.title}
      </h3>
      <span
        className="font-mono uppercase self-start px-2 py-0.5 rounded-full"
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          backgroundColor: "rgba(220,38,38,0.12)",
          color: "#f87171",
        }}
      >
        {COURSE_LEVEL_LABELS[course.level]}
      </span>
      {course.description && (
        <p className="leading-relaxed" style={{ fontSize: "14px", color: "#a3a3a3" }}>
          {course.description}
        </p>
      )}
      <div className="mt-auto flex items-end justify-between gap-3">
        {course.priceCents != null ? (
          <span className="tabular-nums" style={{ fontSize: "20px", color: "#fafafa", fontWeight: 700 }}>
            {eur(course.priceCents)}
          </span>
        ) : (
          <span style={{ fontSize: "13px", color: "#737373" }}>Prezzo su richiesta</span>
        )}
        {course.paymentLink ? (
          <a
            href={course.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600 }}
          >
            Iscriviti ↗
          </a>
        ) : (
          <RequestTrigger
            kind="info"
            product={{
              id: course.id,
              slug: course.slug ?? null,
              name: `Cellcom Academy — ${course.title}`,
              variantId: null,
              variantLabel: null,
            }}
            label="Iscriviti →"
            variant="outline"
            className="text-xs"
          />
        )}
      </div>
    </div>
  );
}
