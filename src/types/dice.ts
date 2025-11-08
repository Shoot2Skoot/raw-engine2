/**
 * Dice and rolling mechanics type definitions
 */

import type { Color, ID } from './core';

/**
 * Standard die types
 */
export const StandardDieType = {
  D4: 'd4',
  D6: 'd6',
  D8: 'd8',
  D10: 'd10',
  D12: 'd12',
  D20: 'd20',
  D100: 'd100',
} as const;

export type StandardDieType = (typeof StandardDieType)[keyof typeof StandardDieType];

/**
 * Face value types
 */
export type FaceValue = number | string | Color | FaceValueCombination;

/**
 * Combination of multiple values on one face
 */
export interface FaceValueCombination {
  number?: number;
  text?: string;
  symbol?: string;
  color?: Color;
}

/**
 * Individual die face
 */
export interface DieFace {
  /** Display value */
  value: FaceValue;
  /** Probability weight (default 1 for even distribution) */
  weight?: number;
  /** Visual representation override */
  display?: {
    text?: string;
    color?: Color;
    icon?: string;
  };
}

/**
 * Standard numeric die definition
 */
export interface StandardDie {
  /** Die identifier */
  id: ID;
  /** Standard die type */
  type: StandardDieType;
  /** Display color */
  color?: Color;
  /** Custom label */
  label?: string;
}

/**
 * Custom die with arbitrary faces
 */
export interface CustomDie {
  /** Die identifier */
  id: ID;
  /** Custom type identifier */
  type: 'custom';
  /** All faces of the die */
  faces: DieFace[];
  /** Display color */
  color?: Color;
  /** Custom label */
  label?: string;
  /** Number of sides (derived from faces.length) */
  sides: number;
}

/**
 * Union type for all die types
 */
export type Die = StandardDie | CustomDie;

/**
 * Result from rolling a single die
 */
export interface DieResult {
  /** Which die was rolled */
  dieId: ID;
  /** The face value that came up */
  value: FaceValue;
  /** Whether this die is locked */
  locked?: boolean;
  /** Whether this die has been modified */
  modified?: boolean;
  /** Original value before modification */
  originalValue?: FaceValue;
  /** Timestamp of roll */
  timestamp: number;
}

/**
 * Dice pool configuration
 */
export interface DicePoolConfig {
  /** Pool identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Dice in this pool */
  dice: Die[];
  /** Whether dice can be moved between pools */
  allowTransfer?: boolean;
  /** Custom styling */
  style?: {
    color?: Color;
    backgroundColor?: Color;
  };
}

/**
 * State of a dice pool
 */
export interface DicePoolState {
  /** Which pool this state belongs to */
  poolId: ID;
  /** Current results for all dice */
  results: DieResult[];
  /** Number of rolls performed */
  rollCount: number;
  /** Maximum rolls allowed (undefined = unlimited) */
  maxRolls?: number;
  /** Timestamp of last roll */
  lastRollTime?: number;
}

/**
 * Dice roll history entry
 */
export interface DiceRollHistory {
  /** When the roll occurred */
  timestamp: number;
  /** Which pool was rolled */
  poolId: ID;
  /** The results */
  results: DieResult[];
  /** Turn or round number */
  turn?: number;
}

/**
 * Dice manipulation action types
 */
export const DiceAction = {
  Roll: 'roll',
  RollSingle: 'roll-single',
  Lock: 'lock',
  Unlock: 'unlock',
  Modify: 'modify',
  Transfer: 'transfer',
} as const;

export type DiceAction = (typeof DiceAction)[keyof typeof DiceAction];

/**
 * Dice modification types
 */
export interface DiceModification {
  /** Type of modification */
  type: 'set-value' | 'increment' | 'decrement' | 'flip';
  /** New value (for set-value) */
  value?: FaceValue;
  /** Amount to change (for increment/decrement) */
  amount?: number;
}
