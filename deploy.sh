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

# Get current version
CURRENT_VERSION=$(grep -oP '"version":\s*"\K[^"]+' package.json)
echo "📦 Current version: $CURRENT_VERSION"
echo ""

# Ask for version bump
echo "Version bump type:"
echo "  1) Patch (0.0.X) - Bug fixes"
echo "  2) Minor (0.X.0) - New features"
echo "  3) Major (X.0.0) - Breaking changes"
echo "  4) Skip version bump"
read -p "Choose (1-4): " BUMP_CHOICE

if [ "$BUMP_CHOICE" != "4" ]; then
    # Parse current version
    IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
    
    # Bump version based on choice
    case $BUMP_CHOICE in
        1)
            PATCH=$((PATCH + 1))
            ;;
        2)
            MINOR=$((MINOR + 1))
            PATCH=0
            ;;
        3)
            MAJOR=$((MAJOR + 1))
            MINOR=0
            PATCH=0
            ;;
        *)
            echo "❌ Invalid choice"
            exit 1
            ;;
    esac
    
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
    echo ""
    echo "🔄 Bumping version: $CURRENT_VERSION → $NEW_VERSION"
    
    # Update package.json
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
    
    # Update service-worker.js (root)
    sed -i "s/chess-game-v$CURRENT_VERSION/chess-game-v$NEW_VERSION/g" service-worker.js
    sed -i "s/service worker v$CURRENT_VERSION/service worker v$NEW_VERSION/g" service-worker.js
    
    # Update public/service-worker.js
    sed -i "s/chess-game-v$CURRENT_VERSION/chess-game-v$NEW_VERSION/g" public/service-worker.js
    sed -i "s/service worker v$CURRENT_VERSION/service worker v$NEW_VERSION/g" public/service-worker.js
    
    echo "✅ Version updated to $NEW_VERSION"
    VERSION=$NEW_VERSION
else
    echo "⏭️  Skipping version bump"
    VERSION=$CURRENT_VERSION
fi

echo ""
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
