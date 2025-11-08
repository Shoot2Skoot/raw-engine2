/**
 * Welcome to the Moon - Medium complexity example
 *
 * This demonstrates:
 * - Multiple sheets
 * - Card deck with multi-field cards
 * - Mix of number and checkbox marks
 * - Image-based sheets (conceptual - would use freeform regions)
 */

import type { GameConfig, Card, CardField } from '../types';
import { createCard, createDeck } from '../utils/cards';

// Create the mission cards
function createMissionCards(): Card[] {
  const cards: Card[] = [];

  // Numbers 1-9, each with different resource symbols
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const symbols = ['astronaut', 'plant', 'robot', 'water'];

  for (const num of numbers) {
    for (const symbol of symbols) {
      const fields: CardField[] = [
        { name: 'number', type: 'number', value: num },
        { name: 'action', type: 'symbol', value: symbol },
      ];
      cards.push(createCard(fields));
    }
  }

  // Add some special cards
  for (let i = 0; i < 3; i++) {
    const fields: CardField[] = [
      { name: 'number', type: 'number', value: Math.floor(Math.random() * 9) + 1 },
      { name: 'action', type: 'symbol', value: 'wild' },
    ];
    cards.push(createCard(fields));
  }

  return cards;
}

export const welcomeToTheMoonConfig: GameConfig = {
  id: 'welcome-to-the-moon',
  name: 'Welcome to the Moon',
  description: 'Flip cards and mark your mission sheets to complete objectives',
  defaultTool: 'number',
  sheets: [
    // Mission Control Sheet
    {
      id: 'mission-control',
      name: 'Mission Control',
      width: 600,
      height: 400,
      regions: [
        // Astronaut track (horizontal)
        {
          type: 'grid',
          id: 'astronaut-track',
          position: { x: 50, y: 50 },
          rows: 1,
          columns: 10,
          cellSize: 40,
          gap: 2,
          label: 'Astronauts',
          constraints: {
            allowedTypes: ['number', 'checkbox'],
            maxMarks: 2,
            numberRange: [1, 9],
          },
        },
        // Plant track
        {
          type: 'grid',
          id: 'plant-track',
          position: { x: 50, y: 130 },
          rows: 1,
          columns: 10,
          cellSize: 40,
          gap: 2,
          label: 'Plants',
          constraints: {
            allowedTypes: ['number', 'checkbox'],
            maxMarks: 2,
            numberRange: [1, 9],
          },
        },
        // Robot track
        {
          type: 'grid',
          id: 'robot-track',
          position: { x: 50, y: 210 },
          rows: 1,
          columns: 10,
          cellSize: 40,
          gap: 2,
          label: 'Robots',
          constraints: {
            allowedTypes: ['number', 'checkbox'],
            maxMarks: 2,
            numberRange: [1, 9],
          },
        },
        // Water track
        {
          type: 'grid',
          id: 'water-track',
          position: { x: 50, y: 290 },
          rows: 1,
          columns: 10,
          cellSize: 40,
          gap: 2,
          label: 'Water',
          constraints: {
            allowedTypes: ['number', 'checkbox'],
            maxMarks: 2,
            numberRange: [1, 9],
          },
        },
      ],
    },
    // Player Board A
    {
      id: 'player-board-a',
      name: 'Board A',
      width: 600,
      height: 500,
      regions: [
        // Main number grid (simulating the rocket ship compartments)
        {
          type: 'grid',
          id: 'compartments-top',
          position: { x: 200, y: 50 },
          rows: 5,
          columns: 3,
          cellSize: 50,
          gap: 3,
          label: 'Top Compartments',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            allowUnmark: false,
            numberRange: [1, 9],
          },
        },
        {
          type: 'grid',
          id: 'compartments-middle',
          position: { x: 150, y: 300 },
          rows: 3,
          columns: 5,
          cellSize: 50,
          gap: 3,
          label: 'Middle Compartments',
          constraints: {
            allowedTypes: ['number'],
            maxMarks: 1,
            allowUnmark: false,
            numberRange: [1, 9],
          },
        },
      ],
    },
    // Player Board B
    {
      id: 'player-board-b',
      name: 'Board B',
      width: 600,
      height: 500,
      regions: [
        // Objectives grid
        {
          type: 'grid',
          id: 'objectives',
          position: { x: 50, y: 50 },
          rows: 4,
          columns: 3,
          cellSize: 60,
          gap: 4,
          label: 'Mission Objectives',
          constraints: {
            allowedTypes: ['checkbox'],
            maxMarks: 1,
          },
        },
        // Bonus achievements
        {
          type: 'grid',
          id: 'achievements',
          position: { x: 350, y: 50 },
          rows: 6,
          columns: 1,
          cellSize: 60,
          gap: 4,
          label: 'Achievements',
          constraints: {
            allowedTypes: ['checkbox'],
            maxMarks: 1,
          },
        },
      ],
    },
  ],
  decks: [
    createDeck('Mission Cards', createMissionCards(), false),
  ],
  colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  symbolSet: ['astronaut', 'plant', 'robot', 'water', 'wild'],
};
