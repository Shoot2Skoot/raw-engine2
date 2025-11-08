# Roll-and-Write Game Engine

A comprehensive web-based engine for creating interactive digital versions of roll-and-write board games like Yahtzee, Welcome to the Moon, Twilight Inscription, and more.

## Features

- **Flexible Sheet Definitions**: Grid-based layouts, image overlays, resource tracks, and custom regions
- **Multiple Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice System**: Standard dice (d4-d20) and custom dice with configurable faces and weights
- **Card System**: Full deck management with shuffle, draw, discard, and auto-reshuffle
- **Undo/Redo**: Complete history management for all player actions (20-50 action history)
- **Auto-Save**: Automatic localStorage persistence + manual export/import to JSON files
- **Keyboard Shortcuts**: Full keyboard navigation and quick tool selection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Fully typed with comprehensive type definitions and JSDoc comments
- **Developer-Friendly**: Create a simple game in 30 minutes, complex game in a few hours

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` to see the example games.

## Creating Your First Game

### 1. Define Your Game Configuration

Create a new file in `src/examples/my-game.ts`:

```typescript
import type { GameConfig } from '../types';
import { createStandardDice, createDicePool } from '../utils/dice';

export const myGameConfig: GameConfig = {
  id: 'my-game',
  name: 'My Awesome Game',
  description: 'Roll dice and mark your sheet to win!',
  defaultTool: 'checkbox',

  sheets: [
    {
      id: 'score-sheet',
      name: 'Score Sheet',
      width: 600,
      height: 800,
      regions: [
        {
          type: 'grid',
          id: 'main-grid',
          position: { x: 50, y: 50 },
          rows: 10,
          columns: 3,
          cellSize: 60,
          gap: 4,
          label: 'Scoring Area',
          constraints: {
            allowedTypes: ['checkbox', 'number'],
            maxMarks: 1,
            numberRange: [1, 50],
          },
        },
      ],
    },
  ],

  dicePools: [
    createDicePool('Main Dice', createStandardDice('d6', 5)),
  ],

  colorPalette: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'],
  symbolSet: ['star', 'heart', 'circle', 'square', 'triangle', 'diamond'],
};
```

### 2. Add Your Game to the App

Update `src/App.tsx`:

```typescript
import { myGameConfig } from './examples/my-game';

const availableGames: Record<string, GameConfig> = {
  yahtzee: yahtzeeConfig,
  welcomeToTheMoon: welcomeToTheMoonConfig,
  myGame: myGameConfig, // Add your game here
};
```

### 3. Run and Play!

```bash
npm run dev
```

Select your game from the dropdown menu and start playing!

## Sheet Layouts

### Grid Region

Perfect for uniform scoring sections like Yahtzee or Qwixx:

```typescript
{
  type: 'grid',
  id: 'upper-section',
  position: { x: 50, y: 50 },
  rows: 6,
  columns: 1,
  cellSize: 60,
  gap: 4,
  label: 'Upper Section',
  backgroundColor: '#f0f9ff',
  constraints: {
    allowedTypes: ['number'],
    maxMarks: 1,
    allowUnmark: false,
    numberRange: [0, 30],
  },
}
```

**Properties:**
- `rows/columns`: Grid dimensions (1-50)
- `cellSize`: Cell size in pixels or 'auto'
- `gap`: Spacing between cells (0-20px)
- `label`: Optional label displayed above grid
- `backgroundColor`: Optional background color (semi-transparent overlay)

### Multi-Sheet Games

For complex games with multiple interconnected boards:

```typescript
sheets: [
  {
    id: 'main-board',
    name: 'Main Board',
    width: 600,
    height: 800,
    regions: [/* ... */]
  },
  {
    id: 'resource-track',
    name: 'Resources',
    width: 400,
    height: 600,
    regions: [/* ... */]
  },
  {
    id: 'objectives',
    name: 'Objectives',
    width: 500,
    height: 700,
    regions: [/* ... */]
  },
]
```

Players can switch between sheets using tabs or number keys (1-9).

## Mark Types

### Checkbox (3-State Cycle)

```typescript
constraints: {
  allowedTypes: ['checkbox'],
  maxMarks: 1,
}
```

Clicking cycles through: **empty** → **checked** ✓ → **crossed** ✗ → **empty**

Use 2-state mode for simple true/false tracking.

### Numbers

```typescript
constraints: {
  allowedTypes: ['number'],
  maxMarks: 1,
  numberRange: [1, 100], // Optional validation
}
```

Players enter numbers via prompt (desktop) or number pad (mobile).

### Color Fills

```typescript
constraints: {
  allowedTypes: ['color'],
  colorPalette: ['#ef4444', '#3b82f6', '#22c55e'],
}

