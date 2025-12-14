// Visual configuration for chess game effects

// Helper function to convert hex color to RGB object
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle both 6-digit (#RRGGBB) and 8-digit (#RRGGBBAA) hex codes
  // 8-digit has alpha channel which we ignore (use intensity settings instead)
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

export const visualConfig = {
  // AI move flash settings
  aiMoveFlash: {
    // Duration in milliseconds
    duration: 1500,
    
    // Primary flash color (hex format - easier to use!)
    primaryColor: '#ff7b00ff',  // Cyan
    
    // Secondary flash color (hex format)
    secondaryColor: '#fdd44eff',  // Magenta
    
    // Flash intensity (0-1)
    intensity: 0.7,
    
    // Glow intensity (0-1)
    glowIntensity: 0.8,
    
    // Number of flashes
    flashCount: 2
  },
  
  // Other visual effects can be added here
  captureAnimation: {
    duration: 800,
    color: '#FF0000'  // Red
  }
};

// Helper function to convert color (hex or RGB object) to rgba string
export const rgbaString = (color, alpha = 1) => {
  // If it's a string (hex), convert it first
  if (typeof color === 'string') {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }
  // If it's already an RGB object
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
};

// Preset color schemes for quick switching (now in hex format!)
export const colorPresets = {
  neonCyan: '#00FFFF',
  neonMagenta: '#FF00FF',
  neonGreen: '#39FF14',
  neonPink: '#FF10F0',
  neonOrange: '#FF9F00',
  neonBlue: '#00BFFF',
  neonYellow: '#FFFF00',
  neonPurple: '#BF00FF',
  electricLime: '#CCFF00',
  hotPink: '#FF69B4',
  aqua: '#00FFFF',
  springGreen: '#00FF7F',
  deepPink: '#FF1493',
  gold: '#FFD700'
};
