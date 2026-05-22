import { ProductGrid } from "@/components/catalog/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getProducts } from "@/lib/crm-client";

export const metadata = {
  title: "Accessori — Cellcom Group",
  description:
    "Cover, caricabatterie, cavi, cuffie. Qualità certificata dai canali del Gruppo Cellcom.",
};

export const revalidate = 60;

export default async function AccessoriPage() {
  const { items, total } = await getProducts({ kind: "accessory", limit: 48 });

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prodotti", href: "/prodotti" },
          { label: "Accessori" },
        ]}
      />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              I nostri <span className="italic text-brand-500">accessori</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {total} accessori a catalogo. Cover, caricabatterie, cavi USB-C/Lightning,
              cuffie e altro — tutto compatibile e garantito.
            </p>
          </div>
          <ProductGrid initialProducts={items} />
        </div>
      </main>
    </>
  );
}
