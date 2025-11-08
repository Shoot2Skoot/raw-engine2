import { Die, DieResult, StandardDieType, DieFace } from '../types';

/**
 * Roll a single die and return the result
 */
export function rollDie(die: Die): DieResult {
  if (die.type === 'standard') {
    const max = getStandardDieMax(die.dieType);
    const value = Math.floor(Math.random() * max) + 1;

    return {
      dieId: die.id,
      face: value,
      locked: false,
      modified: false,
    };
  } else {
    // Custom die with faces
    const totalWeight = die.faces.reduce((sum, face) => sum + (face.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const face of die.faces) {
      random -= face.weight || 1;
      if (random <= 0) {
        return {
          dieId: die.id,
          face,
          locked: false,
          modified: false,
        };
      }
    }

    // Fallback to first face
    return {
      dieId: die.id,
      face: die.faces[0],
      locked: false,
      modified: false,
    };
  }
}

/**
 * Roll multiple dice
 */
export function rollDice(dice: Die[]): DieResult[] {
  return dice.map(die => rollDie(die));
}

/**
 * Re-roll specific dice (preserving locked dice)
 */
export function rerollDice(dice: Die[], currentResults: DieResult[]): DieResult[] {
  return currentResults.map((result, index) => {
    if (result.locked) {
      return result;
    } else {
      return rollDie(dice[index]);
    }
  });
}

/**
 * Get maximum value for standard die type
 */
function getStandardDieMax(dieType: StandardDieType): number {
  switch (dieType) {
    case 'd4': return 4;
    case 'd6': return 6;
    case 'd8': return 8;
    case 'd10': return 10;
    case 'd12': return 12;
    case 'd20': return 20;
    default: return 6;
  }
}
