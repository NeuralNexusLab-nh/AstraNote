"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
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

test("donation route and local QR library are served by AstraNote", async () => {
  const donation = await fetch(`${baseUrl}/donate`);
  assert.equal(donation.status, 200);
  assert.match(await donation.text(), /data-page="donate"/u);

  const library = await fetch(`${baseUrl}/vendor/qrcode-generator/qrcode.js`);
  assert.equal(library.status, 200);
  assert.match(await library.text(), /var qrcode = function/u);
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

test("legacy SCHybrid and current AstraConfidential factors stay versioned", () => {
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
  assert.equal(constants.CONFIDENTIAL_MODE, "astra-confidential-v2");
  assert.equal(
    testables.isClientEncryptedMode(constants.LEGACY_SCHYBRID_MODE),
    true,
  );
  assert.equal(
    testables.isClientEncryptedMode(constants.CONFIDENTIAL_MODE),
    true,
  );
});
