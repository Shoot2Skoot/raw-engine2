/**
 * Yahtzee Game Configuration
 * Simple grid-based game demonstrating basic engine features
 */

import { GameConfig } from '../../types';
import { generateGridHotspots } from '../../utils/grid';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  version: '1.0.0',
  sheets: [
    {
      id: 'scoresheet',
      name: 'Score Sheet',
      layout: 'grid',
      dimensions: {
        width: 400,
        height: 800,
      },
      background: '#f9f9f9',
      hotspots: [
        // Upper section - 6 rows for numbers 1-6
        ...generateGridHotspots({
          rows: 6,
          columns: 1,
          cellWidth: 300,
          cellHeight: 50,
          gap: 10,
          startPosition: { x: 50, y: 50 },
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          canUnmark: true,
        }),
        // Lower section - 7 rows for combinations
        ...generateGridHotspots({
          rows: 7,
          columns: 1,
          cellWidth: 300,
          cellHeight: 50,
          gap: 10,
          startPosition: { x: 50, y: 450 },
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          canUnmark: true,
        }),
      ],
    },
  ],
  dicePools: [
    {
      id: 'main-dice',
      label: 'Main Dice',
      diceConfigs: [
        { id: 'die1', type: 'standard', standardType: 'd6', label: 'Die 1' },
        { id: 'die2', type: 'standard', standardType: 'd6', label: 'Die 2' },
        { id: 'die3', type: 'standard', standardType: 'd6', label: 'Die 3' },
        { id: 'die4', type: 'standard', standardType: 'd6', label: 'Die 4' },
        { id: 'die5', type: 'standard', standardType: 'd6', label: 'Die 5' },
      ],
    },
  ],
  tools: [
    {
      type: 'number',
      label: 'Number',
      isPermanent: true,
    },
    {
      type: 'eraser',
      label: 'Eraser',
      isPermanent: true,
    },
  ],
  metadata: {
    description: 'Classic Yahtzee dice game',
    labels: {
      upperSection: [
        'Ones',
        'Twos',
        'Threes',
        'Fours',
        'Fives',
        'Sixes',
      ],
      lowerSection: [
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
};
