import "server-only";

import { cookies } from "next/headers";

/**
 * Gestione lingua server-side (Server Components, Route Handlers).
 *
 * - Cookie `cellcom_lang` con valori "it" | "en" (default "it").
 * - Letto da getLang() in qualunque server component.
 * - crmFetch lo legge automaticamente per appendere ?lang=en quando attivo.
 *
 * Lato client la lettura/scrittura del cookie è in lib/i18n/lang-context.tsx.
 */

export type Lang = "it" | "en";

export const SUPPORTED_LANGS: readonly Lang[] = ["it", "en"] as const;
export const DEFAULT_LANG: Lang = "it";
export const LANG_COOKIE = "cellcom_lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "it" || value === "en";
}

/**
 * Legge la lingua corrente dal cookie. Server-only.
 * Default `it` se il cookie manca o ha un valore non valido.
 */
export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const value = store.get(LANG_COOKIE)?.value;
    return isLang(value) ? value : DEFAULT_LANG;
  } catch {
    // cookies() può throw in alcuni contesti (es. middleware/edge): fallback
    return DEFAULT_LANG;
  }
}

/**
 * Sync helper non-async per Route Handlers in cui cookies() è già stato letto.
 * Da usare solo dopo aver fatto un await cookies() altrove nel flusso.
 */
export function langFromCookieValue(value: string | undefined): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}
