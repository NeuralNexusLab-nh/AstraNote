"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

test("home page compares every supported encryption mode and discloses visible titles", () => {
  const html = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  const newNote = fs.readFileSync(
    path.join(ROOT, "public", "new-note.html"),
    "utf8",
  );

  assert.match(html, /id="encryption"/u);
  assert.match(html, />AES-128-GCM</u);
  assert.match(html, />AES-256-GCM</u);
  assert.match(html, />AstraConfidential</u);
  assert.match(html, /data-i18n="encryptionNoneName"/u);
  assert.match(app, /Note titles are never encrypted/u);
  assert.match(app, /所有模式的筆記標題都不會加密/u);
  assert.match(app, /どの方式でもノートのタイトルは暗号化されません/u);
  assert.match(app, /AstraNote does not store the PIN itself and cannot recover it/u);
  assert.equal((html.match(/class="matrix-value yes"/gu) || []).length, 8);
  assert.equal((html.match(/class="matrix-value no"/gu) || []).length, 8);
  assert.equal((html.match(/class="schybrid-flow"/gu) || []).length, 1);
  assert.match(app, /Browser-side encryption/u);
  assert.match(app, /瀏覽器端加密/u);
  assert.match(app, /AstraConfidential 的特點/u);
  assert.match(app, /Short or predictable PINs are easier to guess/u);
  assert.doesNotMatch(app, /Note file \+ ASTRANOTE_SECRET/u);
  assert.doesNotMatch(app, /筆記檔案 \+ ASTRANOTE_SECRET/u);
  assert.doesNotMatch(app, /Client Hash is mixed/u);
  assert.doesNotMatch(app, /Client Hash 再與/u);
  assert.doesNotMatch(app, /Vault 祕密/u);
  assert.match(newNote, /value="aes-128-gcm-new"/u);
  assert.match(newNote, /value="aes-256-gcm-new"/u);
  assert.match(newNote, /value="astra-confidential-v2"/u);
  assert.doesNotMatch(newNote, /value="astra-confidential-schybrid-v1"/u);
  assert.match(newNote, /pattern="\[!-~\]\{4,16\}"/u);
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