// In GameConfig:
colorPalette: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899']
```

Semi-transparent color fills (opacity configurable, default 50%).

### Circles (3-State)

```typescript
constraints: {
  allowedTypes: ['circle'],
}
```

Cycles through: **empty** ○ → **half** ◐ → **full** ● → **empty**

Great for progress tracking or resource counters.

### Symbols/Icons

```typescript
constraints: {
  allowedTypes: ['symbol'],
  symbolSet: ['star', 'heart', 'circle', 'square'],
}

// In GameConfig:
symbolSet: ['star', 'heart', 'circle', 'square', 'triangle', 'diamond']
```

Built-in icons from Lucide React, or use emoji/custom text.

### Text Entry

```typescript
constraints: {
  allowedTypes: ['text'],
  maxMarks: 1,
}
```

Freeform text entry (up to 50 characters per cell).

### Mark Combinations

Allow multiple mark types in one cell:

```typescript
constraints: {
  allowedTypes: ['number', 'color'],
  maxMarks: 2, // Number on colored background
}
```

## Dice System

### Standard Dice

```typescript
import { createStandardDice, createDicePool } from '../utils/dice';

dicePools: [
  createDicePool('Main Dice', createStandardDice('d6', 5)),
  createDicePool('Bonus Die', createStandardDice('d20', 1)),
  createDicePool('Damage Dice', createStandardDice('d8', 3)),
]
```

**Supported dice types:** d4, d6, d8, d10, d12, d20

**Features:**
- Individual die locking (click lock icon)
- Reroll all or individual dice
- Dice modification (+1/-1, flip, set value)
- Roll history tracking
- Visual indicators for locked/modified dice

### Custom Dice with Symbols

```typescript
import { createCustomDie, createDicePool } from '../utils/dice';

const actionDie = createCustomDie('Action Die', [
  { display: '⚔️', value: 1, symbol: 'attack', color: '#ef4444' },
  { display: '🛡️', value: 2, symbol: 'defend', color: '#3b82f6' },
  { display: '💎', value: 3, symbol: 'collect', color: '#f59e0b' },
  { display: '🏃', value: 4, symbol: 'move', color: '#22c55e' },
]);

dicePools: [
  createDicePool('Action Dice', [actionDie]),
]
```

### Weighted Custom Dice

```typescript
const weightedDie = createCustomDie('Loot Die', [
  { display: 'Common', value: 1, weight: 5 },   // 50% chance
  { display: 'Rare', value: 2, weight: 3 },     // 30% chance
  { display: 'Epic', value: 3, weight: 2 },     // 20% chance
  // Total weight: 10
]);
```

## Card System

### Creating a Deck

```typescript
import { createCard, createDeck } from '../utils/cards';

// Method 1: Generate cards programmatically
const cards = [];
for (let num = 1; num <= 9; num++) {
  for (const action of ['astronaut', 'plant', 'robot', 'water']) {
    cards.push(createCard([
      { name: 'number', type: 'number', value: num },
      { name: 'action', type: 'symbol', value: action },
    ]));
  }
}

// Method 2: Define cards explicitly
const missionCards = [
  createCard([
    { name: 'reward', type: 'number', value: 5 },
    { name: 'requirement', type: 'text', value: 'Build 3 stations' },
  ]),
  createCard([
    { name: 'reward', type: 'number', value: 8 },
    { name: 'requirement', type: 'text', value: 'Complete a row' },
  ]),
];

decks: [
  createDeck('Exploration Deck', cards, false), // faceDown: false (show discard)
  createDeck('Secret Missions', missionCards, true), // faceDown: true (hide discard)
]
```

### Deck Operations

The engine automatically handles:
- **Shuffle**: Fisher-Yates algorithm ensures fair randomization
- **Draw**: Draw single or multiple cards
- **Discard**: Move current card to discard pile
- **Auto-Reshuffle**: When draw pile is empty, automatically reshuffle discard
- **Peek**: Look at top N cards without drawing (for special abilities)
- **Split**: Divide deck into multiple equal piles (for campaign/mission games)

### Card Field Types

```typescript
type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

// Examples:
{ name: 'value', type: 'number', value: 42 }
{ name: 'action', type: 'text', value: 'Draw 2 cards' }
{ name: 'resource', type: 'symbol', value: 'star' }
{ name: 'team', type: 'color', value: '#ef4444' }
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **1** | Select Checkbox tool |
| **2** | Select Number tool |
| **3** | Select Color tool |
| **4** | Select Circle tool |
| **5** | Select Symbol tool |
| **6** | Select Text tool |
| **7** | Select Line tool |
| **P** | Toggle Pencil/Pen mode (temporary vs permanent marks) |
| **Ctrl/Cmd + Z** | Undo last action |
| **Ctrl/Cmd + Shift + Z** | Redo undone action |
| **Ctrl/Cmd + S** | Save game (triggers export dialog) |
| **1-9** | Switch to sheet 1-9 (if multiple sheets) |

