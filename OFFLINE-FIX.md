# Chess PWA - Offline Issue Fix & Deployment Steps

## 🔧 What Was Fixed (v0.0.7)

### Critical Fix: Service Worker Scope Issue
**The Problem:** Service worker was at `/chess/dist/service-worker.js` but trying to control `/chess/`, which is outside its allowed scope. Browsers block this for security.

**The Solution:** Moved service worker to `/chess/service-worker.js` (root of chess directory) so it can control the entire `/chess/` scope.

### Other Fixes:
1. **Service worker registration URL** - Removed version query parameter that prevented proper caching
2. **Cache version** - Updated to v0.0.7 to match package.json
3. **Better error logging** - Added detailed console logs to debug caching issues
4. **Explicit scope** - Set service worker scope to `/chess/`
5. **Improved offline fallback** - Better handling when network fails

### Key Changes:

**index.php:**
- Service worker now registers without `?v=` parameter
- Explicit scope set to `/chess/`
- Added update detection and logging

**service-worker.js:**
- Version bumped to 0.0.7
- Individual file caching with error reporting
- Better offline error handling
- Detailed console logging for debugging

## 📋 Deployment Checklist

### 1. Build Locally
```bash
cd /home/impressto/work/impressto/homeserver/www/homelab/chess
yarn build
```
✅ Done - v0.0.7 built successfully

### 2. Deploy Files to Server
Upload these files to your server at `https://impressto.ca/chess/`:

**Critical files:**
- `index.php` (updated SW registration)
- `service-worker.js` (v0.0.7 - AT ROOT, not in dist!)
- `dist/` folder (all assets)
- `sw-debug.html` (debugging tool)

### 3. Clear Old Service Worker on Server
**IMPORTANT:** Users' browsers may have cached the old service worker!

**Option A - User side (for testing):**
1. Visit `https://impressto.ca/chess/sw-debug.html`
2. Click "Unregister Service Worker"
3. Click "Clear All Caches"
4. Click "Register Service Worker"
5. Verify it shows version 0.0.7

**Option B - Force update (nginx header):**
Add to your nginx config temporarily:
```nginx
location = /chess/dist/service-worker.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
    add_header Clear-Site-Data "cache";
}
```

### 4. Test on Desktop

1. Visit `https://impressto.ca/chess/`
2. Open DevTools (F12) → Console
3. Look for logs:
   ```
   ✅ Service Worker registered with scope: https://impressto.ca/chess/
   [SW] Installing service worker v0.0.7 and caching assets...
   [SW] ✓ Cached: /chess/index.php
   [SW] ✓ Cached: /chess/dist/assets/index.js
   ... (should see all 25+ files)
   ```

4. Go to Application tab → Service Workers
   - Should show registered and activated

5. Go to Application tab → Cache Storage
   - Should see `chess-game-v0.0.7`
   - Should have 25+ files cached

6. Test offline:
   - Network tab → Check "Offline"
   - Refresh page
   - **Should work perfectly!**

### 5. Test on Mobile

1. **Clear old data first:**
   - Visit `https://impressto.ca/chess/sw-debug.html` on mobile
   - Tap "Unregister Service Worker"
   - Tap "Clear All Caches"

2. **Fresh install:**
   - Visit `https://impressto.ca/chess/`
   - Install PWA to home screen
   - Open installed app
   - Let it load completely (watch console logs if possible)

3. **Test offline:**
   - Close the PWA
   - Turn off WiFi AND mobile data
   - Open PWA from home screen
   - **Should work completely!**

## 🐛 Debugging if Still Failing

### Check 1: Is Service Worker Registered?
```javascript
// In browser console
navigator.serviceWorker.getRegistration('/chess/').then(reg => {
    console.log('Registration:', reg);
    console.log('Active:', reg?.active?.scriptURL);
});
```

### Check 2: What's Cached?
```javascript
// In browser console
caches.keys().then(keys => {
    console.log('Cache names:', keys);
    keys.forEach(key => {
        caches.open(key).then(cache => {
            cache.keys().then(reqs => {
                console.log(key + ':', reqs.map(r => r.url));
            });
        });
    });
});
```

### Check 3: Service Worker Logs
Open DevTools → Console and look for `[SW]` prefixed messages:
- `[SW] Installing service worker v0.0.7...`
- `[SW] ✓ Cached: /chess/...` (should see many)
- `[SW] Cache HIT: ...` (when offline)

### Check 4: Test Specific Asset
```javascript
// In browser console
fetch('/chess/dist/assets/black-king.png').then(r => {
    console.log('Fetch result:', r.ok, r.status);
    return r.blob();
}).then(blob => {
    console.log('Got blob:', blob.size, 'bytes');
});
```

## 🔍 Using the Debug Tool

Visit: `https://impressto.ca/chess/sw-debug.html`

This page shows:
- ✅ Service worker status
- 📦 All cached files
- 📝 Real-time console logs
- 🎮 Buttons to register/unregister/clear caches

**Use this to:**
1. See exactly what's cached
2. Clear old caches
3. Register new service worker
4. Test offline functionality

## ⚠️ Common Issues

### "You're offline" message appears
**Cause:** Index.php not cached or service worker not intercepting requests

**Fix:**
1. Check console for `[SW] Cache MISS: https://impressto.ca/chess/index.php`
2. If missing, service worker isn't installed
3. Use sw-debug.html to verify registration

### Images not loading
**Cause:** Asset URLs not matching cached URLs

**Fix:**
1. Check console for cache misses on image URLs
2. Verify URLs in service-worker.js match actual requests
3. Check nginx isn't redirecting or rewriting URLs

### Service worker won't update
**Cause:** Browser aggressively caching service-worker.js

**Fix:**
1. Ensure nginx serves service-worker.js with `Cache-Control: no-cache`
2. Hard refresh (Ctrl+Shift+R)
3. Manually unregister via sw-debug.html

## ✅ Success Criteria

When working correctly, you should see:

**Online:**
- Page loads normally
- Console shows: `✅ Service Worker registered`
- Console shows: `[SW] Installing service worker v0.0.7...`
- Console shows 25+ `[SW] ✓ Cached:` messages

**Offline:**
- Page loads instantly
- No "You're offline" message
- All images display
- Game is fully playable
- Console shows: `[SW] Cache HIT:` for requests

## 📞 Next Steps

1. Deploy the new build to your server
2. Test using sw-debug.html
3. Clear old caches
4. Test on mobile in airplane mode
5. Report back with console logs if still having issues

The key is that version 0.0.7 has much better logging, so we can see exactly what's happening!
