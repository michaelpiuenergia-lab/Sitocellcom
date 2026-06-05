import { RepairTracker } from "@/components/repairs/repair-tracker";
import { HowItWorks } from "@/components/repairs/how-it-works";
import { IntakeOptions } from "@/components/repairs/intake-options";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getT } from "@/lib/i18n/server";
import Link from "next/link";

export const metadata = {
  title: "Riparazioni — Cellcom Group",
  description:
    "Riparazione professionale di smartphone con garanzia 12 mesi. Diagnosi gratuita, ricambi originali, ritiro in negozio o spedizione. Traccia il tuo ticket in tempo reale.",
};

export default async function RepairsPage() {
  const t = await getT();
  return (
    <>
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
