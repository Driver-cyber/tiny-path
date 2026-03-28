/* ═══════════════════════════════════════
   TINY PATH SERVICE WORKER
   Strategy:
   - App shell (HTML/JS/CSS): network-first, fall back to cache
   - Images/fonts: cache-first, fall back to network
   Cache name is versioned — update CACHE_VERSION on every deploy
   to force clients to pick up new files immediately.
═══════════════════════════════════════ */

const CACHE_VERSION = "tinypath-v4.3";
const SHELL_CACHE   = `${CACHE_VERSION}-shell`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;

const SHELL_FILES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/robots.txt",
  "/icon.svg"
];

// ── Install: pre-cache app shell ──────────────────────
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_FILES))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// ── Activate: delete all old caches ──────────────────
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !k.startsWith(CACHE_VERSION))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: route by request type ─────────────────────
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // Let external requests pass through untouched
  // (Supabase, Cloudinary, Google Fonts, Nominatim)
  if (url.origin !== self.location.origin) return;

  // Images → cache-first (they don't change)
  if (e.request.destination === "image") {
    e.respondWith(cacheFirst(e.request, IMAGE_CACHE));
    return;
  }

  // App shell (HTML, JS, CSS, manifest) → network-first
  // This ensures deploys are picked up immediately.
  e.respondWith(networkFirst(e.request, SHELL_CACHE));
});

// ── Strategies ────────────────────────────────────────

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}
