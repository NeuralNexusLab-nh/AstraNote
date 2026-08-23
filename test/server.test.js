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

test("security headers allow only the configured application and CAPTCHA sources", async () => {
  const response = await fetch(`${baseUrl}/`);
  const csp = response.headers.get("content-security-policy");
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /https:\/\/astranote\.nxlabtw\.com/);
  assert.match(csp, /https:\/\/astranote\.zeabur\.app/);
  assert.match(csp, /frame-src[^;]*https:\/\/nexacaptcha\.nxlabtw\.com/);
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

test("published account limits match the 48-note and 256 KiB policy", () => {
  assert.equal(constants.MAX_NOTES, 48);
  assert.equal(constants.MAX_ACCOUNT_BYTES, 256 * 1024);
});

test("invalid sharing and traversal-shaped identifiers reveal no data", async () => {
  assert.equal((await fetch(`${baseUrl}/api/shared/invalid`)).status, 404);
  assert.equal(
    (await fetch(`${baseUrl}/api/notes/..%2F..%2Fserver`)).status,
    401,
  );
});

test("AES-GCM modes authenticate and restore Unicode note content", async () => {
  const content = "星海中的想法\nA thought among the stars ✦";
  for (const mode of ["aes-256-gcm", "aes-128-gcm"]) {
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
});
