// ETS Bogasto GSM Info - Service Worker
const CACHE_NAME = 'bogasto-v4';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Installation : met en cache les fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Quand l'appli demande un fichier : essaie internet d'abord, sinon cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, copy);
      });
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
