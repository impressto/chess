#!/bin/bash

# Chess PWA - Configuration Checker
# This script verifies that everything is properly set up for offline PWA

echo "🔍 Chess PWA Configuration Checker"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Dist folder exists
echo -n "📁 Checking dist folder... "
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} dist/ folder not found. Run 'yarn build' first."
    ERRORS=$((ERRORS+1))
fi

# Check 2: Service worker exists in dist
echo -n "🔧 Checking service worker... "
if [ -f "dist/service-worker.js" ]; then
    echo -e "${GREEN}✓${NC}"
    
    # Check version matches
    PKG_VERSION=$(grep -oP '"version":\s*"\K[^"]+' package.json)
    SW_VERSION=$(grep -oP "CACHE_NAME = 'chess-game-v\K[^']+" dist/service-worker.js)
    
    if [ "$PKG_VERSION" = "$SW_VERSION" ]; then
        echo "   Version: $SW_VERSION ${GREEN}✓${NC}"
    else
        echo -e "   ${YELLOW}⚠${NC} Version mismatch: package.json ($PKG_VERSION) != service-worker.js ($SW_VERSION)"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${RED}✗${NC} dist/service-worker.js not found"
    ERRORS=$((ERRORS+1))
fi

# Check 3: Manifest exists
echo -n "📋 Checking manifest.json... "
if [ -f "dist/manifest.json" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} dist/manifest.json not found"
    ERRORS=$((ERRORS+1))
fi

# Check 4: Required assets exist
echo "🖼️  Checking assets..."

REQUIRED_ASSETS=(
    "dist/assets/index.js"
    "dist/assets/vendor.js"
    "dist/assets/index.css"
    "dist/assets/black-king.png"
    "dist/assets/white-king.png"
    "dist/assets/black-queen.png"
    "dist/assets/white-queen.png"
    "dist/assets/black-rook.png"
    "dist/assets/white-rook.png"
    "dist/assets/black-bishop.png"
    "dist/assets/white-bishop.png"
    "dist/assets/black-knight.png"
    "dist/assets/white-knight.png"
    "dist/assets/black-pawn.png"
    "dist/assets/white-pawn.png"
    "dist/assets/board.jpg"
    "dist/assets/logo.png"
)

MISSING=0
for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ ! -f "$asset" ]; then
        if [ $MISSING -eq 0 ]; then
            echo ""
        fi
        echo -e "   ${RED}✗${NC} Missing: $asset"
        MISSING=$((MISSING+1))
    fi
done

if [ $MISSING -eq 0 ]; then
    echo -e "   All assets present ${GREEN}✓${NC}"
else
    ERRORS=$((ERRORS+MISSING))
fi

# Check 5: Service worker cache list
echo -n "📦 Checking service worker cache list... "
if grep -q "/chess/dist/assets/index.js" dist/service-worker.js && \
   grep -q "/chess/dist/assets/vendor.js" dist/service-worker.js && \
   grep -q "black-king.png" dist/service-worker.js; then
    echo -e "${GREEN}✓${NC}"
    
    # Count cached files
    CACHED_COUNT=$(grep -c "'/chess/" dist/service-worker.js || echo 0)
    echo "   Caching $CACHED_COUNT files"
else
    echo -e "${RED}✗${NC} Service worker cache list incomplete"
    ERRORS=$((ERRORS+1))
fi

# Check 6: index.php exists and has service worker registration
echo -n "🐘 Checking index.php... "
if [ -f "index.php" ]; then
    if grep -q "serviceWorker.register" index.php; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC} index.php exists but no service worker registration found"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${YELLOW}⚠${NC} index.php not found (using index.html)"
    WARNINGS=$((WARNINGS+1))
fi

# Check 7: Nginx config exists
echo -n "🌐 Checking nginx config... "
if [ -f "nginx.conf" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} nginx.conf not found"
    WARNINGS=$((WARNINGS+1))
fi

# Check 8: Vite config base path
echo -n "⚡ Checking vite.config.js... "
if grep -q "base: '/chess/dist/'" vite.config.js; then
    echo -e "${GREEN}✓${NC} (base: '/chess/dist/')"
else
    echo -e "${YELLOW}⚠${NC} base path may not match deployment"
    WARNINGS=$((WARNINGS+1))
fi

# Summary
echo ""
echo "===================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready to deploy! 🚀"
    echo ""
    echo "Next steps:"
    echo "1. Copy nginx.conf contents to your nginx server config"
    echo "2. Reload nginx: sudo systemctl reload nginx"
    echo "3. Visit your site and test offline mode"
else
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    fi
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
    fi
    echo ""
    
    if [ $ERRORS -gt 0 ]; then
        echo "Please fix errors before deploying."
        echo "Run 'yarn build' if you haven't already."
    fi
fi

echo ""
