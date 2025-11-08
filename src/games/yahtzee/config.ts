/**
 * Yahtzee game configuration
 * Simple grid-based roll-and-write game
 */

import type { GameConfig } from '../../types';
import { createStandardDieConfig } from '../../engine/dice';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game with 13 scoring categories',

  sheets: [
    {
      id: 'scoresheet',
      name: 'Score Sheet',
      width: 400,
      height: 800,
      backgroundColor: '#f8fafc',

      regions: [
        // Upper Section (Ones through Sixes)
        {
          type: 'grid',
          id: 'upper-section',
          rows: 6,
          columns: 2,
          cellWidth: 150,
          cellHeight: 50,
          gap: 2,
          offsetX: 25,
          offsetY: 80,
          allowedMarkTypes: ['number'],
          borderColor: '#334155',
          borderWidth: 2,
        },

        // Bonus row
        {
          type: 'grid',
          id: 'bonus',
          rows: 1,
          columns: 2,
          cellWidth: 150,
          cellHeight: 50,
          gap: 2,
          offsetX: 25,
          offsetY: 400,
          allowedMarkTypes: ['number'],
          backgroundColor: '#fef3c7',
          borderColor: '#334155',
          borderWidth: 2,
        },

        // Lower Section
        {
          type: 'grid',
          id: 'lower-section',
          rows: 7,
          columns: 2,
          cellWidth: 150,
          cellHeight: 50,
          gap: 2,
          offsetX: 25,
          offsetY: 480,
          allowedMarkTypes: ['number'],
          borderColor: '#334155',
          borderWidth: 2,
        },
      ],
    },
  ],

  // Five standard d6 dice
  dicePools: [
    {
      id: 'main-pool',
      name: 'Dice',
      dice: [createStandardDieConfig('d6', 5)],
      results: [],
    },
  ],
};

/**
 * Score category labels for display
 */
export const YAHTZEE_CATEGORIES = {
  upper: [
    { row: 0, label: 'Aces (1s)', description: 'Sum of all 1s' },
    { row: 1, label: 'Twos (2s)', description: 'Sum of all 2s' },
    { row: 2, label: 'Threes (3s)', description: 'Sum of all 3s' },
    { row: 3, label: 'Fours (4s)', description: 'Sum of all 4s' },
    { row: 4, label: 'Fives (5s)', description: 'Sum of all 5s' },
    { row: 5, label: 'Sixes (6s)', description: 'Sum of all 6s' },
  ],
  bonus: [
    { row: 0, label: 'Bonus', description: '35 points if upper section >= 63' },
  ],
  lower: [
    { row: 0, label: '3 of a Kind', description: 'Sum of all dice' },
    { row: 1, label: '4 of a Kind', description: 'Sum of all dice' },
    { row: 2, label: 'Full House', description: '25 points' },
    { row: 3, label: 'Small Straight', description: '30 points' },
    { row: 4, label: 'Large Straight', description: '40 points' },
    { row: 5, label: 'Yahtzee', description: '50 points' },
    { row: 6, label: 'Chance', description: 'Sum of all dice' },
  ],
};
