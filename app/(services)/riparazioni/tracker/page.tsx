import { RepairTracker } from "@/components/repairs/repair-tracker";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Traccia la riparazione — Cellcom Group",
  description:
    "Inserisci numero ticket e telefono per vedere lo stato della tua riparazione e gestire il preventivo.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ ticket?: string; t?: string }>;

export default async function TrackerPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const initialTicket = (sp.ticket ?? "").slice(0, 40);
  const t = await getT();

  return (
    <>
      <Breadcrumb
        items={[
          { label: t("bc.home"), href: "/" },
          { label: t("bc.repairs"), href: "/riparazioni" },
          { label: t("bc.tracker") },
        ]}
      />
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <RepairTracker initialTicket={initialTicket} />
        </div>
      </section>
    </>
  );
}
