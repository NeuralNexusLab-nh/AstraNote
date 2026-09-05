"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function browserContext() {
  const source = fs.readFileSync(
    path.join(__dirname, "../public/app.js"),
    "utf8",
  );
  const context = vm.createContext({
    window: {},
    TextEncoder,
    TextDecoder,
    document: {
      body: { dataset: { page: "test" } },
      documentElement: { dataset: {} },
      querySelector: () => null,
      querySelectorAll: () => [],
    },
  });
  vm.runInContext(source.slice(0, source.lastIndexOf("boot().catch")), context);
  return context;
}
test("locale rendering tolerates pages without retention controls", () => {
  const context = browserContext();
  for (const language of ["en", "zh-Hant", "ja"])
    assert.doesNotThrow(() =>
      vm.runInContext(
        `state.language = "${language}"; applyLocale();`,
        context,
      ),
    );
});
test("every newly introduced feature has all three translations", () => {
  const context = browserContext();
  const required = [
    "zeroPin",
    "zeroExplanation",
    "zeroWarning",
    "comparePlans",
    "organizeFeature",
    "recoveryFeature",
    "prioritySupport",
    "trash",
    "trashBody",
    "trashDays",
    "previousVersion",
    "restoreVersion",
    "searchNotes",
    "searchNotesPlaceholder",
    "noMatchingNotes",
    "moveToTrash",
    "unlockByUpgrade",
    "trashLocked",
    "freeIncluded",
    "freeIncludedBody",
    "zeroHeadline",
    "zeroSummary",
    "zeroPlanSummary",
    "encryptionDetails",
    "plusUsdEstimate",
    "proUsdEstimate",
    "ultraUsdEstimate",
    "usdEstimateNote",
    "zeroPinFeature",
    "zeroShortCaution",
    "zeroClientFeature",
    "zeroNoteFeature",
    "zeroServerFeature",
    "zeroBenefit",
    "expiryLockNotice",
    "lockedAccessTerms",
    "privacyNotebookData",
    "privacyRetention",
    "pin",
    "archive",
    "batchAction",
    "recoveryTerms",
    "billingData",
    "couponOnceTitle",
    "couponOncePolicy",
    "orderCouponReused",
    "couponRejectedBody",
    "orderIdLabel",
    "viewPaymentDetails",
  ];
  for (const language of ["en", "zh-Hant", "ja"])
    for (const key of required)
      assert.equal(
        vm.runInContext(
          `typeof I18N["${language}"]["${key}"] === "string"`,
          context,
        ),
        true,
        `${language}:${key}`,
      );
  assert.equal(vm.runInContext('I18N["zh-Hant"].unlimited', context), "無限");
  assert.equal(vm.runInContext("I18N.ja.unlimited", context), "無限");
  assert.equal(vm.runInContext("I18N.en.unlimited", context), "Infinity");
});

test("title search and simple filters keep pins first without exposing content", () => {
  const context = browserContext();
  context.notes = [
    { id: "new", name: "New", updatedAt: "2026-09-05" },
    { id: "pin", name: "ＰＩＮ 中文", pinned: true, updatedAt: "2026-09-01" },
    {
      id: "archive",
      name: "Archived",
      archived: true,
      updatedAt: "2026-09-04",
    },
    {
      id: "both",
      name: "Pinned archive",
      pinned: true,
      archived: true,
      updatedAt: "2026-09-02",
    },
    {
      id: "locked",
      name: "Locked 日本語",
      locked: true,
      updatedAt: "2026-09-03",
    },
    {
      id: "trash",
      name: "Trash",
      pinned: true,
      trashedAt: "2026-09-05",
      updatedAt: "2026-09-05",
    },
  ];
  const ids = (query = "", mode = "active") =>
    JSON.parse(
      vm.runInContext(
        `JSON.stringify(filterNotes(notes, ${JSON.stringify(query)}, ${JSON.stringify(mode)}).map(n => n.id))`,
        context,
      ),
    );
  assert.deepEqual(ids(), ["both", "pin", "new", "locked"]);
  assert.deepEqual(ids("", "pinned"), ["both", "pin"]);
  assert.deepEqual(ids("", "archived"), ["both", "archive"]);
  assert.deepEqual(ids(" pin 中文 "), ["pin"]);
  assert.deepEqual(ids("日本語"), ["locked"]);
  assert.deepEqual(ids("Trash"), []);
  assert.deepEqual(ids("missing"), []);
  assert.equal(
    context.notes[0].id,
    "new",
    "sort does not mutate the account list",
  );
});

