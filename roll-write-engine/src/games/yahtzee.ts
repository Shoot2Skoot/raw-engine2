/**
 * Yahtzee Game Configuration
 * A simple example demonstrating grid layout and number marking
 */

import type { GameConfig } from '../types';

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
        offsetX: 20,
        offsetY: 20,
        backgroundColor: '#f8fafc',
        defaultConstraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          numberRange: [0, 50],
          canUnmark: true,
        },
      },
    },
  ],
  dicePools: [
    {
      id: 'main-dice',
      name: 'Yahtzee Dice',
      dice: [
        { id: 'die-1', type: 'd6', locked: false },
        { id: 'die-2', type: 'd6', locked: false },
        { id: 'die-3', type: 'd6', locked: false },
        { id: 'die-4', type: 'd6', locked: false },
        { id: 'die-5', type: 'd6', locked: false },
      ],
    },
  ],
  defaultTool: {
    type: 'number',
    isPermanent: true,
    value: 0,
  },
};
