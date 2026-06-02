/**
 * Costanti + tipi i18n condivisi server/client.
 *
 * Questo file NON è server-only: lo importano sia i Server Components
 * (per getLang() in lib/i18n/server.ts) sia il client LangProvider.
 *
 * La lettura del cookie server-side è in lib/i18n/server.ts.
 */

export type Lang = "it" | "en";

export const SUPPORTED_LANGS: readonly Lang[] = ["it", "en"] as const;
export const DEFAULT_LANG: Lang = "it";
export const LANG_COOKIE = "cellcom_lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "it" || value === "en";
}

export function langFromCookieValue(value: string | undefined): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}