test("paid plan layout, settings support placement and legal locales are complete", () => {
  const read = (name) =>
    fs.readFileSync(path.join(__dirname, "../public", name), "utf8");
  const plans = read("plans.html");
  assert.ok(plans.includes('href="/#encryption"'));
  assert.deepEqual(
    [...plans.matchAll(/data-plan="([a-z]+)"/g)].map((m) => m[1]),
    ["plus", "pro", "ultra", "free"],
  );
  assert.match(plans, /class="[^"]*plan-card-featured[^"]*"\s+data-plan="pro"/);
  assert.equal((plans.match(/data-i18n="expiryLockNotice"/g) || []).length, 2);
  const settings = read("settings.html");
  assert.equal((settings.match(/type="submit"/g) || []).length, 1);
  assert.ok(
    settings.indexOf('class="settings-save-bar"') >
      settings.indexOf('id="trash-settings"'),
  );
  assert.ok(
    settings.indexOf('class="settings-save-bar"') <
      settings.indexOf('class="card danger-zone'),
  );
  const planCard = settings.slice(
    settings.indexOf("plan-settings-card"),
    settings.indexOf("settings-appearance"),
  );
  assert.ok(
    planCard.indexOf('id="priority-support"') >
      planCard.indexOf('data-i18n="managePlan"'),
  );
  for (const name of ["terms.html", "privacy.html"]) {
    const html = read(name);
    for (const lang of ["en", "zh-Hant", "ja"])
      assert.ok(html.includes(`data-lang="${lang}"`));
    assert.ok(!html.includes("瀏覽器"));
  }
  const notes = read("notes.html");
  assert.ok(notes.includes('id="note-search"'));
  assert.equal((notes.match(/data-note-filter=/g) || []).length, 3);
  assert.ok(!/folder|tags/i.test(notes));
  const context = browserContext();
  assert.match(
    vm.runInContext('I18N["zh-Hant"].zeroServerFeature', context),
    /伺服器加密環境變數/,
  );
  const app = read("app.js");
  const comparison = app.slice(
    app.indexOf("function renderPlanComparison()"),
    app.indexOf("function applyLocale()"),
  );
  assert.ok(
    comparison.includes(
      '["organizeFeature", "organizeDetail", [false, true, true, true]]',
    ),
  );
  assert.ok(
    comparison.indexOf('"organizeFeature"') < comparison.indexOf('"AstraZero"'),
  );
  assert.ok(comparison.includes('"1024 KB"'));
  assert.ok(plans.includes("1024 KB"));
  assert.ok(!plans.includes("2 MB"));
});
test("Zero and legacy PIN lengths stay separate", () => {
  const context = browserContext();
  assert.equal(
    vm.runInContext('validVaultPin("1234", ZERO_MODE)', context),
    true,
  );
  assert.equal(
    vm.runInContext('validVaultPin("A!b2-C3_d4.E5+f6", ZERO_MODE)', context),
    true,
  );
  assert.equal(
    vm.runInContext('validVaultPin("x".repeat(17), ZERO_MODE, true)', context),
    false,
  );
  assert.equal(
    vm.runInContext(
      'validVaultPin("x".repeat(32), CONFIDENTIAL_MODE, true)',
      context,
    ),
    true,
  );
  assert.equal(
    vm.runInContext(
      'validVaultPin("x".repeat(32), CONFIDENTIAL_MODE)',
      context,
    ),
    false,
  );
  assert.equal(
    vm.runInContext('validVaultPin("abcd", ASTRA_SECRET_MODE)', context),
    false,
  );
});

test("selected notes use direct action buttons, with reversible states and no action picker", () => {
  const context = browserContext();
  const choose = (notes) => {
    context.selectedNotes = notes;
    return JSON.parse(
      vm.runInContext(
        "JSON.stringify(selectionActions(selectedNotes))",
        context,
      ),
    );
  };
  assert.deepEqual(choose([{ pinned: true, archived: true }]), {
    pin: false,
    archive: false,
  });
  assert.deepEqual(choose([{ pinned: true }, { pinned: false }]), {
    pin: true,
    archive: true,
  });
  assert.deepEqual(choose([{ archived: true }, { archived: true }]), {
    pin: true,
    archive: false,
  });
  const html = fs.readFileSync(
    path.join(__dirname, "../public/notes.html"),
    "utf8",
  );
  for (const id of ["batch-pin", "batch-archive", "batch-delete"])
    assert.ok(html.includes(`id="${id}"`));
  const app = fs.readFileSync(path.join(__dirname, "../public/app.js"), "utf8");
  assert.ok(!app.includes("organize-action"));
  assert.ok(!app.includes("organizeNotes("));
  assert.ok(app.includes("deleteSelectedNotes"));
});

