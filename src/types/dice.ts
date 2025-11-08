/**
 * Dice Types - Dice rolling mechanics and configuration
 */

/**
 * Standard die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

/**
 * Die face content types
 */
export type DieFaceType = 'number' | 'symbol' | 'color' | 'text' | 'combination';

/**
 * Die face definition for custom dice
 */
export interface DieFace {
  id: string;
  type: DieFaceType;
  value?: number;
  symbol?: string;
  color?: string;
  text?: string;
  weight?: number; // Probability weight (default 1)
  display?: string; // Custom display text
}

/**
 * Die definition
 */
export interface DieDefinition {
  id: string;
  name: string;
  type: 'standard' | 'custom';
  standardType?: StandardDieType; // For standard dice
  faces?: DieFace[]; // For custom dice
  color?: string; // Visual color of the die
  icon?: string; // Icon to display
}

/**
 * Die instance (rolled die)
 */
export interface DieInstance {
  id: string;
  definitionId: string;
  currentFace: DieFace | number; // Current face showing
  isLocked: boolean;
  isModified: boolean; // Has been modified since roll
  poolId?: string; // Which pool this die belongs to
}

/**
 * Dice pool configuration
 */
export interface DicePoolDefinition {
  id: string;
  label: string;
  dice: {
    definitionId: string;
    quantity: number;
  }[];
  maxRerolls?: number;
  allowLocking?: boolean;
  allowModification?: boolean;
}

/**
 * Dice pool state (runtime)
 */
export interface DicePoolState {
  id: string;
  dice: DieInstance[];
  rerollsRemaining?: number;
  rollHistory: DiceRollHistory[];
}

/**
 * Dice roll history entry
 */
export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: {
    dieId: string;
    face: DieFace | number;
  }[];
}

/**
 * Dice modification action
 */
export type DiceModification =
  | { type: 'reroll'; dieId: string }
  | { type: 'increment'; dieId: string }
  | { type: 'decrement'; dieId: string }
  | { type: 'flip'; dieId: string } // Opposite face
  | { type: 'set'; dieId: string; value: number | DieFace };
