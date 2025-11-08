/**
 * Yahtzee game definition
 *
 * A simple roll-and-write game demonstrating the engine's grid layout capabilities
 */

import type { GameDefinition } from '../types';
import {
  LayoutType,
  MarkType,
  StandardDieType,
} from '../types';

export const yahtzeeGame: GameDefinition = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description:
    'Classic dice game - roll 5 dice up to 3 times and fill in your scorecard',

  sheets: [
    {
      id: 'scorecard',
      name: 'Score Card',
      layout: {
        type: LayoutType.Grid,
        rows: 13,
        columns: 2,
        cellWidth: 120,
        cellHeight: 40,
        gap: 2,
        offset: { x: 0, y: 0 },
        allowedMarkTypes: [MarkType.Number],
        showGridLines: true,
        borderColor: '#9ca3af',
      },
      style: {
        backgroundColor: '#ffffff',
        padding: 20,
      },
    },
  ],

  dice: [
    {
      id: 'main-pool',
      name: 'Dice',
      dice: [
        {
          id: 'die-1',
          type: StandardDieType.D6,
          color: '#ef4444',
        },
        {
          id: 'die-2',
          type: StandardDieType.D6,
          color: '#3b82f6',
        },
        {
          id: 'die-3',
          type: StandardDieType.D6,
          color: '#22c55e',
        },
        {
          id: 'die-4',
          type: StandardDieType.D6,
          color: '#eab308',
        },
        {
          id: 'die-5',
          type: StandardDieType.D6,
          color: '#8b5cf6',
        },
      ],
    },
  ],

  metadata: {
    category: 'simple',
    players: '1+',
    complexity: 'beginner',
    implementationTime: '30 minutes',
  },
};
