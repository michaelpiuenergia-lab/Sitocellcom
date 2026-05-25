# HUB-MASTER-PLAN.md

> Architettura master plan per il nuovo HUB pubblico Gruppo Cellcom / Fast-Fix.
> Versione: 2026-05-24 — MVP Phase 1 + B2B Phase 1.5.
> Stato: APPROVATO per sviluppo.

> **Nota 2026-05-24**: aggiunta sezione §18 "Area B2B & Intake Richieste". La decisione "Zero auth nell'HUB" del 2026-05-22 viene parzialmente rivista: il sito pubblico resta senza auth, ma viene aggiunta un'area `/(b2b)/*` protetta. Vedi Decision Log §16 e sezione §18 per dettagli.

---

## 1. Executive Summary

Il nuovo HUB è un sito pubblico, separato dal CRM, che funge da **casa unica** del Gruppo Cellcom verso il cliente finale. Non sostituisce i 5 siti esistenti né il CRM: è una vetrina intelligente + servizi pubblici + smistatore.

**Regola fondamentale:** il CRM è la fonte unica di verità. L'HUB non duplica mai dati.

### Scope MVP (4 blocchi)

| Blocco | Descrizione | Dato sorgente |
|--------|-------------|---------------|
| **Hero** | 4 card servizi: compra / ripara / impara / rivende | Statico + link-out |
| **Repair Tracker** | Input ticket + telefono → stato live riparazione | CRM API `/api/v1/public/repair-status/:ticket` |
| **Catalog Teaser** | Prodotti, varianti, disponibilità reale | CRM API `/api/v1/public/products` |
| **Mappa Negozi** | Punti vendita, contatti, geolocazione | CRM API `/api/v1/public/stores` (da creare) o config statica Phase 1 |

### Out of Scope (Phase 2+)

- Trade-in calculator
- Diagnosi foto (Vision API)
- Live ticker numeri reali
- Account cliente / Cellcom ID
- Checkout diretto nell'HUB
- Multi-brand via dominio

---

## 2. Stack Tecnico

Replicato identico al CRM per coerenza operativa e mobilità del team.

| Layer | Tecnologia | Versione |
|-------|-----------|----------|
| Framework | Next.js | `16.2.1` |
| Runtime | React | `19.2.4` |
| Language | TypeScript | `5.x` strict |
| Styling | TailwindCSS | `4.x` |
| Font | Geist Sans/Mono (Vercel) + Instrument Serif (Google Fonts) | latest |
| Testing | Vitest + Playwright | `4.1.5` / `1.60.0` |
| Validazione | Zod | `4.4.3` |
| Deploy | Vercel | — |

**Note critiche su Next.js 16:**
- Il file middleware si chiama `proxy.ts` (NON `middleware.ts`).
- `searchParams` e `params` nelle Server Components sono `Promise` da `await`.
- App Router obbligatorio. Nessuna Page Router.

---

## 3. Architettura Generale

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente finale (browser)                                   │
│  — Next.js 16 Server Components (default)                   │
│  — Client Components solo dove serve interattività          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│  NUOVO HUB (questo repo)                                    │
│  — Frontend pubblico (marketing + catalog + servizi)        │
│  — BFF interno: `/api/*` (cache, form proxy, revalidation)  │
│  — proxy.ts (headers sicurezza, CSP, rate limit)            │
│  — DB: ZERO (solo cache Redis opzionale in futuro)          │
└──────────────────────┬──────────────────────────────────────┘
                       │ fetch + API Key (header)
┌──────────────────────▼──────────────────────────────────────┐
│  CRM CELLCOM (repo esistente)                               │
│  — Next.js 16 + Postgres Neon                               │
│  — API pubbliche versionate `/api/v1/public/*`              │
│  — Auth API key: tabella `api_keys` + verifyApiKey()        │
│  — Fonte unica di verità (prodotti, stock, riparazioni)     │
└─────────────────────────────────────────────────────────────┘
```

### Principi architetturali

1. **Server Components ovunque possibile** — l'HUB è un sito di lettura.
2. **ISR/SSG aggressivo** — pagine marketing revalidate 60s; catalogo con `unstable_cache`.
3. **Zero database locale** — niente tabella prodotti, clienti, ordini, magazzino.
4. **Tutte le chiamate passano da `lib/crm-client/`** — niente fetch sparsi.
5. **Niente collegamenti diretti a Shopify/WooCommerce/FixHub** — solo CRM.

---

## 4. Struttura Repository

```
hub/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                 ← Landing / Hero
│   │   ├── chi-siamo/
│   │   ├── contatti/
│   │   └── layout.tsx
│   ├── (catalog)/
│   │   ├── prodotti/
│   │   │   └── page.tsx             ← Catalog Teaser
│   │   ├── prodotti/[slug]/
│   │   │   └── page.tsx             ← Dettaglio prodotto (SSR/ISR)
│   │   └── layout.tsx
│   ├── (services)/
│   │   ├── riparazioni/
│   │   │   └── page.tsx             ← Repair Tracker (client-heavy)
│   │   ├── corsi/
│   │   │   └── page.tsx             ← Lista corsi (Phase 2)
│   │   └── layout.tsx
│   ├── api/                         ← BFF interno
│   │   ├── revalidate/
│   │   │   └── route.ts             ← On-demand revalidation (ISR)
│   │   ├── proxy/                   ← Proxy form → CRM (CORS safe)
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx                   ← Root layout (font, metadata, provider)
│   └── not-found.tsx
│
├── components/
│   ├── ui/                          ← Design system atomico
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   └── skeleton.tsx
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── service-cards.tsx
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── catalog/
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   ├── product-detail.tsx
│   │   └── stock-badge.tsx
│   ├── repairs/
│   │   ├── repair-tracker-form.tsx
│   │   ├── repair-status-timeline.tsx
│   │   └── repair-quote-form.tsx
│   ├── stores/
│   │   ├── store-map.tsx
│   │   └── store-card.tsx
│   └── layout/
│       ├── brand-logo.tsx
│       └── theme-provider.tsx
│
├── lib/
│   ├── crm-client/                  ← SOLO questo modulo parla col CRM
│   │   ├── client.ts                ← fetch base + API key + retry
│   │   ├── types.ts                 ← Tipi risposte API CRM
│   │   ├── products.ts              ← GET /api/v1/public/products
│   │   ├── repairs.ts               ← GET /api/v1/public/repair-status
│   │   ├── courses.ts               ← GET /api/v1/public/courses
│   │   ├── stores.ts                ← GET /api/v1/public/stores
│   │   └── quotes.ts                ← POST /api/v1/public/repair-quotes
│   ├── brands/
│   │   └── config.ts                ← Config 5 brand (statica Phase 1)
│   ├── seo/
│   │   ├── metadata.ts              ← Template metadata OpenGraph
│   │   └── structured-data.ts       ← JSON-LD per prodotti/negozi
│   ├── analytics/
│   │   └── vercel.ts                ← Vercel Analytics + Speed Insights
│   ├── validation/
│   │   └── schemas.ts               ← Zod schemas per form input
│   ├── utils/
│   │   ├── cn.ts                    ← clsx + tailwind-merge
│   │   ├── format.ts                ← Prezzi, date, telefoni
│   │   └── logger.ts                ← Logger centralizzato (no console.log)
│   └── constants.ts                 ← Colori, URL, limiti
│
├── types/
│   ├── catalog.ts
│   ├── repairs.ts
│   ├── stores.ts
│   └── crm.ts
│
├── public/
│   ├── logos/
│   │   ├── cellcom-logo.svg
│   │   └── fastfix-logo.svg
│   ├── images/
│   │   └── hero-bg.webp
│   └── favicon.ico
│
├── proxy.ts                         ← Middleware v16 (CSP, headers, rate limit)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.mjs
├── .env.example
└── docs/
    └── architecture/
        └── HUB-MASTER-PLAN.md       ← questo file
