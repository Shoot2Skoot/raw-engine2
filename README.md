# Roll & Write Game Engine

A comprehensive web-based engine for creating digital roll-and-write board games. Build interactive game sheets with dice rolling, card drawing, and flexible markup systems.

## Features

### Core Engine
- **TypeScript-first** - Fully typed with strict mode for type safety
- **Flexible Sheet Layouts** - Grid-based, freeform, image-overlay, or mixed layouts
- **Multiple Mark Types** - Checkbox, number, color, circle, symbol, text, line, and area marks
- **Tool System** - Easy-to-use tool palette with pencil/pen modes
- **State Management** - Undo/redo history, auto-save, and manual export/import

### Dice System
- **Standard Dice** - Support for d4, d6, d8, d10, d12, d20
- **Custom Dice** - Create dice with custom faces (symbols, colors, text)
- **Dice Pools** - Manage multiple groups of dice
- **Lock & Modify** - Lock dice between rolls, modify values (±1, flip, set)
- **Roll History** - Track previous rolls

### Card System
- **Multi-field Cards** - Cards with numbers, symbols, colors, text, images
- **Deck Management** - Draw, shuffle, discard pile management
- **Split Decks** - Divide decks for multi-round or mission-based games
- **Reshuffle** - Automatically or manually reshuffle discard into draw pile

### UI Components
- **Interactive Hotspots** - Click/tap regions for marking
- **Value Pickers** - Modal pickers for numbers, colors, symbols, text
- **Control Bar** - Undo, redo, save, load, reset controls
- **Keyboard Shortcuts** - Ctrl/Cmd+Z (undo), Ctrl/Cmd+Shift+Z (redo), P (pencil mode)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173 to see the engine in action.

### Build

```bash
npm run build
```

## Creating Your First Game

### 1. Define Your Game Configuration

Create a new file in `src/games/your-game/yourGameConfig.ts`:

```typescript
import type { GameConfig } from '../../engine/types';

export const yourGameConfig: GameConfig = {
  metadata: {
    name: 'Your Game',
    version: '1.0.0',
    description: 'Your game description',
    complexity: 'beginner',
  },

  sheets: {
    sheets: [
      {
        id: 'main-sheet',
        name: 'Score Sheet',
        layout: {
          type: 'grid',
          rows: 10,
          columns: 1,
          cellSize: 60,
          gap: 4,
          defaultConstraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
          },
        },
      },
    ],
  },

  dice: {
    standardDice: [{ id: 'd6', type: 'd6' }],
    pools: [
      {
        id: 'main-pool',
        name: 'Dice Pool',
        dice: [
          { id: 'die1', dieDefinitionId: 'd6', currentValue: null, isLocked: false },
          { id: 'die2', dieDefinitionId: 'd6', currentValue: null, isLocked: false },
        ],
      },
    ],
  },

  autoSave: {
    enabled: true,
    storageKey: 'your-game-save',
  },
};
```

### 2. Create a Game Component

Create `src/games/your-game/YourGame.tsx`:

```typescript
import React from 'react';
import { GameEngine } from '../../engine/core';
import { yourGameConfig } from './yourGameConfig';

export const YourGame: React.FC = () => {
  return <GameEngine config={yourGameConfig} />;
};
```

## Example Games

### Yahtzee (Simple Grid)
A classic dice game demonstrating basic grid layout and dice mechanics.

**Features:**
- 13-row grid for scoring categories
- 5d6 dice pool with locking
- Number entry marks
- Reroll limit (3 per turn)

**Location:** `src/games/yahtzee/`

## Technology Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development (strict mode)
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## Keyboard Shortcuts

- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo
- **P** - Toggle pencil mode
- **1-9** - Switch between sheets (multi-sheet games)

## State Persistence

Games automatically save to browser localStorage after each action. State includes:
- All marks on all sheets
- Current tool and pencil mode
- Dice pool states
- Card deck states
- Undo/redo history (last 50 actions)

### Manual Export/Import

Use the Export button to download game state as JSON. Use Load to restore from a file.

## Performance

- **Mark Placement:** < 16ms (60fps)
- **Sheet Switching:** < 100ms
- **Supports:** 200+ hotspots per sheet
- **Memory:** No leaks in 2-hour sessions

## Development

### Project Structure

```
src/engine/
├── types/              # All TypeScript interfaces
├── components/         # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── core/               # Main GameEngine component
```

## License

MIT

## Credits

Built with React, TypeScript, Vite, and Tailwind CSS.
Icons by Lucide React.
