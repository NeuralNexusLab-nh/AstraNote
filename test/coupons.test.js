"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { OrderStore } = require("../lib/order-store");

let directory, server, base, mod, originalFetch;
const sessions = {},
  invoices = new Map(),
  attempts = new Map();
let statusCalls = 0;
const stamp = () => new Date().toISOString();
const digest = (code) =>
  crypto.createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
const captcha = {
  verificationId: "v".repeat(16),
  responseToken: "r".repeat(64),
};
const metaPath = (user) => path.join(directory, user.name, "metadata.json");
const readMeta = async (user) =>
  JSON.parse(await fs.readFile(metaPath(user), "utf8"));
const writeMeta = (user, data) =>
  fs.writeFile(metaPath(user), JSON.stringify(data));
async function fixture(name) {
  const token = crypto.randomBytes(32).toString("base64url"),
    csrf = crypto.randomBytes(16).toString("hex");
  sessions[crypto.createHash("sha256").update(token).digest("hex")] = {
    username: name,
    csrf,
    createdAt: stamp(),
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    maxExpiresAt: new Date(Date.now() + 2 * 864e5).toISOString(),
  };
  await fs.writeFile(
    path.join(directory, "sessions.json"),
    JSON.stringify(sessions),
  );
  const user = {
    name,
    headers: {
      cookie: "astranote_session=" + token,
      "x-csrf-token": csrf,
      origin: base,
      "content-type": "application/json",
      "x-forwarded-for": "127.1.0." + (Object.keys(sessions).length + 10),
    },
  };
  await fs.mkdir(path.join(directory, name, "notes"), { recursive: true });
  await writeMeta(user, {
    username: name,
    email: name + "@example.test",
    passwordHash: "fixture",
    createdAt: new Date(Date.now() - 864e5).toISOString(),
    notes: [],
    settings: { language: "en", theme: "dark" },
    entitlements: { plusMs: 0, proMs: 0, ultraMs: 0, updatedAt: stamp() },
  });
  return user;
}
async function request(user, route, body) {
  const res = await originalFetch(base + route, {
    method: body === undefined ? "GET" : "POST",
    headers: user.headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}
async function bill(user, code, charged = 0) {
  const body = {
    plan: "plus",
    months: 1,
    checkoutToken: crypto.randomBytes(16).toString("hex"),
    captcha,
  };
  const result = await request(user, "/api/billing/create", body);
  assert.equal(result.status, 201);
  const order = result.data.order;
  invoices.set(order.satoraPaymentId, {
    success: true,
    id: order.satoraPaymentId,
    status: "paid",
    price: code === null ? 2500 : charged,
    received_sats: code === null ? 2500 : charged,
    ...(code === null
      ? {}
      : {
          original_price: 2500,
          discount_sats: 2500 - charged,
          coupon: { code },
          acceptance_policy: charged === 0 ? "coupon" : "zero_conf",
        }),
  });
  return { ...order, body };
}
const verify = (user, order, extra = "") =>
  request(user, "/api/billing/status?order_id=" + order.orderId + extra);
function assertDays(meta, days) {
  assert.ok(
    meta.entitlements.plusMs <= days * 864e5 &&
      meta.entitlements.plusMs > days * 864e5 - 15000,
  );
}
test.before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-coupons-"));
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = "coupon-test-secret-".repeat(5);
  process.env.SATORA_API_KEY = "coupon-test-api-key-".repeat(4);
  originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (
      String(url).startsWith("https://nexacaptcha.nxlabtw.com/api/siteverify")
    )
      return Response.json({ success: true });
    if (String(url) === "https://satora.nxlabtw.com/api/create") {
      const payload = JSON.parse(options.body);
      assert.equal(payload.coupon, undefined);
      const key = options.headers["idempotency-key"];
      if (!attempts.has(key))
        attempts.set(key, crypto.randomBytes(16).toString("base64url"));
      const id = attempts.get(key);
      return Response.json({
        success: true,
        id,
        url: "https://satora.nxlabtw.com/payment/" + id,
        status: "pending",
      });
    }
    if (String(url).startsWith("https://satora.nxlabtw.com/api/status?")) {
      statusCalls++;
      return Response.json(invoices.get(new URL(url).searchParams.get("id")));
    }
    throw new Error("Unexpected network request");
  };
  mod = require("../server");
  await mod.ensureData();
  server = mod.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = "http://127.0.0.1:" + server.address().port;
});
test.after(async () => {
  global.fetch = originalFetch;
  await new Promise((resolve) => server.close(resolve));
  mod.testables.closeOrderStore();
  assert.equal(path.dirname(directory), os.tmpdir());
  await fs.rm(directory, { recursive: true, force: true });
});
test("coupon policies normalize identity, fail closed, and keep the operator exception server-side", () => {
  const policy = mod.testables.satoraCouponPolicy;
  assert.deepEqual(policy({ coupon: { code: "  test-Code  " } }), {
    valid: true,
    digest: digest("TEST-CODE"),
    reusable: false,
  });
  assert.equal(
    policy({ coupon: { applied: true }, discount_sats: 1000 }).valid,
    false,
  );
  assert.equal(policy({ coupon: { code: "" } }).valid, false);
  assert.equal(policy({ coupon: { code: "a".repeat(129) } }).valid, false);
  assert.equal(policy({ coupon: null, discount_sats: 1 }).valid, false);
  assert.equal(
    policy({ coupon: { applied: false }, discount_sats: 0 }).digest,
    null,
  );
  assert.equal(policy({}).digest, null);
  assert.equal(
    mod.testables.isReusableCouponDigest(
      "cfac7fb4d85dc8c216061ee731a56b9169decda34575fc568f3ff34143d6ade0",
    ),
    true,
  );
  assert.equal(
    mod.testables.isReusableCouponDigest(digest("different")),
    false,
  );
});
test("one coupon per account, replay-safe; different codes and different accounts still work", async () => {
  const user = await fixture("coupon_owner");
  const first = await bill(user, "ONCE");
  assert.equal((await verify(user, first)).data.order.localStatus, "paid");
  assert.equal((await verify(user, first)).data.order.localStatus, "paid");
  const second = await bill(user, " once ", 500);
  const rejected = await verify(
    user,
    second,
    "&coupon=operator&couponReusable=true",
  );
  assert.equal(rejected.data.order.localStatus, "coupon_reused");
  assert.equal(rejected.data.order.fulfilledAt, null);
  assert.ok(rejected.data.order.paidAt);
  assert.equal(rejected.data.order.paymentUrl, null);
  assert.equal(rejected.data.order.chargedSats, 500);
  assertDays(await readMeta(user), 30);
  const count = statusCalls;
  assert.equal(
    (await verify(user, second)).data.order.localStatus,
    "coupon_reused",
  );
  assert.equal(statusCalls, count);
  assert.equal(
    (await request(user, "/api/billing/create", second.body)).data.order
      .localStatus,
    "coupon_reused",
  );
  const third = await bill(user, "ANOTHER");
  assert.equal((await verify(user, third)).data.order.localStatus, "paid");
  assertDays(await readMeta(user), 60);
  const other = await fixture("coupon_other"),
    fourth = await bill(other, "ONCE");
  assert.equal((await verify(other, fourth)).data.order.localStatus, "paid");
  assert.equal((await verify(other, first)).status, 404);
  const ledger = new OrderStore(directory);
  try {
    assert.equal(ledger.get(second.orderId).chargedSats, 500);
    assert.equal(ledger.get(second.orderId).failureCode, "coupon_reused");
    const stored = ledger.db
      .prepare("SELECT coupon FROM coupon_redemptions WHERE account=?")
      .all(mod.testables.accountOrderId(await readMeta(user)));
    assert.equal(stored.length, 2);
    assert.ok(
      stored.every(
        (row) => Buffer.isBuffer(row.coupon) && row.coupon.length === 32,
      ),
    );
  } finally {
    ledger.close();
  }
});
test("concurrent paid invoices cannot both redeem a coupon; use survives restart", async () => {
  const user = await fixture("coupon_race"),
    a = await bill(user, "RACE"),
    b = await bill(user, "race");
  const results = await Promise.all([verify(user, a), verify(user, b)]);
  assert.deepEqual(results.map((r) => r.data.order.localStatus).sort(), [
    "coupon_reused",
    "paid",
  ]);
  assertDays(await readMeta(user), 30);
  mod.testables.closeOrderStore();
  await mod.ensureData();
  const third = await bill(user, "RACE");
  assert.equal(
    (await verify(user, third)).data.order.localStatus,
    "coupon_reused",
  );
  assertDays(await readMeta(user), 30);
});
test("unpaid, unverifiable and missing coupon identities do not consume a redemption", async () => {
  const user = await fixture("coupon_invalid"),
    a = await bill(user, "WAIT");
  const response = invoices.get(a.satoraPaymentId);
  response.status = "pending";
  assert.equal((await verify(user, a)).data.order.localStatus, "pending");
  response.status = "paid";
  response.received_sats = 1;
  assert.equal(
    (await verify(user, a)).data.order.localStatus,
    "verification_error",
  );
  response.received_sats = 0;
  response.coupon = { applied: true };
  assert.equal(
    (await verify(user, a)).data.order.localStatus,
    "verification_error",
  );
  response.coupon = { code: "WAIT" };
  const b = await bill(user, "WAIT");
  assert.equal((await verify(user, b)).data.order.localStatus, "paid");
  assert.equal((await verify(user, a)).data.order.localStatus, "coupon_reused");
  assertDays(await readMeta(user), 30);
});
test("coupon reservation and entitlement receipt recover safely across crash windows", async () => {
  const user = await fixture("coupon_crash"),
    a = await bill(user, "RECOVER");
  const meta = await readMeta(user),
    account = mod.testables.accountOrderId(meta);
  const ledger = new OrderStore(directory);
  try {
    assert.equal(
      ledger.claimCoupon(account, digest("RECOVER"), a.orderId),
      true,
    );
  } finally {
    ledger.close();
  }
  // A crash after the reservation but before the user write can retry this order.
  assert.equal((await verify(user, a)).data.order.localStatus, "paid");
  assertDays(await readMeta(user), 30);
  const b = await bill(user, "RECEIPT");
  const credited = await readMeta(user);
  credited.entitlements.plusMs = 60 * 864e5;
  credited.entitlements.updatedAt = stamp();
  credited.fulfilledOrders = [b.orderId];
  await writeMeta(user, credited);
  const ledger2 = new OrderStore(directory);
  try {
    assert.equal(
      ledger2.claimCoupon(account, digest("RECEIPT"), b.orderId),
      true,
    );
  } finally {
    ledger2.close();
  }
  // A crash after the user write but before ledger completion does not credit twice.
  assert.equal((await verify(user, b)).data.order.localStatus, "paid");
  assertDays(await readMeta(user), 60);
  assert.equal((await readMeta(user)).fulfilledOrders, undefined);
});
test("regular undiscounted payments remain repeatable", async () => {
  const user = await fixture("regular_buyer");
  for (let i = 0; i < 2; i++)
    assert.equal(
      (await verify(user, await bill(user, null))).data.order.localStatus,
      "paid",
    );
  assertDays(await readMeta(user), 60);
});
// The real reusable code is supplied only during private QA, never committed.
test(
  "the configured reusable coupon can credit separate invoices repeatedly",
  { skip: !process.env.ASTRANOTE_TEST_REUSABLE_COUPON },
  async () => {
    const user = await fixture("reusable_buyer"),
      code = process.env.ASTRANOTE_TEST_REUSABLE_COUPON;
    assert.equal(
      mod.testables.satoraCouponPolicy({ coupon: { code } }).reusable,
      true,
    );
    for (let i = 0; i < 2; i++)
      assert.equal(
        (await verify(user, await bill(user, code))).data.order.localStatus,
        "paid",
      );
    assertDays(await readMeta(user), 60);
  },
);