```

---

## 5. Design System & Palette

### Colori (Tailwind v4 CSS variables)

Il CRM già definisce Cellcom con `primaryColor: #dc2626`. L'HUB usa questa base e la eleva a sistema completo.

```css
:root {
  /* Base */
  --color-background: #050505;        /* nero carbone */
  --color-foreground: #f5f5f5;        /* bianco tecnico sporco */
  --color-muted: #737373;             /* grigio antracite */
  --color-muted-foreground: #a3a3a3;  /* grigio chiaro per testi secondari */
  --color-border: #262626;            /* bordo sottile */
  --color-ring: #dc2626;              /* focus ring rosso */

  /* Brand */
  --color-brand-50: #fef2f2;
  --color-brand-100: #fee2e2;
  --color-brand-200: #fecaca;
  --color-brand-300: #fca5a5;
  --color-brand-400: #f87171;
  --color-brand-500: #ef4444;
  --color-brand-600: #dc2626;         /* rosso Cellcom primario */
  --color-brand-700: #b91c1c;
  --color-brand-800: #991b1b;         /* bordeaux Cellcom secondario */
  --color-brand-900: #7f1d1d;

  /* Surface */
  --color-card: #0a0a0a;
  --color-card-hover: #141414;
  --color-popover: #171717;
}
```

### Tipografia

| Ruolo | Font | Peso | Note |
|-------|------|------|------|
| Display / H1 | Instrument Serif | 400 | Italic per accenti |
| H2-H4 / UI | Geist Sans | 500-600 | — |
| Corpo | Geist Sans | 400 | `leading-relaxed` |
| Mono / Badge | Geist Mono | 400 | Prezzi, SKU, ticket |

### Componenti UI base

- **Button**: `rounded-lg`, gradiente sottile `brand-600 → brand-800`, glow `brand-500/20` al hover.
- **Card**: sfondo `card`, bordo `border`, `rounded-xl`, hover `card-hover` con transizione 200ms.
- **Input**: sfondo `popover`, bordo `border`, focus ring `ring-brand-600`.
- **Badge**: pillole con colori semantici (rosso=urgente, verde=disponibile, giallo=attesa).
- **Skeleton**: shimmer grigio su sfondo scuro per loading stati.

---

## 6. API Contract (CRM ↔ HUB)

L'HUB consuma esclusivamente API dal CRM. Il CRM espone endpoint pubblici versionati `/api/v1/public/*` protetti da API key.

### Endpoint già esistenti nel CRM (da adattare a v1)

| Metodo | Endpoint | Stato | Uso HUB |
|--------|----------|-------|---------|
| GET | `/api/public/catalog` | ✅ Esiste | Catalogo modelli dispositivi |
| GET | `/api/public/courses/:token` | ✅ Esiste | Accesso corsi (Phase 2) |
| GET | `/api/public/documents/:token` | ✅ Esiste | Share link documenti |

### Endpoint da creare nel CRM (lavoro altro repo)

| Metodo | Endpoint | Auth | Uso HUB | Priority |
|--------|----------|------|---------|----------|
| GET | `/api/v1/public/products?channel=&search=&limit=` | API key | Catalog Teaser | **P0** |
| GET | `/api/v1/public/products/:slug` | API key | Dettaglio prodotto | **P0** |
| GET | `/api/v1/public/repair-status/:ticket?phone=` | API key | Repair Tracker | **P0** |
| POST | `/api/v1/public/repair-quotes` | API key | Richiesta preventivo | **P1** |
| GET | `/api/v1/public/courses` | API key | Lista corsi | **P1** |
| GET | `/api/v1/public/stores` | API key | Mappa negozi | **P0** (statica Phase 1) |
| POST | `/api/v1/public/leads` | API key | Form contatto | **P1** |
| POST | `/api/v1/public/trade-in-estimate` | API key | Trade-in (Phase 2) | P2 |

### Schema API key

```ts
// Header obbligatorio su ogni chiamata HUB → CRM
"X-API-Key": "hub_<env>_..."

// Risposta CRM include headers rate limit
"X-RateLimit-Limit": "100"
"X-RateLimit-Remaining": "97"
"X-RateLimit-Reset": "1234567890"
```

### Client CRM (lib/crm-client/client.ts)

```ts
type CrmRequestConfig = {
  endpoint: string;
  method?: "GET" | "POST";
  body?: unknown;
  revalidate?: number; // ISR seconds
  tags?: string[];     // Cache tags per on-demand revalidation
};

async function crmFetch<T>(config: CrmRequestConfig): Promise<T>;
```

