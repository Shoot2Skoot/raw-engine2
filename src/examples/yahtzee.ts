/**
 * Yahtzee - Simple roll-and-write game example
 *
 * This demonstrates:
 * - Simple grid layout
 * - Number marks only
 * - Standard dice (5d6)
 * - Dice locking mechanism
 */

import type { GameConfig } from '../types';
import { createStandardDice } from '../utils/dice';
import { createDicePool } from '../utils/dice';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and score in different categories',
  defaultTool: 'number',
  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Score Sheet',
      width: 400,
      height: 800,
      regions: [
        // Upper Section
        {
          type: 'grid',
          id: 'upper-section',
          position: { x: 50, y: 50 },
          rows: 6,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Upper Section',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            allowUnmark: false,
            numberRange: [0, 30],
          },
        },
        // Bonus row
        {
          type: 'grid',
          id: 'bonus',
          position: { x: 50, y: 430 },
          rows: 1,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Bonus (if 63+)',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            numberRange: [0, 35],
          },
        },
        // Upper Total
        {
          type: 'grid',
          id: 'upper-total',
          position: { x: 50, y: 510 },
          rows: 1,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Upper Total',
          backgroundColor: '#f0f9ff',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            numberRange: [0, 105],
          },
        },
        // Lower Section
        {
          type: 'grid',
          id: 'lower-section',
          position: { x: 200, y: 50 },
          rows: 7,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Lower Section',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            allowUnmark: false,
            numberRange: [0, 50],
          },
        },
        // Lower Total
        {
          type: 'grid',
          id: 'lower-total',
          position: { x: 200, y: 510 },
          rows: 1,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Lower Total',
          backgroundColor: '#f0f9ff',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            numberRange: [0, 235],
          },
        },
        // Grand Total
        {
          type: 'grid',
          id: 'grand-total',
          position: { x: 125, y: 600 },
          rows: 1,
          columns: 1,
          cellSize: 100,
          gap: 4,
          label: 'GRAND TOTAL',
          backgroundColor: '#dbeafe',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            numberRange: [0, 375],
          },
        },
      ],
    },
  ],
  dicePools: [
    createDicePool('Yahtzee Dice', createStandardDice('d6', 5)),
  ],
};
