import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata: Metadata = {
  title: "Apri un negozio — Cellcom Group",
  description:
    "Vuoi aprire il tuo negozio di telefonia? Cellcom ti accompagna passo per passo: consulenza, formazione tecnica, fornitura ricambi e accessori, setup negozio e accesso al CRM. Supporto continuo dopo l'apertura.",
};

const STEPS: { n: string; titleKey: keyof Dict; textKey: keyof Dict }[] = [
  { n: "01", titleKey: "os.s1.title", textKey: "os.s1.text" },
  { n: "02", titleKey: "os.s2.title", textKey: "os.s2.text" },
  { n: "03", titleKey: "os.s3.title", textKey: "os.s3.text" },
  { n: "04", titleKey: "os.s4.title", textKey: "os.s4.text" },
  { n: "05", titleKey: "os.s5.title", textKey: "os.s5.text" },
];

const INCLUDED_KEYS: (keyof Dict)[] = [
  "os.i1",
  "os.i2",
  "os.i3",
  "os.i4",
  "os.i5",
  "os.i6",
];

export default async function ApriNegozioPage() {
  const t = await getT();
  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.openStore") }]} />

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
              {t("os.hero.eyebrow")}
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
              {t("os.hero.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("os.hero.accent")}</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: "19px", color: "#525252", maxWidth: "640px" }}
            >
              {t("os.hero.description")}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <RequestTrigger
                kind="info"
                product={{
                  id: null,
                  slug: null,
                  name: t("os.hero.reqName"),
                  variantId: null,
                  variantLabel: null,
                }}
                label={t("os.hero.cta1")}
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
                {t("os.hero.cta2")}
              </Link>
            </div>
            <p
              className="font-mono uppercase mt-2"
              style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
            >
              {t("os.hero.subtitle")}
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
                {t("os.steps.eyebrow")}
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
                {t("os.steps.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("os.steps.accent")}</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "520px" }}
            >
              {t("os.steps.intro")}
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
                  {t(s.titleKey)}
                </h3>
                <p className="leading-relaxed" style={{ fontSize: "14px", color: "#a3a3a3" }}>
                  {t(s.textKey)}
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
                {t("os.included.eyebrow")}
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
                {t("os.included.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("os.included.accent")}</span>
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
              >
                {t("os.included.intro")}
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {INCLUDED_KEYS.map((incKey) => (
                <li
                  key={incKey}
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
                    {t(incKey)}
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
            {t("os.cta.titleA")}{" "}
            <span style={{ color: "#dc2626" }}>{t("os.cta.accent")}</span>
          </h2>
          <p
            className="mx-auto mt-6 leading-relaxed"
            style={{ fontSize: "17px", color: "#a3a3a3", maxWidth: "560px" }}
          >
            {t("os.cta.intro")}
          </p>
          <div className="flex justify-center mt-8">
            <RequestTrigger
              kind="info"
              product={{
                id: null,
                slug: null,
                name: t("os.cta.reqName"),
                variantId: null,
                variantLabel: null,
              }}
              label={t("os.cta.cta")}
              className="px-7 py-3.5 rounded-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
