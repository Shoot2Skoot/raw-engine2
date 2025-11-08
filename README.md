# Roll-and-Write Game Engine

A specialized drawing/markup engine for roll-and-write board games. Built with React, TypeScript, and Tailwind CSS.

## Overview

This is **not** a rules engine or game server—it's a framework for defining interactive, markable game sheets with an intuitive UI for players to mark, fill, and annotate. Think "Figma meets roll-and-write games."

## Features

- ✅ **Multiple Mark Types**: Checkboxes, numbers, fills, circles, symbols, text, and pencil marks
- ✅ **Undo/Redo System**: Full command pattern implementation with unlimited history
- ✅ **Developer Friendly**: Fluent API for defining sheets, event hooks for game logic
- ✅ **SVG-Based**: Scalable, print-friendly, accessible graphics
- ✅ **State Management**: Save/load to LocalStorage with versioned serialization
- ✅ **Keyboard Shortcuts**: C, N, F, O, P, T for tools; Ctrl+Z/Ctrl+Shift+Z for undo/redo
- ✅ **Touch-Friendly**: Mobile-ready with pointer events

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a simple grid sheet
const mySheet = SheetBuilder.create('yahtzee')
  .name('Yahtzee Score Sheet')
  .size(400, 700)
  .backgroundColor('#F0F0F0')
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
const engine = new SheetEngine([mySheet]);

// Hook in game logic
engine.on('markAdded', (event) => {
  console.log('Mark added:', event);
});

// Use in React
import { EngineProvider } from './context/EngineContext';
import { SheetCanvas } from './components/SheetCanvas';
import { Toolbar } from './components/Toolbar';

function App() {
  return (
    <EngineProvider engine={engine}>
      <SheetCanvas />
      <Toolbar />
    </EngineProvider>
  );
}
```

## Project Structure

```
src/
├── components/       # React UI components
│   ├── SheetCanvas.tsx
│   ├── Toolbar.tsx
│   ├── MarkRenderer.tsx
│   └── ValuePicker.tsx
├── engine/          # Core engine logic
│   ├── types.ts
│   ├── SheetEngine.ts
│   ├── EventBus.ts
│   └── History.ts
├── utils/           # Helper utilities
│   ├── geometry.ts
│   └── coordinates.ts
├── builders/        # Fluent API builders
│   └── SheetBuilder.ts
└── examples/        # Example sheet definitions
    ├── yahtzee.ts
    ├── simple-grid.ts
    └── mixed-layout.ts
```

## Core Concepts

### Mark Types

- **Checkbox**: Cycles through empty → checked → crossed → empty
- **Number**: Displays numeric values (0-9)
- **Fill**: Color fills with opacity
- **Circle**: Cycles through empty → half → filled → empty
- **Symbol**: Icons from a predefined set (★, ♦, ♥, etc.)
- **Text**: Free-form text input
- **Pencil**: Erasable temporary marks

### Hotspot Shapes

- **Rectangle**: AABB hit detection
- **Circle**: Radius-based hit detection
- **Polygon**: Ray-casting algorithm for irregular shapes
- **Point**: Implicit 20px radius for clicks

### Event System

The engine emits events that you can hook into for game logic:

```typescript
engine.on('markAdded', (event) => {
  // Validate the mark based on game rules
  if (!isValidMove(event.mark)) {
    engine.rejectMark(event.hotspotId, 'Invalid move');
  }
});
```

## Development

Built with:
- React 18
- TypeScript (strict mode)
- Vite
- Tailwind CSS
- Lucide React (icons)
- SVG for graphics

## License

MIT
