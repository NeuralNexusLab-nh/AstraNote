"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { OrderStore, ORDER_RETENTION_MS } = require("../lib/order-store");

let directory, mod, server, base, ledger, originalFetch;
const sessions = {}, invoices = new Map();
let statusCalls = 0;
const stamp = () => new Date().toISOString();
const id = () => crypto.randomBytes(16).toString("hex");
const metaPath = user => path.join(directory, user.name, "metadata.json");
const readMeta = async user => JSON.parse(await fs.readFile(metaPath(user), "utf8"));
async function fixture(name) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessions[crypto.createHash("sha256").update(token).digest("hex")] = {
    username: name, csrf: id(), createdAt: stamp(),
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    maxExpiresAt: new Date(Date.now() + 2 * 864e5).toISOString(),
  };
  await fs.writeFile(path.join(directory, "sessions.json"), JSON.stringify(sessions));
  const user = { name, headers: { cookie: "astranote_session=" + token } };
  await fs.mkdir(path.join(directory, name, "notes"), { recursive: true });
  const metadata = {
    username: name, email: name + "@example.test", passwordHash: "fixture",
    createdAt: stamp(), notes: [], settings: { language: "en", theme: "dark" },
    entitlements: { plusMs: 60 * 864e5, proMs: 30 * 864e5, ultraMs: 120 * 864e5, updatedAt: stamp() },
  };
  await fs.writeFile(metaPath(user), JSON.stringify(metadata));
  user.account = mod.testables.accountOrderId(metadata);
  return user;
}
function bill(user, overrides = {}) {
  const order = {
    orderId: id(), username: user.name, accountId: user.account,
    plan: "plus", months: 1, expectedSats: 2500, localStatus: "pending",
    createdAt: stamp(), checkoutToken: id(),
    satoraPaymentId: crypto.randomBytes(16).toString("base64url"),
    paymentUrl: "https://satora.nxlabtw.com/payment/test", ...overrides,
  };
  ledger.put(order);
  return order;
}
async function request(user, route) {
  const response = await originalFetch(base + route, { headers: user.headers });
  return { status: response.status, data: await response.json() };
}
const verify = (user, order) => request(user, "/api/billing/status?order_id=" + order.orderId);

test.before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-retention-"));
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = "retention-test-secret-".repeat(5);
  process.env.SATORA_API_KEY = "retention-test-api-".repeat(5);
  originalFetch = global.fetch;
  global.fetch = async url => {
    assert.ok(String(url).startsWith("https://satora.nxlabtw.com/api/status?"));
    statusCalls++;
    const value = invoices.get(new URL(url).searchParams.get("id"));
    return Response.json(typeof value === "function" ? await value() : value);
  };
  mod = require("../server");
  await mod.ensureData();
  ledger = new OrderStore(directory);
  server = mod.app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  base = "http://127.0.0.1:" + server.address().port;
});
test.after(async () => {
  global.fetch = originalFetch;
  await new Promise(resolve => server.close(resolve));
  ledger.close();
  mod.testables.closeOrderStore();
  assert.equal(path.dirname(directory), os.tmpdir());
  assert.ok(path.basename(directory).startsWith("astranote-retention-"));
  await fs.rm(directory, { recursive: true, force: true });
});

test("90-day cutoff deletes invoice details in batches and keeps coupon reservations across restart", async () => {
  const user = await fixture("retention_boundary"), now = Date.now();
  const old = bill(user, { createdAt: new Date(now - ORDER_RETENTION_MS).toISOString(), localStatus: "paid", fulfilledAt: stamp() });
  const fresh = bill(user, { createdAt: new Date(now - ORDER_RETENTION_MS + 1).toISOString() });
  const digest = crypto.createHash("sha256").update("ONCE").digest("hex");
  assert.equal(ledger.claimCoupon(user.account, digest, old.orderId), true);
  for (let i = 0; i < 505; i++) bill(user, {
    createdAt: new Date(now - ORDER_RETENTION_MS - 864e5).toISOString(),
    localStatus: ["created", "pending", "paid", "failed", "expired", "verification_error", "coupon_reused"][i % 7],
  });
  assert.equal(ledger.prune(now), 500);
  await mod.testables.cleanupBillingRecords(now);
  assert.equal(ledger.get(old.orderId), null);
  assert.equal(ledger.list(user.account).length, 1);
  assert.equal(ledger.get(fresh.orderId).orderId, fresh.orderId);
  ledger.close();
  ledger = new OrderStore(directory);
  assert.equal(ledger.claimCoupon(user.account, digest, id()), false);
  assert.equal(ledger.db.prepare("PRAGMA secure_delete").get().secure_delete, 1);
});

