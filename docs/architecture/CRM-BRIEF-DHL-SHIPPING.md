# CRM-BRIEF-DHL-SHIPPING.md

> Brief tecnico **dal CRM verso il HUB** (sessione Claude-CRM → sessione Claude-HUB).
> Avviso che il CRM sta per aggiungere un'integrazione **corriere DHL** sulle spedizioni,
> e cosa comporta (o non comporta) lato HUB.
>
> Versione: 2026-06-09 — Autore CRM-side: Claude (CRM). Da relayare nella sessione HUB via copia/incolla.

---

## 0. TL;DR (leggi solo questo se hai fretta)

- Il CRM aggiungerà DHL come corriere sulle spedizioni B2B: popoleremo `carrier="DHL"`, `trackingNumber`, `trackingUrl`, `status` sulla tabella `shipments`.
- **Il contratto API B2B `/api/v1/b2b/shipments` NON cambia.** Restituisce già `carrier`, `trackingNumber`, `trackingUrl`, `status`. Appena il CRM scrive i dati DHL, **il tuo portale li vede senza modifiche al client** (`getB2bShipment` / `listB2bShipments` invariati).
- **Azione HUB richiesta: solo confermare il render.** Le pagine `/b2b/ordini` e `/b2b/spedizioni` devono mostrare `carrier` + `trackingNumber` + un link cliccabile a `trackingUrl` (apre il tracking DHL in nuova scheda).
- **2 decisioni da prendere insieme** (vedi §4): (a) timeline eventi `events[]`, (b) tracking spedizioni per le **riparazioni B2C** (oggi assente su entrambi i lati).

---

## 1. Contesto

Michael ha ottenuto credenziali API DHL (API Key + Subscription Key). Vogliamo che il CRM gestisca le spedizioni col corriere DHL e che il rivenditore, dal portale B2B del HUB, veda il tracking. Lo scopo preciso (solo tracking automatico vs. anche creazione etichette) è in via di definizione, ma in ogni caso il **dato esposto al HUB è lo stesso**: i campi della spedizione.

Verificato sul codice CRM reale (`app/api/v1/b2b/shipments/route.ts` + `[id]/route.ts`):

```ts
// GET /api/v1/b2b/shipments  → ListItem
{ id, orderId, carrier, trackingNumber, trackingUrl, status, shippedAt, deliveredAt }

// GET /api/v1/b2b/shipments/{id}  → Detail
ListItem & {
  events: [],                       // ⚠ oggi SEMPRE vuoto (hardcoded, vedi §4a)
  recipient: { name, phone },
  shippingAddress: { line1 }
}
```

Filtro di visibilità: la query è `WHERE s.customer_id = <sessione B2B>`. Quindi una spedizione appare nel portale **solo se** ha `customer_id` valorizzato (è un fix interno CRM, vedi §5 — non ti riguarda).

---

## 2. Cosa NON cambia lato HUB ✅

- Endpoint, header (`X-API-Key` + `X-B2B-Session`), shape della risposta: **identici**.
- Tipi `B2bShipmentListItem` / `B2bShipmentDetail` in `lib/crm-client/types.ts`: **già corretti**, nessuna modifica.
- Funzioni `lib/crm-client/b2b-portal.ts` (`listB2bShipments`, `getB2bShipment`): **invariate**.

In pratica: quando il CRM inizierà a scrivere spedizioni DHL reali, **compaiono da sole** nelle tue chiamate esistenti.

---

## 3. Cosa serve lato HUB (conferma render) 🔧

Assicurati che il portale B2B mostri i campi spedizione. In particolare:

1. **`/b2b/ordini/{id}`** — se l'ordine ha `shipmentId`, mostra il blocco spedizione con corriere + tracking.
2. **`/b2b/spedizioni`** (e dettaglio) — lista + dettaglio con:
   - `carrier` (es. "DHL")
   - `trackingNumber` (monospace, copiabile)
   - **`trackingUrl`** → link `target="_blank" rel="noopener"` ("Traccia la spedizione →"). È l'URL diretto al tracking DHL: lo popola il CRM, tu lo rendi cliccabile.
   - `status` → badge (vedi tabella §3.1)

### 3.1 Valori di `status` che riceverai

`mapShipmentStatus` lato CRM normalizza al tuo enum pubblico `ShipmentPublicStatus`:

| `status` ricevuto | Significato | Note |
|---|---|---|
| `preparing` | In preparazione | default per stati non ancora "in viaggio" |
| `shipped` | Spedito | pacco affidato a DHL |
| `in_transit` | In transito | |
| `out_for_delivery` | In consegna | **vedi ⚠ sotto** |
| `delivered` | Consegnato | valorizza anche `deliveredAt` |
| `returned` | Reso al mittente | |
| `exception` | Anomalia/giacenza | **vedi ⚠ sotto** |

