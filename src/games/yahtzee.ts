/**
 * Yahtzee game configuration
 * A simple roll-and-write game demonstrating basic grid layout and number marking
 */

import type { GameConfig } from '../types';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game with strategic scoring choices',

  sheets: [
    {
      name: 'Score Sheet',
      layout: 'grid',
      width: 600,
      height: 800,
      regions: [
        // Upper section - mark sum of specific numbers
        {
          id: 'upper-section',
          config: {
            layout: 'grid',
            rows: 6,
            columns: 2,
            cellWidth: 250,
            cellHeight: 60,
            gap: 5,
            offsetX: 50,
            offsetY: 50
          },
          hotspots: [], // Will be auto-generated
          backgroundColor: '#F3F4F6',
          borderColor: '#D1D5DB'
        },
        // Lower section - mark combination scores
        {
          id: 'lower-section',
          config: {
            layout: 'grid',
            rows: 7,
            columns: 2,
            cellWidth: 250,
            cellHeight: 60,
            gap: 5,
            offsetX: 50,
            offsetY: 450
          },
          hotspots: [], // Will be auto-generated
          backgroundColor: '#EEF2FF',
          borderColor: '#C7D2FE'
        }
      ]
    }
  ],

  // Dice pool: 5 standard six-sided dice
  dicePools: [
    {
      id: 'main-dice',
      name: 'Yahtzee Dice',
      dice: [
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' },
        { type: 'standard', sides: 'd6' }
      ]
    }
  ],

  defaultTool: 'number'
};
