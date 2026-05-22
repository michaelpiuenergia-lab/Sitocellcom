export type PublicChannel = "cellcom" | "fastfix" | "italianparts";
export type PublicCondition = "new" | "used" | "refurbished";
export type PublicKind = "device" | "part" | "accessory" | "other";

export type PublicStockTotal = { count: number; capped: boolean };

export type PublicApiErrorCode =
  | "UNAUTHORIZED"      // 401
  | "FORBIDDEN_ORIGIN"  // 403
  | "NOT_FOUND"         // 404
  | "SLUG_AMBIGUOUS"    // 409
  | "INVALID_PARAM"     // 400
  | "INTERNAL";         // 500

export type PublicApiError = {
  error: {
    code: PublicApiErrorCode;
    message: string;
    detail?: string;
  };
};

export type PublicHealthResponse = {
  status: "ok";
  version: "v1";
  timestamp: string;
};

export type PublicProductListItem = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string | null;
  condition: PublicCondition | null;
  priceCents: number;
  stock: PublicStockTotal;           // { count, capped }
  channel: PublicChannel;
  photoUrl: string | null;            // sempre assoluto o null
  images: string[];                   // [photoUrl] o []
  compatibleModels: string | null;
  kind: PublicKind;
  variantCount: number;
};

export type PublicProductListResponse = {
  items: PublicProductListItem[];
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
};

export type PublicProductVariant = {
  id: string;
  label: string;
  color: string | null;
  storage: string | null;
  size: string | null;
  priceCents: number | null;          // null = eredita dal parent
  stock: PublicStockTotal;
  barcode: string | null;
  sku: string | null;
};

export type PublicProductDetail = PublicProductListItem & {
  description: string | null;
  barcode: string | null;
  sku: string | null;
  variants: PublicProductVariant[];
};
