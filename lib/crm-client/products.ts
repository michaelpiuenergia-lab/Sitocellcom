import "server-only";

import { crmFetch } from "./client";
import type {
  PublicProductListResponse,
  PublicProductDetail,
  PublicHealthResponse,
  PublicChannel,
  PublicCondition,
  PublicKind,
} from "./types";

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
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  const path = `/api/v1/public/products${qs ? `?${qs}` : ""}`;

  return crmFetch<PublicProductListResponse>(path, {
    revalidate: 60,
    tags: [
      "crm:products",
      ...(filters.channel ? [`crm:products:${filters.channel}`] : []),
    ],
  });
}

export async function getProductBySlug(
  slug: string,
  channel?: PublicChannel,
): Promise<PublicProductDetail> {
  const qs = channel ? `?channel=${channel}` : "";
  return crmFetch<PublicProductDetail>(
    `/api/v1/public/products/${encodeURIComponent(slug)}${qs}`,
    {
      revalidate: 300,
      tags: [
        "crm:products",
        channel ? `crm:product:${channel}:${slug}` : `crm:product:${slug}`,
      ],
    },
  );
}

export async function getHealth(): Promise<PublicHealthResponse> {
  return crmFetch<PublicHealthResponse>("/api/v1/public/health");
}
