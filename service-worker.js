const CACHE_NAME = 'chess-game-v0.0.7';
const urlsToCache = [
  '/chess/',
  '/chess/index.php',
  '/chess/dist/index.html',
  '/chess/dist/manifest.json',
  '/chess/dist/assets/index.js',
  '/chess/dist/assets/vendor.js',
  '/chess/dist/assets/index.css',
  '/chess/dist/screeen.jpg',
  '/chess/dist/images/board.jpeg',
  '/chess/dist/images/black-king.png',
  '/chess/dist/assets/board.jpg',
  '/chess/dist/assets/logo.jpg',
  '/chess/dist/assets/splash-image.jpg',
  '/chess/dist/assets/black-bishop.png',
  '/chess/dist/assets/black-rook.png',
  '/chess/dist/assets/black-king.png',
  '/chess/dist/assets/black-knight.png',
  '/chess/dist/assets/black-pawn.png',
  '/chess/dist/assets/black-queen.png',
  '/chess/dist/assets/white-bishop.png',
  '/chess/dist/assets/white-rook.png',
  '/chess/dist/assets/white-king.png',
  '/chess/dist/assets/white-knight.png',
  '/chess/dist/assets/white-pawn.png',
  '/chess/dist/assets/white-queen.png'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v0.0.7 and caching assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        console.log('[SW] Attempting to cache', urlsToCache.length, 'files');
        
        // Cache files one by one to see which ones fail
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).then(() => {
              console.log('[SW] ✓ Cached:', url);
            }).catch(err => {
              console.error('[SW] ✗ Failed to cache:', url, err);
              // Don't fail the whole installation if one file fails
            });
          })
        );
      })
      .then(() => {
        console.log('[SW] Installation complete, activating...');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
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

// Fetch event - Cache First strategy (perfect for offline PWA)
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://impressto.ca')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return response
        if (cachedResponse) {
          console.log('[SW] Cache HIT:', event.request.url);
          return cachedResponse;
        }

        console.log('[SW] Cache MISS, fetching:', event.request.url);

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200) {
            console.log('[SW] Invalid response for:', event.request.url);
            return response;
          }

          // Don't cache non-GET requests or chrome-extension requests
          if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache everything (JS, CSS, images, fonts, etc.)
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
              console.log('[SW] Cached:', event.request.url);
            });

          return response;
        }).catch((error) => {
          console.error('[SW] Fetch failed for:', event.request.url, error);
          
          // If both cache and network fail, return cached index for navigation requests
          if (event.request.mode === 'navigate') {
            console.log('[SW] Returning cached index for navigation');
            return caches.match('/chess/index.php').then((cachedIndex) => {
              if (cachedIndex) {
                return cachedIndex;
              }
              return caches.match('/chess/dist/index.html').then(cached => {
                if (cached) return cached;
                return caches.match('/chess/');
              });
            });
          }
          
          // For other failed requests, return a basic offline response
          return new Response('Offline - resource not cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});
