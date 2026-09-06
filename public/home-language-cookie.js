"use strict";

(() => {
  const COOKIE_NAME = "astranote_language";
  const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

  const normalizeLanguage = (value) => {
    const language = String(value || "").trim().toLowerCase().replaceAll("_", "-");
    if (language === "zh" || language.startsWith("zh-")) return "zh-Hant";
    if (language === "ja" || language.startsWith("ja-")) return "ja";
    return "en";
  };

  const syncLanguageCookie = () => {
    const language = normalizeLanguage(
      document.documentElement.lang || navigator.language,
    );
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(language)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  };

  syncLanguageCookie();

  new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang"))
      syncLanguageCookie();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
})();
