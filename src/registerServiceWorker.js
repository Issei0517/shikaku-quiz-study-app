const sameOriginUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.origin === window.location.origin ? parsed.href : null;
  } catch {
    return null;
  }
};

function collectCacheUrls() {
  const urls = new Set([window.location.href]);

  document
    .querySelectorAll('link[rel="manifest"], link[rel="icon"], link[rel="apple-touch-icon"]')
    .forEach((link) => {
      const url = sameOriginUrl(link.href);
      if (url) urls.add(url);
    });

  performance.getEntriesByType("resource").forEach((entry) => {
    const url = sameOriginUrl(entry.name);
    if (url) urls.add(url);
  });

  return [...urls];
}

function sendCurrentAssetsToWorker(registration) {
  if (!registration?.active) return;

  registration.active.postMessage({
    type: "CACHE_URLS",
    urls: collectCacheUrls(),
  });
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "./",
      });

      await navigator.serviceWorker.ready;
      sendCurrentAssetsToWorker(registration);

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "activated") sendCurrentAssetsToWorker(registration);
        });
      });
    } catch {
      // PWA登録に失敗しても、通常のWebアプリとして使える状態を保つ。
    }
  });
}
