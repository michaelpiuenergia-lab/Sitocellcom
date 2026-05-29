import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { Container } from "@/components/ui/container";
import { UsedDeviceGrid } from "@/components/catalog/used-device-grid";
import { getUsedDevices } from "@/lib/crm-client";

export const metadata = {
  title: "Usato garantito — Cellcom Group",
  description:
    "Smartphone usati testati e garantiti, selezionati dal Gruppo Cellcom. IMEI verificato, batteria controllata, garanzia inclusa. Disponibilità reale dal magazzino.",
};

export const revalidate = 60;

export default async function UsatoPage() {
  const grid = await getUsedDevices({ channel: "cellcom", limit: 100 });

  const ottimo = grid.items.filter((d) => d.condition === "ottimo").length;
  const buono = grid.items.filter((d) => d.condition === "buono").length;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Usato" }]}
      />
      <CatalogHero
        eyebrow="Usato garantito"
        title="Usato"
        accent="testato e garantito"
        description="Ogni telefono passa dal nostro laboratorio: IMEI verificato, batteria controllata, report tecnico e garanzia inclusa. Quello che vedi è disponibile davvero — quando si vende, sparisce dal listino."
        metrics={[
          { label: "In vendita", value: String(grid.total) },
          { label: "Ottimo", value: String(ottimo) },
          { label: "Buono", value: String(buono) },
          { label: "Garanzia", value: "fino 12m" },
        ]}
      />
      <Container className="pb-24">
        <UsedDeviceGrid initialDevices={grid.items} />
      </Container>
    </>
  );
}
