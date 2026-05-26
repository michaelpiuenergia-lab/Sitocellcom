import "server-only";

import { crmFetch } from "./client";
import type {
  PublicProductListResponse,
  PublicProductDetail,
  PublicHealthResponse,
  PublicChannel,
  PublicCondition,
  PublicKind,
  PublicProductListItem,
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

/**
 * Workaround dev CRM: il CRM dev (porta 3000) ritorna photoUrl con host
 * sbagliato (`:3001` legacy o `:3002`). I file sono serviti sulla stessa
 * porta del CRM (:3000). In prod il problema non esiste (URL già corretti
 * su cellcom.vercel.app).
 */
function fixPhotoUrl(url: string | null): string | null {
  if (!url) return url;
  return url
    .replace("://127.0.0.1:3001/", "://127.0.0.1:3000/")
    .replace("://localhost:3001/", "://localhost:3000/")
    .replace("://127.0.0.1:3002/", "://127.0.0.1:3000/")
    .replace("://localhost:3002/", "://localhost:3000/");
}

function fixItem<T extends PublicProductListItem>(item: T): T {
  return {
    ...item,
    photoUrl: fixPhotoUrl(item.photoUrl),
    images: item.images.map((u) => fixPhotoUrl(u) ?? u),
  };
}

export async function getProducts(
  filters: ListFilters = {},
): Promise<PublicProductListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  const path = `/api/v1/public/products${qs ? `?${qs}` : ""}`;

  const res = await crmFetch<PublicProductListResponse>(path, {
    revalidate: 60,
    tags: [
      "crm:products",
      ...(filters.channel ? [`crm:products:${filters.channel}`] : []),
    ],
  });
  return { ...res, items: res.items.map(fixItem) };
}

export async function getProductBySlug(
  slug: string,
  channel?: PublicChannel,
): Promise<PublicProductDetail> {
  const qs = channel ? `?channel=${channel}` : "";
  const res = await crmFetch<PublicProductDetail>(
    `/api/v1/public/products/${encodeURIComponent(slug)}${qs}`,
    {
      revalidate: 300,
      tags: [
        "crm:products",
        channel ? `crm:product:${channel}:${slug}` : `crm:product:${slug}`,
      ],
    },
  );
  return fixItem(res);
}

export async function getHealth(): Promise<PublicHealthResponse> {
  return crmFetch<PublicHealthResponse>("/api/v1/public/health");
}
