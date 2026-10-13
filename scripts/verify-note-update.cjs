"use strict";
// Isolated acceptance/visual harness. Never reads production accounts, ENV or mail.
const fs = require("node:fs/promises"), os = require("node:os"), path = require("node:path"), crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/eaton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const stamp = () => new Date().toISOString();
let browser, server, directory, activePage, artifactDirectory;
let closeStore = () => {};
async function run() {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-acceptance-"));
  const artifacts = await fs.mkdtemp(path.join(os.tmpdir(), "astranote-visuals-"));
  artifactDirectory = artifacts;
  process.env.DATA_DIR = directory;
  process.env.ASTRANOTE_SECRET = crypto.randomBytes(64).toString("base64url");
  process.env.ASTRA_CONFIDENTIAL_KEY = crypto.randomBytes(64).toString("base64url");
  process.env.ASTRANOTE_VAULT_SECRET = crypto.randomBytes(64).toString("base64url");
  process.env.API_KEY = "isolated-test-placeholder";
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (String(url).includes("nexacaptcha") && String(url).includes("siteverify")) return Response.json({ success: true });
    if (String(url).startsWith("https://api.openai.com/")) return Response.json({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ message: "Updated test note.", title: "Agent test title", content: "Agent test content" }) }] }], usage: { input_tokens: 100, output_tokens: 50 } });
    if (!String(url).startsWith("http://127.0.0.1:")) throw new Error("External request blocked by isolated acceptance harness");
    return originalFetch(url, options);
  };
  const core = require("../server");
  closeStore = core.testables.closeOrderStore;
  await core.ensureData();
  server = require("../bootstrap").createOuterApp().listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const username = "codex_update_qa", csrf = crypto.randomBytes(20).toString("hex"), token = crypto.randomBytes(32).toString("base64url");
  const userDir = path.join(directory, username);
  await fs.mkdir(path.join(userDir, "notes"), { recursive: true });
  const metadata = { username, email: "codex@example.test", displayName: "Codex QA", emailVerified: true, passwordHash: await require("argon2").hash("Qa9!TemporaryOnly"), cryptoFactor: crypto.randomBytes(48).toString("base64url"), createdAt: stamp(), settings: { theme: "dark", language: "en" }, entitlements: { ultraMs: 30 * 864e5, plusMs: 0, proMs: 0, updatedAt: stamp() }, notes: [] };
  await fs.writeFile(path.join(userDir, "metadata.json"), JSON.stringify(metadata));
  await fs.writeFile(path.join(userDir, "sessions.json"), JSON.stringify({ [crypto.createHash("sha256").update(token).digest("hex")]: { username, csrf, ip: "127.0.0.1", device: "Edge", createdAt: stamp(), expiresAt: new Date(Date.now() + 864e5).toISOString(), maxExpiresAt: new Date(Date.now() + 28 * 864e5).toISOString() } }));
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  await context.addCookies([{ name: "astranote_session", value: `${username}.${token}`, url: base }]);
  await context.addInitScript(() => { localStorage.setItem("astranote_cookie_notice", "accepted"); if (!localStorage.getItem("astranote_language")) localStorage.setItem("astranote_language", "en"); });
  const page = await context.newPage();
  activePage = page;
  let navigation = 1;
  await context.route(base + "/**", async route => {
    if (route.request().isNavigationRequest()) navigation++;
    await route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": `198.51.${Math.floor(navigation / 200)}.${navigation % 200 + 1}` } });
  });
  const failures = [];
  page.on("pageerror", error => failures.push(error.message));
  await page.route("**/nexacaptcha.*/**", route => route.fulfill({ status: 200, body: "" }));
  const waitApp = async () => { await page.waitForFunction(() => typeof state !== "undefined" && state.account); await page.locator(".site-nav").waitFor(); };
  if (process.argv.includes("--pass-layout")) {
    for (const width of [1440, 1024, 768, 430, 390, 360, 320, 844]) for (const language of ["en", "zh-Hant", "ja"]) for (const theme of ["dark", "light"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/limited-edit");
      await page.waitForLoadState("networkidle");
      await page.evaluate(({language, theme}) => { state.language = language; state.theme = theme; applyLocale(); }, {language, theme});
      const title = await page.locator("#limited-login-card h1").evaluate(el => ({ height: el.getBoundingClientRect().height, line: parseFloat(getComputedStyle(el).lineHeight), overflow: document.documentElement.scrollWidth > innerWidth }));
      assert.ok(title.height <= title.line * 2 + 1 && !title.overflow);
      if (width === 320) await page.screenshot({ path: path.join(artifacts, `pass-320-${language}-${theme}.png`), fullPage: true, animations: "disabled" });
    }
    console.log(JSON.stringify({ success: true, passLayoutChecks: 48, screenshots: artifacts }));
    return;
  }
  const notes = [];
  for (const [mode, pin] of [["none", null], ["aes-256-gcm-new", null], ["astra-secret-v1", "938471"], ["astra-confidential-v3", "a!9B2@kL4#pQ"], ["astra-zero-v1", "Z!4m8@qR2#sT"]]) {
    console.log("Testing note mode:", mode);
    await page.goto(base + "/notes/new"); await waitApp();
    await page.locator("#name").fill(`QA ${mode}`);
    await page.locator("#new-content").fill("Original QA text\nSecond unchanged line\n第三行🙂");
    await page.locator("#encryption").selectOption(mode);
    if (pin) { await page.locator("#vault-pin").click(); await page.locator("#vault-pin").fill(pin); await page.locator("#vault-pin-confirm").click(); await page.locator("#vault-pin-confirm").fill(pin); }
    await page.locator("#note-form button[type=submit]").click();
    await page.waitForURL(/\/notes\/[a-f0-9]{24}$/);
    await page.locator("#note-content").filter({ hasText: "Original QA text" }).waitFor();
    const id = page.url().split("/").at(-1); notes.push({ id, mode, pin });
    await page.goto(base + `/notes/${id}/edit`);
    await page.locator("#editor-content").filter({ visible: true }).waitFor();
    await page.waitForFunction(() => document.querySelector("#editor-content")?.value.includes("Original QA text"));
    assert.equal(await page.locator(".modal-backdrop").count(), 0, "cached unlock must avoid a second PIN prompt");
    for (let version = 1; version <= 3; version++) {
      await page.locator("#editor-name").fill(`QA title ${version}`);
      await page.locator("#editor-content").fill(`Changed ${version}\nSecond unchanged line\n第三行🙂`);
      await page.locator("#save-note").click(); await page.waitForURL(new RegExp(`/notes/${id}$`));
      await page.locator("#note-content").filter({ hasText: `Changed ${version}` }).waitFor();
      if (version < 3) { await page.goto(base + `/notes/${id}/edit`); await page.waitForFunction(() => document.querySelector("#editor-content")?.value.startsWith("Changed")); }
    }
    await page.locator("#previous-note").click();
    await page.locator("#history-version").selectOption("3");
    await page.locator("#previous-content").filter({ hasText: "Original QA text" }).waitFor();
    await page.locator("#restore-previous").click();
    await page.locator(".modal-actions .btn-primary").click();
    await page.locator("#note-content").filter({ hasText: "Original QA text" }).waitFor();
    const stored = JSON.parse(await fs.readFile(path.join(userDir, "notes", id + ".json"), "utf8"));
    assert.equal(stored.history.length, 3);
    assert.ok(stored.history.every(entry => entry.kind === "delta"));
    if (pin) {
      const cache = await page.evaluate(() => Object.entries(sessionStorage).filter(([key]) => key.startsWith("astranote_unlock_v1:")));
      assert.ok(cache.length > 0); assert.ok(cache.every(([, value]) => value !== pin && !value.includes("Original QA text")));
      assert.ok(!JSON.stringify(stored).includes("Original QA text"));
      assert.equal(await page.evaluate(async id => {
        const note = await api(`/api/notes/${id}`);
        const decrypted = await decryptConfidentialPayload(note, null);
        Object.assign(note, decrypted.payload);
        const response = await api(`/api/notes/${id}/previous`);
        response.chain[0].data.ciphertext = (response.chain[0].data.ciphertext[0] === "A" ? "B" : "A") + response.chain[0].data.ciphertext.slice(1);
        try { await decryptHistoryChain(note, response); return false; } catch { return true; }
      }, id), true, "tampered encrypted history must fail authentication");
    }
  }
  // A fresh tab cannot reuse another tab's unlocked keys.
  const fresh = await context.newPage();
  await fresh.goto(base + `/notes/${notes.at(-1).id}`);
  await fresh.locator(".vault-unlock input").waitFor();
  await fresh.close();
  // Batch Agent must ask for each uncached PIN before the instruction exists.
  await page.evaluate(() => forgetUnlockedNotes());
  await page.goto(base + "/notes"); await page.locator(".note-select input").first().waitFor();
  for (const note of notes.filter(note => note.pin)) await page.locator(`[data-note-id="${note.id}"] .note-select input`).check();
  await page.locator("#batch-agent").click();
  for (let i = 0; i < 3; i++) {
    await page.locator(".vault-unlock input").waitFor();
    assert.equal(await page.locator(".astra-ai-form textarea").count(), 0);
    const heading = await page.locator(".modal h2").textContent();
    // Current title is identical across fixtures, so use sequential creation order (newest first).
    assert.ok(heading.length > 0);
    const expected = notes.filter(note => note.pin).reverse()[i];
    await page.locator(".vault-unlock input").click(); await page.locator(".vault-unlock input").fill(expected.pin);
    await page.locator(".modal-actions .btn-primary").click();
    await page.waitForTimeout(200);
  }
  await page.locator(".astra-ai-form textarea").waitFor();
  await page.locator(".astra-ai-form textarea").fill("Rewrite this test text clearly.");
  await page.locator(".modal-actions .btn-primary").click();
  await page.locator(".batch-agent-note").first().waitFor();
  assert.equal(await page.locator(".batch-agent-note").count(), 3);
  await page.locator(".modal-actions .btn-primary").click();
  await page.locator(".batch-agent-preview").waitFor({ state: "detached" });
  // AstraPass uses the same key cache and writes encrypted differences back
  // to the owner, without depending on a normal account session in the tab.
  const passNote = notes.find(note => note.mode === "astra-secret-v1");
  await page.goto(base + `/notes/${passNote.id}`);
  await page.locator("#note-content").filter({ hasText: "Agent test content" }).waitFor();
  await page.locator("#limited-edit").click();
  await page.locator(".modal-actions button:last-child").click();
  await page.getByLabel("AstraPass account name", { exact: true }).fill("qa_pass_once");
  await page.getByLabel("Password", { exact: true }).fill("Qa9!ShortPass");
  await page.getByLabel("Confirm password", { exact: true }).fill("Qa9!ShortPass");
  assert.equal(await page.getByLabel("Allow Astra Agent").isChecked(), true);
  await page.locator(".modal-actions .btn-primary").click();
  await page.locator(".limited-editor-credentials").waitFor();
  await page.locator(".modal-actions .btn-primary").click();
  const guestContext = await browser.newContext();
  await guestContext.addInitScript(() => { localStorage.setItem("astranote_cookie_notice", "accepted"); localStorage.setItem("astranote_language", "en"); });
  await guestContext.route(/nexacaptcha\./, route => route.fulfill({ body: "" }));
  const guest = await guestContext.newPage();
  await guest.goto(base + "/limited-edit");
  await guest.waitForFunction(() => typeof state !== "undefined" && state.limited);
  await guest.locator('[name="username"]').fill("qa_pass_once");
  await guest.locator('[name="password"]').fill("Qa9!ShortPass");
  await guest.evaluate(() => { state.captcha = { verificationId: "v".repeat(16), responseToken: "r".repeat(64) }; });
  await guest.locator('#limited-login-form button[type="submit"]').click();
  await guest.locator(".modal input").waitFor();
  await guest.locator(".modal input").click();
  await guest.locator(".modal input").fill(passNote.pin);
  await guest.locator(".modal-actions .btn-primary").click();
  await guest.waitForFunction(() => document.querySelector("#limited-editor-content")?.value === "Agent test content");
  await guest.locator("#limited-editor-content").fill("Updated through AstraPass");
  await guest.locator('#limited-note-form button[type="submit"]').click();
  await guest.waitForFunction(() => document.querySelector("#limited-editor-content")?.value === "Updated through AstraPass");
  assert.equal(await guest.locator(".modal-backdrop").count(), 0);
  const passSaved = JSON.parse(await fs.readFile(path.join(userDir, "notes", passNote.id + ".json"), "utf8"));
  assert.equal(passSaved.history[0].kind, "delta");
  assert.ok(!JSON.stringify(passSaved).includes("Updated through AstraPass"));
  await guestContext.close();
  // Eight viewports × three locales × two themes × affected pages.
  const sizes = [[1440,900],[1024,768],[768,1024],[430,932],[390,844],[360,740],[320,568],[844,390]];
  let inspected = 0;
  const captures = [];
  for (const [width, height] of sizes) for (const language of ["en", "zh-Hant", "ja"]) for (const theme of ["dark", "light"]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(async ({language, theme}) => {
      localStorage.setItem("astranote_language", language);
      await api("/api/settings", { method: "PATCH", body: { language, theme } });
    }, {language, theme});
    for (const route of ["/notes/new", "/settings", `/notes/${notes.at(-1).id}`, "/limited-edit", "/docs/notes", "/docs/encryption"]) {
      await page.goto(base + route); await page.waitForLoadState("networkidle");
      await page.evaluate(({language, theme}) => { state.language = language; state.theme = theme; applyLocale(); }, {language, theme});
      if (route === "/notes/new") await page.locator("#encryption").selectOption("astra-zero-v1");
      if (/\/notes\/[a-f0-9]+$/.test(route)) await page.locator("#note-content").filter({ hasText: "Agent test content" }).waitFor();
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible")));
      const overflow = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll("main *,nav *")].filter(element => { const r = element.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 2 || r.left < -2) && getComputedStyle(element).position !== "fixed"; }).slice(0,8).map(element => element.tagName + "." + element.className) }));
      assert.ok(overflow.content <= width + 2, JSON.stringify({ route, language, theme, width, overflow }));
      inspected++;
      const selector = route === "/notes/new" ? "#vault-fields" : route === "/settings" ? "#trash-settings" : route === "/limited-edit" ? "#limited-login-card" : null;
      if (selector) {
        const capture = path.join(artifacts, `${route.replaceAll("/", "_")}-${width}-${language}-${theme}-detail.png`);
        await page.locator(selector).screenshot({ path: capture, animations: "disabled" });
        captures.push({ route, width, height, language, theme, path: capture });
      }
      if ((width === 320 || width === 390 || width === 1440) && language === "zh-Hant" && ["/notes/new", "/settings", "/limited-edit"].includes(route))
        await page.screenshot({ path: path.join(artifacts, `${route.replaceAll("/", "_")}-${width}-${theme}.png`), fullPage: true, animations: "disabled" });
    }
  }
  const sharp = require("C:/Users/eaton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
  for (const route of ["/notes/new", "/settings", "/limited-edit"]) for (const theme of ["dark", "light"]) {
    const tiles = [];
    for (const item of captures.filter(item => item.route === route && item.theme === theme)) {
      const row = sizes.findIndex(([width]) => width === item.width), column = ["en", "zh-Hant", "ja"].indexOf(item.language);
      const input = await sharp(item.path).resize({ width: 320, height: 520, fit: "inside", withoutEnlargement: true }).toBuffer();
      const label = Buffer.from(`<svg width="336" height="32"><rect width="336" height="32" fill="#20212c"/><text x="8" y="22" fill="white" font-size="15" font-family="Arial">${item.width} x ${item.height} / ${item.language} / ${theme}</text></svg>`);
      tiles.push({ input: label, left: column * 336, top: row * 560 }, { input, left: column * 336 + 8, top: row * 560 + 36 });
    }
    await sharp({ create: { width: 1008, height: 4480, channels: 4, background: "#363744" } }).composite(tiles).png().toFile(path.join(artifacts, `sheet-${route.replaceAll("/", "_")}-${theme}.png`));
  }
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({ success: true, functionalModes: notes.map(note => note.mode), visualChecks: inspected, screenshots: artifacts }));
}
run().catch(async error => {
  console.error(error);
  if (activePage && artifactDirectory) {
    console.error("Failure page:", activePage.url());
    console.error((await activePage.locator("body").innerText()).slice(-1800));
    await activePage.screenshot({ path: path.join(artifactDirectory, "failure.png"), fullPage: true }).catch(() => {});
    console.error("Screenshots:", artifactDirectory);
  }
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  closeStore();
  // Only the generated, uniquely named test directory is removed.
  if (directory && path.dirname(directory) === os.tmpdir() && path.basename(directory).startsWith("astranote-acceptance-")) await fs.rm(directory, { recursive: true, force: true });
});
