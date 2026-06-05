# CRM-BRIEF-401-API-KEY.md

> Handoff veloce all'agent CRM. **HUB chiama il CRM in dev e riceve 401**.
> Da relayare nella sessione CRM via copia/incolla.
>
> Data: 2026-06-05 — Autore HUB-side: Claude (HUB).

---

## Sintomo

Il dev HUB su `localhost:3100` chiama il CRM in produzione e riceve:

```
HTTP 401
{"error":{"code":"UNAUTHORIZED","message":"API key mancante o non valida"}}
```

Verificato con curl manuale:

```bash
curl -s -H "X-API-Key: <chiave-in-hub-.env.local>" \
  https://cellcom.vercel.app/api/v1/public/used-devices?limit=1
# → 401 UNAUTHORIZED "API key mancante o non valida"
```

Quindi **la chiave HUB/.env.local non è (più) accettata dal CRM**. Non è
un problema HUB-side: la richiesta arriva al CRM, il CRM la rifiuta.

## Stato HUB

- `HUB/.env.local` ha `CRM_API_URL=https://cellcom.vercel.app` ✓ raggiungibile
- `HUB/.env.local` ha `CRM_API_KEY=...` (54 char) → rifiutata
- `lib/crm-client/client.ts` manda l'header `X-API-Key: $CRM_API_KEY` (corretto,
  come da `CRM-BRIEF-B2B.md §2`). Niente cambi recenti su quella linea.

L'unica modifica recente al client è l'aggiunta del query `?lang=en` quando il
cookie utente è EN — solo querystring, non tocca header di auth.

## Cosa serve dall'agent CRM

Decidi tu (CRM agent) quale di queste è la verità:

1. **La chiave è stata ruotata sul CRM** ma non sincronizzata con HUB.
   → Comunica all'utente la **nuova** chiave pubblica corrente che il CRM
   accetta su `/api/v1/public/*`. L'utente la metterà in `HUB/.env.local`
   come `CRM_API_KEY=...`.

2. **La chiave HUB è una vecchia generazione revocata** (es. `cellcom_v1_ad_...`
   admin key che il CRM ora rifiuta su endpoint pubblici).
   → Stesso esito: comunica la chiave pubblica corretta (prefisso es.
   `cellcom_v1_pub_...`) e specifica quale env var del CRM la contiene
   (`PUBLIC_API_KEY` / `HUB_API_KEY` / altro), così è facile rigenerarla
   con `npm run generate-key` o equivalente se serve.

3. **Il middleware CRM è regredito** (rifiuta chiavi valide).
   → Fai il fix CRM-side, ripristina l'accettazione della chiave esistente,
   nessun cambio HUB.

## Test di verifica

Quando hai la chiave corretta, validala con:

```bash
curl -s -H "X-API-Key: <NUOVA_CHIAVE>" \
  https://cellcom.vercel.app/api/v1/public/used-devices?limit=1
# → HTTP 200 con {"items":[...], "total":N}
```

Se torna 200, l'utente aggiorna `HUB/.env.local` e basta — niente cambi codice
HUB.

## Stack trace (per riferimento)

```
API key mancante o non valida
  at crmFetch (lib/crm-client/client.ts:103:15)
  at getUsedDevices (lib/crm-client/used-devices.ts:49:15)
  at UsatoPage (app/(catalog)/usato/page.tsx:17:30)
```

Si rompe su qualunque pagina che chiama il CRM pubblico (`/usato`, `/prodotti`,
home Hero, ecc.), non solo `/usato`. Quella è solo la prima a montarsi.
