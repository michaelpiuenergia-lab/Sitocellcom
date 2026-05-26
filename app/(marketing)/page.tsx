import { Hero } from "@/components/marketing/hero";
import { ServiceCards } from "@/components/marketing/service-cards";
import { StatsStrip, type StatItem } from "@/components/marketing/stats-strip";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { WhyCellcomBento } from "@/components/marketing/why-cellcom-bento";
import { B2bPitch } from "@/components/marketing/b2b-pitch";
import { LifecycleShowcase } from "@/components/marketing/lifecycle-showcase";
import { ImmersivePin } from "@/components/marketing/immersive-pin";
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
  // 6 telefoni per il cube + conteggi totali per la stats strip
  const [devicesRes, partsTotal, accessoriesTotal] = await Promise.all([
    getProducts({ kind: "device", limit: 6 }).catch(() => null),
    getKindTotal("part"),
    getKindTotal("accessory"),
  ]);

  const devices = devicesRes?.items ?? [];
  const devicesTotal = devicesRes?.total ?? null;

  const stats: StatItem[] = [
    {
      value: "5",
      label: "Brand in un solo gruppo",
      hint: "Cellcom · Fast-Fix · ItalianParts · SmartphoneFix · FixHub — un'unica regia, cinque specializzazioni",
    },
    {
      value: formatCount(partsTotal),
      label: "Ricambi sempre disponibili",
      hint: "display, batterie, scocche, schede madri — stock reale aggiornato dal CRM ogni 60 secondi",
    },
    {
      value: formatCount(devicesTotal),
      label: "Telefoni pronti in catalogo",
      hint: "nuovi, ricondizionati certificati, usati testati — Apple, Samsung, Xiaomi e tutti i principali brand",
    },
    {
      value: "24-48h",
      label: "Spedizione standard in Italia",
      hint: "ordini entro le 15:00 partono in giornata · ritiro gratis nei punti vendita del Gruppo",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero devices={devices} />
        <BrandMarquee />
        {/* Cinematic moment — telefono REALE che ruota leggermente con lo
            scroll, 3 momenti testuali in cross-fade, sfondo che vira. */}
        <ImmersivePin device={devices[0]} />
        {/* Divider bianco/cream con 4 telefoni REALI 3D tilt al mouse */}
        <LifecycleShowcase devices={devices.slice(1, 5)} />
        <StatsStrip stats={stats} />
        <WhyCellcomBento />
        <ServiceCards />
        <B2bPitch />
      </main>
      <Footer />
    </>
  );
}