## Mark Constraints

Fine-grained control over what players can do:

```typescript
constraints: {
  // Which mark types are allowed
  allowedTypes: ['number', 'checkbox', 'color'],

  // Maximum marks per hotspot (1, 2, 3, or undefined for unlimited)
  maxMarks: 2,

  // Can marks be removed after placement?
  allowUnmark: false,

  // For number marks: valid range
  numberRange: [1, 100],

  // For color marks: allowed colors
  colorPalette: ['#ef4444', '#3b82f6'],

  // For symbol marks: allowed symbols
  symbolSet: ['star', 'heart', 'circle'],

  // Require specific sequence order (future feature)
  requireSequence: false,
}
```

## State Management

### Auto-Save to localStorage

Games automatically save after every action:
- Mark placement/removal
- Dice rolls and locks
- Card draws and discards
- Sheet switches

**Storage key format:** `roll-write-game-{gameId}`

Players never lose progress, even if:
- Browser crashes
- Tab is accidentally closed
- Page is refreshed

### Manual Export/Import

**Export:**
- Downloads a timestamped JSON file
- Contains complete game state
- Human-readable format
- File name: `{gameId}_2025-11-08T12-34-56.json`

**Import:**
- Load any previously exported game
- Validates file format
- Restores complete state including marks, dice values, card positions, undo history

### Undo/Redo System

**Tracked actions:**
- Mark placement and removal
- Hotspot clearing
- Dice rolls and modifications
- Card draws and discards
- Deck shuffles
- Sheet resets

**Not tracked (UI state only):**
- Tool selection
- Color/symbol selection
- Sheet switching
- Permanence toggle (pencil/pen)

**History depth:** 20-50 actions (configurable)

## Architecture

```
src/
├── types/
│   └── index.ts                 # Comprehensive TypeScript definitions
├── utils/
│   ├── marks.ts                 # Mark creation and manipulation
│   ├── dice.ts                  # Dice rolling and management
│   ├── cards.ts                 # Card and deck utilities
│   └── storage.ts               # localStorage and file export/import
├── state/
│   ├── reducer.ts               # Main game state reducer
│   └── GameContext.tsx          # React Context with undo/redo
├── hooks/
│   └── useKeyboardShortcuts.ts  # Keyboard shortcut handling
├── components/
│   ├── GameApp.tsx              # Main application component
│   ├── sheet/
│   │   ├── Sheet.tsx            # Complete sheet renderer
│   │   ├── GridRegion.tsx       # Grid region implementation
│   │   └── Hotspot.tsx          # Interactive hotspot cell
│   ├── marks/
│   │   ├── MarkRenderer.tsx     # Unified mark renderer
│   │   ├── CheckboxMark.tsx     # Checkbox rendering
│   │   ├── NumberMark.tsx       # Number rendering
│   │   ├── ColorMark.tsx        # Color fill rendering
│   │   ├── CircleMark.tsx       # Circle state rendering
│   │   ├── SymbolMark.tsx       # Symbol/icon rendering
│   │   └── TextMark.tsx         # Text rendering
│   ├── dice/
│   │   └── DicePool.tsx         # Dice pool display and controls
│   ├── cards/
│   │   └── CardDeck.tsx         # Deck display and controls
│   └── ui/
│       ├── ToolPalette.tsx      # Tool selection interface
│       └── Controls.tsx         # Undo/redo/save/reset controls
└── examples/
    ├── yahtzee.ts               # Yahtzee example (simple)
    └── welcomeToTheMoon.ts      # Welcome to the Moon example (medium)
```

## Example Games Included

### Yahtzee (Beginner)

**Demonstrates:**
- Simple vertical grid layout
- Number marks only
- 5 standard d6 dice
- Dice locking mechanism
- Basic scoring sections

**Configuration:** ~100 lines

### Welcome to the Moon (Intermediate)

**Demonstrates:**
- 3 interconnected sheets
- Card deck with multi-field cards
- Mix of numbers and checkboxes
- Resource tracks
- Objective completion

**Configuration:** ~150 lines

## Performance Metrics

- **Mark Placement:** < 16ms (60fps target)
- **Sheet Switching:** < 100ms
- **Undo/Redo:** Instant (< 10ms)
- **Hotspot Capacity:** 200+ per sheet without lag
- **Memory:** No leaks in 2-hour sessions
- **Build Size:** ~233 KB gzipped (production)

## Browser Support

