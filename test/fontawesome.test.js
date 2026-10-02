"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const LEGACY_ALIASES = new Set(["laptop-mobile", "laptop-shield"]);

test("every Font Awesome class used by the interface resolves to a shipped glyph", () => {
  const fontAwesome = fs.readFileSync(
    path.join(ROOT, "node_modules/@fortawesome/fontawesome-free/css/all.css"),
    "utf8",
  );
  const used = new Set();
  for (const file of fs.readdirSync(path.join(ROOT, "public"))) {
    if (!/\.(?:html|js)$/u.test(file)) continue;
    const source = fs.readFileSync(path.join(ROOT, "public", file), "utf8");
    for (const match of source.matchAll(/\bfa-([a-z0-9-]+)/gu)) {
      if (!new Set(["solid", "regular", "brands", "spin"]).has(match[1])) used.add(match[1]);
    }
  }
  const missing = [...used].filter(
    (name) => !fontAwesome.includes(`.fa-${name}`) && !LEGACY_ALIASES.has(name),
  );
  assert.deepEqual(missing, []);
});