test("payment return reloads once after backend fulfilment, never for pending or rejected payments", async () => {
  const context = browserContext();
  const element = () => ({ dataset: {}, append() {} });
  context.document.querySelector = element;
  context.document.createElement = element;
  context.URLSearchParams = URLSearchParams;
  let reloads = 0;
  const redirects = [];
  context.location = {
    href: "https://astranote.nxlabtw.com/plans/return?order_id=order-a",
    reload: () => reloads++,
    replace: (url) => redirects.push(url),
  };
  context.history = {
    state: { unrelated: "preserved" },
    replaceState(state) {
      this.state = state;
    },
  };
  context.order = { orderId: "order-a", expectedSats: 12500, days: 30 };
  vm.runInContext(
    "api = async () => ({order}); loadOrders = async () => {};",
    context,
  );
  for (const localStatus of [
    "pending",
    "confirming",
    "failed",
    "expired",
    "verification_error",
    "coupon_reused",
    "paid",
  ]) {
    context.order.localStatus = localStatus;
    await vm.runInContext('renderBillingReturn("order-a")', context);
    assert.equal(
      reloads,
      0,
      `${localStatus} without fulfilment must not reload`,
    );
  }
  context.order.fulfilledAt = "2026-09-05T00:00:00Z";
  await vm.runInContext('renderBillingReturn("order-a")', context);
  assert.equal(reloads, 1);
  assert.equal(context.history.state.unrelated, "preserved");
  await vm.runInContext('renderBillingReturn("order-a")', context);
  assert.equal(reloads, 1, "history marker survives the new page load");
  context.order.orderId = "order-b";
  await vm.runInContext('renderBillingReturn("order-b")', context);
  assert.equal(reloads, 2, "a different fulfilled order refreshes again");
  context.order.orderId = "order-c";
  context.history.replaceState = () => {
    throw new Error("History unavailable");
  };
  await vm.runInContext('renderBillingReturn("order-c")', context);
  assert.deepEqual(redirects, ["/plans"]);
});

test("the real selection handlers initialize, submit exact unlocked IDs, and retain selection", async () => {
  const context = browserContext();
  const element = () => ({
    value: "",
    hidden: false,
    disabled: false,
    children: [],
    dataset: {},
    classList: { add() {}, toggle() {} },
    setAttribute() {},
    addEventListener() {},
    append(...items) {
      this.children.push(...items);
    },
    prepend(...items) {
      this.children.unshift(...items);
    },
    replaceChildren(...items) {
      this.children = items;
    },
    querySelectorAll() {
      return [];
    },
  });
  const elements = new Map();
  const get = (selector) => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  context.document.querySelector = get;
  context.document.querySelectorAll = (selector) =>
    selector === "#batch-actions button"
      ? [get("#batch-pin"), get("#batch-archive"), get("#batch-delete")]
      : [];
  context.document.createElement = element;
  context.document.addEventListener = () => {};
  context.fakeRow = element;
  context.accountFixture = {
    plan: { canOrganize: true, canRecover: true },
    notes: [
      { id: "a", name: "A", updatedAt: "2026-09-05" },
      { id: "b", name: "B", pinned: true, updatedAt: "2026-09-04" },
      { id: "locked", name: "Locked", locked: true, updatedAt: "2026-09-03" },
    ],
  };
  context.calls = [];
  context.messages = [];
  await vm.runInContext(
    `
    requireAccount = async () => (state.account = accountFixture);
    noteRow = () => fakeRow();
    toast = message => messages.push(message);
    api = async (route, options) => {
      if (route === "/api/account") return accountFixture;
      calls.push(options.body);
      for (const note of accountFixture.notes) {
        if (options.body.ids.includes(note.id)) note[options.body.action === "pin" ? "pinned" : "archived"] = options.body.value;
      }
      return { ok: true };
    };
    initNotes();`,
    context,
  );
  get("#select-all").onchange({ target: { checked: true } });
  assert.equal(get("#selected-count").textContent, "2 selected");
  assert.equal(get("#batch-actions").hidden, false);
  await get("#batch-pin").onclick();
  assert.deepEqual(JSON.parse(JSON.stringify(context.calls[0])), {
    ids: ["b", "a"],
    action: "pin",
    value: true,
  });
  assert.equal(get("#batch-pin span").textContent, "Unpin");
  assert.equal(get("#selected-count").textContent, "2 selected");
  await get("#batch-archive").onclick();
  assert.equal(get("#batch-archive span").textContent, "Unarchive");
  assert.equal(
    get("#selected-count").textContent,
    "2 selected",
    "pinned archived notes stay visible",
  );
  assert.equal(get("#batch-pin").disabled, false);
  assert.equal(context.messages.length, 0);
});
