import { Hero } from "@/components/marketing/hero";
import { ImmersivePin } from "@/components/marketing/immersive-pin";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import {
  MarketingPanel,
  PanelStat,
  Accent,
} from "@/components/marketing/marketing-panel";
import { PillarsGrid } from "@/components/marketing/pillars-grid";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProducts } from "@/lib/crm-client";

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
  const [devicesRes, partsTotal, accessoriesTotal] = await Promise.all([
    getProducts({ kind: "device", limit: 6 }).catch(() => null),
    getKindTotal("part"),
    getKindTotal("accessory"),
  ]);

  const devices = devicesRes?.items ?? [];
  const devicesTotal = devicesRes?.total ?? null;

  return (
    <>
      <Navbar />
      {/* offset navbar fissa 72px */}
      <main className="pt-[72px]">
        {/* Hero video + wordmark (intoccabile) */}
        <Hero devices={devices} />

        {/* Banner ROSSO Cellcom — tra Hero e 3D */}
        <BrandMarquee />

        {/* Telefono 3D scroll-driven (intoccabile) */}
        <ImmersivePin device={devices[0]} />

        {/* 4 pilastri in scacchiera 2×2 (Compra+Ripara sopra, Rivendi+Impara sotto) */}
        <PillarsGrid />

        {/* Numeri (bianco) */}
        <MarketingPanel
          tone="light"
          eyebrow="I numeri del gruppo"
          title={
            <>
              Cinque brand. Un solo <Accent>magazzino.</Accent>
            </>
          }
          intro={
            <>
              Cellcom (B2B), Fast-Fix (negozi), ItalianParts (ricambi),
              SmartphoneFix (Academy), FixHub (gestionale). Specializzati
              ognuno nel suo, ma con lo stesso stock dietro. I numeri qui
              sotto arrivano live dal CRM — niente vetrine vuote.
            </>
          }
          extra={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              <PanelStat tone="light" value="5" label="Brand del gruppo" />
              <PanelStat
                tone="light"
                value={formatCount(partsTotal)}
                label="Ricambi a stock"
              />
              <PanelStat
                tone="light"
                value={formatCount(devicesTotal)}
                label="Telefoni in catalogo"
              />
              <PanelStat
                tone="light"
                value={formatCount(accessoriesTotal)}
                label="Accessori disponibili"
              />
            </div>
          }
          primaryCta={{ label: "Vai al catalogo", href: "/prodotti" }}
          secondaryCta={{ label: "Chi siamo", href: "/chi-siamo" }}
        />

        {/* B2B (nero, fanale rosso intenso) */}
        <MarketingPanel
          tone="dark"
          eyebrow="Per rivenditori, operatori, aziende"
          title={
            <>
              Vendi telefoni per mestiere?{" "}
              <Accent>Il listino giusto cambia tutto.</Accent>
            </>
          }
          intro={
            <>
              Stesso stock del pubblico, prezzi a volumi, account manager
              dedicato, pagamento a 30/60 giorni. Serve solo P.IVA: chiamiamo
              noi in giornata, credenziali entro 24 ore.
            </>
          }
          features={[
            {
              title: "Listino a tier",
              body: "Rivenditore, Operatore, VIP — il prezzo scende automatico al volume. Niente da chiedere ogni volta.",
            },
            {
              title: "Stock prioritario",
              body: "Ricambi scarsi riservati prima a chi ha contratto attivo, poi al pubblico.",
            },
            {
              title: "Una persona vera",
              body: "Account manager dedicato. Email diretta, WhatsApp business. Sa chi sei.",
            },
          ]}
          primaryCta={{ label: "Accedi all'area B2B", href: "/b2b/login" }}
          secondaryCta={{
            label: "Richiedi attivazione",
            href: "mailto:b2b@cellcom.it?subject=Richiesta%20attivazione%20account%20B2B",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
