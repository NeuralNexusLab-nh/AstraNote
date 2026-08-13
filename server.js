"use strict";

const express = require("express");
const helmet = require("helmet");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const argon2 = require("argon2");
const crypto = require("node:crypto");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSET_DIR = path.join(ROOT, "asset");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const USERS_FILE = path.join(DATA_DIR, "users.txt");
const ONLINE_FILE = path.join(DATA_DIR, "onlineToday.txt");
const ONLINE_USERS_FILE = path.join(DATA_DIR, "onlineTodayUsers.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const DELETES_FILE = path.join(DATA_DIR, "deletes.json");
const SHARES_FILE = path.join(DATA_DIR, "shares.json");
const SECRET_FILE = path.join(DATA_DIR, ".server-secret");

const MAX_ACCOUNTS = 60_000;
const MAX_NOTES = 24;
const MAX_ACCOUNT_BYTES = 256 * 1024;
const MAX_NOTE_NAME = 80;
const MAX_DISPLAY_NAME = 40;
const SESSION_INITIAL_MS = 14 * 864e5;
const SESSION_EXTENSION_MS = 2 * 864e5;
const SESSION_MAX_MS = 28 * 864e5;
const DELETE_REVERSAL_MS = 7 * 864e5;
const DELETE_ERASE_MS = 62 * 864e5;
const TERMS_VERSION = "2026-08-13";
const CAPTCHA_VERIFY_URL = "https://nexacaptcha.zone.id/api/siteverify";
const ALLOWED_ORIGINS = new Set([
  "https://astranote.zone.id",
  "https://astranote.zeabur.app",
]);
const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/;
const ENCRYPTION_TYPES = new Set(["none", "aes-256-gcm", "aes-128-gcm"]);
const COMMON_PASSWORDS = new Set([
  "password123",
  "1234567890",
  "qwerty12345",
  "password1234",
  "12345678910",
  "iloveyou123",
  "admin123456",
  "letmein1234",
  "welcome1234",
  "astranote123",
]);
const locks = new Map();

let appSecret;

function utcNow() {
  return new Date().toISOString();
}
function utcDay() {
  return new Date().toISOString().slice(0, 10);
}
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function userKey(username) {
  return username.toLowerCase();
}
function userDir(username) {
  return path.join(DATA_DIR, userKey(username));
}
function metadataFile(username) {
  return path.join(userDir(username), "metadata.json");
}
function notesDir(username) {
  return path.join(userDir(username), "notes");
}
function noteFile(username, id) {
  return path.join(notesDir(username), `${id}.json`);
}
function newId(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}
function jsonError(res, status, code, message) {
  return res.status(status).json({ error: code, message });
}

async function exists(file) {
  try {
    await fsp.access(file);
    return true;
  } catch {
    return false;
  }
}
async function readJson(file, fallback) {
  try {
    return JSON.parse(await fsp.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}
async function atomicWrite(file, value) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${newId(4)}.tmp`;
  await fsp.writeFile(temporary, value, { encoding: "utf8", mode: 0o600 });
  await fsp.rename(temporary, file);
}
async function writeJson(file, value) {
  await atomicWrite(file, `${JSON.stringify(value, null, 2)}\n`);
}
async function withLock(name, task) {
  const previous = locks.get(name) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => {
    release = resolve;
  });
  locks.set(name, current);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (locks.get(name) === current) locks.delete(name);
  }
}
async function directorySize(directory) {
  let total = 0;
  for (const entry of await fsp.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) total += await directorySize(target);
    else if (entry.isFile()) total += (await fsp.stat(target)).size;
  }
  return total;
}
async function loadMetadata(username) {
  return readJson(metadataFile(username), null);
}
async function saveMetadata(username, metadata) {
  await writeJson(metadataFile(username), metadata);
}
function normalizeText(value, max) {
  if (typeof value !== "string") return "";
  return value.normalize("NFC").trim().slice(0, max);
}
function characterCount(text) {
  return Array.from(String(text)).filter((char) => !/\s/u.test(char)).length;
}
function maskEmail(email) {
  const [local, domain] = String(email).split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(3, local.length - visible.length))}@${domain}`;
}

async function ensureData() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  for (const [file, initial] of [
    [USERS_FILE, "0\n"],
    [ONLINE_FILE, "0\n"],
    [
      ONLINE_USERS_FILE,
      JSON.stringify({ date: utcDay(), users: [] }, null, 2) + "\n",
    ],
    [SESSIONS_FILE, "{}\n"],
    [DELETES_FILE, "[]\n"],
    [SHARES_FILE, "{}\n"],
  ])
    if (!(await exists(file))) await atomicWrite(file, initial);

  if (
    process.env.ASTRANOTE_SECRET &&
    process.env.ASTRANOTE_SECRET.length >= 32
  ) {
    appSecret = process.env.ASTRANOTE_SECRET;
  } else if (await exists(SECRET_FILE)) {
    appSecret = (await fsp.readFile(SECRET_FILE, "utf8")).trim();
  } else {
    appSecret = crypto.randomBytes(48).toString("base64url");
    await atomicWrite(SECRET_FILE, `${appSecret}\n`);
  }
}

function deriveKey(username, noteId, bits) {
  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(appSecret),
      Buffer.from(userKey(username)),
      Buffer.from(`AstraNote:${noteId}:${bits}`),
      bits / 8,
    ),
  );
}
function encryptContent(content, username, id, mode) {
  if (mode === "none") return content;
  const bits = mode === "aes-128-gcm" ? 128 : 256;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    `aes-${bits}-gcm`,
    deriveKey(username, id, bits),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(content, "utf8"),
    cipher.final(),
  ]);
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}
function decryptContent(stored, username, id, mode) {
  if (mode === "none") return typeof stored === "string" ? stored : "";
  const bits = mode === "aes-128-gcm" ? 128 : 256;
  const decipher = crypto.createDecipheriv(
    `aes-${bits}-gcm`,
    deriveKey(username, id, bits),
    Buffer.from(stored.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(stored.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(stored.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

async function readSessions() {
  return readJson(SESSIONS_FILE, {});
}
async function writeSessions(sessions) {
  await writeJson(SESSIONS_FILE, sessions);
}
async function updateShares(mutator) {
  return withLock("shares", async () => {
    const shares = await readJson(SHARES_FILE, {});
    const result = await mutator(shares);
    await writeJson(SHARES_FILE, shares);
    return result;
  });
}
function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("=").map(decodeURIComponent))
      .filter((x) => x.length === 2),
  );
}
function setSessionCookie(res, token, expiresAt) {
  res.cookie("astranote_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}
async function createSession(username, req, res) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  const record = {
    username: userKey(username),
    csrf: newId(24),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_INITIAL_MS).toISOString(),
    maxExpiresAt: new Date(now + SESSION_MAX_MS).toISOString(),
    ipHash: sha256(`${appSecret}:${requestIp(req)}`),
  };
  await withLock("sessions", async () => {
    const sessions = await readSessions();
    sessions[sha256(token)] = record;
    await writeSessions(sessions);
  });
  setSessionCookie(res, token, record.expiresAt);
  return record;
}
async function destroySessionToken(token) {
  if (!token) return;
  await withLock("sessions", async () => {
    const sessions = await readSessions();
    delete sessions[sha256(token)];
    await writeSessions(sessions);
  });
}
async function destroyUserSessions(username) {
  await withLock("sessions", async () => {
    const sessions = await readSessions();
    for (const [key, session] of Object.entries(sessions)) {
      if (session.username === userKey(username)) delete sessions[key];
    }
    await writeSessions(sessions);
  });
}
async function requireAuth(req, res, next) {
  try {
    const token = parseCookies(req.headers.cookie).astranote_session;
    if (!token)
      return jsonError(res, 401, "authentication_required", "Please sign in.");
    const key = sha256(token);
    const session = await withLock("sessions", async () => {
      const sessions = await readSessions();
      const current = sessions[key];
      const now = Date.now();
      if (
        !current ||
        now >= Date.parse(current.expiresAt) ||
        now >= Date.parse(current.maxExpiresAt)
      ) {
        if (current) {
          delete sessions[key];
          await writeSessions(sessions);
        }
        return null;
      }
      current.expiresAt = new Date(
        Math.min(
          Date.parse(current.maxExpiresAt),
          Math.max(Date.parse(current.expiresAt), now) + SESSION_EXTENSION_MS,
        ),
      ).toISOString();
      sessions[key] = current;
      await writeSessions(sessions);
      return current;
    });
    if (!session) {
      res.clearCookie("astranote_session", { path: "/" });
      return jsonError(
        res,
        401,
        "session_expired",
        "Your session has expired.",
      );
    }
    const deletion = await findDeletion(session.username);
    if (deletion && deletion.status !== "cooling_off") {
      return jsonError(res, 401, "authentication_required", "Please sign in.");
    }
    setSessionCookie(res, token, session.expiresAt);
    req.auth = { token, session };
    next();
  } catch (error) {
    next(error);
  }
}
function requireCsrf(req, res, next) {
  const token = req.get("x-csrf-token");
  if (!token || !safeEqual(token, req.auth.session.csrf)) {
    return jsonError(
      res,
      403,
      "invalid_csrf",
      "Security token is missing or invalid.",
    );
  }
  next();
}
function requestIp(req) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

async function verifyCaptcha(req, res, next) {
  const { verificationId, responseToken } = req.body?.captcha || {};
  if (
    !/^[A-Za-z0-9_-]{16}$/.test(verificationId || "") ||
    !/^[A-Za-z0-9_-]{64}$/.test(responseToken || "")
  ) {
    return jsonError(
      res,
      403,
      "captcha_required",
      "Complete the CAPTCHA and try again.",
    );
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(CAPTCHA_VERIFY_URL, {
      method: "POST",
      redirect: "error",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "user-agent": "AstraNote/1.0",
      },
      body: JSON.stringify({ verificationId, responseToken }),
    });
    clearTimeout(timer);
    const length = Number(response.headers.get("content-length") || 0);
    if (length > 4096) throw new Error("CAPTCHA response too large");
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      return jsonError(
        res,
        403,
        "captcha_failed",
        "CAPTCHA verification failed or expired.",
      );
    }
    next();
  } catch {
    return jsonError(
      res,
      503,
      "captcha_unavailable",
      "CAPTCHA verification is temporarily unavailable.",
    );
  }
}

