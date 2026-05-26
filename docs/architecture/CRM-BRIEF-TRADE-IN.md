# CRM-BRIEF-TRADE-IN.md

> Brief tecnico per il CRM (sessione Claude-CRM). Cosa deve fornire il CRM per supportare l'area rivendita usato pubblica `/rivendi` del HUB.
>
> Versione: 2026-05-26 — derivata dalla discussione con Michael.
> Autore HUB-side: Claude. Da relayare nella sessione CRM via copia/incolla.

---

## 1. Contesto

Il HUB ha pubblicato una nuova pagina pubblica `/rivendi` aperta a privati e aziende. L'utente:

1. Sceglie marca → modello → taglio memoria → condizione (3 livelli) → riceve **stima istantanea** (range €X-Y) **client-side** da una tabella hardcoded HUB-side.
2. Lascia nome/email/telefono + note → invia richiesta.
3. Lato CRM appare una nuova `site_request` con `kind="trade-in"`.

L'MVP non gestisce upload foto dal sito: il tecnico CRM contatta l'utente via email per chiedere le 4-6 foto guidate e fare la valutazione vincolante.

---

## 2. Cosa serve dal CRM (Phase 1 — bloccante)

### 2.1 Estendere enum `site_requests.kind`

```sql
ALTER TABLE site_requests
  DROP CONSTRAINT site_requests_kind_check;

ALTER TABLE site_requests
  ADD CONSTRAINT site_requests_kind_check
  CHECK (kind IN ('info', 'spare-part', 'repair', 'b2b-quote', 'trade-in'));
```

Zod schema lato CRM:

```ts
kind: z.enum(["info", "spare-part", "repair", "b2b-quote", "trade-in"]),
```

Nessun'altra modifica di schema. La pagina HUB già invia il payload conforme al contratto §2.2.3 di CRM-BRIEF-B2B.md:

```ts
{
  kind: "trade-in",
  source: "hub-public",
  customer: { name, email, phone, company: null },
  product: {
    id: null,
    slug: "iphone-15-pro",                          // model id HUB-side
    name: "iPhone 15 Pro 256GB",                    // testo umano
    variantId: null,
    variantLabel: "Buono · stima €450-550"          // condizione + range
  },
  message: "Modello: iPhone 15 Pro 256GB\nCondizione dichiarata: Buono\nStima istantanea: €450-550\nNote utente: <free text>",
  privacyAccepted: true,
  hpf: "",
  meta: { userAgent, referrer, locale }
}
```

### 2.2 View "Richieste trade-in" nel gestionale

Filtro `kind="trade-in"` sulla view "Richieste sito" esistente. Idealmente aggiungere:

- **Colonna stima dichiarata** → estratta da `product.variantLabel` (regex `€\d+-\d+`)
- **Colonna modello** → `product.name`
- **Quick action**: bottone "Manda richiesta foto" che apre template email pre-compilato

### 2.3 Template email "Richiesta foto trade-in"

Template da generare quando il tecnico clicca "Manda richiesta foto". Variabili: `{customer_name}`, `{model_name}`, `{declared_condition}`, `{estimate_range}`. Suggerimento copy:

```
Ciao {customer_name},

abbiamo ricevuto la tua richiesta di valutazione per {model_name}.

Per confermare la stima di {estimate_range} ci servono 4-6 foto:
1. Telefono frontale acceso (schermo lock)
2. Retro del telefono
3. Lato sinistro
4. Lato destro
5. Lato inferiore (porta di ricarica + griglie audio)
6. Schermata Impostazioni → Generali → Info (IMEI e capacità)

Rispondi a questa email con le foto in allegato o WeTransfer. Riceverai
l'offerta vincolante entro 24 ore lavorative dal ricevimento.

Cordiali saluti,
Team Trade-in Cellcom
```

---

## 3. Cosa servirà dal CRM (Phase 2 — non bloccante MVP)

### 3.1 Endpoint pubblico per stima

