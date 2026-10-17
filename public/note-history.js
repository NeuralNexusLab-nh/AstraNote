/* Shared, bounded reverse text patches. No network or storage access. */
(function (root) {
  "use strict";
  const MAX_TEXT = 4_200_000;
  function span(before, after, offset = 0) {
    let start = 0, end = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;
    while (end < before.length - start && end < after.length - start && before[before.length - 1 - end] === after[after.length - 1 - end]) end++;
    return before === after ? [] : [[offset + start, before.length - start - end, after.slice(start, after.length - end)]];
  }
  function diff(current, previous) {
    if (typeof current !== "string" || typeof previous !== "string" || Math.max(current.length, previous.length) > MAX_TEXT) throw new Error("Invalid history text.");
    if (current === previous) return [];
    // Match unchanged lines with bounded LCS; character-trim each changed block.
    // Large documents use a linear prefix/suffix patch instead of unbounded work.
    const a = current.match(/[^\n]*\n|[^\n]+$/g) || [];
    const b = previous.match(/[^\n]*\n|[^\n]+$/g) || [];
    if (a.length * b.length > 500_000) return span(current, previous);
    const width = b.length + 1, matrix = new Uint32Array((a.length + 1) * width);
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        matrix[i * width + j] = a[i] === b[j] ? 1 + matrix[(i + 1) * width + j + 1] : Math.max(matrix[(i + 1) * width + j], matrix[i * width + j + 1]);
    const patches = [];
    let i = 0, j = 0, offset = 0, removed = "", added = "";
    const flush = () => { patches.push(...span(removed, added, offset)); offset += removed.length; removed = ""; added = ""; };
    while (i < a.length || j < b.length) {
      if (i < a.length && j < b.length && a[i] === b[j]) { flush(); offset += a[i++].length; j++; }
      else if (i < a.length && (j === b.length || matrix[(i + 1) * width + j] >= matrix[i * width + j + 1])) removed += a[i++];
      else added += b[j++];
    }
    flush();
    return patches;
  }
  function apply(text, patches) {
    if (typeof text !== "string" || !Array.isArray(patches) || patches.length > 100_000) throw new Error("Invalid history patch.");
    let offset = 0, size = 0;
    const parts = [];
    for (const item of patches) {
      if (!Array.isArray(item) || item.length !== 3) throw new Error("Invalid history patch.");
      const [at, remove, insert] = item;
      if (!Number.isSafeInteger(at) || !Number.isSafeInteger(remove) || at < offset || remove < 0 || at + remove > text.length || typeof insert !== "string") throw new Error("Invalid history patch.");
      size += at - offset + insert.length;
      if (size > MAX_TEXT) throw new Error("History text is too large.");
      parts.push(text.slice(offset, at), insert);
      offset = at + remove;
    }
    if (size + text.length - offset > MAX_TEXT) throw new Error("History text is too large.");
    return parts.join("") + text.slice(offset);
  }
  const Document = typeof module !== "undefined" && module.exports ? require("./note-document") : root.AstraDocument;
  const textState = payload => ({ name: payload.name, content: Document.unpack(payload.content).text });
  const retainImages = (restored, current) => ({ name: restored.name, content: Document.pack(Document.unpack(restored.content).text, Document.unpack(current.content).images) });
  const reverse = (current, previous) => {
    const a = textState(current), b = textState(previous);
    // V3 never includes image bytes, captions or drawing data. Images are the
    // current attachment set, independent of the text revision being viewed.
    return { v: 3, name: diff(a.name, b.name), content: diff(a.content, b.content) };
  };
  function restore(current, patch) {
    if (patch?.v === 3) return { name: apply(current.name, patch.name), content: Document.pack(apply(Document.unpack(current.content).text, patch.content), Document.unpack(current.content).images) };
    // Decode legacy revisions internally for compatibility and integrity
    // checks. Callers retain the live image set before displaying or saving.
    if (patch?.v === 2) return { name: apply(current.name, patch.name), content: Document.pack(apply(Document.unpack(current.content).text, patch.content), patch.images) };
    if (patch?.v !== 1) throw new Error("Unsupported history patch.");
    return { name: apply(current.name, patch.name), content: apply(current.content, patch.content) };
  }
  const api = Object.freeze({ diff, apply, reverse, restore, textState, retainImages });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AstraHistory = api;
})(globalThis);
