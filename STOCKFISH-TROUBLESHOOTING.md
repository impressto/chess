# Stockfish.js Troubleshooting

## Current Issue
The stockfish.js npm package export structure may not match the expected format.

## Solution Options

### Option 1: Check Console Output
Look for this message in browser console:
```
Available exports: [list of exports]
```

This will tell us the correct way to import Stockfish.

### Option 2: Use CDN Instead
If npm package doesn't work, we can use Stockfish via CDN:

1. Add to `public/index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/stockfish@16/stockfish.js"></script>
```

2. Update `stockfishAI.js` to use global Stockfish:
```javascript
this.stockfish = new Worker('https://cdn.jsdelivr.net/npm/stockfish@16/stockfish.js');
```

### Option 3: Use chess.js + Stockfish Web Worker
Alternative approach using a different package structure.

## Quick Test
Try this in browser console:
```javascript
import('stockfish.js').then(m => console.log('Stockfish module:', m, 'Keys:', Object.keys(m)));
```

This will show us exactly what's exported.

## Fallback Behavior
If Stockfish fails to load:
- Game continues to work
- Only minimax AI is available
- No browser crash
- Error logged to console