Requisiti:
- Base URL da env `CRM_API_URL`
- API key da env `CRM_API_KEY`
- Retry 3x con backoff esponenziale (1s, 2s, 4s)
- Timeout 8s
- Log strutturato (no console.log)
- Fallback graceful: se CRM offline, mostra stato "servizio temporaneamente non disponibile"

---

## 7. Route Map (Next.js App Router)

| Route | Tipo | Rendering | Revalidate | Note |
|-------|------|-----------|------------|------|
| `/` | marketing | SSR / ISR | 60s | Hero + 4 card |
| `/prodotti` | catalog | ISR | 60s | Catalog Teaser |
| `/prodotti/[slug]` | catalog | ISR | 60s | Dettaglio + stock |
| `/riparazioni` | services | SSR | — | Repair Tracker (client form) |
| `/corsi` | services | ISR | 300s | Phase 1: redirect CRM |
| `/negozi` | marketing | ISR | 3600s | Mappa + contatti |
| `/chi-siamo` | marketing | SSG | — | Statico |
| `/api/health` | api | dynamic | — | Health check Vercel |
| `/api/revalidate` | api | dynamic | — | On-demand ISR (segreto) |

### proxy.ts (middleware v16)

Replicare pattern dal CRM con adattamenti:
- CSP per sito pubblico (meno restrittiva, niente auth checks)
- Security headers (HSTS, X-Frame-Options, Referrer-Policy)
- Rate limiting per IP (Redis opzionale, altrimenti in-memory LRU)
- Geoloc header se utile

---

## 8. Moduli MVP — Specifiche

### 8.1 Hero (Landing)

**Layout:** Full viewport height, sfondo nero carbone con gradiente radiale sottile rosso `brand-900/30` dal basso.

**Contenuto:**
- Header: logo Cellcom + nav minimal (Prodotti, Riparazioni, Corsi, Negozi)
- Headline: "Il telefono ha una casa per tutta la vita"
- Subheadline: "Compra, ripara, impara, rivendi. Un solo gruppo, una sola fiducia."
- 4 Card servizi:
  1. **Compra** → link-out Cellcom.it (B2B) / ItalianParts.it (ricambi) / Fast-Fix.it (locale)
  2. **Ripara** → anchor a `/riparazioni` (tracker) + form preventivo
  3. **Impara** → link-out SmartphoneFix.it (corsi)
  4. **Rivendi** → anchor a trade-in (Phase 2, ora placeholder)

**Animazioni:**
- Hero text: fade-in + translateY 20px, stagger 0.1s
- Cards: hover scale 1.02, border glow brand-500/30

### 8.2 Repair Tracker

**URL:** `/riparazioni`

**Form input:**
- Numero ticket (es. `TKT-2026-0042`) — input text
- Telefono (ultimi 4-6 cifre per verifica) — input tel

**Flusso:**
1. Client compila form → submit a `lib/crm-client/repairs.ts`
2. Chiamata GET `/api/v1/public/repair-status/:ticket?phone=...`
3. Se match → mostra timeline stati
4. Se no match → messaggio "Ticket non trovato. Verifica i dati inseriti."

**Timeline UI:**
- 7 stati: ricevuto → diagnosi → preventivo → approvato → lavorazione → pronto → consegnato
- Stato attivo evidenziato in rosso, completati in verde, futuri in grigio
- Data/ora per ogni cambio stato (da `repair_status_history`)
- Info device: modello, IMEI (maskato: `35****8901`), difetto segnalato

### 8.3 Catalog Teaser

**URL:** `/prodotti`

**Griglia:**
- Card prodotto: immagine, nome, brand, condizione (new/used/refurbished), prezzo
- Badge stock: "Disponibile" (verde) / "Ultimi pezzi" (giallo) / "Esaurito" (rosso)
- Filtra per: categoria, condizione, brand
- Ordina per: novità, prezzo crescente/decrescente

**Card click:**
- Va a `/prodotti/[slug]` con dettaglio completo
- Pulsante "Acquista" → link-out al sito verticale giusto:
  - `channel === "cellcom"` → `https://cellcom.it/prodotto/...`
  - `channel === "italianparts"` → `https://italianparts.it/products/...`
  - `channel === "fastfix"` → `https://fast-fix.it/products/...`

**Dettaglio prodotto:**
- Gallery immagini
- Varianti (colore, capacità) con stock per variante
- Descrizione, specifiche
- "Disponibilità in negozio" (da CRM stock per store)

### 8.4 Mappa Negozi

**URL:** `/negozi`

**Phase 1 (statica):**
- Lista card negozi con indirizzo, telefono, orari, servizi offerti
- Mappa embed Google Maps / Leaflet con marker
- Geolocazione browser → sorting per distanza (se permesso)

**Phase 2 (dinamica):**
- Dati da CRM `/api/v1/public/stores`
- Orari reali, servizi attivi, stock disponibile in quel punto vendita

---

## 9. Convenzioni di Codice

Regole non negoziabili, allineate al CRM:

1. **Pattern modulare obbligatorio**: `lib/<dominio>/{types,*-repository,*-service}.ts`
2. **Mai `: any` espliciti** — usare `unknown` + narrowing o Zod.
3. **Mai `alert()`** — usare toast o stati UI inline.
4. **Logger centralizzato** — `lib/utils/logger.ts`, mai `console.log` in produzione.
5. **Schema validazione** — ogni input utente passa per Zod prima di qualsiasi fetch.
6. **Fetch centralizzato** — tutte le chiamate HTTP passano per `lib/crm-client/client.ts`.
7. **Niente database locale** per prodotti, clienti, ordini, magazzino.
8. **Server Components default** — aggiungere `'use client'` solo se necessario (form, canvas, mappe).
9. **Error boundaries** — ogni route group ha il suo `error.tsx`.
10. **Loading states** — ogni route con data fetching ha `loading.tsx` con skeleton.

---

## 10. Piano di Implementazione

