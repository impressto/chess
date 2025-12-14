# Install App Button Setup

## What Was Added

### 1. New Component: `InstallPrompt.jsx`
- Location: `src/components/InstallPrompt.jsx`
- Displays a floating "Install App" button (♟️ Install App)
- Positioned at bottom-right corner with chess-themed brown colors
- Only shows when:
  - Browser supports PWA installation
  - App is not already installed
  - Browser fires the `beforeinstallprompt` event

### 2. Updated Files

#### `src/App.jsx`
- Imported the new `InstallPrompt` component
- Added `<InstallPrompt />` to the JSX (renders on all screens)

#### `public/manifest.json`
- Fixed icon paths to use `/chess/` prefix (was `/chess/dist/`)
- Changed orientation from `portrait` to `any` for better flexibility
- Added 192x192 icon for better device support

#### `index.html`
- Updated manifest link to use `/chess/manifest.json`
- Updated icon links to use `/chess/` prefix
- Added multiple icon sizes for better device support

## How It Works

1. **Service Worker Registration** (already existed in `index.php` and `main.jsx`)
   - Registers the service worker at `/chess/service-worker.js`

2. **Browser Detection**
   - Browser checks if app meets PWA criteria
   - Fires `beforeinstallprompt` event if installation is available

3. **InstallPrompt Component**
   - Listens for `beforeinstallprompt` event
   - Prevents default mini-infobar
   - Shows custom "Install App" button
   - Handles click to trigger installation prompt

4. **Installation**
   - User clicks "Install App" button
   - Browser shows native install dialog
   - User confirms installation
   - App gets installed to home screen
   - Button disappears after installation

## Testing

### On Mobile Device:
1. Open the chess app in Chrome/Edge on Android or Safari on iOS
2. Make sure you're accessing via HTTPS (https://impressto.ca/chess/)
3. The "Install App" button should appear at bottom-right
4. Click the button to install
5. App icon will be added to home screen

### Requirements for Button to Appear:
- ✅ HTTPS connection
- ✅ Valid manifest.json with name, icons, start_url
- ✅ Registered service worker
- ✅ App not already installed
- ✅ Browser supports PWA installation (Chrome, Edge, Safari on iOS)

### If Button Doesn't Appear:
1. Check browser console for errors
2. Verify manifest.json loads correctly (check Network tab)
3. Verify service worker registered (check Application tab in DevTools)
4. Try in Chrome on Android (best PWA support)
5. Make sure app isn't already installed

## Differences from WordWalker

Both apps now have the same install functionality:
- ✅ InstallPrompt component with similar styling (adapted for chess theme)
- ✅ Service worker registration
- ✅ Proper manifest.json configuration
- ✅ `beforeinstallprompt` event handling

## Deploy

Run the existing deploy script:
```bash
./deploy.sh
```

Then test on a mobile device at: https://impressto.ca/chess/
