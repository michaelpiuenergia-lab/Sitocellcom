import { Hero } from "@/components/marketing/hero";
import { ImmersivePin } from "@/components/marketing/immersive-pin";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { TrustStrip } from "@/components/marketing/trust-strip";
import {
  MarketingPanel,
  PanelStat,
  Accent,
} from "@/components/marketing/marketing-panel";
import { PillarsGrid } from "@/components/marketing/pillars-grid";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProducts } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getT } from "@/lib/i18n/server";

export const revalidate = 60;

function formatCount(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) {
    const k = (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "");
    return `${k}K+`;
  }
  return new Intl.NumberFormat("it-IT").format(n);
}

async function getKindTotal(
  kind: "device" | "part" | "accessory",
): Promise<number | null> {
  try {
    const res = await getProducts({ kind, limit: 1 });
    return res.total;
  } catch {
    return null;
  }
}

export default async function MarketingPage() {
  // CRM fetches intatti — non regredire mai qui.
  const [devicesRes, partsTotal, accessoriesTotal, showPrices, t] = await Promise.all([
    getProducts({ kind: "device", limit: 6 }).catch(() => null),
    getKindTotal("part"),
    getKindTotal("accessory"),
    canSeePrices(),
    getT(),
  ]);

  const devices = devicesRes?.items ?? [];
  const devicesTotal = devicesRes?.total ?? null;

  return (
    <>
      <Navbar />
      {/* offset navbar fissa 72px */}
      <main className="pt-[72px]">
        {/* Hero video + wordmark (intoccabile) */}
        <Hero devices={devices} canSeePrices={showPrices} />

        {/* Banner ROSSO Cellcom — tra Hero e 3D */}
        <BrandMarquee />

        {/* Trust strip 4 garanzie (spedizione/warranty/tecnici/B2B) */}
        <TrustStrip />

        {/* Telefono 3D scroll-driven (intoccabile) */}
        <ImmersivePin device={devices[0]} />

        {/* 4 pilastri in scacchiera 2×2 (Compra+Ripara sopra, Rivendi+Impara sotto) */}
        <PillarsGrid />

        {/* Numeri (bianco) */}
        <MarketingPanel
          tone="light"
          eyebrow={t("home.numbers.eyebrow")}
          title={
            <>
              {t("home.numbers.titleA")} <Accent>{t("home.numbers.titleB")}</Accent>
            </>
          }
          intro={<>{t("home.numbers.intro")}</>}
          extra={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              <PanelStat tone="light" value="5" label={t("home.numbers.stat.brands")} />
              <PanelStat
                tone="light"
                value={formatCount(partsTotal)}
                label={t("home.numbers.stat.parts")}
              />
              <PanelStat
                tone="light"
                value={formatCount(devicesTotal)}
                label={t("home.numbers.stat.phones")}
              />
              <PanelStat
                tone="light"
                value={formatCount(accessoriesTotal)}
                label={t("home.numbers.stat.accessories")}
              />
            </div>
          }
          primaryCta={{ label: t("home.numbers.cta.catalog"), href: "/prodotti" }}
          secondaryCta={{ label: t("home.numbers.cta.about"), href: "/chi-siamo" }}
        />

        {/* B2B (nero, fanale rosso intenso) */}
        <MarketingPanel
          tone="dark"
          eyebrow={t("home.b2b.eyebrow")}
          title={
            <>
              {t("home.b2b.titleA")} <Accent>{t("home.b2b.titleB")}</Accent>
            </>
          }
          intro={<>{t("home.b2b.intro")}</>}
          features={[
            {
              title: t("home.b2b.feature1.title"),
              body: t("home.b2b.feature1.body"),
            },
            {
              title: t("home.b2b.feature2.title"),
              body: t("home.b2b.feature2.body"),
            },
            {
              title: t("home.b2b.feature3.title"),
              body: t("home.b2b.feature3.body"),
            },
          ]}
          primaryCta={{ label: t("home.b2b.cta.login"), href: "/b2b/login" }}
          secondaryCta={{
            label: t("home.b2b.cta.contact"),
            href: "mailto:b2b@cellcom.it?subject=Richiesta%20attivazione%20account%20B2B",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
