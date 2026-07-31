import { RepairTracker } from "@/components/repairs/repair-tracker";
import { HowItWorks } from "@/components/repairs/how-it-works";
import { IntakeOptions } from "@/components/repairs/intake-options";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getT } from "@/lib/i18n/server";
import Link from "next/link";
import { PayIn3Banner } from "@/components/ui/payment-badges";
import { FaqJsonLd, RepairServiceJsonLd } from "@/components/seo/structured-data";

export const metadata = {
  alternates: { canonical: "/riparazioni" },
  title: "Riparazione telefoni e tablet a San Benedetto del Tronto",
  description:
    "Ripariamo smartphone, tablet, computer e console a San Benedetto del Tronto. Diagnosi gratuita, preventivo in 24 ore, garanzia 12 mesi. Nessun costo se rifiuti il preventivo. Porti il device in negozio o ce lo spedisci.",
};

/**
 * Le domande sono quelle che le persone digitano davvero prima di portare
 * un telefono a riparare. In FAQPage Google può mostrarle direttamente nei
 * risultati, occupando più spazio della concorrenza.
 */
const FAQ = [
  {
    question: "Quanto costa riparare uno smartphone a San Benedetto del Tronto?",
    answer:
      "La diagnosi è gratuita e il preventivo arriva entro 24 ore lavorative. Il costo dipende dal modello e dal guasto: se rifiuti il preventivo non paghi nulla e ti restituiamo il dispositivo.",
  },
  {
    question: "Quanto tempo serve per riparare un telefono?",
    answer:
      "Le riparazioni più comuni, come display e batteria, si chiudono in giornata se il ricambio è a magazzino. Per guasti sulla scheda madre o microsaldatura servono alcuni giorni, e te lo diciamo nel preventivo.",
  },
  {
    question: "La riparazione è garantita?",
    answer:
      "Sì, 12 mesi di garanzia su manodopera e ricambi utilizzati. La garanzia non copre danni successivi come cadute, liquidi o interventi fatti altrove.",
  },
  {
    question: "Riparate anche tablet, computer e console?",
    answer:
      "Sì. Oltre agli smartphone trattiamo tablet, notebook, computer fissi e console da gioco, con lo stesso percorso: diagnosi gratuita, preventivo e garanzia 12 mesi.",
  },
  {
    question: "Perdo i dati del telefono durante la riparazione?",
    answer:
      "Alcuni interventi comportano la perdita dei dati, per questo consigliamo sempre un backup prima di consegnare il dispositivo. Se il telefono non si accende possiamo valutare il recupero dati.",
  },
  {
    question: "Devo venire in negozio o posso spedire il dispositivo?",
    answer:
      "Come preferisci. Puoi portarlo in una delle due sedi di San Benedetto del Tronto, spedircelo e riceverlo riparato, oppure — nelle zone vicine — chiedere ritiro e consegna a domicilio.",
  },
];

export default async function RepairsPage() {
  const t = await getT();
  return (
    <>
      <RepairServiceJsonLd />
      <FaqJsonLd items={FAQ} />
      <Breadcrumb
        items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.repairs") }]}
      />

      {/* HERO — FastFix-style: titolo grande, step indicator, brand grid */}
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
              {t("rep.hero.eyebrow")}
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
              {t("rep.hero.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("rep.hero.accent")}</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
            >
              {t("rep.hero.description")}
            </p>

            <div className="flex flex-wrap gap-4 mt-3">
              <Link
                href="/riparazioni/richiedi"
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 transition-all duration-300 hover:shadow-[0_18px_44px_-12px_rgba(220,38,38,0.55)]"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {t("rep.hero.cta1")}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="#tracker"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 transition-colors duration-300 hover:border-[#dc2626]"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#0a0a0a",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "#ffffff",
                }}
              >
                {t("rep.hero.cta2")}
              </Link>
            </div>

            <p
              className="font-mono uppercase mt-2"
              style={{
                fontSize: "10px",
                letterSpacing: "0.28em",
                color: "#737373",
              }}
            >
              {t("rep.hero.subtitle")}
            </p>
          </div>

        </div>
      </section>

      <HowItWorks />

      <IntakeOptions />

      <PayIn3Banner />

      <section
        id="tracker"
        aria-label="Tracker ticket"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
          <RepairTracker />
        </div>
      </section>
    </>
  );
}
