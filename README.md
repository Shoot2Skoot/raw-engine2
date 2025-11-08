# Roll-and-Write Game Engine

A comprehensive web-based engine for creating interactive digital versions of roll-and-write board games. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Engine
- **Flexible Sheet System**: Grid-based, image-based, tracks, trees, and mixed layouts
- **Rich Mark Types**: Checkboxes, numbers, colors, circles, symbols, text, lines, and fills
- **Dice System**: Standard dice (d4-d20) and custom dice with any face configuration
- **Card Management**: Full deck system with shuffling, drawing, discarding, and reshuffling
- **Undo/Redo**: Complete action history with keyboard shortcuts
- **Auto-Save**: LocalStorage integration for persistent game state
- **Multi-Sheet Support**: Games can have multiple interconnected sheets

### Developer Experience
- **TypeScript First**: Fully typed with strict mode
- **Simple Configuration**: JSON-based game definitions
- **Quick Prototyping**: Create a simple game in under 30 minutes
- **Extensible**: Hook into custom game logic wherever needed

### Player Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch-Friendly**: Optimized for both mouse and touch interactions
- **Keyboard Shortcuts**: Power user features for faster gameplay
- **Visual Feedback**: Clear, intuitive UI with instant response

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Creating Your First Game

### 1. Define Game Configuration

```typescript
import type { GameConfig } from './types';
import { createStandardDie } from './types';

export const myGame: GameConfig = {
  id: 'my-game',
  name: 'My First Roll-and-Write',
  description: 'A simple dice game',

  sheets: [{
    id: 'main-sheet',
    name: 'Score Sheet',
    layout: {
      type: 'grid',
      rows: 10,
      columns: 3,
      cellSize: 60,
      gap: 4,
      allowedMarks: ['number', 'checkbox'],
    },
    hotspots: [], // Auto-generated for grid layouts
  }],

  diceDefinitions: [createStandardDie('d6')],
  defaultTools: ['number', 'checkbox'],
};
```

### 2. Add to App

```typescript
import { myGame } from './examples/myGame';

const games = [myGame, yahtzeeConfig, welcomeToTheMoonConfig];
```

### 3. Run and Play!

```bash
npm run dev
```

## Architecture

### Project Structure

```
src/
  types/          # TypeScript type definitions
    marks.ts      # Mark types (checkbox, number, etc.)
    sheet.ts      # Sheet and layout types
    dice.ts       # Dice and pool types
    cards.ts      # Card and deck types
    game.ts       # Main game state types

  lib/            # Core game engine logic
    marks.ts      # Mark creation and management
    dice.ts       # Dice rolling utilities
    cards.ts      # Deck management utilities
    hotspots.ts   # Hotspot generation
    gameState.ts  # State management and persistence

  components/     # React components
    sheet/        # Sheet rendering
    dice/         # Dice UI
    cards/        # Card/deck UI
    tools/        # Tool palette
    GameContainer.tsx  # Main game orchestrator

  hooks/          # Custom React hooks
    useGameState.ts    # Game state management hook

  examples/       # Example game configurations
    yahtzee.ts
    welcomeToTheMoon.ts
```

### Key Concepts

**Sheets**: Game boards or scorecards that players mark up

**Hotspots**: Interactive regions on sheets where marks can be placed

**Marks**: Player-placed indicators (numbers, checkboxes, fills, etc.)

**Tools**: The currently selected marking instrument

**State**: Complete game situation including marks, dice, cards, history

## Example Games

### Yahtzee (Simple)
- Single grid sheet with 13 scoring rows
- 5 six-sided dice
- Number marking only
- Demonstrates basic grid layout

### Welcome to the Moon (Medium)
- Multiple sheets per mission
- Card deck with number + symbol combinations
- Mixed mark types (numbers and checkboxes)
- Demonstrates card mechanics

## Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `1-9`: Switch between sheets
- `P`: Toggle pencil mode

## Browser Support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari (tablet and phone)
- Android Chrome (tablet and phone)

## What's Implemented

This roll-and-write game engine includes:

### Complete Foundation
- ✅ Full TypeScript type system with strict mode
- ✅ Comprehensive game state management
- ✅ Auto-save to localStorage
- ✅ Export/import game state to JSON files
- ✅ Undo/redo with full action history
- ✅ Keyboard shortcuts

### Sheet System
- ✅ Grid layouts with auto-generated hotspots
- ✅ Image-based layouts with custom hotspots
- ✅ Resource track layouts
- ✅ Multi-sheet navigation
- ✅ Mixed layout support

### Mark Types
- ✅ Checkbox marks (empty/checked/crossed)
- ✅ Number marks with configurable values
- ✅ Color fill marks
- ✅ Circle marks (empty/half/full)
- ✅ Symbol marks
- ✅ Text marks
- ✅ Fill marks with opacity
- ✅ Pencil vs pen mode for temporary marks

### Dice System
- ✅ Standard dice (d4, d6, d8, d10, d12, d20)
- ✅ Custom dice with any face configuration
- ✅ Dice pools with multiple dice
- ✅ Lock/unlock individual dice
- ✅ Reroll mechanics
- ✅ Dice roll history

### Card System
- ✅ Multi-field card definitions
- ✅ Deck creation with any number of cards
- ✅ Shuffle functionality
- ✅ Draw from deck
- ✅ Discard pile management
- ✅ Reshuffle discard into deck
- ✅ Multiple deck support

### UI Components
- ✅ Interactive sheet renderer with SVG
- ✅ Tool palette for selecting mark types
- ✅ Dice pool display with visual feedback
- ✅ Card/deck viewer
- ✅ Game container with navigation
- ✅ Responsive design for mobile/tablet/desktop

### Example Games
- ✅ Yahtzee configuration
- ✅ Welcome to the Moon configuration

## Technical Decisions

- **React 18**: Modern hooks-based architecture
- **TypeScript Strict Mode**: Maximum type safety
- **Vite**: Fast development and optimized builds
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Consistent icon system
- **SVG Rendering**: Scalable, print-friendly graphics
- **LocalStorage**: Client-side persistence

## License

MIT

## Credits

Built with React, TypeScript, Vite, Tailwind CSS, and Lucide React.