⚠ **Onestà sul fronte CRM:** oggi l'enum *interno* del CRM (`pending|ready|shipped|in_transit|delivered|returned|lost`) **non** produce ancora `out_for_delivery` né `exception` (vengono rimappati a `preparing`/altro). Per sfruttarli con DHL dovremo **estendere l'enum interno CRM** — è lavoro nostro. Tienili comunque gestiti nel render (li manderemo quando l'integrazione DHL sarà completa), ma all'inizio vedrai soprattutto `preparing → shipped → in_transit → delivered`.

---

## 4. Le 2 decisioni da prendere insieme 🟡

### 4a. Timeline eventi `events[]`

Oggi `GET /api/v1/b2b/shipments/{id}` ritorna **`events: []` hardcoded** (manca la tabella `shipment_events` nel CRM). DHL può fornirci la cronologia (spedito → in transito → in consegna → consegnato, con data/luogo).

- **Se volete la timeline sul portale:** il CRM aggiunge `shipment_events` e la popola da DHL → il tuo `events[]` (già nel contratto) si accende. Ti avviseremo con un mini-brief quando è pronto.
- **Per ora:** mantieni il fallback "timeline non disponibile" / mostra solo gli stati principali (`shippedAt`, `deliveredAt`). Nessuna azione.

**Domanda all'HUB:** la timeline dettagliata serve nel MVP del portale o basta lo stato sintetico + link al tracking DHL?

### 4b. Spedizioni delle riparazioni B2C (gap su entrambi i lati)

Il tracker pubblico riparazioni (`GET /api/v1/public/repairs/lookup` → `RepairPublic`) **non ha alcun campo spedizione/tracking**: dopo `ready_for_pickup` c'è solo `delivered` ("Consegnato"), senza corriere né tracking.

Se il flusso prevede di **rispedire al cliente privato** il dispositivo riparato via DHL e di mostrargli il tracking, **è una feature nuova su entrambi i lati**:
- CRM: aggiungere riferimento spedizione a `RepairPublic` (o nuovo endpoint).
- HUB: renderizzare il tracking nella pagina `/riparazioni`.

**Domanda all'HUB:** serve far vedere al cliente privato il tracking DHL del reso riparazione? Se sì, lo scopiamo a parte (non è incluso nell'integrazione B2B).

---

## 5. Prerequisiti interni CRM (solo per trasparenza, non azione HUB)

- **`shipments.customer_id`**: deve essere valorizzato perché la spedizione sia visibile nel portale B2B. Il form spedizione manuale oggi non lo setta → lo colleghiamo quando agganciamo DHL.
- **Enum stati interni**: da estendere con `out_for_delivery` / `exception` (e gestire `lost`) per mappare bene gli stati DHL (vedi §3.1).
- **Storage credenziali DHL**: API Key + Subscription Key salvate cifrate (`INTEGRATIONS_ENC_KEY`), mai committate.
- **Base URL / prodotto DHL**: da confermare con Michael quale API DHL (MyDHL API Express vs DHL eCommerce vs gestionale tramite) — determina endpoint e mapping stati.

---

## 6. Riepilogo azioni

| Chi | Azione | Bloccante? |
|---|---|---|
| HUB | Confermare che `/b2b/spedizioni` + `/b2b/ordini` rendano `carrier`, `trackingNumber`, link `trackingUrl` | Sì (per vedere il tracking) |
| HUB | Gestire i 7 valori `status` nel badge (anche `out_for_delivery`/`exception`) | Consigliato |
| HUB+CRM | Decidere §4a (timeline `events[]`) | No (MVP ok senza) |
| HUB+CRM | Decidere §4b (tracking riparazioni B2C) | No (feature separata) |
| CRM | Popolare `shipments` con dati DHL + `customer_id`, estendere enum stati, salvare credenziali | Sì (lato nostro) |

**Nessuna rottura del contratto esistente.** Questo brief è un *forward-notice*: il portale B2B continua a funzionare, e appena il CRM scrive dati DHL il tracking compare. Le uniche scelte aperte sono §4a e §4b.

---

*Brief redatto il 2026-06-09 dalla sessione CRM (Claude-CRM). Da leggere/approvare nella sessione HUB (Claude-HUB).*

---

## 7. Decisioni prese (2026-06-09, post-conferma utente lato HUB)

### 7.1 Scopo dell'integrazione

**Tracking automatico + creazione etichette** (non solo tracking passivo).

Implica: il CRM, al momento della creazione di una spedizione B2B, chiama MyDHL API con i dati pacco/indirizzi → riceve `trackingNumber` + label PDF da stampare. Poi periodicamente (o via webhook se DHL lo supporta sul prodotto sottoscritto) aggiorna `status` e `events[]`.

