import type { GameConfig, Card } from '../types';
import { generateId, shuffle } from '../utils/helpers';

/**
 * Welcome to the Moon - Medium complexity roll-and-write
 *
 * Features:
 * - Multiple sheets
 * - Card deck with numbers and symbols
 * - Checkbox and number marks
 */

// Create mission cards (1-15 with symbols)
const createMissionCards = (): Card[] => {
  const symbols = ['astronaut', 'plant', 'robot', 'water'];
  const cards: Card[] = [];

  for (let num = 1; num <= 15; num++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    cards.push({
      id: generateId(),
      fields: [
        { name: 'number', type: 'number', value: num },
        { name: 'symbol', type: 'symbol', value: symbol },
      ],
    });
  }

  return cards;
};

export const welcomeToTheMoonConfig: GameConfig = {
  name: 'Welcome to the Moon',
  description: 'Flip cards and mark your mission sheets strategically',

  sheets: [
    {
      id: 'mission-control',
      name: 'Mission Control',
      backgroundColor: '#1E3A8A',
      layout: {
        type: 'grid',
        rows: 3,
        columns: 5,
        cellWidth: 80,
        cellHeight: 80,
        gap: 4,
        offsetX: 20,
        offsetY: 20,
        allowedMarkTypes: ['checkbox'],
        backgroundColor: '#1E40AF',
      },
    },
    {
      id: 'player-board-a',
      name: 'Player Board A',
      backgroundColor: '#FFFFFF',
      layout: {
        type: 'grid',
        rows: 5,
        columns: 8,
        cellWidth: 60,
        cellHeight: 60,
        gap: 2,
        offsetX: 20,
        offsetY: 20,
        allowedMarkTypes: ['number', 'checkbox'],
        backgroundColor: '#F9FAFB',
      },
    },
    {
      id: 'player-board-b',
      name: 'Player Board B',
      backgroundColor: '#FFFFFF',
      layout: {
        type: 'grid',
        rows: 4,
        columns: 10,
        cellWidth: 50,
        cellHeight: 50,
        gap: 2,
        offsetX: 20,
        offsetY: 20,
        allowedMarkTypes: ['number', 'checkbox', 'circle'],
        backgroundColor: '#F9FAFB',
      },
    },
  ],

  decks: [
    {
      id: 'mission-deck',
      name: 'Mission Cards',
      cards: createMissionCards(),
      drawPile: shuffle(createMissionCards()),
      discardPile: [],
    },
  ],

  symbolPalette: [
    { id: 'astronaut', icon: 'user', label: 'Astronaut' },
    { id: 'plant', icon: 'sprout', label: 'Plant' },
    { id: 'robot', icon: 'bot', label: 'Robot' },
    { id: 'water', icon: 'droplet', label: 'Water' },
  ],
};
