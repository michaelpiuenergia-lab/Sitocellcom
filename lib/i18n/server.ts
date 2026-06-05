import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./lang";
import { getDict, type Dict } from "./dict";

/**
 * Legge la lingua corrente dal cookie. Server-only (Server Components,
 * Route Handlers, crmFetch). Default `it` se il cookie manca o ha un
 * valore non valido.
 */
export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const value = store.get(LANG_COOKIE)?.value;
    return isLang(value) ? value : DEFAULT_LANG;
  } catch {
    // cookies() può throw in alcuni contesti (es. edge): fallback
    return DEFAULT_LANG;
  }
}

/**
 * Helper server-side per i Server Components: ritorna una funzione `t`
 * tipata sul dict per la lingua corrente. Da usare cosi':
 *   const t = await getT()
 *   <h1>{t("nav.cta.repair")}</h1>
 */
export async function getT(): Promise<
  <K extends keyof Dict>(
    key: K,
    ...args: Dict[K] extends (...a: infer A) => string ? A : []
  ) => string
> {
  const lang = await getLang();
  const dict = getDict(lang);
  return <K extends keyof Dict>(
    key: K,
    ...args: Dict[K] extends (...a: infer A) => string ? A : []
  ): string => {
    const v = dict[key];
    if (typeof v === "function") {
      return (v as (...a: unknown[]) => string)(...args);
    }
    return v as string;
  };
}
