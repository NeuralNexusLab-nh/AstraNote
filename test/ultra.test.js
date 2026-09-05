"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const { OrderStore } = require("../lib/order-store");

let directory,
  server,
  base,
  testables,
  constants,
  originalFetch,
  sessionRecords = {};
let satoraCalls = [],
  failCreate = false,
  paymentStatus = null;
const captcha = {
  verificationId: "v".repeat(16),
  responseToken: "r".repeat(64),
};
const enc = {
  iv: Buffer.alloc(12).toString("base64"),
  tag: Buffer.alloc(16).toString("base64"),
  ciphertext: Buffer.from("ciphertext").toString("base64"),
};
const zeroEnvelope = {
  ...enc,
  wrap: { v: 1, iv: enc.iv, key: Buffer.alloc(48, 8).toString("base64") },
};
const stamp = () => new Date().toISOString();
const metaPath = (name) => path.join(directory, name, "metadata.json");
const notePath = (name, id) =>
  path.join(directory, name, "notes", id + ".json");
async function read(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}
async function write(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}
async function fixture(name, plan = "free", noteCount = 0) {
  const token = crypto.randomBytes(32).toString("base64url");
  const csrf = crypto.randomBytes(16).toString("hex");
  const now = Date.now();
  sessionRecords[crypto.createHash("sha256").update(token).digest("hex")] = {
    username: name,
    csrf,
    createdAt: stamp(),
    expiresAt: new Date(now + 864e5).toISOString(),
    maxExpiresAt: new Date(now + 2 * 864e5).toISOString(),
  };
  await write(path.join(directory, "sessions.json"), sessionRecords);
  await fs.mkdir(path.join(directory, name, "notes"), { recursive: true });
  const metadata = {
    username: name,
    email:
      plan === "admin" ? "neuralnexuslab@hotmail.com" : name + "@example.test",
    displayName: name,
    passwordHash: "test-fixture-hash",
    createdAt: new Date(now - 864e5).toISOString(),
    settings: { theme: "dark", language: "en" },
    entitlements: { plusMs: 0, proMs: 0, ultraMs: 0, updatedAt: stamp() },
    notes: [],
  };
  if (["plus", "pro", "ultra"].includes(plan))
    metadata.entitlements[plan + "Ms"] = 20 * 864e5;
  for (let index = 0; index < noteCount; index++) {
    const id = crypto.randomBytes(12).toString("hex");
    metadata.notes.push({ id, path: "notes/" + id + ".json" });
    await write(notePath(name, id), {
      id,
      name: "Note " + index,
      encryption: "none",
      payloadVersion: 2,
      content: "original",
      createdAt: stamp(),
      updatedAt: stamp(),
      revision: 1,
    });
  }
  await write(metaPath(name), metadata);
  return {
    name,
    metadata,
    headers: {
      cookie: "astranote_session=" + token,
      "x-csrf-token": csrf,
      origin: base,
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0." + (Object.keys(sessionRecords).length + 10),
    },
  };
}
async function request(user, route, method = "GET", body) {
  const response = await originalFetch(base + route, {
    method,
    headers: user.headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}
test.before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-ultra-"));
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = "test-secret-".repeat(8);
  process.env.ASTRA_CONFIDENTIAL_KEY = "test-confidential-key-".repeat(8);
  process.env.ASTRANOTE_VAULT_SECRET = "test-legacy-key-".repeat(8);
  process.env.SATORA_API_KEY = "test-satora-not-a-real-key-".repeat(3);
  originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (
      String(url).startsWith("https://nexacaptcha.nxlabtw.com/api/siteverify")
    )
      return Response.json({ success: true });
    if (String(url).startsWith("https://satora.nxlabtw.com/api/create")) {
      satoraCalls.push({
        key: options.headers["idempotency-key"],
        body: JSON.parse(options.body),
      });
      if (failCreate) {
        failCreate = false;
        throw new Error("Simulated response loss");
      }
      return Response.json({
        success: true,
        id: "p".repeat(22),
        url: "https://satora.nxlabtw.com/payment/" + "p".repeat(22),
        status: "pending",
      });
    }
    if (String(url).startsWith("https://satora.nxlabtw.com/api/status"))
      return Response.json(paymentStatus);
    if (String(url).startsWith("https://"))
      throw new Error("Unexpected external request in test");
    return originalFetch(url, options);
  };
  const mod = require("../server");
  testables = mod.testables;
  constants = mod.constants;
  await mod.ensureData();
  server = mod.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = "http://127.0.0.1:" + server.address().port;
});
test.after(async () => {
  global.fetch = originalFetch;
  await new Promise((resolve) => server.close(resolve));
  testables.closeOrderStore();
  assert.equal(path.dirname(directory), os.tmpdir());
  await fs.rm(directory, { recursive: true, force: true });
});

