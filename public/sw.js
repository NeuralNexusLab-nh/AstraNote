"use strict";

// AstraNote deliberately caches only public interface assets. It never caches
// HTML documents, API responses, notes, sessions, PINs, or decrypted text.
const CACHE_NAME = "astranote-interface-v2";
const INTERFACE_ASSETS = [
  "/style.css",
  "/home.css",
  "/app.js",
  "/home-marketing.js",
  "/asset/logo.png",
  "/asset/icon-192.png",
  "/asset/icon-512.png",
  "/asset/fonts.css",
  "/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(INTERFACE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith("astranote-interface-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Navigation and every API call stay network-only. This prevents a browser
  // cache from becoming a second store of private account or note data.
  if (!["style", "script", "image", "font"].includes(request.destination)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
