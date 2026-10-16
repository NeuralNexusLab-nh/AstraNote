"use strict";
const TYPES = new Set(["rectangle", "circle", "arrow", "text", "crop", "rotate", "brightness", "contrast"]);
const fields = { type: { type: "string", enum: [...TYPES] }, id: { type: "string" }, x: { type: "number" }, y: { type: "number" }, w: { type: "number" }, h: { type: "number" }, value: { type: "number" }, text: { type: "string" }, color: { type: "string" } };
const schema = { type: "array", maxItems: 24, items: { type: "object", additionalProperties: false, required: Object.keys(fields), properties: fields } };
function validate(operations, images) {
  if (!Array.isArray(operations) || operations.length > 24) throw new Error("Invalid image edits.");
  const ids = new Set(images.map(image => image.id));
  return operations.map(op => {
    if (!op || !TYPES.has(op.type) || !ids.has(op.id) || typeof op.text !== "string" || op.text.length > 200
      || !/^#[a-f0-9]{6}$/i.test(op.color) || [op.x, op.y, op.w, op.h].some(n => !Number.isFinite(n) || n < 0 || n > 1)
      || !Number.isFinite(op.value) || Math.abs(op.value) > 180) throw new Error("Invalid image edits.");
    if (op.type === "crop" && (op.w <= 0 || op.h <= 0 || op.x + op.w > 1.00001 || op.y + op.h > 1.00001)) throw new Error("Invalid image crop.");
    return Object.fromEntries(Object.keys(fields).map(key => [key, op[key]]));
  });
}
module.exports = { schema, validate };
