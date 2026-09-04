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
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SECRET_FILE = path.join(DATA_DIR, ".server-secret");

const MAX_ACCOUNTS = 75_000;
const MAX_NOTES = 20;
const MAX_ACCOUNT_BYTES = 128 * 1000;
const MAX_NOTE_BYTES = 1024 * 1000;
const MAX_NOTE_NAME = 80;
const MAX_DISPLAY_NAME = 40;
const SESSION_INITIAL_MS = 14 * 864e5;
const SESSION_EXTENSION_MS = 2 * 864e5;
const SESSION_MAX_MS = 28 * 864e5;
const DELETE_REVERSAL_MS = 7 * 864e5;
const DELETE_ERASE_MS = 62 * 864e5;
const TERMS_VERSION = "2026-09-04";
const ADMIN_EMAIL = "neuralnexuslab@hotmail.com";
const SUPPORT_EMAIL = "astranote@nxlabtw.com";
const PLAN_MONTH_MS = 30 * 864e5;
const PLAN_LOCK_DELETE_MS = 30 * 864e5;
const SATORA_BASE_URL = "https://satora.nxlabtw.com";
const SATORA_RETURN_URL =
  "https://astranote.nxlabtw.com/plans/return";
const PLAN_DEFINITIONS = Object.freeze({
  free: { maxBytes: 128 * 1000, maxNotes: 20, monthlySats: 0 },
  plus: { maxBytes: 256 * 1000, maxNotes: 50, monthlySats: 2500 },
  pro: { maxBytes: 512 * 1000, maxNotes: Infinity, monthlySats: 6000 },
  admin: { maxBytes: Infinity, maxNotes: Infinity, monthlySats: 0 },
});
const CAPTCHA_VERIFY_URL = "https://nexacaptcha.nxlabtw.com/api/siteverify";
const LEGACY_SCHYBRID_MODE = "astra-confidential-schybrid-v1";
const LEGACY_CONFIDENTIAL_MODE = "astra-confidential-v2";
const ASTRA_SECRET_MODE = "astra-secret-v1";
const CONFIDENTIAL_MODE = "astra-confidential-v3";
const LEGACY_AES_MODES = new Set(["aes-128-gcm", "aes-256-gcm"]);
const CURRENT_AES_MODES = new Set([
  "aes-128-gcm-new",
  "aes-256-gcm-new",
]);
const CLIENT_ENCRYPTED_MODES = new Set([
  LEGACY_SCHYBRID_MODE,
  LEGACY_CONFIDENTIAL_MODE,
  ASTRA_SECRET_MODE,
  CONFIDENTIAL_MODE,
]);
const ALLOWED_ORIGINS = new Set([
  "https://astranote.nxlabtw.com",
  "https://astranote.zeabur.app",
]);
const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/;
const CREATABLE_ENCRYPTION_TYPES = new Set([
  "none",
  ...CURRENT_AES_MODES,
  ASTRA_SECRET_MODE,
  CONFIDENTIAL_MODE,
]);
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
let vaultSecret;
let confidentialSecret;

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
function normalizeLanguage(value) {
  const language = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
  if (language === "zh" || language.startsWith("zh-")) return "zh-Hant";
  if (language === "en" || language.startsWith("en-")) return "en";
  if (language === "ja" || language.startsWith("ja-")) return "ja";
  return null;
}
function requestLanguage(req) {
  const preferences = String(req.get("accept-language") || "")
    .split(",")
    .map((entry, index) => {
      const [language, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.split("=")[1])
        : 1;
      return {
        language,
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter((preference) => preference.quality > 0)
    .sort(
      (left, right) =>
        right.quality - left.quality || left.index - right.index,
    );
  for (const preference of preferences) {
    const language = normalizeLanguage(preference.language);
    if (language) return language;
  }
  return "en";
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

function isAdmin(metadata) {
  return metadata?.email?.toLowerCase() === ADMIN_EMAIL;
}

function normalizeEntitlements(metadata, now = Date.now()) {
  metadata.entitlements ||= {};
  const entitlements = metadata.entitlements;
  entitlements.plusMs = Math.max(0, Number(entitlements.plusMs) || 0);
  entitlements.proMs = Math.max(0, Number(entitlements.proMs) || 0);
  const previous = Number.isFinite(Date.parse(entitlements.updatedAt))
    ? Date.parse(entitlements.updatedAt)
    : now;
  let elapsed = Math.max(0, now - previous);
  if (!isAdmin(metadata) && elapsed > 0) {
    const proUsed = Math.min(entitlements.proMs, elapsed);
    entitlements.proMs -= proUsed;
    elapsed -= proUsed;
    const plusUsed = Math.min(entitlements.plusMs, elapsed);
    entitlements.plusMs -= plusUsed;
  }
  entitlements.updatedAt = new Date(now).toISOString();
  return entitlements;
}

function planForMetadata(metadata) {
  if (isAdmin(metadata)) return "admin";
  if ((metadata.entitlements?.proMs || 0) > 0) return "pro";
  if ((metadata.entitlements?.plusMs || 0) > 0) return "plus";
  return "free";
}

function planPayload(metadata, now = Date.now()) {
  const plan = planForMetadata(metadata);
  const definition = PLAN_DEFINITIONS[plan];
  const plusMs = Math.max(0, metadata.entitlements?.plusMs || 0);
  const proMs = Math.max(0, metadata.entitlements?.proMs || 0);
  const activeMs = plan === "pro" ? proMs : plan === "plus" ? plusMs : null;
  return {
    type: plan,
    maxBytes: Number.isFinite(definition.maxBytes) ? definition.maxBytes : null,
    maxNotes: Number.isFinite(definition.maxNotes) ? definition.maxNotes : null,
    plusDays: Math.ceil(plusMs / 864e5),
    proDays: Math.ceil(proMs / 864e5),
    activeEndsAt:
      activeMs === null ? null : new Date(now + activeMs).toISOString(),
    canCreateConfidential: plan === "plus" || plan === "pro" || plan === "admin",
  };
}

async function noteFileDetails(username, reference) {
  const file = noteFile(username, reference.id);
  const [note, stat] = await Promise.all([
    readJson(file, null),
    fsp.stat(file).catch(() => null),
  ]);
  return note && stat ? { reference, note, bytes: stat.size } : null;
}

async function requiredLockedNoteIds(username, metadata, plan) {
  const definition = PLAN_DEFINITIONS[plan];
  if (!Number.isFinite(definition.maxBytes) && !Number.isFinite(definition.maxNotes))
    return new Set();
  const details = (
    await Promise.all(metadata.notes.map((reference) => noteFileDetails(username, reference)))
  ).filter(Boolean);
  let remainingBytes = await directorySize(userDir(username));
  let remainingCount = details.length;
  const locked = new Set();
  details.sort(
    (left, right) =>
      right.bytes - left.bytes ||
      Date.parse(left.note.updatedAt || 0) - Date.parse(right.note.updatedAt || 0) ||
      left.note.id.localeCompare(right.note.id),
  );
  for (const detail of details) {
    if (
      remainingBytes <= definition.maxBytes &&
      remainingCount <= definition.maxNotes
    )
      break;
    locked.add(detail.note.id);
    remainingBytes -= detail.bytes;
    remainingCount -= 1;
  }
  return locked;
}

async function removeNoteFiles(username, metadata, ids) {
  if (!ids.size) return false;
  const removedNotes = [];
  for (const reference of metadata.notes) {
    if (!ids.has(reference.id)) continue;
    const note = await readJson(noteFile(username, reference.id), null);
    if (note) removedNotes.push(note);
    await fsp.unlink(noteFile(username, reference.id)).catch(() => {});
  }
  metadata.notes = metadata.notes.filter((reference) => !ids.has(reference.id));
  if (removedNotes.some((note) => note.shareToken)) {
    await updateShares((shares) => {
      for (const [key, target] of Object.entries(shares))
        if (target.username === userKey(username) && ids.has(target.id)) delete shares[key];
    });
  }
  return true;
}

async function refreshPlanState(username, metadata, now = Date.now()) {
  normalizeEntitlements(metadata, now);
  const plan = planForMetadata(metadata);
  let required = await requiredLockedNoteIds(username, metadata, plan);
  const stamp = new Date(now).toISOString();
  for (const reference of metadata.notes) {
    if (required.has(reference.id)) {
      reference.planLockedAt ||= stamp;
      reference.scheduledDeletionAt ||= new Date(
        Date.parse(reference.planLockedAt) + PLAN_LOCK_DELETE_MS,
      ).toISOString();
    } else {
      delete reference.planLockedAt;
      delete reference.scheduledDeletionAt;
    }
  }
  const expired = new Set(
    metadata.notes
      .filter(
        (reference) =>
          required.has(reference.id) &&
          now >= Date.parse(reference.scheduledDeletionAt),
      )
      .map((reference) => reference.id),
  );
  if (await removeNoteFiles(username, metadata, expired)) {
    required = await requiredLockedNoteIds(username, metadata, plan);
    for (const reference of metadata.notes) {
      if (!required.has(reference.id)) {
        delete reference.planLockedAt;
        delete reference.scheduledDeletionAt;
      }
    }
  }
  return { plan, lockedIds: required, payload: planPayload(metadata, now) };
}

function lockedReference(metadata, noteId) {
  const reference = metadata.notes.find((item) => item.id === noteId);
  return reference?.planLockedAt ? reference : null;
}

async function lockedNotePayload(username, reference) {
  const detail = await noteFileDetails(username, reference);
  if (!detail) return null;
  return {
    id: detail.note.id,
    name: normalizeText(detail.note.name, MAX_NOTE_NAME) || "Encrypted note",
    encryption: detail.note.encryption,
    updatedAt: detail.note.updatedAt,
    bytes: detail.bytes,
    locked: true,
    lockedAt: reference.planLockedAt,
    scheduledDeletionAt: reference.scheduledDeletionAt,
  };
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
    [ORDERS_FILE, "[]\n"],
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
  vaultSecret =
    typeof process.env.ASTRANOTE_VAULT_SECRET === "string" &&
    process.env.ASTRANOTE_VAULT_SECRET.length >= 64
      ? process.env.ASTRANOTE_VAULT_SECRET
      : null;
  confidentialSecret =
    typeof process.env.ASTRA_CONFIDENTIAL_KEY === "string" &&
    process.env.ASTRA_CONFIDENTIAL_KEY.length >= 64
      ? process.env.ASTRA_CONFIDENTIAL_KEY
      : null;
  await migrateLegacyEncryptedNotes();
}

function aesBits(mode) {
  return mode.startsWith("aes-128-gcm") ? 128 : 256;
}
function isClientEncryptedMode(mode) {
  return CLIENT_ENCRYPTED_MODES.has(mode);
}
function encryptionSecret(mode) {
  return CURRENT_AES_MODES.has(mode) ? confidentialSecret : appSecret;
}
function deriveKey(username, noteId, mode) {
  const bits = aesBits(mode);
  const secret = encryptionSecret(mode);
  if (!secret) throw new Error("The encryption key is not configured.");
  const context = CURRENT_AES_MODES.has(mode)
    ? `AstraNote:server-aes:v2:${noteId}:${bits}`
    : `AstraNote:${noteId}:${bits}`;
  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(secret),
      Buffer.from(userKey(username)),
      Buffer.from(context),
      bits / 8,
    ),
  );
}
function encryptContent(content, username, id, mode) {
  if (mode === "none") return content;
  const bits = aesBits(mode);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    `aes-${bits}-gcm`,
    deriveKey(username, id, mode),
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
  const bits = aesBits(mode);
  if (
    !stored ||
    Buffer.from(stored.iv || "", "base64").length !== 12 ||
    Buffer.from(stored.tag || "", "base64").length !== 16
  )
    throw new Error("Encrypted note data is invalid.");
  const decipher = crypto.createDecipheriv(
    `aes-${bits}-gcm`,
    deriveKey(username, id, mode),
    Buffer.from(stored.iv, "base64"),
    { authTagLength: 16 },
  );
  decipher.setAuthTag(Buffer.from(stored.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(stored.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

function readServerNotePayload(note, username) {
  if (isClientEncryptedMode(note.encryption)) return null;
  if (note.encryption === "none") {
    return {
      name: normalizeText(note.name, MAX_NOTE_NAME),
      content: typeof note.content === "string" ? note.content : "",
    };
  }
  const decrypted = decryptContent(
    note.content,
    username,
    note.id,
    note.encryption,
  );
  if (note.payloadVersion === 2) {
    const payload = JSON.parse(decrypted);
    return {
      name: normalizeText(payload.name, MAX_NOTE_NAME),
      content:
        typeof payload.content === "string"
          ? payload.content.normalize("NFC")
          : "",
    };
  }
  return {
    name: normalizeText(note.name, MAX_NOTE_NAME),
    content: decrypted,
  };
}

function writeServerNotePayload(note, username, name, content) {
  if (note.encryption === "none") {
    note.name = name;
    note.content = content;
    delete note.payloadVersion;
    return;
  }
  note.name = name;
  note.content = encryptContent(content, username, note.id, note.encryption);
  note.payloadVersion = 3;
}

async function migrateLegacyEncryptedNotes() {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    const metadata = await loadMetadata(entry.name);
    if (!metadata?.notes?.length) continue;
    for (const reference of metadata.notes) {
      const file = noteFile(entry.name, reference.id);
      const note = await readJson(file, null);
      if (
        !note ||
        !LEGACY_AES_MODES.has(note.encryption) ||
        note.payloadVersion !== 2
      )
        continue;
      try {
        const payload = readServerNotePayload(note, entry.name);
        writeServerNotePayload(
          note,
          entry.name,
          payload.name || "Encrypted note",
          payload.content,
        );
        await writeJson(file, note);
      } catch (error) {
        console.error(
          `[${utcNow()}] Could not expose the title of encrypted note ${reference.id}:`,
          error.message,
        );
      }
    }
  }
}

function validBase64(value, minimum, maximum) {
  if (
    typeof value !== "string" ||
    value.length > maximum * 2 ||
    value.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
  )
    return false;
  try {
    const bytes = Buffer.from(value, "base64");
    return bytes.length >= minimum && bytes.length <= maximum;
  } catch {
    return false;
  }
}

function validSchybridEnvelope(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      validBase64(value.iv, 12, 12) &&
      validBase64(value.tag, 16, 16) &&
      validBase64(value.ciphertext, 1, MAX_NOTE_BYTES),
  );
}

function deriveVaultFactor(
  metadata,
  noteId,
  clientSalt,
  clientHash,
  mode = LEGACY_SCHYBRID_MODE,
) {
  const secret = mode === LEGACY_SCHYBRID_MODE ? vaultSecret : confidentialSecret;
  if (!secret) return null;
  const contexts = {
    [LEGACY_SCHYBRID_MODE]: "AstraConfidential SCHybrid v1\0",
    [LEGACY_CONFIDENTIAL_MODE]: "AstraConfidential v2\0",
    [ASTRA_SECRET_MODE]: "AstraSecret v1\0",
    [CONFIDENTIAL_MODE]: "AstraConfidential v3\0",
  };
  const context = contexts[mode];
  if (!context) return null;
  return crypto
    .createHmac("sha256", secret)
    .update(context)
    .update(userKey(metadata.username))
    .update("\0")
    .update(metadata.email.toLowerCase())
    .update("\0")
    .update(metadata.passwordHash)
    .update("\0")
    .update(noteId)
    .update("\0")
    .update(clientSalt)
    .update("\0")
    .update(clientHash)
    .digest("base64url");
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
async function readOrders() {
  return readJson(ORDERS_FILE, []);
}
async function writeOrders(orders) {
  await writeJson(ORDERS_FILE, orders);
}
function publicOrder(order) {
  return {
    orderId: order.orderId,
    plan: order.plan,
    months: order.months,
    days: order.months * 30,
    expectedSats: order.expectedSats,
    localStatus: order.localStatus,
    paymentUrl: order.paymentUrl || null,
    satoraPaymentId: order.satoraPaymentId || null,
    txid: order.txid || null,
    createdAt: order.createdAt,
    paidAt: order.paidAt || null,
    fulfilledAt: order.fulfilledAt || null,
  };
}
async function satoraRequest(endpoint, options = {}) {
  const apiKey = process.env.SATORA_API_KEY;
  if (typeof apiKey !== "string" || apiKey.length < 24)
    throw Object.assign(new Error("Payment service is not configured."), {
      status: 503,
      code: "billing_unavailable",
    });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`${SATORA_BASE_URL}${endpoint}`, {
      ...options,
      redirect: "error",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${apiKey}`,
        accept: "application/json",
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
    const length = Number(response.headers.get("content-length") || 0);
    if (length > 16_384) throw new Error("Payment response is too large.");
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success !== true)
      throw Object.assign(new Error("Payment service could not complete the request."), {
        status: [429, 503].includes(response.status) ? response.status : 502,
        code: `satora_${String(data.error || response.status)}`,
      });
    return data;
  } finally {
    clearTimeout(timer);
  }
}
async function cleanupPlanLocks() {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    await withLock(`user:${entry.name}`, async () => {
      const metadata = await loadMetadata(entry.name);
      if (!metadata) return;
      const hasPaidTime =
        (metadata.entitlements?.plusMs || 0) > 0 ||
        (metadata.entitlements?.proMs || 0) > 0;
      const hasPlanLocks = metadata.notes.some((reference) => reference.planLockedAt);
      if (!hasPaidTime && !hasPlanLocks) return;
      await refreshPlanState(entry.name, metadata);
      await saveMetadata(entry.name, metadata);
    }).catch((error) =>
      console.error(`[${utcNow()}] Plan cleanup failed for ${entry.name}:`, error.message),
    );
  }
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
    await updateOnlineUser(session.username);
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
    const today = utcDay();
    let record = await readJson(ONLINE_USERS_FILE, {
      date: today,
      users: [],
    });
    let changed = false;
    if (record.date !== today) {
      record = { date: today, users: [] };
      changed = true;
    }
    const key = userKey(username);
    if (!record.users.includes(key)) {
      record.users.push(key);
      changed = true;
    }
    if (!changed) return;
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
  const bytes = (await fsp.stat(noteFile(username, note.id))).size;
  if (reference.planLockedAt)
    return {
      id: note.id,
      name: normalizeText(note.name, MAX_NOTE_NAME) || "Encrypted note",
      encryption: note.encryption,
      updatedAt: note.updatedAt,
      characters: null,
      bytes,
      shared: false,
      locked: true,
      lockedAt: reference.planLockedAt,
      scheduledDeletionAt: reference.scheduledDeletionAt,
    };
  let payload = null;
  try {
    payload = readServerNotePayload(note, username);
  } catch {
    payload = null;
  }
  return {
    id: note.id,
    name:
      isClientEncryptedMode(note.encryption)
        ? normalizeText(note.name, MAX_NOTE_NAME) || null
        : payload?.name || "Encrypted note",
    encryption: note.encryption,
    updatedAt: note.updatedAt,
    characters: payload ? characterCount(payload.content) : null,
    bytes,
    shared: isClientEncryptedMode(note.encryption)
      ? false
      : Boolean(note.shareToken),
    locked: false,
  };
}
async function accountPayload(username) {
  return withLock(`user:${userKey(username)}`, async () => {
    const metadata = await loadMetadata(username);
    if (!metadata) return null;
    const access = await refreshPlanState(username, metadata);
    await saveMetadata(username, metadata);
    const summaries = (
      await Promise.all(metadata.notes.map((ref) => noteSummary(username, ref)))
    ).filter(Boolean);
    const usedBytes = await directorySize(userDir(username));
    return {
      username: metadata.username,
      email: metadata.email,
      displayName: metadata.displayName || metadata.username,
      createdAt: metadata.createdAt,
      settings: {
        language: ["en", "zh-Hant", "ja"].includes(metadata.settings?.language)
          ? metadata.settings.language
          : null,
        theme: ["dark", "light"].includes(metadata.settings?.theme)
          ? metadata.settings.theme
          : "dark",
      },
      plan: access.payload,
      noteCount: summaries.length,
      unlockedNoteCount: summaries.filter((note) => !note.locked).length,
      lockedNoteCount: summaries.filter((note) => note.locked).length,
      usedBytes,
      maxBytes: access.payload.maxBytes,
      maxNotes: access.payload.maxNotes,
      vaultAvailable: Boolean(confidentialSecret),
      supportEmail: SUPPORT_EMAIL,
      notes: summaries,
    };
  });
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
          "'wasm-unsafe-eval'",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.nxlabtw.com",
        ],
        styleSrc: [
          "'self'",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.nxlabtw.com",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
        ],
        connectSrc: [
          "'self'",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.nxlabtw.com",
        ],
        frameSrc: [
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
          "https://nexacaptcha.nxlabtw.com",
        ],
        frameAncestors: [
          "'self'",
          "https://astranote.nxlabtw.com",
          "https://astranote.zeabur.app",
        ],
        formAction: [
          "'self'",
          "https://astranote.nxlabtw.com",
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
app.use(express.json({ limit: "1400kb", strict: true }));
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
const billingMutationLimiter = accountLimiter(10);
const billingStatusLimiter = accountLimiter(30);
const vaultKeyIpLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 30,
  keyGenerator: (req) => `vault-ip:${ipKeyGenerator(req.ip)}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const vaultKeyNoteLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  keyGenerator: (req) =>
    `vault-note:${userKey(req.auth?.session?.username || "unknown")}:${String(req.body?.noteId || "invalid")}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
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
  const preferredLanguage = requestLanguage(req);
  const token = parseCookies(req.headers.cookie).astranote_session;
  if (!token) return res.json({ authenticated: false, preferredLanguage });
  const session = (await readSessions())[sha256(token)];
  if (!session || Date.now() >= Date.parse(session.expiresAt))
    return res.json({ authenticated: false, preferredLanguage });
  const deletion = await findDeletion(session.username);
  await updateOnlineUser(session.username);
  res.json({
    authenticated: true,
    username: session.username,
    csrf: session.csrf,
    loginAt: session.createdAt,
    deletion,
    preferredLanguage,
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
            language:
              normalizeLanguage(req.body.language) || requestLanguage(req),
            theme: "dark",
          },
          entitlements: {
            plusMs: 0,
            proMs: 0,
            updatedAt: createdAt,
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
      metadata.settings ||= { theme: "dark" };
      if (normalizeLanguage(req.body.language))
        metadata.settings.language = normalizeLanguage(req.body.language);
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
      if (normalizeLanguage(req.body.language)) {
        metadata.settings ||= { theme: "dark" };
        metadata.settings.language = normalizeLanguage(req.body.language);
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
        metadata.settings ||= { theme: "dark" };
        if (["en", "zh-Hant", "ja"].includes(req.body.language))
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

app.get(
  "/api/billing/orders",
  requireAuth,
  billingStatusLimiter,
  async (req, res, next) => {
    try {
      const username = userKey(req.auth.session.username);
      const orders = (await readOrders())
        .filter((order) => order.username === username)
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
        .slice(0, 50)
        .map(publicOrder);
      res.json({ orders, supportEmail: SUPPORT_EMAIL });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/billing/create",
  requireAuth,
  billingMutationLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    const plan = String(req.body.plan || "").toLowerCase();
    const months = Number(req.body.months);
    const checkoutToken = String(req.body.checkoutToken || "").toLowerCase();
    if (
      !["plus", "pro"].includes(plan) ||
      !Number.isInteger(months) ||
      months < 1 ||
      months > 36 ||
      !/^[a-f0-9]{32}$/.test(checkoutToken)
    )
      return jsonError(res, 400, "invalid_purchase", "Choose a valid plan and 1–36 months.");
    try {
      const username = userKey(req.auth.session.username);
      const result = await withLock("orders", async () => {
        const orders = await readOrders();
        let order = orders.find(
          (item) => item.username === username && item.checkoutToken === checkoutToken,
        );
        if (order) {
          if (order.plan !== plan || order.months !== months)
            throw Object.assign(new Error("This checkout attempt cannot be changed."), {
              status: 409,
            });
          if (order.paymentUrl) return publicOrder(order);
        } else {
          const createdAt = utcNow();
          const orderId = newId(16);
          order = {
            orderId,
            username,
            plan,
            months,
            productSnapshot: `AstraNote ${plan === "plus" ? "Plus" : "Pro"} — ${months * 30} days`,
            expectedSats: PLAN_DEFINITIONS[plan].monthlySats * months,
            localStatus: "created",
            checkoutToken,
            idempotencyKey: `astranote:${orderId}`,
            satoraPaymentId: null,
            paymentUrl: null,
            fulfilledAt: null,
            createdAt,
            updatedAt: createdAt,
          };
          orders.push(order);
          await writeOrders(orders);
        }
        const returnUrl = new URL(SATORA_RETURN_URL);
        returnUrl.searchParams.set("order_id", order.orderId);
        try {
          const created = await satoraRequest("/api/create", {
            method: "POST",
            headers: { "idempotency-key": order.idempotencyKey },
            body: JSON.stringify({
              product: {
                en: order.productSnapshot,
                "zh-TW": `AstraNote ${plan === "plus" ? "Plus" : "Pro"} — ${months * 30} 天`,
                ja: `AstraNote ${plan === "plus" ? "Plus" : "Pro"} — ${months * 30}日`,
              },
              price: order.expectedSats,
              return_url: returnUrl.href,
            }),
          });
          const paymentUrl = new URL(String(created.url || ""));
          if (
            !/^[A-Za-z0-9_-]{22}$/.test(String(created.id || "")) ||
            paymentUrl.origin !== new URL(SATORA_BASE_URL).origin ||
            !paymentUrl.pathname.startsWith("/payment/")
          )
            throw Object.assign(new Error("Payment service returned an invalid bill."), {
              status: 502,
            });
          order.satoraPaymentId = created.id;
          order.paymentUrl = paymentUrl.href;
          order.localStatus = ["confirming", "pending"].includes(created.status)
            ? created.status
            : "confirming";
          order.updatedAt = utcNow();
          await writeOrders(orders);
          return publicOrder(order);
        } catch (error) {
          order.lastError = String(error.code || "billing_unavailable").slice(0, 120);
          order.updatedAt = utcNow();
          await writeOrders(orders);
          throw error;
        }
      });
      res.status(201).json({ ok: true, order: result, redirect: result.paymentUrl });
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  "/api/billing/status",
  requireAuth,
  billingStatusLimiter,
  async (req, res, next) => {
    const orderId = String(req.query.order_id || "").toLowerCase();
    const returnedPaymentId = String(req.query.satora_payment_id || "");
    if (!/^[a-f0-9]{32}$/.test(orderId))
      return jsonError(res, 404, "order_not_found", "Order not found.");
    try {
      const username = userKey(req.auth.session.username);
      const initial = (await readOrders()).find(
        (order) => order.orderId === orderId && order.username === username,
      );
      if (!initial)
        return jsonError(res, 404, "order_not_found", "Order not found.");
      if (
        returnedPaymentId &&
        (!/^[A-Za-z0-9_-]{22}$/.test(returnedPaymentId) ||
          !safeEqual(returnedPaymentId, initial.satoraPaymentId || ""))
      )
        return jsonError(
          res,
          409,
          "payment_id_mismatch",
          "The returned payment does not match this order.",
        );
      if (initial.fulfilledAt)
        return res.json({ order: publicOrder(initial), supportEmail: SUPPORT_EMAIL });
      if (!initial.satoraPaymentId)
        return res.json({ order: publicOrder(initial), supportEmail: SUPPORT_EMAIL });
      let status;
      try {
        status = await satoraRequest(
          `/api/status?id=${encodeURIComponent(initial.satoraPaymentId)}`,
        );
      } catch (error) {
        if ([429, 503].includes(error.status))
          return res.status(error.status).json({
            error: "verification_unavailable",
            message: "Payment status is temporarily unavailable. Please try again later.",
            order: publicOrder(initial),
            supportEmail: SUPPORT_EMAIL,
          });
        throw error;
      }
      const result = await withLock("orders", async () => {
        const orders = await readOrders();
        const order = orders.find(
          (item) => item.orderId === orderId && item.username === username,
        );
        if (!order) throw Object.assign(new Error("Order not found."), { status: 404 });
        const validIdentity =
          status.id === order.satoraPaymentId &&
          Number.isSafeInteger(status.price) &&
          status.price === order.expectedSats;
        if (!validIdentity) {
          order.localStatus = "verification_error";
          order.updatedAt = utcNow();
          await writeOrders(orders);
          return order;
        }
        if (["confirming", "pending", "failed", "expired"].includes(status.status)) {
          order.localStatus = status.status;
          order.txid = typeof status.txid === "string" ? status.txid : null;
          order.updatedAt = utcNow();
          await writeOrders(orders);
          return order;
        }
        if (
          status.status === "paid" &&
          Number.isSafeInteger(status.received_sats) &&
          status.received_sats === order.expectedSats
        ) {
          if (!order.fulfilledAt) {
            await withLock(`user:${username}`, async () => {
              const metadata = await loadMetadata(username);
              if (!metadata) throw Object.assign(new Error("Account not found."), { status: 404 });
              const now = Date.now();
              normalizeEntitlements(metadata, now);
              metadata.fulfilledOrders ||= [];
              if (!metadata.fulfilledOrders.includes(order.orderId)) {
                const key = order.plan === "pro" ? "proMs" : "plusMs";
                metadata.entitlements[key] += order.months * PLAN_MONTH_MS;
                metadata.fulfilledOrders.push(order.orderId);
              }
              metadata.entitlements.updatedAt = new Date(now).toISOString();
              await refreshPlanState(username, metadata, now);
              await saveMetadata(username, metadata);
            });
            order.fulfilledAt = utcNow();
          }
          order.localStatus = "paid";
          order.paidAt = status.paid_at || utcNow();
          order.txid = typeof status.txid === "string" ? status.txid : null;
          order.updatedAt = utcNow();
          await writeOrders(orders);
          return order;
        }
        order.localStatus = "verification_error";
        order.updatedAt = utcNow();
        await writeOrders(orders);
        return order;
      });
      res.json({ order: publicOrder(result), supportEmail: SUPPORT_EMAIL });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/vault/key-factor",
  requireAuth,
  vaultKeyIpLimiter,
  vaultKeyNoteLimiter,
  requireCsrf,
  async (req, res, next) => {
    const noteId = String(req.body.noteId || "");
    const clientSalt = String(req.body.clientSalt || "");
    const clientHash = String(req.body.clientHash || "").toLowerCase();
    let mode = String(req.body.encryption || "").toLowerCase();
    if (
      !/^[a-f0-9]{24}$/.test(noteId) ||
      !/^[A-Za-z0-9_-]{43}$/.test(clientSalt) ||
      !/^[a-f0-9]{64}$/.test(clientHash)
    )
      return jsonError(
        res,
        400,
        "invalid_vault_request",
        "Encryption key request is invalid.",
      );
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (!metadata)
          return jsonError(res, 404, "not_found", "Account not found.");
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        const reference = metadata.notes.find((item) => item.id === noteId);
        if (reference) {
          if (access.lockedIds.has(noteId))
            return jsonError(
              res,
              423,
              "note_locked",
              "This note is locked by the current plan limit.",
            );
          const note = await readJson(noteFile(username, noteId), null);
          if (
            !note ||
            !isClientEncryptedMode(note.encryption) ||
            !safeEqual(note.clientSalt, clientSalt)
          )
            return jsonError(res, 404, "not_found", "Note not found.");
          mode = note.encryption;
        } else if (await exists(noteFile(username, noteId))) {
          return jsonError(res, 409, "note_id_unavailable", "Note ID is unavailable.");
        } else if (![ASTRA_SECRET_MODE, CONFIDENTIAL_MODE].includes(mode)) {
          return jsonError(
            res,
            400,
            "invalid_vault_request",
            "Encryption key request is invalid.",
          );
        }
        if (!reference && mode === CONFIDENTIAL_MODE && !access.payload.canCreateConfidential)
          return jsonError(
            res,
            403,
            "plan_required",
            "Plus or Pro is required to create an AstraConfidential note.",
          );
        const available =
          mode === LEGACY_SCHYBRID_MODE
            ? Boolean(vaultSecret)
            : CLIENT_ENCRYPTED_MODES.has(mode) && Boolean(confidentialSecret);
        if (!available)
          return jsonError(
            res,
            503,
            "vault_unavailable",
            "This AstraConfidential encryption version is not configured.",
          );
        const serverFactor = deriveVaultFactor(
          metadata,
          noteId,
          clientSalt,
          clientHash,
          mode,
        );
        res.json({
          serverFactor,
          version:
            mode === CONFIDENTIAL_MODE
              ? 3
              : mode === LEGACY_CONFIDENTIAL_MODE
                ? 2
                : 1,
        });
      });
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
    await withLock(`user:${username}`, async () => {
      const metadata = await loadMetadata(username);
      if (!metadata)
        return jsonError(res, 404, "not_found", "Account not found.");
      const access = await refreshPlanState(username, metadata);
      await saveMetadata(username, metadata);
      if (!metadata.notes.some((ref) => ref.id === req.params.id))
        return jsonError(res, 404, "not_found", "Note not found.");
      if (access.lockedIds.has(req.params.id)) {
        const reference = lockedReference(metadata, req.params.id);
        const locked = await lockedNotePayload(username, reference);
        return res.status(423).json({
          error: "note_locked",
          message: "Upgrade to Plus or Pro to unlock this note.",
          note: locked,
          supportEmail: SUPPORT_EMAIL,
        });
      }
      const note = await readJson(noteFile(username, req.params.id), null);
      if (!note) return jsonError(res, 404, "not_found", "Note not found.");
      if (isClientEncryptedMode(note.encryption)) {
        return res.json({
          id: note.id,
          name: normalizeText(note.name, MAX_NOTE_NAME) || null,
          encryption: note.encryption,
          payloadVersion: note.payloadVersion || 1,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          clientSalt: note.clientSalt,
          encrypted: note.content,
          shared: false,
          shareUrl: null,
          characters: null,
          bytes: (await fsp.stat(noteFile(username, note.id))).size,
        });
      }
      const payload = readServerNotePayload(note, username);
      res.json({
        id: note.id,
        name: payload.name,
        content: payload.content,
        encryption: note.encryption,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        shared: Boolean(note.shareToken),
        shareUrl: note.shareToken ? `/shared/${note.shareToken}` : null,
        characters: characterCount(payload.content),
        bytes: (await fsp.stat(noteFile(username, note.id))).size,
      });
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
    const encryption = String(req.body.encryption || "none").toLowerCase();
    if (!CREATABLE_ENCRYPTION_TYPES.has(encryption))
      return jsonError(
        res,
        400,
        "invalid_encryption",
        "Encryption option is invalid.",
      );
    const clientEncrypted = [ASTRA_SECRET_MODE, CONFIDENTIAL_MODE].includes(encryption);
    const currentAes = CURRENT_AES_MODES.has(encryption);
    const name = normalizeText(req.body.name, MAX_NOTE_NAME);
    if (!name)
      return jsonError(res, 400, "name_required", "Note name is required.");
    const requestedId = String(req.body.id || "");
    const clientSalt = String(req.body.clientSalt || "");
    if (
      clientEncrypted &&
      (!confidentialSecret ||
        !/^[a-f0-9]{24}$/.test(requestedId) ||
        !/^[A-Za-z0-9_-]{43}$/.test(clientSalt) ||
        !validSchybridEnvelope(req.body.encrypted))
    )
      return jsonError(
        res,
        confidentialSecret ? 400 : 503,
        confidentialSecret ? "invalid_encrypted_note" : "vault_unavailable",
        confidentialSecret
          ? "Encrypted note data is invalid."
          : "AstraConfidential is not configured.",
      );
    if (currentAes && !confidentialSecret)
      return jsonError(
        res,
        503,
        "encryption_unavailable",
        "The current AES encryption key is not configured.",
      );
    try {
      const username = req.auth.session.username;
      const result = await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        if (access.lockedIds.size)
          throw Object.assign(
            new Error("Upgrade your plan or remove locked notes before creating a new note."),
            { status: 423 },
          );
        if (encryption === CONFIDENTIAL_MODE && !access.payload.canCreateConfidential)
          throw Object.assign(
            new Error("Plus or Pro is required to create an AstraConfidential note."),
            { status: 403 },
          );
        const maxNotes = access.payload.maxNotes ?? Infinity;
        if (metadata.notes.length >= maxNotes)
          throw Object.assign(
            new Error(`You have reached the ${maxNotes}-note limit.`),
            { status: 409 },
          );
        const id = clientEncrypted
          ? requestedId
          : crypto.randomBytes(12).toString("hex");
        if (
          metadata.notes.some((reference) => reference.id === id) ||
          (await exists(noteFile(username, id)))
        )
          throw Object.assign(new Error("Note ID is unavailable."), {
            status: 409,
          });
        const note = {
          id,
          encryption,
          createdAt: utcNow(),
          updatedAt: utcNow(),
          shareToken: null,
        };
        if (clientEncrypted) {
          note.name = name;
          note.clientSalt = clientSalt;
          note.content = req.body.encrypted;
          note.payloadVersion = 2;
        } else {
          writeServerNotePayload(note, username, name, "");
        }
        await writeJson(noteFile(username, id), note);
        metadata.notes.unshift({ id, path: `notes/${id}.json` });
        await saveMetadata(username, metadata);
        const maxBytes = access.payload.maxBytes ?? Infinity;
        if ((await directorySize(userDir(username))) > maxBytes) {
          metadata.notes = metadata.notes.filter((ref) => ref.id !== id);
          await saveMetadata(username, metadata);
          await fsp.unlink(noteFile(username, id));
          throw Object.assign(
            new Error("This note would exceed your current plan's storage limit."),
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
    if (!/^[a-f0-9]{24}$/.test(req.params.id))
      return jsonError(res, 404, "not_found", "Note not found.");
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        if (!metadata.notes.some((ref) => ref.id === req.params.id))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.lockedIds.has(req.params.id))
          throw Object.assign(
            new Error("Upgrade to Plus or Pro to unlock this note."),
            { status: 423, code: "note_locked" },
          );
        const file = noteFile(username, req.params.id);
        const note = await readJson(file, null);
        if (!note)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const original = await fsp.readFile(file, "utf8");
        const originalBytes = Buffer.byteLength(original, "utf8");
        if (isClientEncryptedMode(note.encryption)) {
          const name = normalizeText(req.body.name, MAX_NOTE_NAME);
          if (!name)
            throw Object.assign(new Error("Note name is required."), {
              status: 400,
            });
          if (!validSchybridEnvelope(req.body.encrypted))
            throw Object.assign(new Error("Encrypted note data is invalid."), {
              status: 400,
            });
          const preserveTimestamp =
            req.body.migrationOnly === true && note.payloadVersion !== 2;
          note.name = name;
          note.content = req.body.encrypted;
          note.payloadVersion = 2;
          note.shareToken = null;
          if (!preserveTimestamp) note.updatedAt = utcNow();
        } else {
          const name = normalizeText(req.body.name, MAX_NOTE_NAME);
          const content =
            typeof req.body.content === "string"
              ? req.body.content.normalize("NFC")
              : "";
          if (!name)
            throw Object.assign(new Error("Note name is required."), {
              status: 400,
            });
          if (Buffer.byteLength(content, "utf8") > MAX_NOTE_BYTES)
            throw Object.assign(new Error("Note is too large."), {
              status: 413,
            });
          writeServerNotePayload(note, username, name, content);
          note.updatedAt = utcNow();
        }
        await writeJson(file, note);
        const maxBytes = access.payload.maxBytes ?? Infinity;
        const savedBytes = (await fsp.stat(file)).size;
        if (
          (await directorySize(userDir(username))) > maxBytes &&
          savedBytes > originalBytes
        ) {
          await atomicWrite(file, original);
          throw Object.assign(
            new Error("Saving would exceed your current plan's storage limit."),
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
        await fsp.unlink(noteFile(username, req.params.id)).catch(() => {});
        await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
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
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        if (!metadata.notes.some((ref) => ref.id === req.params.id))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.lockedIds.has(req.params.id))
          throw Object.assign(
            new Error("Upgrade to Plus or Pro to unlock this note."),
            { status: 423 },
          );
        const note = await readJson(noteFile(username, req.params.id), null);
        if (isClientEncryptedMode(note?.encryption))
          throw Object.assign(
            new Error(
              "Sharing is unavailable for AstraConfidential notes.",
            ),
            { status: 409 },
          );
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
      const sent = await withLock(`user:${target.username}`, async () => {
        const metadata = await loadMetadata(target.username);
        const access = metadata
          ? await refreshPlanState(target.username, metadata)
          : null;
        if (metadata) await saveMetadata(target.username, metadata);
        const note = await readJson(noteFile(target.username, target.id), null);
        if (
          metadata &&
          !access.lockedIds.has(target.id) &&
          !isClientEncryptedMode(note?.encryption) &&
          note?.shareToken &&
          safeEqual(note.shareToken, req.params.token)
        ) {
          const payload = readServerNotePayload(note, target.username);
          res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
          res.json({
            name: payload.name,
            content: payload.content,
            encryption: note.encryption,
            updatedAt: note.updatedAt,
            author: metadata.displayName || metadata.username,
            email: maskEmail(metadata.email),
            characters: characterCount(payload.content),
          });
          return true;
        }
        return false;
      });
      if (sent) return;
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
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
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
      const current = await loadMetadata(username);
      const passwordValid =
        current &&
        (await argon2
          .verify(current.passwordHash, password)
          .catch(() => false));
      if (!passwordValid)
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (!metadata)
          throw Object.assign(new Error("Account not found."), { status: 404 });
        await updateShares((shares) => {
          for (const [key, target] of Object.entries(shares))
            if (target.username === userKey(username)) delete shares[key];
        });
        const target = path.resolve(userDir(username));
        if (path.dirname(target) !== DATA_DIR)
          throw new Error("Unsafe account deletion target.");
        await fsp.rm(target, { recursive: true, force: true });
      });
      await destroyUserSessions(username);
      await cancelDeletion(username);
      await withLock("registration", async () => {
        const count =
          Number.parseInt(await fsp.readFile(USERS_FILE, "utf8"), 10) || 0;
        await atomicWrite(USERS_FILE, `${Math.max(0, count - 1)}\n`);
      });
      await withLock("online", async () => {
        const record = await readJson(ONLINE_USERS_FILE, {
          date: utcDay(),
          users: [],
        });
        record.users = record.users.filter(
          (entry) => entry !== userKey(username),
        );
        await writeJson(ONLINE_USERS_FILE, record);
        await atomicWrite(ONLINE_FILE, `${record.users.length}\n`);
      });
      res.clearCookie("astranote_session", { path: "/" });
      res.json({
        ok: true,
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
app.use(
  "/vendor/hash-wasm",
  express.static(path.join(ROOT, "node_modules", "hash-wasm", "dist"), {
    immutable: true,
    maxAge: "30d",
    dotfiles: "deny",
  }),
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
  "/plans": "plans.html",
  "/plans/return": "plans.html",
};
for (const [route, file] of Object.entries(pages))
  app.get(route, (req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
app.get("/donate", (req, res) => res.redirect(308, "/plans"));
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
    status === 500 ? "server_error" : error.code || "request_failed",
    status === 500 ? "Something went wrong. Please try again." : error.message,
  );
});

async function start() {
  await ensureData();
  const cleanupTimer = setInterval(() => cleanupPlanLocks(), 60 * 60_000);
  cleanupTimer.unref();
  app.listen(PORT, () => {
    console.log(`AstraNote listening on port ${PORT}`);
    cleanupPlanLocks().catch((error) =>
      console.error(`[${utcNow()}] Initial plan cleanup failed:`, error.message),
    );
  });
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
  constants: {
    DATA_DIR,
    MAX_ACCOUNT_BYTES,
    MAX_ACCOUNTS,
    MAX_NOTES,
    SCHYBRID_MODE: LEGACY_SCHYBRID_MODE,
    LEGACY_SCHYBRID_MODE,
    CONFIDENTIAL_MODE,
    LEGACY_CONFIDENTIAL_MODE,
    ASTRA_SECRET_MODE,
    LEGACY_AES_MODES,
    CURRENT_AES_MODES,
    PLAN_DEFINITIONS,
    PLAN_MONTH_MS,
  },
  testables: {
    encryptContent,
    decryptContent,
    readServerNotePayload,
    writeServerNotePayload,
    validSchybridEnvelope,
    deriveVaultFactor,
    isClientEncryptedMode,
    maskEmail,
    characterCount,
    normalizeEntitlements,
    planForMetadata,
    planPayload,
  },
};
