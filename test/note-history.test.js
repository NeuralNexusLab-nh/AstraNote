"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const history = require("../public/note-history");

test("reverse patches preserve unicode, separated edits, empty lines and full rewrites", () => {
  const cases = [
    ["", "字"], ["你好🙂\n第二行\n", "你🙂\n另一行\n"], ["a\nb\nc\nd\n", "A\nb\nc\nD\n"],
    ["a".repeat(20_000), "b".repeat(20_000)], ["\n\n", ""], ["emoji👨‍👩‍👧‍👦", "emoji🙂"],
  ];
  for (const [a, b] of cases) assert.equal(history.apply(a, history.diff(a, b)), b);
  let seed = 42;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  const alphabet = ["a", "b", "文", "🙂", "\n", " ", "é"];
  for (let run = 0; run < 300; run++) {
    const a = Array.from({ length: random() % 250 }, () => alphabet[random() % alphabet.length]).join("");
    const b = Array.from({ length: random() % 250 }, () => alphabet[random() % alphabet.length]).join("");
    assert.equal(history.apply(a, history.diff(a, b)), b);
  }
});
test("small edits keep only differences, and malformed patches cannot expand without bounds", () => {
  const current = { name: "New", content: "unchanged\n".repeat(1000) + "new\n" };
  const previous = { name: "Old", content: "unchanged\n".repeat(1000) + "old\n" };
  const patch = history.reverse(current, previous);
  assert.deepEqual(history.restore(current, patch), previous);
  assert.ok(JSON.stringify(patch).length < 150);
  for (const patch of [[[-1, 0, "x"]], [[0, 500, ""]], [[1, 1, ""], [0, 1, "x"]], [[0, 0, {}]]])
    assert.throws(() => history.apply("abc", patch));
  assert.throws(() => history.apply("abc", [[0, 0, "x".repeat(4_200_001)]]));
});
