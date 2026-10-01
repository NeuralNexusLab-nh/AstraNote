"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");

test("PWA install entry points stay available without caching private application data", () => {
  const manifest = JSON.parse(read("public/site.webmanifest"));
  const worker = read("public/sw.js");
  const app = read("public/app.js");

  assert.equal(manifest.name, "AstraNote");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
  assert.match(read("public/index.html"), /data-pwa-install/u);
  assert.match(read("public/dashboard.html"), /data-pwa-install/u);
  assert.match(app, /beforeinstallprompt/u);
  assert.match(app, /navigator\.serviceWorker\.register\("\/sw\.js"/u);
  assert.match(app, /installApp: "Install AstraNote"/u);
  assert.match(app, /installApp: "安裝 AstraNote"/u);
  assert.match(app, /installApp: "AstraNote をインストール"/u);
  assert.doesNotMatch(worker, /"\/api\//u);
  assert.match(worker, /Navigation and every API call stay network-only/u);
});
