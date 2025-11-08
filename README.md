# Roll-and-Write Game Engine

A comprehensive, developer-friendly web-based engine for creating interactive digital versions of roll-and-write board games (Yahtzee, Welcome to the Moon, Twilight Inscription, etc.).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the Yahtzee example game.

## Features

### Core Functionality

- **Flexible Sheet System**: Grid-based, image-based, and freeform layouts
- **Multiple Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice Mechanics**: Standard (d4-d20) and custom dice with lock/unlock functionality
- **Card/Deck Management**: Draw, shuffle, discard, and split decks
- **State Management**: Full undo/redo support with action history
- **Auto-Save**: Automatic saving to browser localStorage
- **Keyboard Shortcuts**: Ctrl+Z (undo), Ctrl+Shift+Z (redo), 1-9 (sheet switching)
- **Multi-Sheet Support**: Create games with multiple interconnected sheets
- **Mobile Friendly**: Responsive design with touch support

### Developer Experience

- **TypeScript**: Fully typed with strict mode enabled
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server
- **Simple Configuration**: Create games with minimal code

## Project Structure

```
src/
├── components/          # React components
│   ├── dice/           # Dice rolling UI
│   ├── marks/          # Mark rendering components
│   ├── sheets/         # Sheet rendering engine
│   ├── tools/          # Tool palette
│   └── Game.tsx        # Main game component
├── context/            # React Context for state management
│   └── GameContext.tsx # Central game state
├── games/              # Game configurations
│   └── yahtzee.ts      # Yahtzee example
├── hooks/              # Custom React hooks
│   ├── useAutoSave.ts
│   └── useKeyboardShortcuts.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── gameState.ts
└── App.tsx             # Application entry point
```

## Creating Your First Game

Here's a minimal example - a simple score tracking sheet:

```typescript
import type { GameConfig } from '../types';

export const myGameConfig: GameConfig = {
  name: 'My Game',
  description: 'A simple roll-and-write game',

  // Define sheets
  sheets: [
    {
      id: 'main-sheet',
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 10,
        columns: 1,
        cellWidth: 150,
        cellHeight: 50,
        gap: 4,
        offsetX: 50,
        offsetY: 50,
        generateHotspots: true,
        defaultConstraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          numberRange: { min: 0, max: 50 },
        },
      },
    },
  ],

  // Define tools
  tools: [
    {
      type: 'number',
      label: 'Enter Score',
      icon: 'hash',
      defaultPermanence: 'pen',
    },
  ],

  // Define dice pools
  dicePools: [
    {
      id: 'main-dice',
      label: 'Game Dice',
      dice: [
        { type: 'standard', dieType: 'd6' },
        { type: 'standard', dieType: 'd6' },
      ],
    },
  ],
};
```

Then use it in your App:

```typescript
import { GameProvider } from './context/GameContext';
import { Game } from './components/Game';
import { myGameConfig } from './games/myGame';

function App() {
  return (
    <GameProvider config={myGameConfig}>
      <Game />
    </GameProvider>
  );
}
```

## Configuration Guide

### Sheet Layouts

#### Grid Layout

Best for structured games like Yahtzee:

```typescript
{
  type: 'grid',
  rows: 13,
  columns: 2,
  cellWidth: 150,
  cellHeight: 50,
  gap: 4,
  offsetX: 50,
  offsetY: 50,
  backgroundColor: '#f9fafb',
  generateHotspots: true, // Auto-create hotspots for each cell
  defaultConstraints: {
    allowedMarkTypes: ['number'],
    maxMarks: 1,
  },
}
```

#### Image-Based Layout

For games with custom artwork:

```typescript
{
  type: 'image',
  imageUrl: '/path/to/sheet.png',
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  hotspots: [
    // Manually define hotspots
    {
      id: 'hotspot-1',
      sheetId: 'sheet-1',
      shape: {
        type: 'rect',
        x: 100,
        y: 100,
        width: 50,
        height: 50,
      },
      constraints: {
        allowedMarkTypes: ['checkbox'],
        maxMarks: 1,
      },
    },
  ],
}
```

#### Freeform Layout

For custom positioning:

