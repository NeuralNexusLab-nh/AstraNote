"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");

// A disposable projection of authoritative note files. Never contains note
// content, images, PINs, keys or plaintext encrypted titles.
class NoteIndex {
  constructor({ root, read, write, summarize, directorySize }) {
    Object.assign(this, { root, read, write, summarize, directorySize });
    this.cache = new Map();
    this.pending = new Map();
    this.bytes = 0;
    this.metrics = { builds: 0, noteReads: 0, hits: 0 };
  }
  invalidate(username) {
    const old = this.cache.get(username);
    if (old) this.bytes -= old.weight;
    this.cache.delete(username);
  }
  async erase(username) {
    this.invalidate(username);
    await fs.unlink(path.join(this.root, ".indexes", "notes", username + ".json")).catch(error => {
      if (error.code !== "ENOENT") throw error;
    });
  }
  remember(username, record) {
    this.invalidate(username);
    const weight = Buffer.byteLength(JSON.stringify(record));
    if (weight > 2_000_000) return;
    while (this.cache.size >= 64 || this.bytes + weight > 8_000_000) {
      this.invalidate(this.cache.keys().next().value);
    }
    this.cache.set(username, { record, weight, checkedAt: Date.now() });
    this.bytes += weight;
  }
  async get(username) {
    if (this.pending.has(username)) return this.pending.get(username);
    const task = this.build(username).finally(() => this.pending.delete(username));
    this.pending.set(username, task);
    return task;
  }
  async build(username) {
    const directory = path.join(this.root, username, "notes");
    const file = path.join(this.root, ".indexes", "notes", username + ".json");
    let previous = this.cache.get(username)?.record;
    if (!previous) {
      try { previous = await this.read(file, null); } catch { previous = null; }
    }
    const old = previous?.v === 1 ? previous.notes || {} : {};
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(error => {
      if (error.code === "ENOENT") return [];
      throw error;
    });
    const record = { v: 1, bytes: 0, images: 0, notes: {} };
    // Bounded I/O and yielding avoid a large account monopolizing the event loop.
    for (let start = 0; start < entries.length; start += 16) {
      await Promise.all(entries.slice(start, start + 16).map(async entry => {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) { record.bytes += await this.directorySize(target); return; }
        if (!entry.isFile() || entry.name.endsWith(".tmp")) return;
        const stat = await fs.stat(target).catch(error => {
          if (error.code === "ENOENT") return null;
          throw error;
        });
        if (!stat) return;
        record.bytes += stat.size;
        if (!/^[a-f0-9]{24}\.json$/.test(entry.name)) return;
        const id = entry.name.slice(0, -5), cached = old[id];
        let summary;
        if (cached && cached.mtimeMs === stat.mtimeMs && cached.bytes === stat.size && cached.id === id
            && Number.isInteger(cached.imageCount) && cached.imageCount >= 0 && cached.imageCount <= 3
            && typeof cached.encryption === "string" && typeof cached.hasPrevious === "boolean" && typeof cached.titlesMigrated === "boolean" && typeof cached.imageCountKnown === "boolean") {
          summary = cached;
          this.metrics.hits++;
        } else {
          const note = await this.read(target, null);
          if (!note) return;
          this.metrics.noteReads++;
          summary = { ...this.summarize(note, username), id, bytes: stat.size, mtimeMs: stat.mtimeMs };
        }
        record.notes[id] = summary;
        record.images += summary.imageCount;
      }));
      await new Promise(resolve => setImmediate(resolve));
    }
    this.metrics.builds++;
    record.notes = Object.fromEntries(Object.entries(record.notes).sort(([a],[b]) => a.localeCompare(b)));
    if (JSON.stringify(previous) !== JSON.stringify(record)) {
      // A failed cache write must not turn a successful note operation into a
      // reported failure. The originals remain authoritative and readable.
      await this.write(file, record).catch(() => console.error("Note index persistence deferred."));
    }
    this.remember(username, record);
    return record;
  }
}
module.exports = { NoteIndex };
