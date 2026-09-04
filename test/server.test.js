"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const os = require("node:os");
const path = require("node:path");

const temporaryData = path.join(os.tmpdir(), `astranote-test-${process.pid}`);
process.env.DATA_DIR = temporaryData;
process.env.ASTRANOTE_SECRET =
  "test-only-secret-that-is-at-least-thirty-two-characters-long";
process.env.ASTRANOTE_VAULT_SECRET =
  "test-only-independent-vault-secret-that-is-longer-than-sixty-four-characters-123456789";
process.env.ASTRA_CONFIDENTIAL_KEY =
  "test-only-new-confidential-key-that-is-independent-and-longer-than-sixty-four-characters-987654321";

const { app, ensureData, constants, testables } = require("../server");

let server;
let baseUrl;

test.before(async () => {
  await ensureData();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  const resolved = path.resolve(temporaryData);
  assert.ok(
    resolved.startsWith(path.resolve(os.tmpdir())),
    "temporary test data must stay inside the OS temp directory",
  );
  await fs.rm(resolved, { recursive: true, force: true });
});

test("health, statistics, and 404 routes respond correctly", async () => {
  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).ok, true);

  const stats = await fetch(`${baseUrl}/api/stats`);
  assert.deepEqual(await stats.json(), { onlineToday: 0, totalUsers: 0 });

  const liveAccount = path.join(temporaryData, "live_counter_user");
  await fs.mkdir(liveAccount);
  await fs.writeFile(path.join(liveAccount, "metadata.json"), "{}\n");
  await fs.writeFile(path.join(temporaryData, "users.txt"), "999\n");
  const liveStats = await fetch(`${baseUrl}/api/stats`);
  assert.equal((await liveStats.json()).totalUsers, 1);
  await fs.rm(liveAccount, { recursive: true, force: true });
  await fs.writeFile(path.join(temporaryData, "users.txt"), "0\n");

  const missing = await fetch(`${baseUrl}/unknown-coordinate`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /404 — AstraNote/);
});

test("session language follows Accept-Language when no saved preference exists", async () => {
  const traditionalChinese = await fetch(`${baseUrl}/api/session`, {
    headers: { "accept-language": "fr;q=0.4, zh-TW;q=0.9, en;q=0.8" },
  });
  assert.deepEqual(await traditionalChinese.json(), {
    authenticated: false,
    preferredLanguage: "zh-Hant",
  });

  const english = await fetch(`${baseUrl}/api/session`, {
    headers: { "accept-language": "en-US,en;q=0.9" },
  });
  assert.equal((await english.json()).preferredLanguage, "en");

  const japanese = await fetch(`${baseUrl}/api/session`, {
    headers: { "accept-language": "ja-JP,ja;q=0.9,en;q=0.7" },
  });
  assert.equal((await japanese.json()).preferredLanguage, "ja");
});

test("today's activity counts each authenticated account once for any request", async () => {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  const session = {
    username: "active_user",
    csrf: "test-csrf",
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 864e5).toISOString(),
    maxExpiresAt: new Date(now + 2 * 864e5).toISOString(),
    ipHash: "test",
  };
  await fs.writeFile(
    path.join(temporaryData, "sessions.json"),
    `${JSON.stringify({ [crypto.createHash("sha256").update(token).digest("hex")]: session })}\n`,
  );
  const headers = { cookie: `astranote_session=${token}` };

  assert.equal((await fetch(`${baseUrl}/api/session`, { headers })).status, 200);
  assert.equal((await fetch(`${baseUrl}/api/account`, { headers })).status, 200);
  assert.equal((await fetch(`${baseUrl}/api/session`, { headers })).status, 200);

  const stats = await fetch(`${baseUrl}/api/stats`);
  assert.equal((await stats.json()).onlineToday, 1);
});

test("plans route is served and the former donation route redirects", async () => {
  const plans = await fetch(`${baseUrl}/plans`);
  assert.equal(plans.status, 200);
  assert.match(await plans.text(), /data-page="plans"/u);

  const donation = await fetch(`${baseUrl}/donate`, { redirect: "manual" });
  assert.equal(donation.status, 308);
  assert.equal(donation.headers.get("location"), "/plans");
});

test("security headers allow only the configured application and CAPTCHA sources", async () => {
  const response = await fetch(`${baseUrl}/`);
  const csp = response.headers.get("content-security-policy");
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /https:\/\/astranote\.nxlabtw\.com/);
  assert.match(csp, /https:\/\/astranote\.zeabur\.app/);
  assert.match(csp, /frame-src[^;]*https:\/\/nexacaptcha\.nxlabtw\.com/);
  assert.match(csp, /script-src[^;]*'wasm-unsafe-eval'/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("permissions-policy"), /camera=\(\)/);

  const cors = await fetch(`${baseUrl}/api/stats`, {
    headers: { origin: "https://astranote.nxlabtw.com" },
  });
  assert.equal(
    cors.headers.get("access-control-allow-origin"),
    "https://astranote.nxlabtw.com",
  );
  assert.equal(cors.headers.get("access-control-allow-credentials"), "true");
});

