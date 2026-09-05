"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

test("deployment selects Node 24 and has no separately installed SQLite binding", () => {
  const manifest = require("../package.json");
  const lock = require("../package-lock.json");
  assert.equal(manifest.engines.node, "24.x");
  assert.equal(lock.packages[""].engines.node, "24.x");
  for (const name of ["better-sqlite3", "bindings"]) {
    assert.equal(manifest.dependencies[name], undefined);
    assert.equal(lock.packages[`node_modules/${name}`], undefined);
  }
});

test("ledger opens without npm addons and preserves payments and coupon claims across reopen", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "astranote-sqlite-runtime-"));
  try {
    // Run a standalone copy outside the project's node_modules tree. Also reject
    // non-builtin imports so a developer's installed addon cannot mask this regression.
    fs.copyFileSync(
      path.join(__dirname, "../lib/order-store.js"),
      path.join(directory, "order-store.cjs"),
    );
    const result = spawnSync(process.execPath, ["-e", `
      const assert = require("node:assert/strict");
      const Module = require("node:module");
      const originalLoad = Module._load;
      Module._load = function (id, ...args) {
        if (!id.startsWith("node:") && id !== "./order-store.cjs")
          throw new Error("Unexpected npm/native dependency: " + id);
        return originalLoad.call(this, id, ...args);
      };
      const { OrderStore, MAX_DB_BYTES } = require("./order-store.cjs");
      const order = {
        orderId: "a".repeat(32), username: "fixture", accountId: "fixture-account",
        plan: "ultra", months: 3, expectedSats: 37500, localStatus: "paid",
        createdAt: "2026-09-01T00:00:00.000Z", paidAt: "2026-09-01T00:01:00.000Z",
        fulfilledAt: "2026-09-01T00:01:00.000Z", checkoutToken: "b".repeat(32),
        satoraPaymentId: "c".repeat(22), chargedSats: 0,
      };
      let ledger = new OrderStore(process.cwd());
      assert.equal(ledger.db.prepare("PRAGMA busy_timeout").get().timeout, 5000);
      assert.equal(ledger.db.prepare("PRAGMA journal_mode").get().journal_mode, "delete");
      assert.equal(ledger.db.prepare("PRAGMA synchronous").get().synchronous, 2);
      assert.equal(ledger.db.prepare("PRAGMA cache_size").get().cache_size, -2048);
      const pageSize = ledger.db.prepare("PRAGMA page_size").get().page_size;
      assert.equal(ledger.db.prepare("PRAGMA max_page_count").get().max_page_count,
        Math.floor(MAX_DB_BYTES / pageSize));
      ledger.put(order);
      assert.equal(ledger.claimCoupon(order.accountId, "d".repeat(64), order.orderId), true);
      ledger.close();
      ledger = new OrderStore(process.cwd());
      const stored = ledger.get(order.orderId, order.accountId);
      for (const [key, value] of Object.entries(order)) assert.equal(stored[key], value);
      assert.equal(ledger.byCheckout(order.accountId, order.checkoutToken).orderId, order.orderId);
      assert.equal(ledger.claimCoupon(order.accountId, "d".repeat(64), "e".repeat(32)), false);
      assert.equal(ledger.claimCoupon(order.accountId, "d".repeat(64), order.orderId), true);
      assert.equal(ledger.db.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
      ledger.close();
    `], { cwd: directory, encoding: "utf8", timeout: 15000 });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