### Fase A: Scaffolding (0-2h)
- [ ] Inizializzare repo Next.js 16 + Tailwind 4 + TypeScript strict
- [ ] Configurare `tsconfig.json`, path alias `@/*`
- [ ] Installare dipendenze: zod, geist font, instrument serif
- [ ] Creare struttura cartelle (app/, components/, lib/, types/)
- [ ] Configurare `proxy.ts` con CSP e security headers
- [ ] Setup Tailwind con palette custom (CSS variables)
- [ ] Configurare `next.config.ts` (images, headers, rewrites)

### Fase B: Design System (2-4h)
- [ ] Componenti UI base: Button, Card, Input, Badge, Skeleton
- [ ] Layout: Navbar, Footer, Root layout con font
- [ ] Costanti brand e colori
- [ ] Utility `cn.ts` (clsx + tailwind-merge)
- [ ] Logger centralizzato

### Fase C: CRM Client (4-5h)
- [ ] Implementare `lib/crm-client/client.ts` (fetch + retry + error handling)
- [ ] Tipi condivisi `types/crm.ts`
- [ ] Mock data locali per sviluppo (finché API CRM non sono pronte)
- [ ] Adapter pattern per normalizzare risposte CRM → HUB

### Fase D: Pagine MVP (5-8h)
- [ ] Landing `/` — Hero + 4 card servizi
- [ ] `/riparazioni` — Repair Tracker form + timeline
- [ ] `/prodotti` — Catalog Teaser grid + filtri
- [ ] `/prodotti/[slug]` — Dettaglio prodotto
- [ ] `/negozi` — Mappa + lista negozi

### Fase E: Polish (2-3h)
- [ ] SEO: metadata dinamici, OpenGraph, JSON-LD
- [ ] Loading skeletons + error boundaries
- [ ] Responsive (mobile-first)
- [ ] Performance: Lighthouse 90+
- [ ] Tests: almeno 1 test per pagina critica (Playwright)

### Fase F: Integrazione CRM (parallela, dipende dall'altro repo)
- [ ] CRM espone `/api/v1/public/products`
- [ ] CRM espone `/api/v1/public/repair-status/:ticket`
- [ ] CRM espone `/api/v1/public/stores`
- [ ] Sostituire mock con chiamate reali
- [ ] On-demand revalidation attivo

---

## 11. Cosa NON fare (regole fondamentali)

| ❌ Vietato | Perché |
|-----------|--------|
| Duplicare tabella `customers` nell'HUB | Il CRM è la fonte unica |
| Duplicare tabella `products` o `stock` | Lo stock vero vive nel CRM |
| Parlare direttamente con Shopify/Woo | Passa sempre dal CRM |
| Installare NextAuth / Auth0 / Clerk | Zero auth nell'HUB per MVP |
| Creare DB locale per ordini/magazzino | L'HUB è vetrina, non gestionale |
| File monolitici > 200 righe | Spezzare in componenti/moduli |
| `console.log` in produzione | Usare logger strutturato |
| `: any` esplicito | TypeScript strict sempre |
| alert() / confirm() | Stati UI o toast |
| Monorepo con CRM | Repo indipendenti, deploy separati |
| ISR su dati utente sensibili | Il tracker è client-side, non SSR con dati privati |

---

## 12. Dipendenze (package.json)

```json
{
  "dependencies": {
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zod": "^4.4.3",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "prettier": "^3.8.3",
    "vitest": "^4.1.5",
    "@testing-library/react": "^16.3.2",
    "jsdom": "^29.1.1",
    "@playwright/test": "^1.60.0"
  }
}
```

Note:
- `@vercel/analytics` e `@vercel/speed-insights` opzionali ma consigliati.
- Font Geist via `next/font` (built-in Vercel).
- Font Instrument Serif via Google Fonts + `next/font`.

---

## 13. Variabili d'ambiente (.env.example)

```bash
# CRM Connection
CRM_API_URL=https://cellcom.vercel.app
CRM_API_KEY=hub_prod_xxxxxxxxxxxxxxxx

# Revalidation secret (on-demand ISR)
REVALIDATE_SECRET=xxxxxxxxxxxxxxxx

# Public
NEXT_PUBLIC_APP_URL=https://hub-cellcom.vercel.app

# Optional: analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

---

## 14. Decision Log

| Data | Decisione | Motivazione |
|------|-----------|-------------|
| 2026-05-22 | Single-domain MVP | Meno complessità, focus su contenuto |
| 2026-05-22 | Dark mode default | Premium, risparmio batteria OLED, differenziazione |
| 2026-05-22 | Zero auth nell'HUB | Velocità MVP, niente gestione password |
| 2026-05-22 | Instrument Serif per display | Contrasto elegante con Geist Sans, tono "lifestyle" |
| 2026-05-22 | Rosso `#dc2626` primario | Allineato con brand template Cellcom nel CRM |
| 2026-05-22 | Mock data per sviluppo iniziale | API CRM v1 public non esistono ancora |
| 2026-05-22 | Motion level: **Cinematico** | Direttiva cliente: "superare Apple". Logo animato, scroll-driven, magnetic CTA, grain texture |
| 2026-05-22 | Deploy: **Vercel obbligatorio** | Allineato al CRM, edge functions, ISR nativo, analytics integrate |

---

## 14bis. Motion & Interaction Spec (Cinematico)

Livello di motion confermato: **Cinematico**. Il sito deve trasmettere "non è un sito qualsiasi" entro i primi 3 secondi.

### Logo come leitmotif
- **Hero opener**: la "C" rossa Cellcom si disegna stroke-by-stroke (SVG `pathLength` animato) in 1.2s con easing `cubic-bezier(0.65, 0, 0.35, 1)`.
- **Micro-presence**: la C in versione monogramma compare come bullet nei timeline state del Repair Tracker, come anchor delle sezioni, come favicon, come PWA icon e come OG image generata dinamicamente via `@vercel/og`.
- **Cursor companion**: cursor custom con piccolo "C-ghost" rosso che segue il mouse con spring lag (solo desktop, disabilitato `prefers-reduced-motion`).

