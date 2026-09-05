/* AstraZero v1: browser-only envelope encryption. No network requests. */
(function (root) {
  "use strict";
  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8", { fatal: true });
  const encode = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  };
  const decode = (value) =>
    Uint8Array.from(
      atob(value.replaceAll("-", "+").replaceAll("_", "/")),
      (c) => c.charCodeAt(0),
    );
  const context = (owner, id, purpose) =>
    enc.encode(`AstraZero v1\0${owner.toLowerCase()}\0${id}\0${purpose}`);
  const random = (size) => root.crypto.getRandomValues(new Uint8Array(size));
  async function wrappingKey(pin, salt) {
    if (!/^[\x21-\x7e]{4,16}$/.test(pin))
      throw new Error("Invalid AstraZero PIN.");
    const bytes = await root.hashwasm.argon2id({
      password: pin,
      salt: decode(salt),
      parallelism: 1,
      iterations: 4,
      memorySize: 98304,
      hashLength: 32,
      outputType: "binary",
    });
    try {
      return await root.crypto.subtle.importKey(
        "raw",
        bytes,
        "AES-GCM",
        false,
        ["wrapKey", "unwrapKey"],
      );
    } finally {
      bytes.fill(0);
    }
  }
  async function openKey(owner, id, salt, pin, wrap) {
    if (
      wrap?.v !== 1 ||
      decode(wrap.iv).length !== 12 ||
      decode(wrap.key).length !== 48
    )
      throw new Error("Unsupported AstraZero envelope.");
    const wrapping = await wrappingKey(pin, salt);
    return root.crypto.subtle.unwrapKey(
      "raw",
      decode(wrap.key),
      wrapping,
      {
        name: "AES-GCM",
        iv: decode(wrap.iv),
        additionalData: context(owner, id, "key"),
        tagLength: 128,
      },
      "AES-GCM",
      false,
      ["encrypt", "decrypt"],
    );
  }
  async function encrypt(owner, id, salt, pin, payload, existing = null) {
    let key, wrap;
    if (existing) {
      wrap = existing.wrap;
      key = await openKey(owner, id, salt, pin, wrap);
    } else {
      key = await root.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );
      const wrapping = await wrappingKey(pin, salt);
      const iv = random(12);
      const wrapped = await root.crypto.subtle.wrapKey("raw", key, wrapping, {
        name: "AES-GCM",
        iv,
        additionalData: context(owner, id, "key"),
        tagLength: 128,
      });
      wrap = { v: 1, iv: encode(iv), key: encode(new Uint8Array(wrapped)) };
    }
    const iv = random(12);
    const encrypted = new Uint8Array(
      await root.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
          additionalData: context(owner, id, "content"),
          tagLength: 128,
        },
        key,
        enc.encode(JSON.stringify(payload)),
      ),
    );
    return {
      iv: encode(iv),
      ciphertext: encode(encrypted.slice(0, -16)),
      tag: encode(encrypted.slice(-16)),
      wrap,
    };
  }
  async function decrypt(owner, note, pin) {
    const envelope = note.encrypted;
    const key = await openKey(
      owner,
      note.id,
      note.clientSalt,
      pin,
      envelope.wrap,
    );
    const ciphertext = decode(envelope.ciphertext),
      tag = decode(envelope.tag);
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);
    const clear = await root.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decode(envelope.iv),
        additionalData: context(owner, note.id, "content"),
        tagLength: 128,
      },
      key,
      combined,
    );
    const payload = JSON.parse(dec.decode(clear));
    if (typeof payload.content !== "string")
      throw new Error("Invalid AstraZero content.");
    return { key, payload: { name: note.name, content: payload.content } };
  }
  root.AstraZero = Object.freeze({ encrypt, decrypt });
})(globalThis);
