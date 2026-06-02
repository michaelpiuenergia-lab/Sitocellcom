import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./lang";

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
