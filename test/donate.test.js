"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const qrcode = require("qrcode-generator");
const jsQR = require("jsqr");

const ROOT = path.join(__dirname, "..");
const ADDRESS = "bc1qazdfwsgju2e9c6nje63nwkx6n9mnfgzu37tlu6";
const URI = `bitcoin:${ADDRESS}`;

test("donation QR remains decodable with its centered logo isolation area", () => {
  const qr = qrcode(0, "H");
  qr.addData(URI);
  qr.make();

  const quietZone = 4;
  const scale = 10;
  const modules = qr.getModuleCount();
  const totalModules = modules + quietZone * 2;
  const size = totalModules * scale;
  const pixels = new Uint8ClampedArray(size * size * 4);
  pixels.fill(255);

  for (let row = 0; row < modules; row += 1) {
    for (let column = 0; column < modules; column += 1) {
      if (!qr.isDark(row, column)) continue;
      for (let y = 0; y < scale; y += 1) {
        for (let x = 0; x < scale; x += 1) {
          const offset =
            (((row + quietZone) * scale + y) * size +
              (column + quietZone) * scale +
              x) *
            4;
          pixels[offset] = 0;
          pixels[offset + 1] = 0;
          pixels[offset + 2] = 0;
        }
      }
    }
  }

  // The real 28px overlay occupies about seven modules of the 176px QR.
  const isolationSize = 8 * scale;
  const isolationStart = Math.floor((size - isolationSize) / 2);
  for (let y = isolationStart; y < isolationStart + isolationSize; y += 1) {
    for (let x = isolationStart; x < isolationStart + isolationSize; x += 1) {
      const offset = (y * size + x) * 4;
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
      pixels[offset + 3] = 255;
    }
  }

  const decoded = jsQR(pixels, size, size, { inversionAttempts: "dontInvert" });
  assert.ok(decoded, "QR must decode even with the centered logo isolation area");
  assert.equal(decoded.data, URI);
});

test("donation page keeps all Bitcoin data local and exact", () => {
  const html = fs.readFileSync(path.join(ROOT, "public", "donate.html"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  assert.match(html, /src="\/vendor\/qrcode-generator\/qrcode\.js"/u);
  assert.doesNotMatch(html, /googleapis|chart\.google|qrserver|api\.qrcode/u);
  assert.match(html, new RegExp(`href="${URI}"`, "u"));
  assert.match(app, new RegExp(`const BITCOIN_ADDRESS = "${ADDRESS}"`, "u"));
  assert.equal((html.match(/BTC · MAINNET/gu) || []).length, 1);
});