test("authentication, CAPTCHA, and Origin protections fail closed", async () => {
  const account = await fetch(`${baseUrl}/api/account`);
  assert.equal(account.status, 401);
  assert.equal((await fetch(`${baseUrl}/api/billing/orders`)).status, 401);
  assert.equal(
    (
      await fetch(`${baseUrl}/api/billing/create`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })
    ).status,
    401,
  );

  const noCaptcha = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(noCaptcha.status, 403);
  assert.equal((await noCaptcha.json()).error, "captcha_required");

  const badOrigin = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://attacker.example",
    },
    body: "{}",
  });
  assert.equal(badOrigin.status, 403);
  assert.equal((await badOrigin.json()).error, "origin_rejected");
});

test("registration rate limits repeated requests and advertises retry timing", async () => {
  let response;
  for (let attempt = 0; attempt < 11; attempt += 1) {
    response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.42",
      },
      body: "{}",
    });
  }
  assert.equal(response.status, 429);
  assert.equal((await response.json()).error, "rate_limited");
  assert.ok(response.headers.get("retry-after"));
});

test("published account limits match the 20-note, 128 KB, and 75,000-account policy", () => {
  assert.equal(constants.MAX_NOTES, 20);
  assert.equal(constants.MAX_ACCOUNT_BYTES, 128 * 1000);
  assert.equal(constants.MAX_ACCOUNTS, 75_000);
  assert.deepEqual(constants.PLAN_DEFINITIONS.plus, {
    maxBytes: 256_000,
    maxNotes: 50,
    monthlySats: 2500,
  });
  assert.equal(constants.PLAN_DEFINITIONS.pro.maxBytes, 512_000);
  assert.equal(constants.PLAN_DEFINITIONS.pro.maxNotes, Infinity);
  assert.equal(constants.PLAN_DEFINITIONS.pro.monthlySats, 6000);
  assert.equal(constants.PLAN_MONTH_MS, 30 * 864e5);
});

test("invalid sharing and traversal-shaped identifiers reveal no data", async () => {
  assert.equal((await fetch(`${baseUrl}/api/shared/invalid`)).status, 404);
  assert.equal(
    (await fetch(`${baseUrl}/api/notes/..%2F..%2Fserver`)).status,
    401,
  );
});

test("legacy and current AES-GCM modes authenticate and restore Unicode content", async () => {
  const content = "星海中的想法\nA thought among the stars ✦";
  for (const mode of [
    "aes-256-gcm",
    "aes-128-gcm",
    "aes-256-gcm-new",
    "aes-128-gcm-new",
  ]) {
    const encrypted = testables.encryptContent(
      content,
      "test_user",
      "abcdef0123456789abcdef01",
      mode,
    );
    assert.notEqual(encrypted.ciphertext, content);
    assert.equal(
      testables.decryptContent(
        encrypted,
        "test_user",
        "abcdef0123456789abcdef01",
        mode,
      ),
      content,
    );
    const tampered = { ...encrypted, tag: Buffer.alloc(16).toString("base64") };
    assert.throws(() =>
      testables.decryptContent(
        tampered,
        "test_user",
        "abcdef0123456789abcdef01",
        mode,
      ),
    );
  }
  assert.equal(testables.maskEmail("eaton@example.com"), "ea***@example.com");
  assert.equal(testables.characterCount("星 海\nA B"), 4);

  const legacyCiphertext = testables.encryptContent(
    content,
    "test_user",
    "abcdef0123456789abcdef01",
    "aes-256-gcm",
  );
  assert.throws(() =>
    testables.decryptContent(
      legacyCiphertext,
      "test_user",
      "abcdef0123456789abcdef01",
      "aes-256-gcm-new",
    ),
  );

  assert.equal(
    testables.decryptContent(
      {
        ciphertext: "36ED0x3a9fZmD5ztVVyb8S9J",
        iv: "AAECAwQFBgcICQoL",
        tag: "E8uH6y7JpAQe5rCZB7wQYw==",
      },
      "test_user",
      "abcdef0123456789abcdef01",
      "aes-256-gcm",
    ),
    "Legacy note 相容",
  );
});

