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
  assert.deepEqual(manifest.icons.map((icon) => [icon.src, icon.sizes]), [
    ["/asset/icon-192.png", "192x192"],
    ["/asset/icon-512.png", "512x512"],
  ]);
  assert.match(read("public/index.html"), /data-pwa-install/u);
  assert.match(read("public/index.html"), /data-pwa-plans/u);
  assert.match(read("public/dashboard.html"), /data-pwa-install/u);
  assert.match(app, /beforeinstallprompt/u);
  assert.match(app, /navigator\.serviceWorker\.register\("\/sw\.js"/u);
  assert.match(app, /installApp: "Install AstraNote"/u);
  assert.match(app, /installApp: "安裝 AstraNote"/u);
  assert.match(app, /installApp: "AstraNote をインストール"/u);
  assert.match(app, /installFirefoxGuide/u);
  assert.match(app, /function isFirefox\(\)/u);
  assert.match(app, /\$\$\('\[data-pwa-plans\]'\)/u);
  assert.match(app, /function isMicrosoftEdge\(\)/u);
  assert.match(app, /pwa-install-steps/u);
  assert.match(app, /installEdgeConfirm/u);
  assert.match(app, /installEdgeToolsVisual/u);
  assert.match(app, /installGuideAddressBar/u);
  assert.match(app, /installAddressBar/u);
  assert.match(app, /function pwaGuideForBrowser\(\)/u);
  assert.match(app, /closeOnBackdrop: false/u);
  assert.match(read("public/style.css"), /height: 74px/u);
  assert.doesNotMatch(worker, /"\/api\//u);
  assert.match(worker, /Navigation and every API call stay network-only/u);
});

test("the service worker refreshes interface assets from the network before using cache", () => {
  const serviceWorker = fs.readFileSync(path.join(__dirname, "../public/sw.js"), "utf8");
  assert.match(serviceWorker, /const CACHE_NAME = "astranote-interface-v3"/);
  assert.match(serviceWorker, /fetch\(request\)\s*\.then\(/);
  assert.match(serviceWorker, /\.catch\(\(\) => caches\.match\(request\)\)/);
  assert.doesNotMatch(serviceWorker, /return cached \|\| network/);
});
