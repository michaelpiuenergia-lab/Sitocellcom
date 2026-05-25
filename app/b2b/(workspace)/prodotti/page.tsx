import { requireB2bSession } from "@/lib/auth/guards";
import { getB2bProducts } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { ProductGridB2b } from "@/components/b2b/product-grid-b2b";

export const dynamic = "force-dynamic";

export default async function B2bProductsPage() {
  const ctx = await requireB2bSession("/b2b/prodotti");

  const productsRes = await getB2bProducts(
    {
      sessionToken: ctx.sessionToken,
      customerId: ctx.customer.id,
      tierCode: ctx.tierCode,
    },
    { limit: 48 },
  );

  return (
    <>
      <B2bNavbar customer={ctx.customer} />

      <main className="pt-24 pb-16 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-500">
            Listino riservato {ctx.customer.pricingTier?.name ?? "B2B"}
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground">
            I tuoi prodotti, ai tuoi prezzi
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Catalogo completo del magazzino Cellcom. Disponibilità in tempo
            reale dal nostro gestionale. Per ordinare grandi quantità o
            chiedere condizioni dedicate, premi <em>Richiedi disponibilità</em>{" "}
            sul prodotto.
          </p>
        </div>

        <ProductGridB2b
          initialProducts={productsRes.items}
          viewer={{
            customerId: ctx.customer.id,
            tierCode: ctx.tierCode,
            tierName: ctx.customer.pricingTier?.name ?? null,
          }}
        />
      </main>
    </>
  );
}
