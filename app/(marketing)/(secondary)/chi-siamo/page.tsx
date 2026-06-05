import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata: Metadata = {
  title: "Chi siamo — Cellcom Group",
  description:
    "Il Gruppo Cellcom è il punto di riferimento italiano per il ciclo di vita completo dello smartphone: vendita, riparazione, formazione e ricambistica.",
};

const STATS: { value: string; labelKey: keyof Dict }[] = [
  { value: "20K+", labelKey: "about.stat.products" },
  { value: "5", labelKey: "about.stat.brands" },
  { value: "24-48h", labelKey: "about.stat.delivery" },
  { value: "12 mesi", labelKey: "about.stat.warranty" },
];

const BRANDS: {
  name: string;
  roleKey: keyof Dict;
  descKey: keyof Dict;
  url: string;
}[] = [
  { name: "Cellcom.it", roleKey: "about.b1.role", descKey: "about.b1.description", url: "https://cellcom.it" },
  { name: "Fast-Fix.it", roleKey: "about.b2.role", descKey: "about.b2.description", url: "https://fast-fix.it" },
  { name: "ItalianParts.it", roleKey: "about.b3.role", descKey: "about.b3.description", url: "https://www.italianparts.it" },
  { name: "Cellcom Academy", roleKey: "about.b4.role", descKey: "about.b4.description", url: "/corsi" },
];

const STATEMENTS: { num: string; titleKey: keyof Dict; descKey: keyof Dict }[] = [
  { num: "01", titleKey: "about.s1.title", descKey: "about.s1.description" },
  { num: "02", titleKey: "about.s2.title", descKey: "about.s2.description" },
  { num: "03", titleKey: "about.s3.title", descKey: "about.s3.description" },
];

export default async function ChiSiamoPage() {
  const t = await getT();
  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.aboutUs") }]} />

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
              {t("about.hero.eyebrow")}
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
              {t("about.hero.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("about.hero.accent")}</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "19px",
                color: "#525252",
                maxWidth: "640px",
              }}
            >
              {t("about.hero.description")}
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
            {STATS.map((stat) => (
              <div key={stat.labelKey} className="flex flex-col gap-2">
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
                  {t(stat.labelKey)}
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
                {t("about.brands.eyebrow")}
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
                {t("about.brands.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("about.brands.accent")}</span>
              </h2>
            </div>
            <p
              className="leading-relaxed"
              style={{ fontSize: "17px", color: "#525252", maxWidth: "520px" }}
            >
              {t("about.brands.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {BRANDS.map((brand) => (
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
                  {t(brand.roleKey)}
                </span>
                <p
                  className="leading-relaxed mt-1"
                  style={{ fontSize: "14px", color: "#525252" }}
                >
                  {t(brand.descKey)}
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
              {t("about.manifesto.eyebrow")}
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
              {t("about.manifesto.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("about.manifesto.accent")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {STATEMENTS.map((s) => (
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
                  {t(s.titleKey)}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "15px", color: "#a3a3a3" }}
                >
                  {t(s.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
