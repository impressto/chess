import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Read package.json for version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version;

// Get all files from dist
const getAllFiles = (dir, baseDir = dir) => {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, baseDir));
    } else {
      // Convert to URL path
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      files.push('/' + relativePath);
    }
  }
  
  return files;
};

// Get all files to cache
const filesToCache = getAllFiles(distDir)
  .filter(file => {
    // Include everything except service-worker.js itself
    return !file.includes('service-worker.js') && 
           !file.includes('.map') &&
           !file.includes('vite.svg');
  });

// Generate service worker content
const serviceWorkerContent = `const CACHE_NAME = 'chess-game-v${version}';
const urlsToCache = ${JSON.stringify(filesToCache, null, 2)};

// Install event - cache all assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker and caching assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching', urlsToCache.length, 'files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] All assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - Cache First strategy (perfect for offline PWA)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, try network
        return fetch(event.request).then((response) => {
          // Don't cache if not a success response
          if (!response || response.status !== 200) {
            return response;
          }

          // Don't cache non-GET requests or chrome-extension
          if (event.request.method !== 'GET' || 
              event.request.url.startsWith('chrome-extension://')) {
            return response;
          }

          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch((error) => {
          console.log('[SW] Fetch failed, returning offline page:', error);
          // If both cache and network fail, return cached index for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

// Write the service worker to dist
const swPath = path.join(distDir, 'service-worker.js');
fs.writeFileSync(swPath, serviceWorkerContent);

console.log(`✓ Service worker generated with ${filesToCache.length} files to cache`);
console.log(`✓ Written to: ${swPath}`);