test("history hides old orders immediately; deleting them neither debits plans nor allows replay", async () => {
  const user = await fixture("retention_plans");
  const old = bill(user, {
    createdAt: new Date(Date.now() - ORDER_RETENTION_MS - 1000).toISOString(),
    localStatus: "paid", fulfilledAt: stamp(),
  });
  const current = bill(user);
  const before = await readMeta(user), calls = statusCalls;
  const history = await request(user, "/api/billing/orders");
  assert.equal(history.data.retentionDays, 90);
  assert.deepEqual(history.data.orders.map(order => order.orderId), [current.orderId]);
  assert.equal((await verify(user, old)).status, 404);
  await mod.testables.cleanupBillingRecords();
  assert.equal(ledger.get(old.orderId), null);
  assert.equal((await verify(user, old)).status, 404);
  assert.equal(statusCalls, calls, "removed invoices never reach the payment provider");
  const after = await readMeta(user);
  assert.equal(after.entitlements.plusMs, before.entitlements.plusMs);
  assert.equal(after.entitlements.proMs, before.entitlements.proMs);
  assert.ok(after.entitlements.ultraMs <= before.entitlements.ultraMs);
  assert.ok(after.entitlements.ultraMs > before.entitlements.ultraMs - 5000);
  const account = await request(user, "/api/account");
  assert.equal(account.data.plan.type, "ultra");
});

test("matching expired/failed tombstones need no price, disable payment, and grant no time", async () => {
  const user = await fixture("retention_tombstones");
  const before = await readMeta(user);
  for (const status of ["expired", "failed"]) {
    const order = bill(user);
    invoices.set(order.satoraPaymentId, { success: true, id: order.satoraPaymentId, status, price: null });
    const result = await verify(user, order);
    assert.equal(result.status, 200);
    assert.equal(result.data.order.localStatus, status);
    assert.equal(result.data.order.paymentUrl, null);
    assert.equal(result.data.order.fulfilledAt, null);
    assert.equal(ledger.get(order.orderId).paymentUrl, null);
    const calls = statusCalls;
    assert.equal((await verify(user, order)).data.order.localStatus, status);
    assert.equal(statusCalls, calls, "terminal states do not poll Satora again");
  }
  const wrong = bill(user);
  invoices.set(wrong.satoraPaymentId, { success: true, id: "another-invoice", status: "expired", price: null });
  assert.equal((await verify(user, wrong)).data.order.localStatus, "verification_error");
  const invalidPaid = bill(user);
  invoices.set(invalidPaid.satoraPaymentId, { success: true, id: invalidPaid.satoraPaymentId, status: "paid", price: null });
  assert.equal((await verify(user, invalidPaid)).data.order.localStatus, "verification_error");
  assert.equal((await readMeta(user)).entitlements.plusMs, before.entitlements.plusMs);
});

test("a response in flight cannot resurrect an invoice deleted by retention cleanup", async () => {
  const user = await fixture("retention_race"), order = bill(user);
  let received, finish;
  const started = new Promise(resolve => { received = resolve; });
  const release = new Promise(resolve => { finish = resolve; });
  invoices.set(order.satoraPaymentId, async () => {
    received();
    await release;
    return { success: true, id: order.satoraPaymentId, status: "paid", price: 2500, received_sats: 2500 };
  });
  const result = verify(user, order);
  await started;
  const before = await readMeta(user);
  await mod.testables.cleanupBillingRecords(Date.now() + ORDER_RETENTION_MS + 1000);
  finish();
  assert.equal((await result).status, 404);
  assert.equal(ledger.get(order.orderId), null);
  assert.equal((await readMeta(user)).entitlements.plusMs, before.entitlements.plusMs);
});