async function findDeletion(username) {
  const entries = await readJson(DELETES_FILE, []);
  const entry = entries.find((item) => item.username === userKey(username));
  if (
    entry &&
    entry.status === "cooling_off" &&
    Date.now() >= Date.parse(entry.reversibleUntil)
  ) {
    entry.status = "pending_erasure";
    entry.lockedAt = entry.lockedAt || utcNow();
    await writeJson(DELETES_FILE, entries);
  }
  return entry || null;
}
async function cancelDeletion(username) {
  await withLock("deletes", async () => {
    const entries = await readJson(DELETES_FILE, []);
    await writeJson(
      DELETES_FILE,
      entries.filter((item) => item.username !== userKey(username)),
    );
  });
}
async function markDeletion(username) {
  const now = Date.now();
  const entry = {
    username: userKey(username),
    requestedAt: new Date(now).toISOString(),
    reversibleUntil: new Date(now + DELETE_REVERSAL_MS).toISOString(),
    lockedAt: null,
    eraseBy: new Date(now + DELETE_ERASE_MS).toISOString(),
    status: "cooling_off",
  };
  await withLock("deletes", async () => {
    const entries = await readJson(DELETES_FILE, []);
    const filtered = entries.filter(
      (item) => item.username !== userKey(username),
    );
    filtered.push(entry);
    await writeJson(DELETES_FILE, filtered);
  });
  return entry;
}
async function updateOnlineUser(username) {
  await withLock("online", async () => {
    let record = await readJson(ONLINE_USERS_FILE, {
      date: utcDay(),
      users: [],
    });
    if (record.date !== utcDay()) record = { date: utcDay(), users: [] };
    const key = userKey(username);
    if (!record.users.includes(key)) record.users.push(key);
    await writeJson(ONLINE_USERS_FILE, record);
    await atomicWrite(ONLINE_FILE, `${record.users.length}\n`);
  });
}
async function ensureOnlineDay() {
  await withLock("online", async () => {
    let record = await readJson(ONLINE_USERS_FILE, {
      date: utcDay(),
      users: [],
    });
    if (record.date !== utcDay()) record = { date: utcDay(), users: [] };
    await writeJson(ONLINE_USERS_FILE, record);
    await atomicWrite(ONLINE_FILE, `${record.users.length}\n`);
  });
}
async function activeUserCount() {
  const raw = Number.parseInt(await fsp.readFile(USERS_FILE, "utf8"), 10) || 0;
  const deletions = await readJson(DELETES_FILE, []);
  const locked = deletions.filter(
    (item) =>
      item.status === "pending_erasure" ||
      Date.now() >= Date.parse(item.reversibleUntil),
  ).length;
  return Math.max(0, raw - locked);
}
async function physicalAccountCount() {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  return entries.filter(
    (entry) =>
      entry.isDirectory() &&
      USERNAME_RE.test(entry.name) &&
      fs.existsSync(path.join(DATA_DIR, entry.name, "metadata.json")),
  ).length;
}
async function accountEmailExists(email) {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    const metadata = await readJson(
      path.join(DATA_DIR, entry.name, "metadata.json"),
      null,
    );
    if (metadata?.email?.toLowerCase() === email.toLowerCase()) return true;
  }
  return false;
}
async function noteSummary(username, reference) {
  const note = await readJson(noteFile(username, reference.id), null);
  if (!note) return null;
  let content = "";
  try {
    content = decryptContent(note.content, username, note.id, note.encryption);
  } catch {
    content = "";
  }
  const bytes = (await fsp.stat(noteFile(username, note.id))).size;
  return {
    id: note.id,
    name: note.name,
    encryption: note.encryption,
    updatedAt: note.updatedAt,
    characters: characterCount(content),
    bytes,
    shared: Boolean(note.shareToken),
  };
}
async function accountPayload(username) {
  const metadata = await loadMetadata(username);
  if (!metadata) return null;
  const summaries = (
    await Promise.all(metadata.notes.map((ref) => noteSummary(username, ref)))
  ).filter(Boolean);
  const usedBytes = await directorySize(userDir(username));
  return {
    username: metadata.username,
    email: metadata.email,
    displayName: metadata.displayName || metadata.username,
    createdAt: metadata.createdAt,
    settings: metadata.settings,
    noteCount: summaries.length,
    usedBytes,
    maxBytes: MAX_ACCOUNT_BYTES,
    maxNotes: MAX_NOTES,
    notes: summaries,
  };
}

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    frameguard: false,
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        scriptSrc: [
          "'self'",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.zone.id",
        ],
        styleSrc: [
          "'self'",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.zone.id",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
        ],
        connectSrc: [
          "'self'",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.zone.id",
        ],
        frameSrc: [
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.zone.id",
        ],
        frameAncestors: [
          "'self'",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
        ],
        formAction: [
          "'self'",
          "https://astranote.zone.id",
          "https://astranote.zeabur.app",
        ],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  res.setHeader(
    "Cache-Control",
    req.path.startsWith("/api/") ? "no-store" : "no-cache",
  );
  next();
});
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 600,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: rateLimitHandler,
  }),
);
app.use(express.json({ limit: "300kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use((req, res, next) => {
  const origin = req.get("origin");
  const local =
    process.env.NODE_ENV !== "production" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
  if (origin && (ALLOWED_ORIGINS.has(origin) || local)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.append("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 360,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const loginIpLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const loginUsernameLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const username = normalizeText(req.body?.username, 24);
    return username && USERNAME_RE.test(username)
      ? `username:${userKey(username)}`
      : `ip:${ipKeyGenerator(req.ip)}`;
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const registrationLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
function accountRateKey(req) {
  const username = req.auth?.session?.username;
  return username
    ? `account:${userKey(username)}`
    : `ip:${ipKeyGenerator(req.ip)}`;
}
function accountLimiter(limit) {
  return rateLimit({
    windowMs: 60_000,
    limit,
    keyGenerator: accountRateKey,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: rateLimitHandler,
  });
}
function rateLimitHandler(req, res) {
  return jsonError(
    res,
    429,
    "rate_limited",
    "Too many requests. Please wait before trying again.",
  );
}
const accountMutationLimiter = accountLimiter(120);
const noteSaveLimiter = accountLimiter(40);
const noteLifecycleLimiter = accountLimiter(20);
const shareMutationLimiter = accountLimiter(30);
const sharedReadLimiter = rateLimit({
  windowMs: 60_000,
  limit: 240,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
app.use("/api", apiLimiter);
app.use((req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  const origin = req.get("origin");
  const local =
    process.env.NODE_ENV !== "production" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
  if (!origin || ALLOWED_ORIGINS.has(origin) || local) return next();
  return jsonError(
    res,
    403,
    "origin_rejected",
    "Request origin is not allowed.",
  );
});

app.get("/api/health", (req, res) => res.json({ ok: true, time: utcNow() }));
app.get("/api/stats", async (req, res, next) => {
  try {
    await ensureOnlineDay();
    const record = await readJson(ONLINE_USERS_FILE, {
      date: utcDay(),
      users: [],
    });
    res.json({
      onlineToday: record.users.length,
      totalUsers: await activeUserCount(),
    });
  } catch (error) {
    next(error);
  }
});
app.get("/api/session", async (req, res) => {
  const token = parseCookies(req.headers.cookie).astranote_session;
  if (!token) return res.json({ authenticated: false });
  const session = (await readSessions())[sha256(token)];
  if (!session || Date.now() >= Date.parse(session.expiresAt))
    return res.json({ authenticated: false });
  const deletion = await findDeletion(session.username);
  res.json({
    authenticated: true,
    username: session.username,
    csrf: session.csrf,
    deletion,
  });
});

app.post(
  "/api/register",
  registrationLimiter,
  verifyCaptcha,
  async (req, res, next) => {
    const username = normalizeText(req.body.username, 24);
    const email = normalizeText(req.body.email, 254).toLowerCase();
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    if (!USERNAME_RE.test(username))
      return jsonError(
        res,
        400,
        "invalid_username",
        "Username must be 3–24 letters, numbers, or underscores.",
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return jsonError(
        res,
        400,
        "invalid_email",
        "Enter a valid email address.",
      );
    if (password.length < 10 || password.length > 256)
      return jsonError(
        res,
        400,
        "weak_password",
        "Password must contain 10–256 characters.",
      );
    if (
      COMMON_PASSWORDS.has(password.toLowerCase()) ||
      password.toLowerCase().includes(username.toLowerCase())
    )
      return jsonError(
        res,
        400,
        "weak_password",
        "Choose a less common password that does not contain your username.",
      );
    if (String(req.body.passwordConfirmation) !== password)
      return jsonError(
        res,
        400,
        "password_mismatch",
        "Passwords do not match.",
      );
    if (req.body.acceptTerms !== true || req.body.legalCapacity !== true)
      return jsonError(
        res,
        400,
        "agreement_required",
        "You must accept the agreements and confirm legal capacity or guardian permission.",
      );

    try {
      await withLock("registration", async () => {
        if ((await physicalAccountCount()) >= MAX_ACCOUNTS) {
          const error = new Error("capacity");
          error.status = 503;
          throw error;
        }
        if (
          (await exists(userDir(username))) ||
          (await accountEmailExists(email))
        ) {
          const error = new Error("duplicate");
          error.status = 409;
          throw error;
        }
        await cancelDeletion(username);
        const createdAt = utcNow();
        await fsp.mkdir(notesDir(username), { recursive: true });
        const metadata = {
          username,
          email,
          displayName: username,
          passwordHash: await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,
          }),
          createdAt,
          registrationIp: requestIp(req),
          lastLoginAt: createdAt,
          lastLoginIp: requestIp(req),
          termsVersion: TERMS_VERSION,
          termsAcceptedAt: createdAt,
          settings: {
            language: ["en", "zh-Hant"].includes(req.body.language)
              ? req.body.language
              : "en",
            theme: "dark",
          },
          notes: [],
        };
        await saveMetadata(username, metadata);
        const total =
          (Number.parseInt(await fsp.readFile(USERS_FILE, "utf8"), 10) || 0) +
          1;
        await atomicWrite(USERS_FILE, `${total}\n`);
      });
      const session = await createSession(username, req, res);
      await updateOnlineUser(username);
      res
        .status(201)
        .json({ ok: true, csrf: session.csrf, redirect: "/dashboard" });
    } catch (error) {
      if (error.message === "duplicate")
        return jsonError(
          res,
          409,
          "account_unavailable",
          "Username or email is already in use.",
        );
      if (error.message === "capacity")
        return jsonError(
          res,
          503,
          "registration_unavailable",
          "New accounts are temporarily unavailable.",
        );
      next(error);
    }
  },
);

app.post(
  "/api/login",
  loginIpLimiter,
  loginUsernameLimiter,
  verifyCaptcha,
  async (req, res, next) => {
    const username = normalizeText(req.body.username, 24);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    try {
      const metadata = USERNAME_RE.test(username)
        ? await loadMetadata(username)
        : null;
      const valid =
        metadata &&
        (await argon2
          .verify(metadata.passwordHash, password)
          .catch(() => false));
      if (!valid)
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      const deletion = await findDeletion(username);
      if (deletion) {
        if (deletion.status === "cooling_off") {
          return res.status(409).json({
            error: "deletion_pending",
            message: "This account is pending deletion.",
            reversibleUntil: deletion.reversibleUntil,
          });
        }
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      }
      metadata.lastLoginAt = utcNow();
      metadata.lastLoginIp = requestIp(req);
      metadata.settings ||= { language: "en", theme: "dark" };
      if (["en", "zh-Hant"].includes(req.body.language))
        metadata.settings.language = req.body.language;
      await saveMetadata(username, metadata);
      const session = await createSession(username, req, res);
      await updateOnlineUser(username);
      res.json({ ok: true, csrf: session.csrf, redirect: "/dashboard" });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/deletion/cancel",
  loginIpLimiter,
  loginUsernameLimiter,
  verifyCaptcha,
  async (req, res, next) => {
    const username = normalizeText(req.body.username, 24);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    try {
      const metadata = await loadMetadata(username);
      const deletion = await findDeletion(username);
      const valid =
        metadata &&
        deletion?.status === "cooling_off" &&
        (await argon2
          .verify(metadata.passwordHash, password)
          .catch(() => false));
      if (!valid)
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      await cancelDeletion(username);
      if (["en", "zh-Hant"].includes(req.body.language)) {
        metadata.settings ||= { language: "en", theme: "dark" };
        metadata.settings.language = req.body.language;
        await saveMetadata(username, metadata);
      }
      const session = await createSession(username, req, res);
      await updateOnlineUser(username);
      res.json({ ok: true, csrf: session.csrf, redirect: "/dashboard" });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/logout",
  requireAuth,
  accountMutationLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      await destroySessionToken(req.auth.token);
      res.clearCookie("astranote_session", { path: "/" });
      res.json({ ok: true, redirect: "/" });
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/account", requireAuth, async (req, res, next) => {
  try {
    res.json(await accountPayload(req.auth.session.username));
  } catch (error) {
    next(error);
  }
});
app.patch(
  "/api/settings",
  requireAuth,
  accountMutationLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (["en", "zh-Hant"].includes(req.body.language))
          metadata.settings.language = req.body.language;
        if (["dark", "light"].includes(req.body.theme))
          metadata.settings.theme = req.body.theme;
        if (typeof req.body.displayName === "string") {
          const displayName = normalizeText(
            req.body.displayName,
            MAX_DISPLAY_NAME,
          );
          if (!displayName)
            throw Object.assign(new Error("Display name is required."), {
              status: 400,
            });
          metadata.displayName = displayName;
        }
        await saveMetadata(username, metadata);
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/notes/:id", requireAuth, async (req, res, next) => {
  if (!/^[a-f0-9]{24}$/.test(req.params.id))
    return jsonError(res, 404, "not_found", "Note not found.");
  try {
    const username = req.auth.session.username;
    const metadata = await loadMetadata(username);
    if (!metadata.notes.some((ref) => ref.id === req.params.id))
      return jsonError(res, 404, "not_found", "Note not found.");
    const note = await readJson(noteFile(username, req.params.id), null);
    if (!note) return jsonError(res, 404, "not_found", "Note not found.");
    const content = decryptContent(
      note.content,
      username,
      note.id,
      note.encryption,
    );
    res.json({
      ...note,
      content,
      shareToken: undefined,
      shared: Boolean(note.shareToken),
      characters: characterCount(content),
      bytes: (await fsp.stat(noteFile(username, note.id))).size,
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/notes",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    const name = normalizeText(req.body.name, MAX_NOTE_NAME);
    const encryption = String(req.body.encryption || "none").toLowerCase();
    if (!name)
      return jsonError(res, 400, "name_required", "Note name is required.");
    if (!ENCRYPTION_TYPES.has(encryption))
      return jsonError(
        res,
        400,
        "invalid_encryption",
        "Encryption option is invalid.",
      );
    try {
      const username = req.auth.session.username;
      const result = await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (metadata.notes.length >= MAX_NOTES)
          throw Object.assign(
            new Error("You have reached the 24-note limit."),
            { status: 409 },
          );
        const id = crypto.randomBytes(12).toString("hex");
        const note = {
          id,
          name,
          encryption,
          createdAt: utcNow(),
          updatedAt: utcNow(),
          content: encryptContent("", username, id, encryption),
          shareToken: null,
        };
        await writeJson(noteFile(username, id), note);
        metadata.notes.unshift({ id, path: `notes/${id}.json` });
        await saveMetadata(username, metadata);
        if ((await directorySize(userDir(username))) > MAX_ACCOUNT_BYTES) {
          metadata.notes = metadata.notes.filter((ref) => ref.id !== id);
          await saveMetadata(username, metadata);
          await fsp.unlink(noteFile(username, id));
          throw Object.assign(
            new Error("This note would exceed your 256 KiB account limit."),
            { status: 413 },
          );
        }
        return id;
      });
      res
        .status(201)
        .json({ ok: true, id: result, redirect: `/notes/${result}/edit` });
    } catch (error) {
      next(error);
    }
  },
);

app.put(
  "/api/notes/:id",
  requireAuth,
  noteSaveLimiter,
  requireCsrf,
  async (req, res, next) => {
    const name = normalizeText(req.body.name, MAX_NOTE_NAME);
    const content =
      typeof req.body.content === "string"
        ? req.body.content.normalize("NFC")
        : "";
    if (!name)
      return jsonError(res, 400, "name_required", "Note name is required.");
    if (Buffer.byteLength(content, "utf8") > MAX_ACCOUNT_BYTES)
      return jsonError(res, 413, "content_too_large", "Note is too large.");
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (!metadata.notes.some((ref) => ref.id === req.params.id))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const file = noteFile(username, req.params.id);
        const note = await readJson(file, null);
        if (!note)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const original = await fsp.readFile(file, "utf8");
        note.name = name;
        note.updatedAt = utcNow();
        note.content = encryptContent(
          content,
          username,
          note.id,
          note.encryption,
        );
        await writeJson(file, note);
        if ((await directorySize(userDir(username))) > MAX_ACCOUNT_BYTES) {
          await atomicWrite(file, original);
          throw Object.assign(
            new Error("Saving would exceed your 256 KiB account limit."),
            { status: 413 },
          );
        }
      });
      res.json({ ok: true, redirect: `/notes/${req.params.id}` });
    } catch (error) {
      next(error);
    }
  },
);

app.delete(
  "/api/notes/:id",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const before = metadata.notes.length;
        metadata.notes = metadata.notes.filter(
          (ref) => ref.id !== req.params.id,
        );
        if (metadata.notes.length === before)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const note = await readJson(noteFile(username, req.params.id), null);
        if (note?.shareToken) {
          await updateShares((shares) => {
            delete shares[sha256(note.shareToken)];
          });
        }
        await saveMetadata(username, metadata);
        await fsp.unlink(noteFile(username, req.params.id)).catch(() => {});
      });
      res.json({ ok: true, redirect: "/notes" });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/notes/:id/share",
  requireAuth,
  shareMutationLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      let token = null;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (!metadata.notes.some((ref) => ref.id === req.params.id))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const note = await readJson(noteFile(username, req.params.id), null);
        if (req.body.enabled === true)
          note.shareToken =
            note.shareToken || crypto.randomBytes(32).toString("base64url");
        else note.shareToken = null;
        note.updatedAt = utcNow();
        token = note.shareToken;
        await writeJson(noteFile(username, note.id), note);
        await updateShares((shares) => {
          for (const [key, target] of Object.entries(shares))
            if (target.username === username && target.id === note.id)
              delete shares[key];
          if (token) shares[sha256(token)] = { username, id: note.id };
        });
      });
      res.json({
        ok: true,
        shared: Boolean(token),
        url: token ? `/shared/${token}` : null,
      });
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/shared/:token", sharedReadLimiter, async (req, res, next) => {
  if (!/^[A-Za-z0-9_-]{43}$/.test(req.params.token))
    return jsonError(res, 404, "not_found", "Shared note not found.");
  try {
    const target = (await readJson(SHARES_FILE, {}))[sha256(req.params.token)];
    if (target && !(await findDeletion(target.username))) {
      const metadata = await loadMetadata(target.username);
      const note = await readJson(noteFile(target.username, target.id), null);
      if (
        metadata &&
        note?.shareToken &&
        safeEqual(note.shareToken, req.params.token)
      ) {
        const content = decryptContent(
          note.content,
          target.username,
          note.id,
          note.encryption,
        );
        res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
        return res.json({
          name: note.name,
          content,
          encryption: note.encryption,
          updatedAt: note.updatedAt,
          author: metadata.displayName || metadata.username,
          email: maskEmail(metadata.email),
          characters: characterCount(content),
        });
      }
    }
    return jsonError(res, 404, "not_found", "Shared note not found.");
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/account/delete",
  requireAuth,
  accountMutationLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    const username = req.auth.session.username;
    if (
      !safeEqual(
        normalizeText(req.body.username, 24).toLowerCase(),
        username.toLowerCase(),
      )
    ) {
      return jsonError(
        res,
        400,
        "username_mismatch",
        "Username confirmation does not match.",
      );
    }
    try {
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        for (const ref of metadata.notes) {
          const note = await readJson(noteFile(username, ref.id), null);
          if (note?.shareToken) {
            await updateShares((shares) => {
              delete shares[sha256(note.shareToken)];
            });
            note.shareToken = null;
            await writeJson(noteFile(username, ref.id), note);
          }
        }
        await markDeletion(username);
      });
      await destroyUserSessions(username);
      res.clearCookie("astranote_session", { path: "/" });
      res.json({
        ok: true,
        reversibleUntil: new Date(
          Date.now() + DELETE_REVERSAL_MS,
        ).toISOString(),
        redirect: "/",
      });
    } catch (error) {
      next(error);
    }
  },
);

