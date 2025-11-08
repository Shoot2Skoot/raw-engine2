# Roll & Write Game Engine

A comprehensive, type-safe web-based engine for creating digital roll-and-write board games. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Flexible Sheet System**: Grid layouts, image overlays, freeform hotspots, and mixed layouts
- **Rich Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, and lines
- **Dice Mechanics**: Standard dice (d4-d20) and fully customizable dice with symbols
- **Card System**: Complete deck management with shuffling, drawing, and discard piles
- **Undo/Redo**: Full history tracking with keyboard shortcuts
- **Auto-Save**: Automatic localStorage persistence
- **Mobile-Friendly**: Touch-optimized for tablets and phones
- **Type-Safe**: Strict TypeScript with comprehensive type definitions

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build

```bash
npm run build
```

### Type Check

```bash
npm run lint
```

## Creating Your First Game

### Simple Example: Yahtzee

```typescript
import { GameConfig } from '../types';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',

  sheets: [{
    id: 'yahtzee-sheet',
    name: 'Score Sheet',
    layout: {
      type: 'grid',
      rows: 13,
      cols: 1,
      cellSize: 80,
      gap: 4,
      defaultConstraints: {
        allowedMarkTypes: ['number'],
        maxMarks: 1,
        numberRange: { min: 0, max: 50 },
      },
    },
  }],

  dicePools: [{
    id: 'yahtzee-dice',
    label: 'Yahtzee Dice',
    dice: [
      { id: 'die-1', type: 'd6', color: '#ef4444' },
      { id: 'die-2', type: 'd6', color: '#f59e0b' },
      { id: 'die-3', type: 'd6', color: '#10b981' },
      { id: 'die-4', type: 'd6', color: '#3b82f6' },
      { id: 'die-5', type: 'd6', color: '#8b5cf6' },
    ],
    results: [],
  }],

  tools: [{
    type: 'number',
    label: 'Number',
    icon: 'Hash',
    config: { numberRange: { min: 0, max: 50 } },
  }],
};
```

### Switch Games in main.tsx

```typescript
import { yahtzeeConfig } from './games/yahtzee';
import { cartographersConfig } from './games/cartographers';
import { welcomeToTheMoonConfig } from './games/welcome-to-the-moon';

// Change config to switch games
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App config={yahtzeeConfig} />
  </React.StrictMode>
);
```

## Game Configuration Guide

### Sheet Layouts

#### Grid Layout

Perfect for structured games like Yahtzee, Qwixx, or Bingo.

```typescript
{
  type: 'grid',
  rows: 10,
  cols: 10,
  cellSize: 50,    // pixels
  gap: 2,          // pixels between cells
  x: 20,           // offset from left
  y: 20,           // offset from top
  backgroundColor: '#fef3c7',
  defaultConstraints: {
    allowedMarkTypes: ['number', 'color'],
    maxMarks: 1,
    canUnmark: true,
  },
  cellLabels: {
    '0-0': 'Label for row 0, col 0',
  },
}
```

#### Image Overlay Layout

For games that need to maintain artwork from the physical version.

```typescript
{
  type: 'image-overlay',
  imageUrl: '/path/to/image.png',
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  hotspots: [
    {
      id: 'hotspot-1',
      shape: 'rectangle',
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      constraints: {
        allowedMarkTypes: ['checkbox'],
        maxMarks: 1,
      },
    },
    {
      id: 'hotspot-2',
      shape: 'circle',
      cx: 200,
      cy: 200,
      r: 30,
      constraints: {
        allowedMarkTypes: ['color'],
      },
    },
  ],
}
```

#### Mixed Layout

Combine multiple layout types on one sheet.

```typescript
{
  type: 'mixed',
  width: 900,
  height: 700,
  regions: [
    {
      type: 'grid',
      rows: 5,
      cols: 5,
      x: 50,
      y: 50,
      // ... grid config
    },
    {
      type: 'grid',
      rows: 3,
      cols: 3,
      x: 500,
      y: 50,
      // ... another grid
    },
  ],
}
```

### Mark Types

#### Checkbox

Three states: empty, checked, crossed.

```typescript
{
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'CheckSquare',
}
```

Click to cycle: empty → checked → crossed → empty

#### Number

Enter numeric values.

```typescript
{
  type: 'number',
  label: 'Number',
  icon: 'Hash',
  config: {
    numberRange: { min: 1, max: 100 },
  },
}
```

#### Color

Fill cells with colors.

```typescript
{
  type: 'color',
  label: 'Terrain',
  icon: 'Palette',
  config: {
    colors: [
      '#22c55e',  // Green
      '#3b82f6',  // Blue
      '#ef4444',  // Red
      '#eab308',  // Yellow
    ],
  },
}
```

#### Circle

Three states: empty, half-filled, full.

```typescript
{
  type: 'circle',
  label: 'Circle',
  icon: 'Circle',
}
```

#### Symbol

Place icons or emojis.

```typescript
{
  type: 'symbol',
  label: 'Resources',
  icon: 'Star',
  config: {
    symbols: ['⭐', '💎', '❤️', '🚀', '🌱', '💧'],
  },
}
```

#### Text

Enter custom text.

```typescript
{
  type: 'text',
  label: 'Text',
  icon: 'Type',
}
```

### Dice Configuration

#### Standard Dice

