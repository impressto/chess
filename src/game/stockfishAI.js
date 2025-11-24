// Stockfish WebAssembly AI wrapper using stockfish.wasm
class StockfishAI {
  constructor(aiColor, difficulty = 'intermediate') {
    this.aiColor = aiColor;
    this.stockfish = null;
    this.isReady = false;
    this.pendingCallback = null;
    this.bestMove = null;
    
    console.log(`🎯 Creating new StockfishAI instance with difficulty: "${difficulty}"`);
    
    // Map difficulty levels to Stockfish skill levels (0-20)
    const difficultyMap = {
      'beginner': 1,      // Easiest - makes many mistakes
      'casual': 2,        // Hobby player level
      'intermediate': 8, // Club player level
      'advanced': 12,     // Strong amateur
      'master': 20        // Near full strength
    };
    
    // Use !== undefined to allow skill level 0
    this.skillLevel = difficultyMap[difficulty] !== undefined ? difficultyMap[difficulty] : 10;
    this.difficulty = difficulty;
    this.initTimeout = null;
    this.initAttempts = 0;
    this.maxInitAttempts = 3;
    
    console.log(`🎯 Stockfish AI difficulty: ${difficulty} (skill level ${this.skillLevel})`);
    console.log(`🎯 Difficulty map lookup: difficultyMap["${difficulty}"] = ${difficultyMap[difficulty]}`);
    
    this.initStockfish();
  }

