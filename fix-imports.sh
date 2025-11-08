#!/bin/bash

# Fix MarkRenderer.tsx
sed -i 's/import {$/import type {/' src/components/MarkRenderer.tsx

# Fix Sheet.tsx
sed -i 's/import { Sheet as SheetType }/import type { Sheet as SheetType }/' src/components/Sheet.tsx

# Fix ToolPalette.tsx
sed -i 's/import { MarkType }/import type { MarkType }/' src/components/ToolPalette.tsx

# Fix DicePool.tsx
sed -i 's/import { DicePool as DicePoolType, Die as DieType }/import type { DicePool as DicePoolType, Die as DieType }/' src/components/DicePool.tsx

# Fix DeckDisplay.tsx
sed -i 's/import { Deck }/import type { Deck }/' src/components/DeckDisplay.tsx
sed -i 's/Card as CardIcon/CreditCard/' src/components/DeckDisplay.tsx

# Fix games/yahtzee.ts
sed -i 's/import { GameConfig, NumericDie }/import type { GameConfig, NumericDie }/' src/games/yahtzee.ts