**Niente cambia per il contratto pubblico**: `/api/v1/b2b/shipments` restituisce gli stessi campi di prima, semplicemente popolati da dati reali invece di mock.

### 7.2 API DHL identificata

**MyDHL API** (`developer.dhl.com`, infrastruttura Azure API Management).

Identificata dal pattern "API Key + Subscription Key" del portale developer DHL gialla (screenshot utente, settings dell'app). Probabilità ~99%.

**Auth (da verificare nella tab "Try it out" del prodotto specifico sul portale):**

```http
DHL-API-Key: <api-key>
Ocp-Apim-Subscription-Key: <subscription-key>     # se Azure APIM pattern
Message-Reference: <uuid v4 unique per request>
Content-Type: application/json
```

In alternativa, alcuni prodotti DHL usano Basic Auth:
```
Authorization: Basic <base64(username:password)>
```

⚠️ Da confermare guardando la documentazione **specifica del prodotto sottoscritto** nel proprio account developer.dhl.com → My Apps → `<la-tua-app>` → Products.

**Base URL:**
- Test/Sandbox: `https://express.api.dhl.com/mydhlapi/test`
- Prod: `https://express.api.dhl.com/mydhlapi`

(Cambia in base al prodotto: Express vs eCommerce vs Parcel DE. Da confermare con il prodotto sottoscritto.)

### 7.3 Endpoint del flusso "tracking + etichette"

| Operazione | Method + path | Note |
|---|---|---|
| Crea spedizione + ottieni label | `POST /shipments` | Body con shipper/receiver/packages/productCode/accounts. Risposta: `trackingNumber`, `documents[]` (label base64), `shipmentTrackingNumber` |
| Tracking eventi | `GET /shipments/{trackingNumber}/tracking` | Eventi cronologici per popolare `shipment_events` lato CRM (→ `events[]` su /api/v1/b2b/shipments/{id}) |
| Proof of Delivery | `GET /shipments/{trackingNumber}/proof-of-delivery` | POD scaricabile quando `status=delivered` |
| Quote rate (opzionale) | `POST /rates` | Per mostrare costo stimato prima di creare la spedizione |
| Cancel | `DELETE /shipments/{trackingNumber}` | Solo se non ritirato |

### 7.4 Campi minimi per `POST /shipments`

```jsonc
{
  "plannedShippingDateAndTime": "2026-06-10T10:00:00 GMT+02:00",
  "pickup": { "isRequested": true, "closeTime": "18:00", "location": "reception" },
  "productCode": "P",                       // "P" Express Worldwide, "N" Domestic IT, "U" Economy Select
  "accounts": [
    { "typeCode": "shipper", "number": "<DHL account number>" }
  ],
  "customerDetails": {
    "shipperDetails": {
      "postalAddress": { "cityName": "...", "countryCode": "IT", "postalCode": "63074", "addressLine1": "..." },
      "contactInformation": { "phone": "...", "companyName": "Cellcom SRLS", "fullName": "..." }
    },
    "receiverDetails": {
      "postalAddress": { "cityName": "...", "countryCode": "IT", "postalCode": "...", "addressLine1": "..." },
      "contactInformation": { "phone": "...", "companyName": "...", "fullName": "..." }
    }
  },
  "content": {
    "packages": [
      { "weight": 1.5, "dimensions": { "length": 30, "width": 20, "height": 10 }, "description": "Smartphone" }
    ],
    "isCustomsDeclarable": false,            // true se cross-border non-EU
    "incoterm": "DAP",
    "unitOfMeasurement": "metric"
  }
}
```

### 7.5 Storage credenziali (CRM-side)

- `INTEGRATIONS_DHL_API_KEY` (cifrata con `INTEGRATIONS_ENC_KEY`)
- `INTEGRATIONS_DHL_SUBSCRIPTION_KEY` (cifrata)
- `INTEGRATIONS_DHL_ACCOUNT_NUMBER` (numero conto cliente DHL, plain text può essere)
- `INTEGRATIONS_DHL_ENV` = `test` | `production`

Mai esposte al HUB. Mai loggate in plain. Webhook DHL (se disponibili) richiedono URL pubblica del CRM + verifica della firma.

### 7.6 Decisioni ancora aperte (in attesa)

- **§4a Timeline `events[]`**: sì o no nel MVP? Default = no nel MVP, accendiamo dopo.
- **§4b Tracking riparazioni B2C**: sì o no? Default = no, feature separata, da scopare a parte.

Brief utilizzabile come è dal CRM-side per partire con MyDHL API. Le 2 decisioni residue non bloccano l'integrazione B2B core.
