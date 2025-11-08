/**
 * Yahtzee - Simple roll-and-write game example
 */

import type { GameDefinition } from '../types';

export const yahtzeeGame: GameDefinition = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and mark scores',
  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Score Sheet',
      layouts: [
        // Upper section
        {
          type: 'grid',
          rows: 6,
          columns: 1,
          cellWidth: 120,
          cellHeight: 50,
          gap: 4,
          offsetX: 20,
          offsetY: 20,
          allowedMarkTypes: ['number'],
          backgroundColor: '#f0f9ff',
        },
        // Lower section
        {
          type: 'grid',
          rows: 7,
          columns: 1,
          cellWidth: 120,
          cellHeight: 50,
          gap: 4,
          offsetX: 20,
          offsetY: 380,
          allowedMarkTypes: ['number'],
          backgroundColor: '#fef3c7',
        },
      ],
      hotspots: [],
    },
  ],
  dicePool: [
    {
      id: 'main-dice',
      name: 'Dice',
      dice: [
        { id: 'die-1', type: 'standard', sides: 6 },
        { id: 'die-2', type: 'standard', sides: 6 },
        { id: 'die-3', type: 'standard', sides: 6 },
        { id: 'die-4', type: 'standard', sides: 6 },
        { id: 'die-5', type: 'standard', sides: 6 },
      ],
    },
  ],
  decks: [],
  defaultTool: 'number',
};
