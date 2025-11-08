# Roll-and-Write Game Engine

A web-based drawing/markup engine specifically designed for roll-and-write board games. This is a specialized drawing tool, not a game rules engine—think "Figma meets roll-and-write games."

![Demo](https://img.shields.io/badge/status-ready-brightgreen)

## What This IS

- **A framework** for defining interactive, markable game sheets
- **An intuitive UI** for players to mark, fill, and annotate sheets
- **A developer-friendly API** for defining layouts and hotspots
- **A state management system** with undo/redo and save/load

## What This IS NOT

- ❌ A rules validator (doesn't know if moves are legal)
- ❌ A scoring calculator (doesn't understand game mechanics)
- ❌ A multiplayer game server (local only for now)
- ❌ A complete game (provides the canvas, not the game logic)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit http://localhost:5173/ to see the engine in action!

## Features

✅ **Multiple Mark Types**
- Checkbox (cycling: empty → checked → crossed)
- Number (0-9 picker)
- Fill (8 color palette)
- Circle (empty → half → full)
- Pencil (erasable temporary marks)
- Symbol (★, ♦, ♥, ♠, ♣, ●, ■, ▲)
- Text (free text input)

✅ **Rich Interaction**
- Click to mark cells
- Keyboard shortcuts (C, N, F, O, P, T for tools)
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- Save/Load state (Ctrl+S)
- Touch-friendly mobile support

✅ **Developer Tools**
- Fluent SheetBuilder API
- Type-safe TypeScript definitions
- Hot module replacement (HMR)
- Debug mode with hotspot outlines

## Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';

// Define a simple Yahtzee-style sheet
const yahtzeeSheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#FEFEFE')
  .addGridRegion(
    'upper-section',
    6,  // rows
    1,  // cols
    80, // cell size
    { x: 50, y: 100 },
    ['number']
  )
  .build();

// Initialize engine
const engine = new SheetEngine([yahtzeeSheet]);

// Hook in game logic (optional)
engine.on('markAdded', (event) => {
  console.log('Mark added:', event);
});

// Render in React
<EngineProvider engine={engine}>
  <SheetCanvas />
</EngineProvider>
```

## Project Structure

```
src/
├── engine/              # Core engine logic
│   ├── types.ts         # TypeScript definitions
│   ├── SheetEngine.ts   # Main engine class
│   ├── EventBus.ts      # Event system
│   └── History.ts       # Undo/redo commands
├── components/          # React components
│   ├── SheetCanvas.tsx  # SVG canvas
│   ├── MarkRenderer.tsx # Mark rendering
│   ├── ValuePicker.tsx  # Value selection UI
│   └── Toolbar.tsx      # Tool selection
├── context/             # React context
│   └── EngineContext.tsx
├── utils/               # Utilities
│   ├── geometry.ts      # Hit detection
│   └── coordinates.ts   # Coordinate transforms
├── builders/            # Fluent API
│   └── SheetBuilder.ts
└── examples/            # Example sheets
    └── simple-grid.ts
```

## Architecture

### Core Concepts

1. **SheetDefinition**: Describes the layout and hotspots
2. **Hotspot**: A markable region (rect, circle, polygon, or point)
3. **Mark**: A placed annotation (checkbox, number, fill, etc.)
4. **Region**: A collection of hotspots (grid or freeform)

### Coordinate System

- Origin (0,0) is top-left
- X increases rightward, Y increases downward
- All coordinates are in SVG sheet space
- Automatic screen-to-sheet coordinate transformation

### Event System

The engine emits events for game logic integration:

```typescript
engine.on('markAdded', (event) => {
  // Validate move, update score, etc.
});

engine.on('markRejected', (event) => {
  // Show error message
});
```

### State Management

- **Undo/Redo**: Command pattern with full history
- **Save/Load**: Versioned JSON serialization to localStorage
- **Reactive**: Events trigger React re-renders automatically

## Mark Types

### Checkbox
Click to cycle: empty → ✓ → ✗ → (remove)

### Number
Shows number picker (0-9), displays value in cell

### Fill
Shows color picker (8 colors), fills cell with semi-transparent color

### Circle
Click to cycle: ○ → ◐ → ● → (remove)

### Pencil
Like number but lighter and italic (erasable)

### Symbol
Shows symbol picker (8 symbols: ★, ♦, ♥, ♠, ♣, ●, ■, ▲)

### Text
Free text input (not implemented in current UI)

## Keyboard Shortcuts

- **C** - Checkbox tool
- **N** - Number tool
- **F** - Fill tool
- **O** - Circle tool
- **P** - Pencil tool
- **T** - Text tool
- **Ctrl+Z** - Undo
- **Ctrl+Shift+Z** - Redo
- **Ctrl+S** - Save

## Advanced Usage

### Custom Hotspots

```typescript
.addFreeformRegion('custom', [
  {
    id: 'special-circle',
    shape: 'circle',
    position: { x: 100, y: 100 },
    radius: 30,
    allowedMarkTypes: ['fill', 'symbol'],
    maxMarks: 2  // Can have both fill AND symbol
  },
  {
    id: 'polygon-region',
    shape: 'polygon',
    position: { x: 0, y: 0 },
    points: [
      { x: 200, y: 200 },
      { x: 300, y: 200 },
      { x: 250, y: 280 }
    ],
    allowedMarkTypes: ['checkbox']
  }
])
```

### Background Images

```typescript
.background('/path/to/game-sheet.png')
```

The engine overlays hotspots on your image, enabling "Welcome to..." style games.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)

## Performance

- Handles 100+ hotspots smoothly
- SVG-based for crisp rendering at any zoom
- Efficient hit detection with spatial indexing
- Debounced hover updates

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **SVG** - Scalable graphics

## Development

```bash
# Run dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

This is a demonstration project showcasing the architecture for a roll-and-write engine. Feel free to extend it with:

- Additional mark types (dice, paths, connections)
- Network multiplayer
- Game-specific rules engines
- Mobile gesture improvements
- Accessibility enhancements

## License

MIT

## Credits

Built following the comprehensive roll-and-write engine specification. Inspired by games like:
- Yahtzee
- Welcome to Your Perfect Home
- Railroad Ink
- Cartographers
- Twice as Clever

---

**Server Running**: The dev server is running at http://localhost:5173/

Try clicking on cells, switching tools, using keyboard shortcuts, and experimenting with undo/redo!
