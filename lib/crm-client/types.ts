export type PublicChannel = "cellcom" | "fastfix" | "italianparts";
export type PublicCondition = "new" | "used" | "refurbished";
export type PublicKind = "device" | "part" | "accessory" | "other";

export type PublicStockTotal = { count: number; capped: boolean };

export type PublicApiErrorCode =
  | "UNAUTHORIZED"         // 401 — X-API-Key mancante/invalida
  | "INVALID_CREDENTIALS"  // 401 — login B2B fallito (email/password)
  | "INVALID_SESSION"      // 401 — X-B2B-Session mancante/scaduta/revocata
  | "NOT_B2B"              // 403 — account valido ma is_b2b=false
  | "FORBIDDEN_ORIGIN"     // 403
  | "NOT_FOUND"            // 404
  | "METHOD_NOT_ALLOWED"   // 405
  | "SLUG_AMBIGUOUS"       // 409
  | "INVALID_PARAM"        // 400
  | "INVALID_PAYLOAD"      // 400 — body Zod validation failed
  | "RATE_LIMITED"         // 429 — Retry-After header
  | "INTERNAL";            // 500

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
  /**
   * Prezzo pubblico in centesimi. `null` quando il CRM non espone il prezzo
   * sul public API (es. ricambi con `kind="part"` → `priceHidden=true`).
   * Consumer rule: se `priceHidden` è true, ignora `priceCents` e mostra
   * "Su richiesta" / CTA contatto.
   */
  priceCents: number | null;
  /**
   * True se il CRM nasconde il prezzo sul public API (tipicamente i ricambi).
   * Sul listino B2B (`/b2b/products`) è sempre `false`.
   */
  priceHidden: boolean;
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
  /** null = eredita dal parent, oppure il CRM non espone il prezzo pubblico */
  priceCents: number | null;
  /** Stessa semantica di PublicProductListItem.priceHidden */
  priceHidden: boolean;
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

// ============================================================================
// B2B (Phase 1.5) — vedi docs/architecture/CRM-BRIEF-B2B.md
// ============================================================================

export type B2bPricingTier = {
  id: string;
  code: string;
  name: string;
};

export type B2bCustomer = {
  id: string;
  name: string;
  company: string | null;
  vatNumber: string | null;
  email: string;
  pricingTier: B2bPricingTier | null;
};

export type B2bLoginRequest = {
  email: string;
  password: string;
};

export type B2bLoginResponse = {
  sessionToken: string;
  expiresAt: string;
  customer: B2bCustomer;
};

export type B2bPriceSource =
  | "customer-override"   // step 1-2 — override puntuale per cliente
  | "tier-variant"        // step 3 — listino tier per variante
  | "tier-product"        // step 4 — listino tier per prodotto
  | "product-b2b-price"   // step 5 — campo b2b_price_cents sul prodotto
  | "tier-discount"       // step 6 — sconto % default del tier su prezzo pubblico
  | "public-fallback";    // step 7 — prezzo pubblico tal quale

/**
 * Stessa shape di PublicProductListItem ma `priceCents` applica il listino del
 * cliente autenticato. Include i campi extra per UI di confronto.
 *
 * Sul listino B2B il prezzo è sempre presente (`priceCents: number`,
 * `priceHidden: false`). `publicPriceCents` può essere `null` se il public
 * API non espone il prezzo per quel prodotto (es. ricambi).
 */
export type B2bProductListItem = Omit<
  PublicProductListItem,
  "priceCents" | "priceHidden"
> & {
  priceCents: number;
  priceHidden: false;
  publicPriceCents: number | null;
  priceSource: B2bPriceSource;
};

export type B2bProductVariant = Omit<
  PublicProductVariant,
  "priceCents" | "priceHidden"
> & {
  priceCents: number | null;          // null = eredita dal parent
  priceHidden: false;
  publicPriceCents: number | null;
  priceSource: B2bPriceSource;
};

export type B2bProductDetail = Omit<
  PublicProductDetail,
  "variants" | "priceCents" | "priceHidden"
> & {
  priceCents: number;
  priceHidden: false;
  publicPriceCents: number | null;
  priceSource: B2bPriceSource;
  variants: B2bProductVariant[];
};

export type B2bProductListResponse = {
  items: B2bProductListItem[];
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
};

// ============================================================================
// Site Requests (intake unificato)
// ============================================================================

export type SiteRequestKind =
  | "info"
  | "spare-part"
  | "repair"
  | "b2b-quote";

export type SiteRequestSource = "hub-public" | "hub-b2b";

export type SiteRequestStatus =
  | "da-gestire"
  | "in-lavorazione"
  | "risposta-inviata"
  | "chiusa"
  | "spam";

export type SiteRequestCustomerPayload = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
};

export type SiteRequestProductPayload = {
  id: string | null;
  slug: string | null;
  name: string | null;
  variantId: string | null;
  variantLabel: string | null;
};

export type SiteRequestMeta = {
  userAgent: string;
  referrer: string | null;
  locale: string;
};

export type SiteRequestPayload = {
  kind: SiteRequestKind;
  source: SiteRequestSource;
  customer: SiteRequestCustomerPayload;
  product: SiteRequestProductPayload | null;
  message: string | null;
  /**
   * GDPR — true se l'utente ha accettato esplicitamente il trattamento dati
   * dal form. Falso/assente → la richiesta non sarebbe stata mai accettata
   * dal nostro endpoint, quindi a valle del CRM possiamo assumerla sempre
   * true. La salviamo per dimostrare la base legale del trattamento.
   */
  privacyAccepted: true;
  /**
   * Honeypot anti-bot. Campo input nascosto via CSS nel form: gli utenti
   * reali lo lasciano vuoto, i bot rotanti lo popolano. Se non-vuoto il CRM
   * marca la richiesta come spam server-side (response 201 finta).
   * Vedi CRM-BRIEF-B2B.md §2.2.3.
   */
  hpf?: string;
  meta: SiteRequestMeta;
};

export type SiteRequestCreatedResponse = {
  id: string;
  status: SiteRequestStatus;
  createdAt: string;
};

// ============================================================================
// Pricing viewer — usato da pricing/resolver per scegliere prezzo da mostrare
// ============================================================================

export type PricingViewer =
  | { kind: "public" }
  | {
      kind: "b2b";
      customerId: string;
      tierCode: string | null;
      tierName: string | null;
    };
