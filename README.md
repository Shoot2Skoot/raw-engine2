# Roll-and-Write Game Engine

A web-based drawing/markup engine specifically designed for roll-and-write board games. Think "Figma meets roll-and-write games."

## What This IS

- **A framework for defining interactive, markable game sheets**
- **An intuitive UI for players to mark, fill, and annotate sheets**
- **A developer-friendly API for defining layouts and hotspots**
- **A state management system with undo/redo and save/load**

## What This IS NOT

- Not a rules validator (doesn't know if moves are legal)
- Not a scoring calculator (doesn't understand game mechanics)
- Not a multiplayer game server (local only for now)
- Not a complete game (provides the canvas, not the game logic)

## Features

- ✅ Multiple mark types: checkboxes, numbers, colors, circles, symbols, text, pencil marks
- ✅ Interactive SVG-based rendering
- ✅ Hit detection for various shapes (rectangles, circles, polygons)
- ✅ Undo/redo with command pattern
- ✅ Save/load state to localStorage
- ✅ Keyboard shortcuts
- ✅ Fluent API for sheet building
- ✅ Event system for game logic hooks
- ✅ Responsive and touch-friendly

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a simple Yahtzee-style sheet
const mySheet = SheetBuilder.create('yahtzee-upper')
  .name('Upper Section')
  .size(400, 600)
  .backgroundColor('#F5F5DC')
  .addGridRegion(
    'scores',
    6,  // rows
    1,  // cols
    80, // cell size
    { x: 50, y: 100 }, // origin
    ['number'] // allowed mark types
  )
  .build();

// Initialize engine
const engine = new SheetEngine([mySheet]);

// Hook in game logic (optional)
engine.on('markAdded', (event) => {
  console.log('Mark added:', event.mark);
  // Add custom validation or scoring logic here
});
```

## Project Structure

```
src/
├── engine/           # Core engine classes
│   ├── types.ts      # TypeScript definitions
│   ├── SheetEngine.ts # Main engine class
│   ├── EventBus.ts   # Event system
│   └── History.ts    # Undo/redo system
├── components/       # React components
│   ├── SheetCanvas.tsx
│   ├── MarkRenderer.tsx
│   ├── ValuePicker.tsx
│   └── Toolbar.tsx
├── utils/            # Utility functions
│   ├── geometry.ts   # Hit detection
│   └── coordinates.ts # Coordinate transformation
├── builders/         # Fluent API builders
│   └── SheetBuilder.ts
├── examples/         # Example sheet definitions
│   ├── simple-grid.ts
│   ├── yahtzee.ts
│   └── freeform.ts
└── context/          # React context
    └── EngineContext.tsx
```

## Mark Types

- **checkbox**: Empty → Checked → Crossed (cyclic)
- **number**: Integer input with value picker
- **fill**: Color fill with opacity
- **circle**: Empty → Half → Full (cyclic)
- **symbol**: Predefined symbols (★, ♦, ♥, etc.)
- **text**: Free text input
- **pencil**: Erasable temporary marks

## Keyboard Shortcuts

- **C**: Checkbox tool
- **N**: Number tool
- **F**: Fill tool
- **O**: Circle tool
- **P**: Pencil tool
- **T**: Text tool
- **Ctrl+Z**: Undo
- **Ctrl+Shift+Z**: Redo

## Tech Stack

- React 18+ with TypeScript (strict mode)
- Vite for build tooling
- Tailwind CSS for styling
- SVG for graphics
- Lucide React for icons

## Success Criteria

✅ Developer can define a sheet in < 30 lines of code
✅ All mark types render clearly at any zoom
✅ Undo/redo works across all sheets
✅ State serializes/deserializes perfectly
✅ Keyboard navigation works completely

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests (when available)
npm test
```

## License

MIT

## Contributing

Contributions are welcome! This is an open-source project designed to be extensible.

---

**Built with React, TypeScript, and SVG • Open source and extensible**
