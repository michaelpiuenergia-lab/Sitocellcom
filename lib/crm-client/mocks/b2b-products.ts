import type {
  B2bProductListItem,
  B2bProductDetail,
  B2bProductListResponse,
  B2bPriceSource,
  PublicChannel,
  PublicCondition,
  PublicKind,
} from "../types";
import { mockProducts } from "./products";
import { MOCK_TIER_DISCOUNT } from "./b2b-auth";

type ListFilters = {
  channel?: PublicChannel;
  search?: string;
  category?: string;
  condition?: PublicCondition;
  brand?: string;
  kind?: PublicKind;
  compatibleModels?: string;
  limit?: number;
  offset?: number;
};

type B2bContext = {
  sessionToken?: string; // ignorato dal mock, presente per compat col real
  customerId: string;
  tierCode: string | null;
};

function applyB2bPrice(
  publicPriceCents: number,
  tierCode: string | null,
): { priceCents: number; source: B2bPriceSource } {
  if (!tierCode) {
    return { priceCents: publicPriceCents, source: "public-fallback" };
  }
  const discount = MOCK_TIER_DISCOUNT[tierCode];
  if (discount === undefined) {
    return { priceCents: publicPriceCents, source: "public-fallback" };
  }
  const priceCents = Math.round(publicPriceCents * (1 - discount));
  return { priceCents, source: "tier-discount" };
}

export async function getB2bProducts(
  ctx: B2bContext,
  filters: ListFilters = {},
): Promise<B2bProductListResponse> {
  let items = [...mockProducts];

  if (filters.channel) items = items.filter((p) => p.channel === filters.channel);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false),
    );
  }
  if (filters.category) items = items.filter((p) => p.category === filters.category);
  if (filters.condition) items = items.filter((p) => p.condition === filters.condition);
  if (filters.brand) items = items.filter((p) => p.brand === filters.brand);
  if (filters.kind) items = items.filter((p) => p.kind === filters.kind);
  if (filters.compatibleModels) {
    const q = filters.compatibleModels.toLowerCase();
    items = items.filter((p) =>
      p.compatibleModels?.toLowerCase().includes(q) ?? false,
    );
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 20;
  const paginated = items.slice(offset, offset + limit);

  const b2bItems: B2bProductListItem[] = paginated.map((p) => {
    // Per i ricambi il public API nasconde il prezzo (priceHidden=true):
    // qui prendiamo comunque la cifra dal mock come "b2b base price".
    // In prod questo arriva risolto dal CRM via b2b_price_cents (resolver step 5).
    const basePrice = p.priceCents ?? 0;
    const { priceCents, source } = applyB2bPrice(basePrice, ctx.tierCode);
    return {
      ...p,
      priceCents,
      priceHidden: false as const,
      publicPriceCents: p.priceHidden ? null : p.priceCents,
      priceSource: source,
    };
  });

  return {
    items: b2bItems,
    total: items.length,
    hasMore: offset + limit < items.length,
    limit,
    offset,
  };
}

export async function getB2bProductBySlug(
  ctx: B2bContext,
  slug: string,
  channel?: PublicChannel,
): Promise<B2bProductDetail> {
  const base = mockProducts.find(
    (p) => p.slug === slug && (channel ? p.channel === channel : true),
  );
  if (!base) {
    const candidates = mockProducts.filter((p) => p.slug === slug);
    if (candidates.length > 1 && !channel) {
      throw new Error("SLUG_AMBIGUOUS");
    }
    throw new Error("NOT_FOUND");
  }

  const basePrice = base.priceCents ?? 0;
  const { priceCents, source } = applyB2bPrice(basePrice, ctx.tierCode);

  const detail: B2bProductDetail = {
    ...base,
    priceCents,
    priceHidden: false as const,
    publicPriceCents: base.priceHidden ? null : base.priceCents,
    priceSource: source,
    description: null,
    barcode: null,
    sku: null,
    variants: [],
  };

  return detail;
}
