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
  /** Telefono — esposto dal CRM dopo il giro password reset (Brief §10). */
  phone?: string | null;
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

export type B2bRegisterInput = {
  name: string;
  email: string;
  companyName: string;
  vatNumber?: string | null;
  phone?: string | null;
};

export type B2bPasswordRequestInput = {
  email: string;
};

export type B2bPasswordResetInput = {
  token: string;
  password: string;
};

export type B2bProfileUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  /** Cambio password: richiede currentPassword + newPassword */
  currentPassword?: string;
  newPassword?: string;
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
  | "b2b-quote"
  | "trade-in"; // valutazione usato proposta dall'utente pubblico

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

// ============================================================================
// Riparazioni — tracking pubblico + preventivo
//
// CONTRATTO CANONICO HUB↔CRM. Allineato a lib/repairs/types.ts del CRM
// (REPAIR_STATUSES). Il CRM deve esporre questi shape sull'API pubblica v1.
// ============================================================================

/** Stati ticket — identici a REPAIR_STATUSES del CRM (lib/repairs/types.ts). */
export type RepairPublicStatus =
  | "accepted"
  | "diagnosed"
  | "in_repair"
  | "awaiting_parts"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

export const REPAIR_PUBLIC_STATUS_LABELS: Record<RepairPublicStatus, string> = {
  accepted: "Accettato",
  diagnosed: "Diagnosticato",
  in_repair: "In lavorazione",
  awaiting_parts: "Attesa ricambi",
  ready_for_pickup: "Pronto al ritiro",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

/** Ordine lineare per la timeline (cancelled è terminale fuori sequenza). */
export const REPAIR_PUBLIC_STATUS_FLOW: RepairPublicStatus[] = [
  "accepted",
  "diagnosed",
  "in_repair",
  "awaiting_parts",
  "ready_for_pickup",
  "delivered",
];

/**
 * Stato del preventivo. RICHIEDE estensione lato CRM: oggi il ticket ha
 * `estimateCents` ma nessuno stato di approvazione cliente. Il CRM deve
 * aggiungere il ciclo sent → approved/declined.
 */
export type RepairQuoteStatus = "none" | "sent" | "approved" | "declined";

export type RepairQuotePublic = {
  status: RepairQuoteStatus;
  amountCents: number | null;
  description: string | null;
  validUntil: string | null; // ISO 8601
  sentAt: string | null;
  respondedAt: string | null;
  declineReason: string | null;
};

export type RepairStatusHistoryPublic = {
  status: RepairPublicStatus;
  note: string | null;
  at: string; // ISO 8601
};

/** Vista pubblica del ticket — campi sensibili (devicePassword, costi interni,
 *  customerId, tecnico) MAI esposti. imei già mascherato lato CRM. */
export type RepairPublic = {
  ticketNumber: string;
  status: RepairPublicStatus;
  deviceBrand: string | null;
  deviceModel: string | null;
  imeiMasked: string | null;
  defectReported: string;
  defectDiagnosed: string | null;
  quote: RepairQuotePublic;
  statusHistory: RepairStatusHistoryPublic[];
  createdAt: string;
  updatedAt: string;
};

export type RepairLookupInput = {
  ticket: string;
  /** Ultime 4-6 cifre, match server-side su customerSnapshotPhone. */
  phoneSuffix: string;
};

export type RepairQuoteAction = "accept" | "decline";

export type RepairQuoteResponseInput = {
  ticket: string;
  phoneSuffix: string;
  action: RepairQuoteAction;
  reason?: string | null;
};

// ============================================================================
// Corsi (Cellcom Academy) — list pubblica + corsi del cliente autenticato
//
// Allineato a docs/SITE-INTEGRATION-BRIEF.md §10 del CRM.
// Public list: titolo, livello, descrizione, prezzo, paymentLink, coverUrl.
// Customer list: stessi campi + enrollment{ approvalStatus, progressPct }.
// ============================================================================

export type CourseLevel = "base" | "intermedio" | "avanzato";

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  base: "Base",
  intermedio: "Intermedio",
  avanzato: "Avanzato",
};

export type CoursePublic = {
  id: string;
  slug?: string | null;
  title: string;
  level: CourseLevel;
  description: string | null;
  durationLabel?: string | null;
  priceCents: number | null;
  paymentLink: string | null;
  coverUrl: string | null;
};

export type CoursesPublicResponse = {
  items: CoursePublic[];
  total: number;
};

export type CourseEnrollmentStatus = "pending" | "approved" | "rejected";

export const COURSE_ENROLLMENT_LABELS: Record<CourseEnrollmentStatus, string> = {
  pending: "In attesa di approvazione",
  approved: "Approvato",
  rejected: "Non approvato",
};

export type CourseEnrollment = {
  approvalStatus: CourseEnrollmentStatus;
  progressPct: number; // 0-100
  enrolledAt: string;
  approvedAt: string | null;
  rejectedReason: string | null;
};

