/**
 * Dice Types
 * Dice rolling mechanics with customizable configurations
 */

/** Standard die types */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Face value types */
export type FaceValue = number | string | { symbol: string; color?: string };

/** Custom die face */
export interface DieFace {
  value: FaceValue;
  weight?: number; // Probability weight (default 1 for even distribution)
  label?: string; // Display label
}

/** Custom die definition */
export interface CustomDie {
  id: string;
  name: string;
  faces: DieFace[];
  color?: string; // Visual color for this die type
  size?: number; // Display size in pixels
}

/** Standard die definition */
export interface StandardDie {
  id: string;
  type: StandardDieType;
  color?: string;
  size?: number;
}

/** Die instance (a specific die that can be rolled) */
export interface DieInstance {
  id: string;
  dieDefinitionId: string; // References StandardDie or CustomDie
  currentValue: FaceValue | null;
  isLocked: boolean;
  isModified?: boolean; // Tracks if value was changed from roll
  originalValue?: FaceValue; // Original rolled value before modification
}

/** Dice pool (collection of dice) */
export interface DicePool {
  id: string;
  name: string;
  dice: DieInstance[];
  maxRerolls?: number;
  currentRerolls?: number;
}

/** Dice roll result */
export interface DiceRollResult {
  poolId: string;
  diceResults: Array<{
    dieId: string;
    value: FaceValue;
  }>;
  timestamp: number;
  total?: number; // Sum of numeric values if applicable
}

/** Dice roll history entry */
export interface DiceRollHistory {
  results: DiceRollResult[];
  maxHistory?: number; // Max number of rolls to keep (default 10)
}

/** Dice configuration */
export interface DiceConfig {
  standardDice?: StandardDie[];
  customDice?: CustomDie[];
  pools: DicePool[];
  enableHistory?: boolean;
  maxHistorySize?: number;
}

/** Dice modification operations */
export type DiceModification =
  | { type: 'reroll'; dieId: string }
  | { type: 'increment'; dieId: string }
  | { type: 'decrement'; dieId: string }
  | { type: 'flip'; dieId: string } // Flip to opposite side
  | { type: 'setValue'; dieId: string; value: FaceValue };
