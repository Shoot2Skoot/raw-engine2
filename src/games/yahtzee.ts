import type { GameConfig } from '../types';

/**
 * Yahtzee Game Configuration
 *
 * Classic dice game with a simple scoresheet.
 * Demonstrates basic grid layout with number marks.
 */
export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll five dice and fill in your scorecard',

  sheets: [
    {
      id: 'scorecard',
      name: 'Scorecard',
      dimensions: { width: 400, height: 800 },
      layout: {
        type: 'grid',
        grid: {
          rows: 13,
          columns: 2,
          cellSize: 60,
          gap: 4,
          startPosition: { x: 50, y: 100 },
          constraints: {
            allowedMarkTypes: ['number'],
            maxMarks: 1,
            numberRange: { min: 0, max: 999 },
            canUnmark: true,
            readonly: false,
          },
        },
      },
    },
  ],

  standardDice: [{ type: 'd6', count: 5 }],

  toolPalette: {
    availableTools: ['number'],
    numberRange: { min: 0, max: 999 },
  },
};
