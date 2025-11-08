/**
 * Welcome to the Moon Game Configuration
 * A flip-and-write game with cards showing numbers and symbols
 */

import { GameConfig, Card } from '../types';

// Create the card deck
const cards: Card[] = [];
const symbols = ['🚀', '🌱', '🤖', '💧']; // Rocket, Plant, Robot, Water
const cardId = (num: number, sym: string) => `card-${num}-${sym}`;

// Generate cards: numbers 1-15 with each of the 4 symbols
for (let num = 1; num <= 15; num++) {
  for (const symbol of symbols) {
    cards.push({
      id: cardId(num, symbol),
      fields: [
        { name: 'number', type: 'number', value: num },
        { name: 'symbol', type: 'symbol', value: symbol },
      ],
    });
  }
}

export const welcomeToTheMoonConfig: GameConfig = {
  id: 'welcome-to-the-moon',
  name: 'Welcome to the Moon',
  description: 'Flip cards and mark numbers in different sections based on symbols',

  sheets: [
    {
      id: 'mission-sheet',
      name: 'Mission Sheet',
      layout: {
        type: 'mixed',
        width: 900,
        height: 700,
        regions: [
          // Rocket section (top left)
          {
            type: 'grid',
            rows: 3,
            cols: 5,
            cellSize: 50,
            gap: 3,
            x: 50,
            y: 50,
            defaultConstraints: {
              allowedMarkTypes: ['number'],
              maxMarks: 1,
              canUnmark: true,
              numberRange: { min: 1, max: 15 },
            },
          },
          // Plant section (top right)
          {
            type: 'grid',
            rows: 3,
            cols: 5,
            cellSize: 50,
            gap: 3,
            x: 500,
            y: 50,
            defaultConstraints: {
              allowedMarkTypes: ['number'],
              maxMarks: 1,
              canUnmark: true,
              numberRange: { min: 1, max: 15 },
            },
          },
          // Robot section (bottom left)
          {
            type: 'grid',
            rows: 3,
            cols: 5,
            cellSize: 50,
            gap: 3,
            x: 50,
            y: 400,
            defaultConstraints: {
              allowedMarkTypes: ['number'],
              maxMarks: 1,
              canUnmark: true,
              numberRange: { min: 1, max: 15 },
            },
          },
          // Water section (bottom right)
          {
            type: 'grid',
            rows: 3,
            cols: 5,
            cellSize: 50,
            gap: 3,
            x: 500,
            y: 400,
            defaultConstraints: {
              allowedMarkTypes: ['number'],
              maxMarks: 1,
              canUnmark: true,
              numberRange: { min: 1, max: 15 },
            },
          },
        ],
      },
    },
  ],

  decks: [
    {
      id: 'mission-deck',
      label: 'Mission Cards',
      cards: cards,
      drawPile: cards.map((c) => c.id),
      discardPile: [],
    },
  ],

  tools: [
    {
      type: 'number',
      label: 'Number',
      icon: 'Hash',
      config: {
        numberRange: { min: 1, max: 15 },
      },
    },
  ],

  initialSheetId: 'mission-sheet',
};