test("every AES version leaves the title visible and encrypts only content", () => {
  for (const mode of [
    "aes-256-gcm",
    "aes-128-gcm",
    "aes-256-gcm-new",
    "aes-128-gcm-new",
  ]) {
    const note = {
      id: "abcdef0123456789abcdef01",
      encryption: mode,
      name: "legacy plaintext title",
    };
    testables.writeServerNotePayload(
      note,
      "test_user",
      "銀行與密碼",
      "Only this content belongs in ciphertext.",
    );
    assert.equal(note.payloadVersion, 3);
    assert.equal(note.name, "銀行與密碼");
    const serialized = JSON.stringify(note);
    assert.match(serialized, /銀行與密碼/);
    assert.doesNotMatch(serialized, /Only this content belongs/);
    assert.deepEqual(testables.readServerNotePayload(note, "test_user"), {
      name: "銀行與密碼",
      content: "Only this content belongs in ciphertext.",
    });

    const oldEncryptedTitleNote = {
      id: "abcdef0123456789abcdef01",
      encryption: mode,
      payloadVersion: 2,
      content: testables.encryptContent(
        JSON.stringify({ name: "舊版密文標題", content: "舊版內容" }),
        "test_user",
        "abcdef0123456789abcdef01",
        mode,
      ),
    };
    const oldPayload = testables.readServerNotePayload(
      oldEncryptedTitleNote,
      "test_user",
    );
    testables.writeServerNotePayload(
      oldEncryptedTitleNote,
      "test_user",
      oldPayload.name,
      oldPayload.content,
    );
    assert.equal(oldEncryptedTitleNote.name, "舊版密文標題");
    assert.equal(oldEncryptedTitleNote.payloadVersion, 3);
  }
});

test("legacy and current client-encrypted factors stay versioned", () => {
  const metadata = {
    username: "Test_User",
    email: "owner@example.com",
    passwordHash: "$argon2id$test-password-hash",
  };
  const noteId = "abcdef0123456789abcdef01";
  const clientSalt = "A".repeat(43);
  const factor = testables.deriveVaultFactor(
    metadata,
    noteId,
    clientSalt,
    "b".repeat(64),
  );
  assert.equal(typeof factor, "string");
  assert.equal(factor.length, 43);
  assert.equal(factor, "gJ3emVQ3OpFjVw2xktx7jlHA8N-uguxf4rGqbG1babs");
  assert.equal(
    factor,
    testables.deriveVaultFactor(
      metadata,
      noteId,
      clientSalt,
      "b".repeat(64),
    ),
  );
  assert.notEqual(
    factor,
    testables.deriveVaultFactor(
      metadata,
      noteId,
      clientSalt,
      "c".repeat(64),
    ),
  );
  const currentFactor = testables.deriveVaultFactor(
    metadata,
    noteId,
    clientSalt,
    "b".repeat(64),
    constants.CONFIDENTIAL_MODE,
  );
  assert.equal(typeof currentFactor, "string");
  assert.equal(currentFactor.length, 43);
  assert.notEqual(currentFactor, factor);
  assert.equal(
    testables.validSchybridEnvelope({
      iv: Buffer.alloc(12).toString("base64"),
      tag: Buffer.alloc(16).toString("base64"),
      ciphertext: Buffer.from("ciphertext").toString("base64"),
    }),
    true,
  );
  assert.equal(
    testables.validSchybridEnvelope({
      iv: Buffer.alloc(11).toString("base64"),
      tag: Buffer.alloc(16).toString("base64"),
      ciphertext: Buffer.from("ciphertext").toString("base64"),
    }),
    false,
  );
  assert.equal(constants.SCHYBRID_MODE, "astra-confidential-schybrid-v1");
  assert.equal(constants.LEGACY_CONFIDENTIAL_MODE, "astra-confidential-v2");
  assert.equal(constants.ASTRA_SECRET_MODE, "astra-secret-v1");
  assert.equal(constants.CONFIDENTIAL_MODE, "astra-confidential-v3");
  assert.equal(
    testables.isClientEncryptedMode(constants.LEGACY_SCHYBRID_MODE),
    true,
  );
  assert.equal(
    testables.isClientEncryptedMode(constants.CONFIDENTIAL_MODE),
    true,
  );
  assert.equal(testables.isClientEncryptedMode(constants.ASTRA_SECRET_MODE), true);
});

test("plan time uses Pro before Plus and Admin is unlimited", () => {
  const metadata = {
    email: "member@example.com",
    entitlements: {
      proMs: 2 * 864e5,
      plusMs: 5 * 864e5,
      updatedAt: new Date(1_000_000).toISOString(),
    },
  };
  testables.normalizeEntitlements(metadata, 1_000_000 + 3 * 864e5);
  assert.equal(metadata.entitlements.proMs, 0);
  assert.equal(metadata.entitlements.plusMs, 4 * 864e5);
  assert.equal(testables.planForMetadata(metadata), "plus");

  const admin = { email: "NeuralNexusLab@Hotmail.com", entitlements: {} };
  testables.normalizeEntitlements(admin, Date.now());
  assert.equal(testables.planForMetadata(admin), "admin");
  assert.equal(testables.planPayload(admin).maxBytes, null);
});
