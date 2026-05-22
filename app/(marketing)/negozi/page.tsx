import { StoreMap } from "@/components/stores/store-map";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata = {
  title: "Negozi — Cellcom Group",
  description: "Trova il punto vendita Cellcom / Fast-Fix più vicino a te.",
};

export default function StoresPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Negozi" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              I nostri <span className="italic text-brand-500">negozi</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Trova il punto vendita più vicino a te tra i brand del Gruppo Cellcom.
            </p>
          </div>
          <StoreMap />
        </div>
      </main>
    </>
  );
}
