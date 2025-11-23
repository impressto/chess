# Service Worker Scope Error - FIXED ✅

## The Error You Saw

```
SecurityError: Failed to register a ServiceWorker for scope ('https://impressto.ca/chess/') 
with script ('https://impressto.ca/chess/dist/service-worker.js'): 
The path of the provided scope ('/chess/') is not under the max scope allowed ('/chess/dist/'). 
```

## What This Means

**Service Worker Security Rule:**
A service worker can only control URLs at or below its own location.

**Before (BROKEN):**
- Service worker location: `/chess/dist/service-worker.js`
- Trying to control: `/chess/`
- ❌ This fails because `/chess/` is ABOVE `/chess/dist/`

**After (FIXED):**
- Service worker location: `/chess/service-worker.js`
- Trying to control: `/chess/`
- ✅ This works because they're at the same level

## What Was Changed

### 1. Service Worker Location
- **OLD:** `dist/service-worker.js`
- **NEW:** `service-worker.js` (at root of chess directory)

### 2. Registration in index.php
```javascript
// OLD - BROKEN
navigator.serviceWorker.register('/chess/dist/service-worker.js')

// NEW - FIXED
navigator.serviceWorker.register('/chess/service-worker.js')
```

### 3. Build Process
Added plugin to automatically copy service worker to root after build.

### 4. Nginx Configuration
Updated to serve service worker from root with no-cache headers.

## Files to Deploy

Upload to `https://impressto.ca/chess/`:

```
chess/
├── service-worker.js ✅ (NEW LOCATION - at root!)
├── index.php ✅ (updated registration)
├── sw-debug.html ✅
└── dist/ (entire folder)
```

**CRITICAL:** `service-worker.js` must be at ROOT of `/chess/`, NOT inside `/dist/`!

## Testing After Deploy

1. Visit: `https://impressto.ca/chess/sw-debug.html`
2. Click: "Unregister Service Worker" + "Clear All Caches"
3. Click: "Register Service Worker"
4. Should see: ✅ Registration successful, NO errors!
5. Test offline - should work perfectly!

## Build Command

```bash
yarn build
# Automatically copies service-worker.js to root
```

## Verification

After deploying, check:
- [ ] `https://impressto.ca/chess/service-worker.js` loads
- [ ] sw-debug.html shows registration successful
- [ ] No scope errors in console
- [ ] Works offline on mobile

**If all checked, you're done! 🎉**
