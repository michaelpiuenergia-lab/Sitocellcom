"use client";

import { useLang } from "@/lib/i18n/lang-context";
import { SUPPORTED_LANGS, type Lang } from "@/lib/i18n/lang";

/**
 * Toggle IT/EN minimale, da mettere in navbar/footer.
 * Click → cookie + reload (così anche i Server Components che chiamano
 * il CRM con ?lang=en si re-fetchano subito).
 */
export function LangSwitcher({
  variant = "footer",
}: {
  variant?: "navbar" | "footer";
}) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("lang.switchAria")}
      className="inline-flex items-center"
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 999,
        padding: 2,
        backgroundColor: variant === "footer" ? "transparent" : "#ffffff",
      }}
    >
      {SUPPORTED_LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code as Lang)}
            aria-pressed={active}
            className="font-mono uppercase transition-colors duration-200"
            style={{
              padding: "4px 10px",
              fontSize: "10px",
              letterSpacing: "0.22em",
              borderRadius: 999,
              backgroundColor: active ? "#dc2626" : "transparent",
              color: active ? "#ffffff" : variant === "footer" ? "#a3a3a3" : "#737373",
              border: "none",
              cursor: active ? "default" : "pointer",
            }}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
