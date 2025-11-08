# Roll-and-Write Game Engine

A comprehensive web-based engine for creating interactive digital versions of roll-and-write board games. Build games like Yahtzee, Welcome to the Moon, Twilight Inscription, and more with minimal configuration.

## Features

- 🎲 **Flexible Dice System** - Standard dice (d4, d6, d8, d10, d12, d20) and custom dice with symbols, colors, and text
- 🎴 **Card Management** - Complete deck system with shuffle, draw, discard, and reshuffle
- 📝 **Multiple Mark Types** - Checkbox, number, color fill, circle, symbol, text, and line marks
- 📐 **Versatile Layouts** - Grid-based, image-overlay, and mixed layout systems
- ↩️ **Undo/Redo** - Full history tracking with unlimited undo/redo
- 💾 **Auto-Save** - Automatic localStorage backup every second
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with keyboard navigation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Developer-Friendly** - TypeScript with comprehensive type definitions

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Shoot2Skoot/raw-engine2.git
cd raw-engine2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Creating Your First Game

Create a simple dice game in under 20 lines:

```typescript
import type { GameConfig } from './types';

export const myGame: GameConfig = {
  id: 'my-game',
  name: 'My First Game',
  description: 'A simple roll-and-write game',

  sheets: [{
    id: 'scorecard',
    name: 'Scorecard',
    dimensions: { width: 400, height: 600 },
    layout: {
      type: 'grid',
      grid: {
        rows: 10,
        columns: 1,
        cellSize: 50,
        gap: 4,
        startPosition: { x: 50, y: 50 },
        constraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          canUnmark: true,
          readonly: false,
        },
      },
    },
  }],

  standardDice: [{ type: 'd6', count: 5 }],

  toolPalette: {
    availableTools: ['number'],
    numberRange: { min: 0, max: 999 },
  },
};
```

Then use it in your app:

```typescript
import { GameContainer } from './components/GameContainer';
import { myGame } from './games/my-game';

function App() {
  return <GameContainer config={myGame} />;
}
```

## Documentation

### Sheet Layouts

#### Grid Layout

Perfect for structured games like Yahtzee or Qwixx:

```typescript
layout: {
  type: 'grid',
  grid: {
    rows: 6,
    columns: 11,
    cellSize: 40,
    gap: 2,
    startPosition: { x: 20, y: 20 },
    constraints: {
      allowedMarkTypes: ['checkbox', 'number'],
      maxMarks: 1,
      canUnmark: true,
      readonly: false,
    },
  },
}
```

#### Image Layout

For games with custom artwork like Welcome to the Moon:

```typescript
layout: {
  type: 'image',
  background: {
    src: '/path/to/image.png',
    aspectRatio: 1.5,
    fitMode: 'contain',
  },
  regions: [
    {
      id: 'region-1',
      name: 'Resource Track',
      hotspots: [
        {
          id: 'spot-1',
          shape: 'circle',
          position: { x: 100, y: 100 },
          radius: 20,
          constraints: {
            allowedMarkTypes: ['checkbox'],
            maxMarks: 1,
            canUnmark: false,
            readonly: false,
          },
        },
      ],
      backgroundColor: 'transparent',
      zIndex: 1,
    },
  ],
}
```

#### Mixed Layout

Combine grids and freeform regions:

```typescript
layout: {
  type: 'mixed',
  background: {
    src: '/background.png',
    aspectRatio: 1.4,
    fitMode: 'cover',
  },
  grids: [
    {
      id: 'main-grid',
      rows: 5,
      columns: 5,
      cellSize: 40,
      gap: 2,
      startPosition: { x: 50, y: 50 },
      constraints: {
        allowedMarkTypes: ['color', 'symbol'],
        maxMarks: 2,
        canUnmark: true,
        readonly: false,
      },
    },
  ],
  regions: [
    // Custom regions overlaid on background
  ],
}
```

### Mark Types

#### Checkbox

Three-state checkbox (empty → checked → crossed):

```typescript
constraints: {
  allowedMarkTypes: ['checkbox'],
  maxMarks: 1,
}
```

#### Number

Numeric values with optional range constraints:

```typescript
constraints: {
  allowedMarkTypes: ['number'],
  maxMarks: 1,
  numberRange: { min: 1, max: 6 },
}
```

#### Color

Fill cells with colors from a palette:

```typescript
toolPalette: {
  availableTools: ['color'],
  colorPalette: [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
  ],
}
```

#### Circle

Three-state circle (empty → half → full):

```typescript
constraints: {
  allowedMarkTypes: ['circle'],
  maxMarks: 1,
}
```

#### Symbol

Icons and symbols:

```typescript
toolPalette: {
  availableTools: ['symbol'],
  symbolPalette: ['star', 'circle', 'check'],
}
```

#### Text

Freeform text entry:

```typescript
constraints: {
  allowedMarkTypes: ['text'],
  maxMarks: 1,
}
```

### Dice System

#### Standard Dice

```typescript
standardDice: [
  { type: 'd6', count: 5 },  // 5 six-sided dice
  { type: 'd8', count: 2 },  // 2 eight-sided dice
  { type: 'd20', count: 1 }, // 1 twenty-sided die
]
```

#### Custom Dice

Define dice with custom faces:

