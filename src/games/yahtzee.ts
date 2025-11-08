/**
 * Yahtzee Game Configuration
 *
 * A simple roll-and-write game demonstrating:
 * - Grid layout with auto-generated hotspots
 * - Number marks for scores
 * - Standard dice (5d6)
 * - Dice locking/re-rolling mechanics
 */

import type { GameConfig } from '../types';

export const yahtzeeConfig: GameConfig = {
  name: 'Yahtzee',
  description: 'Classic dice game with 13 scoring categories',

  sheets: [
    {
      id: 'yahtzee-sheet',
      name: 'Score Sheet',
      layout: {
        type: 'grid',
        rows: 13,
        columns: 2,
        cellWidth: 150,
        cellHeight: 50,
        gap: 4,
        offsetX: 50,
        offsetY: 50,
        backgroundColor: '#f9fafb',
        generateHotspots: true,
        defaultConstraints: {
          allowedMarkTypes: ['number'],
          maxMarks: 1,
          numberRange: { min: 0, max: 50 },
          canErase: true,
        },
      },
    },
  ],

  tools: [
    {
      type: 'number',
      label: 'Enter Score',
      icon: 'hash',
      defaultPermanence: 'pen',
      numberRange: { min: 0, max: 50 },
    },
  ],

  dicePools: [
    {
      id: 'main-dice',
      label: 'Yahtzee Dice',
      dice: [
        { type: 'standard', dieType: 'd6' },
        { type: 'standard', dieType: 'd6' },
        { type: 'standard', dieType: 'd6' },
        { type: 'standard', dieType: 'd6' },
        { type: 'standard', dieType: 'd6' },
      ],
    },
  ],
};

/**
 * Yahtzee Scoring Rules (for reference - not enforced by engine)
 *
 * Upper Section:
 * - Ones: Sum of all 1s
 * - Twos: Sum of all 2s
 * - Threes: Sum of all 3s
 * - Fours: Sum of all 4s
 * - Fives: Sum of all 5s
 * - Sixes: Sum of all 6s
 * - Bonus: 35 points if upper section total is 63+
 *
 * Lower Section:
 * - Three of a Kind: Sum of all dice (if at least 3 of same number)
 * - Four of a Kind: Sum of all dice (if at least 4 of same number)
 * - Full House: 25 points (3 of one number, 2 of another)
 * - Small Straight: 30 points (sequence of 4)
 * - Large Straight: 40 points (sequence of 5)
 * - Yahtzee: 50 points (all 5 dice same)
 * - Chance: Sum of all dice
 *
 * Gameplay:
 * - Roll all 5 dice
 * - Can lock dice and re-roll up to 2 more times
 * - Choose one category to score
 * - Game ends after 13 rounds (all categories filled)
 */
