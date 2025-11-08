/**
 * Yahtzee Game Definition
 *
 * Simple roll-and-write game with a single sheet and 5d6
 */

import type { GameDefinition } from '../types';
import { createGridSheet } from '../lib/gameBuilder';

export const yahtzeeGame: GameDefinition = {
  id: 'yahtzee',
  name: 'Yahtzee',
  defaultTool: 'number',

  sheets: [
    {
      ...createGridSheet('yahtzee-sheet', 'Score Sheet', 13, 1, {
        cellWidth: 200,
        cellHeight: 40,
        gap: 4,
        allowedMarkTypes: ['number'],
      }),
      // Add labels to cells
      regions: [
        {
          id: 'yahtzee-sheet-grid',
          type: 'grid',
          config: {
            rows: 13,
            columns: 1,
            cellWidth: 200,
            cellHeight: 40,
            gap: 4,
          },
          constraints: {
            allowedMarkTypes: ['number'],
            maxMarks: 1,
          },
          // @ts-ignore - adding custom function for labels
          generateLabels: (row: number) => {
            const labels = [
              'Ones',
              'Twos',
              'Threes',
              'Fours',
              'Fives',
              'Sixes',
              'Three of a Kind',
              'Four of a Kind',
              'Full House',
              'Small Straight',
              'Large Straight',
              'Yahtzee',
              'Chance',
            ];
            return labels[row];
          },
        },
      ],
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Dice',
      dice: ['d6', 'd6', 'd6', 'd6', 'd6'],
    },
  ],
};