test("restore cannot exceed Free note count, and locked versions expose no content", async () => {
  const user = await fixture("restore_limits", "free", 21);
  let meta = await read(metaPath(user.name));
  const trash = meta.notes[20];
  trash.trashedAt = stamp();
  trash.trashExpiresAt = new Date(Date.now() + 864e5).toISOString();
  await write(metaPath(user.name), meta);
  assert.equal(
    (await request(user, "/api/trash/" + trash.id + "/restore", "POST", {}))
      .status,
    413,
  );
  const largest = meta.notes[0].id;
  const note = await read(notePath(user.name, largest));
  note.content = "x".repeat(90000);
  note.previous = {
    name: "secret",
    content: "y".repeat(60000),
    payloadVersion: 2,
    updatedAt: stamp(),
  };
  await write(notePath(user.name, largest), note);
  const locked = await request(user, "/api/notes/" + largest);
  assert.equal(locked.status, 423);
  assert.equal(locked.data.note.name, note.name);
  assert.equal(locked.data.note.content, undefined);
  assert.equal(locked.data.note.previous, undefined);
  assert.equal(
    (await request(user, "/api/notes/" + largest + "/previous")).status,
    423,
  );
  assert.equal(
    (
      await request(
        user,
        "/api/notes/" + largest + "/previous/restore",
        "POST",
        { revision: 1 },
      )
    ).status,
    423,
  );
});

test("old and new server AES formats preserve an encrypted previous version", async () => {
  const user = await fixture("aes_versions", "ultra", 4);
  for (const [index, mode] of [
    "aes-128-gcm",
    "aes-256-gcm",
    "aes-128-gcm-new",
    "aes-256-gcm-new",
  ].entries()) {
    const id = user.metadata.notes[index].id;
    const note = await read(notePath(user.name, id));
    note.encryption = mode;
    testables.writeServerNotePayload(
      note,
      user.name,
      "Readable title",
      "舊版內容",
    );
    await write(notePath(user.name, id), note);
    assert.equal(
      (
        await request(user, "/api/notes/" + id, "PUT", {
          name: "New title",
          content: "新版內容",
          revision: 1,
        })
      ).status,
      200,
    );
    const saved = await read(notePath(user.name, id));
    assert.equal(typeof saved.previous.content, "object");
    assert.equal(JSON.stringify(saved).includes("舊版內容"), false);
    assert.equal(
      (await request(user, "/api/notes/" + id + "/previous")).data.content,
      "舊版內容",
    );
  }
});

test("metadata overhead is rejected without partial organization changes", async () => {
  const user = await fixture("metadata_limit", "pro", 1);
  const file = metaPath(user.name),
    meta = await read(file);
  const id = meta.notes[0].id;
  const noteBytes = (await fs.stat(notePath(user.name, id))).size;
  meta.testPadding = "";
  const baseBytes = Buffer.byteLength(JSON.stringify(meta, null, 2) + "\n");
  meta.testPadding = "x".repeat(512000 - baseBytes - noteBytes - 5);
  await write(file, meta);
  const result = await request(user, "/api/notes/organize", "PATCH", {
    ids: [id],
    action: "folder",
    value: "This metadata exceeds the allowance",
  });
  assert.equal(result.status, 413);
  assert.equal((await read(file)).notes[0].folder, undefined);
});