```typescript
{
  type: 'freeform',
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  regions: [
    {
      id: 'region-1',
      label: 'Score Area',
      hotspots: [/* ... */],
    },
  ],
}
```

### Mark Types

#### Number Marks

```typescript
{
  type: 'number',
  label: 'Enter Score',
  icon: 'hash',
  defaultPermanence: 'pen',
  numberRange: { min: 0, max: 50 },
}
```

#### Checkbox Marks

States: empty → checked → crossed → empty

```typescript
{
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'checkbox',
  defaultPermanence: 'pen',
}
```

#### Color Fill Marks

```typescript
{
  type: 'color',
  label: 'Color Fill',
  icon: 'palette',
  defaultPermanence: 'pen',
  colorPalette: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'],
}
```

### Dice Configuration

#### Standard Dice

```typescript
{
  type: 'standard',
  dieType: 'd6', // d4, d6, d8, d10, d12, d20
}
```

#### Custom Dice

```typescript
{
  type: 'custom',
  customDie: {
    id: 'custom-die-1',
    name: 'Action Die',
    faces: [
      { display: '⚔️', weight: 2 },
      { display: '🛡️', weight: 2 },
      { display: '💎', weight: 1 },
      { display: '⭐', weight: 1 },
    ],
  },
}
```

### Hotspot Constraints

Control what players can do in each hotspot:

```typescript
constraints: {
  allowedMarkTypes: ['number', 'checkbox'],
  maxMarks: 1, // undefined = unlimited
  numberRange: { min: 1, max: 10 },
  allowedColors: ['#ef4444', '#3b82f6'],
  allowedSymbols: ['star', 'heart', 'diamond'],
  canErase: true,
  requiresSequence: false,
}
```

## Keyboard Shortcuts

- **Ctrl+Z** - Undo last action
- **Ctrl+Shift+Z** or **Ctrl+Y** - Redo action
- **1-9** - Switch to sheet 1-9
- **Alt+1-9** - Switch to tool 1-9

## State Management

The engine uses React Context for centralized state management with full undo/redo support:

```typescript
const {
  state,          // Current game state
  addMark,        // Add a mark to the sheet
  removeMark,     // Remove a mark
  rollDicePool,   // Roll dice
  lockDie,        // Lock a die
  undo,           // Undo last action
  redo,           // Redo action
  reset,          // Reset game
} = useGame();
```

## Auto-Save

Games automatically save to browser localStorage every 500ms after changes. On page reload, the latest state is restored automatically.

## Examples

### Yahtzee (Simple)

See `src/games/yahtzee.ts` for a complete example of:
- Grid-based layout
- Number entry
- Standard dice (5d6)
- Dice locking mechanics

Run `npm run dev` to play the working Yahtzee example.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## Development

```bash
# Start dev server
npm run dev

# Type checking
tsc -b

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Decisions

### Type System

Comprehensive TypeScript types ensure type safety across:
- Game configuration
- State management
- Mark types
- Component props

### State Management

Uses React Context + useReducer for:
- Centralized state
- Predictable updates
- Easy debugging
- Undo/redo support

### Component Structure

- **Presentational components**: `MarkRenderer`, `Sheet`, `DicePool`
- **Container component**: `Game`
- **Context provider**: `GameProvider`

### Performance

- Debounced auto-save (500ms)
- Efficient re-renders with React memo (where needed)
- Minimal state updates

## Future Enhancements

The following features are planned but not yet implemented:

- [ ] Card/deck management UI
- [ ] Welcome to the Moon example (medium complexity)
- [ ] Twilight Inscription example (complex)
- [ ] Manual save/load (JSON export/import)
- [ ] Mobile optimizations
- [ ] Line/connection drawing marks
- [ ] Multi-player synchronization
- [ ] Rules enforcement framework
- [ ] Scoring calculation helpers

## Contributing

This is a complete engine foundation. To extend it:

1. Add new mark types in `src/components/marks/`
2. Create game configurations in `src/games/`
3. Extend types in `src/types/index.ts`
4. Add utility functions in `src/utils/`

## License

MIT License - See LICENSE file for details

## Credits

Built with modern web technologies and designed for game developers who want to quickly prototype and build roll-and-write games.
