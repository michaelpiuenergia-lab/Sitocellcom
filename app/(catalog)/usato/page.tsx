import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { UsedDeviceGrid } from "@/components/catalog/used-device-grid";
import { getUsedDevices } from "@/lib/crm-client";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Usato garantito — Cellcom Group",
  description:
    "Smartphone usati testati e garantiti, selezionati dal Gruppo Cellcom. IMEI verificato, batteria controllata, garanzia inclusa. Disponibilità reale dal magazzino.",
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
