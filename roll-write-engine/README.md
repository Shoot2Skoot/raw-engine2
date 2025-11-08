# Roll-and-Write Game Engine

A comprehensive, developer-friendly web-based engine for creating interactive digital versions of roll-and-write board games (Yahtzee, Welcome To, Railroad Ink, Cartographers, Fleet, and similar games).

## ✨ Features

- **Flexible Sheet Definitions**: Grid-based, image overlay, freeform, and mixed layouts
- **Rich Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice Mechanics**: Standard dice (d4-d20) and fully customizable dice with weighted faces
- **Card System**: Complete deck management with draw, discard, shuffle, and split functionality
- **State Management**: Built-in undo/redo with auto-save to localStorage
- **Multi-Sheet Support**: Navigate between multiple interconnected game sheets
- **Developer-Friendly API**: Simple configuration-based game creation
- **Mobile & Desktop**: Fully responsive with touch and mouse support
- **TypeScript**: Full type safety with comprehensive type definitions

## 🚀 Quick Start

### Installation

```bash
npm install
npm run dev
```

The development server will start at `http://localhost:5173/`

### Create Your First Game

Create a game configuration file:

```typescript
import type { GameConfig } from './types';

export const myGameConfig: GameConfig = {
  name: 'My Game',
  sheets: [
    {
      id: 'main-sheet',
      name: 'Game Sheet',
      layout: {
        type: 'grid',
        rows: 6,
        columns: 6,
        cellWidth: 60,
        cellHeight: 60,
        gap: 2,
        defaultConstraints: {
          allowedMarkTypes: ['checkbox', 'number'],
          maxMarks: 1,
        },
      },
    },
  ],
  dicePools: [
    {
      id: 'main-dice',
      name: 'Dice Pool',
      dice: [
        { id: 'die-1', type: 'd6', locked: false },
        { id: 'die-2', type: 'd6', locked: false },
      ],
    },
  ],
};
```

Load it in your app:

```typescript
// src/main.tsx
import { App } from './App';
import { myGameConfig } from './games/myGame';

createRoot(document.getElementById('root')!).render(
  <App config={myGameConfig} />
);
```

## 📚 Example Games

### 1. Yahtzee (Simple)

A basic grid-based game demonstrating:
- Simple vertical grid layout
- Number marking
- Standard dice rolling with locking

Location: `src/games/yahtzee.ts`

### 2. Space Expedition (Medium)

A multi-sheet game demonstrating:
- Multiple sheets with different layouts
- Card deck with multi-field cards
- Symbol marking
- Resource tracking

Location: `src/games/spaceExpedition.ts`

## 🎮 Core Concepts

### Sheets

Game boards where players mark up their choices. Each sheet has a layout type:

- **Grid**: Uniform grid of cells (perfect for Yahtzee, Qwixx)
- **Image Overlay**: Custom artwork with positioned hotspots (Welcome To, Cartographers)
- **Freeform**: Arbitrary positioned hotspots (custom layouts)
- **Mixed**: Combination of multiple regions (Twilight Inscription)

### Hotspots

Interactive regions on sheets where marks can be placed. Hotspots can be:
- Rectangles (grid cells, boxes)
- Circles (resource trackers, indicators)
- Polygons (territories, irregular regions)

### Marks

Player-placed indicators on hotspots:
- **Checkbox**: Empty → Checked → Crossed (cycling states)
- **Number**: Numeric values (0-999)
- **Color**: Fill with semi-transparent color
- **Circle**: Empty → Half → Full (3 states)
- **Symbol**: Icons from a palette
- **Text**: Free-form text entry
- **Line**: Connections between hotspots

### Tools

The currently selected marking instrument. Players select a tool, then click hotspots to apply marks.

### Dice

Randomization with:
- **Standard Dice**: d4, d6, d8, d10, d12, d20
- **Custom Dice**: Define faces with numbers, symbols, colors, or combinations
- **Locking**: Lock specific dice between rolls
- **Modification**: Change die values through game effects

### Cards & Decks

Card-based mechanics with:
- **Multi-field cards**: Each card can have multiple fields (number, symbol, color, text)
- **Draw/Discard**: Draw from deck, discard to pile
- **Shuffle**: Reshuffle discard back into deck
- **Split**: Divide deck into multiple piles

## 🛠 Configuration API

### GameConfig

```typescript
interface GameConfig {
  name: string;                      // Game name
  sheets: Sheet[];                   // Game sheets
  dicePools?: DicePool[];            // Dice pools (optional)
  decks?: Deck[];                    // Card decks (optional)
  customDice?: CustomDie[];          // Custom die definitions (optional)
  symbolPalette?: SymbolPalette;     // Available symbols (optional)
  colorPalette?: string[];           // Available colors (optional)
  defaultTool?: Tool;                // Starting tool (optional)
}
```

### Sheet Layouts

#### Grid Layout

