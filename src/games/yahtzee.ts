/**
 * Yahtzee - Simple roll-and-write game example
 */

import type { GameConfig, Sheet, GridLayout, Tool } from '../types';
import { generateGridHotspots } from '../utils/hotspotGenerator';

// Create the Yahtzee score sheet
const createYahtzeeSheet = (): Sheet => {
  const layout: GridLayout = {
    type: 'grid',
    rows: 13,
    columns: 1,
    cellSize: 80,
    gap: 2,
    offset: { x: 20, y: 20 },
    backgroundColor: '#ffffff',
    defaultConstraints: {
      allowedTypes: ['number'],
      maxMarks: 1,
      numberRange: { min: 0, max: 50 },
      erasable: true,
    },
  };

  const sheet: Sheet = {
    id: 'yahtzee-sheet',
    name: 'Yahtzee Score Sheet',
    layout,
    hotspots: generateGridHotspots(layout),
    backgroundColor: '#f3f4f6',
  };

  // Add labels to hotspots
  const categories = [
    'Aces (1s)',
    'Twos (2s)',
    'Threes (3s)',
    'Fours (4s)',
    'Fives (5s)',
    'Sixes (6s)',
    '3 of a Kind',
    '4 of a Kind',
    'Full House',
    'Sm Straight',
    'Lg Straight',
    'Yahtzee',
    'Chance',
  ];

  sheet.hotspots.forEach((hotspot, index) => {
    if (index < categories.length) {
      hotspot.label = categories[index];
      hotspot.defaultValue = categories[index];
    }
  });

  return sheet;
};

// Create available tools
const createYahtzeeTools = (): Tool[] => {
  const numberTools: Tool[] = [];

  // Create number tools 0-50
  for (let i = 0; i <= 50; i++) {
    numberTools.push({
      type: 'number',
      name: `${i}`,
      icon: 'Hash',
      settings: {
        number: i,
      },
    });
  }

  // Add eraser
  const eraser: Tool = {
    type: 'eraser',
    name: 'Eraser',
    icon: 'Eraser',
  };

  // Return a subset of useful numbers plus eraser
  return [
    numberTools[0],
    numberTools[1],
    numberTools[2],
    numberTools[3],
    numberTools[4],
    numberTools[5],
    numberTools[6],
    numberTools[10],
    numberTools[15],
    numberTools[20],
    numberTools[25],
    numberTools[30],
    numberTools[40],
    numberTools[50],
    eraser,
  ];
};

// Create the complete Yahtzee game configuration
export const yahtzeeConfig: GameConfig = {
  id: 'yahtzee',
  name: 'Yahtzee',
  description: 'Classic dice game - roll 5 dice and score combinations',
  sheets: [createYahtzeeSheet()],
  tools: createYahtzeeTools(),
  defaultTool: 'number',
};
