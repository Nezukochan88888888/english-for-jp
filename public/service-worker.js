const CACHE_NAME = 'eng-jp-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/data/flashcards.json',
  '/src/data/alphabet.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
