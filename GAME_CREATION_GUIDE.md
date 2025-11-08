# Game Creation Guide

This guide will walk you through creating your own roll-and-write games using the engine.

## Table of Contents

1. [Understanding the Basics](#understanding-the-basics)
2. [Creating a Simple Game](#creating-a-simple-game)
3. [Adding Complexity](#adding-complexity)
4. [Best Practices](#best-practices)
5. [Common Patterns](#common-patterns)

## Understanding the Basics

### What is a Roll-and-Write Game?

Roll-and-write games are board games where players:
1. Roll dice or flip cards (randomization)
2. Mark their game sheets based on results
3. Follow rules about where and what to mark
4. Score points based on their markings

Examples: Yahtzee, Welcome to the Moon, Cartographers, Railroad Ink

### Core Components

Every game needs:
- **Sheets**: Where players mark their choices
- **Randomization**: Dice and/or cards
- **Mark Types**: How players interact with sheets
- **Rules**: What marks are allowed where (you implement)

## Creating a Simple Game

Let's create a simple number-marking game step by step.

### Step 1: Create the Game File

Create `src/games/my-game.ts`:

```typescript
import type { GameConfig, DieInstance } from '../types';

// Helper to create dice
const createDice = (count: number, sides: 6 | 8 | 10 | 12 | 20): DieInstance[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `die-${i + 1}`,
    dieConfig: {
      id: `d${sides}-${i + 1}`,
      type: 'standard',
      sides,
    },
    locked: false,
    modified: false,
  }));
};

export const myGameConfig: GameConfig = {
  name: 'My First Game',
  description: 'A simple roll-and-write game',

  sheets: [
    {
      id: 'main-sheet',
      name: 'Game Sheet',
      layout: {
        type: 'grid',
        rows: 5,
        columns: 5,
        cellWidth: 60,
        cellHeight: 60,
        gap: 2,
        allowedMarkTypes: ['number'],
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Game Dice',
      dice: createDice(2, 6), // Two six-sided dice
    },
  ],
};
```

### Step 2: Add to App

Edit `src/App.tsx`:

```typescript
import { myGameConfig } from './games/my-game';

// Add to games array
const games: GameConfig[] = [
  yahtzeeConfig,
  welcomeToTheMoonConfig,
  myGameConfig, // Add your game
];
```

### Step 3: Run and Test

```bash
npm run dev
```

You now have a working game with a 5×5 grid and 2 dice!

## Adding Complexity

### Multiple Mark Types

Allow different mark types in different areas:

```typescript
sheets: [
  {
    id: 'main-sheet',
    name: 'Game Sheet',
    layout: {
      type: 'grid',
      rows: 5,
      columns: 5,
      cellWidth: 80,
      cellHeight: 80,
      gap: 2,
      allowedMarkTypes: ['number', 'checkbox', 'color'],
    },
  },
],
```

### Custom Color Palette

Define your game's color scheme:

```typescript
export const myGameConfig: GameConfig = {
  name: 'My Game',
  // ...
  colorPalette: [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
  ],
};
```

### Multiple Sheets

Create games with several sheets:

```typescript
sheets: [
  {
    id: 'sheet-1',
    name: 'Resource Track',
    layout: {
      type: 'grid',
      rows: 1,
      columns: 20,
      cellWidth: 40,
      cellHeight: 40,
      allowedMarkTypes: ['checkbox'],
    },
  },
  {
    id: 'sheet-2',
    name: 'Scoring Grid',
    layout: {
      type: 'grid',
      rows: 10,
      columns: 10,
      cellWidth: 50,
      cellHeight: 50,
      allowedMarkTypes: ['number', 'color'],
    },
  },
],
```

### Card Decks

Add a card deck to your game:

```typescript
import { generateId, shuffle } from '../utils/helpers';
import type { Card } from '../types';

const createGameDeck = (): Card[] => {
  const cards: Card[] = [];

  // Create 20 cards with random values
  for (let i = 1; i <= 20; i++) {
    cards.push({
      id: generateId(),
      fields: [
        { name: 'value', type: 'number', value: i },
        { name: 'bonus', type: 'text', value: i % 5 === 0 ? 'BONUS' : '' },
      ],
    });
  }

  return cards;
};

// In your config:
decks: [
  {
    id: 'main-deck',
    name: 'Action Cards',
    cards: createGameDeck(),
    drawPile: shuffle(createGameDeck()),
    discardPile: [],
  },
],
```

### Custom Dice

Create dice with symbols instead of numbers:

```typescript
import type { CustomDie } from '../types';

const createActionDie = (): CustomDie => ({
  id: 'action-die',
  type: 'custom',
  faces: [
    { value: 'move', symbol: '→', display: '→' },
    { value: 'build', symbol: '🔨', display: '🔨' },
    { value: 'trade', symbol: '💰', display: '💰' },
    { value: 'attack', symbol: '⚔️', display: '⚔️' },
    { value: 'defend', symbol: '🛡️', display: '🛡️' },
    { value: 'wild', symbol: '⭐', display: '⭐' },
  ],
});

// Use in dice pool:
dicePools: [
  {
    id: 'action-pool',
    name: 'Action Dice',
    dice: [{
      id: 'die-1',
      dieConfig: createActionDie(),
      locked: false,
      modified: false,
    }],
  },
],
```

## Best Practices

### 1. Start Simple

Begin with a basic grid and one mark type. Add complexity gradually.

### 2. Use Meaningful IDs

```typescript
// Good
id: 'upper-section-ones'

// Bad
id: 'cell-1'
```

### 3. Configure Cell Sizes for Readability

```typescript
// Good for number marks
cellWidth: 60,
cellHeight: 60,

// Good for checkboxes
cellWidth: 44,  // Minimum touch target
cellHeight: 44,
```

### 4. Test on Mobile

Always test touch interactions:
- Are tap targets large enough? (minimum 44×44px)
- Does the layout fit on phone screens?
- Can users see dice results while marking sheets?

### 5. Balance Mark Types

Don't mix too many mark types in one area:

```typescript
// Good
allowedMarkTypes: ['number']

// Harder to use
allowedMarkTypes: ['number', 'checkbox', 'color', 'circle', 'text']
```

## Common Patterns

### Pattern 1: Yahtzee-Style Scoring

Single column grid with different sections:

```typescript
{
  type: 'grid',
  rows: 13,
  columns: 1,
  cellWidth: 200,
  cellHeight: 50,
  allowedMarkTypes: ['number'],
}
```

### Pattern 2: Bingo Card

Square grid with numbers:

```typescript
{
  type: 'grid',
  rows: 5,
  columns: 5,
  cellWidth: 60,
  cellHeight: 60,
  gap: 2,
  allowedMarkTypes: ['number', 'checkbox'],
}
```

### Pattern 3: Resource Tracker

Linear track for counting resources:

```typescript
{
  type: 'grid',
  rows: 1,
  columns: 20,
  cellWidth: 40,
  cellHeight: 60,
  allowedMarkTypes: ['checkbox', 'circle'],
}
```

### Pattern 4: Territory Map

Grid where players claim areas with colors:

```typescript
{
  type: 'grid',
  rows: 10,
  columns: 10,
  cellWidth: 50,
  cellHeight: 50,
  allowedMarkTypes: ['color'],
}
```

## Advanced: Custom Game Logic

### Adding Score Calculation

Create a component that calculates scores:

```typescript
// In your game file
export const calculateScore = (marks: Mark[]): number => {
  let score = 0;

  marks.forEach(mark => {
    if (mark.type === 'number') {
      score += mark.value;
    }
  });

  return score;
};
```

### Conditional Hotspot Enabling

You can add logic to enable hotspots based on game state by extending the GameEngine component.

### Custom Validation

Add rules about where marks can be placed by wrapping the `handleHotspotClick` logic.

## Examples

### Complete Example: Simple Number Grid Game

```typescript
import type { GameConfig, DieInstance } from '../types';

const createDice = (count: number): DieInstance[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `die-${i + 1}`,
    dieConfig: {
      id: `d6-${i + 1}`,
      type: 'standard',
      sides: 6,
    },
    locked: false,
    modified: false,
  }));
};

export const numberGridConfig: GameConfig = {
  name: 'Number Grid',
  description: 'Fill the grid with dice results',

  sheets: [
    {
      id: 'grid',
      name: 'Number Grid',
      layout: {
        type: 'grid',
        rows: 6,
        columns: 6,
        cellWidth: 70,
        cellHeight: 70,
        gap: 3,
        offsetX: 10,
        offsetY: 10,
        allowedMarkTypes: ['number'],
        backgroundColor: '#F3F4F6',
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Dice',
      dice: createDice(3),
    },
  ],
};
```

## Next Steps

1. Create your game configuration
2. Test it thoroughly
3. Add custom scoring logic if needed
4. Share your game!

## Need Help?

- Check the `types/index.ts` file for all available options
- Look at the example games in `src/games/`
- Review the main README for API documentation

Happy game creating! 🎲
