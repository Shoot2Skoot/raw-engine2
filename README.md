# Roll-and-Write Game Engine

A comprehensive web-based engine for creating digital roll-and-write board games. Build games like Yahtzee, Welcome to the Moon, Railroad Ink, and more with minimal code.

## Features

✅ **Flexible Sheet System**
- Grid-based sheets (auto-generated cells)
- Image overlay sheets (custom backgrounds with hotspots)
- Custom layouts with freeform positioning
- Multi-sheet support for complex games

✅ **Rich Mark Types**
- Checkboxes (empty/checked/crossed)
- Numbers (0-999)
- Color fills with opacity
- Circles (empty/half/full)
- Symbols and icons
- Freeform text
- Connection lines

✅ **Dice Mechanics**
- Standard dice (d4, d6, d8, d10, d12, d20)
- Custom dice with symbols, colors, and text
- Dice locking and rerolling
- Multiple dice pools

✅ **State Management**
- Full undo/redo support (50 action history)
- Auto-save to localStorage
- Manual save/load to JSON files
- Complete game state serialization

✅ **Player Experience**
- Keyboard shortcuts for all actions
- Touch-optimized for mobile/tablet
- Responsive design
- Pencil/pen marking modes
- Instant visual feedback

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running the Example

The project includes a working Yahtzee game example. After running `npm run dev`, open your browser to `http://localhost:5173`.

## Creating Your First Game

### 1. Define Your Game Configuration

Create a new file in `src/games/`:

```typescript
// src/games/mygame.ts
import type { GameConfig } from '../types';
import { DEFAULT_TOOLS } from '../types';

export const myGameConfig: GameConfig = {
  id: 'mygame',
  name: 'My Game',
  version: '1.0.0',

  // Define sheets
  sheets: [{
    sheet: {
      id: 'main-sheet',
      name: 'Score Sheet',
      type: 'grid',
      width: 600,
      height: 800,
      gridConfig: {
        rows: 10,
        columns: 3,
        cellWidth: 80,
        cellHeight: 50,
        gap: 5,
        offsetX: 20,
        offsetY: 20,
        allowedMarkTypes: ['number', 'checkbox'],
        multiMark: false,
      },
    },
    hotspots: new Map(),
    isActive: true,
  }],

  // Define dice pools (optional)
  dicePools: [{
    pool: {
      id: 'main-dice',
      name: 'Main Dice',
      dice: [
        { type: 'standard', dieType: 'd6', id: 'die-1' },
        { type: 'standard', dieType: 'd6', id: 'die-2' },
      ],
    },
    results: [],
    history: [],
  }],

  // Define card decks (optional)
  decks: [],

  // Configure tools
  tools: {
    currentTool: DEFAULT_TOOLS[0],
    availableTools: DEFAULT_TOOLS,
    markMode: 'pen',
  },
};
```

### 2. Use Your Game in App.tsx

```typescript
// src/App.tsx
import { GameProvider } from './context/GameContext';
import { Game } from './components/Game';
import { myGameConfig } from './games/mygame';

function App() {
  return (
    <GameProvider initialConfig={myGameConfig}>
      <Game />
    </GameProvider>
  );
}

export default App;
```

### 3. Run Your Game

```bash
npm run dev
```

That's it! You now have a working roll-and-write game.

## Sheet Types

### Grid Sheet

Perfect for structured layouts like Yahtzee or Qwixx:

```typescript
{
  type: 'grid',
  gridConfig: {
    rows: 6,
    columns: 2,
    cellWidth: 100,
    cellHeight: 50,
    gap: 5,
    offsetX: 10,
    offsetY: 10,
    allowedMarkTypes: ['number'],
    multiMark: false,
  }
}
```

### Image Overlay Sheet

For games with custom artwork:

```typescript
{
  type: 'image-overlay',
  imageConfig: {
    imageUrl: '/path/to/image.png',
    width: 800,
    height: 600,
    maintainAspectRatio: true,
  },
  hotspots: [
    {
      id: 'zone-1',
      shape: 'rectangle',
      bounds: { x: 100, y: 100, width: 80, height: 80 },
      allowedMarkTypes: ['color', 'symbol'],
      enabled: true,
      erasable: true,
      zIndex: 0,
    },
  ],
}
```

### Custom Sheet

Maximum flexibility with manual hotspot placement:

```typescript
{
  type: 'custom',
  hotspots: [
    // Define each hotspot individually
  ],
  regions: [
    // Optional groupings
  ],
  tracks: [
    // Optional resource tracks
  ],
}
```

## Mark Types

### Checkbox
```typescript
{
  type: 'checkbox',
  state: 'empty' | 'checked' | 'crossed',
}
```

### Number
```typescript
{
  type: 'number',
  value: 42,
}
```

### Color Fill
```typescript
{
  type: 'color',
  color: '#3B82F6',
  opacity: 0.5,
}
```

### Circle
```typescript
{
  type: 'circle',
  state: 'empty' | 'half' | 'full',
}
```

### Symbol
```typescript
{
  type: 'symbol',
  symbol: 'star' | 'diamond' | 'heart' | ...,
  color: '#FF0000',
}
```

### Text
```typescript
{
  type: 'text',
  text: 'Your text here',
}
```

## Dice Configuration

### Standard Dice
```typescript
{
  type: 'standard',
  dieType: 'd6', // d4, d6, d8, d10, d12, d20
  id: 'die-1',
  color: '#FFFFFF',
}
```

### Custom Dice
```typescript
{
  type: 'custom',
  id: 'action-die',
  faces: [
    { value: 'Move', color: '#3B82F6' },
    { value: 'Attack', color: '#EF4444' },
    { value: 'Defend', color: '#10B981' },
    // ... more faces
  ],
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `1-9` | Select tool 1-9 |
| `E` | Eraser tool |
| `P` | Toggle pencil/pen mode |
| `Alt + 1-9` | Switch to sheet 1-9 |

## API Reference

### Core Types

- **GameConfig**: Complete game configuration
- **Sheet**: Game board definition
- **Hotspot**: Interactive region on a sheet
- **Mark**: Player-placed indicator
- **Die**: Dice configuration
- **DicePool**: Collection of dice
- **Card**: Card definition
- **Deck**: Card deck configuration

### Hooks

#### useGameContext()
Access game state and dispatch actions.

```typescript
const { state, dispatch, canUndo, canRedo } = useGameContext();
```

#### useGameActions()
Convenient methods for common game actions.

```typescript
const {
  placeMark,
  removeMark,
  rollDicePool,
  undo,
  redo,
  reset,
} = useGameActions();
```

#### useKeyboardShortcuts()
Automatically sets up keyboard shortcuts.

```typescript
useKeyboardShortcuts(); // In your component
```

## Examples

The project includes a working Yahtzee example at `src/games/yahtzee.ts`.

## Development

### Project Structure

```
src/
├── components/       # React components
│   ├── dice/        # Dice components
│   ├── marks/       # Mark rendering components
│   ├── sheet/       # Sheet rendering components
│   └── ui/          # UI controls
├── context/         # React Context providers
├── games/           # Game configurations
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

### Tech Stack

- **React 18+**: UI framework
- **TypeScript**: Type safety (strict mode)
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

### Building for Production

```bash
npm run build
```

Outputs to `dist/` directory.

## Performance

- Mark placement: <16ms (60fps)
- Sheet switching: <100ms
- Handles 200+ hotspots smoothly
- No memory leaks in 2-hour sessions
- Auto-save debounced to 1 second

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## License

MIT License

---

**Built for board game enthusiasts**
