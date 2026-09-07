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
  assert.match(english, /Sharing takes just one link;<br>for your most private content/u);
  assert.match(english, /href="\/plans"/u);
  assert.doesNotMatch(english, /hero-kicker/u);

  const traditionalChinese = renderHomeHtml("zh-Hant");
  assert.match(traditionalChinese, /lang="zh-Hant"/u);
  assert.match(traditionalChinese, /寫下了，就是我的。/u);
  assert.match(
    traditionalChinese,
    /打開瀏覽器，筆記就在，想分享也只差一個連結；<br>而最私密的內容，有 AstraZero 加密守護。/u,
  );
  assert.match(traditionalChinese, /了解方案/u);
  assert.doesNotMatch(traditionalChinese, /hero-kicker/u);
  assert.match(traditionalChinese, /home-language-cookie\.js/u);
  assert.match(traditionalChinese, /\?lang=zh-Hant/u);

  const japanese = renderHomeHtml("ja");
  assert.match(japanese, /lang="ja"/u);
  assert.match(japanese, /書いたものは、私のもの。/u);
  assert.match(japanese, /共有もリンク一つ。<br>大切な秘密/u);
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
    assert.ok(html.indexOf('id="plans-preview"') < html.indexOf('id="stats"'));
    assert.match(html, /AstraZero/u);
  }
  assert.match(renderHomeHtml("zh-Hant"), /無限篇筆記/u);
  assert.match(renderHomeHtml("ja"), /ノート数無限/u);
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
