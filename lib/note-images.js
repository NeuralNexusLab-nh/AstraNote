"use strict";
const sharp = require("sharp");
const Document = require("../public/note-document");
let active = 0;
const waiting = [];
const busy = () => Object.assign(new Error("Image processing is busy. Try again shortly."), {status:503,code:"image_busy"});
async function acquire() {
  if (active < 2) { active++; return; }
  if (waiting.length >= 8) throw busy();
  await new Promise((resolve, reject) => {
    const entry = {resolve:()=>{clearTimeout(entry.timer);active++;resolve();}};
    entry.timer = setTimeout(() => {const index=waiting.indexOf(entry);if(index>=0)waiting.splice(index,1);reject(busy());},10_000);
    waiting.push(entry);
  });
}
function release() { active--; waiting.shift()?.resolve(); }
const invalid = () => Object.assign(new Error("Choose a valid PNG, JPEG or WebP image within the image limits."), { status: 400, code: "invalid_image" });
function magic(bytes, type) {
  return type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
    : type === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
}
async function validate(content) {
  let document;
  try { document = Document.unpack(content); } catch { throw invalid(); }
  if (!document.images.length) return content;
  await acquire();
  try {
    for (const image of document.images) {
      const bytes = Buffer.from(image.data, "base64");
      if (!magic(bytes, image.type) || bytes.length > Document.MAX_IMAGE_BYTES) throw invalid();
      const pipeline = sharp(bytes, { failOn: "warning", limitInputPixels: 4_194_304, animated: false });
      const meta = await pipeline.metadata();
      if (meta.width !== image.width || meta.height !== image.height || (meta.pages || 1) > 1
        || !["png", "jpeg", "webp"].includes(meta.format)) throw invalid();
      const clean = await pipeline.webp({ quality: 90, effort: 2 }).toBuffer();
      if (clean.length > Document.MAX_IMAGE_BYTES) throw invalid();
      image.type = "image/webp";
      image.data = clean.toString("base64");
    }
    return Document.pack(document.text, document.images);
  } catch (error) { if (error.status) throw error; throw invalid(); }
  finally { release(); }
}
module.exports = { validate, magic };
