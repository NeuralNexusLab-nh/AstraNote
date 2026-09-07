"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  renderHomeHtml,
  languageFromAcceptHeader,
} = require("../bootstrap");

test("no-JS homepage renders current marketing copy in all supported languages", () => {
  const english = renderHomeHtml("en");
  assert.match(english, /I wrote it, it’s mine\./u);
  assert.match(english, /you’ll need again\.<br>Find them across devices/u);
  assert.match(english, /href="\/plans"/u);
  assert.doesNotMatch(english, /hero-kicker/u);

  const traditionalChinese = renderHomeHtml("zh-Hant");
  assert.match(traditionalChinese, /lang="zh-Hant"/u);
  assert.match(traditionalChinese, /寫下了，就是我的。/u);
  assert.match(
    traditionalChinese,
    /專放常用連結、操作說明，和臨時要用的幾行字。<br>跨裝置找得到、複製就能用；重要內容，也能加密保存。/u,
  );
  assert.match(traditionalChinese, /了解方案/u);
  assert.doesNotMatch(traditionalChinese, /小抄/u);
  assert.doesNotMatch(traditionalChinese, /hero-kicker/u);
  assert.match(traditionalChinese, /home-language-cookie\.js/u);
  assert.match(traditionalChinese, /\?lang=zh-Hant/u);

  const japanese = renderHomeHtml("ja");
  assert.match(japanese, /lang="ja"/u);
  assert.match(japanese, /書いたものは、私のもの。/u);
  assert.match(japanese, /また必要になる数行のために。<br>端末を変えても/u);
});

test("home renders every translation, responsive matrix label, and plan without JavaScript", () => {
  for (const locale of ["en", "zh-Hant", "ja"]) {
    const html = renderHomeHtml(locale);
    for (const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gu)) {
      const value = match[3].replace(/<[^>]*>/gu, "").trim();
      assert.ok(value && value !== match[2], `${locale}: ${match[2]} must be translated`);
    }
    for (const match of html.matchAll(/<[^>]*data-label-key="([^"]+)"[^>]*>/gu)) {
      assert.match(match[0], /data-label="[^"]+"/u, `${locale}: ${match[1]}`);
    }
    assert.deepEqual([...html.matchAll(/data-home-plan="([a-z]+)"/gu)].map(m => m[1]), ["plus", "pro", "ultra", "free"]);
    assert.match(html, /href="\/home.css"/u);
    assert.match(html, /href="\/plans"/u);
    assert.match(html, /1024 KB/u);
    assert.ok(html.indexOf('id="purpose"') < html.indexOf('id="plans-preview"'));
    assert.ok(html.indexOf('id="purpose"') < html.indexOf('id="small-notes"'));
    assert.ok(html.indexOf('id="small-notes"') < html.indexOf('id="plans-preview"'));
    assert.ok(html.indexOf('id="plans-preview"') < html.indexOf('id="stats"'));
    assert.match(html, /AstraZero/u);
  }
  assert.match(renderHomeHtml("zh-Hant"), /無限篇筆記/u);
  assert.match(renderHomeHtml("ja"), /ノート数無限/u);
});

test("the storage illustration states its UTF-8 assumptions and is not a quota guarantee", () => {
  const fs = require("node:fs"), path = require("node:path");
  const bytes = Buffer.byteLength("字".repeat(500), "utf8") * 20;
  assert.equal(bytes, 30000);
  assert.ok(bytes < 128000 / 4);
  const css = fs.readFileSync(path.join(__dirname, "../public/home.css"), "utf8");
  assert.ok(css.includes(`width: ${bytes / 128000 * 100}%`));
  for (const locale of ["en", "zh-Hant", "ja"]) {
    const html = renderHomeHtml(locale);
    assert.match(html, /data-i18n="storageExampleScenario"[^>]*>[^<]*20[^<]*500/u);
    assert.match(html, /data-i18n="storageExampleAmount"[^>]*>[^<]*30 KB/u);
    assert.match(html, /data-i18n="storageExampleCaution"[^>]*>[^<]*UTF-8/u);
    assert.match(html, /class="storage-example-meter" aria-hidden="true"/u);
    assert.doesNotMatch(html, /password.manager.grade|unbreakable|絕對安全|密碼管理器等級/iu);
  }
  const chinese = renderHomeHtml("zh-Hant");
  assert.match(chinese, /搜尋標題/u);
  assert.match(chinese, /標題、加密與帳號資料另占空間/u);
  assert.match(chinese, /AstraSecret 的短數字 PIN 較容易被猜中/u);
});

test("home price previews match the full plans page and show a single price per tier", () => {
  const fs = require("node:fs"), path = require("node:path");
  const plans = fs.readFileSync(path.join(__dirname, "../public/plans.html"), "utf8");
  const home = renderHomeHtml("en");
  for (const price of ["0.000025 BTC", "0.000060 BTC", "0.000125 BTC"]) {
    assert.ok(plans.includes(price));
    assert.equal(home.split(price).length - 1, 1);
  }
  assert.doesNotMatch(home, /data-plan-buy|satora_payment_id/u);
});

test("Accept-Language chooses the highest-priority supported locale", () => {
  assert.equal(languageFromAcceptHeader("zh-TW,ja;q=0.8,en;q=0.5"), "zh-Hant");
  assert.equal(languageFromAcceptHeader("ja,en;q=0.8"), "ja");
  assert.equal(languageFromAcceptHeader("fr-FR,en;q=0.6"), "en");
});
