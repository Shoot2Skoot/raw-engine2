/**
 * Yahtzee - Simple roll-and-write game example
 */

import type { GameConfig } from '../types';
import { createStandardDie } from '../types';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - Roll 5 dice and fill your scorecard',
  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Scorecard',
      layout: {
        type: 'grid',
        rows: 13,
        columns: 1,
        cellSize: 80,
        gap: 4,
        offsetX: 20,
        offsetY: 20,
        allowedMarks: ['number'],
      },
      hotspots: [], // Will be auto-generated
    },
  ],
  diceDefinitions: [createStandardDie('d6')],
  defaultTools: ['number'],
  symbolPalette: [],
  colorPalettes: [],
};
