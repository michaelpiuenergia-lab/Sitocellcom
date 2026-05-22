import { RepairTracker } from "@/components/repairs/repair-tracker";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata = {
  title: "Traccia riparazione — Cellcom Group",
  description: "Inserisci il numero ticket e il telefono per vedere lo stato della tua riparazione in tempo reale.",
};

export default function RepairsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Riparazioni" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20">
        <RepairTracker />
      </main>
    </>
  );
}
