/**
 * Yahtzee Game Configuration
 * Simple example demonstrating the roll-and-write engine
 */

import type { GameConfig, MarkConfig } from '../../types';
import { createGridSheet } from '../../utils/sheetGenerators';
import { createStandardDie, createDicePool } from '../../utils/diceUtils';

// Mark configuration for number cells
const numberMarkConfig: MarkConfig = {
  allowedTypes: ['number'],
  maxMarks: 1,
  minValue: 0,
  maxValue: 999,
  canRemove: false,
  defaultMode: 'pen',
};

// Create the Yahtzee scoresheet
const yahtzeeSheet = createGridSheet({
  id: 'yahtzee-sheet',
  name: 'Yahtzee Score Sheet',
  rows: 13,
  columns: 2,
  cellWidth: 150,
  cellHeight: 40,
  gap: 2,
  markConfig: numberMarkConfig,
  sheetWidth: 310,
  sheetHeight: 550,
});

// Add labels to the cells
const labels = [
  'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
  'Three of a Kind', 'Four of a Kind', 'Full House',
  'Small Straight', 'Large Straight', 'Yahtzee', 'Chance'
];

yahtzeeSheet.hotspots.forEach((hotspot, index) => {
  if ('gridPosition' in hotspot && hotspot.gridPosition) {
    const { col } = hotspot.gridPosition;
    if (col === 0 && index < labels.length * 2) {
      const labelIndex = Math.floor(index / 2);
      hotspot.label = labels[labelIndex];
      hotspot.enabled = false; // Label cells are not interactive
    }
  }
});

// Create dice pool (5 standard d6 dice)
const yahtzeeDice = [
  createStandardDie('d6', 'die-1'),
  createStandardDie('d6', 'die-2'),
  createStandardDie('d6', 'die-3'),
  createStandardDie('d6', 'die-4'),
  createStandardDie('d6', 'die-5'),
];

const dicePool = createDicePool('main-pool', yahtzeeDice);

// Complete game configuration
export const yahtzeeConfig: GameConfig = {
  metadata: {
    id: 'yahtzee',
    name: 'Yahtzee',
    version: '1.0.0',
    description: 'Classic dice game - roll and write your highest score!',
    author: 'Roll-and-Write Engine Demo',
    created: Date.now(),
    modified: Date.now(),
  },
  sheets: [yahtzeeSheet],
  dice: {
    pools: [dicePool],
  },
  ui: {
    autoSaveInterval: 5000,
    keyboardShortcuts: true,
  },
};
