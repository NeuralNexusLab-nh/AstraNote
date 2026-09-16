"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { OrderStore, MAX_ORDER_HISTORY_PER_ACCOUNT } = require("../lib/order-store");

const order = (number, overrides = {}) => ({
  orderId: number.toString(16).padStart(32, "0"),
  username: "history_user",
  accountId: "history-account",
  plan: "plus",
  months: 1,
  expectedSats: 2500,
  localStatus: "paid",
  createdAt: new Date(1_700_000_000_000 + number * 1000).toISOString(),
  fulfilledAt: new Date(1_700_000_000_500 + number * 1000).toISOString(),
  ...overrides,
});

test("each account retains only its five newest terminal invoices", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-history-"));
  const store = new OrderStore(directory, { maxBytes: 4_000_000 });
  try {
    for (let number = 1; number <= 7; number++) store.put(order(number));
    const active = order(8, { localStatus: "pending", fulfilledAt: undefined });
    store.put(active);

    const stored = store.list("history-account");
    assert.equal(
      stored.filter(item => item.fulfilledAt).length,
      MAX_ORDER_HISTORY_PER_ACCOUNT,
    );
    assert.equal(store.get(order(1).orderId), null);
    assert.equal(store.get(order(2).orderId), null);
    assert.ok(store.get(order(3).orderId));
    assert.ok(store.get(active.orderId));
  } finally {
    store.close();
    await fs.rm(directory, { recursive: true, force: true });
  }
});
