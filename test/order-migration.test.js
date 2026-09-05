"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs/promises"),
  os = require("node:os"),
  path = require("node:path");
test("legacy order migration is idempotent and binds orders to the original account", async () => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "astranote-migration-"),
  );
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = "test-migration-secret-".repeat(4);
  delete process.env.ASTRA_CONFIDENTIAL_KEY;
  const username = "legacy_buyer";
  await fs.mkdir(path.join(directory, username, "notes"), { recursive: true });
  const meta = {
    username,
    email: "buyer@example.test",
    createdAt: "2026-01-01T00:00:00Z",
    notes: [],
  };
  await fs.writeFile(
    path.join(directory, username, "metadata.json"),
    JSON.stringify(meta),
  );
  const order = {
    orderId: "a".repeat(32),
    username,
    plan: "plus",
    months: 1,
    expectedSats: 2500,
    localStatus: "paid",
    createdAt: "2026-02-01T00:00:00Z",
    fulfilledAt: "2026-02-01T00:03:00Z",
    satoraPaymentId: "b".repeat(22),
    checkoutToken: "c".repeat(32),
  };
  await fs.writeFile(
    path.join(directory, "orders.json"),
    JSON.stringify([order]),
  );
  const mod = require("../server"),
    { OrderStore } = require("../lib/order-store");
  try {
    await mod.ensureData();
    assert.deepEqual(
      JSON.parse(
        await fs.readFile(path.join(directory, "orders.json"), "utf8"),
      ),
      [],
    );
    await mod.ensureData();
    const ledger = new OrderStore(directory);
    try {
      assert.equal(ledger.list(mod.testables.accountOrderId(meta)).length, 1);
      assert.equal(ledger.get(order.orderId).localStatus, "paid");
      assert.equal(
        ledger.byCheckout(
          mod.testables.accountOrderId(meta),
          order.checkoutToken,
        ).orderId,
        order.orderId,
      );
      assert.equal(
        ledger.get(
          order.orderId,
          mod.testables.accountOrderId({
            ...meta,
            createdAt: "2026-03-01T00:00:00Z",
          }),
        ),
        null,
      );
    } finally {
      ledger.close();
    }
  } finally {
    mod.testables.closeOrderStore();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
