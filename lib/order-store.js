"use strict";

// Compact local ledger. Routes, ownership checks and payment verification stay in server.js.
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");
const PLANS = ["free", "plus", "pro", "ultra", "admin"];
const STATES = [
  "created",
  "confirming",
  "pending",
  "paid",
  "failed",
  "expired",
  "verification_error",
  "coupon_reused",
];
const MAX_DB_BYTES = 2_400_000_000;
const NEW_ORDER_CEILING = 2_200_000_000;
const ms = (value) => (value ? Date.parse(value) || 0 : 0);
const iso = (value) => (value ? new Date(value).toISOString() : undefined);

class OrderStore {
  constructor(directory, options = {}) {
    fs.mkdirSync(directory, { recursive: true });
    this.file = path.join(directory, "orders.sqlite");
    this.db = new Database(this.file);
    this.db.pragma("journal_mode = DELETE");
    this.db.pragma("synchronous = FULL");
    this.db.pragma("auto_vacuum = INCREMENTAL");
    this.db.pragma("cache_size = -2048");
    const pageSize = this.db.pragma("page_size", { simple: true });
    this.db.pragma(
      `max_page_count = ${Math.floor((options.maxBytes || MAX_DB_BYTES) / pageSize)}`,
    );
    this.ceiling = options.newOrderCeiling || NEW_ORDER_CEILING;
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY, owner TEXT NOT NULL, account TEXT NOT NULL,
        plan INTEGER NOT NULL, months INTEGER NOT NULL, price INTEGER NOT NULL,
        status INTEGER NOT NULL, created INTEGER NOT NULL, payment TEXT,
        checkout TEXT, url TEXT, fulfilled INTEGER, paid INTEGER,
        tx TEXT, failure TEXT, charged INTEGER
      ) WITHOUT ROWID;
      CREATE INDEX IF NOT EXISTS orders_account_created ON orders(account, created DESC);
      CREATE UNIQUE INDEX IF NOT EXISTS orders_account_checkout ON orders(account, checkout) WHERE checkout IS NOT NULL;
      CREATE INDEX IF NOT EXISTS orders_active ON orders(status) WHERE fulfilled IS NULL;
      CREATE TABLE IF NOT EXISTS coupon_redemptions (
        account TEXT NOT NULL, coupon BLOB NOT NULL, order_id TEXT NOT NULL,
        PRIMARY KEY (account, coupon)
      ) WITHOUT ROWID;
    `);
    this.putRow = this.db.prepare(`INSERT INTO orders VALUES (
      @id,@owner,@account,@plan,@months,@price,@status,@created,@payment,@checkout,@url,@fulfilled,@paid,@tx,@failure,@charged
    ) ON CONFLICT(id) DO UPDATE SET
      status=excluded.status,payment=excluded.payment,checkout=excluded.checkout,url=excluded.url,
      fulfilled=excluded.fulfilled,paid=excluded.paid,tx=excluded.tx,failure=excluded.failure,charged=excluded.charged`);
  }
  decode(row) {
    if (!row) return null;
    return {
      orderId: row.id,
      username: row.owner,
      accountId: row.account,
      plan: PLANS[row.plan],
      months: row.months,
      expectedSats: row.price,
      localStatus: STATES[row.status],
      createdAt: iso(row.created),
      satoraPaymentId: row.payment,
      checkoutToken: row.checkout,
      paymentUrl: row.url,
      fulfilledAt: iso(row.fulfilled),
      paidAt: iso(row.paid),
      txid: row.tx,
      failureCode: row.failure,
      chargedSats: row.charged,
    };
  }
  get(id, account) {
    const row = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    return row && (!account || row.account === account)
      ? this.decode(row)
      : null;
  }
  byCheckout(account, token) {
    return this.decode(
      this.db
        .prepare("SELECT * FROM orders WHERE account = ? AND checkout = ?")
        .get(account, token),
    );
  }
  list(account) {
    return this.db
      .prepare(
        "SELECT * FROM orders WHERE account = ? ORDER BY created DESC LIMIT 50",
      )
      .all(account)
      .map((row) => this.decode(row));
  }
  recentCount(account, since) {
    return this.db
      .prepare(
        "SELECT count(*) n FROM orders WHERE account = ? AND created >= ?",
      )
      .get(account, since).n;
  }
  claimCoupon(account, digest, orderId) {
    if (
      !account ||
      !/^[a-f0-9]{64}$/.test(digest) ||
      !/^[a-f0-9]{32}$/.test(orderId)
    )
      throw new Error("Invalid coupon receipt.");
    const coupon = Buffer.from(digest, "hex");
    // A durable reservation precedes crediting. Retrying the same invoice is safe,
    // including after a crash; a different invoice cannot claim this coupon.
    this.db
      .prepare(
        "INSERT INTO coupon_redemptions(account, coupon, order_id) VALUES (?, ?, ?) ON CONFLICT(account, coupon) DO NOTHING",
      )
      .run(account, coupon, orderId);
    return (
      this.db
        .prepare(
          "SELECT order_id FROM coupon_redemptions WHERE account = ? AND coupon = ?",
        )
        .get(account, coupon).order_id === orderId
    );
  }
  assertCapacity() {
    const pages = this.db.pragma("page_count", { simple: true });
    const pageSize = this.db.pragma("page_size", { simple: true });
    const active = this.db
      .prepare("SELECT count(*) n FROM orders WHERE fulfilled IS NULL")
      .get().n;
    // Reserve update/index space for every unfulfilled invoice; stop new sales well before the hard limit.
    if (pages * pageSize + active * 4096 + 64_000_000 >= this.ceiling)
      throw Object.assign(
        new Error("Payment storage is near capacity. Please contact support."),
        {
          status: 503,
          code: "billing_capacity",
        },
      );
  }
  put(order) {
    if (
      !/^[a-f0-9]{32}$/.test(order.orderId) ||
      !PLANS.includes(order.plan) ||
      !STATES.includes(order.localStatus) ||
      !order.accountId
    )
      throw new Error("Invalid ledger record.");
    const completed = Boolean(order.fulfilledAt);
    const terminal = completed || order.localStatus === "coupon_reused";
    // Keep the checkout identity even after a timeout or completion. A retry must never create a second invoice.
    this.putRow.run({
      id: order.orderId,
      owner: order.username,
      account: order.accountId,
      plan: PLANS.indexOf(order.plan),
      months: order.months,
      price: order.expectedSats,
      status: STATES.indexOf(order.localStatus),
      created: ms(order.createdAt),
      payment: order.satoraPaymentId || null,
      checkout: order.checkoutToken || null,
      url: !terminal ? order.paymentUrl || null : null,
      fulfilled: ms(order.fulfilledAt) || null,
      paid: ms(order.paidAt) || null,
      tx: typeof order.txid === "string" ? order.txid.slice(0, 128) : null,
      failure:
        !completed && order.failureCode ? order.failureCode.slice(0, 60) : null,
      charged: Number.isSafeInteger(order.chargedSats)
        ? order.chargedSats
        : null,
    });
  }
  close() {
    this.db.close();
  }
}
module.exports = { OrderStore, MAX_DB_BYTES, NEW_ORDER_CEILING };