```typescript
dicePools: [{
  id: 'main-dice',
  label: 'Main Dice',
  dice: [
    { id: 'die-1', type: 'd6', color: '#ef4444' },
    { id: 'die-2', type: 'd8', color: '#10b981' },
    { id: 'die-3', type: 'd20', color: '#3b82f6' },
  ],
  results: [],
}]
```

Available types: `d4`, `d6`, `d8`, `d10`, `d12`, `d20`

#### Custom Dice

```typescript
{
  id: 'action-die',
  type: 'custom',
  label: 'Action',
  color: '#8b5cf6',
  faces: [
    { value: 'Attack', symbol: '⚔️', weight: 1 },
    { value: 'Defend', symbol: '🛡️', weight: 1 },
    { value: 'Move', symbol: '👟', weight: 2 },
    { value: 'Special', symbol: '✨', weight: 1 },
  ],
}
```

### Card Configuration

```typescript
// Define cards
const cards: Card[] = [
  {
    id: 'card-1',
    fields: [
      { name: 'number', type: 'number', value: 5 },
      { name: 'symbol', type: 'symbol', value: '🚀' },
    ],
  },
  // ... more cards
];

// Create deck
decks: [{
  id: 'main-deck',
  label: 'Main Deck',
  cards: cards,
  drawPile: cards.map(c => c.id),
  discardPile: [],
}]
```

Card field types: `number`, `text`, `symbol`, `color`, `image`

### Hotspot Constraints

Control what marks are allowed in each hotspot:

```typescript
constraints: {
  allowedMarkTypes: ['number', 'checkbox'],
  maxMarks: 1,              // undefined = unlimited
  canUnmark: true,          // can remove marks
  requireSequence: false,   // must mark in order
  isReadOnly: false,        // display only
  numberRange: { min: 1, max: 50 },
  textMaxLength: 20,
}
```

## User Interface

### Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Redo
- `1-9`: Switch to sheet 1-9

### Controls

- **Undo/Redo**: Navigate action history
- **Save**: Export game state as JSON file
- **Load**: Import saved game state
- **Reset Sheet**: Clear current sheet only
- **Reset Game**: Clear entire game (with confirmation)

### Dice Controls

- **Roll**: Roll all unlocked dice in the pool
- **Lock/Unlock**: Click individual dice to lock/unlock them
- Locked dice keep their value when re-rolling the pool

### Card Controls

- **Draw**: Draw top card from deck
- **Discard**: Move current card to discard pile
- **Shuffle**: Shuffle the draw pile
- **Reshuffle**: Combine discard pile back into draw pile and shuffle

## Architecture

### Project Structure

```
src/
├── components/
│   ├── cards/
│   │   └── CardDeck.tsx
│   ├── dice/
│   │   └── DicePool.tsx
│   ├── marks/
│   │   └── MarkRenderer.tsx
│   ├── sheet/
│   │   ├── Hotspot.tsx
│   │   └── Sheet.tsx
│   └── ui/
│       ├── ControlPanel.tsx
│       ├── SheetTabs.tsx
│       └── ToolPalette.tsx
├── games/
│   ├── yahtzee.ts
│   ├── cartographers.ts
│   └── welcome-to-the-moon.ts
├── hooks/
│   └── useGameState.tsx
├── types/
│   └── index.ts
├── utils/
│   └── gameEngine.ts
├── App.tsx
├── main.tsx
└── index.css
```

### State Management

The engine uses React Context with useReducer for state management:

- **Game State**: All marks, dice results, card positions, current sheet
- **History**: Full undo/redo stack (stores previous states)
- **Auto-Save**: Saves to localStorage after every action
- **Manual Save/Load**: Export/import as JSON files

### Type System

All types are defined in `src/types/index.ts`:

- `GameConfig`: Complete game definition
- `GameState`: Current game state
- `Sheet`: Individual game sheet
- `Mark`: Player-placed marks
- `Hotspot`: Interactive regions
- `Tool`: Available marking tools
- `DicePool`, `Deck`, `Card`: Randomization systems

## Example Games

### 1. Yahtzee (Simple)

- Single sheet with 13 cells
- 5 standard d6 dice
- Number marks only
- Perfect beginner example

### 2. Cartographers (Medium)

- 10×10 grid map
- Card deck for terrain exploration
- Color fills for terrain types
- Symbol marks for scoring

### 3. Welcome to the Moon (Complex)

- Multiple grids on one sheet
- Card deck with number + symbol fields
- Different sections for different actions
- Demonstrates mixed layouts

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## Performance

- Mark placement: <16ms (60fps)
- Sheet switching: <100ms
- Handles 200+ hotspots smoothly
- Auto-save without blocking UI

## Development

### Adding a New Game

1. Create new file in `src/games/`
2. Define `GameConfig` object
3. Export configuration
4. Import in `main.tsx`
5. Pass to `<App config={yourConfig} />`

### Creating Custom Components

The engine is designed to be extensible. You can create custom:

- Mark renderers
- Hotspot shapes
- Dice visualizations
- Card displays
- Layout types

## License

MIT

## Contributing

This is a demonstration project. Feel free to fork and extend for your own games!

## Credits

Built with:
- React 18
- TypeScript (strict mode)
- Vite
- Tailwind CSS
- Lucide React (icons)
