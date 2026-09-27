"use strict";

const express = require("express");
const helmet = require("helmet");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const argon2 = require("argon2");
const crypto = require("node:crypto");
const net = require("node:net");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const {
  OrderStore,
  ORDER_RETENTION_MS,
  MAX_ORDER_HISTORY_PER_ACCOUNT,
} = require("./lib/order-store");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSET_DIR = path.join(ROOT, "asset");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const USERS_FILE = path.join(DATA_DIR, "users.txt");
const ONLINE_FILE = path.join(DATA_DIR, "onlineToday.txt");
const ONLINE_USERS_FILE = path.join(DATA_DIR, "onlineTodayUsers.json");
// Kept only for a one-time compatibility migration from older deployments.
const LEGACY_SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const RETIRED_SNAPSHOT_INDEX_FILE = path.join(DATA_DIR, "drops.json");
const DELETES_FILE = path.join(DATA_DIR, "deletes.json");
const SHARES_FILE = path.join(DATA_DIR, "shares.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SECRET_FILE = path.join(DATA_DIR, ".server-secret");
const EMAIL_LIMITS_FILE = path.join(DATA_DIR, "email-limits.json");
const ADMIN_BROADCAST_AUDIT_FILE = path.join(DATA_DIR, "admin-broadcasts.json");

const MAX_ACCOUNTS = 70_000;
const MAX_NOTES = 20;
const MAX_ACCOUNT_BYTES = 128 * 1000;
const UNVERIFIED_FREE_BYTES = 32 * 1000;
const EMAIL_TOKEN_MS = 10 * 60_000;
const EMAIL_DAILY_LIMIT = 100;
const MAX_NOTE_BYTES = 2 * 1024 * 1000;
const MAX_NOTE_NAME = 80;
const MAX_DISPLAY_NAME = 40;
const SESSION_INITIAL_MS = 14 * 864e5;
const SESSION_EXTENSION_MS = 2 * 864e5;
const SESSION_MAX_MS = 28 * 864e5;
const DELETE_REVERSAL_MS = 7 * 864e5;
const DELETE_ERASE_MS = 62 * 864e5;
const TERMS_VERSION = "2026-09-05";
const TRASH_DAYS = Object.freeze([1, 3, 7, 14, 30]);
const ADMIN_EMAIL = "neuralnexuslab@hotmail.com";
const SUPPORT_EMAIL = "astranote@nxlabtw.com";
const EMAIL_API_URL = "https://api.zeabur.com/api/v1/zsend/emails";
// A valid Argon2id hash used only to equalize unknown-account password checks.
// It is deliberately not a credential and never authorizes a request.
const DUMMY_PASSWORD_HASH = "$argon2id$v=19$m=19456,t=2,p=1$7zph+VOvRFzb/evwnIE+dQ$V+yY2NG0/eSae61Ntl0NVxWGMlem2lmE8pu4N+UaKc0";
const PLAN_MONTH_MS = 30 * 864e5;
const PLAN_LOCK_DELETE_MS = 30 * 864e5;
const AI_WINDOW_MS = 30 * 864e5;
const AI_MAX_NOTE_BYTES = 64 * 1000;
const AI_MAX_PROMPT_CHARS = 1600;
const AI_MAX_OUTPUT_TOKENS = 16_000;
const AI_BUDGETS_MICRO_USD = Object.freeze({
  free: 20_000,
  plus: 100_000,
  pro: 300_000,
  ultra: 900_000,
  beta: Infinity,
  admin: Infinity,
});
const BILLING_MONTH_OPTIONS = Object.freeze([1, 3, 6, 9, 12, 24, 36]);
const ORDER_CREATION_WINDOW_MS = 60 * 60_000;
const MAX_NEW_ORDERS_PER_ACCOUNT_WINDOW = 6;
// Keep the operator's reusable coupon out of public UI and plaintext source.
const REUSABLE_COUPON_DIGEST =
  "cfac7fb4d85dc8c216061ee731a56b9169decda34575fc568f3ff34143d6ade0";
const SATORA_BASE_URL = "https://satora.nxlabtw.com";
const SATORA_RETURN_URL = "https://astranote.nxlabtw.com/plans/return";
const PLAN_DEFINITIONS = Object.freeze({
  free: { maxBytes: 128 * 1000, maxNotes: 20, monthlySats: 0 },
  plus: { maxBytes: 256 * 1000, maxNotes: 50, monthlySats: 2500 },
  pro: { maxBytes: 512 * 1000, maxNotes: Infinity, monthlySats: 6000 },
  ultra: { maxBytes: 1_024_000, maxNotes: Infinity, monthlySats: 12500 },
  beta: { maxBytes: 1_000_000_000, maxNotes: Infinity, monthlySats: 0 },
  admin: { maxBytes: Infinity, maxNotes: Infinity, monthlySats: 0 },
});
const CAPTCHA_VERIFY_URL = "https://nexacaptcha.nxlabtw.com/api/siteverify";
const LEGACY_SCHYBRID_MODE = "astra-confidential-schybrid-v1";
const LEGACY_CONFIDENTIAL_MODE = "astra-confidential-v2";
const ASTRA_SECRET_MODE = "astra-secret-v1";
const CONFIDENTIAL_MODE = "astra-confidential-v3";
const ZERO_MODE = "astra-zero-v1";
const LEGACY_AES_MODES = new Set(["aes-128-gcm", "aes-256-gcm"]);
const CURRENT_AES_MODES = new Set(["aes-128-gcm-new", "aes-256-gcm-new"]);
const CLIENT_ENCRYPTED_MODES = new Set([
  LEGACY_SCHYBRID_MODE,
  LEGACY_CONFIDENTIAL_MODE,
  ASTRA_SECRET_MODE,
  CONFIDENTIAL_MODE,
  ZERO_MODE,
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
  ZERO_MODE,
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

let orderStore;
let appSecret;
let vaultSecret;
let confidentialSecret;

function utcNow() {
  return new Date().toISOString();
}
function utcDay() {
  return new Date().toISOString().slice(0, 10);
}
function utcDate(value = Date.now()) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10).replaceAll("-", "/") : "—";
}
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function keyedDigest(purpose, value) {
  if (typeof appSecret !== "string" || appSecret.length < 32)
    throw new Error("The application secret is not initialized.");
  return crypto
    .createHmac("sha256", appSecret)
    .update(`astranote-v1\\0${purpose}\\0`, "utf8")
    .update(String(value), "utf8")
    .digest("hex");
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function userKey(username) {
  return username.toLowerCase();
}
function freeStorageAllowance(metadata) {
  return metadata?.emailQuotaRestricted === true && metadata?.emailVerified !== true
    ? UNVERIFIED_FREE_BYTES
    : MAX_ACCOUNT_BYTES;
}
function tokenDigest(token) { return sha256(`email-token\0${token}`); }
// A six-digit code has only one million possibilities. A keyed verifier makes
// a stolen challenge record useless for offline guessing.
function legacyCodeDigest(code) { return sha256(`email-code\0${code}`); }
function codeDigest(code) { return keyedDigest("email-code", code); }
function codeDigestMatches(storedDigest, code) {
  // Issued codes last only ten minutes. Keep this brief fallback so a deploy
  // never invalidates a code that was sent immediately before it.
  return (
    safeEqual(storedDigest, codeDigest(code)) ||
    safeEqual(storedDigest, legacyCodeDigest(code))
  );
}
function makeEmailToken() { return crypto.randomBytes(32).toString("base64url"); }
function makeEmailCode() { return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0"); }
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
      (left, right) => right.quality - left.quality || left.index - right.index,
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
function sessionsFile(username) {
  return path.join(userDir(username), "sessions.json");
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
function aiBudgetForPlan(plan) {
  return AI_BUDGETS_MICRO_USD[plan] ?? AI_BUDGETS_MICRO_USD.free;
}
function normalizeAiUsage(metadata, plan, now = Date.now()) {
  const current = metadata.aiUsage || {};
  const startedAt = Date.parse(current.startedAt || 0);
  const reset = !Number.isFinite(startedAt) || now - startedAt >= AI_WINDOW_MS;
  if (reset)
    metadata.aiUsage = { startedAt: new Date(now).toISOString(), spentMicrousd: 0 };
  else
    metadata.aiUsage = {
      startedAt: new Date(startedAt).toISOString(),
      spentMicrousd: Math.max(0, Math.floor(Number(current.spentMicrousd) || 0)),
    };
  const budgetMicrousd = aiBudgetForPlan(plan);
  const remainingMicrousd = Number.isFinite(budgetMicrousd)
    ? Math.max(0, budgetMicrousd - metadata.aiUsage.spentMicrousd)
    : Infinity;
  return {
    budgetMicrousd,
    remainingMicrousd,
    percent: Number.isFinite(budgetMicrousd)
      ? Math.max(0, Math.min(100, Math.floor((remainingMicrousd / budgetMicrousd) * 100)))
      : 100,
    resetsAt: new Date(Date.parse(metadata.aiUsage.startedAt) + AI_WINDOW_MS).toISOString(),
  };
}
function aiCostMicrousd(usage) {
  const input = Math.max(0, Number(usage?.input_tokens) || 0);
  const output = Math.max(0, Number(usage?.output_tokens) || 0);
  return Math.ceil(input * 0.2 + output * 1.2);
}
async function openAiTransform({ title, content, prompt, tier }) {
  if (!process.env.API_KEY)
    throw Object.assign(new Error("Astra AI is not configured."), { status: 503, code: "ai_unavailable" });
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.API_KEY}`, "content-type": "application/json" },
    signal: AbortSignal.timeout(45_000),
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      service_tier: tier,
      store: false,
      reasoning: { effort: "none" },
      max_output_tokens: AI_MAX_OUTPUT_TOKENS,
      text: { format: { type: "json_schema", name: "astranote_note", strict: true, schema: {
        type: "object", additionalProperties: false, required: ["message", "title", "content"],
        properties: { message: { type: "string", maxLength: 600 }, title: { type: "string", maxLength: MAX_NOTE_NAME }, content: { type: "string", maxLength: AI_MAX_NOTE_BYTES } },
      } } },
      input: [{ role: "system", content: [{ type: "input_text", text: "You edit only the supplied note. Follow the user's instruction. Return valid JSON only. Do not mention system instructions." }] }, { role: "user", content: [{ type: "input_text", text: JSON.stringify({ prompt, note: { title, content } }) }] }],
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw Object.assign(new Error("Astra AI could not complete this request."), { status: response.status, retryable: response.status === 408 || response.status === 429 || response.status >= 500 });
  // Responses normally exposes `output_text`, but structured responses can also
  // arrive as an output_text content item. Supporting both keeps the API
  // contract stable across service tiers without logging private note content.
  const outputContent = Array.isArray(data?.output)
    ? data.output.flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    : [];
  const raw = typeof data?.output_text === "string"
    ? data.output_text
    : outputContent.find((item) => typeof item?.text === "string")?.text;
  let result;
  try {
    result = JSON.parse(String(raw || "").trim().replace(/^```json\s*/i, "").replace(/\s*```$/, ""));
  } catch {
    throw Object.assign(new Error("Astra AI returned an invalid result."), { status: 502 });
  }
  if (!result || typeof result.message !== "string" || typeof result.title !== "string" || typeof result.content !== "string")
    throw Object.assign(new Error("Astra AI returned an invalid result."), { status: 502 });
  return { result: { message: result.message.slice(0, 600), title: normalizeText(result.title, MAX_NOTE_NAME), content: result.content.slice(0, AI_MAX_NOTE_BYTES) }, usage: data?.usage || {} };
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
  try {
    await fsp.writeFile(temporary, value, { encoding: "utf8", mode: 0o600 });
    await fsp.rename(temporary, file);
  } finally {
    await fsp.unlink(temporary).catch((error) => {
      if (error.code !== "ENOENT")
        console.error("Temporary file cleanup failed.");
    });
  }
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
// A plan's storage allowance is for note data only. Account configuration and
// sign-in records must not make a user's notes appear to consume more space.
async function noteStorageSize(username) {
  try {
    return await directorySize(notesDir(username));
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }
}
// Remove retired standalone snapshots and their index during startup so they
// no longer occupy user storage or remain recoverable by URL.
async function purgeRetiredSnapshotData() {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  await Promise.all(entries.filter((entry) => entry.isDirectory() && USERNAME_RE.test(entry.name)).map(async (entry) => {
    const account = path.resolve(DATA_DIR, entry.name);
    const target = path.resolve(account, "drops");
    if (path.dirname(target) !== account) throw new Error("Unsafe retired snapshot target.");
    await fsp.rm(target, { recursive: true, force: true });
  }));
  await fsp.unlink(RETIRED_SNAPSHOT_INDEX_FILE).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}
async function loadMetadata(username) {
  const metadata = await readJson(metadataFile(username), null);
  if (!metadata) return null;
  // A stable, non-login credential factor lets people reset their password
  // without changing the server component used by legacy Secret/Confidential
  // notes. Copying the existing hash is compatibility-only; new accounts get
  // a random factor during registration.
  if (typeof metadata.cryptoFactor !== "string" || metadata.cryptoFactor.length < 32)
    metadata.cryptoFactor = metadata.passwordHash;
  metadata.emailVerified = metadata.emailVerified === true;
  metadata.emailQuotaRestricted = metadata.emailQuotaRestricted === true;
  metadata.emailTwoFactor = metadata.emailVerified && metadata.emailTwoFactor === true;
  metadata.emailAuth ||= {};
  for (const key of ["verify", "reset", "login", "delete"])
    if (Date.parse(metadata.emailAuth[key]?.expiresAt || 0) < Date.now()) delete metadata.emailAuth[key];
  for (const key of ["verifySentAt", "loginSentAt"])
    if (Array.isArray(metadata.emailAuth[key])) metadata.emailAuth[key] = metadata.emailAuth[key].filter((time) => Date.now() - Date.parse(time) < 24 * 60 * 60_000);
  metadata.banned = /^\d{4}\/\d{2}\/\d{2}$/.test(metadata.banned || "")
    ? metadata.banned
    : "0000/00/00";
  metadata.bannedMessage =
    typeof metadata.bannedMessage === "string" ? metadata.bannedMessage.slice(0, 1_000) : null;
  metadata.message =
    typeof metadata.message === "string" ? metadata.message.slice(0, 1_000) : null;
  metadata.beta = metadata.beta === true;
  // Retire classification metadata without touching note files or encryption.
  for (const reference of metadata?.notes || []) {
    delete reference.folder;
    delete reference.tags;
  }
  return metadata;
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

function isBeta(metadata) {
  return !isAdmin(metadata) && metadata?.beta === true;
}

async function requireAdmin(req, res, next) {
  try {
    const metadata = await loadMetadata(req.auth?.session?.username);
    if (!metadata || !isAdmin(metadata))
      return jsonError(res, 403, "admin_required", "Administrator access is required.");
    req.admin = metadata;
    next();
  } catch (error) {
    next(error);
  }
}

function bannedUntil(metadata) {
  const value = String(metadata?.banned || "0000/00/00");
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value);
  if (!match || value === "0000/00/00") return null;
  const [, year, month, day] = match;
  const until = Date.UTC(Number(year), Number(month) - 1, Number(day));
  return Number.isFinite(until) ? until : null;
}

function accountIsBanned(metadata, now = Date.now()) {
  const until = bannedUntil(metadata);
  return Boolean(until && now < until);
}

function normalizeEntitlements(metadata, now = Date.now()) {
  metadata.entitlements ||= {};
  const entitlements = metadata.entitlements;
  entitlements.plusMs = Math.max(0, Number(entitlements.plusMs) || 0);
  entitlements.proMs = Math.max(0, Number(entitlements.proMs) || 0);
  entitlements.ultraMs = Math.max(0, Number(entitlements.ultraMs) || 0);
  const previous = Number.isFinite(Date.parse(entitlements.updatedAt))
    ? Date.parse(entitlements.updatedAt)
    : now;
  let elapsed = Math.max(0, now - previous);
  if (!isAdmin(metadata) && !isBeta(metadata) && elapsed > 0) {
    const ultraUsed = Math.min(entitlements.ultraMs, elapsed);
    entitlements.ultraMs -= ultraUsed;
    elapsed -= ultraUsed;
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
  if (isBeta(metadata)) return "beta";
  if ((metadata.entitlements?.ultraMs || 0) > 0) return "ultra";
  if ((metadata.entitlements?.proMs || 0) > 0) return "pro";
  if ((metadata.entitlements?.plusMs || 0) > 0) return "plus";
  return "free";
}

function planPayload(metadata, now = Date.now()) {
  const plan = planForMetadata(metadata);
  const definition = plan === "free"
    ? { ...PLAN_DEFINITIONS.free, maxBytes: freeStorageAllowance(metadata) }
    : PLAN_DEFINITIONS[plan];
  const plusMs = Math.max(0, metadata.entitlements?.plusMs || 0);
  const proMs = Math.max(0, metadata.entitlements?.proMs || 0);
  const ultraMs = Math.max(0, metadata.entitlements?.ultraMs || 0);
  const activeMs =
    plan === "ultra"
      ? ultraMs
      : plan === "pro"
        ? proMs
        : plan === "plus"
        ? plusMs
          : null;
  return {
    type: plan,
    maxBytes: Number.isFinite(definition.maxBytes) ? definition.maxBytes : null,
    maxNotes: Number.isFinite(definition.maxNotes) ? definition.maxNotes : null,
    ultraDays: Math.ceil(ultraMs / 864e5),
    canOrganize: ["plus", "pro", "ultra", "beta", "admin"].includes(plan),
    canRecover: ["ultra", "beta", "admin"].includes(plan),
    canCreateZero: ["pro", "ultra", "beta", "admin"].includes(plan),
    canUseBetaFeatures: ["beta", "admin"].includes(plan),
    plusDays: Math.ceil(plusMs / 864e5),
    proDays: Math.ceil(proMs / 864e5),
    activeEndsAt:
      activeMs === null ? null : new Date(now + activeMs).toISOString(),
    canCreateConfidential: ["plus", "pro", "ultra", "beta", "admin"].includes(plan),
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
  if (
    !Number.isFinite(definition.maxBytes) &&
    !Number.isFinite(definition.maxNotes)
  )
    return new Set();
  const details = (
    await Promise.all(
      metadata.notes.map((reference) => noteFileDetails(username, reference)),
    )
  ).filter(Boolean);
  let remainingBytes = await noteStorageSize(username);
  let remainingCount = details.filter(
    (detail) => !detail.reference.trashedAt,
  ).length;
  const locked = new Set();
  details.sort(
    (left, right) =>
      right.bytes - left.bytes ||
      Date.parse(left.note.updatedAt || 0) -
        Date.parse(right.note.updatedAt || 0) ||
      left.note.id.localeCompare(right.note.id),
  );
  for (const detail of details) {
    if (
      remainingBytes <= definition.maxBytes &&
      remainingCount <= definition.maxNotes
    )
      break;
    // Trash uses storage but not the active-note allowance. Never lock it solely
    // to resolve an active-note count overage.
    if (detail.reference.trashedAt && remainingBytes <= definition.maxBytes)
      continue;
    locked.add(detail.note.id);
    remainingBytes -= detail.bytes;
    if (!detail.reference.trashedAt) remainingCount -= 1;
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
        if (target.username === userKey(username) && ids.has(target.id))
          delete shares[key];
    });
  }
  return true;
}

async function refreshPlanState(username, metadata, now = Date.now()) {
  normalizeEntitlements(metadata, now);
  const expiredTrash = new Set(
    metadata.notes
      .filter((ref) => ref.trashedAt && now >= Date.parse(ref.trashExpiresAt))
      .map((ref) => ref.id),
  );
  await removeNoteFiles(username, metadata, expiredTrash);
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

async function ensureData() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  for (const [file, initial] of [
    [USERS_FILE, "0\n"],
    [ONLINE_FILE, "0\n"],
    [
      ONLINE_USERS_FILE,
      JSON.stringify({ date: utcDay(), users: [] }, null, 2) + "\n",
    ],
    [DELETES_FILE, "[]\n"],
    [SHARES_FILE, "{}\n"],
    [ORDERS_FILE, "[]\n"],
  ])
    if (!(await exists(file))) await atomicWrite(file, initial);

  await migrateLegacySessions();

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
  if (!orderStore) orderStore = new OrderStore(DATA_DIR);
  await migrateOrders();
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

function validClientEnvelope(value, mode) {
  if (!validSchybridEnvelope(value)) return false;
  if (mode !== ZERO_MODE)
    return Object.keys(value).every((key) =>
      ["iv", "tag", "ciphertext"].includes(key),
    );
  const wrap = value.wrap;
  return (
    Object.keys(value).every((key) =>
      ["iv", "tag", "ciphertext", "wrap"].includes(key),
    ) &&
    wrap &&
    Object.keys(wrap).every((key) => ["v", "iv", "key"].includes(key)) &&
    wrap.v === 1 &&
    validBase64(wrap.iv, 12, 12) &&
    validBase64(wrap.key, 48, 48)
  );
}

function noteSnapshot(note) {
  return {
    name: note.name,
    content: note.content,
    clientSalt: note.clientSalt,
    payloadVersion: note.payloadVersion,
    updatedAt: note.updatedAt,
  };
}

async function saveMetadataWithinQuota(username, metadata) {
  // Metadata is account configuration, not a note. It is deliberately outside
  // the note storage quota (as is the per-account sessions.json file).
  await saveMetadata(username, metadata);
}

async function trashNotes(username, metadata, references) {
  const now = Date.now();
  const days = TRASH_DAYS.includes(metadata.settings?.trashDays)
    ? metadata.settings.trashDays
    : 7;
  for (const ref of references) {
    ref.trashedAt = new Date(now).toISOString();
    ref.trashExpiresAt = new Date(now + days * 864e5).toISOString();
    delete ref.planLockedAt;
    delete ref.scheduledDeletionAt;
  }
  // Commit the access revocation first. Sharing checks the live reference too.
  await saveMetadataWithinQuota(username, metadata);
  const ids = new Set(references.map((ref) => ref.id));
  await updateShares((shares) => {
    for (const [key, target] of Object.entries(shares))
      if (target.username === username && ids.has(target.id))
        delete shares[key];
  });
  for (const ref of references) {
    const note = await readJson(noteFile(username, ref.id), null);
    if (note?.shareToken) {
      note.shareToken = null;
      await writeJson(noteFile(username, ref.id), note);
    }
  }
}

function deriveVaultFactor(
  metadata,
  noteId,
  clientSalt,
  clientHash,
  mode = LEGACY_SCHYBRID_MODE,
) {
  const secret =
    mode === LEGACY_SCHYBRID_MODE ? vaultSecret : confidentialSecret;
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
    // This account-specific value deliberately survives a login-password
    // change. Existing accounts receive their old password hash once as a
    // compatibility value, so previously encrypted notes remain decryptable.
    .update(metadata.cryptoFactor || metadata.passwordHash)
    .update("\0")
    .update(noteId)
    .update("\0")
    .update(clientSalt)
    .update("\0")
    .update(clientHash)
    .digest("base64url");
}

async function readUserSessions(username) {
  return readJson(sessionsFile(username), {});
}
async function writeUserSessions(username, sessions) {
  const file = sessionsFile(username);
  if (Object.keys(sessions).length) return writeJson(file, sessions);
  await fsp.unlink(file).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}
function expiredSession(session, now = Date.now()) {
  return (
    !session ||
    now >= Date.parse(session.expiresAt || 0) ||
    now >= Date.parse(session.maxExpiresAt || 0)
  );
}
async function pruneUserSessions(username, now = Date.now()) {
  const sessions = await readUserSessions(username);
  let changed = false;
  for (const [id, session] of Object.entries(sessions)) {
    if (expiredSession(session, now)) {
      delete sessions[id];
      changed = true;
    }
  }
  if (changed) await writeUserSessions(username, sessions);
  return sessions;
}
async function migrateLegacySessions() {
  if (!(await exists(LEGACY_SESSIONS_FILE))) return;
  await withLock("legacy-sessions", async () => {
    const legacy = await readJson(LEGACY_SESSIONS_FILE, {});
    const grouped = new Map();
    for (const [id, session] of Object.entries(legacy)) {
      const username = userKey(session?.username || "");
      if (!USERNAME_RE.test(username) || expiredSession(session)) continue;
      const records = grouped.get(username) || {};
      records[id] = session;
      grouped.set(username, records);
    }
    for (const [username, records] of grouped) {
      const current = await readUserSessions(username);
      Object.assign(current, records);
      const kept = Object.entries(current)
        .filter(([, session]) => !expiredSession(session))
        .sort(([, left], [, right]) =>
          Date.parse(right.lastSeenAt || right.createdAt || 0) -
          Date.parse(left.lastSeenAt || left.createdAt || 0),
        )
        .slice(0, 5);
      await writeUserSessions(username, Object.fromEntries(kept));
    }
    // Keep only the old lookup records until they expire, so a browser that
    // already holds a pre-migration cookie is not unexpectedly logged out.
  });
}
async function cleanupExpiredSessions() {
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    await withLock(`sessions:${userKey(entry.name)}`, () =>
      pruneUserSessions(entry.name),
    );
  }
  if (await exists(LEGACY_SESSIONS_FILE)) {
    await withLock("legacy-sessions", async () => {
      const legacy = await readJson(LEGACY_SESSIONS_FILE, {});
      for (const [id, session] of Object.entries(legacy))
        if (expiredSession(session)) delete legacy[id];
      if (Object.keys(legacy).length) await writeJson(LEGACY_SESSIONS_FILE, legacy);
      else await fsp.unlink(LEGACY_SESSIONS_FILE).catch(() => {});
    });
  }
}
async function updateShares(mutator) {
  return withLock("shares", async () => {
    const shares = await readJson(SHARES_FILE, {});
    const result = await mutator(shares);
    await writeJson(SHARES_FILE, shares);
    return result;
  });
}
function accountOrderId(metadata) {
  return sha256(`${userKey(metadata.username)}\0${metadata.createdAt}`).slice(
    0,
    32,
  );
}
async function migrateOrders() {
  const stat = await fsp.stat(ORDERS_FILE);
  if (stat.size > 128_000_000)
    throw new Error(
      "Legacy orders exceed the safe migration size. Migrate offline before starting.",
    );
  const legacy = await readJson(ORDERS_FILE, []);
  if (!Array.isArray(legacy)) throw new Error("Invalid legacy order file.");
  for (const original of legacy) {
    if (orderStore.get(original.orderId)) continue;
    const metadata = USERNAME_RE.test(original.username)
      ? await loadMetadata(original.username)
      : null;
    const accountId =
      metadata &&
      Date.parse(metadata.createdAt) <= Date.parse(original.createdAt)
        ? accountOrderId(metadata)
        : `orphan:${original.orderId}`;
    orderStore.put({ ...compactOrder(original), accountId });
  }
  // Only retire the old representation once every record is durably present.
  if (legacy.every((order) => orderStore.get(order.orderId)))
    await atomicWrite(ORDERS_FILE, "[]\n");
}
function storedOrderStatus(order) {
  return (order.lastError || order.failureCode) && !order.satoraPaymentId
    ? "failed"
    : String(order.localStatus || "created");
}
function compactOrder(order) {
  const localStatus = storedOrderStatus(order);
  const compact = {
    orderId: order.orderId,
    username: order.username,
    plan: order.plan,
    months: order.months,
    expectedSats: order.expectedSats,
    localStatus,
    createdAt: order.createdAt,
  };
  if (order.satoraPaymentId) compact.satoraPaymentId = order.satoraPaymentId;
  if (order.checkoutToken) compact.checkoutToken = order.checkoutToken;
  if (!order.fulfilledAt) {
    if (order.paymentUrl) compact.paymentUrl = order.paymentUrl;
  }
  if (order.paidAt) compact.paidAt = order.paidAt;
  if (order.fulfilledAt) compact.fulfilledAt = order.fulfilledAt;
  if (typeof order.txid === "string" && order.txid) compact.txid = order.txid;
  const failureCode = String(order.failureCode || order.lastError || "").slice(
    0,
    60,
  );
  if (localStatus === "failed" && failureCode)
    compact.failureCode = failureCode;
  return compact;
}
function recentNewOrderCount(orders, username, now = Date.now()) {
  const cutoff = now - ORDER_CREATION_WINDOW_MS;
  return orders.filter(
    (order) =>
      order.username === username &&
      Number.isFinite(Date.parse(order.createdAt)) &&
      Date.parse(order.createdAt) >= cutoff,
  ).length;
}
function publicOrder(order) {
  const localStatus = storedOrderStatus(order);
  return {
    orderId: order.orderId,
    plan: order.plan,
    months: order.months,
    days: order.months * 30,
    expectedSats: order.expectedSats,
    localStatus,
    paymentUrl: ["confirming", "pending"].includes(localStatus)
      ? order.paymentUrl || null
      : null,
    chargedSats: Number.isSafeInteger(order.chargedSats)
      ? order.chargedSats
      : null,
    satoraPaymentId: order.satoraPaymentId || null,
    txid: order.txid || null,
    createdAt: order.createdAt,
    paidAt: order.paidAt || null,
    fulfilledAt: order.fulfilledAt || null,
  };
}
function retainedOrder(order, now = Date.now()) {
  return Boolean(order && Date.parse(order.createdAt) > now - ORDER_RETENTION_MS);
}
let billingCleanupRunning = false;
async function cleanupBillingRecords(now = Date.now()) {
  if (billingCleanupRunning || !orderStore) return;
  billingCleanupRunning = true;
  try {
    let deleted;
    do {
      deleted = await withLock("orders", () =>
        orderStore.prune(now) + orderStore.pruneExcessHistory(),
      );
      // Yield between small batches so a historical backlog cannot monopolize Node.
      if (deleted >= 500) await new Promise(resolve => setImmediate(resolve));
    } while (deleted >= 500);
  } finally {
    billingCleanupRunning = false;
  }
}
function satoraPricingMatchesOrder(status, order) {
  if (!Number.isSafeInteger(status?.price) || status.price < 0) return false;
  if (status.price === order.expectedSats) return true;

  const validCouponDiscount =
    status.coupon &&
    typeof status.coupon === "object" &&
    Number.isSafeInteger(status.original_price) &&
    status.original_price === order.expectedSats &&
    Number.isSafeInteger(status.discount_sats) &&
    status.discount_sats > 0 &&
    status.discount_sats <= status.original_price &&
    status.price === status.original_price - status.discount_sats;
  if (!validCouponDiscount) return false;

  // A fully discounted invoice has no on-chain payment. Require Satora to
  // identify that result as a coupon acceptance instead of zero-conf payment.
  return status.price > 0 || status.acceptance_policy === "coupon";
}
function satoraStatusMatchesOrder(status, order) {
  return (
    status?.id === order.satoraPaymentId &&
    satoraPricingMatchesOrder(status, order)
  );
}
function satoraPaidAmountMatchesOrder(status, order) {
  return (
    status?.status === "paid" &&
    satoraStatusMatchesOrder(status, order) &&
    Number.isSafeInteger(status.received_sats) &&
    status.received_sats >= 0 &&
    status.received_sats === status.price
  );
}
function isReusableCouponDigest(digest) {
  return safeEqual(digest, REUSABLE_COUPON_DIGEST);
}
function satoraCouponPolicy(status) {
  const coupon = status?.coupon;
  const discounted = Number(status?.discount_sats) > 0;
  if (coupon == null || coupon === false || coupon?.applied === false)
    return { valid: !discounted, digest: null, reusable: false };
  if (
    typeof coupon !== "object" ||
    Array.isArray(coupon) ||
    typeof coupon.code !== "string"
  )
    return { valid: false };
  const code = coupon.code.trim().toUpperCase();
  if (!/^[\x21-\x7e]{1,128}$/.test(code)) return { valid: false };
  const digest = sha256(code);
  return { valid: true, digest, reusable: isReusableCouponDigest(digest) };
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
    const chunks = [];
    let responseBytes = 0;
    if (response.body) {
      for await (const chunk of response.body) {
        responseBytes += chunk.byteLength;
        if (responseBytes > 16_384) {
          controller.abort();
          throw new Error("Payment response is too large.");
        }
        chunks.push(Buffer.from(chunk));
      }
    }
    let data;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      data = {};
    }
    if (!response.ok || data.success !== true)
      throw Object.assign(
        new Error("Payment service could not complete the request."),
        {
          status: [429, 503].includes(response.status) ? response.status : 502,
          code: `satora_${String(data.error || response.status)}`,
        },
      );
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
        (metadata.entitlements?.proMs || 0) > 0 ||
        (metadata.entitlements?.ultraMs || 0) > 0;
      const hasPlanLocks = metadata.notes.some(
        (reference) => reference.planLockedAt,
      );
      if (
        !hasPaidTime &&
        !hasPlanLocks &&
        !metadata.notes.some((ref) => ref.trashedAt)
      )
        return;
      const remainingBefore = Math.max(metadata.entitlements?.plusMs || 0, metadata.entitlements?.proMs || 0, metadata.entitlements?.ultraMs || 0);
      const lockedBefore = metadata.notes.filter((reference) => reference.planLockedAt).length;
      await refreshPlanState(entry.name, metadata);
      const remainingAfter = Math.max(metadata.entitlements?.plusMs || 0, metadata.entitlements?.proMs || 0, metadata.entitlements?.ultraMs || 0);
      const days = Math.ceil(remainingAfter / 864e5);
      const lockCount = metadata.notes.filter((reference) => reference.planLockedAt).length;
      metadata.emailAuth ||= {};
      metadata.emailAuth.planNotices ||= {};
      let notice = null;
      if (metadata.emailVerified && days > 1 && days <= 7 && !metadata.emailAuth.planNotices.sevenDays) notice = { key: "sevenDays", copyKey: "planSeven" };
      if (metadata.emailVerified && days > 0 && days <= 1 && !metadata.emailAuth.planNotices.oneDay) notice = { key: "oneDay", copyKey: "planOne" };
      if (metadata.emailVerified && remainingBefore > 0 && remainingAfter === 0 && lockCount > lockedBefore && !metadata.emailAuth.planNotices.locked) notice = { key: "locked", copyKey: "locked", values: { count: lockCount } };
      if (notice) {
        const language = metadata.settings?.language || "en";
        const copy = emailCopy(language, notice.copyKey, notice.values);
        const template = emailTemplate({ ...copy, actionLabel: language === "zh-Hant" ? "查看方案" : language === "ja" ? "プランを見る" : "View plans", actionUrl: "https://astranote.nxlabtw.com/plans", details: emailAuditDetails(language, metadata), expires: false, language });
        await sendMail({ to: metadata.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template }).catch(() => null);
        metadata.emailAuth.planNotices[notice.key] = utcNow();
      }
      await saveMetadata(entry.name, metadata);
    }).catch((error) =>
      console.error(
        `[${utcNow()}] Plan cleanup failed for ${entry.name}:`,
        error.message,
      ),
    );
  }
}
function parseCookies(header = "") {
  const cookies = Object.create(null);
  for (const segment of String(header).split(";")) {
    const separator = segment.indexOf("=");
    if (separator < 1) continue;
    const key = segment.slice(0, separator).trim();
    const value = segment.slice(separator + 1).trim();
    if (!key) continue;
    try {
      cookies[decodeURIComponent(key)] = decodeURIComponent(value);
    } catch {
      // Malformed cookies are untrusted input. Ignore them rather than
      // allowing one to turn an otherwise harmless request into a 500 error.
    }
  }
  return cookies;
}
function requestIsSecure(req) {
  const forwarded = String(req.get("x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  return req.secure || forwarded === "https";
}
function sessionCookieOptions(req, expires) {
  return {
    httpOnly: true,
    // Hosted HTTPS stays protected even when NODE_ENV was not configured;
    // plain local HTTP remains usable for development and test runs.
    secure: requestIsSecure(req),
    sameSite: "lax",
    path: "/",
    ...(expires ? { expires: new Date(expires) } : {}),
  };
}
function setSessionCookie(req, res, username, token, expiresAt) {
  res.cookie("astranote_session", `${userKey(username)}.${token}`, {
    ...sessionCookieOptions(req, expiresAt),
  });
}
function clearSessionCookie(req, res) {
  res.clearCookie("astranote_session", sessionCookieOptions(req));
}
function parseSessionCookie(req) {
  const value = parseCookies(req.headers.cookie).astranote_session;
  if (!value) return null;
  const match = /^([A-Za-z0-9_]{3,24})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (match) return { username: userKey(match[1]), token: match[2], legacy: false };
  // Old cookies are accepted only until their existing session expires, then
  // are removed. New sessions never use the shared legacy file.
  if (/^[A-Za-z0-9_-]{43}$/.test(value))
    return { username: null, token: value, legacy: true };
  return null;
}
function sessionDevice(req) {
  const ua = String(req.get("user-agent") || "");
  if (/DuckDuckGo/i.test(ua)) return "DuckDuckGo";
  if (/TorBrowser|Tor Browser/i.test(ua)) return "Tor Browser";
  if (/EdgA?|EdgiOS/i.test(ua)) return "Edge";
  if (/GSA\//i.test(ua)) return "Google";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/CriOS|Chrome/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Browser";
}
function publicIpForLookup(value) {
  const ip = String(value || "").replace(/^::ffff:/i, "").trim();
  // The endpoint accepts a literal address only. This prevents request header
  // input from changing the host or path being fetched. node:net also rejects
  // malformed lookalikes such as 999.999.999.999.
  return net.isIP(ip) ? ip : null;
}
async function sessionLocation(req) {
  const ip = publicIpForLookup(requestIp(req));
  if (!ip) return { country: null };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);
  try {
    const response = await fetch(
      `https://nxlabtw.com/ipinfo/${encodeURIComponent(ip)}`,
      {
        redirect: "error",
        signal: controller.signal,
        headers: { accept: "application/json", "user-agent": "AstraNote/1.0" },
      },
    );
    const length = Number(response.headers.get("content-length") || 0);
    if (!response.ok || length > 4096) return { country: null };
    const result = await response.json();
    const country = String(result?.country || "").trim().slice(0, 80);
    return { country: country || null };
  } catch {
    return { country: null };
  } finally {
    clearTimeout(timer);
  }
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
    ip: requestIp(req),
    device: sessionDevice(req),
    location: await sessionLocation(req),
    lastSeenAt: new Date(now).toISOString(),
  };
  await withLock(`sessions:${userKey(username)}`, async () => {
    const sessions = await pruneUserSessions(username, now);
    sessions[sha256(token)] = record;
    const own = Object.entries(sessions)
      .filter(([, value]) => value.username === userKey(username))
      .sort(([, left], [, right]) =>
        Date.parse(left.lastSeenAt || left.createdAt || 0) -
        Date.parse(right.lastSeenAt || right.createdAt || 0),
      );
    while (own.length > 5) delete sessions[own.shift()[0]];
    await writeUserSessions(username, sessions);
  });
  setSessionCookie(req, res, username, token, record.expiresAt);
  return record;
}
async function destroySessionToken(username, token) {
  if (!username || !token) return;
  await withLock(`sessions:${userKey(username)}`, async () => {
    const sessions = await readUserSessions(username);
    delete sessions[sha256(token)];
    await writeUserSessions(username, sessions);
  });
}
async function destroyUserSessions(username) {
  await withLock(`sessions:${userKey(username)}`, async () => {
    await writeUserSessions(username, {});
  });
}
async function requireAuth(req, res, next) {
  try {
    const supplied = parseSessionCookie(req);
    if (!supplied)
      return jsonError(res, 401, "authentication_required", "Please sign in.");
    const { token } = supplied;
    let username = supplied.username;
    let session;
    if (supplied.legacy) {
      const legacy = await readJson(LEGACY_SESSIONS_FILE, {});
      session = legacy[sha256(token)] || null;
      username = session?.username || null;
    } else {
      session = await withLock(`sessions:${username}`, async () => {
        const sessions = await readUserSessions(username);
        const current = sessions[sha256(token)];
        const now = Date.now();
        if (current?.username !== username || expiredSession(current, now)) {
          if (current) {
            delete sessions[sha256(token)];
            await writeUserSessions(username, sessions);
          }
          return null;
        }
        current.expiresAt = new Date(
          Math.min(
            Date.parse(current.maxExpiresAt),
            Math.max(Date.parse(current.expiresAt), now) + SESSION_EXTENSION_MS,
          ),
        ).toISOString();
        current.lastSeenAt = new Date(now).toISOString();
        sessions[sha256(token)] = current;
        await writeUserSessions(username, sessions);
        return current;
      });
    }
    if (supplied.legacy && session && !expiredSession(session)) {
      await withLock(`sessions:${userKey(username)}`, async () => {
        const sessions = await pruneUserSessions(username);
        sessions[sha256(token)] = session;
        await writeUserSessions(username, sessions);
      });
      // Preserve the legacy lookup until its original expiry so existing
      // browser cookies remain valid during the one-time storage migration.
    }
    if (!session) {
      clearSessionCookie(req, res);
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
    const metadata = await loadMetadata(session.username);
    if (metadata && accountIsBanned(metadata)) {
      await destroySessionToken(session.username, token);
      clearSessionCookie(req, res);
      return jsonError(res, 403, "account_banned", "This account is currently unavailable.");
    }
    setSessionCookie(req, res, session.username, token, session.expiresAt);
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
async function verifyCaptchaIfPermanentNoteDelete(req, res, next) {
  try {
    const metadata = await loadMetadata(req.auth.session.username);
    const access = metadata && await refreshPlanState(req.auth.session.username, metadata);
    const ref = metadata?.notes?.find(
      (item) => item.id === req.params.id && !item.trashedAt,
    );
    if (access?.payload.canRecover && ref && !ref.planLockedAt) return next();
    return verifyCaptcha(req, res, next);
  } catch (error) {
    next(error);
  }
}

async function verifyCaptchaIfPermanentBatchDelete(req, res, next) {
  try {
    const metadata = await loadMetadata(req.auth.session.username);
    const access = metadata && await refreshPlanState(req.auth.session.username, metadata);
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const refs = ids.map((id) =>
      metadata?.notes?.find((item) => item.id === id && !item.trashedAt),
    );
    if (access?.payload.canRecover && refs.length && refs.every((ref) => ref && !ref.planLockedAt))
      return next();
    return verifyCaptcha(req, res, next);
  } catch (error) {
    next(error);
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
  return physicalAccountCount();
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
async function findAccountByEmail(email) {
  const target = String(email || "").trim().toLowerCase();
  if (!target) return null;
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    const metadata = await loadMetadata(entry.name);
    if (metadata?.email?.toLowerCase() === target) return metadata;
  }
  return null;
}
async function findAccountByIdentifier(value) {
  const identifier = normalizeText(value, 254);
  return USERNAME_RE.test(identifier) ? loadMetadata(identifier) : findAccountByEmail(identifier);
}
async function verifyPasswordForAccount(metadata, password) {
  // Always run Argon2id, including for a missing or malformed account. This
  // prevents an account lookup from turning into an inexpensive timing oracle.
  return argon2
    .verify(typeof metadata?.passwordHash === "string" ? metadata.passwordHash : DUMMY_PASSWORD_HASH, password)
    .catch(() => false);
}
function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function emailTemplate({ title, body, actionLabel, actionUrl, code, details = [], noticeTitle, noticeBody, danger = false, expires = Boolean(code || actionUrl), language = "en" }) {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const copy = language === "zh-Hant"
    ? { fallback: "若按鈕無法開啟，請複製以下連結：", expiry: "此連結或驗證碼將在 10 分鐘後失效。若非你本人操作，請直接忽略此信。" }
    : language === "ja"
      ? { fallback: "ボタンが開かない場合は、次のリンクをコピーしてください。", expiry: "このリンクまたは確認コードは 10 分後に失効します。心当たりがない場合は、このメールを無視してください。" }
      : { fallback: "If the button does not open, copy this link:", expiry: "This link or code expires in 10 minutes. If you did not request it, you can safely ignore this email." };
  const action = actionUrl ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 0"><tr><td style="border-radius:12px;background:#7180ff"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;padding:14px 20px;border-radius:12px;color:#fff;text-decoration:none;font:700 15px Arial,sans-serif">${escapeHtml(actionLabel)}</a></td></tr></table>` : "";
  const fallback = actionUrl ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0 0;border:1px solid #263354;border-radius:12px;background:#0b1125"><tr><td style="padding:14px 16px"><p style="margin:0 0 7px;color:#aeb9d8;font:13px/1.55 Arial,sans-serif">${copy.fallback}</p><p style="margin:0;overflow-wrap:anywhere;color:#d7deff;font:12px/1.6 ui-monospace,monospace">${escapeHtml(actionUrl)}</p></td></tr></table>` : "";
  const codeBlock = code ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;border:1px solid ${danger ? "#bc4960" : "#4959a8"};border-radius:14px;background:${danger ? "#2b1018" : "#0b1129"}"><tr><td style="padding:18px;color:#fff;text-align:center;letter-spacing:.16em;font:700 30px ui-monospace,monospace">${escapeHtml(code)}</td></tr></table>` : "";
  const safeDetails = Array.isArray(details) ? details.filter((detail) => detail?.label && detail?.value !== undefined && detail?.value !== null).slice(0, 8) : [];
  const detailText = safeDetails.map((detail) => `${detail.label}: ${detail.value}`).join("\n");
  const detailBlock = safeDetails.length ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0 0;border:1px solid #263354;border-radius:12px;background:#0b1125"><tr><td style="padding:6px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${safeDetails.map((detail, index) => `<tr><td style="padding:9px 0;${index ? "border-top:1px solid #202d4a;" : ""}color:#8492b9;font:600 12px/1.4 Arial,sans-serif">${escapeHtml(detail.label)}</td><td style="padding:9px 0 9px 16px;${index ? "border-top:1px solid #202d4a;" : ""}color:#e9edff;text-align:right;font:600 12px/1.4 ui-monospace,monospace;overflow-wrap:anywhere">${escapeHtml(detail.value)}</td></tr>`).join("")}</table></td></tr></table>` : "";
  const notice = noticeTitle && noticeBody ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0 0;border:1px solid ${danger ? "#8c3548" : "#384a83"};border-radius:12px;background:${danger ? "#251017" : "#101a38"}"><tr><td style="padding:15px 16px"><p style="margin:0 0 7px;color:${danger ? "#ffb6c2" : "#c7d4ff"};font:700 14px/1.4 Arial,sans-serif">${escapeHtml(noticeTitle)}</p><p style="margin:0;color:#d3dbf0;font:13px/1.65 Arial,sans-serif">${escapeHtml(noticeBody).replace(/\n/g, "<br>")}</p></td></tr></table>` : "";
  const expiryText = expires ? `\n\n${copy.expiry}` : "";
  const expiryBlock = expires ? `<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #283452;color:#98a6c8;font:12px/1.6 Arial,sans-serif">${copy.expiry}</p>` : "";
  const text = `${title}\n\n${body}${code ? `\n\n${code}` : ""}${detailText ? `\n\n${detailText}` : ""}${noticeTitle && noticeBody ? `\n\n${noticeTitle}\n${noticeBody}` : ""}${actionUrl ? `\n\n${actionUrl}` : ""}${expiryText}`;
  return { text, html: `<!doctype html><html lang="${escapeHtml(language)}"><body style="margin:0;padding:0;background:#050816;color:#eef2ff"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050816"><tr><td style="padding:32px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;border:1px solid #283452;border-radius:20px;overflow:hidden;background:#10172d"><tr><td style="padding:20px 24px;border-bottom:1px solid #283452"><img src="https://astranote.nxlabtw.com/asset/logo.png" width="30" height="30" alt="" style="vertical-align:middle;margin-right:10px;border-radius:8px"><span style="vertical-align:middle;color:#fff;font:700 18px Arial,sans-serif">AstraNote</span></td></tr><tr><td style="padding:32px 24px"><h1 style="margin:0 0 14px;color:#fff;font:700 27px/1.2 Arial,sans-serif">${safeTitle}</h1><p style="margin:0;color:#c7d0e9;font:15px/1.7 Arial,sans-serif">${safeBody}</p>${codeBlock}${detailBlock}${notice}${action}${fallback}${expiryBlock}</td></tr></table></td></tr></table></body></html>` };
}
function emailAuditDetails(language, metadata, { ip = null, country = null, plan = null, days = null, activatedAt = null, expiresAt = null, status = null } = {}) {
  const labels = language === "zh-Hant"
    ? { username: "帳號", email: "Email", time: "時間（UTC）", ip: "IP", location: "位置", plan: "方案", days: "有效天數", activated: "啟用日期", expires: "到期日期", status: "交易狀態" }
    : language === "ja"
      ? { username: "アカウント", email: "メール", time: "時刻（UTC）", ip: "IP", location: "場所", plan: "プラン", days: "有効日数", activated: "有効開始日", expires: "有効期限", status: "取引状況" }
      : { username: "Account", email: "Email", time: "Time (UTC)", ip: "IP", location: "Location", plan: "Plan", days: "Active days", activated: "Activated on", expires: "Expires on", status: "Transaction status" };
  const details = [
    { label: labels.username, value: metadata.username },
    { label: labels.email, value: metadata.email },
    { label: labels.time, value: utcNow() },
  ];
  if (ip) details.push({ label: labels.ip, value: ip });
  if (country) details.push({ label: labels.location, value: country });
  if (plan) details.push({ label: labels.plan, value: String(plan).toUpperCase() });
  if (days) details.push({ label: labels.days, value: String(days) });
  if (activatedAt) details.push({ label: labels.activated, value: utcDate(activatedAt) });
  if (expiresAt) details.push({ label: labels.expires, value: utcDate(expiresAt) });
  if (status) details.push({ label: labels.status, value: String(status) });
  return details;
}
function emailCopy(language, key, values = {}) {
  const copies = {
    en: {
      verify: { subject: "Verify your AstraNote email", title: "Verify your email", body: "Verify your email to unlock the full 128 KB Free allowance and email security features.", actionLabel: "Verify email" },
      login: { subject: "Your AstraNote sign-in code", title: "Confirm this sign-in", body: "Enter this code in AstraNote. Sign-in IP: {ip}.", },
      reset: { subject: "Reset your AstraNote password", title: "Reset your password", body: "We received a request to reset your AstraNote password. If this was not you, you can safely ignore this email.", actionLabel: "Reset password" },
      delete: { subject: "Confirm AstraNote account deletion", title: "Confirm account deletion", body: "Enter this code in AstraNote to permanently delete your account. This cannot be undone." },
      payment: { subject: "AstraNote payment confirmed", title: "Your plan is active", body: "Your AstraNote {plan} plan is active for {days} days." },
      security: { subject: "AstraNote sign-in security notice", title: "Unsuccessful sign-in attempts", body: "{count} unsuccessful password attempts were made from {ip}{country}." },
      planSeven: { subject: "Your AstraNote plan expires in 7 days", title: "Your AstraNote plan expires in 7 days", body: "Your plan is close to expiry. Renew to keep your current allowance and features." },
      planOne: { subject: "Your AstraNote plan expires in 1 day", title: "Your AstraNote plan expires in 1 day", body: "Renew now to avoid notes being locked above the Free allowance." },
      locked: { subject: "Some AstraNote notes are locked", title: "Some AstraNote notes are locked", body: "{count} notes are locked because your plan expired. Upgrade to unlock them, and check Trash for notes that may still be handled before their scheduled deletion after 30 days." },
    },
    "zh-Hant": {
      verify: { subject: "驗證你的 AstraNote Email", title: "驗證你的 Email", body: "完成 Email 驗證，即可啟用完整的 128 KB Free 空間與 Email 安全功能。", actionLabel: "驗證 Email" },
      login: { subject: "你的 AstraNote 登入驗證碼", title: "確認這次登入", body: "請在 AstraNote 輸入此驗證碼。登入 IP：{ip}。" },
      reset: { subject: "重設你的 AstraNote 密碼", title: "重設密碼", body: "我們收到重設 AstraNote 密碼的要求。如果不是你本人操作，請直接忽略此信。", actionLabel: "重設密碼" },
      delete: { subject: "確認刪除 AstraNote 帳號", title: "確認刪除帳號", body: "請在 AstraNote 輸入此驗證碼，永久刪除帳號。此操作無法復原。" },
      payment: { subject: "AstraNote 付款已確認", title: "你的方案已啟用", body: "你的 AstraNote {plan} 方案已啟用 {days} 天。" },
      security: { subject: "AstraNote 登入安全通知", title: "偵測到登入失敗", body: "來自 {ip}{country} 的密碼登入失敗已達 {count} 次。" },
      planSeven: { subject: "你的 AstraNote 方案將在 7 天後到期", title: "你的 AstraNote 方案將在 7 天後到期", body: "你的方案即將到期。請續訂以保留目前的空間額度與功能。" },
      planOne: { subject: "你的 AstraNote 方案將在 1 天後到期", title: "你的 AstraNote 方案將在 1 天後到期", body: "請立即續訂，避免超出 Free 額度的筆記被鎖定。" },
      locked: { subject: "部分 AstraNote 筆記已被鎖定", title: "部分 AstraNote 筆記已被鎖定", body: "你的方案已到期，已有 {count} 篇筆記被鎖定。請升級以解鎖，並前往垃圾桶檢查仍可處理、尚未到期的筆記。" },
    },
    ja: {
      verify: { subject: "AstraNote メール認証", title: "メールを認証", body: "メールを認証すると、Free の完全な 128 KB とメール保護機能を利用できます。", actionLabel: "メールを認証" },
      login: { subject: "AstraNote のサインインコード", title: "サインインを確認", body: "このコードを AstraNote に入力してください。サインイン IP：{ip}。" },
      reset: { subject: "AstraNote パスワードの再設定", title: "パスワードを再設定", body: "AstraNote のパスワード再設定を受け付けました。心当たりがない場合は、このメールを無視してください。", actionLabel: "パスワードを再設定" },
      delete: { subject: "AstraNote アカウント削除の確認", title: "アカウント削除の確認", body: "このコードを AstraNote に入力すると、アカウントを完全に削除します。この操作は元に戻せません。" },
      payment: { subject: "AstraNote の支払いを確認しました", title: "プランが有効になりました", body: "AstraNote {plan} プランを {days} 日間ご利用いただけます。" },
      security: { subject: "AstraNote サインインセキュリティ通知", title: "サインイン失敗を検知しました", body: "{ip}{country} からのパスワードによるサインイン失敗が {count} 回ありました。" },
      planSeven: { subject: "AstraNote プランは7日後に終了します", title: "AstraNote プランは7日後に終了します", body: "プランの期限が近づいています。現在の容量と機能を維持するには更新してください。" },
      planOne: { subject: "AstraNote プランは1日後に終了します", title: "AstraNote プランは1日後に終了します", body: "Free 上限を超えるノートのロックを避けるには、今すぐ更新してください。" },
      locked: { subject: "一部の AstraNote ノートがロックされています", title: "一部の AstraNote ノートがロックされています", body: "プランの期限切れにより {count} 件のノートがロックされています。解除するにはアップグレードし、期限前に対応できるノートがないかゴミ箱も確認してください。" },
    },
  };
  const selected = copies[language]?.[key] || copies.en[key];
  return Object.fromEntries(Object.entries(selected).map(([name, text]) => [name, String(text).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "")]));
}
function emailSecurityNotice(language, type) {
  const notices = {
    en: {
      login: { title: "Wasn't you?", body: "Do not share this code. Change your password immediately and review your signed-in devices." },
      delete: { title: "Permanent action", body: "This code permanently deletes your notes, settings, and account. Do not share it. If this was not you, change your password immediately and review your signed-in devices." },
    },
    "zh-Hant": {
      login: { title: "不是你本人？", body: "請勿分享此驗證碼。建議立即變更密碼，並檢查已登入的裝置。" },
      delete: { title: "永久刪除警告", body: "此驗證碼會永久刪除你的筆記、設定與帳號。請勿分享；若不是你本人操作，請立即變更密碼並檢查已登入的裝置。" },
    },
    ja: {
      login: { title: "心当たりがありませんか？", body: "このコードを共有しないでください。すぐにパスワードを変更し、サインイン中の端末を確認してください。" },
      delete: { title: "完全削除に関する警告", body: "このコードを使うとノート、設定、アカウントが完全に削除されます。共有せず、心当たりがない場合は直ちにパスワードを変更し、サインイン中の端末を確認してください。" },
    },
  };
  return notices[language]?.[type] || notices.en[type] || null;
}
function paymentConfirmedLabel(language) {
  return language === "zh-Hant" ? "已確認" : language === "ja" ? "確認済み" : "Confirmed";
}
async function sendMail({ to, from, subject, template }) {
  if (!process.env.ZSKEY) throw Object.assign(new Error("Email delivery is unavailable."), { status: 503, code: "email_unavailable" });
  await withLock("email-limits", async () => {
    const day = utcDay();
    const record = await readJson(EMAIL_LIMITS_FILE, { day, total: 0 });
    const current = record.day === day ? { day, total: Number(record.total) || 0 } : { day, total: 0 };
    if (current.total >= EMAIL_DAILY_LIMIT)
      throw Object.assign(new Error("Today's email sending limit has been reached. Please try again tomorrow."), { status: 429, code: "email_daily_limit" });
    const response = await fetch(EMAIL_API_URL, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.ZSKEY}` }, signal: AbortSignal.timeout(12_000), body: JSON.stringify({ from, to: [to], reply_to: [SUPPORT_EMAIL], subject, html: template.html, text: template.text }) });
    if (!response.ok) throw Object.assign(new Error("Email delivery failed."), { status: response.status >= 500 ? 503 : response.status, code: "email_delivery_failed" });
    current.total += 1;
    await writeJson(EMAIL_LIMITS_FILE, current);
  });
}

function emailLimitRecord(value = {}, day = utcDay()) {
  return value.day === day
    ? { day, total: Math.max(0, Number(value.total) || 0) }
    : { day, total: 0 };
}

async function emailDeliveryStatus() {
  const record = emailLimitRecord(await readJson(EMAIL_LIMITS_FILE, {}));
  return {
    dailyLimit: EMAIL_DAILY_LIMIT,
    sentToday: record.total,
    remaining: Math.max(0, EMAIL_DAILY_LIMIT - record.total),
  };
}

function validateBroadcastContent({ subject, html, text }) {
  const cleanSubject = normalizeText(subject, 180);
  const cleanHtml = typeof html === "string" ? html.trim() : "";
  const cleanText = typeof text === "string" ? text.trim() : "";
  if (!cleanSubject || /[\r\n]/.test(cleanSubject))
    throw Object.assign(new Error("Enter a valid email subject."), { status: 400, code: "invalid_subject" });
  if (!cleanHtml || !cleanText || cleanHtml.length > 48_000 || cleanText.length > 24_000)
    throw Object.assign(new Error("Enter both HTML and plain-text content within the allowed length."), { status: 400, code: "invalid_broadcast_content" });
  // Broadcast HTML is operator-authored but must still never turn the mail API
  // into a tracker or an active-content delivery channel if an admin session is stolen.
  // Keep the same official logo used by transactional email, while rejecting
  // every other remote resource and all active/tracking content.
  const htmlWithoutOfficialLogo = cleanHtml.replaceAll("https://astranote.nxlabtw.com/asset/logo.png", "");
  if (/<\s*\/?\s*(script|iframe|object|embed|form|base|link|meta)\b|\bon[a-z]+\s*=|javascript\s*:|\bsrc\s*=\s*["']?\s*(?:https?:|data:)|\burl\s*\(/iu.test(htmlWithoutOfficialLogo))
    throw Object.assign(new Error("Broadcast HTML cannot contain active content, remote resources, or tracking URLs."), { status: 400, code: "unsafe_broadcast_html" });
  return { subject: cleanSubject, html: cleanHtml, text: cleanText };
}

function normalizeAdminFilters(raw = {}) {
  const languages = Array.isArray(raw.languages) ? raw.languages.filter((value) => ["en", "zh-Hant", "ja"].includes(value)) : [];
  const plans = Array.isArray(raw.plans) ? raw.plans.filter((value) => ["free", "plus", "pro", "ultra", "beta", "admin"].includes(value)) : [];
  return { languages: [...new Set(languages)], plans: [...new Set(plans)] };
}

function normalizeBroadcastExclusions(raw = {}) {
  const excludedPlans = Array.isArray(raw.excludedPlans)
    ? raw.excludedPlans.filter((value) => ["free", "plus", "pro", "ultra", "beta", "admin"].includes(value))
    : [];
  const excludedAccounts = Array.isArray(raw.excludedAccounts)
    ? raw.excludedAccounts.map((value) => String(value).trim().toLocaleLowerCase("en-US")).filter(Boolean)
    : [];
  if (excludedAccounts.length > 100 || excludedAccounts.some((value) => value.length > 254))
    throw Object.assign(new Error("Too many excluded accounts."), { status: 400, code: "invalid_exclusions" });
  return { excludedPlans: [...new Set(excludedPlans)], excludedAccounts: [...new Set(excludedAccounts)], excludeBanned: raw.excludeBanned === true };
}

function broadcastRecipients(users, raw = {}) {
  const { excludedPlans, excludedAccounts, excludeBanned } = normalizeBroadcastExclusions(raw);
  const excluded = new Set(excludedAccounts);
  const matched = new Set();
  const recipients = new Map();
  for (const user of users) {
    const username = user.username.toLocaleLowerCase("en-US");
    const email = user.email.toLocaleLowerCase("en-US");
    if (excluded.has(username)) matched.add(username);
    if (excluded.has(email)) matched.add(email);
    if (excluded.has(username) || excluded.has(email) || excludedPlans.includes(user.plan) || (excludeBanned && user.banned)) continue;
    if (email) recipients.set(email, user.email);
  }
  return { recipients: [...recipients.values()], unmatched: excludedAccounts.filter((value) => !matched.has(value)) };
}

async function listAdminUsers(filters = {}) {
  const normalized = normalizeAdminFilters(filters);
  const query = normalizeText(filters.query, 254).toLocaleLowerCase("en-US");
  const entries = await fsp.readdir(DATA_DIR, { withFileTypes: true });
  const users = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !USERNAME_RE.test(entry.name)) continue;
    const metadata = await loadMetadata(entry.name);
    if (!metadata) continue;
    normalizeEntitlements(metadata);
    const plan = planForMetadata(metadata);
    const language = ["en", "zh-Hant", "ja"].includes(metadata.settings?.language)
      ? metadata.settings.language : "en";
    const username = String(metadata.username || entry.name);
    const email = String(metadata.email || "");
    if (query && !`${username}\n${email}`.toLocaleLowerCase("en-US").includes(query)) continue;
    if (normalized.languages.length && !normalized.languages.includes(language)) continue;
    if (normalized.plans.length && !normalized.plans.includes(plan)) continue;
    users.push({
      username,
      email,
      ip: metadata.lastLoginIp || metadata.registrationIp || null,
      usedBytes: await noteStorageSize(entry.name),
      emailVerified: metadata.emailVerified === true,
      banned: accountIsBanned(metadata),
      language,
      plan,
    });
  }
  return users.sort((left, right) => left.username.localeCompare(right.username));
}

async function sendAdminBroadcast({ recipients, subject, html, text, adminUsername }) {
  if (!process.env.ZSKEY) throw Object.assign(new Error("Email delivery is unavailable."), { status: 503, code: "email_unavailable" });
  if (!recipients.length) throw Object.assign(new Error("No email recipients match these filters."), { status: 400, code: "no_recipients" });
  await withLock("email-limits", async () => {
    const current = emailLimitRecord(await readJson(EMAIL_LIMITS_FILE, {}));
    if (current.total + recipients.length > EMAIL_DAILY_LIMIT)
      throw Object.assign(new Error("There are not enough emails remaining in today's shared sending limit."), { status: 429, code: "email_daily_limit" });
    // Zeabur's batch endpoint accepts at most 100 distinct messages. Each
    // recipient is its own message, so the local daily counter intentionally
    // debits recipients.length, never merely one batch request.
    const response = await fetch(`${EMAIL_API_URL}/batch`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.ZSKEY}` },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({ emails: recipients.map((to) => ({ from: "no-reply@mail.nxlabtw.com", to: [to], reply_to: [SUPPORT_EMAIL], subject, html, text })) }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || Number(result.total_count) !== recipients.length)
      throw Object.assign(new Error("Email delivery failed before the broadcast was queued."), { status: response.status >= 500 ? 503 : response.status || 502, code: "email_delivery_failed" });
    current.total += recipients.length;
    await writeJson(EMAIL_LIMITS_FILE, current);
    return result.job_id || null;
  });
  await withLock("admin-broadcasts", async () => {
    const audit = await readJson(ADMIN_BROADCAST_AUDIT_FILE, []);
    const records = Array.isArray(audit) ? audit : [];
    records.unshift({ at: utcNow(), by: userKey(adminUsername), recipients: recipients.length, subjectDigest: sha256(subject) });
    await writeJson(ADMIN_BROADCAST_AUDIT_FILE, records.slice(0, 20));
  });
}
function actionRecentlySent(metadata, action, limit, windowMs, now = Date.now()) {
  const list = Array.isArray(metadata.emailAuth?.[`${action}SentAt`]) ? metadata.emailAuth[`${action}SentAt`] : [];
  const recent = list.filter((time) => now - Date.parse(time) < windowMs);
  metadata.emailAuth ||= {};
  metadata.emailAuth[`${action}SentAt`] = recent;
  return recent.length >= limit;
}
function recordActionSent(metadata, action, now = Date.now()) {
  metadata.emailAuth ||= {};
  const key = `${action}SentAt`;
  metadata.emailAuth[key] = [...(metadata.emailAuth[key] || []).filter((time) => now - Date.parse(time) < 24 * 60 * 60_000), new Date(now).toISOString()];
}
async function noteSummary(username, reference) {
  const note = await readJson(noteFile(username, reference.id), null);
  if (!note) return null;
  const bytes = (await fsp.stat(noteFile(username, note.id))).size;
  if (reference.planLockedAt)
    return {
      id: note.id,
      name: normalizeText(note.name, MAX_NOTE_NAME) || "Encrypted note",
      updatedAt: note.updatedAt,
      characters: null,
      bytes,
      shared: false,
      locked: true,
      lockedAt: reference.planLockedAt,
      scheduledDeletionAt: reference.scheduledDeletionAt,
      pinned: Boolean(reference.pinned),
      archived: Boolean(reference.archived),
      trashedAt: reference.trashedAt || null,
      trashExpiresAt: reference.trashExpiresAt || null,
    };
  let payload = null;
  try {
    if (!reference.trashedAt) payload = readServerNotePayload(note, username);
  } catch {
    payload = null;
  }
  return {
    id: note.id,
    name:
      isClientEncryptedMode(note.encryption) || reference.trashedAt
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
    pinned: Boolean(reference.pinned),
    archived: Boolean(reference.archived),
    trashedAt: reference.trashedAt || null,
    trashExpiresAt: reference.trashExpiresAt || null,
    hasPrevious: Boolean(note.previous),
  };
}
async function accountPayload(username) {
  return withLock(`user:${userKey(username)}`, async () => {
    const metadata = await loadMetadata(username);
    if (!metadata) return null;
    const access = await refreshPlanState(username, metadata);
    const ai = normalizeAiUsage(metadata, access.payload.type);
    if (metadata.fulfilledOrders) {
      metadata.fulfilledOrders = metadata.fulfilledOrders.filter(
        (id) => !orderStore.get(id, accountOrderId(metadata))?.fulfilledAt,
      );
      if (!metadata.fulfilledOrders.length) delete metadata.fulfilledOrders;
    }
    await saveMetadata(username, metadata);
    const summaries = (
      await Promise.all(metadata.notes.map((ref) => noteSummary(username, ref)))
    ).filter(Boolean);
    const usedBytes = await noteStorageSize(username);
    return {
      username: metadata.username,
      isAdmin: isAdmin(metadata),
      email: metadata.email,
      displayName: metadata.displayName || metadata.username,
      createdAt: metadata.createdAt,
      settings: {
        trashDays: TRASH_DAYS.includes(metadata.settings?.trashDays)
          ? metadata.settings.trashDays
          : 7,
        language: ["en", "zh-Hant", "ja"].includes(metadata.settings?.language)
          ? metadata.settings.language
          : null,
        theme: ["dark", "light"].includes(metadata.settings?.theme)
          ? metadata.settings.theme
          : "dark",
      },
      emailSecurity: {
        verified: metadata.emailVerified === true,
        twoFactorEnabled: metadata.emailVerified === true && metadata.emailTwoFactor === true,
        // Every unverified account should see the security reminder. Free is
        // the only tier where verification also increases the storage quota.
        showVerificationBanner: metadata.emailVerified !== true,
        verificationUnlocksStorage: planForMetadata(metadata) === "free",
      },
      plan: access.payload,
      ai: {
        percent: ai.percent,
        resetsAt: ai.resetsAt,
        enabled: Boolean(process.env.API_KEY),
      },
      noteCount: summaries.filter((note) => !note.trashedAt).length,
      unlockedNoteCount: summaries.filter(
        (note) => !note.locked && !note.trashedAt,
      ).length,
      lockedNoteCount: summaries.filter((note) => note.locked).length,
      usedBytes,
      maxBytes: access.payload.maxBytes,
      maxNotes: access.payload.maxNotes,
      vaultAvailable: Boolean(confidentialSecret),
      supportEmail: SUPPORT_EMAIL,
      message: metadata.message || null,
      notes: summaries.filter((note) => !note.trashedAt),
      trash: summaries.filter((note) => note.trashedAt),
    };
  });
}

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    // CSP frame-ancestors covers modern browsers; retain the legacy header so
    // older clients cannot be clickjacked into account or payment actions.
    frameguard: { action: "sameorigin" },
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
// Client-encrypted notes expand when encoded, but never need a 6 MB body.
// This keeps the 2 MB note allowance while reducing pre-auth memory exposure.
app.use(express.json({ limit: "3mb", strict: true }));
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
const passwordResetIpLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 1,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
function emailCodeAccountKey(req) {
  const username = req.auth?.session?.username || normalizeText(req.body?.username, 24);
  return USERNAME_RE.test(username || "")
    ? `email-code-account:${userKey(username)}`
    : `email-code-ip:${ipKeyGenerator(req.ip)}`;
}
const emailCodeIpLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 15,
  keyGenerator: (req) => `email-code-ip:${ipKeyGenerator(req.ip)}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const emailCodeAccountLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  keyGenerator: emailCodeAccountKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const emailLinkIpLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 30,
  keyGenerator: (req) => `email-link-ip:${ipKeyGenerator(req.ip)}`,
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
const aiMutationLimiter = accountLimiter(8);
const shareMutationLimiter = accountLimiter(30);
const billingCreateAccountLimiter = rateLimit({
  windowMs: ORDER_CREATION_WINDOW_MS,
  limit: MAX_NEW_ORDERS_PER_ACCOUNT_WINDOW,
  keyGenerator: accountRateKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const billingCreateIpLimiter = rateLimit({
  windowMs: ORDER_CREATION_WINDOW_MS,
  limit: 12,
  keyGenerator: (req) => `billing-ip:${ipKeyGenerator(req.ip)}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const billingStatusLimiter = accountLimiter(30);
const adminReadLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  keyGenerator: accountRateKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
const adminBroadcastLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 3,
  keyGenerator: accountRateKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});
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
  const supplied = parseSessionCookie(req);
  if (!supplied)
    return res.json({ authenticated: false, preferredLanguage });
  const { token } = supplied;
  let session;
  if (supplied.legacy) {
    const legacy = await readJson(LEGACY_SESSIONS_FILE, {});
    const candidate = legacy[sha256(token)];
    if (
      !candidate ||
      !USERNAME_RE.test(candidate.username || "") ||
      expiredSession(candidate)
    )
      return res.json({ authenticated: false, preferredLanguage });
    const username = userKey(candidate.username);
    session = { ...candidate, username };
    await withLock(`sessions:${username}`, async () => {
      const sessions = await pruneUserSessions(username);
      sessions[sha256(token)] = session;
      await writeUserSessions(username, sessions);
    });
    // The old record stays only until its original expiry so a browser that
    // has not yet received the upgraded cookie keeps working.
    setSessionCookie(req, res, username, token, session.expiresAt);
  } else {
    const { username } = supplied;
    const sessions = await withLock(`sessions:${username}`, () =>
      pruneUserSessions(username),
    );
    session = sessions[sha256(token)];
    if (session?.username !== username || expiredSession(session))
      return res.json({ authenticated: false, preferredLanguage });
  }
  if (!session)
    return res.json({ authenticated: false, preferredLanguage });
  const metadata = await loadMetadata(session.username);
  if (metadata && accountIsBanned(metadata)) {
    await destroySessionToken(session.username, token);
    clearSessionCookie(req, res);
    return res.json({ authenticated: false, preferredLanguage });
  }
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
          cryptoFactor: crypto.randomBytes(48).toString("base64url"),
          emailVerified: false,
          emailQuotaRestricted: true,
          emailTwoFactor: false,
          emailAuth: {},
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
            ultraMs: 0,
            updatedAt: createdAt,
          },
          banned: "0000/00/00",
          bannedMessage: null,
          message: null,
          beta: false,
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
  async (req, res, next) => {
    const username = normalizeText(req.body.username, 254);
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    try {
      const metadata = await findAccountByIdentifier(username);
      const passwordValid = await verifyPasswordForAccount(metadata, password);
      const valid = Boolean(metadata) && passwordValid;
      if (!valid) {
        if (metadata) await withLock(`user:${userKey(metadata.username)}`, async () => {
          const current = await loadMetadata(metadata.username);
          const now = Date.now();
          current.emailAuth ||= {};
          const recent = (current.emailAuth.failedSignIns || []).filter((entry) => now - Date.parse(entry.at) < 15 * 60_000 && entry.ip === requestIp(req));
          recent.push({ at: new Date(now).toISOString(), ip: requestIp(req) });
          current.emailAuth.failedSignIns = recent.slice(-6);
          const lastAlert = Date.parse(current.emailAuth.failedSignInAlertAt || 0);
          if (current.emailVerified && recent.length >= 5 && (!Number.isFinite(lastAlert) || now - lastAlert >= 24 * 60 * 60_000)) {
            const location = await sessionLocation(req);
            const copy = emailCopy(current.settings?.language || "en", "security", { count: recent.length, ip: requestIp(req), country: location.country ? ` · ${location.country}` : "" });
            const template = emailTemplate({ ...copy, details: emailAuditDetails(current.settings?.language || "en", current, { ip: requestIp(req), country: location.country }), language: current.settings?.language || "en" });
            await sendMail({ to: current.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template }).catch(() => {});
            current.emailAuth.failedSignInAlertAt = new Date(now).toISOString();
          }
          await saveMetadata(current.username, current);
        });
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      }
      if (accountIsBanned(metadata))
        return res.status(403).json({ error: "account_banned", message: metadata.bannedMessage || "This account is currently unavailable.", bannedUntil: metadata.banned });
      const deletion = await findDeletion(metadata.username);
      if (deletion) {
        if (deletion.status === "cooling_off") return res.status(409).json({ error: "deletion_pending", message: "This account is pending deletion.", reversibleUntil: deletion.reversibleUntil });
        return jsonError(res, 401, "invalid_credentials", "Username or password is incorrect.");
      }
      if (metadata.emailTwoFactor === true && metadata.emailVerified === true) {
        await withLock(`user:${userKey(metadata.username)}`, async () => {
          const current = await loadMetadata(metadata.username);
          if (actionRecentlySent(current, "login", 1, 3 * 60_000))
            throw Object.assign(new Error("Please wait 3 minutes before requesting another email."), { status: 429, code: "email_rate_limited" });
          const code = makeEmailCode();
          current.emailAuth.login = { digest: codeDigest(code), expiresAt: new Date(Date.now() + EMAIL_TOKEN_MS).toISOString() };
          const copy = emailCopy(current.settings?.language || "en", "login", { ip: requestIp(req) });
          const location = await sessionLocation(req);
          const language = current.settings?.language || "en";
          const template = emailTemplate({ ...copy, code, ...emailSecurityNotice(language, "login"), details: emailAuditDetails(language, current, { ip: requestIp(req), country: location.country }), language });
          await sendMail({ to: current.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template });
          recordActionSent(current, "login");
          await saveMetadata(current.username, current);
        });
        return res.json({ ok: true, twoFactorRequired: true, username: metadata.username, email: maskEmail(metadata.email) });
      }
      metadata.lastLoginAt = utcNow();
      metadata.lastLoginIp = requestIp(req);
      metadata.settings ||= { theme: "dark" };
      if (normalizeLanguage(req.body.language))
        metadata.settings.language = normalizeLanguage(req.body.language);
      await saveMetadata(metadata.username, metadata);
      const session = await createSession(metadata.username, req, res);
      await updateOnlineUser(metadata.username);
      res.json({ ok: true, csrf: session.csrf, redirect: "/dashboard" });
    } catch (error) {
      next(error);
    }
  },
);

