"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const root = path.join(__dirname, "..");

test("public interface uses Astra Agent consistently, including static and accessible copy", () => {
  for (const name of fs.readdirSync(path.join(root, "public"))) {
    if (!/\.(html|js)$/u.test(name)) continue;
    const source = fs.readFileSync(path.join(root, "public", name), "utf8");
    assert.doesNotMatch(source, /\bAstra[ \t]+AI\b/iu, name);
  }
});

test("updated guides cover every workflow in all three existing locales", () => {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, "public/docs-guides.js"), "utf8"), context);
  const pages = context.window.ASTRANOTE_DOCS_GUIDES;
  for (const slug of ["home", "getting-started", "notes", "sharing", "astra-pass", "astra-agent", "security", "faq"]) {
    for (const locale of ["en", "zh-Hant", "ja"]) {
      const page = pages[slug][locale];
      assert.ok(page.title && page.lead && page.body, `${slug} ${locale}`);
      assert.doesNotMatch(page.body, /<h1|Astra AI|AstraDrop/u);
      assert.ok((page.body.match(/<h2\b/gu) || []).length >= 3);
    }
  }
  for (const locale of ["en", "zh-Hant", "ja"]) {
    assert.match(pages["astra-agent"][locale].body, /GPT-6-Luna/u);
    assert.match(pages["astra-agent"][locale].body, /OpenAI/u);
    assert.match(pages["astra-pass"][locale].body, /\/limited-edit/u);
    assert.match(pages.security[locale].body, /100/u);
    assert.match(pages.notes[locale].body, /20/u);
  }
  assert.match(pages["astra-pass"]["zh-Hant"].body, /到期後，臨時帳號立即失效/u);
  assert.match(pages["astra-pass"]["zh-Hant"].body, /直接更新目前帳號的同一篇筆記/u);
});

test("homepage features AstraPass and docs keep existing links working", () => {
  const { renderHomeHtml } = require("../bootstrap");
  for (const locale of ["en", "zh-Hant", "ja"]) {
    const html = renderHomeHtml(locale);
    assert.doesNotMatch(html, /id="astrapass"/u);
    assert.match(html, /AstraPass/u);
    assert.match(html, /href="\/docs\/astra-pass"/u);
    assert.doesNotMatch(html, /Astra AI/u);
  }
  const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
  for (const slug of ["astra-ai", "astra-agent", "astra-pass"]) assert.ok(server.includes(`"/docs/${slug}": "docs-article.html"`));
  const html = fs.readFileSync(path.join(root, "public/docs-article.html"), "utf8");
  assert.ok(html.indexOf("/docs-guides.js") < html.indexOf("/docs-content.js"));
});
