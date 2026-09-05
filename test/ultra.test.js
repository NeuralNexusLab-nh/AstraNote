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

test("one settings request persists all preferences, validates retention and rejects expired access", async () => {
  const user = await fixture("settings_all", "ultra");
  const preferences = {
    theme: "light",
    language: "ja",
    displayName: "Saved together",
    trashDays: 14,
  };
  assert.equal(
    (await request(user, "/api/settings", "PATCH", preferences)).status,
    200,
  );
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.displayName, preferences.displayName);
  for (const key of ["theme", "language", "trashDays"])
    assert.equal(account.settings[key], preferences[key]);
  for (const trashDays of [0, 2, 31, "14", null])
    assert.equal(
      (
        await request(user, "/api/settings", "PATCH", {
          trashDays,
          theme: "dark",
        })
      ).status,
      400,
    );
  let meta = await read(metaPath(user.name));
  assert.equal(meta.settings.trashDays, 14);
  assert.equal(meta.settings.theme, "light");
  meta.entitlements.ultraMs = 1;
  meta.entitlements.updatedAt = new Date(Date.now() - 864e5).toISOString();
  await write(metaPath(user.name), meta);
  assert.equal(
    (
      await request(user, "/api/settings", "PATCH", {
        trashDays: 30,
        theme: "dark",
      })
    ).status,
    403,
  );
  assert.equal((await read(metaPath(user.name))).settings.trashDays, 14);
  assert.equal(
    (await request(user, "/api/settings", "PATCH", { theme: "dark" })).status,
    200,
  );
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
    action: "pin",
    value: true,
  });
  assert.equal(result.status, 413);
  assert.equal((await read(file)).notes[0].pinned, undefined);
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
  assert.equal(testables.planPayload(meta).maxBytes, 1_024_000);
  assert.equal(testables.planPayload(meta).canRecover, true);
  meta.email = "neuralnexuslab@hotmail.com";
  assert.equal(testables.planPayload(meta).maxNotes, null);
  assert.equal(testables.planPayload(meta).canCreateZero, true);
});

test("existing Ultra accounts enforce 1024 KB server-side and lock data above the reduced allowance", async () => {
  const user = await fixture("existing_ultra", "ultra", 2);
  const id = user.metadata.notes[0].id;
  const file = notePath(user.name, id);
  const note = await read(file);
  note.content = "x".repeat(1_100_000);
  await write(file, note);
  const previousBytes = await fs.readFile(file, "utf8");
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.plan.type, "ultra");
  assert.equal(account.plan.maxBytes, 1_024_000);
  assert.equal(account.notes.find((item) => item.id === id).locked, true);
  assert.equal(account.notes.find((item) => item.id !== id).locked, false);
  assert.equal((await request(user, "/api/notes/" + id)).status, 423);
  assert.equal(
    (
      await request(user, "/api/notes/" + id, "PUT", {
        name: "Must stay locked",
        content: "replacement",
        revision: 1,
      })
    ).status,
    423,
  );
  assert.equal(await fs.readFile(file, "utf8"), previousBytes);
});

