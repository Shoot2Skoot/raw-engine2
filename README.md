# Roll & Write Game Engine

A web-based drawing/markup engine specifically designed for roll-and-write board games. This is **a specialized drawing tool**, not a game rules engine. Think "Figma meets roll-and-write games."

## What This IS

- A framework for defining interactive, markable game sheets
- An intuitive UI for players to mark, fill, and annotate sheets
- A developer-friendly API for defining layouts and hotspots
- A state management system with undo/redo and save/load

## What This IS NOT

- A rules validator (doesn't know if moves are legal)
- A scoring calculator (doesn't understand game mechanics)
- A multiplayer game server (local only for now)
- A complete game (provides the canvas, not the game logic)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Example Usage

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a simple Yahtzee-style sheet
const mySheet = SheetBuilder.create('yahtzee-upper')
  .name('Upper Section')
  .size(400, 600)
  .backgroundColor('#F5F5F5')
  .addGridRegion(
    'scores',
    6,  // rows
    1,  // cols
    80, // cell size
    { x: 0, y: 0 },
    ['number']
  )
  .build();

// Initialize engine
const engine = new SheetEngine([mySheet]);

// Hook in game logic
engine.on('markAdded', (event) => {
  if (!isValidYahtzeeScore(event.mark.value)) {
    engine.rejectMark(event.hotspotId);
  }
});
```

## Features

- ✅ Multiple mark types: checkbox, number, fill, circle, symbol, text, pencil
- ✅ Grid and freeform layouts
- ✅ Hit detection for rect, circle, polygon, and point hotspots
- ✅ Undo/redo with command pattern
- ✅ State serialization (save/load)
- ✅ Event system for game logic hooks
- ✅ Touch-friendly interface
- ✅ Keyboard shortcuts
- ✅ SVG-based rendering (scalable & print-friendly)

## Architecture

```
src/
├── engine/           # Core engine logic
│   ├── types.ts      # TypeScript definitions
│   ├── SheetEngine.ts # Main engine class
│   ├── EventBus.ts   # Event system
│   └── History.ts    # Undo/redo
├── components/       # React components
│   ├── SheetCanvas.tsx
│   ├── MarkRenderer.tsx
│   ├── ValuePicker.tsx
│   ├── Toolbar.tsx
│   └── SheetTabs.tsx
├── utils/           # Utilities
│   ├── geometry.ts
│   └── coordinates.ts
├── builders/        # Fluent API for sheets
│   └── SheetBuilder.ts
└── examples/        # Example sheets
    ├── 01-simple-grid.ts
    ├── 02-image-hotspots.ts
    └── 03-mixed-layout.ts
```

## Keyboard Shortcuts

- **C** - Checkbox tool
- **N** - Number tool
- **F** - Fill tool
- **O** - Circle tool
- **P** - Pencil tool
- **T** - Text tool
- **Ctrl+Z** - Undo
- **Ctrl+Shift+Z** - Redo

## Development

Built with:
- React 18+ with TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- SVG for rendering

## License

MIT
