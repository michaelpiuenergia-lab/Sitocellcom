# CRM-BRIEF-B2B.md

> Brief tecnico per il repo CRM (sessione Kimi). Cosa deve fornire il CRM perché l'HUB possa attivare l'area B2B + il pricing differenziato + l'intake richieste.
>
> Versione: 2026-05-24 — derivata da [HUB-MASTER-PLAN.md §18](./HUB-MASTER-PLAN.md).
> Autore HUB-side: Claude. Da relayare nella sessione Kimi via copia/incolla.

---

## 1. Contesto

Il nuovo HUB pubblico Gruppo Cellcom (`Sito cellcom/`) deve gestire due scenari:

1. **Vendita pubblico** — utenti non autenticati, vedono prezzo al pubblico.
2. **Vendita B2B** — clienti aziende/rivenditori autenticati, vedono prezzo riservato.

Lo stesso prodotto del CRM/magazzino esiste **una sola volta**, ma ha più prezzi associati (pubblico, B2B per tier, eventuali override per cliente). L'HUB non duplica il magazzino, non duplica gli utenti, non gestisce password localmente.

Inoltre, tutte le richieste in arrivo dal sito (info prodotto, ricambio, riparazione, preventivo B2B) devono **atterrare nel CRM** come record con stato `"da gestire"`. Nessuna richiesta resta sul sito.

---

## 2. Cosa serve dal CRM

### 2.1 Nuove tabelle / colonne

> Tutte da creare nel CRM. Convenzioni di nomi allineate allo schema esistente (`lib/db-schema.ts`).

#### 2.1.1 Estensione `customers`

```sql
ALTER TABLE customers
  ADD COLUMN is_b2b BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN b2b_company_name TEXT,
  ADD COLUMN b2b_vat_number TEXT,
  ADD COLUMN pricing_tier_id UUID REFERENCES pricing_tiers(id),
  ADD COLUMN b2b_password_hash TEXT,          -- bcrypt/argon2, nullable per clienti non-B2B
  ADD COLUMN b2b_last_login_at TIMESTAMPTZ;

CREATE INDEX idx_customers_is_b2b ON customers(is_b2b) WHERE is_b2b = TRUE;
```

#### 2.1.2 Nuova tabella `pricing_tiers`

```sql
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,           -- es. "RIVENDITORE", "OPERATORE", "VIP"
  name TEXT NOT NULL,
  description TEXT,
  default_discount_percent NUMERIC(5,2) DEFAULT 0,  -- sconto base se non c'è override
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2.1.3 Nuova tabella `tier_prices` (prezzo per tier + prodotto)

```sql
CREATE TABLE tier_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,  -- nullable: prezzo base prodotto
  price_cents INTEGER NOT NULL,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tier_id, product_id, variant_id)
);

CREATE INDEX idx_tier_prices_lookup ON tier_prices(tier_id, product_id, variant_id);
```

#### 2.1.4 Nuova tabella `customer_prices` (override per singolo cliente)

```sql
CREATE TABLE customer_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, product_id, variant_id)
);
```

**Regola di risoluzione prezzo B2B** (da implementare in `lib/products/pricing.ts` lato CRM):

```
1. customer_prices(customer_id, product_id, variant_id)   ← override puntuale per cliente
2. customer_prices(customer_id, product_id, NULL)         ← override prodotto-livello
3. tier_prices(pricing_tier_id, product_id, variant_id)   ← listino tier per variante
4. tier_prices(pricing_tier_id, product_id, NULL)         ← listino tier per prodotto
5. fallback: prezzo pubblico con `default_discount_percent` del tier applicato
6. fallback finale: prezzo pubblico tal quale
```

#### 2.1.5 Nuova tabella `b2b_sessions`

```sql
CREATE TABLE b2b_sessions (
  token TEXT PRIMARY KEY,              -- token opaque, 256 bit random base64
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip TEXT
);