test("Plus can organize and batch-delete notes, without gaining Zero or recovery access", async () => {
  const plus = await fixture("organize_plus", "plus", 3);
  const free = await fixture("organize_free", "free", 1);
  const ids = plus.metadata.notes.map((note) => note.id);
  const plan = testables.planPayload(plus.metadata);
  assert.equal(plan.canOrganize, true);
  assert.equal(plan.canCreateZero, false);
  assert.equal(plan.canRecover, false);
  for (const [action, field] of [
    ["pin", "pinned"],
    ["archive", "archived"],
  ]) {
    for (const value of [true, false]) {
      assert.equal(
        (
          await request(plus, "/api/notes/organize", "PATCH", {
            ids,
            action,
            value,
          })
        ).status,
        200,
      );
      const saved = await read(metaPath(plus.name));
      assert.ok(saved.notes.every((note) => note[field] === value));
    }
  }
  assert.equal(
    (
      await request(plus, "/api/notes/organize", "PATCH", {
        ids,
        action: "trash",
        captcha,
      })
    ).status,
    403,
  );
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
      await request(free, "/api/notes/batch-delete", "POST", {
        ids: [free.metadata.notes[0].id],
        captcha,
      })
    ).status,
    403,
  );
  const missingCaptcha = await request(
    plus,
    "/api/notes/batch-delete",
    "POST",
    {
      ids: ids.slice(0, 2),
    },
  );
  assert.equal(missingCaptcha.status, 403);
  assert.equal(missingCaptcha.data.error, "captcha_required");
  assert.equal(
    (
      await request(plus, "/api/notes/batch-delete", "POST", {
        ids: ids.slice(0, 2),
        captcha,
      })
    ).status,
    200,
  );
  for (const id of ids.slice(0, 2))
    await assert.rejects(fs.stat(notePath(plus.name, id)), { code: "ENOENT" });
  const meta = await read(metaPath(plus.name));
  assert.equal(meta.notes.length, 1);
  meta.entitlements.plusMs = 0;
  await write(metaPath(plus.name), meta);
  const expired = await request(plus, "/api/notes/organize", "PATCH", {
    ids: [ids[2]],
    action: "pin",
    value: true,
  });
  assert.equal(expired.status, 403);
  assert.equal(expired.data.error, "organization_required");
  assert.equal((await read(metaPath(plus.name))).notes[0].pinned, false);
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
  assert.equal((await put("x".repeat(1_024_000), 3)).status, 413);
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
  assert.equal((await read(metaPath(ultra.name))).settings.trashDays, 30);
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
    400,
  );
  assert.equal(
    (
      await request(pro, "/api/notes/organize", "PATCH", {
        ids,
        action: "tags",
        value: ["work", "work", "閱讀"],
      })
    ).status,
    400,
  );
  assert.equal((await read(metaPath(pro.name))).notes[0].tags, undefined);
  assert.equal((await read(metaPath(pro.name))).notes[0].folder, undefined);
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

