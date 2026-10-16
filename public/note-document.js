/* Versioned note content; shared by the server, editor, renderer and history. */
(function (root) {
  "use strict";
  const PREFIX = "ASTRANOTE-DOCUMENT-1\n";
  const ID = /^img_[a-f0-9]{24}$/;
  const MAX_IMAGES = 3;
  const MAX_IMAGE_BYTES = 512_000;
  function unpack(value) {
    if (typeof value !== "string") throw new Error("invalid_document");
    if (!value.startsWith(PREFIX)) return { text: value, images: [] };
    const data = JSON.parse(value.slice(PREFIX.length));
    if (!data || typeof data.text !== "string" || !Array.isArray(data.images) || data.images.length > MAX_IMAGES)
      throw new Error("invalid_document");
    const ids = new Set();
    const images = data.images.map(image => {
      if (!image || !ID.test(image.id) || ids.has(image.id) || !["image/webp", "image/png", "image/jpeg"].includes(image.type)
        || typeof image.data !== "string" || image.data.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4
        || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data) || !image.data.length
        || typeof image.caption !== "string" || image.caption.length > 400
        || !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width < 1 || image.height < 1
        || image.width > 2048 || image.height > 2048 || image.width * image.height > 4_194_304)
        throw new Error("invalid_image");
      ids.add(image.id);
      return { id: image.id, type: image.type, data: image.data, width: image.width, height: image.height, caption: image.caption };
    });
    return { text: data.text, images };
  }
  function pack(text, images = []) {
    const value = images.length || text.startsWith(PREFIX) ? PREFIX + JSON.stringify({ text, images }) : text;
    const normalized = unpack(value);
    return value.startsWith(PREFIX) ? PREFIX + JSON.stringify(normalized) : value;
  }
  function imageBytes(image) { return image.data.length * 3 / 4 - (image.data.endsWith("==") ? 2 : image.data.endsWith("=") ? 1 : 0); }
  const api = Object.freeze({ PREFIX, ID, MAX_IMAGES, MAX_IMAGE_BYTES, unpack, pack, imageBytes });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AstraDocument = api;
})(globalThis);
