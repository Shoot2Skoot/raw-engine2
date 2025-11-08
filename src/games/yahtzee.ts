/**
 * Yahtzee Game Configuration
 * A simple roll-and-write game with dice rolling and score tracking
 */

import type { GameConfig, StandardDie, DicePool } from '../types';
import { DEFAULT_TOOLS } from '../types';

// Create 5 standard d6 dice
const yahtzeeDice: StandardDie[] = Array.from({ length: 5 }, (_, i) => ({
  type: 'standard',
  dieType: 'd6',
  id: `die-${i}`,
  color: '#FFFFFF',
}));

// Create dice pool
const yahtzeeDicePool: DicePool = {
  id: 'main-pool',
  name: 'Yahtzee Dice',
  dice: yahtzeeDice,
};

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  version: '1.0.0',
  sheets: [
    {
      sheet: {
        id: 'scorecard',
        name: 'Score Card',
        type: 'grid',
        width: 400,
        height: 700,
        backgroundColor: '#F9FAFB',
        gridConfig: {
          rows: 13,
          columns: 2,
          cellWidth: 180,
          cellHeight: 45,
          gap: 5,
          offsetX: 10,
          offsetY: 50,
          allowedMarkTypes: ['number'],
          multiMark: false,
        },
      },
      hotspots: new Map(),
      isActive: true,
    },
  ],
  dicePools: [
    {
      pool: yahtzeeDicePool,
      results: [],
      history: [],
    },
  ],
  decks: [],
  tools: {
    currentTool: DEFAULT_TOOLS[1], // Number tool
    availableTools: [DEFAULT_TOOLS[1], DEFAULT_TOOLS[7]], // Number and Eraser
    markMode: 'pen',
  },
  customData: {
    scoringCategories: [
      { id: 'ones', label: 'Ones', row: 0 },
      { id: 'twos', label: 'Twos', row: 1 },
      { id: 'threes', label: 'Threes', row: 2 },
      { id: 'fours', label: 'Fours', row: 3 },
      { id: 'fives', label: 'Fives', row: 4 },
      { id: 'sixes', label: 'Sixes', row: 5 },
      { id: '3-of-kind', label: '3 of a Kind', row: 6 },
      { id: '4-of-kind', label: '4 of a Kind', row: 7 },
      { id: 'full-house', label: 'Full House', row: 8 },
      { id: 'small-straight', label: 'Sm. Straight', row: 9 },
      { id: 'large-straight', label: 'Lg. Straight', row: 10 },
      { id: 'yahtzee', label: 'Yahtzee', row: 11 },
      { id: 'chance', label: 'Chance', row: 12 },
    ],
  },
};