test("Ultra consumes time before Pro and Plus, including transitions and Admin", () => {
  const now = Date.now(),
    day = 864e5;
  const meta = {
    email: "normal@example.test",
    entitlements: {
      ultraMs: 3 * day,
      proMs: 5 * day,
      plusMs: 7 * day,
      updatedAt: new Date(now - 4 * day).toISOString(),
    },
  };
  testables.normalizeEntitlements(meta, now);
  assert.deepEqual(
    [
      meta.entitlements.ultraMs,
      meta.entitlements.proMs,
      meta.entitlements.plusMs,
    ],
    [0, 4 * day, 7 * day],
  );
  assert.equal(testables.planForMetadata(meta), "pro");
  meta.entitlements.ultraMs = day;
  assert.equal(testables.planPayload(meta).maxBytes, 2_000_000);
  assert.equal(testables.planPayload(meta).canRecover, true);
  meta.email = "neuralnexuslab@hotmail.com";
  assert.equal(testables.planPayload(meta).maxNotes, null);
  assert.equal(testables.planPayload(meta).canCreateZero, true);
});

test("Zero creation is gated by the backend; existing encrypted notes survive downgrade", async () => {
  const free = await fixture("zero_free");
  const pro = await fixture("zero_pro", "pro");
  const id = "1".repeat(24);
  const body = {
    id,
    name: "Visible title",
    encryption: constants.ZERO_MODE,
    clientSalt: "s".repeat(43),
    encrypted: zeroEnvelope,
    captcha,
  };
  assert.equal((await request(free, "/api/notes", "POST", body)).status, 403);
  assert.equal((await request(pro, "/api/notes", "POST", body)).status, 201);
  const get = await request(pro, "/api/notes/" + id);
  assert.equal(get.data.content, undefined);
  assert.deepEqual(get.data.encrypted, zeroEnvelope);
  assert.equal(get.data.revision, 1);
  assert.equal((await request(free, "/api/notes/" + id)).status, 404);
  assert.equal(
    (
      await request(pro, "/api/notes/" + id + "/share", "POST", {
        enabled: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await request(pro, "/api/vault/key-factor", "POST", {
        noteId: id,
        encryption: constants.ZERO_MODE,
        clientSalt: body.clientSalt,
        clientHash: "a".repeat(64),
      })
    ).status,
    404,
  );
  const meta = await read(metaPath(pro.name));
  meta.entitlements.proMs = 0;
  await write(metaPath(pro.name), meta);
  assert.equal(
    (
      await request(pro, "/api/notes/" + id, "PUT", {
        name: "Edited",
        encrypted: zeroEnvelope,
        revision: 1,
      })
    ).status,
    200,
  );
  assert.equal(
    (await request(pro, "/api/notes", "POST", { ...body, id: "2".repeat(24) }))
      .status,
    403,
  );
  assert.equal(
    testables.validClientEnvelope(
      { ...zeroEnvelope, plaintext: "should not be stored" },
      constants.ZERO_MODE,
    ),
    false,
  );
  assert.equal(
    testables.validClientEnvelope(
      { ...zeroEnvelope, wrap: { ...zeroEnvelope.wrap, v: 999 } },
      constants.ZERO_MODE,
    ),
    false,
  );
});

test("one previous version, conflict detection, atomic quota rejection and restore", async () => {
  const ultra = await fixture("versions_ultra", "ultra", 1),
    id = ultra.metadata.notes[0].id;
  const put = (content, revision) =>
    request(ultra, "/api/notes/" + id, "PUT", {
      name: "Note",
      content,
      revision,
    });
  assert.equal((await put("second", 1)).status, 200);
  assert.equal(
    (await request(ultra, "/api/notes/" + id)).data.hasPrevious,
    true,
  );
  assert.equal(
    (await request(ultra, "/api/notes/" + id + "/previous")).data.content,
    "original",
  );
  assert.equal((await put("third", 2)).status, 200);
  const current = await read(notePath(ultra.name, id));
  assert.equal(current.previous.content, "second");
  assert.equal(current.previous.previous, undefined);
  assert.equal((await put("stale", 1)).status, 409);
  const before = await fs.readFile(notePath(ultra.name, id), "utf8");
  assert.equal((await put("x".repeat(2_000_000), 3)).status, 413);
  assert.equal(await fs.readFile(notePath(ultra.name, id), "utf8"), before);
  const meta = await read(metaPath(ultra.name));
  meta.entitlements.ultraMs = 0;
  await write(metaPath(ultra.name), meta);
  assert.equal(
    (
      await request(ultra, "/api/notes/" + id + "/previous/restore", "POST", {
        revision: 3,
      })
    ).status,
    200,
  );
  const restored = await read(notePath(ultra.name, id));
  assert.equal(restored.content, "second");
  assert.equal(restored.previous, undefined);
  assert.equal((await put("free edit", 4)).status, 200);
  assert.equal((await read(notePath(ultra.name, id))).previous, undefined);
});

test("trash revokes every content path, preserves expiry, supports quota-safe restore and purge", async () => {
  const ultra = await fixture("trash_ultra", "ultra", 2);
  const outsider = await fixture("trash_outsider", "ultra");
  const id = ultra.metadata.notes[0].id;
  assert.equal(
    (
      await request(ultra, "/api/notes/" + id, "PUT", {
        name: "History",
        content: "new",
        revision: 1,
      })
    ).status,
    200,
  );
  const share = await request(ultra, "/api/notes/" + id + "/share", "POST", {
    enabled: true,
  });
  assert.equal(share.status, 200);
  assert.equal(
    (await request(ultra, "/api/notes/" + id, "DELETE", { captcha })).status,
    200,
  );
  assert.equal((await request(ultra, "/api/notes/" + id)).status, 404);
  assert.equal(
    (
      await request(ultra, "/api/notes/" + id, "PUT", {
        name: "bad",
        content: "bad",
      })
    ).status,
    404,
  );
  assert.equal(
    (await request(ultra, "/api/notes/" + id + "/previous")).status,
    404,
  );
  assert.equal(
    (
      await request(ultra, "/api/notes/" + id + "/share", "POST", {
        enabled: true,
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await originalFetch(
        base + share.data.url.replace("/shared/", "/api/shared/"),
      )
    ).status,
    404,
  );
  const account = (await request(ultra, "/api/account")).data;
  assert.equal(account.noteCount, 1);
  assert.equal(account.trash.length, 1);
  assert.equal(account.trash[0].name, "History");
  assert.equal(account.trash[0].hasPrevious, true);
  const expiry = account.trash[0].trashExpiresAt;
  assert.equal(
    (await request(ultra, "/api/settings", "PATCH", { trashDays: 30 })).status,
    200,
  );
  assert.equal(
    (await request(ultra, "/api/account")).data.trash[0].trashExpiresAt,
    expiry,
  );
  assert.equal(
    (await request(outsider, "/api/trash/" + id + "/restore", "POST", {}))
      .status,
    404,
  );
  assert.equal(
    (await request(ultra, "/api/trash/" + id + "/restore", "POST", {})).status,
    200,
  );
  assert.equal((await request(ultra, "/api/notes/" + id)).data.shared, false);
  assert.equal(
    (await request(ultra, "/api/notes/" + id, "DELETE", { captcha })).status,
    200,
  );
  assert.equal(
    (await request(ultra, "/api/trash/" + id, "DELETE", {})).status,
    403,
  );
  assert.equal(
    (await request(ultra, "/api/trash/" + id, "DELETE", { captcha })).status,
    200,
  );
  await assert.rejects(fs.access(notePath(ultra.name, id)));
});

test("organization checks all owners before changing any note and accounts for metadata", async () => {
  const pro = await fixture("organize_pro", "pro", 2),
    free = await fixture("organize_free", "free", 1);
  const ids = pro.metadata.notes.map((ref) => ref.id);
  assert.equal(
    (
      await request(free, "/api/notes/organize", "PATCH", {
        ids: [free.metadata.notes[0].id],
        action: "pin",
        value: true,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(pro, "/api/notes/organize", "PATCH", {
        ids: [ids[0], free.metadata.notes[0].id],
        action: "pin",
        value: true,
      })
    ).status,
    404,
  );
  assert.equal((await read(metaPath(pro.name))).notes[0].pinned, undefined);
  assert.equal(
    (
      await request(pro, "/api/notes/organize", "PATCH", {
        ids,
        action: "folder",
        value: "<img src=x onerror=alert(1)>",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(pro, "/api/notes/organize", "PATCH", {
        ids,
        action: "tags",
        value: ["work", "work", "閱讀"],
      })
    ).status,
    200,
  );
  assert.deepEqual((await read(metaPath(pro.name))).notes[0].tags, [
    "work",
    "閱讀",
  ]);
  assert.equal(
    (
      await request(pro, "/api/notes/organize", "PATCH", {
        ids,
        action: "archive",
        value: true,
      })
    ).status,
    200,
  );
  assert.equal(
    (await request(pro, "/api/notes/batch-delete", "POST", { ids })).status,
    403,
  );
  assert.equal(
    (await request(pro, "/api/notes/batch-delete", "POST", { ids, captcha }))
      .status,
    200,
  );
  assert.equal((await read(metaPath(pro.name))).notes.length, 0);
});

test("expiry cleanup permanently removes trash and locked notes, never recycling them", async () => {
  const free = await fixture("cleanup_free", "free", 21);
  let meta = await read(metaPath(free.name));
  let result = await testables.refreshPlanState(free.name, meta);
  assert.equal(result.lockedIds.size, 1);
  const lockedId = [...result.lockedIds][0];
  const ref = meta.notes.find((ref) => ref.id === lockedId);
  ref.planLockedAt = new Date(Date.now() - 31 * 864e5).toISOString();
  ref.scheduledDeletionAt = new Date(Date.now() - 864e5).toISOString();
  const trash = meta.notes.find((item) => item.id !== lockedId);
  trash.trashedAt = new Date(Date.now() - 8 * 864e5).toISOString();
  trash.trashExpiresAt = new Date(Date.now() - 1000).toISOString();
  // Keep the note-count overflow even after one trash item is erased.
  const extraId = crypto.randomBytes(12).toString("hex");
  meta.notes.push({ id: extraId, path: "notes/" + extraId + ".json" });
  await write(notePath(free.name, extraId), {
    id: extraId,
    name: "x",
    content: "",
    encryption: "none",
    updatedAt: stamp(),
  });
  await testables.refreshPlanState(free.name, meta);
  await assert.rejects(fs.access(notePath(free.name, trash.id)));
  await assert.rejects(fs.access(notePath(free.name, lockedId)));
  assert.equal(
    meta.notes.some((item) => item.trashedAt),
    false,
  );
});

test("lost create response reuses the same Satora idempotency key; Ultra is credited once", async () => {
  const buyer = await fixture("ultra_buyer");
  failCreate = true;
  satoraCalls = [];
  const body = {
    plan: "ultra",
    months: 3,
    checkoutToken: crypto.randomBytes(16).toString("hex"),
    captcha,
  };
  assert.equal(
    (await request(buyer, "/api/billing/create", "POST", body)).status,
    500,
  );
  const created = await request(buyer, "/api/billing/create", "POST", body);
  assert.equal(created.status, 201);
  assert.equal(satoraCalls.length, 2);
  assert.equal(satoraCalls[0].key, satoraCalls[1].key);
  assert.deepEqual(satoraCalls[0].body, satoraCalls[1].body);
  assert.equal(satoraCalls[1].body.price, 37500);
  assert.match(satoraCalls[1].body.product.en, /Ultra/);
  paymentStatus = {
    success: true,
    id: "p".repeat(22),
    status: "paid",
    price: 0,
    original_price: 37500,
    discount_sats: 37500,
    received_sats: 0,
    coupon: { code: "test" },
    acceptance_policy: "coupon",
  };
  const id = created.data.order.orderId;
  const results = await Promise.all([
    request(buyer, "/api/billing/status?order_id=" + id),
    request(buyer, "/api/billing/status?order_id=" + id),
  ]);
  assert.ok(
    results.every((result) => result.data.order.localStatus === "paid"),
  );
  const metadata = await read(metaPath(buyer.name));
  assert.ok(
    metadata.entitlements.ultraMs <= 90 * 864e5 &&
      metadata.entitlements.ultraMs > 90 * 864e5 - 10000,
  );
  assert.equal(
    (await request(buyer, "/api/billing/orders")).data.orders.length,
    1,
  );
  assert.equal(
    (await request(buyer, "/api/billing/create", "POST", body)).data.order
      .localStatus,
    "paid",
  );
  assert.equal(satoraCalls.length, 2);
  await request(buyer, "/api/account");
  assert.equal((await read(metaPath(buyer.name))).fulfilledOrders, undefined);
  metadata.createdAt = stamp();
  await write(metaPath(buyer.name), metadata);
  assert.equal(
    (await request(buyer, "/api/billing/status?order_id=" + id)).status,
    404,
  );
});

test("a crash after entitlement credit resumes without granting paid time twice", async () => {
  const buyer = await fixture("receipt_recovery");
  const created = await request(buyer, "/api/billing/create", "POST", {
    plan: "ultra",
    months: 1,
    checkoutToken: crypto.randomBytes(16).toString("hex"),
    captcha,
  });
  assert.equal(created.status, 201);
  const id = created.data.order.orderId;
  // Simulate the durable user-file write succeeding immediately before a crash
  // prevents the invoice's fulfilledAt commit.
  const meta = await read(metaPath(buyer.name));
  meta.entitlements.ultraMs = 30 * 864e5;
  meta.entitlements.updatedAt = stamp();
  meta.fulfilledOrders = [id];
  await write(metaPath(buyer.name), meta);
  paymentStatus = {
    success: true,
    id: "p".repeat(22),
    status: "paid",
    price: 12500,
    received_sats: 12500,
  };
  const result = await request(buyer, "/api/billing/status?order_id=" + id);
  assert.equal(result.status, 200);
  assert.equal(result.data.order.localStatus, "paid");
  const recovered = await read(metaPath(buyer.name));
  assert.ok(recovered.entitlements.ultraMs <= 30 * 864e5);
  assert.ok(recovered.entitlements.ultraMs > 30 * 864e5 - 10000);
  assert.equal(recovered.fulfilledOrders, undefined);
  const ledger = new OrderStore(directory);
  try {
    assert.equal(ledger.get(id).chargedSats, 12500);
    assert.ok(ledger.get(id).fulfilledAt);
    assert.equal(ledger.get(id).paymentUrl, null);
  } finally {
    ledger.close();
  }
});

test("ledger enforces capacity without preventing existing invoice updates", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-ledger-"));
  const ledger = new OrderStore(dir, { newOrderCeiling: 1 });
  try {
    assert.throws(() => ledger.assertCapacity(), { code: "billing_capacity" });
    const order = {
      orderId: "f".repeat(32),
      username: "test",
      accountId: "account",
      checkoutToken: "x".repeat(32),
      plan: "ultra",
      months: 1,
      expectedSats: 12500,
      createdAt: stamp(),
      localStatus: "created",
    };
    ledger.put(order);
    order.localStatus = "paid";
    order.fulfilledAt = stamp();
    ledger.put(order);
    assert.equal(
      ledger.byCheckout("account", order.checkoutToken).localStatus,
      "paid",
    );
    assert.equal(ledger.get(order.orderId, "different-account"), null);
  } finally {
    ledger.close();
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("AstraZero performs real browser-protocol round trips; tampering, wrong PIN and context fail", async () => {
  const context = vm.createContext({
    crypto: crypto.webcrypto,
    hashwasm: require("hash-wasm"),
    TextEncoder,
    TextDecoder,
    Uint8Array,
    atob,
    btoa,
  });
  vm.runInContext(
    await fs.readFile(path.join(__dirname, "../public/zero.js"), "utf8"),
    context,
  );
  const api = context.AstraZero,
    id = "e".repeat(24),
    salt = crypto.randomBytes(32).toString("base64url"),
    pin = "A!b2#C3$d4%E5^f6";
  const payload = { content: "中文、日本語 and 📝" };
  const encrypted = await api.encrypt("owner", id, salt, pin, payload);
  assert.equal(
    testables.validClientEnvelope(encrypted, constants.ZERO_MODE),
    true,
  );
  const note = { id, clientSalt: salt, name: "Visible", encrypted };
  assert.equal(
    (await api.decrypt("owner", note, pin)).payload.content,
    payload.content,
  );
  const saved = await api.encrypt(
    "owner",
    id,
    salt,
    pin,
    { content: "next" },
    encrypted,
  );
  assert.deepEqual(saved.wrap, encrypted.wrap);
  assert.notEqual(saved.iv, encrypted.iv);
  assert.equal(
    (await api.decrypt("owner", { ...note, encrypted: saved }, pin)).payload
      .content,
    "next",
  );
  await assert.rejects(api.decrypt("owner", note, "wrong"));
  await assert.rejects(api.decrypt("other", note, pin));
  const corrupt = {
    ...encrypted,
    tag: Buffer.alloc(16, 255).toString("base64"),
  };
  await assert.rejects(
    api.decrypt("owner", { ...note, encrypted: corrupt }, pin),
  );
  await assert.rejects(api.encrypt("owner", id, salt, "123", payload));
  assert.equal(JSON.stringify(encrypted).includes(pin), false);
  assert.equal(JSON.stringify(encrypted).includes(payload.content), false);
});
