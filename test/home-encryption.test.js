"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

test("home page compares every supported encryption mode and discloses visible titles", () => {
  const html = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");

  assert.match(html, /id="encryption"/u);
  assert.match(html, />AES-128-GCM</u);
  assert.match(html, />AES-256-GCM</u);
  assert.match(html, />AstraConfidential SCHybrid</u);
  assert.match(html, /data-i18n="encryptionNoneName"/u);
  assert.match(app, /Note titles are never encrypted/u);
  assert.match(app, /所有模式的筆記標題都不會加密/u);
  assert.match(app, /どの方式でもノートのタイトルは暗号化されません/u);
  assert.match(app, /The PIN itself is never sent or stored/u);
  assert.equal((html.match(/class="matrix-value yes"/gu) || []).length, 10);
  assert.equal((html.match(/class="matrix-value no"/gu) || []).length, 6);
  assert.equal((html.match(/class="schybrid-flow"/gu) || []).length, 1);
});

test("authenticated navigation places Donate immediately before Settings", () => {
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  const notesLink = app.indexOf('href="/notes"');
  const donateLink = app.indexOf('href="/donate"', notesLink);
  const settingsLink = app.indexOf('href="/settings"', donateLink);

  assert.ok(notesLink >= 0);
  assert.ok(donateLink > notesLink);
  assert.ok(settingsLink > donateLink);
});
