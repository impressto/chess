const CACHE_NAME = 'chess-game-v0.0.21';
const ASSETS_CACHE = 'chess-assets-v1';
const IMAGE_CACHE = 'chess-images-v1';

// Core app files - must be cached for offline functionality
const CORE_ASSETS = [
  '/chess/',
  '/chess/index.php',
  '/chess/dist/index.html',
  '/chess/dist/manifest.json',
  '/chess/dist/assets/index.js',
  '/chess/dist/assets/vendor.js',
  '/chess/dist/assets/index.css',
  '/chess/dist/screeen.jpg',
  '/chess/dist/pwa-icon.png',
  '/chess/dist/assets/board.jpg',
  '/chess/dist/assets/logo.png',
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

// Asset patterns for dynamic caching
const ASSET_PATTERNS = [
  /\/chess\/dist\/assets\/.*\.js$/,
  /\/chess\/dist\/assets\/.*\.css$/,
];

// Image patterns
const IMAGE_PATTERNS = [
  /\/chess\/dist\/assets\/.*\.(png|jpg|jpeg|svg|webp)$/,
  /\/chess\/dist\/images\/.*\.(png|jpg|jpeg|svg|webp)$/,
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v0.0.21 and caching assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        console.log('[SW] Attempting to cache', CORE_ASSETS.length, 'files');
        
        // Cache files individually to handle failures gracefully
        const cachePromises = CORE_ASSETS.map(url => {
          return cache.add(url).then(() => {
            console.log('[SW] ✓ Cached:', url);
          }).catch(err => {
            console.warn('[SW] ✗ Failed to cache:', url, err);
            // Don't fail the whole installation if one file fails
          });
        });
        
        return Promise.all(cachePromises);
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
  console.log('[SW] Activating service worker v0.0.21');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== CACHE_NAME && 
                cacheName !== ASSETS_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated, taking control');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Helper function to determine cache name based on request
function getCacheName(url) {
  if (IMAGE_PATTERNS.some(pattern => pattern.test(url))) {
    return IMAGE_CACHE;
  }
  if (ASSET_PATTERNS.some(pattern => pattern.test(url))) {
    return ASSETS_CACHE;
  }
  return CACHE_NAME;
}

// Fetch event - offline-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests (except our own domain)
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found (offline-first)
        if (cachedResponse) {
          console.log('[SW] Cache HIT:', url);
          return cachedResponse;
        }

        console.log('[SW] Cache MISS, fetching:', url);

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();
            const cacheName = getCacheName(url);

            // Cache the fetched response
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
                console.log('[SW] Cached to', cacheName + ':', url);
              });

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed for:', url, error);
            
            // Return offline page or fallback for navigation requests
            if (request.destination === 'document' || request.mode === 'navigate') {
              console.log('[SW] Returning cached page for offline navigation');
              // Try multiple cache keys in order of preference
              return caches.match('/chess/index.php')
                .then(cached => {
                  if (cached) return cached;
                  return caches.match('/chess/');
                })
                .then(cached => {
                  if (cached) return cached;
                  return caches.match('/chess/dist/index.html');
                })
                .then(cached => {
                  if (cached) {
                    return cached;
                  }
                  // Last resort: return a simple offline message
                  return new Response(
                    '<!DOCTYPE html><html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
                    {
                      status: 503,
                      statusText: 'Service Unavailable',
                      headers: new Headers({
                        'Content-Type': 'text/html'
                      })
                    }
                  );
                });
            }
            
            // For other requests, just fail gracefully
            return new Response('Offline - resource not available', {
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

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
