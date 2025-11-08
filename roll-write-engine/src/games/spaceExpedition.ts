/**
 * Space Expedition Game Configuration
 * Medium complexity example demonstrating cards and multi-sheet gameplay
 * Inspired by Welcome to the Moon style mechanics
 */

import type { GameConfig, Card } from '../types';

// Generate cards with numbers 1-12 and different resource symbols
const generateCards = (): Card[] => {
  const symbols = ['🚀', '🌱', '🤖', '💧'];
  const cards: Card[] = [];

  for (let num = 1; num <= 12; num++) {
    for (const symbol of symbols) {
      cards.push({
        id: `card-${num}-${symbol}`,
        fields: [
          { name: 'Number', type: 'number', value: num },
          { name: 'Resource', type: 'symbol', value: symbol },
        ],
      });
    }
  }

  return cards;
};

export const spaceExpeditionConfig: GameConfig = {
  name: 'Space Expedition',
  sheets: [
    {
      id: 'mission-control',
      name: 'Mission Control',
      layout: {
        type: 'grid',
        rows: 10,
        columns: 4,
        cellWidth: 60,
        cellHeight: 60,
        gap: 3,
        offsetX: 20,
        offsetY: 20,
        backgroundColor: '#f1f5f9',
        defaultConstraints: {
          allowedMarkTypes: ['number', 'symbol'],
          maxMarks: 2,
          canUnmark: true,
        },
      },
    },
    {
      id: 'resource-tracker',
      name: 'Resource Tracker',
      layout: {
        type: 'grid',
        rows: 4,
        columns: 12,
        cellWidth: 50,
        cellHeight: 50,
        gap: 2,
        offsetX: 20,
        offsetY: 20,
        backgroundColor: '#fef3c7',
        defaultConstraints: {
          allowedMarkTypes: ['checkbox', 'circle'],
          maxMarks: 1,
          canUnmark: true,
        },
      },
    },
  ],
  decks: [
    {
      id: 'exploration-deck',
      name: 'Exploration Cards',
      cards: generateCards(),
      drawPile: generateCards(),
      discardPile: [],
    },
  ],
  symbolPalette: {
    rocket: { name: 'Rocket', emoji: '🚀' },
    plant: { name: 'Plant', emoji: '🌱' },
    robot: { name: 'Robot', emoji: '🤖' },
    water: { name: 'Water', emoji: '💧' },
    star: { name: 'Star', emoji: '⭐' },
  },
  colorPalette: [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
  ],
  defaultTool: {
    type: 'number',
    isPermanent: true,
    value: 1,
  },
};
