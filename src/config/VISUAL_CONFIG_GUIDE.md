# Visual Configuration Guide

This file (`src/config/visualConfig.js`) controls all visual effects in the chess game, including the AI move flash animation.

## AI Move Flash Configuration

### Basic Settings

```javascript
aiMoveFlash: {
  duration: 2000,  // Duration in milliseconds (how long the flash lasts)
  // ...
}
```

### Colors

You can customize the flash colors using hex color codes (much easier!):

```javascript
primaryColor: '#00FFFF',    // Cyan
secondaryColor: '#FF00FF',  // Magenta
```

You can use any hex color code from design tools, websites, or color pickers.

### Intensity Settings

```javascript
intensity: 0.7,      // Flash opacity (0-1, where 1 is fully opaque)
glowIntensity: 0.8,  // Glow effect intensity (0-1)
```

### Using Color Presets

Instead of typing hex codes, you can use the predefined color presets:

```javascript
import { colorPresets } from './config/visualConfig';

// Then modify the config to use a preset:
primaryColor: colorPresets.neonGreen,
secondaryColor: colorPresets.neonOrange,
```

Available presets:
- `neonCyan` - #00FFFF - Bright cyan
- `neonMagenta` - #FF00FF - Bright magenta
- `neonGreen` - #39FF14 - Bright green
- `neonPink` - #FF10F0 - Hot pink
- `neonOrange` - #FF9F00 - Bright orange
- `neonBlue` - #00BFFF - Deep sky blue
- `neonYellow` - #FFFF00 - Bright yellow
- `neonPurple` - #BF00FF - Electric purple
- `electricLime` - #CCFF00 - Electric lime
- `hotPink` - #FF69B4 - Hot pink
- `aqua` - #00FFFF - Aqua
- `springGreen` - #00FF7F - Spring green
- `deepPink` - #FF1493 - Deep pink
- `gold` - #FFD700 - Gold

## Example Configurations

### Fast & Subtle
```javascript
aiMoveFlash: {
  duration: 1000,
  primaryColor: '#00BFFF',  // Blue
  secondaryColor: '#00FFFF',  // Cyan
  intensity: 0.4,
  glowIntensity: 0.5,
}
```

### Slow & Dramatic
```javascript
aiMoveFlash: {
  duration: 3000,
  primaryColor: '#39FF14',  // Neon green
  secondaryColor: '#FF9F00',  // Orange
  intensity: 0.9,
  glowIntensity: 1.0,
}
```

### Classic Neon (Current Default)
```javascript
aiMoveFlash: {
  duration: 2000,
  primaryColor: '#00FFFF',  // Cyan
  secondaryColor: '#FF00FF',  // Magenta
  intensity: 0.7,
  glowIntensity: 0.8,
}
```

### Single Color Flash
```javascript
aiMoveFlash: {
  duration: 1500,
  primaryColor: '#39FF14',  // Neon green
  secondaryColor: '#39FF14',  // Same as primary for single color
  intensity: 0.8,
  glowIntensity: 0.9,
}
```

### Custom Hex Colors
```javascript
aiMoveFlash: {
  duration: 2000,
  primaryColor: '#FF1493',  // Deep pink (from any color picker)
  secondaryColor: '#FFD700',  // Gold
  intensity: 0.7,
  glowIntensity: 0.8,
}
```

## Tips

1. **Duration**: 
   - Fast (< 1500ms): Quick, subtle flash
   - Medium (1500-2500ms): Balanced, noticeable
   - Slow (> 2500ms): Dramatic, attention-grabbing

2. **Intensity**: 
   - Low (< 0.5): Subtle, doesn't obscure pieces
   - Medium (0.5-0.7): Balanced visibility
   - High (> 0.7): Very bright, may obscure pieces

3. **Color Combinations**:
   - Contrasting colors (cyan/magenta, green/orange) create dynamic flashes
   - Similar colors create smoother transitions
   - Same colors create a pulsing effect

4. **Glow Intensity**:
   - Controls the halo/shadow effect around the square
   - Higher values create more dramatic lighting effects

## Finding Hex Colors

You can get hex color codes from:
- **Online Color Pickers**: 
  - https://htmlcolorcodes.com/
  - https://colorpicker.me/
  - Chrome DevTools color picker
- **Design Tools**: Figma, Photoshop, etc.
- **Color Palette Generators**: coolors.co, colormind.io
- **Any website**: Use browser inspector to see hex codes

Just copy the hex code (e.g., `#FF69B4`) and paste it into the config!
