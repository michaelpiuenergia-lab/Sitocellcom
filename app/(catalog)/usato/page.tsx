import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { UsedDeviceGrid } from "@/components/catalog/used-device-grid";
import { getUsedDevices } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  alternates: { canonical: "/usato" },
  title: "Smartphone usati garantiti a San Benedetto del Tronto",
  description:
    "Smartphone usati e ricondizionati testati uno a uno: IMEI verificato, batteria controllata, garanzia fino a 12 mesi. Ritiri in negozio a San Benedetto del Tronto o te li spediamo in 24-48 ore.",
};

export const revalidate = 60;

export default async function UsatoPage() {
  const [grid, showPrices, t] = await Promise.all([
    getUsedDevices({ channel: "cellcom", limit: 100 }),
    canSeePrices(),
    getT(),
  ]);

  const ottimo = grid.items.filter((d) => d.condition === "ottimo").length;
  const buono = grid.items.filter((d) => d.condition === "buono").length;

  return (
    <>
      <Breadcrumb
        items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.used") }]}
      />
      <CatalogHero
        eyebrow={t("ch.used.eyebrow")}
        title={t("ch.used.title")}
        accent={t("ch.used.accent")}
        description={t("ch.used.description")}
        metrics={[
          { label: t("ch.used.metric.forSale"), value: String(grid.total) },
          { label: t("ch.used.metric.ottimo"), value: String(ottimo) },
          { label: t("ch.used.metric.buono"), value: String(buono) },
          { label: t("ch.used.metric.warranty"), value: t("ch.used.metric.warrantyValue") },
        ]}
      />
      <Container className="pb-24">
        <UsedDeviceGrid initialDevices={grid.items} canSeePrices={showPrices} />
      </Container>
    </>
  );
}
