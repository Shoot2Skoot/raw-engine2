# Roll-and-Write Game Engine

A comprehensive web-based engine for creating interactive digital roll-and-write board games. Build games like Yahtzee, Welcome to the Moon, Twilight Inscription, and more with ease.

## Features

- **Flexible Sheet System**: Grid layouts, image overlays, freeform positioning
- **Multiple Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice Rolling**: Standard dice (d4-d20) and custom dice with symbols/colors
- **Card Management**: Deck creation, shuffling, drawing, and discard piles
- **Auto-save**: Never lose progress with automatic localStorage saving
- **Undo/Redo**: Full history tracking for all player actions
- **Multi-sheet Support**: Create complex games with multiple interconnected sheets
- **Mobile Friendly**: Touch-optimized interface for tablets and phones
- **Keyboard Shortcuts**: Power-user shortcuts for desktop play
- **TypeScript**: Fully typed for excellent developer experience

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Creating a Game

### Simple Example: Yahtzee

```typescript
import type { GameConfig } from './types';

export const yahtzeeConfig: GameConfig = {
  name: 'Yahtzee',
  description: 'Classic dice game',

  sheets: [
    {
      id: 'scoresheet',
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 13,
        columns: 1,
        cellWidth: 200,
        cellHeight: 50,
        gap: 2,
        allowedMarkTypes: ['number'],
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Yahtzee Dice',
      dice: createFiveDice(), // Helper function to create 5 d6
    },
  ],
};
```

### Key Concepts

#### Sheets

Sheets are the game boards where players mark their choices. Each sheet has a layout type:

- **Grid**: Uniform cells in rows and columns
- **Image Overlay**: Custom image with positioned hotspots
- **Freeform**: Manually positioned regions
- **Mixed**: Combination of layout types

#### Hotspots

Hotspots are interactive regions where marks can be placed. They can be:
- Rectangles
- Circles
- Polygons

#### Marks

Available mark types:
- **Checkbox**: Empty → Checked → Crossed
- **Number**: Enter specific values
- **Color**: Fill with colors from a palette
- **Circle**: Empty → Half → Full
- **Symbol**: Place icons/symbols
- **Text**: Freeform text entry
- **Line**: Connect points or draw routes

#### Dice

Create standard dice or custom dice with any faces:

```typescript
// Standard d6
{
  id: 'my-die',
  type: 'standard',
  sides: 6,
}

// Custom die with symbols
{
  id: 'action-die',
  type: 'custom',
  faces: [
    { value: 'move', symbol: '→' },
    { value: 'build', symbol: '🔨' },
    { value: 'trade', symbol: '💰' },
  ],
}
```

#### Cards

Create decks with multi-field cards:

```typescript
const card = {
  id: generateId(),
  fields: [
    { name: 'number', type: 'number', value: 7 },
    { name: 'action', type: 'symbol', value: 'astronaut' },
  ],
};
```

## Game Configuration API

### GameConfig

```typescript
interface GameConfig {
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  tools?: Tool[];
  colorPalette?: string[];
  symbolPalette?: Array<{ id: string; icon: string; label: string }>;
}
```

### Sheet Types

#### Grid Layout

```typescript
{
  type: 'grid',
  rows: number,
  columns: number,
  cellWidth?: number,
  cellHeight?: number,
  gap?: number,
  offsetX?: number,
  offsetY?: number,
  allowedMarkTypes: MarkType[],
  backgroundColor?: string,
}
```

## Keyboard Shortcuts

### Tools
- `c` - Checkbox tool
- `n` - Number tool
- `f` - Color fill tool
- `o` - Circle tool
- `t` - Text tool
- `e` - Erase tool
- `p` - Toggle pencil/pen style

### Actions
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `1-9` - Switch to sheet 1-9

## State Management

The engine automatically saves game state to localStorage after every action. You can also:

- **Manual Save**: Export game state as JSON file
- **Load**: Import previously saved game state
- **Reset**: Clear all marks and start fresh

## Architecture

```
src/
├── components/
│   ├── GameEngine.tsx      # Main game engine component
│   ├── Sheet/              # Sheet rendering components
│   ├── Marks/              # Mark type components
│   ├── Tools/              # Tool palette and inputs
│   ├── Dice/               # Dice UI components
│   └── Cards/              # Card and deck components
├── hooks/
│   └── useGameState.ts     # Core state management hook
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── helpers.ts          # Utility functions
└── games/
    ├── yahtzee.ts          # Yahtzee example
    └── welcome-to-the-moon.ts  # Welcome to the Moon example
```

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablets and phones)
- Android Chrome (tablets and phones)

## Example Games Included

### 1. Yahtzee (Simple)
- Single sheet with 13 scoring rows
- 5 standard d6 dice with locking
- Number entry marks

### 2. Welcome to the Moon (Medium)
- 3 interconnected sheets
- Card deck with numbers and symbols
- Multiple mark types (checkboxes, numbers, circles)

## Advanced Features

### Custom Mark Validation

You can add custom logic to validate marks:

```typescript
// In your game component
const handleHotspotClick = (hotspotId: string) => {
  // Your custom validation logic
  if (isValidMove(hotspotId)) {
    addMark(sheetId, mark);
  }
};
```

### Dynamic Hotspot States

Enable/disable hotspots based on game state:

```typescript
const hotspot = {
  id: 'special-cell',
  // ...other properties
  disabled: !prerequisiteMet,
};
```

### Scoring

Implement custom scoring by reading marks:

```typescript
const calculateScore = () => {
  const marks = gameState.marks[sheetId];
  // Your scoring logic
  return totalScore;
};
```

## Development Tips

### Hot Module Replacement

Vite provides instant HMR - edit your game config and see changes immediately.

### TypeScript

The engine is fully typed. Your IDE will provide autocomplete and type checking:

```typescript
const config: GameConfig = {
  // TypeScript will guide you
};
```

### Debugging

Use browser DevTools to inspect:
- `localStorage` for saved game states
- React DevTools for component hierarchy

## License

MIT License - feel free to use this for your own roll-and-write games!

## Credits

Built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
