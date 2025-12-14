# ♟️ Barbarian-Themed Chess: An Example of an Offline Progressive Web App Built with React

<img width="400" height="477" alt="chess-screen" src="https://github.com/user-attachments/assets/125df68f-b3b2-4a2e-b06d-248f3c77e33a" />


A feature-rich chess game built with React and Vite, featuring Stockfish AI integration, multiple difficulty levels, and a Progressive Web App (PWA) architecture for offline play.

## 🌟 Features

- **AI Opponent**: Play against Stockfish chess engine with 5 difficulty levels
- **Progressive Web App**: Install and play offline on any device
- **Multiplayer**: Local two-player mode
- **Visual Effects**: Customizable AI move animations and themes
- **Move History**: Track and review game moves
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Multi-language Support**: Internationalization ready

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chess
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:5173 (or the port shown in your terminal)
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customizing Your Chess Game

This project is designed to be easily customizable! Here's how to make it your own:

### 1. Visual Theme Configuration

All visual settings are centralized in `src/config/visualConfig.js`. You can customize:

#### AI Move Flash Animation

Edit the `aiMoveFlash` section in `src/config/visualConfig.js`:

```javascript
aiMoveFlash: {
  duration: 2000,              // Animation duration in milliseconds
  primaryColor: '#00FFFF',     // Main flash color (hex code)
  secondaryColor: '#FF00FF',   // Secondary flash color
  intensity: 0.7,              // Flash opacity (0-1)
  glowIntensity: 0.8,         // Glow effect intensity (0-1)
}
```

#### Pre-made Color Schemes

Check out `src/config/colorSchemes.js` for ready-to-use themes:

- **arcade**: Classic neon cyan/magenta
- **matrix**: Hacker-style green
- **fireIce**: Orange and turquoise contrast
- **sunset**: Pink and gold vibes
- **electric**: Electric blue theme
- **rainbow**: Vibrant multicolor
- **purple**: Purple haze
- **subtle**: Professional low-key
- **christmas**: Red and green
- **halloween**: Orange and purple
- **ocean**: Turquoise waves

To use a preset scheme, copy its configuration into `visualConfig.js`.

#### Custom Colors

Use any hex color code from design tools like:
- Color pickers (Chrome DevTools, Adobe Color, etc.)
- Design systems (Tailwind, Material UI)
- Online generators (coolors.co, etc.)

Example custom scheme:
```javascript
aiMoveFlash: {
  duration: 1500,
  primaryColor: '#FF6B6B',   // Coral
  secondaryColor: '#4ECDC4', // Teal
  intensity: 0.6,
  glowIntensity: 0.7,
}
```

### 2. Chess Piece Styles

Replace the piece images in `src/assets/images/peices/` with your own designs:
- Format: PNG with transparency recommended
- Naming convention: `<color><piece>.png` (e.g., `blackpawn.png`, `whiteking.png`)
- Size: 100x100px recommended for best quality

### 3. Board Colors & Styles

Edit `src/components/ChessBoard.css` to change board appearance:

```css
/* Light squares */
.square.light {
  background-color: #f0d9b5; /* Change this color */
}

/* Dark squares */
.square.dark {
  background-color: #b58863; /* Change this color */
}
```

### 4. Game Info Panel

Customize the game information display in `src/components/GameInfo.jsx` and `GameInfo.css`.

### 5. Start Menu

Modify the initial menu in `src/components/StartMenu.jsx` and `StartMenu.css` to change:
- Button styles
- Layout
- Difficulty level descriptions
- Game mode options

### 6. Language & Text

Add or modify translations in `src/contexts/LanguageContext.jsx` to:
- Add new languages
- Customize text and messages
- Change game terminology

### 7. Stockfish AI Configuration

Adjust AI behavior in `src/game/stockfishAI.js`:

```javascript
// Difficulty levels (skill level 0-20)
const DIFFICULTY_LEVELS = {
  1: { skill: 1, depth: 1 },
  2: { skill: 5, depth: 5 },
  3: { skill: 10, depth: 10 },
  4: { skill: 15, depth: 15 },
  5: { skill: 20, depth: 20 },
};
```

Modify skill levels and search depth to create custom difficulty curves.

## 📁 Project Structure

```
chess/
├── public/               # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── images/          # App icons
│   └── stockfish/       # Stockfish engine files
├── src/
│   ├── components/      # React components
│   │   ├── ChessBoard.jsx
│   │   ├── GameInfo.jsx
│   │   ├── StartMenu.jsx
│   │   └── EndGameModal.jsx
│   ├── config/          # Configuration files
│   │   ├── visualConfig.js      # Visual settings
│   │   └── colorSchemes.js      # Color presets
│   ├── contexts/        # React contexts
│   ├── game/            # Game logic
│   │   ├── Game.js      # Chess rules
│   │   ├── piece.js     # Piece definitions
│   │   └── stockfishAI.js # AI integration
│   └── assets/          # Images and static files
├── service-worker.js    # PWA service worker
└── vite.config.js       # Vite configuration
```

## 🛠️ Advanced Customization

### Adding New Game Modes

1. Create a new mode in `src/components/StartMenu.jsx`
2. Add logic in `src/App.jsx` to handle the mode
3. Implement mode-specific rules in `src/game/Game.js`

### Custom Sound Effects

1. Add audio files to `src/assets/sounds/`
2. Import and play sounds on move events in `ChessBoard.jsx`
3. Add volume controls in game settings

### Analytics Integration

Add tracking to key game events:
- Game starts
- Moves made
- Games completed
- Difficulty selected

### Multiplayer Online Mode

The game currently supports local multiplayer. To add online play:
1. Set up a backend server (WebSocket recommended)
2. Implement room/lobby system
3. Sync game state between clients
4. Handle disconnections gracefully

## 📚 Additional Documentation

- **PWA Setup**: See `PWA-SETUP.md`
- **Visual Config Guide**: See `src/config/VISUAL_CONFIG_GUIDE.md`
- **Stockfish Integration**: See `STOCKFISH-INTEGRATION.md`
- **Deployment**: See `DEPLOYMENT.md`

## 🐛 Troubleshooting

### Stockfish Not Working
See `STOCKFISH-TROUBLESHOOTING.md` for common issues and solutions.

### Offline Mode Issues
Check `OFFLINE-PWA-FIX.md` for PWA-related problems.

### Build Errors
Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for modification and redistribution.

## 🎮 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Stockfish WASM** - Chess engine
- **Progressive Web App** - Offline capabilities
- **Service Workers** - Caching and offline support

## 💡 Tips for Developers

1. **Hot Reload**: Changes to components will hot-reload automatically
2. **Console Logs**: Check browser console for Stockfish engine messages
3. **State Management**: Game state is managed in `App.jsx` - consider Redux for complex features
4. **Performance**: Use React DevTools Profiler to optimize rendering
5. **Testing**: Add test scripts with Jest or Vitest for game logic

---

**Happy Coding! Make this chess game your own! ♟️**