```
POST /api/v1/public/trade-in/quote
Headers: X-API-Key
Body: { modelSlug: string, storageGb: number, condition: "como-nuovo" | "buono" | "segni-uso" }
Response 200: { centerEur: number, minEur: number, maxEur: number, validUntilHours: number }
```

Sostituirà la tabella hardcoded `lib/trade-in/models.ts` del HUB. Il CRM mantiene il catalogo prezzi aggiornato (tarati ogni 3-4 mesi dal team commerciale). Permette anche prezzi dinamici per modello (sconti promo, picchi stagionali iPhone autunno).

### 3.2 Endpoint upload foto

```
POST /api/v1/public/trade-in/upload-photos
Headers: X-API-Key
Body: multipart/form-data
  - quoteId: string (id site_request creata)
  - photos: file[] (max 6, max 8MB ognuna, jpg/png/webp/heic)
Response 201: { uploaded: number, urls: string[] }
```

Storage: blob CRM Vercel o S3. Le foto vanno collegate alla `site_request.id` corrispondente, accessibili dal gestionale. Retention: 90gg dopo chiusura pratica.

### 3.3 Tabella `trade_in_quotes` (separata da `site_requests`?)

Da valutare se le pratiche trade-in vanno tracciate in una tabella separata con stati dedicati:

```
- stima            (utente ha fatto richiesta, foto in attesa)
- offerta-fatta    (tecnico ha mandato offerta vincolante)
- accettata        (utente ha accettato)
- spedito          (corriere ha ritirato/etichetta usata)
- ricevuto         (telefono in laboratorio)
- verificato       (controllo tecnico OK)
- pagato           (bonifico/credito emesso → telefono entra come Used in products)
- rifiutato        (offerta non accettata o telefono fuori specifica)
```

Vantaggio: separazione dalla coda `site_requests` generica, dashboard dedicata, conversione automatica a inventario `products`.

Svantaggio: nuova tabella + nuova UI gestionale. Per MVP basta `site_requests` con kind="trade-in".

---

## 4. Vincoli rispettati lato HUB

✅ Nessun campo nuovo nel payload `site_requests` — riusa contratto esistente
✅ `kind="trade-in"` con `source="hub-public"` (no auth richiesta)
✅ Honeypot `hpf` propagato (anti-bot)
✅ Privacy GDPR: `privacyAccepted: true` obbligatorio dal form
✅ Rate limit: si appoggia al limite 10/h IP esistente per `/public/requests`

---

## 5. Catalogo modelli supportati (snapshot MVP)

Hardcoded in [lib/trade-in/models.ts](../../lib/trade-in/models.ts). 42 modelli:

- **Apple iPhone** — SE 2022 → 15 Pro Max (20 modelli)
- **Samsung Galaxy** — A34 → S24 Ultra + Z Fold/Flip 5 (11 modelli)
- **Google Pixel** — 7 → 8 Pro (4 modelli)
- **Xiaomi** — Redmi Note 13 Pro → 14 Ultra (4 modelli)
- **OnePlus** — Nord 3 → 12 (3 modelli)

Quando il CRM espone `/api/v1/public/trade-in/quote` (Phase 2), la lista diventa server-driven e ampliabile dal gestionale senza redeploy HUB.

---

## 6. Ordine implementazione consigliato CRM

1. **Schema** (§2.1) — DROP/ADD constraint sull'enum `kind`. 5 minuti.
2. **View gestionale** (§2.2) — filtro `kind="trade-in"` + estrazione stima da variantLabel.
3. **Template email** (§2.3) — bottone quick-action + template.
4. **Endpoint quote** (§3.1) — quando il volume giustifica catalogo server-side.
5. **Upload foto** (§3.2) — quando si vuole automatizzare la raccolta.
6. **Tabella dedicata** (§3.3) — quando il volume settimanale > 20 pratiche.

Step 1-3 sono sufficienti per partire e raccogliere le prime richieste. La pagina HUB `/rivendi` è già live e funzionante con questi.

---

*Brief redatto il 2026-05-26 dalla sessione HUB. Da approvare/integrare nella sessione CRM (Claude-CRM).*
