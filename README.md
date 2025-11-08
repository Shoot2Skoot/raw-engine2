# Roll-and-Write Game Engine

A web-based drawing/markup engine specifically designed for roll-and-write board games. Think "Figma meets roll-and-write games."

## 🎯 What This Is

- **A framework** for defining interactive, markable game sheets
- **An intuitive UI** for players to mark, fill, and annotate sheets
- **A developer-friendly API** for defining layouts and hotspots
- **A state management system** with undo/redo and save/load

## 🚫 What This Is NOT

- A rules validator (doesn't know if moves are legal)
- A scoring calculator (doesn't understand game mechanics)
- A multiplayer game server (local only for now)
- A complete game (provides the canvas, not the game logic)

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📖 Usage Example

```typescript
import { SheetBuilder } from './builders/SheetBuilder';
import { SheetEngine } from './engine/SheetEngine';

// Define a simple Yahtzee-style sheet
const mySheet = SheetBuilder.create('yahtzee-upper')
  .name('Upper Section')
  .size(400, 600)
  .backgroundColor('#FEFEFE')
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
  if (!isValidYahtzeeScore(event.mark.value)) {
    engine.rejectMark(event.hotspotId);
  }
});

// Render (in React component)
<EngineProvider engine={engine}>
  <Toolbar />
  <SheetCanvas />
</EngineProvider>
```

## 🎨 Features

### Core Engine

- **Type-safe** TypeScript definitions for all entities
- **Geometry utilities** for point-in-shape detection (rect, circle, polygon)
- **Coordinate transformation** between screen and SVG space
- **Event system** for hooking into game logic
- **Command pattern** for undo/redo functionality
- **Serialization** for save/load with versioning

### Mark Types

The engine supports 7 different mark types:

1. **Checkbox** - Empty → Checked → Crossed (cycle)
2. **Number** - Integer values (with picker)
3. **Fill** - Color fills (with color picker)
4. **Circle** - Empty → Half → Full (cycle)
5. **Symbol** - Icons from predefined set (★, ♦, ♥, etc.)
6. **Text** - Free text input
7. **Pencil** - Erasable temporary marks

### Interactive Components

- **SheetCanvas** - Main SVG canvas with click/touch interaction
- **Toolbar** - Tool selection with keyboard shortcuts
- **ValuePicker** - Popover for number/color/symbol selection
- **SheetTabs** - Multi-sheet navigation
- **MarkRenderer** - Renders all mark types

### Developer Tools

- **SheetBuilder** - Fluent API for creating sheets
- **Grid Generation** - Auto-generate hotspots from grid layouts
- **Debug Mode** - Visual hotspot outlines in development
- **Example Sheets** - Pre-built templates to learn from

## ⌨️ Keyboard Shortcuts

| Key | Tool |
|-----|------|
| `C` | Checkbox |
| `N` | Number |
| `F` | Fill |
| `O` | Circle |
| `P` | Pencil |
| `T` | Text |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

## 🏗️ Project Structure

```
roll-and-write-engine/
├── src/
│   ├── components/          # React components
│   │   ├── SheetCanvas.tsx
│   │   ├── MarkRenderer.tsx
│   │   ├── Toolbar.tsx
│   │   └── ...
│   ├── engine/              # Core engine
│   │   ├── types.ts
│   │   ├── SheetEngine.ts
│   │   ├── EventBus.ts
│   │   └── History.ts
│   ├── utils/               # Utilities
│   │   ├── geometry.ts
│   │   └── coordinates.ts
│   ├── builders/            # Builder APIs
│   │   └── SheetBuilder.ts
│   ├── context/             # React context
│   │   └── EngineContext.tsx
│   └── examples/            # Example sheets
│       └── sheets.ts
└── public/                  # Static assets
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **SVG** - Rendering (scalable, print-friendly)

## 📝 Creating a Custom Sheet

### Simple Grid

```typescript
const sheet = SheetBuilder.create('my-game')
  .name('My Game Sheet')
  .size(600, 800)
  .backgroundColor('#FFFFFF')
  .addGridRegion(
    'main-grid',
    5,  // rows
    5,  // cols
    80, // cell size
    { x: 50, y: 50 },
    ['number', 'checkbox']
  )
  .build();
```

### Custom Hotspots

```typescript
const sheet = SheetBuilder.create('custom')
  .name('Custom Layout')
  .size(800, 600)
  .addFreeformRegion('special', [
    {
      id: 'circle-1',
      shape: 'circle',
      position: { x: 100, y: 100 },
      radius: 40,
      allowedMarkTypes: ['checkbox'],
      maxMarks: 1
    },
    {
      id: 'polygon-1',
      shape: 'polygon',
      points: [
        { x: 200, y: 200 },
        { x: 300, y: 220 },
        { x: 280, y: 300 },
        { x: 180, y: 280 }
      ],
      allowedMarkTypes: ['fill', 'symbol'],
      maxMarks: 2
    }
  ])
  .build();
```

## 🎮 Game Logic Integration

Hook into engine events to add game-specific logic:

```typescript
// Validate moves
engine.on('markAdded', (event) => {
  if (event.type === 'markAdded') {
    if (!isValidMove(event.hotspotId, event.mark)) {
      engine.removeMark(event.hotspotId);
      alert('Invalid move!');
    }
  }
});

// Track score changes
engine.on('markAdded', (event) => {
  if (event.type === 'markAdded') {
    updateScore(calculateScore(engine.getCurrentSheet()));
  }
});

// Auto-save
engine.on('markAdded', () => {
  localStorage.setItem('game-save', JSON.stringify(engine.exportState()));
});
```

## 💾 Save/Load

```typescript
// Save
const state = engine.exportState();
localStorage.setItem('my-game', JSON.stringify(state));

// Load
const saved = localStorage.getItem('my-game');
if (saved) {
  engine.importState(JSON.parse(saved));
}
```

## 🎯 Design Philosophy

1. **Separation of Concerns** - Engine handles UI, you handle game logic
2. **Type Safety** - Full TypeScript coverage with strict mode
3. **Developer Experience** - Fluent APIs and clear examples
4. **Performance** - SVG rendering, memoization, debouncing
5. **Accessibility** - Keyboard navigation, ARIA labels, focus management

## 🔮 Future Enhancements

- [ ] Mobile gesture support (pinch-to-zoom, long-press)
- [ ] Multi-player sync (WebRTC or WebSocket)
- [ ] Print-friendly export (PDF generation)
- [ ] Animation customization
- [ ] Custom mark types
- [ ] Undo/redo limits configuration
- [ ] Touch-optimized UI

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built incrementally.** Started with core types and engine, validated with simple examples, then expanded. Focus on developer experience and player delight. This is a drawing tool that respects the craft of roll-and-write game design. 🎲
