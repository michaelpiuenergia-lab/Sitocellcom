import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";

export const metadata: Metadata = {
  title: "Diventa partner — Cellcom Group",
  description:
    "Punto riparazione partner Fast-Fix: ricambi originali a listino B2B, supporto laboratorio sulle riparazioni complesse, accesso al CRM per ticket. Per chi ripara di mestiere.",
};

const BENEFITS = [
  {
    n: "01",
    title: "Listino ricambi B2B",
    text: "Display, batterie, scocche, schede madri originali Apple/Samsung/Google. Listino dedicato ai centri assistenza con sconti a volumi.",
  },
  {
    n: "02",
    title: "Supporto laboratorio Fast-Fix",
    text: "Le riparazioni che non vuoi fare in laboratorio le mandi a noi: microsaldatura, BGA, recupero dati. Costo trasparente, garanzia su lavoro e ricambi.",
  },
  {
    n: "03",
    title: "Accesso al gestionale",
    text: "Apri ticket di riparazione che ti rigiriamo gestiti dal CRM Cellcom. Il cliente del cliente vede stato e preventivo in tempo reale.",
  },
];

const REQUIREMENTS = [
  "Partita IVA attiva — centro assistenza, telefonia o elettronica",
  "Esperienza pratica su riparazione smartphone",
  "Volume minimo ordini ricambi (per accedere al listino partner)",
  "Adesione ai nostri standard qualità (ricambi originali, garanzia 12 mesi)",
];

export default function DiventaPartnerPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Diventa partner" }]} />

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
              Network Fast-Fix
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
              Diventa punto{" "}
              <span style={{ color: "#dc2626" }}>riparazione partner.</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
            >
              Hai già un laboratorio o un negozio di riparazioni? Entri nel network
              Fast-Fix: ricambi originali a listino B2B, supporto sulle riparazioni
              complesse, accesso al CRM per ticket e tracking. Niente fee d'ingresso,
              niente esclusiva — solo il nostro magazzino + il nostro laboratorio.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <RequestTrigger
                kind="b2b-quote"
                product={{
                  id: null,
                  slug: null,
                  name: "Diventa partner Fast-Fix — richiesta accordo",
                  variantId: null,
                  variantLabel: null,
                }}
                label="Candidati come partner →"
                className="px-7 py-3.5 rounded-full"
              />
              <Link
                href="#vantaggi"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#0a0a0a",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "#ffffff",
                }}
              >
                Cosa includi
              </Link>
            </div>
            <p
              className="font-mono uppercase mt-2"
              style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
            >
              Approvazione P.IVA · Risposta entro 24h · Nessuna fee d'ingresso
            </p>
          </div>
        </div>
      </section>

      {/* 3 VANTAGGI (nero) */}
      <section
        id="vantaggi"
        aria-label="Cosa ottieni come partner"
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
                Tre cose, fatte bene
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
                Ricambi, supporto,{" "}
                <span style={{ color: "#dc2626" }}>e un gestionale serio.</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
            >
              Niente sigle vuote — sai esattamente cosa ti diamo, cosa ci aspettiamo,
              e a chi telefonare quando arriva la riparazione difficile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.n}
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
                  {b.n}
                </span>
                <h3
                  className="font-sans"
                  style={{ fontSize: "20px", color: "#fafafa", fontWeight: 700 }}
                >
                  {b.title}
                </h3>
                <p className="leading-relaxed" style={{ fontSize: "14px", color: "#a3a3a3" }}>
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUISITI (bianco) */}
      <section aria-label="Requisiti" style={{ backgroundColor: "#ffffff" }}>
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
                Requisiti
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
                Per chi <span style={{ color: "#dc2626" }}>ripara di mestiere.</span>
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
              >
                Il network è selezionato — non tutti entrano. Filtriamo per garantire
                qualità ai clienti finali e margini sani a chi è dentro.
              </p>
            </div>
            <ul className="grid sm:grid-cols-1 gap-3">
              {REQUIREMENTS.map((r) => (
                <li
                  key={r}
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
                    style={{ fontSize: "15px", color: "#0a0a0a", fontWeight: 500, lineHeight: 1.45 }}
                  >
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA finale (nero) */}
      <section aria-label="Candidatura" style={{ backgroundColor: "#0a0a0a" }}>
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
            Mandaci la tua{" "}
            <span style={{ color: "#dc2626" }}>candidatura.</span>
          </h2>
          <p
            className="mx-auto mt-6 leading-relaxed"
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "560px" }}
          >
            P.IVA, zona di operatività, esperienza, volumi indicativi. Un commerciale
            ti richiama entro 24 ore per definire l'accordo.
          </p>
          <div className="flex justify-center mt-8">
            <RequestTrigger
              kind="b2b-quote"
              product={{
                id: null,
                slug: null,
                name: "Diventa partner Fast-Fix — candidatura",
                variantId: null,
                variantLabel: null,
              }}
              label="Invia candidatura →"
              className="px-7 py-3.5 rounded-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
