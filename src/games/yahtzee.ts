import type { GameDefinition } from '../types';

/**
 * Yahtzee Game Definition
 * A simple roll-and-write game demonstrating basic grid layout and number marking
 */
export const yahtzeeGame: GameDefinition = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and mark scores on your sheet',
  version: '1.0.0',

  sheets: [
    {
      id: 'yahtzee_sheet',
      name: 'Score Sheet',
      order: 1,
      layout: {
        type: 'grid',
        rows: 13,
        columns: 1,
        cellSize: 80,
        gap: 4,
        offset: { x: 20, y: 20 },
        backgroundColor: '#f9fafb',
        defaultConstraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          canUnmark: true,
        },
      },
    },
  ],

  tools: [
    {
      type: 'number',
      label: 'Number',
      icon: 'Hash',
      options: {
        minValue: 0,
        maxValue: 50,
      },
    },
  ],

  dicePools: [
    {
      id: 'main_pool',
      label: 'Main Dice',
      dice: [
        {
          definitionId: 'standard_d6',
          quantity: 5,
        },
      ],
      maxRerolls: 2,
      allowLocking: true,
      allowModification: false,
    },
  ],

  settings: {
    autosave: true,
    autosaveInterval: 5000,
    maxUndoHistory: 50,
    enableKeyboardShortcuts: true,
  },
};

/**
 * Standard D6 die definition (referenced by Yahtzee)
 */
export const standardD6 = {
  id: 'standard_d6',
  name: 'Six-sided Die',
  type: 'standard' as const,
  standardType: 'd6' as const,
  color: '#ffffff',
};
