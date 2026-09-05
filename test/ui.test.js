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
    "folder",
    "tags",
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
