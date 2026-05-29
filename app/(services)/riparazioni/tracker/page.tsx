import { RepairTracker } from "@/components/repairs/repair-tracker";
import { Breadcrumb } from "@/components/layout/breadcrumb";

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

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Riparazioni", href: "/riparazioni" },
          { label: "Traccia" },
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
