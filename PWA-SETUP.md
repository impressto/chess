# Chess Game - Progressive Web App Setup

This chess game is now configured as a **fully offline Progressive Web App (PWA)**!

## ✨ Features

- **100% Offline Support**: Play chess without an internet connection
- **Install as App**: Add to your home screen on mobile or desktop
- **Fast Loading**: Assets are cached for instant loading
- **AI Opponent**: Play against the computer offline
- **Responsive Design**: Works on all screen sizes

## 🚀 Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Building for Production

```bash
# Build the app
yarn build

# Preview the production build
yarn preview
```

The built files will be in the `dist/` directory.

## 🌐 Deploying

### Option 1: Static Hosting (Recommended for PWA)

Deploy the `dist/` folder to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: `vercel dist`
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`
- **Surge**: `surge dist`

### Option 2: Local Server

Serve the dist folder with any static server:

```bash
# Using Python
cd dist
python -m http.server 8080

# Using Node.js http-server
npx http-server dist -p 8080

# Using PHP (but not needed for PWA!)
cd dist
php -S localhost:8080
```

## 📱 Installing as PWA

### On Desktop (Chrome/Edge)
1. Visit your deployed site
2. Look for the install icon (➕) in the address bar
3. Click "Install" to add to your apps

### On Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### On Mobile (Android)
1. Open in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home screen"
4. Tap "Install"

## 🔧 PWA Configuration

### Service Worker
- Located at `public/service-worker.js`
- Uses **Cache-First** strategy for offline support
- Automatically updates when new version is deployed
- Caches all assets (JS, CSS, images)

### Manifest
- Located at `public/manifest.json`
- Configures app name, icons, theme colors
- Sets display mode to "standalone" for app-like experience

### Key Files
- `index.html` - Entry point with PWA meta tags
- `src/main.jsx` - Registers service worker
- `vite.config.js` - Build configuration
- `public/manifest.json` - PWA manifest
- `public/service-worker.js` - Offline cache logic

## ✅ Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" - should show registered
4. Check "Manifest" - should show no errors
5. Click "Offline" checkbox to test offline mode
6. Reload the page - it should still work!

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Check "Progressive Web App"
4. Click "Generate report"
5. Should score 90+ for PWA

## 🐛 Troubleshooting

### Service Worker Not Registering
- Make sure you're using HTTPS or localhost
- Check browser console for errors
- Clear cache and hard reload (Ctrl+Shift+R)

### App Not Working Offline
- Check that service worker is registered in DevTools
- Verify cache name in `public/service-worker.js` matches version
- Clear all caches and reload once while online

### Icons Not Showing
- Ensure `public/images/black-king.png` exists
- Check manifest.json icon paths are correct
- Clear cache and reinstall

### Old Version Showing After Update
- Service worker caches aggressively
- Update version in `public/service-worker.js` (CACHE_NAME)
- Users will get update on next visit

## 📝 Important Notes

- **DO NOT use `index.php`** - PHP requires a server and won't work offline
- **Use `index.html`** - Static HTML works perfectly for PWA
- The app is 100% client-side (React) - no server needed
- All game logic runs in the browser
- Service worker handles all caching automatically

## 🎮 How It Works

1. **First Visit**: App downloads and caches all assets
2. **Service Worker**: Registers and starts caching
3. **Subsequent Visits**: Loads instantly from cache
4. **Offline**: Works perfectly - all assets cached
5. **Updates**: Service worker detects and downloads new version

Enjoy your fully offline chess game! ♟️
