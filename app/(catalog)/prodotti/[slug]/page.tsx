import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RequestTrigger } from "@/components/forms/request-trigger";
import { Container } from "@/components/ui/container";
import { canSeePrices } from "@/lib/auth/pricing-access";
import { getProductBySlug } from "@/lib/crm-client";
import { CrmApiError } from "@/lib/crm-client/client";
import { formatPrice } from "@/lib/crm-client/mocks/products";
import type { PublicChannel, PublicProductDetail } from "@/lib/crm-client/types";

/**
 * Scheda dettaglio prodotto — consuma GET /api/v1/public/products/{slug} del CRM.
 *
 * Allineata all'API: prezzo nascosto sui ricambi (priceHidden), stock cappato a
 * 5, varianti con stock proprio. Cache ISR 5 min (l'API e' 600s + SWR).
 */

export const revalidate = 300;

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuovo",
  used: "Usato",
  refurbished: "Ricondizionato",
};

type PageParams = Promise<{ slug: string }>;
type PageSearch = Promise<{ channel?: string }>;

async function loadProduct(
  slug: string,
  channel?: string,
): Promise<PublicProductDetail | null> {
  try {
    return await getProductBySlug(slug, channel as PublicChannel | undefined);
  } catch (err) {
    if (err instanceof CrmApiError && (err.status === 404 || err.status === 409)) {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearch;
}): Promise<Metadata> {
  const { slug } = await params;
  const { channel } = await searchParams;
  const product = await loadProduct(slug, channel);
  if (!product) return { title: "Prodotto non trovato — Cellcom Group" };
  const title = `${product.name} — Cellcom Group`;
  const description =
    product.description?.slice(0, 160) ??
    `${product.name}${product.brand ? ` — ${product.brand}` : ""}. Disponibilita' reale dai canali del Gruppo Cellcom.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.photoUrl ? [product.photoUrl] : undefined,
    },
  };
}

function stockLabel(product: PublicProductDetail): { text: string; tone: string } {
  const { count, capped } = product.stock;
  if (count <= 0 && product.variantCount > 0) {
    return { text: "Verifica disponibilita' varianti", tone: "#b45309" };
  }
  if (count <= 0) return { text: "Esaurito", tone: "#6b7280" };
  if (!capped && count <= 3) return { text: `Ultimi ${count} pezzi`, tone: "#b45309" };
  return { text: "Disponibile", tone: "#047857" };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearch;
}) {
  const { slug } = await params;
  const { channel } = await searchParams;
  const [product, showPrices] = await Promise.all([
    loadProduct(slug, channel),
    canSeePrices(),
  ]);

  if (!product) notFound();

  const stock = stockLabel(product);
  const priceText =
    product.priceHidden || !showPrices || product.priceCents == null
      ? "Prezzo su richiesta"
      : formatPrice(product.priceCents);
  const isPart = product.kind === "part";

  return (
    <Container>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prodotti", href: "/prodotti" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 py-6 md:grid-cols-2">
        {/* Foto */}
        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-6">
          {product.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.photoUrl}
              alt={product.name}
              className="max-h-[420px] w-full object-contain"
            />
          ) : (
            <div className="flex h-[320px] w-full items-center justify-center text-6xl text-black/15">
              {isPart ? "🔧" : "📱"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && (
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                {product.brand}
              </span>
            )}
            {product.condition && (
              <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-600">
                {CONDITION_LABEL[product.condition] ?? product.condition}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>

          {product.category && (
            <p className="text-sm text-muted-foreground">{product.category}</p>
          )}
          {product.compatibleModels && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Compatibile con:</span>{" "}
              {product.compatibleModels}
            </p>
          )}

          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-black text-foreground">{priceText}</span>
            <span className="text-sm font-semibold" style={{ color: stock.tone }}>
              {stock.text}
            </span>
          </div>

          <div className="mt-2">
            <RequestTrigger
              kind={isPart ? "spare-part" : "info"}
              label={isPart ? "Richiedi disponibilita' e prezzo" : "Richiedi informazioni"}
              hideCompany
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                variantId: null,
                variantLabel: null,
              }}
            />
          </div>

          {(product.sku || product.barcode) && (
            <div className="mt-2 text-xs text-muted-foreground">
              {product.sku && (
                <span className="mr-3 font-mono">SKU: {product.sku}</span>
              )}
              {product.barcode && (
                <span className="font-mono">EAN: {product.barcode}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Varianti */}
      {product.variants.length > 0 && (
        <section className="py-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-600">
            Varianti disponibili
          </h2>
          <div className="overflow-hidden rounded-xl border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-black/5 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Variante</th>
                  <th className="px-3 py-2 text-right">Prezzo</th>
                  <th className="px-3 py-2 text-right">Disponibilita'</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id} className="border-t border-black/5">
                    <td className="px-3 py-2 font-medium">{v.label}</td>
                    <td className="px-3 py-2 text-right">
                      {v.priceHidden || !showPrices || v.priceCents == null
                        ? "Su richiesta"
                        : formatPrice(v.priceCents)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {v.stock.count <= 0
                        ? "Esaurito"
                        : v.stock.capped
                          ? "Disponibile"
                          : `${v.stock.count} pz`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Descrizione */}
      {product.description && (
        <section className="py-4">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-600">
            Descrizione
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </section>
      )}
    </Container>
  );
}
