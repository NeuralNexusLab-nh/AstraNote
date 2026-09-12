"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { argon2id } = require("hash-wasm");

let directory;
let server;
let base;
let originalFetch;
let testables;

const stamp = () => new Date().toISOString();
const dropId = () => crypto.randomBytes(32).toString("base64url");
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const envelopeText = new TextEncoder();
const envelopeDecoder = new TextDecoder();
const toBase64 = (value) => Buffer.from(value).toString("base64");
const fromBase64 = (value) => Buffer.from(value, "base64");

async function dropKey(pin, factor, salt) {
  const bytes = await argon2id({
    password: `${pin}\0${factor}`,
    salt: fromBase64(salt.replaceAll("-", "+").replaceAll("_", "/")),
    parallelism: 1,
    iterations: 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: "binary",
  });
  try {
    return await crypto.webcrypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
  } finally {
    bytes.fill(0);
  }
}

async function write(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n");
}

async function fixture(username, plan = "free") {
  const token = crypto.randomBytes(32).toString("base64url");
  const csrf = crypto.randomBytes(16).toString("hex");
  const now = Date.now();
  const metadata = {
    username,
    email: `${username}@example.test`,
    passwordHash: "test-fixture-hash",
    createdAt: stamp(),
    settings: { theme: "dark", language: "en" },
    entitlements: {
      plusMs: plan === "plus" ? 864e5 : 0,
      proMs: 0,
      ultraMs: 0,
      updatedAt: stamp(),
    },
    notes: [],
  };
  await write(path.join(directory, username, "metadata.json"), metadata);
  await write(path.join(directory, username, "sessions.json"), {
    [crypto.createHash("sha256").update(token).digest("hex")]: {
      username,
      csrf,
      createdAt: stamp(),
      expiresAt: new Date(now + 864e5).toISOString(),
      maxExpiresAt: new Date(now + 2 * 864e5).toISOString(),
    },
  });
  return {
    headers: {
      cookie: `astranote_session=${username}.${token}`,
      "x-csrf-token": csrf,
      origin: base,
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0.44",
    },
  };
}

async function request(user, route, method = "GET", body) {
  const response = await originalFetch(base + route, {
    method,
    headers: user ? user.headers : { origin: base, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

test.before(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-drops-"));
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = "test-secret-".repeat(8);
  process.env.ASTRA_CONFIDENTIAL_KEY = "test-confidential-key-".repeat(8);
  originalFetch = global.fetch;
  const mod = require("../server");
  testables = mod.testables;
  await mod.ensureData();
  server = mod.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  testables.closeOrderStore();
  assert.equal(path.dirname(directory), os.tmpdir());
  await fs.rm(directory, { recursive: true, force: true });
});

test("AstraDrop is a bounded, expiring snapshot and its final allowed view removes it", async () => {
  const user = await fixture("drop_free");
  const id = dropId();
  const createdAt = stamp();
  const create = await request(user, "/api/drops", "POST", {
    id,
    sourceName: "Quick note",
    mode: "basic",
    content: "A short, independent snapshot.",
    createdAt,
    durationMs: 300000,
    viewLimit: 1,
  });
  assert.equal(create.status, 201);
  assert.equal(create.data.url, `/drop/${id}`);
  const details = await request(null, `/api/drops/${id}`);
  assert.equal(details.status, 200);
  assert.equal(details.data.mode, "basic");
  assert.equal(details.data.viewsRemaining, 1);
  const open = await request(null, `/api/drops/${id}/open`, "POST", { clientHash: "" });
  assert.equal(open.status, 200);
  assert.equal(open.data.content, "A short, independent snapshot.");
  const gone = await request(null, `/api/drops/${id}`);
  assert.equal(gone.status, 404);
});

test("Free cannot create encrypted AstraDrops and active Drop snapshots consume its quota", async () => {
  const user = await fixture("drop_policy");
  const createdAt = stamp();
  const encrypted = await request(user, "/api/drops/key-factor", "POST", {
    mode: "secret",
    id: dropId(),
    createdAt,
    clientSalt: crypto.randomBytes(32).toString("base64url"),
    clientHash: crypto.randomBytes(32).toString("hex"),
  });
  assert.equal(encrypted.status, 400);
  const tooLarge = await request(user, "/api/drops", "POST", {
    id: dropId(), sourceName: "Large", mode: "basic", createdAt,
    durationMs: 864e5, viewLimit: null, content: "x".repeat(128000),
  });
  assert.equal(tooLarge.status, 413);
});

test("DropSecret verifies its PIN before consuming a view and decrypts the matching snapshot", async () => {
  const user = await fixture("drop_plus", "plus");
  const id = dropId();
  const createdAt = stamp();
  const pin = "4281";
  const clientSalt = crypto.randomBytes(32).toString("base64url");
  const clientHash = hash(`AstraDrop secret v1\0${pin}\0${id}\0${createdAt}\0${clientSalt}`);
  const factorResult = await request(user, "/api/drops/key-factor", "POST", {
    mode: "secret", id, createdAt, clientSalt, clientHash,
  });
  assert.equal(factorResult.status, 200);
  const key = await dropKey(pin, factorResult.data.serverFactor, clientSalt);
  const iv = crypto.randomBytes(12);
  const message = "PIN-protected Drop snapshot";
  const context = envelopeText.encode(`AstraDrop secret v1\0${id}\0${createdAt}`);
  const sealed = Buffer.from(await crypto.webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: context, tagLength: 128 }, key, envelopeText.encode(message),
  ));
  const create = await request(user, "/api/drops", "POST", {
    id, sourceName: "Private", mode: "secret", createdAt, durationMs: 300000,
    viewLimit: 1, clientSalt, clientHash,
    encrypted: {
      iv: toBase64(iv), ciphertext: toBase64(sealed.subarray(0, -16)), tag: toBase64(sealed.subarray(-16)),
    },
  });
  assert.equal(create.status, 201);
  const wrong = await request(null, `/api/drops/${id}/open`, "POST", {
    clientHash: hash(`AstraDrop secret v1\0wrong\0${id}\0${createdAt}\0${clientSalt}`),
  });
  assert.equal(wrong.status, 403);
  const details = await request(null, `/api/drops/${id}`);
  assert.equal(details.data.viewsRemaining, 1);
  const open = await request(null, `/api/drops/${id}/open`, "POST", { clientHash });
  assert.equal(open.status, 200);
  const decryptKey = await dropKey(pin, open.data.serverFactor, open.data.clientSalt);
  const combined = Buffer.concat([fromBase64(open.data.encrypted.ciphertext), fromBase64(open.data.encrypted.tag)]);
  const clear = await crypto.webcrypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(open.data.encrypted.iv), additionalData: context, tagLength: 128 }, decryptKey, combined,
  );
  assert.equal(envelopeDecoder.decode(clear), message);
});
