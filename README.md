# Roll-and-Write Game Engine

A comprehensive web-based engine for creating digital versions of roll-and-write board games (like Yahtzee, Welcome to the Moon, Twilight Inscription, and more).

## Features

- **Flexible Sheet Definition**: Create grids, image-overlay sheets, custom hotspots, and complex mixed layouts
- **Multiple Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and connection lines
- **Dice Rolling System**: Standard dice (d4-d20) and custom dice with symbols, colors, or combinations
- **Card & Deck Management**: Draw, shuffle, discard piles with multi-field cards
- **Auto-Save**: Automatic localStorage saving so you never lose progress
- **Undo/Redo**: Full action history with undo/redo support
- **Touch & Mouse Support**: Works seamlessly on desktop and mobile devices
- **Developer-Friendly**: Simple JSON-based configuration for creating new games

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd raw-engine2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running the Example

The engine comes with a Yahtzee example game pre-configured. Simply run `npm run dev` and open your browser to see it in action.

## Creating Your First Game

### 1. Define Your Game Configuration

Create a new file in `src/games/` (e.g., `mygame.ts`):

```typescript
import type { GameConfig } from '../types';

export const myGameConfig: GameConfig = {
  id: 'my-game',
  name: 'My Game',
  description: 'A simple roll-and-write game',

  sheets: [
    {
      name: 'Score Sheet',
      layout: 'grid',
      width: 600,
      height: 800,
      regions: [
        {
          id: 'main-grid',
          config: {
            layout: 'grid',
            rows: 10,
            columns: 5,
            cellWidth: 100,
            cellHeight: 60,
            gap: 5,
            offsetX: 50,
            offsetY: 50
          },
          hotspots: [] // Auto-generated for grid layout
        }
      ]
    }
  ],

  dicePools: [
    {
      id: 'main-pool',
      name: 'Game Dice',
      dice: [
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' }
      ]
    }
  ],

  defaultTool: 'number'
};
```

### 2. Use Your Game in App.tsx

```typescript
import { myGameConfig } from './games/mygame';

function App() {
  const [selectedGame] = useState<GameConfig>(myGameConfig);

  return (
    <GameProvider config={selectedGame}>
      <GameEngine />
    </GameProvider>
  );
}
```

## Configuration Guide

### Sheet Layouts

#### Grid Layout (Auto-Generated Hotspots)
```typescript
{
  layout: 'grid',
  rows: 6,
  columns: 3,
  cellWidth: 100,
  cellHeight: 60,
  gap: 5,
  offsetX: 50,
  offsetY: 50
}
```

#### Image Overlay Layout
```typescript
{
  name: 'Custom Sheet',
  layout: 'image-overlay',
  width: 800,
  height: 600,
  background: {
    src: '/path/to/image.png',
    width: 800,
    height: 600,
    maintainAspectRatio: true
  },
  regions: [
    {
      id: 'region-1',
      config: { layout: 'freeform' },
      hotspots: [
        {
          id: 'hotspot-1',
          position: {
            shape: 'rectangle',
            x: 100,
            y: 100,
            width: 80,
            height: 50
          },
          constraints: {
            allowedMarkTypes: ['number'],
            maxMarks: 1
          },
          marks: []
        }
      ]
    }
  ]
}
```

### Mark Types

Available mark types:
- `checkbox`: Empty/Checked/Crossed states
- `number`: Numeric entry (0-999)
- `color`: Color fill with opacity
- `circle`: Empty/Half/Full states
- `symbol`: Icons and symbols
- `text`: Freeform text
- `line`: Connection between points
- `pencil`: Temporary/planning marks

### Dice Configuration

#### Standard Dice
```typescript
{ type: 'standard', sides: 'd6' }  // d4, d6, d8, d10, d12, d20
```

#### Custom Dice
```typescript
{
  type: 'custom',
  faces: [
    { type: 'number', value: 1 },
    { type: 'symbol', symbol: '★', color: '#FFD700' },
    { type: 'text', text: 'Wild' },
    { type: 'color', color: '#FF0000' },
    {
      type: 'combination',
      content: [
        { type: 'number', value: 2 },
        { type: 'symbol', value: '♠' }
      ]
    }
  ],
  weights: [1, 1, 1, 1, 2]  // Optional probability weights
}
```