```typescript
diceDefinitions: [
  {
    id: 'action-die',
    name: 'Action Die',
    faces: [
      { content: { type: 'symbol', symbol: '⚔️' } },
      { content: { type: 'symbol', symbol: '🛡️' } },
      { content: { type: 'symbol', symbol: '💎' } },
      { content: { type: 'text', text: 'WILD' } },
      { content: { type: 'number', value: 2 } },
      { content: { type: 'number', value: 3 } },
    ],
  },
]
```

#### Combined Content

Multiple elements on one face:

```typescript
faces: [
  {
    content: {
      type: 'combined',
      items: [
        { type: 'number', value: 5 },
        { type: 'symbol', symbol: '⚔️', color: '#ef4444' },
      ],
    },
  },
]
```

### Card System

#### Simple Deck

```typescript
deckDefinitions: [
  {
    id: 'number-deck',
    name: 'Number Cards',
    cards: [
      {
        id: 'card-1',
        fields: [
          { name: 'value', type: 'number', value: 1 },
        ],
      },
      // ... more cards
    ],
  },
]
```

#### Multi-Field Cards

Cards can have multiple fields:

```typescript
cards: [
  {
    id: 'card-1',
    fields: [
      { name: 'number', type: 'number', value: 7 },
      { name: 'action', type: 'symbol', value: '🚀' },
      { name: 'color', type: 'color', value: '#3b82f6' },
      { name: 'description', type: 'text', value: 'Launch' },
    ],
  },
]
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + S` | Save game |
| `1-9` | Select tool |
| `Esc` | Deselect tool |

### API Reference

#### useGameEngine Hook

The main hook for game state management:

```typescript
const engine = useGameEngine(config);

// State
engine.gameState          // Current game state
engine.currentSheet       // Active sheet
engine.canUndo           // Can undo?
engine.canRedo           // Can redo?

// Mark operations
engine.placeMark(sheetId, mark)
engine.removeMark(sheetId, markId)
engine.getMarksForHotspot(sheetId, hotspotId)

// Dice operations
engine.rollDicePool(poolId, diceIds?)
engine.lockDie(poolId, dieId, locked)
engine.modifyDie(poolId, dieId, newFace)

// Card operations
engine.shuffleDeck(deckId)
engine.drawCard(deckId)
engine.discardCurrentCard(deckId)

// History
engine.undo()
engine.redo()

// Navigation
engine.setCurrentSheet(sheetId)
engine.setSelectedTool(tool)

// Save/Load
engine.saveGame(filename?)
engine.resetGame()
engine.resetSheet(sheetId)
```

## Example Games

### Yahtzee (Simple)

See `src/games/yahtzee.ts` for a complete simple example.

Features demonstrated:
- Grid layout
- Number marks
- Standard dice (5d6)
- Dice locking

### Welcome to the Moon (Medium - Coming Soon)

Features:
- Image-based layout
- Multi-field cards
- Multiple sheets
- Symbol marks

### Twilight Inscription (Complex - Coming Soon)

Features:
- Mixed layouts
- All mark types
- Custom dice
- Tech trees
- Territory maps

## Architecture

```
src/
├── components/
│   ├── GameContainer.tsx       # Main game wrapper
│   ├── sheet/
│   │   ├── Sheet.tsx          # Sheet renderer
│   │   └── Hotspot.tsx        # Interactive regions
│   ├── marks/
│   │   └── MarkRenderer.tsx   # Mark visualization
│   ├── dice/
│   │   └── DicePool.tsx       # Dice management
│   └── ui/
│       └── ToolPalette.tsx    # Tool selection
├── hooks/
│   └── useGameEngine.ts       # Core game state hook
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   └── helpers.ts            # Utility functions
└── games/
    └── yahtzee.ts            # Example games
```

## Development

### Adding a New Mark Type

1. Add type to `src/types/index.ts`
2. Create renderer in `src/components/marks/MarkRenderer.tsx`
3. Add interaction in `src/components/sheet/Hotspot.tsx`
4. Update tool palette in `src/components/ui/ToolPalette.tsx`

### Adding a New Game

1. Create config file in `src/games/`
2. Define sheets, dice, and cards
3. Configure tool palette
4. Import and use in `App.tsx`

### Testing

```bash
npm run build    # Check for TypeScript errors
npm run dev      # Test in browser
```

## Performance

- Mark placement: <16ms (60fps)
- Sheet switching: <100ms
- Handles 200+ hotspots smoothly
- Auto-save doesn't impact performance
- Optimized for 2-hour sessions

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **SVG** - Scalable marks

## Contributing

Contributions are welcome! Please ensure:

1. TypeScript strict mode compliance
2. All existing tests pass
3. New features include examples
4. Code follows project style

## License

MIT License - See LICENSE file for details

## Roadmap

- [ ] Additional example games (Welcome to the Moon, Twilight Inscription)
- [ ] Card visualization components
- [ ] Mobile touch optimization
- [ ] Print-friendly sheets
- [ ] Campaign/scenario support
- [ ] Multiplayer pass-and-play
- [ ] Custom themes
- [ ] Accessibility improvements

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

Built with inspiration from amazing roll-and-write games:
- Yahtzee
- Welcome to the Moon
- Twilight Inscription
- Cartographers
- Railroad Ink
- Fleet: The Dice Game
- Ganz Schön Clever
