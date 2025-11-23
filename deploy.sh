#!/bin/bash

# Quick deployment helper for Chess PWA
# Run this after making changes

echo "🚀 Chess PWA - Quick Deploy Helper"
echo "=================================="
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the chess directory"
    exit 1
fi

# Get version
VERSION=$(grep -oP '"version":\s*"\K[^"]+' package.json)
echo "📦 Current version: $VERSION"
echo ""

# Build
echo "🔨 Building..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""

# Show what to deploy
echo "📋 Files to upload to server:"
echo "   - index.php (if changed)"
echo "   - service-worker.js (IMPORTANT: at root, not in dist!)"
echo "   - dist/ folder (entire folder)"
echo "   - sw-debug.html (debugging tool)"
echo ""

# Check version consistency
PKG_VERSION=$(grep -oP '"version":\s*"\K[^"]+' package.json)
SW_VERSION=$(grep -oP "CACHE_NAME = 'chess-game-v\K[^']+" dist/service-worker.js)

if [ "$PKG_VERSION" = "$SW_VERSION" ]; then
    echo "✅ Version consistent: $SW_VERSION"
else
    echo "⚠️  WARNING: Version mismatch!"
    echo "   package.json: $PKG_VERSION"
    echo "   service-worker.js: $SW_VERSION"
fi

echo ""
echo "🔍 After deploying, test at:"
echo "   https://impressto.ca/chess/sw-debug.html"
echo ""
echo "📱 To test offline on mobile:"
echo "   1. Visit https://impressto.ca/chess/sw-debug.html"
echo "   2. Tap 'Clear All Caches' and 'Unregister Service Worker'"
echo "   3. Visit https://impressto.ca/chess/"
echo "   4. Install PWA"
echo "   5. Turn off internet"
echo "   6. Open PWA - should work!"
echo ""
