"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

test("plans page publishes the exact monthly products and 30-day rule", () => {
  const html = fs.readFileSync(path.join(ROOT, "public", "plans.html"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  assert.match(html, /0\.000025 BTC/u);
  assert.match(html, /0\.000060 BTC/u);
  assert.doesNotMatch(html, /\bsats\b|US\$|NT\$/iu);
  assert.doesNotMatch(app, /US\$|NT\$/u);
  assert.match(html, /min="1" max="36"/u);
  assert.match(app, /One subscription month always means 30 days/u);
  assert.match(app, /一個月固定指30天/u);
  assert.match(app, /1か月は常に30日/u);
  assert.match(app, /prices = \{ plus: 2500, pro: 6000 \}/u);
  assert.match(app, /前往 Satora 付款/u);
  assert.match(app, /unlimited: "Infinity"/u);
});

test("used CAPTCHA tokens are reset after protected requests fail", () => {
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  assert.match(app, /window\.NexaCAPTCHA\?\.render/u);
  assert.match(app, /window\.NexaCAPTCHA\.render\(mount\)\.reset\(\)/u);
  assert.ok((app.match(/resetCaptcha\(\);/gu) || []).length >= 3);
  assert.match(app, /resetCaptcha\("action"\)/u);
});

test("failed Satora invoice creation is not left in a creating state", () => {
  const server = fs.readFileSync(path.join(ROOT, "server.js"), "utf8");
  assert.match(server, /order\.lastError && !order\.satoraPaymentId \? "failed"/u);
  assert.match(server, /order\.localStatus = "failed"/u);
});

test("billing and encryption secrets remain server-only placeholders", () => {
  const envExample = fs.readFileSync(path.join(ROOT, ".env.example"), "utf8");
  const browser = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  assert.match(envExample, /^SATORA_API_KEY=$/mu);
  assert.doesNotMatch(browser, /SATORA_API_KEY/u);
  assert.doesNotMatch(browser, /ASTRA_CONFIDENTIAL_KEY/u);
});

test("plan UI includes backend-lock and deletion disclosures", () => {
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  const dashboard = fs.readFileSync(path.join(ROOT, "public", "dashboard.html"), "utf8");
  const style = fs.readFileSync(path.join(ROOT, "public", "style.css"), "utf8");
  const terms = fs.readFileSync(path.join(ROOT, "public", "terms.html"), "utf8");
  assert.match(app, /持續鎖定滿30天後會永久刪除/u);
  assert.match(terms, /locked by the\s+server from largest to smallest/u);
  assert.match(terms, /astranote@nxlabtw\.com/u);
  assert.match(dashboard, /id="note-limit-caption"/u);
  assert.match(style, /\.locked-warning\[hidden\]\s*\{\s*display:\s*none/u);
});
