/**
 * Welcome to the Moon - Medium complexity example
 */

import type { GameConfig, Card, DeckDefinition } from '../types';

// Create a simple deck with number + symbol combinations
const createWelcomeDeck = (): DeckDefinition => {
  const cards: Card[] = [];
  const symbols = ['astronaut', 'plant', 'robot', 'water'];

  // Create 12 cards with numbers 1-12 and different symbols
  for (let i = 1; i <= 12; i++) {
    cards.push({
      id: `card-${i}`,
      fields: [
        {
          id: `number-${i}`,
          name: 'Number',
          type: 'number',
          value: i,
          displaySize: 'large',
          displayPosition: 'center',
        },
        {
          id: `symbol-${i}`,
          name: 'Symbol',
          type: 'symbol',
          value: symbols[Math.floor(Math.random() * symbols.length)],
          displaySize: 'medium',
          displayPosition: 'top',
        },
      ],
    });
  }

  return {
    id: 'welcome-deck',
    name: 'Mission Deck',
    cards,
    shuffleOnSetup: true,
    reshuffleWhenEmpty: false,
  };
};

export const welcomeToTheMoonConfig: GameConfig = {
  id: 'welcome-to-the-moon',
  name: 'Welcome to the Moon',
  description: 'Fill your mission sheets with cards',
  sheets: [
    {
      id: 'mission-sheet',
      name: 'Mission Control',
      layout: {
        type: 'grid',
        rows: 8,
        columns: 5,
        cellSize: 60,
        gap: 4,
        offsetX: 20,
        offsetY: 20,
        allowedMarks: ['number', 'checkbox'],
      },
      hotspots: [],
    },
  ],
  deckDefinitions: [createWelcomeDeck()],
  defaultTools: ['number', 'checkbox'],
  symbolPalette: [
    { id: 'astronaut', name: 'Astronaut', svgPath: 'M12 2 L15 8 L12 14 L9 8 Z' },
    { id: 'plant', name: 'Plant', svgPath: 'M12 2 L15 8 L12 14 L9 8 Z' },
    { id: 'robot', name: 'Robot', svgPath: 'M12 2 L15 8 L12 14 L9 8 Z' },
    { id: 'water', name: 'Water', svgPath: 'M12 2 L15 8 L12 14 L9 8 Z' },
  ],
};