### Effetti chiave
| Effetto | Tecnica | Budget |
|---------|---------|--------|
| Logo stroke-in hero | SVG `stroke-dasharray` + Framer Motion | 1.2s, una sola volta |
| Headline mask reveal | CSS `clip-path` lettera-per-lettera | 0.8s, stagger 40ms |
| Scroll-driven parallasse logo | CSS `animation-timeline: scroll()` (con fallback JS) | Zero JS su browser moderni |
| Magnetic CTA | Framer Motion springs su `mousemove` | Solo sui 4 CTA hero |
| Grain texture | SVG `feTurbulence` overlay 2% opacity | Inline, no asset esterno |
| Card hover lift | `transform: translateY(-2px) + glow brand-500/20` | 200ms cubic-bezier custom |
| Image reveal griglia prodotti | `clip-path inset()` 0.6s + blur 8px → 0 | IntersectionObserver |

### Regole non negoziabili
1. **`prefers-reduced-motion` rispettato sempre**: tutte le animazioni hanno fallback a fade/snap. Test obbligatorio.
2. **Niente animation su LCP**: hero text/image deve essere già visibile, animation kicks in al frame successivo.
3. **JS budget per motion**: max 25KB gzip Framer Motion (tree-shaken). Niente GSAP.
4. **60fps minimum** su iPhone 12 (target device cliente). Usare `will-change` chirurgicamente, no abuso.
5. **Cubic-bezier curve custom obbligatorie**: niente `ease-in-out` default. Definire 3-4 curve in `lib/constants.ts` (smooth, snappy, bounce, drift).

### Tipografia choreography
- **H1 hero**: Instrument Serif italic, mask reveal lettera-per-lettera.
- **Prezzi**: Geist Mono con `font-variant-numeric: tabular-nums` — allineamento perfetto sui prodotti.
- **Live counters** (Phase 2 ticker): rolling digits con `<animated-number>` custom.

### 3D Phone Treatment (signature visivo del gruppo)

Direttiva cliente: **effetto rotazione nelle transizioni** quando si passa da un telefono all'altro. Non è il singolo device che gira su sé stesso: è il **carousel/lo switcher** che ruota in 3D mentre cambia il telefono in scena.

Si lega nativamente al concept Phone Lifecycle e a tutti i punti del sito dove si naviga tra più device (catalog, hero showcase, varianti prodotto, comparazioni).

**Tre pattern di transizione 3D, usati in punti diversi del sito:**

| Pattern | Dove | Tecnica | Budget |
|---------|------|---------|--------|
| **P1 — Cube carousel** | Hero landing showcase + catalog featured | 6 facce di un cubo CSS 3D, ogni faccia = un telefono. Autorotation 4s/face + interazione swipe/click. `transform: rotateY()` puro CSS | Zero JS extra. Asset: 6× immagini telefono (WebP, ~30KB/cad) |
| **P2 — Cover flow swap** | Griglia prodotti `/prodotti` (cambio item) + dettaglio varianti | Item entrante ruota da `rotateY(90deg) translateZ(200px)` a `rotateY(0)`, item uscente esce simmetrico. Framer Motion `AnimatePresence` con `mode="popLayout"` | Solo Framer Motion già presente |
| **P3 — Exploded view interattiva** | Pagina `/riparazioni` (hero) + dettaglio prodotto refurbished | `react-three-fiber` + `drei`, modello GLB low-poly scomposto in 5 livelli (back glass, mid+battery, mainboard, display, front glass) che si separano allo scroll | three.js ~600KB → SOLO su queste 2 route via dynamic import, MAI landing |

**Specifiche P1 (Cube carousel) — il "wow" della landing:**
- Cubo 3D CSS al centro hero (o off-axis 30%), 320×640px di base, ruota mostrando una faccia alla volta.
- Ogni faccia = un device del catalogo (immagine statica trasparente PNG/WebP).
- Rotazione automatica ogni 4s con `transform: rotateY(60deg)` per face (6 facce = 360°), easing `cubic-bezier(0.65, 0, 0.35, 1)` 1.2s.
- Pausa su `:hover` o `:focus`.
- Interazione: swipe touch / drag mouse / arrow keys per controllo manuale.
- Caption animata sotto: nome + prezzo del device corrente, cross-fade sincronizzato.
- Fallback `prefers-reduced-motion`: niente cubo, semplice cross-fade tra immagini ogni 4s.

**Specifiche P2 (Cover flow swap) — la transizione catalog/varianti:**
- Quando l'utente cambia filtro / pagina / variante, gli item della griglia non fanno il classico fade.
- Escono ruotando su asse Y di 90° verso l'esterno, i nuovi entrano da -90° con stagger 30ms.
- Effetto perceptivo: come sfogliare carte 3D. Mai usato per oltre 12 item simultanei (performance).
- Su mobile: stessa logica ma asse X (carta che si gira in orizzontale), più naturale al tap.

**Specifiche P3 (Exploded view) — il "wow moment" della pagina riparazioni:**
- Modello GLB: smartphone scomposto in 5 livelli che si separano allo scroll.
- Trigger: pin-scrub con Framer Motion `useScroll` + `useTransform`.
- Sincronizzato con label testuali accanto ai componenti (es. "Batteria sostituibile in 30 min", "Schermo OEM garantito").
- Camera con leggero auto-orbit (3°/s) quando l'utente è fermo, per non far morire la scena.
- Fallback su mobile low-end (`navigator.deviceMemory < 4`): downgrade a P1 cube.

**Regole non negoziabili 3D:**
1. P1 + P2 sono **CSS-only o Framer-only** — niente three.js per le transizioni del catalog.
2. P3 modello GLB sotto i **800KB**, compresso con Draco.
3. three.js MAI nel bundle della landing — solo lazy via `next/dynamic` sulle 2 route che lo usano.
4. Tutti i pattern devono degradare graceful: con JS disabilitato si vede l'immagine statica del primo device.
5. Stessa palette: i telefoni nelle immagini sono in scala di grigi/nero su sfondo trasparente, lo sfondo del cubo è il bordeaux `brand-800` con grain texture, accent rosso `brand-600` solo sul reflection/glow.
6. Niente glassmorphism eccessivi: eleganza tecnica, non gimmick.

**Asset da produrre/procurare prima del dev:**
- 6× immagini PNG/WebP trasparenti di telefoni stilizzati (iPhone-like generico, ~30KB cad)
- 1× modello GLB low-poly exploded (~5K triangles totali) per P3
- 1× video MP4 fallback 3s loop per browser che non supportano CSS 3D transforms (rarissimi, fallback estremo)