  // Helper to dynamically load Stockfish script
  loadStockfishScript() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof window.Stockfish !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      // In dev mode, Vite serves public files from /chess/dist/
      // In production, they're also at /chess/dist/
      script.src = '/chess/dist/stockfish/stockfish.js';
      console.log('Loading Stockfish from:', script.src);
      script.onload = () => {
        console.log('✓ Stockfish script loaded successfully');
        // Give it a moment to initialize
        setTimeout(resolve, 100);
      };
      script.onerror = (error) => {
        console.error('Failed to load Stockfish script from:', script.src);
        reject(new Error('Failed to load Stockfish script'));
      };
      document.head.appendChild(script);
    });
  }

  async initStockfish() {
    try {
      console.log('Initializing Stockfish WASM...');
      
      // Check WebAssembly support
      const wasmSupported = typeof WebAssembly === 'object';
      console.log('WebAssembly supported:', wasmSupported);
      
      if (!wasmSupported) {
        throw new Error('WebAssembly not supported in this browser');
      }
      
      // stockfish.wasm doesn't work well with ES6 imports in Vite
      // We need to load it as a script and access the global Stockfish function
      console.log('Loading Stockfish from node_modules...');
      
      // Check if Stockfish is already loaded globally
      if (typeof window.Stockfish !== 'undefined') {
        console.log('Using existing global Stockfish');
        const engine = await window.Stockfish();
        this.stockfish = engine;
        console.log('✓ Stockfish engine created from global');
      } else {
        // Load the stockfish.js script dynamically
        console.log('Loading Stockfish script...');
        await this.loadStockfishScript();
        
        // Now Stockfish should be available globally
        if (typeof window.Stockfish === 'undefined') {
          throw new Error('Stockfish failed to load as global');
        }
        
        console.log('Calling global Stockfish()...');
        const engine = await window.Stockfish();
        this.stockfish = engine;
        console.log('✓ Stockfish engine created');
        console.log('Engine object type:', typeof engine);
        console.log('Engine is null?', engine === null);
        console.log('Engine is undefined?', engine === undefined);
      }
      
      console.log('Available methods:', Object.keys(this.stockfish).filter(k => typeof this.stockfish[k] === 'function'));
      
      // Set up message listener using addMessageListener (stockfish.wasm API)
      if (typeof this.stockfish.addMessageListener === 'function') {
        console.log('Setting up message listener with addMessageListener');
        this.stockfish.addMessageListener((message) => {
          this.handleMessage(message);
        });
      } else {
        throw new Error('Engine does not have addMessageListener method');
      }
      
      // Send UCI initialization command
      console.log('Sending UCI command...');
      if (typeof this.stockfish.postMessage === 'function') {
        this.stockfish.postMessage('uci');
      } else {
        throw new Error('Engine does not have postMessage method');
      }
      
    } catch (error) {
      console.error('Failed to initialize Stockfish WASM:', error);
      console.error('Error details:', error.stack);
      this.isReady = false;
      this.stockfish = null;
      
      // Retry initialization if under max attempts
      this.initAttempts++;
      if (this.initAttempts < this.maxInitAttempts) {
        console.log(`Retrying initialization (attempt ${this.initAttempts + 1}/${this.maxInitAttempts})...`);
        setTimeout(() => this.initStockfish(), 1000);
      } else {
        console.error('Max initialization attempts reached. Stockfish unavailable.');
      }
    }
  }

  handleMessage(message) {
    console.log('Stockfish:', message);

    if (message === 'uciok') {
      console.log('✓ UCI initialization successful');
      // Set skill level and related options before marking ready
      this.stockfish.postMessage(`setoption name Skill Level value ${this.skillLevel}`);
      
      // For lower skill levels, also limit the depth and enable MultiPV for more randomness
      if (this.skillLevel <= 5) {
        // Beginner and Casual levels - very limited
        this.stockfish.postMessage(`setoption name UCI_LimitStrength value true`);
        this.stockfish.postMessage(`setoption name UCI_Elo value ${800 + this.skillLevel * 100}`);
        console.log(`Setting UCI_Elo to ${800 + this.skillLevel * 100} for weaker play`);
      } else if (this.skillLevel <= 10) {
        // Intermediate level
        this.stockfish.postMessage(`setoption name UCI_LimitStrength value true`);
        this.stockfish.postMessage(`setoption name UCI_Elo value ${1300 + this.skillLevel * 50}`);
        console.log(`Setting UCI_Elo to ${1300 + this.skillLevel * 50}`);
      }
      
      this.stockfish.postMessage('isready');
    } else if (message === 'readyok') {
      this.isReady = true;
      console.log(`✓ Stockfish is ready with skill level ${this.skillLevel}`);
      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
        this.initTimeout = null;
      }
    } else if (message.startsWith('bestmove')) {
      // Extract best move from message like "bestmove e2e4"
      const parts = message.split(' ');
      this.bestMove = parts[1];
      
      console.log('✓ Best move calculated:', this.bestMove);
      
      if (this.pendingCallback) {
        this.pendingCallback(this.bestMove);
        this.pendingCallback = null;
      }
    }
  }

  // Convert piece position to algebraic notation (e.g., 44 -> "e4")
  positionToAlgebraic(position) {
    const file = (position % 10) - 1; // 0-7
    const rank = Math.floor(position / 10) - 1; // 0-7
    
    const files = 'abcdefgh';
    const ranks = '12345678';
    
    return files[file] + ranks[rank];
  }

  // Convert algebraic notation to position (e.g., "e4" -> 44)
  algebraicToPosition(algebraic) {
    const files = 'abcdefgh';
    const file = files.indexOf(algebraic[0]) + 1;
    const rank = parseInt(algebraic[1]);
    
    return rank * 10 + file;
  }

  // Convert move history to UCI format
  getUCIPosition(pieces, moveHistory = []) {
    // Start position in FEN notation or use move list
    let position = 'position startpos';
    
    if (moveHistory && moveHistory.length > 0) {
      position += ' moves ' + moveHistory.join(' ');
    }
    
    return position;
  }

  // Convert current board state to FEN notation
  piecesToFEN(pieces) {
    // Initialize empty board
    // In FEN: first rank in string = rank 8, last rank = rank 1
    const board = Array(8).fill(null).map(() => Array(8).fill('.'));
    
    // Place pieces on board
    pieces.forEach(piece => {
      // Your position system: 11-18 (rank 1), 21-28 (rank 2), ... 81-88 (rank 8)
      const file = (piece.position % 10) - 1; // 1-8 becomes 0-7
      const rank = Math.floor(piece.position / 10) - 1; // 1-8 becomes 0-7
      
      if (rank >= 0 && rank < 8 && file >= 0 && file < 8) {
        const pieceMap = {
          pawn: 'p',
          knight: 'n',
          bishop: 'b',
          rook: 'r',
          queen: 'q',
          king: 'k'
        };
        
        let symbol = pieceMap[piece.rank] || 'p';
        if (piece.color === 'white') {
          symbol = symbol.toUpperCase();
        }
        
        // board[rank][file] where rank 0 = rank 1, rank 7 = rank 8
        board[rank][file] = symbol;
      }
    });
    
    // Convert board to FEN
    // FEN goes from rank 8 to rank 1 (top to bottom from white's perspective)
    // So we read from board[7] down to board[0]
    let fen = '';
    for (let rank = 7; rank >= 0; rank--) {
      let emptyCount = 0;
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece === '.') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += piece;
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if (rank > 0) {
        fen += '/';
      }
    }
    
    // Add turn, castling, en passant, halfmove, fullmove
    // For simplicity, assuming white to move, no castling, no en passant
    const turn = this.aiColor === 'white' ? 'w' : 'b';
    fen += ` ${turn} - - 0 1`;
    
    return fen;
  }

  // Get piece name from position
  findPieceAtPosition(pieces, position) {
    const piece = pieces.find(p => p.position === position);
    return piece ? piece.name : null;
  }

  // Main play function
  play(pieces, callback, moveHistory = []) {
    // Check if Stockfish failed to initialize
    if (!this.stockfish) {
      console.error('Stockfish engine not available');
      callback({ move: null, score: 0, error: 'Stockfish not available' });
      return;
    }

    if (!this.isReady) {
      console.warn('Stockfish not ready yet, waiting...');
      setTimeout(() => this.play(pieces, callback, moveHistory), 500);
      return;
    }

    console.log('Stockfish AI calculating move...');
    this.pendingCallback = (uciMove) => {
      if (!uciMove || uciMove === '(none)') {
        console.error('Stockfish returned invalid move:', uciMove);
        callback({ move: null, score: 0 });
        return;
      }

      // Convert UCI move (e.g., "e2e4") to our format
      const from = this.algebraicToPosition(uciMove.substring(0, 2));
      const to = this.algebraicToPosition(uciMove.substring(2, 4));
      
      const pieceName = this.findPieceAtPosition(pieces, from);
      
      if (!pieceName) {
        console.error('Could not find piece at position', from);
        callback({ move: null, score: 0 });
        return;
      }

      const move = {
        pieceName: pieceName,
        position: to
      };

      console.log('Stockfish move:', uciMove, '→', move);
      callback({ move, score: 0, uciMove });
    };

    // Set position using FEN
    const fen = this.piecesToFEN(pieces);
    console.log('Position FEN:', fen);
    this.stockfish.postMessage(`position fen ${fen}`);
    
    // Search with depth based on skill level
    // Lower skill = lower depth = weaker play
    let searchDepth;
    if (this.skillLevel === 0) {
      searchDepth = 1; // Skill level 0 - only looks 1 move ahead
    } else if (this.skillLevel === 1) {
      searchDepth = 2; // Beginner - looks 2 moves ahead
    } else if (this.skillLevel <= 5) {
      searchDepth = 3; // Very weak - looks 3 moves ahead
    } else if (this.skillLevel <= 10) {
      searchDepth = 6; // Intermediate - looks 6 moves ahead
    } else if (this.skillLevel <= 15) {
      searchDepth = 10; // Advanced - looks 10 moves ahead
    } else {
      searchDepth = 15; // Master - deep search
    }
    
    console.log(`Searching with depth ${searchDepth} for skill level ${this.skillLevel}`);
    this.stockfish.postMessage(`go depth ${searchDepth}`);
  }

  // Set difficulty level (0-20)
  setSkillLevel(level) {
    this.skillLevel = Math.max(0, Math.min(20, level));
    if (this.stockfish) {
      this.stockfish.postMessage(`setoption name Skill Level value ${this.skillLevel}`);
      console.log(`Stockfish skill level set to ${this.skillLevel}`);
    }
  }

  // Cleanup
  destroy() {
    if (this.stockfish) {
      this.stockfish.postMessage('quit');
      this.stockfish = null;
    }
  }
}

export default StockfishAI;
