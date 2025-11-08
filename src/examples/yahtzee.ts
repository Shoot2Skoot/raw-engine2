/**
 * Yahtzee - Example Game Definition
 *
 * A simple roll-and-write game demonstrating grid layouts and dice mechanics.
 */

import type { GameDefinition, DicePool } from '../types';
import { generateSheetId, generatePoolId, generateDieId } from '../utils';

const sheetId = generateSheetId();
const poolId = generatePoolId();

export const yahtzeeGame: GameDefinition = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and fill in your score sheet',

  sheets: [
    {
      id: sheetId,
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 13,
        cols: 1,
        cellSize: { width: 200, height: 50 },
        gap: 4,
        offset: { x: 20, y: 20 },
        defaultAllowedMarkTypes: ['number'],
        cells: [
          { row: 0, col: 0, label: 'Aces (1s)' },
          { row: 1, col: 0, label: 'Twos (2s)' },
          { row: 2, col: 0, label: 'Threes (3s)' },
          { row: 3, col: 0, label: 'Fours (4s)' },
          { row: 4, col: 0, label: 'Fives (5s)' },
          { row: 5, col: 0, label: 'Sixes (6s)' },
          { row: 6, col: 0, label: '3 of a Kind' },
          { row: 7, col: 0, label: '4 of a Kind' },
          { row: 8, col: 0, label: 'Full House (25)' },
          { row: 9, col: 0, label: 'Small Straight (30)' },
          { row: 10, col: 0, label: 'Large Straight (40)' },
          { row: 11, col: 0, label: 'Yahtzee (50)' },
          { row: 12, col: 0, label: 'Chance' },
        ],
      },
    },
  ],

  dicePools: [
    {
      id: poolId,
      label: 'Yahtzee Dice',
      dice: [
        { type: 'standard', dieType: 'd6', id: generateDieId() },
        { type: 'standard', dieType: 'd6', id: generateDieId() },
        { type: 'standard', dieType: 'd6', id: generateDieId() },
        { type: 'standard', dieType: 'd6', id: generateDieId() },
        { type: 'standard', dieType: 'd6', id: generateDieId() },
      ],
    },
  ] as DicePool[],

  defaultTool: { type: 'number' },
};
