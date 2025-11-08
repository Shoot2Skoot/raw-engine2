# Roll-and-Write Game Engine

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

## Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a simple Yahtzee-style sheet
const mySheet = SheetBuilder.create('yahtzee-upper')
  .name('Upper Section')
  .size(400, 600)
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
  // Add your game validation here
});

// Use in React
<EngineProvider engine={engine}>
  <SheetCanvas />
</EngineProvider>
```

## Features

### Core Engine
- **Type-Safe**: Full TypeScript with strict mode
- **Geometry Utilities**: Point-in-shape detection for rectangles, circles, and polygons
- **Coordinate Transform**: SVG coordinate system handling
- **Event System**: Hook into mark additions/removals for game logic
- **History**: Command pattern with undo/redo
- **Serialization**: Save/load game state with versioning

### Mark Types
- **Checkbox**: Empty → Checked → Crossed (cycles)
- **Number**: Integer values with picker
- **Fill**: Color selection with opacity
- **Circle**: Empty → Half → Full (cycles)
- **Symbol**: Predefined icon set
- **Text**: Free text input
- **Pencil**: Erasable temporary marks

### UI Components
- `SheetCanvas`: Main interactive SVG canvas
- `MarkRenderer`: Renders different mark types
- `ValuePicker`: Context-aware value selection
- `Toolbar`: Tool selection with keyboard shortcuts
- `SheetTabs`: Multi-sheet navigation

### Developer Tools
- `SheetBuilder`: Fluent API for creating sheets
- Grid auto-generation
- Freeform hotspot placement
- Debug mode (hotspot visualization in dev)

## Keyboard Shortcuts

- **C**: Checkbox tool
- **N**: Number tool
- **F**: Fill tool
- **O**: Circle tool
- **P**: Pencil tool
- **T**: Text tool
- **Ctrl+Z**: Undo
- **Ctrl+Shift+Z**: Redo

## Project Structure

```
src/
├── components/          # React UI components
│   ├── SheetCanvas.tsx
│   ├── MarkRenderer.tsx
│   ├── ValuePicker.tsx
│   ├── Toolbar.tsx
│   └── SheetTabs.tsx
├── engine/             # Core engine logic
│   ├── types.ts
│   ├── SheetEngine.ts
│   ├── EventBus.ts
│   └── History.ts
├── utils/              # Utility functions
│   ├── geometry.ts
│   └── coordinates.ts
├── context/            # React context
│   └── EngineContext.tsx
├── builders/           # Sheet definition helpers
│   └── SheetBuilder.ts
└── examples/           # Example sheets
    ├── 01-simple-grid.ts
    └── 02-mixed-layout.ts
```

## Creating Custom Sheets

### Grid Layout (Simple)

```typescript
const sheet = SheetBuilder.create('my-game')
  .name('Score Sheet')
  .size(800, 1000)
  .addGridRegion(
    'main-grid',
    5,    // rows
    5,    // cols
    100,  // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox']
  )
  .build();
```

### Freeform Layout (Advanced)

```typescript
const sheet = SheetBuilder.create('custom')
  .name('Custom Layout')
  .size(800, 1000)
  .addFreeformRegion('circles', [
    {
      id: 'bonus-1',
      shape: 'circle',
      position: { x: 100, y: 100 },
      radius: 30,
      allowedMarkTypes: ['circle'],
      maxMarks: 1
    },
    {
      id: 'polygon-area',
      shape: 'polygon',
      points: [
        { x: 200, y: 200 },
        { x: 300, y: 200 },
        { x: 300, y: 300 },
        { x: 200, y: 300 }
      ],
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 1
    }
  ])
  .build();
```

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **SVG** for scalable graphics

## Development

The engine runs in development mode with additional features:
- Red dashed lines show hotspot boundaries
- Console logging for events
- Hot module replacement

Build for production to remove debug features:

```bash
npm run build
```

## Game Logic Integration

The engine provides events for you to hook your game logic into:

```typescript
// Validate moves
engine.on('markAdded', (event) => {
  if (!isValidMove(event.mark.value)) {
    engine.rejectMark(event.hotspotId, 'Invalid move');
  }
});

// Calculate scores
engine.on('markAdded', (event) => {
  const newScore = calculateScore(engine.exportState());
  updateScoreDisplay(newScore);
});

// Save automatically
engine.on('markAdded', () => {
  const state = engine.exportState();
  localStorage.setItem('game-save', JSON.stringify(state));
});
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

## License

MIT

## Contributing

This is a specialized tool for roll-and-write games. Contributions should focus on:
- Additional mark types
- Performance optimizations
- Accessibility improvements
- Bug fixes

## Roadmap

- [ ] Multiplayer sync
- [ ] Image hotspot backgrounds
- [ ] Custom mark renderers
- [ ] Mobile gesture improvements
- [ ] Accessibility enhancements
- [ ] Animation options
- [ ] Export to PDF/PNG

---

**Built with React + TypeScript + Tailwind CSS + Vite**

A framework for interactive roll-and-write game sheets.
