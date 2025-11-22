const CACHE_NAME = 'chess-game-v0.0.2';
const urlsToCache = [
  '/chess/',
  '/chess/dist/assets/index.js',
  '/chess/dist/assets/vendor.js',
  '/chess/dist/assets/index.css',
  '/chess/dist/screeen.jpg',
  '/chess/dist/assets/board.jpg',
  '/chess/dist/assets/logo.jpg',
  '/chess/dist/assets/splash-image.jpg',
  '/chess/dist/assets/black-bishop.png',
  '/chess/dist/assets/black-castle.png',
  '/chess/dist/assets/black-king.png',
  '/chess/dist/assets/black-knight.png',
  '/chess/dist/assets/black-pawn.png',
  '/chess/dist/assets/black-queen.png',
  '/chess/dist/assets/white-bishop.png',
  '/chess/dist/assets/white-castle.png',
  '/chess/dist/assets/white-king.png',
  '/chess/dist/assets/white-knight.png',
  '/chess/dist/assets/white-pawn.png',
  '/chess/dist/assets/white-queen.png'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both cache and network fail, could return a custom offline page
          return caches.match('/chess/');
        });
      })
  );
});