test("expired Ultra locks oversized notes on Pro; only deletion or a verified upgrade can release access", async () => {
  const user = await fixture("expiry_access", "ultra", 3);
  const id = user.metadata.notes[0].id;
  const file = notePath(user.name, id);
  const note = await read(file);
  const plaintext = "EXPIRY-PRIVATE-CONTENT-" + "x".repeat(400000);
  note.encryption = "aes-256-gcm-new";
  testables.writeServerNotePayload(
    note,
    user.name,
    "Protected title",
    plaintext,
  );
  const previous = { ...note };
  testables.writeServerNotePayload(
    previous,
    user.name,
    "Previous title",
    "previous private content",
  );
  note.previous = testables.noteSnapshot(previous);
  note.shareToken = crypto.randomBytes(32).toString("base64url");
  await write(file, note);
  const shares = await read(path.join(directory, "shares.json"));
  shares[crypto.createHash("sha256").update(note.shareToken).digest("hex")] = {
    username: user.name,
    id,
  };
  await write(path.join(directory, "shares.json"), shares);
  assert.equal(
    (await request(user, "/api/notes/" + id)).data.content,
    plaintext,
  );
  assert.equal(
    (await request(user, "/api/shared/" + note.shareToken)).status,
    200,
  );
  let meta = await read(metaPath(user.name));
  meta.notes[0].pinned = true;
  meta.notes[0].archived = true;
  meta.notes[0].folder = "retired folder";
  meta.notes[0].tags = ["retired tag"];
  meta.entitlements = {
    ultraMs: 1000,
    proMs: 10 * 864e5,
    plusMs: 0,
    updatedAt: new Date(Date.now() - 2000).toISOString(),
  };
  await write(metaPath(user.name), meta);
  const originalFile = await fs.readFile(file, "utf8");
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.plan.type, "pro");
  assert.equal(account.lockedNoteCount, 1);
  const summary = account.notes.find((item) => item.id === id);
  assert.equal(summary.locked, true);
  assert.equal(summary.pinned, true);
  assert.equal(summary.archived, true);
  for (const key of [
    "content",
    "encrypted",
    "previous",
    "clientSalt",
    "shareToken",
    "folder",
    "tags",
    "encryption",
  ])
    assert.equal(summary[key], undefined, key);
  meta = await read(metaPath(user.name));
  assert.equal(meta.notes[0].folder, undefined);
  assert.equal(meta.notes[0].tags, undefined);
  assert.ok(meta.notes[0].planLockedAt);
  assert.equal(
    Date.parse(meta.notes[0].scheduledDeletionAt) -
      Date.parse(meta.notes[0].planLockedAt),
    30 * 864e5,
  );

  const denied = [
    ["/api/notes/" + id, "GET"],
    [
      "/api/notes/" + id,
      "PUT",
      { name: "Changed", content: "no", revision: 1 },
    ],
    ["/api/notes/" + id + "/share", "POST", { enabled: true }],
    ["/api/notes/" + id + "/share", "POST", { enabled: false }],
    ["/api/notes/" + id + "/previous", "GET"],
    ["/api/notes/" + id + "/previous/restore", "POST", { revision: 1 }],
    [
      "/api/vault/key-factor",
      "POST",
      {
        noteId: id,
        clientSalt: "s".repeat(43),
        clientHash: "c".repeat(64),
        encryption: constants.CONFIDENTIAL_MODE,
      },
    ],
    ...[true, false].flatMap((value) =>
      ["pin", "archive"].map((action) => [
        "/api/notes/organize",
        "PATCH",
        { ids: [id], action, value },
      ]),
    ),
    ["/api/notes/organize", "PATCH", { ids: [id], action: "trash", captcha }],
  ];
  for (const [route, method, body] of denied) {
    const result = await request(user, route, method, body);
    assert.equal(result.status, 423, method + " " + route);
    const serialized = JSON.stringify(result.data);
    assert.ok(!serialized.includes("EXPIRY-PRIVATE-CONTENT"));
    assert.ok(!serialized.includes(note.content.ciphertext));
    assert.equal(result.data.serverFactor, undefined);
    assert.equal(result.data.note?.content, undefined);
    assert.equal(result.data.note?.previous, undefined);
  }
  assert.equal(
    (await request(user, "/api/shared/" + note.shareToken)).status,
    404,
  );
  assert.equal(await fs.readFile(file, "utf8"), originalFile);
  assert.equal((await read(metaPath(user.name))).notes[0].pinned, true);
  assert.equal((await read(metaPath(user.name))).notes[0].archived, true);

  // Exercise the actual fulfilment route, not just editing a local entitlement.
  const created = await request(user, "/api/billing/create", "POST", {
    plan: "ultra",
    months: 1,
    checkoutToken: crypto.randomBytes(16).toString("hex"),
    captcha,
  });
  assert.equal(created.status, 201);
  paymentStatus = {
    success: true,
    id: "p".repeat(22),
    status: "paid",
    price: 12500,
    received_sats: 12500,
  };
  const paid = await request(
    user,
    "/api/billing/status?order_id=" + created.data.order.orderId,
  );
  assert.equal(paid.data.order.localStatus, "paid");
  const upgraded = (await request(user, "/api/account")).data;
  assert.equal(upgraded.plan.type, "ultra");
  assert.equal(upgraded.lockedNoteCount, 0);
  assert.equal(
    (await read(metaPath(user.name))).notes[0].planLockedAt,
    undefined,
  );
  assert.equal(
    (await read(metaPath(user.name))).notes[0].scheduledDeletionAt,
    undefined,
  );
  assert.equal(
    (await request(user, "/api/notes/" + id)).data.content,
    plaintext,
  );
  assert.equal(
    (await request(user, "/api/shared/" + note.shareToken)).data.content,
    plaintext,
  );
  assert.equal(
    (await request(user, "/api/notes/" + id + "/previous")).data.content,
    "previous private content",
  );
  assert.equal(await fs.readFile(file, "utf8"), originalFile);
  assert.equal(
    (
      await request(user, "/api/notes/organize", "PATCH", {
        ids: [id],
        action: "archive",
        value: false,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(user, "/api/notes/" + id + "/previous/restore", "POST", {
        revision: 1,
      })
    ).status,
    200,
  );
  assert.equal(
    (await request(user, "/api/notes/" + id)).data.content,
    "previous private content",
  );
});

test("expired Free accounts cannot obtain client ciphertext or key factors; upgrade preserves every client format", async () => {
  const modes = [
    constants.LEGACY_SCHYBRID_MODE,
    constants.LEGACY_CONFIDENTIAL_MODE,
    constants.ASTRA_SECRET_MODE,
    constants.CONFIDENTIAL_MODE,
    constants.ZERO_MODE,
  ];
  for (const [index, mode] of modes.entries()) {
    const user = await fixture("client_expiry_" + index, "ultra", 1);
    const id = user.metadata.notes[0].id;
    const note = await read(notePath(user.name, id));
    note.encryption = mode;
    note.clientSalt = crypto.randomBytes(32).toString("base64url");
    note.content = {
      ...(mode === constants.ZERO_MODE ? zeroEnvelope : enc),
      ciphertext: Buffer.alloc(110000, 7).toString("base64"),
    };
    note.previous = testables.noteSnapshot(note);
    await write(notePath(user.name, id), note);
    const factorBody = {
      noteId: id,
      clientSalt: note.clientSalt,
      clientHash: "f".repeat(64),
      encryption: mode,
    };
    const before = (await request(user, "/api/notes/" + id)).data;
    const factorBefore =
      mode === constants.ZERO_MODE
        ? null
        : (await request(user, "/api/vault/key-factor", "POST", factorBody))
            .data.serverFactor;
    if (mode !== constants.ZERO_MODE)
      assert.equal(typeof factorBefore, "string");
    const meta = await read(metaPath(user.name));
    meta.entitlements = {
      ultraMs: 1,
      proMs: 0,
      plusMs: 0,
      updatedAt: new Date(Date.now() - 1000).toISOString(),
    };
    await write(metaPath(user.name), meta);
    const locked = await request(user, "/api/notes/" + id);
    assert.equal(locked.status, 423);
    assert.equal(locked.data.note.name, note.name);
    assert.equal(locked.data.note.encrypted, undefined);
    assert.equal(locked.data.note.clientSalt, undefined);
    assert.equal(
      (await request(user, "/api/notes/" + id + "/previous")).status,
      423,
    );
    assert.equal(
      (await request(user, "/api/vault/key-factor", "POST", factorBody)).status,
      423,
    );
    const fresh = await read(metaPath(user.name));
    fresh.entitlements.ultraMs = 864e5;
    fresh.entitlements.updatedAt = stamp();
    await write(metaPath(user.name), fresh);
    const after = (await request(user, "/api/notes/" + id)).data;
    assert.deepEqual(after.encrypted, before.encrypted);
    assert.equal(after.clientSalt, before.clientSalt);
    assert.equal(
      (await request(user, "/api/notes/" + id + "/previous")).status,
      200,
    );
    if (mode !== constants.ZERO_MODE)
      assert.equal(
        (await request(user, "/api/vault/key-factor", "POST", factorBody)).data
          .serverFactor,
        factorBefore,
      );
  }
});

test("locked trash stays in the trash listing, cannot restore, and unlocks after upgrade without extending its expiry", async () => {
  const user = await fixture("trash_expiry", "ultra", 2);
  const id = user.metadata.notes[0].id;
  const file = notePath(user.name, id);
  const note = await read(file);
  note.content = "trash-private-content-" + "x".repeat(140000);
  await write(file, note);
  assert.equal(
    (await request(user, "/api/notes/" + id, "DELETE", { captcha })).status,
    200,
  );
  let meta = await read(metaPath(user.name));
  const expiry = meta.notes[0].trashExpiresAt;
  meta.entitlements = {
    ultraMs: 1,
    proMs: 0,
    plusMs: 0,
    updatedAt: new Date(Date.now() - 1000).toISOString(),
  };
  await write(metaPath(user.name), meta);
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.plan.type, "free");
  assert.equal(account.notes.length, 1);
  assert.equal(account.notes[0].locked, false);
  assert.equal(account.trash.length, 1);
  assert.equal(account.trash[0].locked, true);
  assert.equal(account.trash[0].trashExpiresAt, expiry);
  assert.equal(account.trash[0].content, undefined);
  assert.equal(
    (await request(user, "/api/trash/" + id + "/restore", "POST", {})).status,
    423,
  );
  for (const suffix of ["", "/previous"])
    assert.equal(
      (await request(user, "/api/notes/" + id + suffix)).status,
      404,
    );
  meta = await read(metaPath(user.name));
  meta.entitlements.ultraMs = 864e5;
  meta.entitlements.updatedAt = stamp();
  await write(metaPath(user.name), meta);
  const unlocked = (await request(user, "/api/account")).data;
  assert.equal(unlocked.trash[0].locked, false);
  assert.equal(unlocked.trash[0].trashExpiresAt, expiry);
  assert.equal(
    (await request(user, "/api/trash/" + id + "/restore", "POST", {})).status,
    200,
  );
  assert.equal(
    (await request(user, "/api/notes/" + id)).data.content,
    note.content,
  );
});

