"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { type Lang, DEFAULT_LANG } from "./lang";
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

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();
  const dict = useMemo(() => getDict(lang), [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      // Set cookie server-side (più affidabile di document.cookie con
      // SameSite/HttpOnly). Poi router.refresh() per re-rendere i Server
      // Components con la nuova lingua dal CRM (+ getLang() → ?lang=en).
      setLangState(next);
      fetch("/api/i18n/set-lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: next }),
      })
        .then(() => {
          router.refresh();
          // Fallback hard-reload per assicurarsi che TUTTI gli alberi
          // (anche componenti client lontani che non si re-rendono col
          // refresh) prendano la nuova lingua dal cookie.
          if (typeof window !== "undefined") {
            setTimeout(() => window.location.reload(), 50);
          }
        })
        .catch(() => {
          // Best-effort fallback: scrive cookie client + reload
          if (typeof document !== "undefined") {
            document.cookie = `cellcom_lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
          }
          if (typeof window !== "undefined") window.location.reload();
        });
    },
    [lang, router],
  );

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
