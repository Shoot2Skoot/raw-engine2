/**
 * Yahtzee Game Configuration
 * Simple roll-and-write game demonstrating basic grid layout
 */

import type { GameConfig, DicePool, DieInstance, StandardDie } from '../../engine/types';
import { generateIds } from '../../engine/utils';

// Create 5 standard d6 dice
const diceIds = generateIds(5, 'die');
const standardD6: StandardDie = {
  id: 'standard-d6',
  type: 'd6',
  color: '#ffffff',
};

const dice: DieInstance[] = diceIds.map((id) => ({
  id,
  dieDefinitionId: standardD6.id,
  currentValue: null,
  isLocked: false,
}));

const yahtzeePool: DicePool = {
  id: 'yahtzee-pool',
  name: 'Yahtzee Dice',
  dice,
  maxRerolls: 3,
  currentRerolls: 0,
};

export const yahtzeeConfig: GameConfig = {
  metadata: {
    name: 'Yahtzee',
    version: '1.0.0',
    description: 'Classic dice game where you roll 5 dice and fill in a scorecard',
    complexity: 'beginner',
    minPlayers: 1,
    maxPlayers: 4,
    playTime: '30 minutes',
  },

  sheets: {
    sheets: [
      {
        id: 'yahtzee-sheet',
        name: 'Score Card',
        layout: {
          type: 'grid',
          rows: 13,
          columns: 1,
          cellSize: 80,
          gap: 4,
          startPosition: { x: 40, y: 40 },
          defaultConstraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            numberRange: { min: 0, max: 50 },
            canUnmark: true,
          },
        },
        regions: [
          {
            id: 'upper-section',
            name: 'Upper Section',
            hotspotIds: [], // Will be filled by grid cells 0-5
            backgroundColor: '#f0f9ff',
          },
          {
            id: 'lower-section',
            name: 'Lower Section',
            hotspotIds: [], // Will be filled by grid cells 6-12
            backgroundColor: '#fefce8',
          },
        ],
        metadata: {
          rowLabels: [
            'Aces (1s)',
            'Twos (2s)',
            'Threes (3s)',
            'Fours (4s)',
            'Fives (5s)',
            'Sixes (6s)',
            '3 of a Kind',
            '4 of a Kind',
            'Full House',
            'Small Straight',
            'Large Straight',
            'Yahtzee',
            'Chance',
          ],
        },
      },
    ],
    initialSheetId: 'yahtzee-sheet',
  },

  dice: {
    standardDice: [standardD6],
    pools: [yahtzeePool],
    enableHistory: true,
    maxHistorySize: 10,
  },

  autoSave: {
    enabled: true,
    storageKey: 'yahtzee-save',
    debounceMs: 500,
  },

  enableHistory: true,
  maxHistorySize: 50,
};