Se questi asset non sono pronti al day-1, fase D parte con placeholder: silhouette SVG nera del device su ogni faccia del cubo. Sostituzione in fase E.

### Colors revised
La palette resta quella della §5, ma con **solo UN accent secondario** (bordeaux `#991B1B`). Niente verdi/gialli/blu nelle decorazioni. Gli stati semantici (success/warning/error) sono confinati ai badge stock e timeline riparazioni, mai nel marketing.

---

## 16. Deploy & Infrastructure

**Piattaforma:** Vercel (decisione vincolante, allineata al CRM).

### Requisiti Vercel
- Region: `fra1` (Frankfurt) per latency UE — stesso del CRM
- Build: `npm run build`, output `.next/standalone` se possibile
- Node version: 22.x (Vercel default 2026)
- ISR attivo con `revalidate` per route (vedi §7)
- Edge Functions per `proxy.ts` (middleware)
- Image Optimization Vercel: abilitata, formati AVIF + WebP
- `@vercel/og` per OG image dinamiche
- `@vercel/analytics` + `@vercel/speed-insights` installati

### Environment variables Vercel
Vedi `.env.example` in §13. Tutte da configurare in Vercel Dashboard prima del primo deploy:
- `CRM_API_URL`, `CRM_API_KEY` (server-only, NON `NEXT_PUBLIC_*`)
- `REVALIDATE_SECRET` (server-only)
- `NEXT_PUBLIC_APP_URL`

### Vercel-specific optimizations
- `next.config.ts` con `images.remotePatterns` per host CRM
- `headers()` config con HSTS, X-Frame-Options, X-Content-Type-Options
- `redirects()` per old paths se ne arriveranno
- Deploy preview su ogni PR
- Production branch: `main`