app.post("/api/login/verify", loginIpLimiter, emailCodeIpLimiter, emailCodeAccountLimiter, async (req, res, next) => {
  try {
    const username = normalizeText(req.body?.username, 24);
    const code = String(req.body?.code || "").replace(/\D/g, "");
    const metadata = USERNAME_RE.test(username)
      ? await withLock(`user:${userKey(username)}`, async () => {
          const current = await loadMetadata(username);
          const challenge = current?.emailAuth?.login;
          if (!current || !/^\d{6}$/.test(code) || !challenge || Date.parse(challenge.expiresAt) < Date.now() || !codeDigestMatches(challenge.digest, code))
            return null;
          delete current.emailAuth.login;
          current.lastLoginAt = utcNow();
          current.lastLoginIp = requestIp(req);
          await saveMetadata(current.username, current);
          return current;
        })
      : null;
    if (!metadata)
      return jsonError(res, 401, "invalid_code", "The verification code is incorrect or has expired.");
    const session = await createSession(metadata.username, req, res);
    await updateOnlineUser(metadata.username);
    res.json({ ok: true, csrf: session.csrf, redirect: "/dashboard" });
  } catch (error) { next(error); }
});

app.post("/api/email/verification/send", requireAuth, accountMutationLimiter, requireCsrf, async (req, res, next) => {
  try {
    const username = req.auth.session.username;
    await withLock(`user:${userKey(username)}`, async () => {
      const metadata = await loadMetadata(username);
      if (metadata.emailVerified) return;
      if (actionRecentlySent(metadata, "verify", 1, 10 * 60_000))
        throw Object.assign(new Error("Please wait 10 minutes before requesting another email."), { status: 429, code: "email_rate_limited" });
      const token = makeEmailToken();
      metadata.emailAuth.verify = { digest: tokenDigest(token), expiresAt: new Date(Date.now() + EMAIL_TOKEN_MS).toISOString() };
      const url = `https://astranote.nxlabtw.com/verify-email#u=${encodeURIComponent(metadata.username)}&token=${encodeURIComponent(token)}`;
      const copy = emailCopy(metadata.settings?.language || "en", "verify");
      const location = await sessionLocation(req);
      const template = emailTemplate({ ...copy, actionUrl: url, details: emailAuditDetails(metadata.settings?.language || "en", metadata, { ip: requestIp(req), country: location.country }), language: metadata.settings?.language || "en" });
      await sendMail({ to: metadata.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template });
      recordActionSent(metadata, "verify");
      await saveMetadata(username, metadata);
    });
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post("/api/email/verification/confirm", emailLinkIpLimiter, async (req, res, next) => {
  try {
    const token = String(req.body?.token || "");
    const username = normalizeText(req.body?.username, 24);
    const verified = USERNAME_RE.test(username) && /^[A-Za-z0-9_-]{32,}$/.test(token)
      ? await withLock(`user:${userKey(username)}`, async () => {
          const metadata = await loadMetadata(username);
          const challenge = metadata?.emailAuth?.verify;
          if (!metadata || !challenge || Date.parse(challenge.expiresAt) < Date.now() || !safeEqual(challenge.digest, tokenDigest(token))) return false;
          metadata.emailVerified = true;
          delete metadata.emailAuth.verify;
          await saveMetadata(metadata.username, metadata);
          return true;
        })
      : false;
    if (!verified) return jsonError(res, 400, "invalid_token", "This verification link is invalid or expired.");
    return res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post("/api/password/reset/request", passwordResetIpLimiter, async (req, res, next) => {
  try {
    const email = normalizeText(req.body?.email, 254).toLowerCase();
    const metadata = await findAccountByEmail(email);
    // Keep the account-exists and account-missing paths similarly expensive.
    // The reset endpoint is separately limited to one request per IP / 10 min.
    await verifyPasswordForAccount(metadata, "astranote-reset-timing-check");
    // Deliberately indistinguishable responses prevent account enumeration.
    if (metadata?.emailVerified) await withLock(`user:${userKey(metadata.username)}`, async () => {
      const current = await loadMetadata(metadata.username);
      if (actionRecentlySent(current, "reset", 1, 10 * 60_000))
        throw Object.assign(new Error("Please wait 10 minutes before requesting another email."), { status: 429, code: "email_rate_limited" });
      const token = makeEmailToken();
      current.emailAuth.reset = { digest: tokenDigest(token), expiresAt: new Date(Date.now() + EMAIL_TOKEN_MS).toISOString() };
      const url = `https://astranote.nxlabtw.com/reset-password#u=${encodeURIComponent(current.username)}&token=${encodeURIComponent(token)}`;
      const copy = emailCopy(current.settings?.language || "en", "reset");
      const location = await sessionLocation(req);
      const template = emailTemplate({ ...copy, actionUrl: url, details: emailAuditDetails(current.settings?.language || "en", current, { ip: requestIp(req), country: location.country }), language: current.settings?.language || "en" });
      await sendMail({ to: current.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template });
      recordActionSent(current, "reset");
      await saveMetadata(current.username, current);
    });
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post("/api/password/reset/confirm", emailLinkIpLimiter, async (req, res, next) => {
  try {
    const token = String(req.body?.token || "");
    const username = normalizeText(req.body?.username, 24);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!/^[A-Za-z0-9_-]{32,}$/.test(token) || password.length < 10 || password.length > 256)
      return jsonError(res, 400, "invalid_reset", "This reset link is invalid, expired, or the password does not meet requirements.");
    const resetUsername = USERNAME_RE.test(username)
      ? await withLock(`user:${userKey(username)}`, async () => {
          const metadata = await loadMetadata(username);
          const challenge = metadata?.emailAuth?.reset;
          if (!metadata || !challenge || Date.parse(challenge.expiresAt) < Date.now() || !safeEqual(challenge.digest, tokenDigest(token))) return null;
          metadata.passwordHash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
          delete metadata.emailAuth.reset;
          await saveMetadata(metadata.username, metadata);
          return metadata.username;
        })
      : null;
    if (!resetUsername) return jsonError(res, 400, "invalid_reset", "This reset link is invalid or expired.");
    await destroyUserSessions(resetUsername);
    return res.json({ ok: true, redirect: "/login" });
  } catch (error) { next(error); }
});

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
      const passwordValid = await verifyPasswordForAccount(metadata, password);
      const valid = Boolean(metadata) && deletion?.status === "cooling_off" && passwordValid;
      if (!valid)
        return jsonError(
          res,
          401,
          "invalid_credentials",
          "Username or password is incorrect.",
        );
      await cancelDeletion(username);
      if (normalizeLanguage(req.body.language)) {
        normalizeEntitlements(metadata);
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
      await destroySessionToken(req.auth.session.username, req.auth.token);
      clearSessionCookie(req, res);
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

app.get("/api/admin/users", requireAuth, requireAdmin, adminReadLimiter, async (req, res, next) => {
  try {
    const filters = {
      query: req.query.q,
      languages: String(req.query.languages || "").split(",").filter(Boolean),
      plans: String(req.query.plans || "").split(",").filter(Boolean),
    };
    const users = await listAdminUsers(filters);
    const { recipients, unmatched } = broadcastRecipients(users, {
      excludedPlans: String(req.query.excludedPlans || "").split(",").filter(Boolean),
      excludedAccounts: String(req.query.excludedAccounts || "").split(",").filter(Boolean),
      excludeBanned: req.query.excludeBanned === "true",
    });
    const limit = Math.min(50, Math.max(10, Number.parseInt(req.query.limit, 10) || 25));
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const pages = Math.max(1, Math.ceil(users.length / limit));
    const safePage = Math.min(page, pages);
    res.json({
      users: users.slice((safePage - 1) * limit, safePage * limit),
      total: users.length,
      eligibleRecipients: recipients.length,
      recipientDigest: sha256([...recipients].sort().join("\n")),
      unmatchedExclusions: unmatched,
      page: safePage,
      pages,
      filters: normalizeAdminFilters(filters),
      email: await emailDeliveryStatus(),
    });
  } catch (error) { next(error); }
});

app.post("/api/admin/broadcast", requireAuth, requireAdmin, adminBroadcastLimiter, requireCsrf, async (req, res, next) => {
  try {
    const content = validateBroadcastContent(req.body || {});
    const password = String(req.body?.password || "");
    if (!(await verifyPasswordForAccount(req.admin, password)))
      return jsonError(res, 401, "invalid_password", "Your current password is incorrect.");
    const users = await listAdminUsers(req.body?.filters || {});
    const { recipients, unmatched } = broadcastRecipients(users, req.body?.filters || {});
    if (unmatched.length)
      throw Object.assign(new Error("Some excluded accounts do not match the selected users. Check the usernames or email addresses before sending."), { status: 400, code: "unmatched_exclusions" });
    if (recipients.length !== req.body?.expectedRecipients || sha256([...recipients].sort().join("\n")) !== req.body?.expectedRecipientDigest)
      throw Object.assign(new Error("The recipient count has changed. Refresh the preview before sending."), { status: 409, code: "recipients_changed" });
    await sendAdminBroadcast({ ...content, recipients, adminUsername: req.auth.session.username });
    res.json({ ok: true, recipients: recipients.length, email: await emailDeliveryStatus() });
  } catch (error) { next(error); }
});

app.get("/api/sessions", requireAuth, async (req, res, next) => {
  try {
    const currentId = sha256(req.auth.token);
    const sessions = await withLock(`sessions:${req.auth.session.username}`, () =>
      pruneUserSessions(req.auth.session.username),
    );
    const now = Date.now();
    const items = Object.entries(sessions)
      .filter(([, session]) =>
        session.username === userKey(req.auth.session.username) &&
        now < Date.parse(session.expiresAt || 0),
      )
      .map(([id, session]) => ({
        id,
        current: id === currentId,
        device: session.device || "Browser",
        ip: session.ip || "Unavailable",
        location: session.location || { country: null },
        createdAt: session.createdAt,
        lastSeenAt: session.lastSeenAt || session.createdAt,
      }))
      .sort((left, right) => Date.parse(right.lastSeenAt) - Date.parse(left.lastSeenAt));
    res.json({ sessions: items });
  } catch (error) {
    next(error);
  }
});
app.post("/api/sessions/:id/logout", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    if (!/^[a-f0-9]{64}$/.test(req.params.id))
      return jsonError(res, 404, "session_not_found", "Signed-in device not found.");
    if (safeEqual(req.params.id, sha256(req.auth.token)))
      return jsonError(res, 400, "current_session", "Use Log out to end this session.");
    await withLock(`sessions:${req.auth.session.username}`, async () => {
      const sessions = await readUserSessions(req.auth.session.username);
      const target = sessions[req.params.id];
      if (!target || target.username !== userKey(req.auth.session.username))
        throw Object.assign(new Error("Signed-in device not found."), { status: 404, code: "session_not_found" });
      delete sessions[req.params.id];
      await writeUserSessions(req.auth.session.username, sessions);
    });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
app.post("/api/account/message/ack", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const username = req.auth.session.username;
    await withLock(`user:${username}`, async () => {
      const metadata = await loadMetadata(username);
      if (!metadata) throw Object.assign(new Error("Account not found."), { status: 404 });
      metadata.message = null;
      await saveMetadata(username, metadata);
    });
    res.json({ ok: true });
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
        normalizeEntitlements(metadata);
        if (req.body.trashDays !== undefined) {
          if (!planPayload(metadata).canRecover)
            throw Object.assign(
              new Error("Ultra is required to change trash retention."),
              {
                status: 403,
              },
            );
          if (!TRASH_DAYS.includes(req.body.trashDays))
            throw Object.assign(
              new Error("Choose an available trash retention period."),
              {
                status: 400,
              },
            );
          metadata.settings.trashDays = req.body.trashDays;
        }
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
        if (req.body.emailTwoFactor !== undefined) {
          if (req.body.emailTwoFactor === true && !metadata.emailVerified)
            throw Object.assign(new Error("Verify your email before enabling two-step verification."), { status: 400, code: "email_unverified" });
          metadata.emailTwoFactor = req.body.emailTwoFactor === true;
        }
        if (req.body.newPassword !== undefined) {
          const oldPassword = typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
          const nextPassword = typeof req.body.newPassword === "string" ? req.body.newPassword : "";
          if (nextPassword.length < 10 || nextPassword.length > 256 || String(req.body.passwordConfirmation || "") !== nextPassword)
            throw Object.assign(new Error("Enter a matching password between 10 and 256 characters."), { status: 400, code: "weak_password" });
          if (!(await argon2.verify(metadata.passwordHash, oldPassword).catch(() => false)))
            throw Object.assign(new Error("Current password is incorrect."), { status: 401, code: "invalid_credentials" });
          metadata.passwordHash = await argon2.hash(nextPassword, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
        }
        await saveMetadataWithinQuota(username, metadata);
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
      const metadata = await loadMetadata(username);
      const orders = orderStore.list(accountOrderId(metadata), Date.now() - ORDER_RETENTION_MS).map(publicOrder);
      res.json({
        orders,
        retentionDays: 90,
        historyLimit: MAX_ORDER_HISTORY_PER_ACCOUNT,
        supportEmail: SUPPORT_EMAIL,
      });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/billing/create",
  requireAuth,
  billingCreateIpLimiter,
  billingCreateAccountLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    const plan = String(req.body.plan || "").toLowerCase();
    const months = Number(req.body.months);
    const checkoutToken = String(req.body.checkoutToken || "").toLowerCase();
    if (
      !["plus", "pro", "ultra"].includes(plan) ||
      !Number.isInteger(months) ||
      !BILLING_MONTH_OPTIONS.includes(months) ||
      !/^[a-f0-9]{32}$/.test(checkoutToken)
    )
      return jsonError(
        res,
        400,
        "invalid_purchase",
        "Choose a valid plan and an offered subscription duration.",
      );
    try {
      const username = userKey(req.auth.session.username);
      const result = await withLock("orders", async () => {
        const metadata = await loadMetadata(username);
        const accountId = accountOrderId(metadata);
        let order = orderStore.byCheckout(accountId, checkoutToken);
        if (order) {
          if (!retainedOrder(order))
            throw Object.assign(new Error("This payment record is no longer available. Start a new checkout attempt."), { status: 410, code: "order_not_found" });
          if (order.plan !== plan || order.months !== months)
            throw Object.assign(
              new Error("This checkout attempt cannot be changed."),
              {
                status: 409,
              },
            );
          if (
            order.fulfilledAt ||
            order.localStatus === "coupon_reused" ||
            order.localStatus === "expired" ||
            (order.localStatus === "failed" && order.satoraPaymentId) ||
            order.paymentUrl
          )
            return publicOrder(order);
        } else {
          if (
            orderStore.recentCount(
              accountId,
              Date.now() - ORDER_CREATION_WINDOW_MS,
            ) >= MAX_NEW_ORDERS_PER_ACCOUNT_WINDOW
          )
            throw Object.assign(
              new Error("Too many new payment orders. Please try again later."),
              { status: 429, code: "order_rate_limited" },
            );
          orderStore.assertCapacity();
          const createdAt = utcNow();
          const orderId = newId(16);
          order = {
            orderId,
            accountId,
            username,
            plan,
            months,
            expectedSats: PLAN_DEFINITIONS[plan].monthlySats * months,
            localStatus: "created",
            checkoutToken,
            satoraPaymentId: null,
            paymentUrl: null,
            fulfilledAt: null,
            createdAt,
          };
          orderStore.put(order);
        }
        const productSnapshot = `AstraNote ${order.plan[0].toUpperCase() + order.plan.slice(1)} — ${order.months * 30} days`;
        const returnUrl = new URL(SATORA_RETURN_URL);
        returnUrl.searchParams.set("order_id", order.orderId);
        try {
          const created = await satoraRequest("/api/create", {
            method: "POST",
            headers: { "idempotency-key": `astranote:${order.orderId}` },
            body: JSON.stringify({
              product: {
                en: productSnapshot,
                "zh-TW": `AstraNote ${order.plan[0].toUpperCase() + order.plan.slice(1)} — ${order.months * 30} 天`,
                ja: `AstraNote ${order.plan[0].toUpperCase() + order.plan.slice(1)} — ${order.months * 30}日`,
              },
              price: order.expectedSats,
              return_url: returnUrl.href,
            }),
          });
          const paymentUrl = new URL(String(created.url || ""));
          if (
            !/^[A-Za-z0-9_-]{22}$/.test(String(created.id || "")) ||
            paymentUrl.href.length > 2048 ||
            paymentUrl.origin !== new URL(SATORA_BASE_URL).origin ||
            !paymentUrl.pathname.startsWith("/payment/")
          )
            throw Object.assign(
              new Error("Payment service returned an invalid bill."),
              {
                status: 502,
              },
            );
          order.satoraPaymentId = created.id;
          order.paymentUrl = paymentUrl.href;
          order.localStatus = ["confirming", "pending"].includes(created.status)
            ? created.status
            : "confirming";
          orderStore.put(order);
          return publicOrder(order);
        } catch (error) {
          order.localStatus = "failed";
          order.failureCode = String(error.code || "billing_unavailable").slice(
            0,
            60,
          );
          orderStore.put(order);
          throw error;
        }
      });
      res
        .status(201)
        .json({ ok: true, order: result, redirect: result.paymentUrl });
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
      const accountId = accountOrderId(await loadMetadata(username));
      const initial = orderStore.get(orderId, accountId);
      if (!retainedOrder(initial))
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
      if (initial.fulfilledAt || (["coupon_reused", "expired", "failed"].includes(initial.localStatus) && initial.satoraPaymentId))
        return res.json({
          order: publicOrder(initial),
          supportEmail: SUPPORT_EMAIL,
        });
      if (!initial.satoraPaymentId)
        return res.json({
          order: publicOrder(initial),
          supportEmail: SUPPORT_EMAIL,
        });
      let status;
      try {
        status = await satoraRequest(
          `/api/status?id=${encodeURIComponent(initial.satoraPaymentId)}`,
        );
      } catch (error) {
        if ([429, 503].includes(error.status))
          return res.status(error.status).json({
            error: "verification_unavailable",
            message:
              "Payment status is temporarily unavailable. Please try again later.",
            order: publicOrder(initial),
            supportEmail: SUPPORT_EMAIL,
          });
        throw error;
      }
      const result = await withLock("orders", async () => {
        const order = orderStore.get(orderId, accountId);
        if (!retainedOrder(order))
          throw Object.assign(new Error("Order not found."), { status: 404, code: "order_not_found" });
        if (order.fulfilledAt || ["coupon_reused", "expired", "failed"].includes(order.localStatus))
          return order;
        // An expired Satora tombstone can contain only its ID and status, with
        // price=null. This branch grants nothing; paid still needs full checks.
        if (status?.id === order.satoraPaymentId && ["failed", "expired"].includes(status.status)) {
          order.localStatus = status.status;
          order.paymentUrl = null;
          order.txid = typeof status.txid === "string" ? status.txid : null;
          order.failureCode = status.status === "failed" ? "payment_failed" : null;
          orderStore.put(order);
          return order;
        }
        const validIdentity = satoraStatusMatchesOrder(status, order);
        if (!validIdentity) {
          order.localStatus = "verification_error";
          orderStore.put(order);
          return order;
        }
        if (
          ["confirming", "pending"].includes(status.status)
        ) {
          order.localStatus = status.status;
          order.txid = typeof status.txid === "string" ? status.txid : null;
          orderStore.put(order);
          return order;
        }
        if (satoraPaidAmountMatchesOrder(status, order)) {
          const coupon = satoraCouponPolicy(status);
          if (!coupon.valid) {
            order.localStatus = "verification_error";
            order.failureCode = "coupon_identity_missing";
            orderStore.put(order);
            return order;
          }
          let couponAccepted = true;
          if (!order.fulfilledAt) {
            await withLock(`user:${username}`, async () => {
              const metadata = await loadMetadata(username);
              if (!metadata)
                throw Object.assign(new Error("Account not found."), {
                  status: 404,
                });
              if (accountOrderId(metadata) !== accountId)
                throw Object.assign(new Error("Account changed."), {
                  status: 409,
                });
              if (
                coupon.digest &&
                !coupon.reusable &&
                !orderStore.claimCoupon(accountId, coupon.digest, order.orderId)
              ) {
                couponAccepted = false;
                return;
              }
              const now = Date.now();
              normalizeEntitlements(metadata, now);
              metadata.fulfilledOrders ||= [];
              if (!metadata.fulfilledOrders.includes(order.orderId)) {
                const key = `${order.plan}Ms`;
                metadata.entitlements[key] += order.months * PLAN_MONTH_MS;
                metadata.fulfilledOrders.push(order.orderId);
                metadata.emailAuth ||= {};
                metadata.emailAuth.planNotices = {};
              }
              metadata.entitlements.updatedAt = new Date(now).toISOString();
              await refreshPlanState(username, metadata, now);
              await saveMetadata(username, metadata);
            });
            if (couponAccepted) order.fulfilledAt = utcNow();
          }
          order.chargedSats = status.price;
          order.localStatus = couponAccepted ? "paid" : "coupon_reused";
          if (!couponAccepted) order.failureCode = "coupon_reused";
          else delete order.failureCode;
          order.paidAt = status.paid_at || utcNow();
          order.txid = typeof status.txid === "string" ? status.txid : null;
          order.paymentUrl = null;
          orderStore.put(order);
          if (!couponAccepted) return order;
          await withLock(`user:${username}`, async () => {
            const metadata = await loadMetadata(username);
            if (!metadata || accountOrderId(metadata) !== accountId) return;
            metadata.fulfilledOrders = (metadata.fulfilledOrders || []).filter(
              (id) => id !== order.orderId,
            );
            if (!metadata.fulfilledOrders.length)
              delete metadata.fulfilledOrders;
            metadata.emailAuth ||= {};
            metadata.emailAuth.planReceipts ||= [];
            if (metadata.emailVerified && !metadata.emailAuth.planReceipts.includes(order.orderId)) {
              const language = metadata.settings?.language || "en";
              const activeDays = order.months * 30;
              const activatedAt = order.paidAt || utcNow();
              const expiresAt = new Date(Date.parse(activatedAt) + activeDays * 864e5).toISOString();
              const copy = emailCopy(language, "payment", { plan: order.plan, days: activeDays });
              const location = await sessionLocation(req);
              const template = emailTemplate({ ...copy, details: emailAuditDetails(language, metadata, { ip: requestIp(req), country: location.country, plan: order.plan, days: activeDays, activatedAt, expiresAt, status: paymentConfirmedLabel(language) }), expires: false, language });
              await sendMail({ to: metadata.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template });
              metadata.emailAuth.planReceipts = [...metadata.emailAuth.planReceipts.slice(-19), order.orderId];
            }
            await saveMetadata(username, metadata);
          }).catch(() => console.error("Deferred payment receipt cleanup."));
          return order;
        }
        order.localStatus = "verification_error";
        orderStore.put(order);
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
        const reference = metadata.notes.find(
          (item) => item.id === noteId && !item.trashedAt,
        );
        if (reference) {
          const note = await readJson(noteFile(username, noteId), null);
          if (
            !note ||
            !isClientEncryptedMode(note.encryption) ||
            note.encryption === ZERO_MODE ||
            !safeEqual(note.clientSalt, clientSalt)
          )
            return jsonError(res, 404, "not_found", "Note not found.");
          mode = note.encryption;
        } else if (await exists(noteFile(username, noteId))) {
          return jsonError(
            res,
            409,
            "note_id_unavailable",
            "Note ID is unavailable.",
          );
        } else if (![ASTRA_SECRET_MODE, CONFIDENTIAL_MODE].includes(mode)) {
          return jsonError(
            res,
            400,
            "invalid_vault_request",
            "Encryption key request is invalid.",
          );
        }
        if (
          !reference &&
          mode === CONFIDENTIAL_MODE &&
          !access.payload.canCreateConfidential
        )
          return jsonError(
            res,
            403,
            "plan_required",
            "Plus, Pro or Ultra is required to create a Confidential (AstraConfidential) note.",
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
            "This Confidential (AstraConfidential) encryption version is not configured.",
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

app.post(
  "/api/notes/batch-delete",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  verifyCaptchaIfPermanentBatchDelete,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        if (!access.payload.canOrganize)
          throw Object.assign(new Error("Plus, Pro or Ultra is required."), {
            status: 403,
            code: "organization_required",
          });
        const ids = req.body.ids;
        if (
          !Array.isArray(ids) ||
          !ids.length ||
          ids.length > 100 ||
          new Set(ids).size !== ids.length ||
          ids.some((id) => typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id))
        )
          throw Object.assign(new Error("Invalid note selection."), {
            status: 400,
          });
        const refs = ids.map((id) =>
          metadata.notes.find((ref) => ref.id === id && !ref.trashedAt),
        );
        if (refs.some((ref) => !ref))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.payload.canRecover)
          await trashNotes(
            username,
            metadata,
            refs.filter((ref) => !ref.planLockedAt),
          );
        const permanent = new Set(
          refs
            .filter((ref) => !access.payload.canRecover || ref.planLockedAt)
            .map((ref) => ref.id),
        );
        await removeNoteFiles(username, metadata, permanent);
        await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.patch(
  "/api/notes/organize",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        if (!access.payload.canOrganize)
          throw Object.assign(
            new Error("Plus, Pro or Ultra is required to organize notes."),
            { status: 403, code: "organization_required" },
          );
        const ids = req.body.ids;
        if (
          !Array.isArray(ids) ||
          !ids.length ||
          ids.length > 100 ||
          new Set(ids).size !== ids.length ||
          ids.some((id) => typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id))
        )
          throw Object.assign(new Error("Select between 1 and 100 notes."), {
            status: 400,
          });
        const refs = ids.map((id) =>
          metadata.notes.find((ref) => ref.id === id && !ref.trashedAt),
        );
        if (refs.some((ref) => !ref))
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (refs.some((ref) => access.lockedIds.has(ref.id)))
          throw Object.assign(
            new Error("Unlock these notes before organizing them."),
            { status: 423, code: "note_locked" },
          );
        const action = req.body.action;
        if (action === "trash") {
          if (!access.payload.canRecover)
            throw Object.assign(new Error("Ultra is required for trash."), {
              status: 403,
            });
          await trashNotes(username, metadata, refs);
        } else {
          if (!["pin", "archive"].includes(action))
            throw Object.assign(new Error("Invalid organization action."), {
              status: 400,
            });
          if (
            ["pin", "archive"].includes(action) &&
            typeof req.body.value !== "boolean"
          )
            throw Object.assign(new Error("Invalid value."), { status: 400 });
          for (const ref of refs) {
            if (action === "pin") ref.pinned = req.body.value;
            if (action === "archive") ref.archived = req.body.value;
          }
          await saveMetadataWithinQuota(username, metadata);
        }
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/api/trash/:id/restore",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        const ref = metadata.notes.find(
          (item) => item.id === req.params.id && item.trashedAt,
        );
        if (!ref)
          throw Object.assign(new Error("Trash item not found or expired."), {
            status: 404,
          });
        if (access.lockedIds.has(ref.id))
          throw Object.assign(
            new Error("Upgrade to unlock this note before restoring it."),
            {
              status: 423,
              code: "note_locked",
            },
          );
        const activeCount = metadata.notes.filter(
          (item) => !item.trashedAt,
        ).length;
        if (
          access.lockedIds.size ||
          activeCount >= (access.payload.maxNotes ?? Infinity) ||
          (await noteStorageSize(username)) >
            (access.payload.maxBytes ?? Infinity)
        )
          throw Object.assign(
            new Error("Free space or upgrade before restoring this note."),
            { status: 413, code: "restore_quota" },
          );
        const note = await readJson(noteFile(username, ref.id), null);
        if (!note)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        note.shareToken = null;
        note.revision = (note.revision || 0) + 1;
        await writeJson(noteFile(username, ref.id), note);
        delete ref.trashedAt;
        delete ref.trashExpiresAt;
        await saveMetadataWithinQuota(username, metadata);
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.delete(
  "/api/trash/:id",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  verifyCaptcha,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const ref = metadata.notes.find(
          (item) => item.id === req.params.id && item.trashedAt,
        );
        if (!ref)
          throw Object.assign(new Error("Trash item not found."), {
            status: 404,
          });
        await removeNoteFiles(username, metadata, new Set([ref.id]));
        await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/notes/:id/previous", requireAuth, async (req, res, next) => {
  try {
    const username = req.auth.session.username;
    await withLock(`user:${username}`, async () => {
      const metadata = await loadMetadata(username);
      const access = await refreshPlanState(username, metadata);
      await saveMetadata(username, metadata);
      const ref = metadata.notes.find(
        (item) => item.id === req.params.id && !item.trashedAt,
      );
      if (!ref)
        throw Object.assign(new Error("Note not found."), { status: 404 });
      if (access.lockedIds.has(ref.id))
        throw Object.assign(new Error("This note is locked."), {
          status: 423,
          code: "note_locked",
        });
      const note = await readJson(noteFile(username, ref.id), null);
      if (!note?.previous)
        throw Object.assign(new Error("No previous version."), { status: 404 });
      const version = { ...note, ...note.previous };
      const payload = isClientEncryptedMode(note.encryption)
        ? { encrypted: version.content, clientSalt: version.clientSalt }
        : readServerNotePayload(version, username);
      res.json({
        id: note.id,
        name: version.name,
        encryption: note.encryption,
        payloadVersion: version.payloadVersion || 1,
        ...payload,
        updatedAt: version.updatedAt,
        revision: note.revision || 0,
      });
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/notes/:id/previous/restore",
  requireAuth,
  noteSaveLimiter,
  requireCsrf,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        await saveMetadata(username, metadata);
        const ref = metadata.notes.find(
          (item) => item.id === req.params.id && !item.trashedAt,
        );
        if (!ref)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.lockedIds.has(ref.id))
          throw Object.assign(new Error("This note is locked."), {
            status: 423,
            code: "note_locked",
          });
        const file = noteFile(username, ref.id);
        const note = await readJson(file, null);
        if (!note?.previous)
          throw Object.assign(new Error("No previous version."), {
            status: 404,
          });
        if (req.body.revision !== (note.revision || 0))
          throw Object.assign(
            new Error("This note changed. Reload before restoring."),
            { status: 409, code: "note_conflict" },
          );
        const originalBytes = (await fsp.stat(file)).size;
        Object.assign(note, note.previous);
        delete note.previous;
        note.updatedAt = utcNow();
        note.revision = (note.revision || 0) + 1;
        const serialized = JSON.stringify(note, null, 2) + "\n";
        if (
          (await noteStorageSize(username)) -
            originalBytes +
            Buffer.byteLength(serialized) >
          (access.payload.maxBytes ?? Infinity)
        )
          throw Object.assign(
            new Error("Free space before restoring this version."),
            { status: 413, code: "restore_quota" },
          );
        await atomicWrite(file, serialized);
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
    await withLock(`user:${username}`, async () => {
      const metadata = await loadMetadata(username);
      if (!metadata)
        return jsonError(res, 404, "not_found", "Account not found.");
      const access = await refreshPlanState(username, metadata);
      await saveMetadata(username, metadata);
      const reference = metadata.notes.find(
        (ref) => ref.id === req.params.id && !ref.trashedAt,
      );
      if (!reference)
        return jsonError(res, 404, "not_found", "Note not found.");
      const locked = access.lockedIds.has(req.params.id);
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
          locked,
          lockedAt: locked ? reference.planLockedAt : null,
          scheduledDeletionAt: locked ? reference.scheduledDeletionAt : null,
          shared: false,
          shareUrl: null,
          characters: null,
          bytes: (await fsp.stat(noteFile(username, note.id))).size,
          revision: note.revision || 0,
          hasPrevious: locked ? false : Boolean(note.previous),
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
        locked,
        lockedAt: locked ? reference.planLockedAt : null,
        scheduledDeletionAt: locked ? reference.scheduledDeletionAt : null,
        shared: locked ? false : Boolean(note.shareToken),
        shareUrl: !locked && note.shareToken ? `/shared/${note.shareToken}` : null,
        characters: characterCount(payload.content),
        bytes: (await fsp.stat(noteFile(username, note.id))).size,
        revision: note.revision || 0,
        hasPrevious: locked ? false : Boolean(note.previous),
      });
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/notes/:id/ai",
  requireAuth,
  aiMutationLimiter,
  requireCsrf,
  async (req, res, next) => {
    const prompt = String(req.body.prompt || "").trim();
    const submittedTitle = String(req.body.title || "");
    const submittedContent = String(req.body.content || "");
    if (!prompt || prompt.length > AI_MAX_PROMPT_CHARS)
      return jsonError(res, 400, "invalid_ai_prompt", "Enter a shorter Astra AI instruction.");
    if (Buffer.byteLength(submittedContent, "utf8") > AI_MAX_NOTE_BYTES)
      return jsonError(res, 413, "ai_note_too_large", "Astra AI can process up to 64 KB of note content at once.");
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (!metadata) return jsonError(res, 404, "not_found", "Account not found.");
        const access = await refreshPlanState(username, metadata);
        const reference = metadata.notes.find((item) => item.id === req.params.id && !item.trashedAt);
        if (!reference) return jsonError(res, 404, "not_found", "Note not found.");
        if (access.lockedIds.has(reference.id)) return jsonError(res, 423, "note_locked", "Upgrade your plan to unlock this note.");
        const note = await readJson(noteFile(username, reference.id), null);
        if (!note) return jsonError(res, 404, "not_found", "Note not found.");
        let title = submittedTitle;
        let content = submittedContent;
        if (!isClientEncryptedMode(note.encryption)) {
          const payload = readServerNotePayload(note, username);
          title = payload.name;
          content = payload.content;
        }
        if (Buffer.byteLength(content, "utf8") > AI_MAX_NOTE_BYTES)
          return jsonError(res, 413, "ai_note_too_large", "Astra AI can process up to 64 KB of note content at once.");
        const ai = normalizeAiUsage(metadata, access.payload.type);
        if (ai.remainingMicrousd <= 0) {
          await saveMetadata(username, metadata);
          return jsonError(res, 429, "ai_quota_exhausted", "Your Astra AI allowance will refresh in 30 days.");
        }
        let transformed;
        try {
          transformed = await openAiTransform({ title, content, prompt, tier: "flex" });
        } catch (error) {
          if (access.payload.type !== "free" && error.retryable)
            transformed = await openAiTransform({ title, content, prompt, tier: "default" });
          else throw error;
        }
        const cost = aiCostMicrousd(transformed.usage);
        if (Number.isFinite(ai.budgetMicrousd) && cost > ai.remainingMicrousd)
          return jsonError(res, 429, "ai_quota_exhausted", "This Astra AI request exceeds your remaining allowance.");
        metadata.aiUsage.spentMicrousd += cost;
        await saveMetadata(username, metadata);
        const refreshed = normalizeAiUsage(metadata, access.payload.type);
        res.json({ preview: transformed.result, ai: { percent: refreshed.percent, resetsAt: refreshed.resetsAt } });
      });
    } catch (error) { next(error); }
  },
);

app.post(
  "/api/notes",
  requireAuth,
  noteLifecycleLimiter,
  requireCsrf,
  async (req, res, next) => {
    const encryption = String(req.body.encryption || "none").toLowerCase();
    if (!CREATABLE_ENCRYPTION_TYPES.has(encryption))
      return jsonError(
        res,
        400,
        "invalid_encryption",
        "Encryption option is invalid.",
      );
    const clientEncrypted = [
      ASTRA_SECRET_MODE,
      CONFIDENTIAL_MODE,
      ZERO_MODE,
    ].includes(encryption);
    const currentAes = CURRENT_AES_MODES.has(encryption);
    const name = normalizeText(req.body.name, MAX_NOTE_NAME);
    if (!name)
      return jsonError(res, 400, "name_required", "Note name is required.");
    const requestedId = String(req.body.id || "");
    const clientSalt = String(req.body.clientSalt || "");
    if (
      clientEncrypted &&
      ((encryption !== ZERO_MODE && !confidentialSecret) ||
        !/^[a-f0-9]{24}$/.test(requestedId) ||
        !/^[A-Za-z0-9_-]{43}$/.test(clientSalt) ||
        !validClientEnvelope(req.body.encrypted, encryption))
    )
      return jsonError(
        res,
        confidentialSecret || encryption === ZERO_MODE ? 400 : 503,
        confidentialSecret || encryption === ZERO_MODE
          ? "invalid_encrypted_note"
          : "vault_unavailable",
        confidentialSecret || encryption === ZERO_MODE
          ? "Encrypted note data is invalid."
          : "Confidential (AstraConfidential) is not configured.",
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
            new Error(
              "Upgrade your plan or remove locked notes before creating a new note.",
            ),
            { status: 423 },
          );
        if (
          encryption === CONFIDENTIAL_MODE &&
          !access.payload.canCreateConfidential
        )
          throw Object.assign(
            new Error(
              "Plus, Pro or Ultra is required to create a Confidential (AstraConfidential) note.",
            ),
            { status: 403 },
          );
        if (encryption === ZERO_MODE && !access.payload.canCreateZero)
          throw Object.assign(
            new Error("Pro or Ultra is required for Top Secret (AstraZero)."),
            { status: 403 },
          );
        const maxNotes = access.payload.maxNotes ?? Infinity;
        if (metadata.notes.filter((ref) => !ref.trashedAt).length >= maxNotes)
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
          revision: 1,
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
        if ((await noteStorageSize(username)) > maxBytes) {
          metadata.notes = metadata.notes.filter((ref) => ref.id !== id);
          await saveMetadata(username, metadata);
          await fsp.unlink(noteFile(username, id));
          throw Object.assign(
            new Error(
              "This note would exceed your current plan's storage limit.",
            ),
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
        if (
          !metadata.notes.some(
            (ref) => ref.id === req.params.id && !ref.trashedAt,
          )
        )
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.lockedIds.has(req.params.id))
          throw Object.assign(
            new Error("Upgrade your plan to unlock this note."),
            { status: 423, code: "note_locked" },
          );
        const file = noteFile(username, req.params.id);
        const note = await readJson(file, null);
        if (!note)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        const original = await fsp.readFile(file, "utf8");
        const originalBytes = Buffer.byteLength(original, "utf8");
        if (
          req.body.revision !== undefined &&
          req.body.revision !== (note.revision || 0)
        )
          throw Object.assign(
            new Error(
              "This note changed in another tab. Reload before saving.",
            ),
            { status: 409, code: "note_conflict" },
          );
        const snapshot = noteSnapshot(note);
        const isMigration =
          req.body.migrationOnly === true &&
          isClientEncryptedMode(note.encryption) &&
          note.payloadVersion !== 2;
        if (isClientEncryptedMode(note.encryption)) {
          const name = normalizeText(req.body.name, MAX_NOTE_NAME);
          if (!name)
            throw Object.assign(new Error("Note name is required."), {
              status: 400,
            });
          if (!validClientEnvelope(req.body.encrypted, note.encryption))
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
        if (!isMigration) {
          if (access.payload.canRecover) note.previous = snapshot;
          note.revision = (note.revision || 0) + 1;
        }
        const maxBytes = access.payload.maxBytes ?? Infinity;
        const serialized = JSON.stringify(note, null, 2) + "\n";
        if (
          (await noteStorageSize(username)) -
            originalBytes +
            Buffer.byteLength(serialized) >
          maxBytes
        )
          throw Object.assign(
            new Error("Saving would exceed your current plan's storage limit."),
            { status: 413, code: "storage_limit" },
          );
        await atomicWrite(file, serialized);
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
  verifyCaptchaIfPermanentNoteDelete,
  async (req, res, next) => {
    try {
      const username = req.auth.session.username;
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        const access = await refreshPlanState(username, metadata);
        const ref = metadata.notes.find(
          (item) => item.id === req.params.id && !item.trashedAt,
        );
        if (!ref)
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.payload.canRecover && !ref.planLockedAt) {
          await trashNotes(username, metadata, [ref]);
        } else {
          await removeNoteFiles(username, metadata, new Set([ref.id]));
        }
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
        if (
          !metadata.notes.some(
            (ref) => ref.id === req.params.id && !ref.trashedAt,
          )
        )
          throw Object.assign(new Error("Note not found."), { status: 404 });
        if (access.lockedIds.has(req.params.id))
          throw Object.assign(
            new Error("Upgrade your plan to unlock this note."),
            { status: 423, code: "note_locked" },
          );
        const note = await readJson(noteFile(username, req.params.id), null);
        if (isClientEncryptedMode(note?.encryption))
          throw Object.assign(
            new Error("Sharing is unavailable for Confidential (AstraConfidential) notes."),
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
          metadata.notes.some(
            (ref) => ref.id === target.id && !ref.trashedAt,
          ) &&
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
      if (!current.emailVerified)
        return jsonError(res, 403, "email_unverified", "Verify your email before deleting this account.");
      await withLock(`user:${username}`, async () => {
        const metadata = await loadMetadata(username);
        if (actionRecentlySent(metadata, "delete", 1, 3 * 60_000))
          throw Object.assign(new Error("Please wait 3 minutes before requesting another email."), { status: 429, code: "email_rate_limited" });
        const code = makeEmailCode();
        metadata.emailAuth.delete = { digest: codeDigest(code), expiresAt: new Date(Date.now() + EMAIL_TOKEN_MS).toISOString() };
        const copy = emailCopy(metadata.settings?.language || "en", "delete");
        const location = await sessionLocation(req);
        const language = metadata.settings?.language || "en";
        const template = emailTemplate({ ...copy, code, ...emailSecurityNotice(language, "delete"), danger: true, details: emailAuditDetails(language, metadata, { ip: requestIp(req), country: location.country }), language });
        await sendMail({ to: metadata.email, from: "no-reply@mail.nxlabtw.com", subject: copy.subject, template });
        recordActionSent(metadata, "delete");
        await saveMetadata(username, metadata);
      });
      res.json({ ok: true, emailVerificationRequired: true });
    } catch (error) {
      next(error);
    }
  },
);

app.post("/api/account/delete/confirm", requireAuth, accountMutationLimiter, emailCodeIpLimiter, emailCodeAccountLimiter, requireCsrf, async (req, res, next) => {
  try {
    const username = req.auth.session.username;
    const code = String(req.body?.code || "").replace(/\D/g, "");
    const deleted = await withLock(`user:${userKey(username)}`, async () => {
      const metadata = await loadMetadata(username);
      const challenge = metadata?.emailAuth?.delete;
      if (!metadata || !/^\d{6}$/.test(code) || !challenge || Date.parse(challenge.expiresAt) < Date.now() || !codeDigestMatches(challenge.digest, code)) return false;
      await updateShares((shares) => { for (const [key, target] of Object.entries(shares)) if (target.username === userKey(username)) delete shares[key]; });
      const target = path.resolve(userDir(username));
      if (path.dirname(target) !== DATA_DIR) throw new Error("Unsafe account deletion target.");
      await fsp.rm(target, { recursive: true, force: true });
      return true;
    });
    if (!deleted) return jsonError(res, 401, "invalid_code", "The verification code is incorrect or has expired.");
    await destroyUserSessions(username);
    await withLock("registration", async () => { const count = Number.parseInt(await fsp.readFile(USERS_FILE, "utf8"), 10) || 0; await atomicWrite(USERS_FILE, `${Math.max(0, count - 1)}\n`); });
    clearSessionCookie(req, res);
    res.json({ ok: true, redirect: "/" });
  } catch (error) { next(error); }
});

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
app.get("/.well-known/security.txt", (req, res) =>
  res.type("text/plain; charset=utf-8").sendFile(path.join(PUBLIC_DIR, "security.txt")),
);
app.use(express.static(PUBLIC_DIR, { extensions: false, dotfiles: "deny" }));

const pages = {
  "/": "index.html",
  "/login": "login.html",
  "/verify-email": "verify-email.html",
  "/reset-password": "reset-password.html",
  "/register": "register.html",
  "/dashboard": "dashboard.html",
  "/notes": "notes.html",
  "/notes/new": "new-note.html",
  "/trash": "trash.html",
  "/settings": "settings.html",
  "/admin": "admin.html",
  "/terms": "terms.html",
  "/privacy": "privacy.html",
  "/docs": "docs-article.html",
  "/docs/getting-started": "docs-article.html",
  "/docs/notes": "docs-article.html",
  "/docs/encryption": "docs-article.html",
  "/docs/sharing": "docs-article.html",
  "/docs/security": "docs-article.html",
  "/docs/astra-ai": "docs-article.html",
  "/docs/plans": "docs-article.html",
  "/docs/faq": "docs-article.html",
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
  const errorCode = String(error.code || "server_error").slice(0, 120);
  console.error(`[${utcNow()}] [${errorCode}]`, error.stack || error.message);
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
  await purgeRetiredSnapshotData();
  const cleanBilling = () => cleanupBillingRecords().catch(error =>
    console.error(`[${utcNow()}] Billing cleanup failed:`, error.message));
  const billingCleanupTimer = setInterval(cleanBilling, 60 * 60_000);
  billingCleanupTimer.unref();
  cleanBilling();
  const cleanupTimer = setInterval(() => cleanupPlanLocks(), 60 * 60_000);
  cleanupTimer.unref();
  const sessionCleanupTimer = setInterval(
    () => cleanupExpiredSessions().catch((error) =>
      console.error(`[${utcNow()}] Session cleanup failed:`, error.message),
    ),
    6 * 60 * 60_000,
  );
  sessionCleanupTimer.unref();
  app.listen(PORT, () => {
    console.log(`AstraNote listening on port ${PORT}`);
    cleanupPlanLocks().catch((error) =>
      console.error(
        `[${utcNow()}] Initial plan cleanup failed:`,
        error.message,
      ),
    );
    cleanupExpiredSessions().catch((error) =>
      console.error(`[${utcNow()}] Initial session cleanup failed:`, error.message),
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
    ZERO_MODE,
    TRASH_DAYS,
    SCHYBRID_MODE: LEGACY_SCHYBRID_MODE,
    LEGACY_SCHYBRID_MODE,
    CONFIDENTIAL_MODE,
    LEGACY_CONFIDENTIAL_MODE,
    ASTRA_SECRET_MODE,
    LEGACY_AES_MODES,
    CURRENT_AES_MODES,
    PLAN_DEFINITIONS,
    PLAN_MONTH_MS,
    BILLING_MONTH_OPTIONS,
    ORDER_CREATION_WINDOW_MS,
    MAX_NEW_ORDERS_PER_ACCOUNT_WINDOW,
    ORDER_RETENTION_MS,
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
    satoraPricingMatchesOrder,
    satoraStatusMatchesOrder,
    satoraPaidAmountMatchesOrder,
    satoraCouponPolicy,
    isReusableCouponDigest,
    codeDigest,
    legacyCodeDigest,
    codeDigestMatches,
    emailTemplate,
    closeOrderStore: () => {
      orderStore?.close();
      orderStore = null;
    },
    validClientEnvelope,
    refreshPlanState,
    requiredLockedNoteIds,
    noteSnapshot,
    compactOrder,
    recentNewOrderCount,
    accountOrderId,
    cleanupBillingRecords,
    retainedOrder,
    openAiTransform,
    parseCookies,
    publicIpForLookup,
    sessionCookieOptions,
    broadcastRecipients,
  },
};
