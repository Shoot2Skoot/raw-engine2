import { GameConfig } from '../types';

/**
 * Yahtzee - Simple grid-based game example
 *
 * Features:
 * - Single sheet with 13-row vertical grid
 * - Number marks only
 * - 5 standard d6 dice
 * - Upper section: ones, twos, threes, fours, fives, sixes
 * - Lower section: 3-of-kind, 4-of-kind, full house, sm straight, lg straight, yahtzee, chance
 */
export const yahtzeeConfig: GameConfig = {
  name: 'Yahtzee',
  version: '1.0.0',

  sheets: [
    {
      id: 'yahtzee-scorecard',
      name: 'Scorecard',
      dimensions: { width: 400, height: 800 },
      backgroundColor: '#f8f9fa',

      layout: {
        type: 'grid',
        rows: 13,
        columns: 2, // Label column + score column
        cellSize: 60,
        gap: 2,
        offset: { x: 20, y: 20 },
        backgroundColor: '#ffffff',

        defaultMarkConfig: {
          allowedTypes: ['number'],
          maxMarks: 1,
          numberMin: 0,
          numberMax: 999,
          erasable: true,
        },

        // Label column is read-only
        cellOverrides: {
          '0-0': { allowedTypes: [] }, // Ones label
          '1-0': { allowedTypes: [] }, // Twos label
          '2-0': { allowedTypes: [] }, // Threes label
          '3-0': { allowedTypes: [] }, // Fours label
          '4-0': { allowedTypes: [] }, // Fives label
          '5-0': { allowedTypes: [] }, // Sixes label
          '6-0': { allowedTypes: [] }, // 3 of a Kind label
          '7-0': { allowedTypes: [] }, // 4 of a Kind label
          '8-0': { allowedTypes: [] }, // Full House label
          '9-0': { allowedTypes: [] }, // Sm Straight label
          '10-0': { allowedTypes: [] }, // Lg Straight label
          '11-0': { allowedTypes: [] }, // Yahtzee label
          '12-0': { allowedTypes: [] }, // Chance label
        },
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Dice',
      dice: [
        { type: 'standard', dieType: 'd6', id: 'die-1', label: 'Die 1' },
        { type: 'standard', dieType: 'd6', id: 'die-2', label: 'Die 2' },
        { type: 'standard', dieType: 'd6', id: 'die-3', label: 'Die 3' },
        { type: 'standard', dieType: 'd6', id: 'die-4', label: 'Die 4' },
        { type: 'standard', dieType: 'd6', id: 'die-5', label: 'Die 5' },
      ],
      visible: true,
    },
  ],

  defaultTool: {
    type: 'number',
    permanence: 'pen',
  },
};