export type CustomerCourse = CoursePublic & {
  enrollment: CourseEnrollment;
};

export type CustomerCoursesResponse = {
  items: CustomerCourse[];
};

export type CourseVideo = {
  id: string;
  title: string;
  description: string | null;
  durationSec: number;
  videoUrl: string;
  watchedSec: number;
  order: number;
};

export type CourseVideosResponse = {
  items: CourseVideo[];
};

// ============================================================================
// Area clienti B2C — login cliente finale
//
// RICHIEDE auth B2C lato CRM: oggi solo i customer con `isB2b=true` hanno
// credenziali. Il CRM deve abilitare login per categoria locale/riparazione
// (stesso meccanismo password dei B2B). Shape speculari a B2bLogin*.
// ============================================================================

/**
 * Categorie cliente CRM (vedi lib/customers/types.ts CRM). Per il portale B2C
 * tipicamente `riparazione` o `locale`. `b2b` non passa di qui (usa /api/v1/b2b).
 */
export type CustomerCategory =
  | "locale"
  | "b2b"
  | "ricambi"
  | "corsista"
  | "riparazione";

export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: CustomerCategory;
};

export type CustomerLoginRequest = {
  email: string;
  password: string;
};

/**
 * Set-password onboarding (link email). Il CRM non espone self-register:
 * lo staff invita il cliente da admin, parte email con token monouso (7gg),
 * la pagina HUB /imposta-password chiama questo endpoint.
 */
export type CustomerSetPasswordRequest = {
  token: string;
  password: string;
};

export type CustomerLoginResponse = {
  sessionToken: string;
  expiresAt: string;
  customer: CustomerProfile;
};

/**
 * Cruscotto area clienti: i ticket riparazione del cliente autenticato.
 * In lista lo `statusHistory` è `[]` per performance (vedi doc CRM):
 * per lo storico completo si chiama `lookupRepair`.
 */
export type CustomerRepairsResponse = {
  repairs: RepairPublic[];
};

// ============================================================================
// Usato in vendita — catalogo (GET /api/v1/public/used-devices)
//
// Allineato a docs/USED-DEVICES-API.md del CRM. Endpoint GIÀ LIVE.
// ============================================================================

export type UsedDeviceCondition = "ottimo" | "buono" | "discreto" | "rotto";

export type UsedDevice = {
  id: string;
  channel: PublicChannel | "smartphonefix" | "fixhub";
  brand: string;
  model: string;
  variant: string | null;
  color: string | null;
  condition: UsedDeviceCondition;
  conditionLabel: string;
  functional: boolean;
  accessories: string | null;
  warrantyMonths: number | null;
  priceCents: number;
  priceEur: string; // formattato it-IT, comodità
  title: string;
  description: string | null;
  /** URL relativi al dominio CRM — vanno prefissati con CRM_PUBLIC_BASE_URL. */
  photos: string[];
  publishedAt: string; // ISO 8601
};

export type UsedDeviceListResponse = {
  items: UsedDevice[];
  total: number;
  hasMore: boolean;
};

export type UsedDeviceListParams = {
  channel?: string;
  brand?: string;
  condition?: UsedDeviceCondition;
  search?: string;
  limit?: number;
  offset?: number;
};

// ============================================================================
// B2B PORTALE — ordini, preventivi, fatture, note credito, pagamenti,
// spedizioni, documenti. Allineato al brief inviato + contratto CRM.
//
// Auth: X-API-Key + X-B2B-Session. Tutti gli endpoint filtrano server-side
// per customer autenticato. Date ISO 8601, importi sempre in cents.
// ============================================================================

/** Wrapper risposta lista — riusato da tutti gli endpoint list portale B2B. */
export type B2bListResponse<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
};

export type B2bListParams = {
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
};

export type B2bAddress = {
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string;
  province: string;
  country: string;
};

export type B2bDocumentLine = {
  productId: string | null;
  productName: string;
  sku: string | null;
  qty: number;
  unitPriceCents: number;
  lineTotalCents: number;
  notes: string | null;
};

// ─── Ordini ────────────────────────────────────────────────────────────────

