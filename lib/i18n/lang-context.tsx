"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { type Lang, LANG_COOKIE, DEFAULT_LANG } from "./lang";
import { getDict, type Dict } from "./dict";

/**
 * Context client per la lingua: legge il valore iniziale dal server
 * (passato come prop dal root layout) e gestisce il cambio scrivendo il
 * cookie + reload, così l'intero albero rivede subito le traduzioni dal
 * server (Server Components che leggono getLang()).
 *
 * Espone:
 * - `lang`: lingua corrente
 * - `setLang(next)`: cambia cookie e ricarica
 * - `t(key, ...args)`: lookup nel dizionario
 */

type LangContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: <K extends keyof Dict>(
    key: K,
    ...args: Dict[K] extends (...a: infer A) => string ? A : []
  ) => string;
};

const Ctx = createContext<LangContextValue | null>(null);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 anno

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dict = useMemo(() => getDict(lang), [lang]);

  const setLang = useCallback((next: Lang) => {
    if (next === lang) return;
    if (typeof document !== "undefined") {
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    setLangState(next);
    // Reload per re-fetchare i Server Components con la nuova lingua dal CRM
    if (typeof window !== "undefined") window.location.reload();
  }, [lang]);

  const t = useCallback(
    <K extends keyof Dict>(
      key: K,
      ...args: Dict[K] extends (...a: infer A) => string ? A : []
    ): string => {
      const v = dict[key];
      if (typeof v === "function") {
        return (v as (...a: unknown[]) => string)(...args);
      }
      return v as string;
    },
    [dict],
  );

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Fallback silenzioso: ritorna lingua default + lookup grezzo.
    // Permette ai componenti i18n di funzionare anche se montati fuori
    // dal Provider (es. in pagine non ancora migrate).
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: <K extends keyof Dict>(
        key: K,
        ...args: Dict[K] extends (...a: infer A) => string ? A : []
      ): string => {
        const v = getDict(DEFAULT_LANG)[key];
        if (typeof v === "function") {
          return (v as (...a: unknown[]) => string)(...args);
        }
        return v as string;
      },
    };
  }
  return ctx;
}
