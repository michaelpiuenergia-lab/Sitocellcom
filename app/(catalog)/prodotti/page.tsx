import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata = {
  title: "Prodotti — Cellcom Group",
  description: "Catalogo prodotti, ricambi e accessori. Stock reale dai nostri store.",
};

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Prodotti" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              Il nostro <span className="italic text-brand-500">catalogo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Smartphone, ricambi e accessori con disponibilità reale dai nostri store.
            </p>
          </div>
          <ProductGrid />
        </div>
      </main>
    </>
  );
}
