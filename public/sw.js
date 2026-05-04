const CACHE_PREFIX = "qualification-quiz-pwa";
const APP_CACHE = `${CACHE_PREFIX}-app-v2`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-v2`;
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/pwa-icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

const scopedUrl = (path) => new URL(path, self.registration.scope).href;

async function cacheUrls(cacheName, urls) {
  const cache = await caches.open(cacheName);
  const scopedUrls = urls
    .map((url) => {
      try {
        return new URL(url, self.registration.scope).href;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  await Promise.allSettled(scopedUrls.map((url) => cache.add(new Request(url, { cache: "reload" }))));
}

async function matchRuntimeFirst(request) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);
  const appCache = await caches.open(APP_CACHE);

  return (
    (await runtimeCache.match(request)) ||
    (await runtimeCache.match(scopedUrl("./"))) ||
    (await runtimeCache.match(scopedUrl("./index.html"))) ||
    (await appCache.match(request)) ||
    (await appCache.match(scopedUrl("./"))) ||
    (await appCache.match(scopedUrl("./index.html")))
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheUrls(APP_CACHE, STATIC_ASSETS).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && ![APP_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;

  const urls = event.data.urls.filter((url) => {
    try {
      return new URL(url).origin === self.location.origin;
    } catch {
      return false;
    }
  });

  event.waitUntil(cacheUrls(RUNTIME_CACHE, urls));
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => matchRuntimeFirst(request)),
    );
    return;
  }

  if (["script", "style", "image", "font", "manifest"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