### Card & Deck Configuration

```typescript
decks: [
  {
    id: 'main-deck',
    name: 'Action Cards',
    cards: [
      {
        id: 'card-1',
        fields: {
          number: { type: 'number', value: 5 },
          action: { type: 'symbol', value: '★', color: '#FFD700' },
          description: { type: 'text', value: 'Take 2 resources' }
        }
      },
      // More cards...
    ]
  }
]
```

## API Reference

### GameConfig

Main configuration object for a game.

```typescript
interface GameConfig {
  id: string;
  name: string;
  description?: string;
  sheets: SheetConfig[];
  dicePools?: Array<{ id: string; name: string; dice: DieConfig[] }>;
  decks?: DeckConfig[];
  defaultTool?: MarkType;
}
```

### useGame Hook

Access game state and actions from components.

```typescript
const {
  state,          // Current game state
  dispatch,       // Dispatch actions
  undo,           // Undo last action
  redo,           // Redo last undone action
  canUndo,        // Boolean: can undo
  canRedo,        // Boolean: can redo
  saveGame,       // Save to file
  loadGame        // Load from file
} = useGame();
```

### Common Actions

```typescript
// Add a mark to a hotspot
dispatch({
  type: 'ADD_MARK',
  sheetId: 'sheet-1',
  hotspotId: 'hotspot-1',
  mark: { type: 'number', value: 5 }
});

// Roll dice
dispatch({
  type: 'ROLL_DICE',
  poolId: 'main-pool',
  results: [
    { dieId: 'die-1', result: 4 },
    { dieId: 'die-2', result: 6 }
  ]
});

// Draw card
dispatch({
  type: 'DRAW_CARD',
  deckId: 'main-deck',
  card: currentDeck.drawPile[0]
});
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── Sheet.tsx        # Sheet rendering
│   ├── Region.tsx       # Region container
│   ├── Hotspot.tsx      # Interactive hotspot
│   ├── ToolPalette.tsx  # Marking tools UI
│   ├── DiceDisplay.tsx  # Dice rolling UI
│   ├── CardDisplay.tsx  # Card management UI
│   └── marks/
│       └── MarkRenderer.tsx  # Mark rendering
├── games/               # Game configurations
│   └── yahtzee.ts       # Example game
├── utils/               # Utilities
│   ├── gameInitializer.ts  # State initialization
│   ├── storage.ts          # localStorage operations
│   └── dice.ts             # Dice rolling logic
├── types.ts             # TypeScript type definitions
├── GameContext.tsx      # State management
└── App.tsx              # Main application
```

## Examples

### Example 1: Simple Grid Game (Yahtzee)
See `src/games/yahtzee.ts` for a complete example of a grid-based game with dice rolling.

### Example 2: Image Overlay Game
```typescript
{
  name: 'Adventure Sheet',
  layout: 'image-overlay',
  width: 800,
  height: 600,
  background: {
    src: '/assets/adventure-map.png',
    width: 800,
    height: 600,
    maintainAspectRatio: true
  },
  regions: [
    {
      id: 'locations',
      config: { layout: 'freeform' },
      hotspots: [
        {
          id: 'town',
          position: { shape: 'circle', cx: 400, cy: 300, radius: 40 },
          constraints: { allowedMarkTypes: ['checkbox'] },
          marks: []
        }
      ]
    }
  ]
}
```

### Example 3: Card-Based Game
```typescript
{
  sheets: [/* ... */],
  decks: [
    {
      id: 'exploration',
      name: 'Exploration Deck',
      cards: [
        {
          id: 'card-1',
          fields: {
            terrain: { type: 'symbol', value: '🏔️' },
            points: { type: 'number', value: 3 },
            name: { type: 'text', value: 'Mountain Pass' }
          }
        }
      ]
    }
  ]
}
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Ctrl/Cmd + S`: Save game (coming soon)
- `1-9`: Switch between sheets (multi-sheet games)

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