CREATE INDEX idx_b2b_sessions_customer ON b2b_sessions(customer_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_b2b_sessions_expires ON b2b_sessions(expires_at) WHERE revoked_at IS NULL;
```

Token TTL consigliato: **24h sliding** (refresh su ogni richiesta). Cleanup periodico via cron CRM.

#### 2.1.6 Nuova tabella `site_requests`

Unica coda per tutte le richieste in arrivo dall'HUB.

```sql
CREATE TABLE site_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('info', 'spare-part', 'repair', 'b2b-quote')),
  source TEXT NOT NULL CHECK (source IN ('hub-public', 'hub-b2b')),
  status TEXT NOT NULL DEFAULT 'da-gestire' CHECK (status IN ('da-gestire', 'in-lavorazione', 'risposta-inviata', 'chiusa', 'spam')),

  -- Dati cliente (denormalizzati: la richiesta resta valida anche se il cliente cambia)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,

  -- Collegamento opzionale a cliente esistente (solo per source = 'hub-b2b')
  b2b_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Prodotto richiesto (denormalizzato)
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_slug TEXT,
  product_name TEXT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_label TEXT,

  message TEXT,
  meta JSONB DEFAULT '{}'::jsonb,    -- userAgent, referrer, locale, ip

  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_site_requests_status ON site_requests(status, created_at DESC);
CREATE INDEX idx_site_requests_kind ON site_requests(kind, status);
CREATE INDEX idx_site_requests_b2b_customer ON site_requests(b2b_customer_id) WHERE b2b_customer_id IS NOT NULL;
```

**Nel gestionale CRM**: aggiungere una view "Richieste sito" con filtri per `kind`, `source`, `status`. Notifica oncall per stato `da-gestire` > 24h.

---

### 2.2 Endpoint da esporre

Tutti gli endpoint accettano header `X-API-Key` come quelli `public` esistenti. Versione `v1`. Base path: `/api/v1/`.

#### 2.2.1 Auth B2B

##### `POST /api/v1/b2b/login`

```ts
// Request
{ "email": string, "password": string }

// Response 200
{
  "sessionToken": string,           // opaque base64, 256 bit
  "expiresAt": string,              // ISO 8601
  "customer": {
    "id": string,
    "name": string,
    "company": string | null,
    "vatNumber": string | null,
    "email": string,
    "pricingTier": {
      "id": string,
      "code": string,
      "name": string
    } | null
  }
}

// Response 401
{ "error": { "code": "INVALID_CREDENTIALS", "message": "..." } }

// Response 403
{ "error": { "code": "NOT_B2B", "message": "Account non abilitato B2B" } }
```

Rate limit: 5 tentativi / 15 minuti per email + IP. Dopo lockout 30 min.

##### `POST /api/v1/b2b/logout`

Header: `X-B2B-Session: <token>`. Setta `revoked_at = now()` sulla sessione. Risposta 204.

##### `GET /api/v1/b2b/me`

Header: `X-B2B-Session: <token>`. Risposta uguale al campo `customer` del login. Refresha `expires_at` (sliding session).

#### 2.2.2 Prodotti B2B

##### `GET /api/v1/b2b/products`

Header: `X-B2B-Session: <token>` obbligatorio. Stessi query params di `/api/v1/public/products` (`channel`, `search`, `category`, `condition`, `brand`, `kind`, `limit`, `offset`).

Differenza unica: il campo `priceCents` (e `variants[].priceCents`) applica la regola di risoluzione prezzo B2B (§2.1.4).

Shape risposta **identica** a `PublicProductListResponse` dell'HUB ([`lib/crm-client/types.ts`](../../lib/crm-client/types.ts)). Aggiungere solo un campo extra a livello item:

```ts
{
  ...PublicProductListItem,
  publicPriceCents: number,         // prezzo pubblico originale, per confronto UI
  priceSource: "customer-override" | "tier-variant" | "tier-product" | "tier-discount" | "public-fallback"
}
```

##### `GET /api/v1/b2b/products/:slug`

Idem ma per dettaglio. Stessi campi extra anche sui `variants[]`.

#### 2.2.3 Intake richieste

##### `POST /api/v1/public/requests`

```ts
// Request
{
  "kind": "info" | "spare-part" | "repair" | "b2b-quote",
  "source": "hub-public",
  "customer": {
    "name": string,
    "email": string,
    "phone": string | null,
    "company": string | null
  },
  "product": {
    "id": string | null,
    "slug": string | null,
    "name": string | null,
    "variantId": string | null,
    "variantLabel": string | null
  } | null,
  "message": string | null,
  "meta": {
    "userAgent": string,
    "referrer": string | null,
    "locale": string
  }
}

