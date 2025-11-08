import type { GameConfig, DieInstance } from '../types';

/**
 * Yahtzee - Simple roll-and-write game
 *
 * Classic dice game with:
 * - 5 six-sided dice
 * - Upper section: score specific numbers
 * - Lower section: score combinations
 */

// Create 5 standard d6 dice
const createYahtzeeDice = (): DieInstance[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `die-${i + 1}`,
    dieConfig: {
      id: `d6-${i + 1}`,
      type: 'standard' as const,
      sides: 6 as const,
    },
    locked: false,
    modified: false,
  }));
};

export const yahtzeeConfig: GameConfig = {
  name: 'Yahtzee',
  description: 'Classic dice game - roll five dice and mark your scoresheet',

  sheets: [
    {
      id: 'scoresheet',
      name: 'Score Sheet',
      backgroundColor: '#FFFFFF',
      layout: {
        type: 'grid',
        rows: 13,
        columns: 1,
        cellWidth: 200,
        cellHeight: 50,
        gap: 2,
        offsetX: 20,
        offsetY: 20,
        allowedMarkTypes: ['number'],
        backgroundColor: '#F3F4F6',
      },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      name: 'Yahtzee Dice',
      dice: createYahtzeeDice(),
    },
  ],

  tools: [
    {
      type: 'number',
      icon: 'hash',
      label: 'Number',
      shortcut: 'n',
    },
    {
      type: 'checkbox',
      icon: 'check-square',
      label: 'Check',
      shortcut: 'c',
    },
  ],
};
