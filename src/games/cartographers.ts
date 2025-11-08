/**
 * Cartographers-style Game Configuration
 * A flip-and-write game with territory claiming using colors
 */

import { GameConfig, Card } from '../types';

// Create simple exploration cards
const terrainCards: Card[] = [
  { id: 'forest', fields: [{ name: 'terrain', type: 'text', value: 'Forest' }] },
  { id: 'water', fields: [{ name: 'terrain', type: 'text', value: 'Water' }] },
  { id: 'village', fields: [{ name: 'terrain', type: 'text', value: 'Village' }] },
  { id: 'farm', fields: [{ name: 'terrain', type: 'text', value: 'Farm' }] },
  { id: 'monster', fields: [{ name: 'terrain', type: 'text', value: 'Monster!' }] },
];

export const cartographersConfig: GameConfig = {
  id: 'cartographers',
  name: 'Cartographers',
  description: 'Draw a map by filling territories with different terrain types',

  sheets: [
    {
      id: 'map-sheet',
      name: 'Map',
      layout: {
        type: 'grid',
        rows: 10,
        cols: 10,
        cellSize: 50,
        gap: 2,
        x: 20,
        y: 20,
        backgroundColor: '#fef3c7',
        defaultConstraints: {
          allowedMarkTypes: ['color', 'symbol'],
          maxMarks: 2, // Can have color fill + symbol
          canUnmark: true,
        },
      },
    },
  ],

  decks: [
    {
      id: 'terrain-deck',
      label: 'Terrain Cards',
      cards: terrainCards,
      drawPile: terrainCards.map((c) => c.id),
      discardPile: [],
    },
  ],

  tools: [
    {
      type: 'color',
      label: 'Terrain',
      icon: 'Palette',
      config: {
        colors: [
          '#22c55e', // Forest green
          '#3b82f6', // Water blue
          '#a855f7', // Village purple
          '#eab308', // Farm yellow
          '#ef4444', // Monster red
          '#d1d5db', // Mountain gray
        ],
      },
    },
    {
      type: 'symbol',
      label: 'Coins',
      icon: 'Star',
      config: {
        symbols: ['💰', '⭐', '🏆', '👑', '💎', '🎯'],
      },
    },
  ],

  initialSheetId: 'map-sheet',
};
