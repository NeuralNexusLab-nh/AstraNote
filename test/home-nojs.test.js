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
  assert.match(english, /Sharing takes just one link;<br>for the most private content/u);
  assert.match(english, /href="\/plans"/u);
  assert.doesNotMatch(english, /hero-kicker/u);

  const traditionalChinese = renderHomeHtml("zh-Hant");
  assert.match(traditionalChinese, /lang="zh-Hant"/u);
  assert.match(traditionalChinese, /寫下了，就是我的。/u);
  assert.match(
    traditionalChinese,
    /打開瀏覽器就能拿到，想分享也只差一個連結；<br>而最私密的內容，有 AstraZero 守在最後一層。/u,
  );
  assert.match(traditionalChinese, /了解方案/u);
  assert.doesNotMatch(traditionalChinese, /hero-kicker/u);
  assert.match(traditionalChinese, /home-language-cookie\.js/u);
  assert.match(traditionalChinese, /\?lang=zh-Hant/u);

  const japanese = renderHomeHtml("ja");
  assert.match(japanese, /lang="ja"/u);
  assert.match(japanese, /書いたものは、私のもの。/u);
  assert.match(japanese, /共有もリンク一つ。<br>いちばん秘密/u);
});

test("Accept-Language chooses the highest-priority supported locale", () => {
  assert.equal(languageFromAcceptHeader("zh-TW,ja;q=0.8,en;q=0.5"), "zh-Hant");
  assert.equal(languageFromAcceptHeader("ja,en;q=0.8"), "ja");
  assert.equal(languageFromAcceptHeader("fr-FR,en;q=0.6"), "en");
});