// Response 201
{ "id": string, "status": "da-gestire", "createdAt": string }

// Response 400
{ "error": { "code": "INVALID_PAYLOAD", "message": "...", "detail": "..." } }
```

Validazione Zod lato CRM identica a quella HUB. Anti-spam: rate limit 10 req/h per IP, honeypot opzionale.

##### `POST /api/v1/b2b/requests`

Header: `X-B2B-Session: <token>` obbligatorio.

Stessa shape ma `source: "hub-b2b"` forzato e `b2b_customer_id` viene risolto dalla sessione (non accettato dal client). Rate limit 30 req/h per cliente.

---

### 2.3 Vincoli operativi

1. **API key dedicate**: l'HUB usa già `hub_prod_*`. Generare set ruotabile e tracciare uso per endpoint nelle `api_keys`.
2. **Logging**: ogni login B2B + ogni richiesta in arrivo loggata strutturata. Includere `request_id` correlabile coi log HUB.
3. **GDPR**: `site_requests` contiene PII. Definire retention (90gg per richieste chiuse, immediato per spam).
4. **Backfill**: alla prima migration, popolare 1 `pricing_tier` di esempio (`code: "RIVENDITORE-DEFAULT"`) e flaggare manualmente 1-2 customer test come B2B per smoke test.

---

## 3. Cosa NON deve fare il CRM

| ❌ | Perché |
|----|--------|
| Esporre l'endpoint B2B senza `X-B2B-Session` obbligatorio | Privacy: i prezzi B2B non devono mai essere pubblici |
| Mescolare `site_requests` con tabelle esistenti `leads` o `repair_tickets` | Coda unica = una sola view nel gestionale. Eventuali conversioni si fanno dopo, manualmente |
| Salvare il prezzo B2B "calcolato" nel campo `products.price_cents` | `price_cents` resta il pubblico. Il B2B si risolve a query time |
| Ritornare al sito password hash, sessioni di altri utenti, dati di altri clienti | Endpoint `/b2b/me` filtra strettamente per `customer_id` della sessione |

---

## 4. Ordine di implementazione consigliato

1. **Schema migrations** (§2.1) — tutte insieme, una sola PR.
2. **Auth B2B** (§2.2.1) — login/logout/me + tests.
3. **Pricing resolver** (§2.1.4) — modulo isolato `lib/products/b2b-pricing.ts`, con unit tests sui 6 livelli di fallback.
4. **Endpoint B2B products** (§2.2.2) — riusa il list/detail public esistente, sostituisce solo il prezzo via resolver.
5. **Intake richieste** (§2.2.3) — endpoint + view CRM "Richieste sito".
6. **Notifica oncall** per `site_requests.status = 'da-gestire' > 24h` (Slack/email, post-MVP).

Step 1-2 sbloccano lato HUB lo scaffolding `(b2b)/login`. Step 3-4 sbloccano `(b2b)/prodotti`. Step 5 sblocca tutti i form di richiesta sia pubblici che B2B.

---

## 5. Allineamento con HUB

Vedi [HUB-MASTER-PLAN.md §18](./HUB-MASTER-PLAN.md#L1) per come l'HUB consuma queste API. I tipi TypeScript dell'HUB (`lib/crm-client/types.ts`) verranno estesi specchiando esattamente la shape qui descritta. Eventuali divergenze vanno aperte come PR su questo brief prima di toccare lo schema.

---

*Brief redatto il 2026-05-24 dalla sessione HUB. Da rivedere/approvare nella sessione CRM (Kimi).*