export type B2bOrderStatus =
  | "draft"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export const B2B_ORDER_STATUS_LABELS: Record<B2bOrderStatus, string> = {
  draft: "Bozza",
  confirmed: "Confermato",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

export type B2bOrderListItem = {
  id: string;
  number: string;
  createdAt: string;
  status: B2bOrderStatus;
  totalCents: number;
  currency: string;
  itemsCount: number;
  shipmentId: string | null;
};

export type B2bOrderDetail = B2bOrderListItem & {
  customer: { id: string; name: string; company: string | null };
  shippingAddress: B2bAddress;
  billingAddress: B2bAddress;
  lines: B2bDocumentLine[];
  notes: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
};

// ─── Preventivi / Proforma ─────────────────────────────────────────────────

export type B2bQuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export const B2B_QUOTE_STATUS_LABELS: Record<B2bQuoteStatus, string> = {
  draft: "Bozza",
  sent: "Inviato",
  accepted: "Accettato",
  declined: "Rifiutato",
  expired: "Scaduto",
};

export type B2bQuoteListItem = {
  id: string;
  number: string;
  createdAt: string;
  validUntil: string | null;
  status: B2bQuoteStatus;
  totalCents: number;
  currency: string;
  itemsCount: number;
};

export type B2bQuoteDetail = B2bQuoteListItem & {
  lines: B2bDocumentLine[];
  notes: string | null;
  terms: string | null;
  orderId: string | null;
};

export type B2bQuoteAcceptResponse = {
  quote: B2bQuoteDetail;
  order: B2bOrderDetail;
};

// ─── Fatture ───────────────────────────────────────────────────────────────

export type B2bInvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "partial"
  | "overdue"
  | "cancelled";

export const B2B_INVOICE_STATUS_LABELS: Record<B2bInvoiceStatus, string> = {
  draft: "Bozza",
  sent: "Inviata",
  paid: "Pagata",
  partial: "Pagamento parziale",
  overdue: "Scaduta",
  cancelled: "Annullata",
};

export type B2bVatBreakdownLine = {
  rate: number; // % es. 22
  baseCents: number;
  taxCents: number;
};

export type B2bInvoiceListItem = {
  id: string;
  number: string;
  issuedAt: string;
  dueAt: string | null;
  totalCents: number;
  paidCents: number;
  balanceCents: number;
  currency: string;
  status: B2bInvoiceStatus;
  pdfAvailable: boolean;
  orderId: string | null;
};

export type B2bInvoiceDetail = B2bInvoiceListItem & {
  customer: {
    name: string;
    company: string | null;
    vatNumber: string | null;
  };
  lines: B2bDocumentLine[];
  vatBreakdown: B2bVatBreakdownLine[];
  paymentTerms: string | null;
  paymentMethod: string | null;
  notes: string | null;
};

// ─── Note di credito ───────────────────────────────────────────────────────

export type B2bCreditNoteListItem = B2bInvoiceListItem & {
  invoiceId: string | null;
  reason: string | null;
};

export type B2bCreditNoteDetail = Omit<B2bInvoiceDetail, "status"> & {
  status: B2bInvoiceStatus;
  invoiceId: string | null;
  reason: string | null;
};

// ─── Pagamenti ─────────────────────────────────────────────────────────────

export type B2bPaymentMethod =
  | "bonifico"
  | "carta"
  | "contanti"
  | "rid"
  | "altro";

export const B2B_PAYMENT_METHOD_LABELS: Record<B2bPaymentMethod, string> = {
  bonifico: "Bonifico",
  carta: "Carta",
  contanti: "Contanti",
  rid: "RID",
  altro: "Altro",
};

export type B2bPayment = {
  id: string;
  paidAt: string;
  amountCents: number;
  currency: string;
  method: B2bPaymentMethod;
  reference: string | null;
  invoiceIds: string[];
  notes: string | null;
};

// ─── Spedizioni ────────────────────────────────────────────────────────────

export type B2bShipmentStatus =
  | "preparing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "exception";

export const B2B_SHIPMENT_STATUS_LABELS: Record<B2bShipmentStatus, string> = {
  preparing: "In preparazione",
  shipped: "Spedito",
  in_transit: "In transito",
  out_for_delivery: "In consegna",
  delivered: "Consegnato",
  returned: "Reso",
  exception: "Problema",
};

export type B2bShipmentEvent = {
  at: string;
  status: string;
  location: string | null;
  note: string | null;
};

export type B2bShipmentListItem = {
  id: string;
  orderId: string | null;
  carrier: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  status: B2bShipmentStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export type B2bShipmentDetail = B2bShipmentListItem & {
  events: B2bShipmentEvent[];
  recipient: { name: string; company: string | null; phone: string | null };
  shippingAddress: B2bAddress;
};

// ─── Documenti amministrativi (catch-all) ──────────────────────────────────

export type B2bDocumentKind =
  | "ddt"
  | "contract"
  | "delivery_note"
  | "tax_id"
  | "ce_certificate"
  | "warranty"
  | "other";

export const B2B_DOCUMENT_KIND_LABELS: Record<B2bDocumentKind, string> = {
  ddt: "DDT",
  contract: "Contratto",
  delivery_note: "Bolla di consegna",
  tax_id: "Certificato fiscale",
  ce_certificate: "Certificato CE",
  warranty: "Garanzia",
  other: "Altro",
};

export type B2bDocumentListItem = {
  id: string;
  kind: B2bDocumentKind;
  title: string;
  issuedAt: string;
  pdfAvailable: boolean;
  relatedOrderId: string | null;
  relatedInvoiceId: string | null;
};
