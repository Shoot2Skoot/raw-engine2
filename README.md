# Roll & Write Engine

A web-based drawing/markup engine specifically designed for roll-and-write board games.

## What is This?

This is **a specialized drawing tool**, not a game rules engine. Think "Figma meets roll-and-write games."

**What This IS:**
- A framework for defining interactive, markable game sheets
- An intuitive UI for players to mark, fill, and annotate sheets
- A developer-friendly API for defining layouts and hotspots
- A state management system with undo/redo and save/load

**What This IS NOT:**
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

## Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a sheet
const mySheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#F0F0F0')
  .addGridRegion(
    'scores',
    6,  // rows
    1,  // cols
    80, // cell size
    { x: 50, y: 100 },
    ['number']
  )
  .build();

// Initialize engine
const engine = new SheetEngine([mySheet]);

// Hook in game logic
engine.on('markAdded', (event) => {
  console.log('Mark added:', event);
});

// Use in React
<EngineProvider engine={engine}>
  <SheetCanvas />
</EngineProvider>
```

## Features

- **Mark Types**: checkbox, number, fill, circle, symbol, text, pencil
- **Hotspot Shapes**: rectangle, circle, polygon, point
- **Layouts**: Grid auto-generation and freeform placement
- **Undo/Redo**: Full history with Command pattern
- **Save/Load**: JSON serialization with versioning
- **Keyboard Shortcuts**: C, N, F, O, P, T for tools; Ctrl+Z/Shift+Z for undo/redo
- **Mobile Ready**: Touch-friendly interactions
- **Developer Tools**: Debug mode with hotspot outlines

## Architecture

```
src/
├── engine/          # Core engine logic
├── components/      # React UI components
├── builders/        # Fluent API for sheet creation
├── utils/           # Geometry and coordinate transforms
├── context/         # React context for state
└── examples/        # Example sheet definitions
```

## Tech Stack

- React 18+ with TypeScript (strict mode)
- Vite (build tool)
- Tailwind CSS (styling)
- SVG (rendering)
- Lucide React (icons)

## License

MIT