test("an insufficient upgrade keeps oversized notes locked until sufficient allowance exists", async () => {
  const user = await fixture("partial_upgrade", "ultra", 2);
  const [large, small] = user.metadata.notes;
  const note = await read(notePath(user.name, large.id));
  note.content = "private".repeat(50000);
  await write(notePath(user.name, large.id), note);
  const meta = await read(metaPath(user.name));
  meta.entitlements = {
    ultraMs: 1,
    proMs: 0,
    plusMs: 0,
    updatedAt: new Date(Date.now() - 1000).toISOString(),
  };
  await write(metaPath(user.name), meta);
  assert.equal((await request(user, "/api/notes/" + large.id)).status, 423);
  const lockedAt = (await read(metaPath(user.name))).notes[0].planLockedAt;
  let changed = await read(metaPath(user.name));
  changed.entitlements.plusMs = 30 * 864e5;
  await write(metaPath(user.name), changed);
  assert.equal((await request(user, "/api/notes/" + large.id)).status, 423);
  assert.equal((await request(user, "/api/notes/" + small.id)).status, 200);
  assert.equal(
    (await read(metaPath(user.name))).notes[0].planLockedAt,
    lockedAt,
  );
  changed = await read(metaPath(user.name));
  changed.entitlements.proMs = 30 * 864e5;
  await write(metaPath(user.name), changed);
  assert.equal(
    (await request(user, "/api/notes/" + large.id)).data.content,
    note.content,
  );
  assert.equal(
    (await read(metaPath(user.name))).notes[0].planLockedAt,
    undefined,
  );
});

