import type {
  PublicProductListResponse,
  PublicProductDetail,
  PublicHealthResponse,
  PublicChannel,
  PublicCondition,
  PublicKind,
} from "./types";
import { mockProducts } from "./mocks/products";

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

export async function getProducts(
  filters: ListFilters = {},
): Promise<PublicProductListResponse> {
  let items = [...mockProducts];

  if (filters.channel) {
    items = items.filter((p) => p.channel === filters.channel);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false),
    );
  }
  if (filters.category) {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters.condition) {
    items = items.filter((p) => p.condition === filters.condition);
  }
  if (filters.brand) {
    items = items.filter((p) => p.brand === filters.brand);
  }
  if (filters.kind) {
    items = items.filter((p) => p.kind === filters.kind);
  }
  if (filters.compatibleModels) {
    const q = filters.compatibleModels.toLowerCase();
    items = items.filter((p) =>
      p.compatibleModels?.toLowerCase().includes(q) ?? false,
    );
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 20;
  const paginated = items.slice(offset, offset + limit);

  return {
    items: paginated,
    total: items.length,
    hasMore: offset + limit < items.length,
    limit,
    offset,
  };
}

export async function getProductBySlug(
  slug: string,
  channel?: PublicChannel,
): Promise<PublicProductDetail> {
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

  const detail: PublicProductDetail = {
    ...base,
    description: null,
    barcode: null,
    sku: null,
    variants: [],
  };

  return detail;
}

export async function getHealth(): Promise<PublicHealthResponse> {
  return {
    status: "ok",
    version: "v1",
    timestamp: new Date().toISOString(),
  };
}
