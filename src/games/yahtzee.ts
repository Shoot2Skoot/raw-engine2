import type { GameConfig, NumericDie } from '../types';

/**
 * Yahtzee Game Configuration
 *
 * A classic dice game where players roll 5 dice up to 3 times per turn
 * and mark scores in different categories.
 */
export const yahtzeeConfig: GameConfig = {
  name: 'Yahtzee',

  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 13,
        columns: 1,
        cellWidth: 200,
        cellHeight: 50,
        gap: 2,
        offsetX: 10,
        offsetY: 10,
        defaultAllowedMarks: ['number'],
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      label: 'Yahtzee Dice',
      visible: true,
      dice: Array.from({ length: 5 }, (_, i) => ({
        id: `die-${i + 1}`,
        type: 'numeric',
        sides: 6,
      } as NumericDie)),
    },
  ],

  decks: [],

  defaultTool: 'number',

  colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  symbolPalette: ['⭐', '❤️', '💎', '🎯', '🏆', '🎲'],
};