test("count-only overage locks the largest active note, not trash, and locked trash may be deleted", async () => {
  const user = await fixture("count_and_trash", "free", 22);
  const meta = await read(metaPath(user.name));
  const trash = meta.notes[21],
    largest = meta.notes[20];
  trash.trashedAt = stamp();
  trash.trashExpiresAt = new Date(Date.now() + 864e5).toISOString();
  await write(metaPath(user.name), meta);
  for (const [ref, count] of [
    [trash, 3000],
    [largest, 2000],
  ]) {
    const note = await read(notePath(user.name, ref.id));
    note.content = "x".repeat(count);
    await write(notePath(user.name, ref.id), note);
  }
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.trash[0].locked, false);
  assert.deepEqual(
    account.notes.filter((n) => n.locked).map((n) => n.id),
    [largest.id],
  );
  const trashedNote = await read(notePath(user.name, trash.id));
  trashedNote.content = "private".repeat(20000);
  await write(notePath(user.name, trash.id), trashedNote);
  assert.equal(
    (await request(user, "/api/account")).data.trash[0].locked,
    true,
  );
  assert.equal(
    (await request(user, "/api/trash/" + trash.id, "DELETE", { captcha }))
      .status,
    200,
  );
  await assert.rejects(fs.access(notePath(user.name, trash.id)));
});

test("locked notes can be permanently deleted, but cannot be moved into trash", async () => {
  const user = await fixture("locked_delete", "free", 2);
  const id = user.metadata.notes[0].id;
  const note = await read(notePath(user.name, id));
  note.content = "x".repeat(130000);
  await write(notePath(user.name, id), note);
  assert.equal((await request(user, "/api/notes/" + id)).status, 423);
  assert.equal(
    (await request(user, "/api/notes/" + id, "DELETE", {})).status,
    403,
  );
  assert.equal(
    (await request(user, "/api/notes/" + id, "DELETE", { captcha })).status,
    200,
  );
  await assert.rejects(fs.access(notePath(user.name, id)));
  const account = (await request(user, "/api/account")).data;
  assert.equal(account.trash.length, 0);
  assert.equal(account.lockedNoteCount, 0);
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
