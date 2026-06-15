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

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ImeiIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <rect x="2" y="8" width="16" height="8" rx="2" />
      <path d="M22 11v2" />
      <path d="M6 12h5" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </svg>
  );
}

export default async function UsatoPage() {
  const [grid, showPrices, t] = await Promise.all([
    getUsedDevices({ channel: "cellcom", limit: 100 }),
    canSeePrices(),
    getT(),
  ]);

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
        trust={[
          { icon: <ImeiIcon />, label: t("ch.used.trust.imei") },
          { icon: <BatteryIcon />, label: t("ch.used.trust.battery") },
          { icon: <ReportIcon />, label: t("ch.used.trust.report") },
          { icon: <ShieldIcon />, label: t("ch.used.trust.warranty") },
        ]}
      />
      <Container className="pb-24">
        <div className="flex items-baseline justify-between gap-4 mb-8 border-t border-border pt-8">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            {t("ch.used.metric.forSale")}
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {grid.total} {t("ch.used.available")}
          </span>
        </div>
        <UsedDeviceGrid initialDevices={grid.items} canSeePrices={showPrices} />
      </Container>
    </>
  );
}
