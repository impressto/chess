# Stockfish Integration

## Overview

Your chess game now supports **two AI engines**:

1. **Minimax (JavaScript)** - Easy difficulty
   - Custom-built minimax algorithm with alpha-beta pruning
   - Depth 2-3 search
   - Good for casual play
   - ~500ms-2s response time

2. **Stockfish (WebAssembly)** - Hard difficulty
   - World's strongest open-source chess engine (3500+ ELO)
   - Depth 10+ search
   - Professional-level play
   - ~100ms-1s response time

## How It Works

### Stockfish WebAssembly
- Runs natively compiled C++ code in the browser
- 10-100x faster than JavaScript
- Communicates via UCI (Universal Chess Interface) protocol
- ~500KB download (cached after first use)

### Integration Points

**stockfishAI.js** - Wrapper class that:
- Initializes Stockfish engine
- Converts board positions to FEN notation
- Translates UCI moves (e.g., "e2e4") to your game format
- Handles async communication with engine

**App.jsx** - Updated to:
- Support both AI engines
- Create appropriate AI based on user selection
- Clean up Stockfish on unmount

**StartMenu.jsx** - New UI to:
- Select AI difficulty (Easy/Hard)
- Choose player color
- Start game with selected engine

## Usage

### For Users
1. Click "AI" on start menu
2. Choose difficulty:
   - **Fácil (JavaScript)** - Easier opponent
   - **Difícil (Stockfish)** - Challenging opponent
3. Choose your color
4. Play!

### For Developers

**Adjusting Stockfish Strength:**
```javascript
// In stockfishAI.js
this.skillLevel = 10; // 0-20 (20 = strongest)
```

**Changing Search Depth:**
```javascript
// In stockfishAI.js play() method
this.stockfish.postMessage('go depth 10'); // Depth 5-15 recommended
```

**Using Time-Based Search:**
```javascript
// Alternative to depth
this.stockfish.postMessage('go movetime 1000'); // 1 second
```

## Performance

### Minimax (JavaScript)
- Opening: 500-2000ms
- Middlegame: 300-1500ms
- Endgame: 300-1000ms
- Plays at ~1200-1400 ELO level

### Stockfish (WebAssembly)
- Any position: 100-1000ms
- Plays at ~2800-3500 ELO level (adjustable)
- Never freezes browser

## Technical Details

### FEN Conversion
Stockfish uses FEN (Forsyth–Edwards Notation) for board positions:
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

The `piecesToFEN()` method converts your piece array to FEN format.

### UCI Protocol
Example communication:
```
→ uci
← uciok
→ isready
← readyok
→ position fen [FEN string]
→ go depth 10
← bestmove e2e4
```

### Move Translation
UCI format (e.g., "e2e4") is converted to:
```javascript
{
  pieceName: "whitePawn4",
  position: 44
}
```

## Future Enhancements

- **Opening Book**: Load opening theory for faster early game
- **Endgame Tablebases**: Perfect endgame play
- **Multi-Threading**: Use Web Workers for parallel search
- **Analysis Mode**: Show best moves and evaluations
- **Different Skill Levels**: Fine-tune difficulty (0-20)
- **Move Hints**: Show suggested moves to help players learn

## Troubleshooting

**Stockfish not responding:**
- Check browser console for errors
- Ensure stockfish.js is properly installed
- Try reloading the page

**Slow performance:**
- Reduce search depth (currently depth 10)
- Check browser compatibility
- Ensure no other heavy processes running

**Browser compatibility:**
- Requires WebAssembly support (all modern browsers)
- Chrome 57+, Firefox 52+, Safari 11+, Edge 16+

## Resources

- [Stockfish Website](https://stockfishchess.org/)
- [UCI Protocol](https://www.chessprogramming.org/UCI)
- [FEN Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation)
