import { StoreMap } from "@/components/stores/store-map";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { getT } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata = {
  title: "Negozi — Cellcom Group",
  description: "Trova il punto vendita Cellcom / Fast-Fix più vicino a te.",
};

const FEATURES: { titleKey: keyof Dict; textKey: keyof Dict }[] = [
  { titleKey: "stores.f1.title", textKey: "stores.f1.text" },
  { titleKey: "stores.f2.title", textKey: "stores.f2.text" },
  { titleKey: "stores.f3.title", textKey: "stores.f3.text" },
];

export default async function StoresPage() {
  const t = await getT();
  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.stores") }]} />
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Negozi", url: "/negozi" },
        ]}
      />

      {/* HERO bianco */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-16">
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
              {t("stores.hero.eyebrow")}
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
              {t("stores.hero.titleA")}{" "}
              <span style={{ color: "#dc2626" }}>{t("stores.hero.accent")}</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "19px",
                color: "#525252",
                maxWidth: "640px",
              }}
            >
              {t("stores.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* MAPPA (bianco) — riusa StoreMap esistente, intatto */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
          <StoreMap />
        </div>
      </section>

      {/* FEATURES (nero) */}
      <section
        aria-label="Cosa puoi fare in negozio"
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
                {t("stores.features.eyebrow")}
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
                {t("stores.features.titleA")}{" "}
                <span style={{ color: "#dc2626" }}>{t("stores.features.accent")}</span>
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
              {t("stores.features.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={String(f.titleKey)}
                className="rounded-2xl p-7 lg:p-8 flex flex-col gap-3 transition-colors duration-300 hover:border-[#dc2626]"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #1f1f1f",
                }}
              >
                <span
                  className="font-mono tabular-nums px-2.5 py-1 rounded-md self-start"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    backgroundColor: "rgba(220,38,38,0.12)",
                    color: "#f87171",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-sans"
                  style={{
                    fontSize: "19px",
                    letterSpacing: "-0.015em",
                    color: "#fafafa",
                    fontWeight: 600,
                  }}
                >
                  {t(f.titleKey)}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "14px", color: "#a3a3a3" }}
                >
                  {t(f.textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
