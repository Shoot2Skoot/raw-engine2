/**
 * Dice Types - Defines dice, die faces, pools, and rolling mechanics
 */

export type StandardDiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface DieFaceValue {
  type: 'number' | 'text' | 'symbol' | 'color' | 'combined';
  number?: number;
  text?: string;
  symbolId?: string;
  color?: string;
  // For combined faces (e.g., number + symbol)
  combined?: {
    number?: number;
    symbolId?: string;
    color?: string;
  };
}

export interface DieFace {
  id: string;
  value: DieFaceValue;
  weight?: number; // For weighted dice (default: 1)
}

export interface DieDefinition {
  id: string;
  name: string;
  faces: DieFace[];
  color?: string; // Visual color of the die itself
}

export interface DieResult {
  id: string; // Unique ID for this specific die instance
  dieDefinitionId: string;
  faceIndex: number; // Index of the face showing
  locked?: boolean;
  modified?: boolean; // Has this die been modified from original roll?
}

export interface DicePool {
  id: string;
  name: string;
  dice: DieResult[];
}

export interface DiceRollHistory {
  timestamp: number;
  poolId: string;
  results: DieResult[];
}

// Helper function to create standard dice
export function createStandardDie(type: StandardDiceType): DieDefinition {
  const sides: Record<StandardDiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };

  const numSides = sides[type];
  const faces: DieFace[] = [];

  for (let i = 1; i <= numSides; i++) {
    faces.push({
      id: `${type}-face-${i}`,
      value: { type: 'number', number: i },
    });
  }

  return {
    id: type,
    name: type.toUpperCase(),
    faces,
  };
}
