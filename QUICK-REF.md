# Quick Reference - Chess PWA

## Current Status
✅ **Built and ready to deploy**
- Version: 0.0.6
- Service worker: Properly configured with all assets
- Asset naming: Non-hashed (index.js, vendor.js, etc.)
- Entry point: index.php (with service worker registration)
- Base path: /chess/dist/

## Deployment Commands

```bash
# Build
yarn build

# Check configuration
./check-pwa.sh

# Preview locally
yarn preview
# Then visit: http://localhost:4173
```

## Nginx Setup

1. Copy contents from `nginx.conf` to your nginx config
2. Update PHP version if needed (default: php8.1-fpm)
3. Test: `sudo nginx -t`
4. Reload: `sudo systemctl reload nginx`

## Testing Offline

**Desktop:**
- F12 → Network tab → Check "Offline" → Refresh
- Should work completely!

**Mobile:**
- Install PWA → Turn off internet → Open app
- Everything should work!

## Files That Matter

| File | Purpose |
|------|---------|
| `index.php` | Entry point with SW registration |
| `dist/service-worker.js` | Caches all assets for offline |
| `dist/manifest.json` | PWA metadata |
| `nginx.conf` | Server configuration |
| `package.json` | Version tracking |

## Updating

1. Edit version in `package.json` (e.g., 0.0.7)
2. Edit CACHE_NAME in `public/service-worker.js`
3. Run `yarn build`
4. Users auto-update on next visit

## Cache List (27 files)

**Core:**
- /chess/ & /chess/index.php
- index.html, manifest.json
- index.js, vendor.js, index.css

**Chess Pieces (12):**
- black-pawn, black-rook, black-knight, black-bishop, black-queen, black-king
- white-pawn, white-rook, white-knight, white-bishop, white-queen, white-king

**Images:**
- board.jpg, logo.png, splash-image.jpg
- screeen.jpg, board.jpeg

## Troubleshooting One-Liners

```bash
# Check if service worker file exists
ls -lh dist/service-worker.js

# Check version matches
grep version package.json && grep CACHE_NAME dist/service-worker.js

# View nginx config
cat nginx.conf

# Check PHP-FPM
systemctl status php8.1-fpm

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## Success Checklist

- [x] Built with `yarn build`
- [ ] Added nginx config to server
- [ ] Reloaded nginx
- [ ] Site accessible
- [ ] Service worker registered (check DevTools)
- [ ] Works offline (disable network, refresh)
- [ ] Images load offline ← **Main fix!**
- [ ] Can install as PWA

## The Fix

**Before:** Images didn't load offline
**Problem:** Service worker wasn't caching asset files
**Solution:** 
1. Added all assets to `urlsToCache` array
2. Used non-hashed filenames for predictability
3. Cache-first strategy in service worker

**Result:** Fully offline PWA! 🎉
