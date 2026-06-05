import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TradeInCalculator } from "@/components/trade-in/calculator";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata: Metadata = {
  title: "Rivendi il tuo telefono — Cellcom Group",
  description:
    "Valutazione gratuita del tuo smartphone usato. Spedizione gratis, pagamento entro 48h. Bonus +10% se scegli credito Cellcom.",
};

const STEPS: { n: string; titleKey: keyof Dict; textKey: keyof Dict }[] = [
  { n: "01", titleKey: "ti.s1.title", textKey: "ti.s1.text" },
  { n: "02", titleKey: "ti.s2.title", textKey: "ti.s2.text" },
  { n: "03", titleKey: "ti.s3.title", textKey: "ti.s3.text" },
  { n: "04", titleKey: "ti.s4.title", textKey: "ti.s4.text" },
];

const FAQS: { qKey: keyof Dict; aKey: keyof Dict }[] = [
  { qKey: "ti.faq.q1.q", aKey: "ti.faq.q1.a" },
  { qKey: "ti.faq.q2.q", aKey: "ti.faq.q2.a" },
  { qKey: "ti.faq.q3.q", aKey: "ti.faq.q3.a" },
  { qKey: "ti.faq.q4.q", aKey: "ti.faq.q4.a" },
  { qKey: "ti.faq.q5.q", aKey: "ti.faq.q5.a" },
  { qKey: "ti.faq.q6.q", aKey: "ti.faq.q6.a" },
  { qKey: "ti.faq.q7.q", aKey: "ti.faq.q7.a" },
  { qKey: "ti.faq.q8.q", aKey: "ti.faq.q8.a" },
];

export default async function RivendiPage() {
  const t = await getT();
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* HERO (bianco) */}
        <section style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-16">
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
                {t("ti.hero.eyebrow")}
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
                {t("ti.hero.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("ti.hero.accent")}</span>
              </h1>
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "19px",
                  color: "#525252",
                  maxWidth: "640px",
                }}
              >
                {t("ti.hero.descA")}
                <strong style={{ color: "#0a0a0a" }}>{t("ti.hero.descBoldBonus")}</strong>
                {t("ti.hero.descB")}
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR (mantiene la sua logica e i fetch CRM) */}
        <section style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
            <TradeInCalculator />
          </div>
        </section>

        {/* COME FUNZIONA (nero — fanale rosso assente perché elenco lineare) */}
        <section
          aria-label="Come funziona il trade-in"
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
                  {t("ti.how.eyebrow")}
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
                  {t("ti.how.titleA")}{" "}
                  <span style={{ color: "#dc2626" }}>{t("ti.how.accent")}</span>
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
                {t("ti.how.intro")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl p-7 flex flex-col gap-3 transition-colors duration-300 hover:border-[#dc2626]"
                  style={{
                    backgroundColor: "#141414",
                    border: "1px solid #1f1f1f",
                  }}
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
                    {step.n}
                  </span>
                  <h3
                    className="font-sans"
                    style={{
                      fontSize: "17px",
                      letterSpacing: "-0.01em",
                      color: "#fafafa",
                      fontWeight: 600,
                    }}
                  >
                    {t(step.titleKey)}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ fontSize: "14px", color: "#a3a3a3" }}
                  >
                    {t(step.textKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ (bianco) */}
        <section
          aria-label="FAQ trade-in"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="max-w-[960px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
            <div className="flex flex-col gap-5 mb-12">
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
                {t("ti.faq.eyebrow")}
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
                {t("ti.faq.titleA")} <span style={{ color: "#dc2626" }}>{t("ti.faq.accent")}</span> {t("ti.faq.titleB")}
              </h2>
            </div>

            <div className="flex flex-col">
              {FAQS.map((f) => (
                <details
                  key={String(f.qKey)}
                  className="group py-5"
                  style={{ borderBottom: "1px solid #ececec" }}
                >
                  <summary className="cursor-pointer flex items-center justify-between gap-4 list-none">
                    <h3
                      className="font-sans transition-colors group-hover:text-brand-600"
                      style={{
                        fontSize: "17px",
                        color: "#0a0a0a",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t(f.qKey)}
                    </h3>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl transition-transform duration-300 group-open:rotate-45"
                      style={{ color: "#dc2626" }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-4 leading-relaxed"
                    style={{ fontSize: "15px", color: "#525252" }}
                  >
                    {t(f.aKey)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
