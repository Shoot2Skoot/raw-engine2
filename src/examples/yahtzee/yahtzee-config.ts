/**
 * Yahtzee Game Configuration
 * A simple roll-and-write game demonstrating basic engine features
 */

import type { GameConfig } from '../../engine/types';

export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  version: '1.0.0',
  description: 'Classic dice game with 13 scoring categories',
  author: 'Roll-and-Write Engine',

  sheets: [
    {
      id: 'score-sheet',
      name: 'Score Sheet',
      width: 400,
      height: 800,
      backgroundColor: '#ffffff',
      regions: [
        // Upper Section
        {
          id: 'upper-section',
          label: 'Upper Section',
          position: { x: 50, y: 50 },
          layout: {
            type: 'grid',
            rows: 6,
            columns: 2,
            cellSize: 60,
            gap: 4,
            defaultAllowedMarks: ['number'],
            cellLabels: {
              '0-0': 'Ones',
              '1-0': 'Twos',
              '2-0': 'Threes',
              '3-0': 'Fours',
              '4-0': 'Fives',
              '5-0': 'Sixes',
            },
            cellConstraints: {
              // First column shows labels, second column for scores
              '0-0': { allowedMarkTypes: [], enabled: false },
              '1-0': { allowedMarkTypes: [], enabled: false },
              '2-0': { allowedMarkTypes: [], enabled: false },
              '3-0': { allowedMarkTypes: [], enabled: false },
              '4-0': { allowedMarkTypes: [], enabled: false },
              '5-0': { allowedMarkTypes: [], enabled: false },
              '0-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 5 } },
              '1-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 10 } },
              '2-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 15 } },
              '3-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 20 } },
              '4-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 25 } },
              '5-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 30 } },
            },
          },
        },
        // Lower Section
        {
          id: 'lower-section',
          label: 'Lower Section',
          position: { x: 50, y: 450 },
          layout: {
            type: 'grid',
            rows: 7,
            columns: 2,
            cellSize: 60,
            gap: 4,
            defaultAllowedMarks: ['number'],
            cellLabels: {
              '0-0': '3 of Kind',
              '1-0': '4 of Kind',
              '2-0': 'Full House',
              '3-0': 'Sm Straight',
              '4-0': 'Lg Straight',
              '5-0': 'Yahtzee',
              '6-0': 'Chance',
            },
            cellConstraints: {
              // First column shows labels, second column for scores
              '0-0': { allowedMarkTypes: [], enabled: false },
              '1-0': { allowedMarkTypes: [], enabled: false },
              '2-0': { allowedMarkTypes: [], enabled: false },
              '3-0': { allowedMarkTypes: [], enabled: false },
              '4-0': { allowedMarkTypes: [], enabled: false },
              '5-0': { allowedMarkTypes: [], enabled: false },
              '6-0': { allowedMarkTypes: [], enabled: false },
              '0-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 30 } },
              '1-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 30 } },
              '2-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 25 } },
              '3-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 30 } },
              '4-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 40 } },
              '5-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 50 } },
              '6-1': { allowedMarkTypes: ['number'], maxMarks: 1, numberRange: { min: 0, max: 30 } },
            },
          },
        },
      ],
    },
  ],

  defaultSheet: 'score-sheet',

  dicePools: [
    {
      id: 'main-dice',
      name: 'Yahtzee Dice',
      dice: [
        { id: 'die-1', type: 'd6' },
        { id: 'die-2', type: 'd6' },
        { id: 'die-3', type: 'd6' },
        { id: 'die-4', type: 'd6' },
        { id: 'die-5', type: 'd6' },
      ],
    },
  ],

  tools: [
    { type: 'number', min: 0, max: 50 },
    { type: 'eraser' },
  ],

  defaultTool: { type: 'number', min: 0, max: 50 },

  ui: {
    showDice: true,
    showCards: false,
    layout: 'spacious',
    theme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      background: '#f3f4f6',
      surface: '#ffffff',
      text: '#1f2937',
    },
  },
};
