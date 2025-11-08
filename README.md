# Roll-and-Write Game Engine

A comprehensive web-based engine for creating digital roll-and-write board games. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Flexible Sheet Layouts**: Grid-based, image-overlay, freeform, and mixed layouts
- **Rich Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice System**: Standard and custom dice with locking and manipulation
- **Card System**: Full deck management with shuffle, draw, discard, and split
- **Auto-Save**: Automatic state persistence to localStorage
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Mobile-Friendly**: Touch-optimized with 44px minimum tap targets
- **TypeScript**: Fully typed with strict mode enabled

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

Visit `http://localhost:5173` to see the Yahtzee demo.

## Creating Your First Game

Here's a simple game configuration (30 lines):

```typescript
import { GameConfig } from './types';
import { generateGridHotspots } from './utils/grid';

export const myGameConfig: GameConfig = {
  id: 'my-game',
  name: 'My Game',
  version: '1.0.0',
  sheets: [{
    id: 'main-sheet',
    name: 'Main Sheet',
    layout: 'grid',
    dimensions: { width: 600, height: 800 },
    hotspots: generateGridHotspots({
      rows: 10,
      columns: 5,
      cellWidth: 100,
      cellHeight: 60,
      gap: 5,
      startPosition: { x: 20, y: 20 },
      allowedMarkTypes: ['number', 'checkbox'],
    }),
  }],
  tools: [
    { type: 'number', label: 'Number', isPermanent: true },
    { type: 'checkbox', label: 'Checkbox', isPermanent: true },
    { type: 'eraser', label: 'Eraser', isPermanent: true },
  ],
};
```

Then use it in your app:

```typescript
import { Game } from './components/Game';
import { myGameConfig } from './games/myGameConfig';

function App() {
  return <Game config={myGameConfig} />;
}
```

## Project Structure

```
src/
├── types/              # TypeScript type definitions
│   ├── marks.ts       # Mark types (checkbox, number, color, etc.)
│   ├── sheet.ts       # Sheet and hotspot types
│   ├── dice.ts        # Dice mechanics types
│   ├── cards.ts       # Card and deck types
│   └── game.ts        # Main game state types
├── engine/             # Core game logic
│   ├── state/         # State management
│   ├── marks/         # Mark manipulation
│   ├── dice/          # Dice rolling engine
│   └── cards/         # Deck management engine
├── components/         # React components
│   ├── ui/            # UI components (toolbar, buttons)
│   ├── marks/         # Mark renderers
│   ├── dice/          # Dice display
│   ├── cards/         # Card display
│   └── sheets/        # Sheet renderer
├── games/              # Example games
│   └── yahtzee/       # Yahtzee implementation
└── utils/              # Utility functions
    ├── common.ts      # Common utilities
    ├── storage.ts     # localStorage helpers
    └── grid.ts        # Grid generation
```

## Core Concepts

### Sheets

Sheets are game boards where players place marks. Four layout types:

1. **Grid**: Auto-generated uniform grid of cells
2. **Image Overlay**: Custom artwork with positioned hotspots
3. **Freeform**: Manually positioned hotspots
4. **Mixed**: Combination of multiple layouts

### Hotspots

Interactive regions on a sheet where marks can be placed. Three shapes:

- **Rectangle**: Most common, defined by position and dimensions
- **Circle**: Defined by center and radius
- **Polygon**: Irregular shapes with arbitrary vertices

### Marks

Player-placed indicators on hotspots:

- **Checkbox**: Empty → Checked → Crossed
- **Number**: Any integer value
- **Color**: Fill with configurable opacity
- **Circle**: Empty → Half → Full
- **Symbol**: Icons from a palette
- **Text**: Freeform text entry
- **Line**: Connections between hotspots

### Dice

- **Standard**: d4, d6, d8, d10, d12, d20
- **Custom**: Any number of faces with symbols, colors, text
- **Pools**: Multiple dice groups with independent rolling
- **Locking**: Keep specific dice between rolls
- **Manipulation**: +1/-1, flip, set value

### Cards

- **Multi-field**: Numbers, symbols, text, colors, images
- **Deck Operations**: Shuffle, draw, discard, peek
- **Split Decks**: Divide into multiple piles for missions
- **Reshuffle**: Combine discard back into draw pile

## Examples

### Example 1: Yahtzee (Simple Grid)

- Single sheet with vertical grid
- 5 standard d6 dice
- Number marks only
- Demonstrates: basic grid, dice rolling, locking

**Lines of config: ~60**

### Example 2: Welcome to the Moon (Medium)

- 3 interconnected sheets
- Card deck with number + symbol fields
- Image backgrounds with overlay hotspots
- Demonstrates: multi-sheet, cards, image layouts

**Lines of config: ~150** (planned)

### Example 3: Twilight Inscription (Complex)

- 4 main sheets with mixed layouts
- Custom dice with symbols
- Territory maps with polygon hotspots
- Tech trees with prerequisites
- Demonstrates: all features combined

**Lines of config: ~300** (planned)

## Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `1-9`: Select tools (if configured)

## State Management

The engine automatically saves to localStorage after every action (debounced 500ms). State includes:

- All marks on all sheets
- Current dice results and lock states
- Card positions in all decks
- Full undo/redo history
- Selected tool and current sheet

## Performance

- Mark placement: <16ms (60fps)
- Sheet switching: <100ms
- Handles 200+ hotspots smoothly
- No memory leaks in 2+ hour sessions

## Accessibility

- Full keyboard navigation
- WCAG 2.1 AA contrast ratios
- Screen reader support (partial)
- Focus indicators always visible
- Works at 200% zoom

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## API Reference

### `generateGridHotspots(config: GridConfig): Hotspot[]`

Auto-generate a grid of rectangle hotspots.

**Parameters:**
- `rows`: Number of rows (1-50)
- `columns`: Number of columns (1-50)
- `cellWidth`: Width of each cell in pixels
- `cellHeight`: Height of each cell in pixels
- `gap`: Spacing between cells (0-20px)
- `startPosition`: {x, y} top-left corner
- `allowedMarkTypes`: Array of mark types
- `maxMarks`: Maximum marks per cell (default: 1)
- `canUnmark`: Whether marks can be removed (default: true)

**Example:**
```typescript
const hotspots = generateGridHotspots({
  rows: 5,
  columns: 5,
  cellWidth: 80,
  cellHeight: 80,
  gap: 5,
  startPosition: { x: 20, y: 20 },
  allowedMarkTypes: ['number'],
});
```

### `useGameState(config: GameConfig)`

React hook for managing game state with auto-save.

**Returns:**
- `state`: Current game state
- `addMark`: Add a mark to a hotspot
- `removeMark`: Remove a specific mark
- `removeMarksFromHotspot`: Clear all marks from a hotspot
- `selectTool`: Change selected tool
- `changeSheet`: Switch to different sheet
- `undo`: Undo last action
- `redo`: Redo next action
- `canUndo`: Boolean, whether undo is available
- `canRedo`: Boolean, whether redo is available
- `reset`: Reset game state
- `exportState`: Export as JSON string
- `importState`: Import from JSON string

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

For questions or issues, please open a GitHub issue.