### Domini
- Phase 1 MVP: dominio Vercel temporaneo (`cellcom-hub.vercel.app`)
- Pre-launch: dominio finale da decidere col cliente (candidate: `cellcom-group.it`, `cellcom.shop`, `cellcom.it` con redirect dell'attuale WP)

---

## 14bis. Motion & Interaction Spec

### Filosofia

"Cinematico" significa che ogni movimento ha un **motivo narrativo**: il logo che disegna sé stesso (arrivo), le parole che emergono dal basso (rivelazione), il cubo che ruota (scoperta), il bottone che ti segue (invito). Niente animazione decorativa senza funzione.

### Logo Leitmotif (la "C" rossa)

| Contesto | Effetto | Tech |
|----------|---------|------|
| Header | Stroke-in 1.2s al load, poi statico | SVG path + Framer Motion `initial/animate` |
| Favicon / OG / PWA | Monogramma "C" rossa isolata | SVG statico |
| Repair tracker bullet | Micro "C" come completed-step icon | SVG inline, no animazione |
| Cursor companion (desktop) | La "C" di 12px segue il cursore con lag 0.15s | Framer Motion `useMotionValue` + `useSpring` |

### Effetti chiave

| Effetto | Dove | Implementazione | Budget |
|---------|------|-----------------|--------|
| **Mask reveal headline** | Hero H1 | Framer Motion `staggerChildren` 0.1s, `y: 40 → 0`, `opacity` | 0KB (FM già incluso) |
| **Scroll-driven parallax** | Landing sections | CSS `animation-timeline: scroll()` nativo, fallback FM `useScroll` | 0KB |
| **Magnetic CTA** | Tutti i `.btn-primary` | FM `useSpring` stiffness 150, damping 15, max offset 20%/30% | 0KB |
| **Grain texture** | Tutta l'app | SVG inline `<feTurbulence>` overlay, `opacity: 0.03`, `mix-blend-mode: overlay` | ~200B |
| **Card hover glow** | Product cards, service cards | Tailwind `hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.6)]` | 0KB |
| **Cube carousel** | Hero center | CSS 3D transforms (NO JS per rotazione). JS solo per snap/drag/keyboard | 0KB |
| **Caption crossfade** | Cube carousel | FM `AnimatePresence mode="wait"` | 0KB |

### Curve cubic-bezier (lib/constants.ts)

| Nome | Valore | Uso |
|------|--------|-----|
| `smooth` | `[0.65, 0, 0.35, 1]` | Cube carousel, hero entrances, scroll-driven |
| `snappy` | `[0.34, 1.56, 0.64, 1]` | UI interactions, button presses, magnetic snap |
| `drift` | `[0.16, 1, 0.3, 1]` | Word-by-word reveal, caption crossfade |

Nessun `ease-in-out` default. Ogni animazione dichiara esplicitamente la sua curva.

### prefers-reduced-motion

- **Requisito:** SEMPRE rispettato.
- **Implementazione:** `useReducedMotion()` di Framer Motion come guard su ogni effetto motion.
- **Fallback:**
  - Cube → cross-fade tra facce (opacity, no transform)
  - Magnetic → offset 0
  - Word reveal → fade semplice, niente stagger
  - Grain → rimosso

### Performance

- **60fps minimum su iPhone 12.**
- **Budget motion JS: max 25KB gzip.** Framer Motion tree-shaken (~18KB). Nessun GSAP.
- **Will-change:** usato solo su `.cube` durante drag.
- **Layout thrashing:** nessuna lettura/scrittura interleaved nei pointer events.

### 3D Phone Treatment

**NON:** il singolo telefono ruota su sé stesso.
**SI:** la TRANSIZIONE tra telefoni è 3D rotante.

#### P1 — Cube Carousel (hero landing + featured catalog)
- Cubo CSS 3D `320×640px`, 6 facce = 6 device
- `rotateY(60deg)` ogni 4s, easing `smooth` 1.2s
- Pausa su hover/focus, swipe/drag/arrow keys per controllo manuale
- Caption nome+prezzo crossfade sincronizzato
- Fallback reduced-motion: cross-fade immagini ogni 4s
- **ZERO JS extra per la rotazione**, solo CSS 3D transforms

#### P2 — Cover Flow Swap (griglia /prodotti + cambio variante)
- Cambio filtro/pagina → item escono con `rotateY(90deg) translateZ(200px)`
- Item entranti da `-90deg`, stagger 30ms
- Framer Motion `AnimatePresence mode="popLayout"`
- Mobile: asse X (carta orizzontale)
- Max 12 item simultanei per performance

#### P3 — Exploded View (/riparazioni + dettaglio refurbished)
- `react-three-fiber` dynamic import, `three.js` MAI in landing bundle
- Modello GLB ~5K tris
- Placeholder day-1: silhouette SVG nera

### Tipografia choreography

| Elemento | Animazione | Delay | Easing |
|----------|-----------|-------|--------|
| Eyebrow | `opacity: 0→1`, `y: 20→0` | 0.6s | smooth |
| H1 words | `opacity: 0→1`, `y: 40→0` | 0.8s + 0.1s stagger | drift |
| Subtitle | `opacity: 0→1`, `y: 20→0` | 1.7s | smooth |
| CTA row | `opacity: 0→1`, `y: 20→0` | 1.9s | smooth |
| Cube | `opacity: 0→1`, `scale: 0.9→1` | 0.4s | smooth |
| Caption | `opacity: 0→1`, `y: 8→0` | on change | smooth |

### Asset 3D richiesti

| Asset | Formato | Dimensione | Stato |
|-------|---------|-----------|-------|
| 6× device stilizzati | PNG/WebP trasparente | ~30KB cad | Da fornire |
| 1× modello exploded | GLB | ~5K tris | Da fornire |
| Logo C monogramma | SVG vettoriale | <5KB | Da fornire |

---

## 15. Deploy & Infrastructure

### Vercel (obbligatorio)

Allineato al CRM. Configurazione target:

| Parametro | Valore |
|-----------|--------|
| Piattaforma | Vercel |
| Region | `fra1` (Frankfurt, EU Central) |
| Runtime Node | `22.x` |
| Middleware | Edge Functions (`proxy.ts`) |
| Image Optimization | AVIF + WebP |
| OG Images | `@vercel/og` per dynamic OpenGraph |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` |

### Env vars

| Variabile | Scope | Note |
|-----------|-------|------|
| `CRM_API_URL` | Server | URL base CRM |
| `CRM_API_KEY` | Server | **MAI esposta client-side** |
| `REVALIDATE_SECRET` | Server | Per on-demand ISR |
| `NEXT_PUBLIC_APP_URL` | Public | URL pubblico dell'hub |

Regole:
- `CRM_API_KEY` è **server-side only**. Nessun `NEXT_PUBLIC_*` per API key.
- In `lib/crm-client/client.ts` la chiave viene letta via `process.env.CRM_API_KEY` in Server Components o route handlers.

### ISR

- Landing `/` → `revalidate: 60`
- Catalogo `/prodotti` → `revalidate: 60`
- Dettaglio prodotto `/prodotti/[slug]` → `revalidate: 60`
- On-demand revalidation via `/api/revalidate` protetto da `REVALIDATE_SECRET`

### CSP (proxy.ts)

Scelta architetturale: **nessun nonce**. Next.js 16 con pagine statiche prerenderizzate non supporta nonce per-request senza forzare dynamic rendering su tutte le route.

Soluzione: CSP con `'unsafe-inline'` per script/style (necessario per Next.js runtime), `'self'` per default-src, e dominii esterni espliciti (Vercel analytics, fonts). Nessun `generateNonce` — codice rimosso.

---

## 16. Decision Log

| Data | Decisione | Motivazione |
|------|-----------|-------------|
| 2026-05-22 | Single-domain MVP | Meno complessità, focus su contenuto |
| 2026-05-22 | Dark mode default | Premium, risparmio batteria OLED, differenziazione |
| 2026-05-22 | Zero auth nell'HUB | Velocità MVP, niente gestione password |
| 2026-05-22 | Instrument Serif per display | Contrasto elegante con Geist Sans, tono "lifestyle" |
| 2026-05-22 | Rosso `#dc2626` primario | Allineato con brand template Cellcom nel CRM |
| 2026-05-22 | Motion level: Cinematico | Direttiva cliente "superare Apple" |
| 2026-05-22 | Deploy: Vercel fra1 | Allineato al CRM, Edge Functions, analytics nativi |
| 2026-05-22 | Cube Carousel CSS 3D | Zero JS per rotazione, 60fps garantito |
| 2026-05-22 | Framer Motion, niente GSAP | Budget 25KB, tree-shaking, ecosystem React |
| 2026-05-22 | CSP senza nonce | Next.js 16 + static pages, nonce non supportato senza dynamic override |
| 2026-05-24 | **Aggiunta area B2B `/(b2b)/*` con login** | Direttiva cliente: gestione separata vendita pubblico vs B2B con prezzi differenziati. Sito pubblico resta senza auth. Vedi §18 |
| 2026-05-24 | Auth B2B: cookie HttpOnly firmato + login via CRM | Niente NextAuth nell'HUB. Il CRM valida credenziali, ritorna token, l'HUB lo conserva in cookie firmato. Coerente con regola "zero DB locale" |
| 2026-05-24 | Intake richieste: tabella unica `site_requests` nel CRM | Una sola entità con `kind: info \| spare-part \| repair \| b2b-quote`, payload JSON, stato iniziale "da gestire". Una view per smistare nel gestionale |
| 2026-05-24 | Pricing differenziato via endpoint dedicato CRM | Stesso prodotto, prezzi diversi: `/api/v1/public/products` (pubblico) vs `/api/v1/b2b/products` (applica listino del cliente autenticato). Zero duplicazione |

---

## 18. Area B2B & Intake Richieste (Phase 1.5)

### 18.1 Principio

Estensione della regola fondamentale §1: il CRM resta fonte unica anche per utenti B2B, listini prezzi differenziati e richieste in arrivo dal sito. L'HUB non gestisce password, non duplica utenti, non tiene un secondo magazzino, non ha un suo DB di clienti.

### 18.2 Separazione hard pubblico vs B2B

| Sezione | Route | Auth | Endpoint CRM prezzi |
|---------|-------|------|---------------------|
| Pubblico | `/(public)/*` (rinominato da `(marketing)`, `(catalog)`, `(services)`) | No | `/api/v1/public/products` |
| B2B | `/(b2b)/*` | Cookie sessione B2B obbligatorio | `/api/v1/b2b/products` |

Il route group `(b2b)` è protetto da `proxy.ts`: se manca il cookie `b2b_session`, redirect a `/(b2b)/login?next=...`. Server Components nell'area B2B usano `requireB2bSession()` come guard duro.

### 18.3 Pricing resolver

Un solo modulo decide quale prezzo mostrare:

```
lib/pricing/resolver.ts
  resolvePrice(product, viewer): { displayCents, label }
  viewer = { kind: "public" } | { kind: "b2b", customerId, tierId }
```

Il prezzo arriva già "applicato" dal CRM (l'endpoint b2b/products ritorna `priceCents` con il listino del cliente). L'HUB non fa calcoli di prezzo, non tiene mai sconti locali. Il resolver serve solo a etichettare l'UI ("Prezzo pubblico" / "Tuo prezzo B2B") e gestire fallback (es. CRM non ritorna prezzo B2B → mostra "Richiedi preventivo").

### 18.4 Intake richieste

Un solo schema, una sola tabella CRM, una sola API HUB:

```
POST /api/requests        (HUB BFF)
   ↓ valida con Zod, allega sessione se b2b
POST /api/v1/public/requests   (CRM)
   ↓ insert in site_requests con stato "da gestire"
```

Schema payload (Zod in `lib/requests/schemas.ts`):

```ts
{
  kind: "info" | "spare-part" | "repair" | "b2b-quote",
  source: "hub-public" | "hub-b2b",
  customer: { name, email, phone, company? },
  product?: { id, slug, name, variantId? },
  message?: string,
  // Solo per b2b-quote / b2b: customerId firmato dal cookie
  b2bCustomerId?: string,
  meta: { userAgent, referrer, locale }
}
```

Il CRM deve esporre una view "Richieste sito" che mostra tutto in un'unica coda, filtrabile per `kind` e `source`. Stato iniziale: `"da gestire"`. Nessuna richiesta resta sul sito.

### 18.5 Struttura cartelle (diff)

Estensione della §4. Cambiamenti:

```
app/
├── (public)/                 ← RINOMINATO da (marketing) + (catalog) + (services)
│   ├── page.tsx              ← landing
│   ├── prodotti/
│   ├── riparazioni/
│   ├── corsi/
│   ├── negozi/
│   └── chi-siamo/
│
├── (b2b)/                    ← NUOVO route group, layout proprio + guard
│   ├── login/
│   │   └── page.tsx
│   ├── prodotti/
│   │   └── page.tsx          ← stesso shape pubblico, prezzi B2B
│   ├── richieste/
│   │   └── page.tsx          ← storico richieste del cliente B2B
│   ├── account/
│   │   └── page.tsx
│   └── layout.tsx            ← chiama requireB2bSession()
│
├── api/
│   ├── auth/
│   │   └── b2b/
│   │       ├── login/route.ts    ← POST credenziali → CRM, set cookie
│   │       ├── logout/route.ts
│   │       └── me/route.ts       ← refresh dati cliente
│   ├── products/route.ts          ← già esiste, ora context-aware
│   └── requests/route.ts          ← NUOVO, intake unificato
│
lib/
├── crm-client/
│   ├── client.ts              (invariato)
│   ├── types.ts               (estendere con PricingContext, B2bCustomer, RequestPayload)
│   ├── products.ts            (firme accettano viewer: public | b2b)
│   ├── auth.ts                ← NUOVO
│   └── requests.ts            ← NUOVO
├── pricing/
│   └── resolver.ts            ← NUOVO
├── auth/
│   ├── session.ts             ← NUOVO (cookie firmato HttpOnly, jose o iron-session)
│   └── guards.ts              ← NUOVO (requireB2bSession, optionalB2bSession)
└── requests/
    └── schemas.ts             ← NUOVO (Zod)

proxy.ts                       ← AGGIUNGE matcher /(b2b)/* → gate cookie
```

### 18.6 Endpoint CRM richiesti (lavoro lato Kimi)

Vedi `docs/architecture/CRM-BRIEF-B2B.md` per il brief tecnico completo da relayare nella sessione Kimi.

In sintesi, il CRM deve esporre (tutti `X-API-Key` obbligatorio):

| Metodo | Endpoint | Scopo |
|--------|----------|-------|
| POST | `/api/v1/b2b/login` | Valida `{ email, password }`, ritorna `{ sessionToken, customer, expiresAt }` |
| POST | `/api/v1/b2b/logout` | Invalida sessionToken |
| GET | `/api/v1/b2b/me` | Header `X-B2B-Session: <token>` → ritorna customer aggiornato |
| GET | `/api/v1/b2b/products` | Stessa shape pubblica, `priceCents` con listino cliente |
| GET | `/api/v1/b2b/products/:slug` | Idem dettaglio |
| POST | `/api/v1/public/requests` | Crea record `site_requests` |
| POST | `/api/v1/b2b/requests` | Idem, ma collegata al `customerId` autenticato |

E le seguenti **nuove tabelle nel CRM** (vedi brief):

- `customers.is_b2b` (bool), `customers.pricing_tier_id` (fk)
- `pricing_tiers` (id, name, rules)
- `customer_prices` (customer_id, product_id, price_cents) — override puntuali
- `site_requests` (id, kind, source, customer_payload jsonb, product_payload jsonb, message, status, created_at, b2b_customer_id?)
- `b2b_sessions` (token, customer_id, expires_at, revoked_at?)

### 18.7 Sequenza di rollout

Phase 1 dell'HUB (master plan §10) procede invariata. La Phase 1.5 B2B parte solo quando il CRM ha esposto gli endpoint elencati in §18.6. Lato HUB lo scaffolding può partire subito con mock locali in `lib/crm-client/mocks/b2b-*.ts`, allineati ai tipi del brief CRM. Il flip mock→reale resta su un singolo flag d'ambiente, come già fatto per i prodotti pubblici.

---

## 19. Prossimi passi

1. **Approva questo master plan** (o commenta modifiche).
2. Inizializzo repo Next.js 16 + scheletro completo.
3. Costruisco design system base (colori, font, componenti UI).
4. Implemento le 4 pagine MVP con mock data.
5. Quando il CRM espone le API v1, sostituisco i mock con chiamate reali.

---

*Documento redatto il 2026-05-22. Versione 1.1. Autore: Kimi Code CLI.*