app.use(
  "/asset",
  express.static(ASSET_DIR, {
    immutable: true,
    maxAge: "7d",
    dotfiles: "deny",
  }),
);
app.use(
  "/vendor/fontawesome",
  express.static(
    path.join(ROOT, "node_modules", "@fortawesome", "fontawesome-free"),
    { immutable: true, maxAge: "30d", dotfiles: "deny" },
  ),
);
app.use(express.static(PUBLIC_DIR, { extensions: false, dotfiles: "deny" }));

const pages = {
  "/": "index.html",
  "/login": "login.html",
  "/register": "register.html",
  "/dashboard": "dashboard.html",
  "/notes": "notes.html",
  "/notes/new": "new-note.html",
  "/settings": "settings.html",
  "/terms": "terms.html",
  "/privacy": "privacy.html",
};
for (const [route, file] of Object.entries(pages))
  app.get(route, (req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
app.get("/notes/:id/edit", (req, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "edit-note.html")),
);
app.get("/notes/:id", (req, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "note.html")),
);
app.get("/shared/:token", (req, res) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.sendFile(path.join(PUBLIC_DIR, "shared.html"));
});
app.use((req, res) =>
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html")),
);

app.use((error, req, res, next) => {
  console.error(`[${utcNow()}]`, error.stack || error.message);
  if (res.headersSent) return next(error);
  const status = Number(error.status) || 500;
  jsonError(
    res,
    status,
    status === 500 ? "server_error" : "request_failed",
    status === 500 ? "Something went wrong. Please try again." : error.message,
  );
});

async function start() {
  await ensureData();
  app.listen(PORT, () => console.log(`AstraNote listening on port ${PORT}`));
}

if (require.main === module)
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {
  app,
  start,
  ensureData,
  constants: { DATA_DIR, MAX_ACCOUNT_BYTES, MAX_ACCOUNTS, MAX_NOTES },
  testables: { encryptContent, decryptContent, maskEmail, characterCount },
};
