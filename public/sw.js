// Service Worker per Balcard PWA
// Strategia di caching offline e gestione aggiornamenti post-deploy

const CACHE_VERSION = 'balcard-v1';
const CACHE_NAME = `balcard-cache-${CACHE_VERSION}`;

// Risorse statiche core da pre-memorizzare nella cache
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const CARD_ASSETS = [];
for (const s of SUITS) {
  for (const r of RANKS) {
    CARD_ASSETS.push(`/cards/${s}-${r}.png`);
  }
}

const JOKER_ASSETS = [
  '/jokers/alchemist.png',
  '/jokers/court_jester.png',
  '/jokers/knight_errant.png',
  '/jokers/marksman_crossbow.png',
  '/jokers/monk_scribe.png',
  '/jokers/royal_blacksmith.png',
  '/jokers/village_usurer.png',
];

const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/fonts/Alagard.ttf',
  '/fonts/Alkhemikal.ttf',
  '/fonts/Castlefavor.ttf',
  '/fonts/Jacquard12-Regular.ttf',
  '/fonts/Jacquard24-Regular.ttf',
  '/fonts/JacquardaBastarda9-Regular.ttf',
  '/fonts/PixelifySans-Regular.ttf',
  '/fonts/PixelifySans-Bold.ttf',
  ...CARD_ASSETS,
  ...JOKER_ASSETS,
];

// 1. Installazione: Scarica e inserisce in cache i file principali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting()) // Attiva immediatamente il nuovo SW
  );
});

// 2. Attivazione: Rimuove vecchie cache di versioni precedenti
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
            return null;
          })
        )
      )
      .then(() => self.clients.claim()) // Prende immediatamente il controllo di tutti i client aperti
  );
});

// 3. Intercettazione Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignora le richieste non-GET o protocolli non-HTTP (es. chrome-extension://)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Navigazione (documenti HTML): Network-First con fallback a cache per garantire che i nuovi deploy siano visti subito online
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Risorse statiche (Immagini, JS compilato, CSS, Fonts): Stale-While-Revalidate
  // Restituisce subito la copia da cache (se presente) per massima reattività e scarica in background la versione aggiornata
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Permette ai client di inviare un comando per forzare l'attivazione
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

