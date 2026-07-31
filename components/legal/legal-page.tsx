import { COMPANY } from "@/lib/stores";

/**
 * Impaginazione condivisa dei documenti legali (/privacy, /cookie, /termini).
 *
 * Testo lungo e leggibile: colonna stretta, interlinea ampia, niente
 * animazioni. Volutamente NON passa dal dizionario i18n — sono documenti
 * legali, vanno letti e aggiornati come testo intero, non come stringhe
 * sparse, e una traduzione parziale sarebbe peggio dell'italiano soltanto.
 */

export function LegalPage({
  title,
  updatedAt,
  intro,
  children,
}: {
  title: string;
  /** Data di ultimo aggiornamento, es. "31 luglio 2026" */
  updatedAt: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-[760px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <span
          className="font-mono uppercase inline-flex items-center gap-3"
          style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
        >
          <span
            aria-hidden
            className="inline-block h-px w-9"
            style={{ backgroundColor: "#dc2626" }}
          />
          Documenti legali
        </span>

        <h1
          className="font-sans tracking-[-0.025em] mt-5"
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            color: "#0a0a0a",
            fontWeight: 700,
          }}
        >
          {title}
        </h1>

        <p
          className="font-mono uppercase mt-4"
          style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#737373" }}
        >
          Ultimo aggiornamento: {updatedAt}
        </p>

        {intro && (
          <div
            className="mt-8 rounded-2xl px-6 py-5"
            style={{
              backgroundColor: "#fafaf8",
              border: "1px solid #ececec",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#404040",
            }}
          >
            {intro}
          </div>
        )}

        <div className="legal-body mt-10 flex flex-col gap-7">{children}</div>

        <div
          className="mt-14 pt-8"
          style={{ borderTop: "1px solid #ececec", fontSize: "13px", color: "#737373" }}
        >
          <p>
            Titolare del trattamento: <strong>{COMPANY.legalName}</strong> — P.IVA{" "}
            {COMPANY.vatNumber} — {COMPANY.registeredAddress}.
            <br />
            Per esercitare i tuoi diritti scrivi a{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-brand-600 hover:underline">
              {COMPANY.email}
            </a>{" "}
            oppure via PEC a{" "}
            <a href={`mailto:${COMPANY.pec}`} className="text-brand-600 hover:underline">
              {COMPANY.pec}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

/** Sezione numerata del documento */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2
        className="font-sans tracking-[-0.02em] flex items-baseline gap-3"
        style={{ fontSize: "20px", color: "#0a0a0a", fontWeight: 700 }}
      >
        <span
          className="font-mono shrink-0"
          style={{ fontSize: "12px", color: "#dc2626" }}
        >
          {n}
        </span>
        {title}
      </h2>
      <div
        className="flex flex-col gap-3"
        style={{ fontSize: "15px", lineHeight: 1.75, color: "#404040" }}
      >
        {children}
      </div>
    </section>
  );
}

/** Tabella dei trattamenti / cookie — scrolla in orizzontale su mobile */
export function LegalTable({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table
        className="w-full border-collapse"
        style={{ fontSize: "14px", minWidth: "520px" }}
      >
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-left font-mono uppercase py-2 pr-4"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "#737373",
                  borderBottom: "1px solid #ececec",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="align-top py-3 pr-4"
                  style={{
                    borderBottom: "1px solid #f3f3f3",
                    color: "#404040",
                    lineHeight: 1.6,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
