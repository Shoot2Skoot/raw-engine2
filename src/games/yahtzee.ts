/**
 * Yahtzee Game Configuration
 * A classic dice game with simple grid-based scoring
 */

import { GameConfig } from '../types';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and fill in your score sheet',

  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 13,
        cols: 1,
        cellSize: 80,
        gap: 4,
        x: 20,
        y: 20,
        defaultConstraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          canUnmark: true,
          numberRange: { min: 0, max: 50 },
        },
        cellLabels: {
          '0-0': 'Ones',
          '1-0': 'Twos',
          '2-0': 'Threes',
          '3-0': 'Fours',
          '4-0': 'Fives',
          '5-0': 'Sixes',
          '6-0': '3 of a Kind',
          '7-0': '4 of a Kind',
          '8-0': 'Full House',
          '9-0': 'Small Straight',
          '10-0': 'Large Straight',
          '11-0': 'Yahtzee',
          '12-0': 'Chance',
        },
      },
    },
  ],

  dicePools: [
    {
      id: 'yahtzee-dice',
      label: 'Yahtzee Dice',
      dice: [
        { id: 'die-1', type: 'd6', color: '#ef4444' },
        { id: 'die-2', type: 'd6', color: '#f59e0b' },
        { id: 'die-3', type: 'd6', color: '#10b981' },
        { id: 'die-4', type: 'd6', color: '#3b82f6' },
        { id: 'die-5', type: 'd6', color: '#8b5cf6' },
      ],
      results: [],
    },
  ],

  tools: [
    {
      type: 'number',
      label: 'Number',
      icon: 'Hash',
      config: {
        numberRange: { min: 0, max: 50 },
      },
    },
  ],

  initialSheetId: 'yahtzee-sheet',
};