```typescript
{
  type: 'grid',
  rows: 10,                          // Number of rows
  columns: 5,                        // Number of columns
  cellWidth: 60,                     // Cell width in pixels (optional)
  cellHeight: 60,                    // Cell height in pixels (optional)
  gap: 2,                            // Gap between cells
  offsetX: 20,                       // X offset (optional)
  offsetY: 20,                       // Y offset (optional)
  backgroundColor: '#f0f0f0',        // Background color (optional)
  defaultConstraints: {              // What marks are allowed
    allowedMarkTypes: ['number', 'checkbox'],
    maxMarks: 1,                     // Max marks per cell
    numberRange: [1, 50],            // For number marks (optional)
    canUnmark: true,                 // Can marks be removed (optional)
  },
}
```

#### Image Overlay Layout

```typescript
{
  type: 'image-overlay',
  imageSrc: '/path/to/image.png',
  imageWidth: 800,
  imageHeight: 600,
  maintainAspectRatio: true,
  hotspots: [                        // Manually defined hotspots
    {
      id: 'region-1',
      shape: 'rectangle',
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      constraints: {
        allowedMarkTypes: ['color'],
        maxMarks: 1,
      },
      marks: [],
    },
    // ... more hotspots
  ],
}
```

### Dice Pools

```typescript
dicePools: [
  {
    id: 'main-pool',
    name: 'Player Dice',
    dice: [
      { id: 'die-1', type: 'd6', locked: false },
      { id: 'die-2', type: 'd6', locked: false },
      { id: 'die-3', type: 'd8', locked: false },
    ],
  },
]
```

### Custom Dice

```typescript
customDice: [
  {
    id: 'action-die',
    name: 'Action Die',
    faces: [
      { value: 'Move', symbol: '🏃', weight: 2 },
      { value: 'Build', symbol: '🏗️', weight: 2 },
      { value: 'Trade', symbol: '💱', weight: 1 },
      { value: 'Wild', symbol: '⭐', weight: 1 },
    ],
  },
]
```

### Card Decks

```typescript
decks: [
  {
    id: 'exploration-deck',
    name: 'Exploration Cards',
    cards: [
      {
        id: 'card-1',
        fields: [
          { name: 'Number', type: 'number', value: 5 },
          { name: 'Action', type: 'symbol', value: '🚀' },
          { name: 'Color', type: 'color', value: '#3b82f6' },
        ],
      },
      // ... more cards
    ],
    drawPile: [...],  // Initially same as cards
    discardPile: [],
  },
]
```

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Redo
- `1-9`: Switch to sheet 1-9
- Tool selection shortcuts can be customized

## 🎨 Styling & Theming

The engine uses Tailwind CSS. Customize colors, spacing, and appearance by:

1. Modifying the Tailwind config (`tailwind.config.js`)
2. Updating component styles in `src/components/`
3. Changing the color palette in game configs

## 🏗 Architecture

```
src/
├── types.ts              # TypeScript type definitions
├── gameState.tsx         # State management with React Context
├── components/
│   ├── Mark.tsx          # Mark rendering
│   ├── Hotspot.tsx       # Hotspot rendering & interaction
│   ├── Sheet.tsx         # Sheet layout rendering
│   ├── ToolPanel.tsx     # Tool selection UI
│   ├── DicePanel.tsx     # Dice rolling UI
│   └── CardPanel.tsx     # Card/deck management UI
├── games/
│   ├── yahtzee.ts        # Example: Simple game
│   └── spaceExpedition.ts # Example: Medium complexity
└── App.tsx               # Main app component
```

## 🚧 Development

### Build

```bash
npm run build
```

### Type Check

```bash
npx tsc --noEmit
```

## 📦 Tech Stack

- **React 18+**: UI framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **SVG**: Vector graphics for marks

## 🎯 Philosophy

This engine prioritizes:

1. **Developer Experience**: Simple, intuitive API - create games in minutes
2. **Player Experience**: Fast, responsive, intuitive interactions
3. **Flexibility**: Support any roll-and-write game mechanic
4. **Type Safety**: Comprehensive TypeScript types prevent bugs
5. **Performance**: Smooth 60fps interactions even with complex games

## 📝 License

MIT License

## 🐛 Known Limitations

- No automatic rules enforcement (developers must implement)
- No automatic scoring calculation (can be added per-game)
- No multiplayer networking (local play only)
- No user accounts or cloud storage

These are intentional design decisions to keep the engine focused and lightweight.

## 💡 Tips for Game Developers

### Performance

- Keep grid sizes reasonable (<50x50)
- Use image overlays for complex artwork
- Limit marks per hotspot to 3 or fewer for clarity

### UX Best Practices

- Make touch targets at least 44x44px
- Use contrasting colors for marks on backgrounds
- Provide clear visual feedback for interactions
- Test on mobile devices early and often

### Debugging

- Enable `showHotspotBorders` in Sheet component to visualize hotspots
- Check browser console for state management logs
- Use React DevTools to inspect component state

## 🌟 Credits

Built with inspiration from amazing roll-and-write games:
- Yahtzee
- Welcome to the Moon
- Railroad Ink
- Cartographers
- Fleet the Dice Game
- Ganz Schön Clever
- Twilight Inscription

---

**Happy Game Creating!** 🎲📝
