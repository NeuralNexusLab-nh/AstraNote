"use strict";

const express = require("express");
const helmet = require("helmet");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const core = require("./server");

const ROOT = __dirname;
const INDEX_FILE = path.join(ROOT, "public", "index.html");
const APP_JS_FILE = path.join(ROOT, "public", "app.js");
const HOME_MARKETING_FILE = path.join(ROOT, "public", "home-marketing.js");
const LANGUAGE_COOKIE = "astranote_language";
const LANGUAGE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

function extractObjectLiteral(source, constantName) {
  const marker = `const ${constantName} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing ${constantName} translation object.`);
  const start = source.indexOf("{", markerIndex + marker.length);
  if (start < 0) throw new Error(`Invalid ${constantName} translation object.`);

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === quote) quote = null;
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unterminated ${constantName} translation object.`);
}

function loadTranslationObject(file, constantName) {
  const source = fs.readFileSync(file, "utf8");
  const literal = extractObjectLiteral(source, constantName);
  const value = vm.runInNewContext(`(${literal})`, Object.create(null), {
    timeout: 250,
  });
  if (!value || typeof value !== "object")
    throw new Error(`Invalid ${constantName} translation object.`);
  return value;
}

function buildTranslations() {
  const base = loadTranslationObject(APP_JS_FILE, "I18N");
  const marketing = loadTranslationObject(HOME_MARKETING_FILE, "COPY");
  const translations = {};
  for (const language of ["en", "zh-Hant", "ja"]) {
    translations[language] = {
      ...(base[language] || {}),
      ...(marketing[language] || {}),
    };
  }
  return translations;
}

const INDEX_HTML = fs.readFileSync(INDEX_FILE, "utf8");
const TRANSLATIONS = buildTranslations();

function normalizeLanguage(value) {
  const language = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
  if (language === "zh" || language.startsWith("zh-")) return "zh-Hant";
  if (language === "ja" || language.startsWith("ja-")) return "ja";
  if (language === "en" || language.startsWith("en-")) return "en";
  return null;
}

function parseCookie(header, name) {
  for (const section of String(header || "").split(";")) {
    const separator = section.indexOf("=");
    if (separator < 0) continue;
    const key = section.slice(0, separator).trim();
    if (key !== name) continue;
    try {
      return decodeURIComponent(section.slice(separator + 1).trim());
    } catch {
      return section.slice(separator + 1).trim();
    }
  }
  return null;
}

function languageFromAcceptHeader(header) {
  const preferences = String(header || "")
    .split(",")
    .map((entry, index) => {
      const [language, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.split("=")[1])
        : 1;
      return {
        language,
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter((preference) => preference.quality > 0)
    .sort(
      (left, right) => right.quality - left.quality || left.index - right.index,
    );
  for (const preference of preferences) {
    const language = normalizeLanguage(preference.language);
    if (language) return language;
  }
  return "en";
}

function requestLanguage(req) {
  const requested = normalizeLanguage(req.query?.lang);
  if (requested) return { language: requested, explicit: true };
  const stored = normalizeLanguage(parseCookie(req.get("cookie"), LANGUAGE_COOKIE));
  if (stored) return { language: stored, explicit: false };
  return {
    language: languageFromAcceptHeader(req.get("accept-language")),
    explicit: false,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const attribute = selector.startsWith("property:") ? "property" : "name";
  const key = selector.slice(selector.indexOf(":") + 1);
  const pattern = new RegExp(
    `(<meta\\s+[^>]*${attribute}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*content=["'])[^"']*(["'][^>]*>)`,
    "i",
  );
  return html.replace(pattern, `$1${escaped}$2`);
}

function renderHomeHtml(language) {
  const normalized = normalizeLanguage(language) || "en";
  const copy = TRANSLATIONS[normalized] || TRANSLATIONS.en;
  let html = INDEX_HTML;

  html = html.replace(
    /<html\b([^>]*?)\blang=["'][^"']*["']([^>]*)>/i,
    `<html$1lang="${normalized}"$2>`,
  );

  html = html.replace(
    /(<([a-z][\w:-]*)\b[^>]*\bdata-i18n=["']([^"']+)["'][^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (match, open, tag, key, inner, close) =>
      Object.prototype.hasOwnProperty.call(copy, key)
        ? `${open}${escapeHtml(copy[key])}${close}`
        : match,
  );

  html = html.replace(
    /(<[^>]+\bdata-i18n-aria-label=["']([^"']+)["'][^>]*)(>)/gi,
    (match, opening, key, end) => {
      if (!Object.prototype.hasOwnProperty.call(copy, key)) return match;
      const withoutAria = opening.replace(/\saria-label=["'][^"']*["']/i, "");
      return `${withoutAria} aria-label="${escapeHtml(copy[key])}"${end}`;
    },
  );

  if (copy.seoTitle)
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(copy.seoTitle)}</title>`);
  if (copy.seoDescription) {
    html = replaceMeta(html, "name:description", copy.seoDescription);
    html = replaceMeta(html, "property:og:description", copy.seoDescription);
    html = replaceMeta(html, "name:twitter:description", copy.seoDescription);
  }
  if (copy.seoTitle) {
    html = replaceMeta(html, "property:og:title", copy.seoTitle);
    html = replaceMeta(html, "name:twitter:title", copy.seoTitle);
  }

  html = html.replace(
    /(<a\b(?=[^>]*class=["'][^"']*\bbtn-outline\b[^"']*["'])[^>]*\bhref=["'])[^"']*(["'])/i,
    "$1/plans$2",
  );

  if (!html.includes("/home-language-cookie.js")) {
    html = html.replace(
      /<\/head>/i,
      '    <script src="/home-language-cookie.js" defer></script>\n  </head>',
    );
  }

  const languageLinks = `\n    <noscript>\n      <nav class="muted" aria-label="Language">\n        <a href="/?lang=en" hreflang="en">English</a> ·\n        <a href="/?lang=zh-Hant" hreflang="zh-Hant">繁體中文</a> ·\n        <a href="/?lang=ja" hreflang="ja">日本語</a>\n      </nav>\n    </noscript>\n`;
  html = html.replace(/<\/body>/i, `${languageLinks}  </body>`);

  return html;
}

const homeHelmet = helmet({
  frameguard: false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: [
        "'self'",
        "'wasm-unsafe-eval'",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
        "https://nexacaptcha.nxlabtw.com",
      ],
      styleSrc: [
        "'self'",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
        "https://nexacaptcha.nxlabtw.com",
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
      ],
      connectSrc: [
        "'self'",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
        "https://nexacaptcha.nxlabtw.com",
      ],
      frameSrc: [
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
        "https://nexacaptcha.nxlabtw.com",
      ],
      frameAncestors: [
        "'self'",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
      ],
      formAction: [
        "'self'",
        "https://astranote.nxlabtw.com",
        "https://astranote.zeabur.app",
      ],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      upgradeInsecureRequests:
        process.env.NODE_ENV === "production" ? [] : null,
    },
  },
  referrerPolicy: { policy: "no-referrer" },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

function createOuterApp() {
  const outer = express();
  outer.set("trust proxy", 1);
  outer.disable("x-powered-by");
  outer.get("/", homeHelmet, (req, res) => {
    const selected = requestLanguage(req);
    if (selected.explicit) {
      res.cookie(LANGUAGE_COOKIE, selected.language, {
        httpOnly: false,
        secure:
          req.secure ||
          String(req.get("x-forwarded-proto") || "").toLowerCase() === "https",
        sameSite: "lax",
        path: "/",
        maxAge: LANGUAGE_COOKIE_MAX_AGE,
      });
    }
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Language", selected.language);
    res.vary("Accept-Language");
    res.vary("Cookie");
    res.type("html").send(renderHomeHtml(selected.language));
  });
  outer.use(core.app);
  return outer;
}

async function start() {
  const originalListen = core.app.listen;
  core.app.listen = function localizedListen(...args) {
    const outer = createOuterApp();
    core.app.listen = originalListen;
    return outer.listen(...args);
  };
  return core.start();
}

if (require.main === module)
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {
  normalizeLanguage,
  languageFromAcceptHeader,
  renderHomeHtml,
  requestLanguage,
  createOuterApp,
  start,
};