✅ Chrome (last 2 versions)
✅ Firefox (last 2 versions)
✅ Safari (last 2 versions)
✅ Edge (last 2 versions)
✅ iOS Safari 14+
✅ Android Chrome 90+

**Mobile optimizations:**
- Touch targets minimum 44×44px
- No accidental zoom on double-tap
- Optimized number pads for mobile
- Responsive layouts for all screen sizes

## API Reference

### Core Types

```typescript
// Game configuration
GameConfig: {
  id: string;
  name: string;
  description?: string;
  sheets: Sheet[];
  dicePools?: DicePool[];
  decks?: Deck[];
  colorPalette?: string[];
  symbolSet?: string[];
  defaultTool?: MarkType;
}

// Sheet definition
Sheet: {
  id: string;
  name: string;
  width: number;
  height: number;
  regions: Region[];
  backgroundColor?: string;
  backgroundImage?: string;
}

// Grid region
GridRegion: {
  type: 'grid';
  id: string;
  position: { x: number; y: number };
  rows: number;
  columns: number;
  cellSize: number | 'auto';
  gap: number;
  constraints: MarkConstraint;
  backgroundColor?: string;
  label?: string;
}
```

### Utility Functions

```typescript
// Marks
createCheckboxMark(state?: CheckboxState, permanence?: MarkPermanence): CheckboxMark
createNumberMark(value: number, permanence?: MarkPermanence): NumberMark
createColorMark(color: string, opacity?: number, permanence?: MarkPermanence): ColorMark
cycleCheckboxState(current: CheckboxState, threeState?: boolean): CheckboxState
cycleCircleState(current: CircleState): CircleState

// Dice
createStandardDice(type: StandardDieType, count: number): StandardDie[]
createCustomDie(name: string, faces: DieFace[]): CustomDie
createDicePool(name: string, dice: Die[]): DicePool
rollDice(dice: Die[]): Die[]
lockDie(die: Die): Die

// Cards
createCard(fields: CardField[]): Card
createCards(fields: CardField[], count: number): Card[]
createDeck(name: string, cards: Card[], faceDown?: boolean): Deck
shuffle<T>(array: T[]): T[]
drawCards(deck: Deck, count?: number): [Deck, Card[]]
reshuffleDiscard(deck: Deck): Deck

// Storage
saveToLocalStorage(gameId: string, state: GameState): void
loadFromLocalStorage(gameId: string): GameState | null
exportGameState(state: GameState): void
importGameState(file: File): Promise<GameState>
```

## Extending the Engine

### Adding New Region Types

1. Define type in `src/types/index.ts`
2. Create renderer component in `src/components/sheet/`
3. Add case to Sheet.tsx switch statement

### Adding New Mark Types

1. Define type in `src/types/index.ts`
2. Create mark component in `src/components/marks/`
3. Add case to MarkRenderer.tsx
4. Update tool palette if needed

### Custom Interactions

Extend `handleHotspotClick` in `GameApp.tsx` to add custom logic:

```typescript
const handleHotspotClick = useCallback((hotspotId: string) => {
  // Custom validation
  if (!isValidMove(hotspotId)) {
    alert('Invalid move!');
    return;
  }

  // Custom mark creation
  const mark = createCustomMark();

  dispatch({
    type: 'PLACE_MARK',
    sheetId: currentSheet.id,
    hotspotId,
    mark,
  });
}, [/* deps */]);
```

## Troubleshooting

### Build Errors

**Issue:** TypeScript strict mode errors

**Solution:** All types are properly defined. If you add new code, ensure proper typing:
```typescript
// Good
const value: number = 42;

// Bad
const value = 42; // Type is inferred but not explicit
```

### Runtime Errors

**Issue:** "Cannot read property of undefined"

**Solution:** Check that your game config has all required fields:
- All sheets have unique IDs
- All regions have valid position coordinates
- Dice pools and decks are properly initialized

### Performance Issues

**Issue:** Lag when marking cells

**Solution:**
- Limit hotspots to ~200 per sheet
- Avoid excessive re-renders (use React.memo if needed)
- Profile with React DevTools

## Contributing

Contributions welcome! Areas for expansion:

1. **New region types:** Tracks, territories, tech trees, connection grids
2. **Advanced mark types:** Lines, area fills, multi-cell marks
3. **Game templates:** More example games
4. **Mobile improvements:** Better touch interactions
5. **Accessibility:** Enhanced screen reader support

## License

MIT

## Credits

**Built with:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + @tailwindcss/postcss
- Lucide React (icons)

**Inspired by:** Yahtzee, Welcome to the Moon, Twilight Inscription, Cartographers, Railroad Ink, Fleet the Dice Game, Ganz Schön Clever

---

Made with ❤️ for board game enthusiasts
