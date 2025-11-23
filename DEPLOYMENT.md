# Chess PWA - Deployment Guide for Nginx + PHP

## ✅ Current Setup

The app is now configured to work as a fully offline PWA with:
- **index.php** as the entry point (supports both online and offline)
- **Non-hashed asset filenames** for predictable caching
- **Service Worker** with explicit asset list
- **Nginx configuration** included

## 📦 Build & Deploy

### 1. Build the App

```bash
cd /home/impressto/work/impressto/homeserver/www/homelab/chess
yarn build
```

This creates the `dist/` folder with all assets.

### 2. Configure Nginx

The `nginx.conf` file is ready to use. Copy its contents to your nginx server configuration:

```bash
# Option A: Include in existing server block
sudo nano /etc/nginx/sites-available/your-site

# Option B: Create new site
sudo nano /etc/nginx/sites-available/chess
sudo ln -s /etc/nginx/sites-available/chess /etc/nginx/sites-enabled/
```

**Important Settings:**
- Adjust PHP version if needed: `php8.1-fpm.sock` → `php8.2-fpm.sock` or `php7.4-fpm.sock`
- Update root path if different: `/home/impressto/work/impressto/homeserver/www/homelab`
- Service worker must have `no-cache` headers (already configured)

### 3. Test Nginx Configuration

```bash
# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Verify PHP-FPM

```bash
# Check PHP-FPM status
sudo systemctl status php8.1-fpm

# If not running, start it
sudo systemctl start php8.1-fpm
sudo systemctl enable php8.1-fpm
```

## 🧪 Testing the PWA

### Online Testing

1. Visit `https://yourdomain.com/chess/` (or your configured URL)
2. Open DevTools (F12) → Application tab
3. Check **Service Workers** section - should show registered
4. Check **Manifest** section - should show no errors
5. Check **Cache Storage** - should show `chess-game-v0.0.6` with all assets

### Offline Testing

1. With the app open, go to DevTools (F12) → Network tab
2. Check the "Offline" checkbox
3. Refresh the page (Ctrl+R)
4. App should load completely from cache!
5. All images should appear
6. Game should be fully playable

### Mobile Testing

1. Visit on mobile device (must be HTTPS for PWA to work)
2. Install the app:
   - **Android Chrome**: Menu → "Install app"
   - **iOS Safari**: Share → "Add to Home Screen"
3. Open the installed app
4. Turn off WiFi/mobile data
5. App should work completely offline!

## 🔧 Troubleshooting

### Service Worker Not Registering

```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check service worker in browser console
# Should see: "✅ Service Worker registered"
```

**Common Issues:**
- Must use HTTPS (or localhost for testing)
- Check nginx is serving `/chess/dist/service-worker.js`
- Verify no cache headers on service-worker.js

### Assets Not Caching

1. Open DevTools → Application → Cache Storage
2. Should see cache named `chess-game-v0.0.6`
3. Should have all these files cached:
   - `/chess/index.php`
   - `/chess/dist/index.html`
   - `/chess/dist/assets/index.js`
   - `/chess/dist/assets/vendor.js`
   - `/chess/dist/assets/index.css`
   - All PNG images (chess pieces)
   - All JPG images (board, logo, splash)

If missing, clear cache and reload while online.

### Images Not Showing Offline

This was the original issue! Fixed by:
1. ✅ Adding all asset paths to `urlsToCache` array in service-worker.js
2. ✅ Using non-hashed filenames for predictable caching
3. ✅ Cache-first strategy in service worker

### PHP Version Issues

```bash
# Check installed PHP versions
ls -la /var/run/php/

# Update nginx config to match, e.g.:
# fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
```

## 🚀 Updating the App

When you make changes:

1. **Update version** in `package.json`:
   ```json
   "version": "0.0.7"
   ```

2. **Update cache name** in `public/service-worker.js`:
   ```javascript
   const CACHE_NAME = 'chess-game-v0.0.7';
   ```

3. **Rebuild**:
   ```bash
   yarn build
   ```

4. **Deploy** (copy dist to server if remote)

5. **Users will auto-update** on next visit!

## 📱 PWA Features

### Current Features
- ✅ Fully offline capable
- ✅ Install to home screen
- ✅ Standalone display mode
- ✅ Responsive design
- ✅ Fast loading (cached assets)
- ✅ AI chess opponent (works offline)
- ✅ No internet required after first load

### Cache Strategy
- **Service Worker**: No cache (always check for updates)
- **Manifest**: No cache
- **index.php**: No cache
- **JS/CSS/Images**: 1 year cache (but service worker controls)

## 🔒 Security Notes

### HTTPS Required
PWAs require HTTPS in production. Get a free SSL certificate:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Headers
Already configured in nginx.conf:
- X-Frame-Options
- X-Content-Type-Options  
- X-XSS-Protection

## 📊 File Structure

```
/home/impressto/work/impressto/homeserver/www/homelab/chess/
├── index.php              ← Entry point (PHP)
├── index.html             ← Fallback entry point
├── package.json           ← Version tracking
├── nginx.conf            ← Nginx configuration
├── public/
│   ├── service-worker.js  ← Service worker source
│   ├── manifest.json      ← PWA manifest
│   └── images/           ← Static images
└── dist/                 ← Built files (generated)
    ├── index.html
    ├── service-worker.js  ← Copied from public/
    ├── manifest.json      ← Copied from public/
    ├── assets/
    │   ├── index.js       ← Main app bundle
    │   ├── vendor.js      ← React bundle
    │   ├── index.css      ← Styles
    │   └── *.png/*.jpg    ← Chess pieces, board
    └── images/
        └── black-king.png ← PWA icon
```

## ✨ Success Checklist

- [ ] Built with `yarn build`
- [ ] Nginx config added and tested
- [ ] PHP-FPM running
- [ ] Site accessible at `/chess/`
- [ ] Service worker registered (check DevTools)
- [ ] All assets cached (check DevTools → Cache Storage)
- [ ] Works offline (disable network, refresh works)
- [ ] Images load offline
- [ ] Can install as PWA
- [ ] Installed PWA works offline

Enjoy your fully offline chess game! ♟️
