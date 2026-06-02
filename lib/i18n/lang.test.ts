import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  SUPPORTED_LANGS,
  isLang,
  langFromCookieValue,
} from "./lang";

describe("i18n lang", () => {
  it("default è italiano", () => {
    expect(DEFAULT_LANG).toBe("it");
  });

  it("supporta solo it e en", () => {
    expect(SUPPORTED_LANGS).toEqual(["it", "en"]);
  });

  it("cookie name = cellcom_lang", () => {
    expect(LANG_COOKIE).toBe("cellcom_lang");
  });

  it("isLang riconosce valori validi", () => {
    expect(isLang("it")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
    expect(isLang(undefined)).toBe(false);
    expect(isLang(null)).toBe(false);
  });

  it("langFromCookieValue fallback default su valore non valido", () => {
    expect(langFromCookieValue("it")).toBe("it");
    expect(langFromCookieValue("en")).toBe("en");
    expect(langFromCookieValue("xx")).toBe("it");
    expect(langFromCookieValue(undefined)).toBe("it");
    expect(langFromCookieValue("")).toBe("it");
  });
});
