/**
 * useDice Hook
 * Manages dice rolling and state
 */

import { useCallback } from 'react';
import type { DicePool, DieInstance, FaceValue, CustomDie, StandardDie } from '../types';
import { randomInt, weightedRandom } from '../utils/shuffle';

interface UseDiceProps {
  dicePools: DicePool[];
  customDice?: CustomDie[];
  standardDice?: StandardDie[];
  onDicePoolsChange: (pools: DicePool[]) => void;
}

export function useDice({ dicePools, customDice = [], standardDice = [], onDicePoolsChange }: UseDiceProps) {
  // Get die definition by ID
  const getDieDefinition = useCallback(
    (dieDefinitionId: string): CustomDie | StandardDie | null => {
      return (
        customDice.find((d) => d.id === dieDefinitionId) ||
        standardDice.find((d) => d.id === dieDefinitionId) ||
        null
      );
    },
    [customDice, standardDice]
  );

  // Roll a single die
  const rollDie = useCallback(
    (die: DieInstance): FaceValue => {
      const definition = getDieDefinition(die.dieDefinitionId);
      if (!definition) return 0;

      // Standard die
      if ('type' in definition) {
        const sides = parseInt(definition.type.substring(1)); // d6 -> 6
        return randomInt(1, sides);
      }

      // Custom die
      if ('faces' in definition) {
        const faces = definition.faces;
        const weights = faces.map((f) => f.weight || 1);
        const selectedFace = weightedRandom(faces, weights);
        return selectedFace.value;
      }

      return 0;
    },
    [getDieDefinition]
  );

  // Roll all unlocked dice in a pool
  const rollPool = useCallback(
    (poolId: string) => {
      onDicePoolsChange(
        dicePools.map((pool) => {
          if (pool.id !== poolId) return pool;

          const newDice = pool.dice.map((die) => {
            if (die.isLocked) return die;

            return {
              ...die,
              currentValue: rollDie(die),
              isModified: false,
              originalValue: undefined,
            };
          });

          return {
            ...pool,
            dice: newDice,
            currentRerolls: (pool.currentRerolls || 0) + 1,
          };
        })
      );
    },
    [dicePools, onDicePoolsChange, rollDie]
  );

  // Roll a single die
  const rollSingleDie = useCallback(
    (dieId: string) => {
      onDicePoolsChange(
        dicePools.map((pool) => ({
          ...pool,
          dice: pool.dice.map((die) => {
            if (die.id !== dieId || die.isLocked) return die;

            return {
              ...die,
              currentValue: rollDie(die),
              isModified: false,
              originalValue: undefined,
            };
          }),
        }))
      );
    },
    [dicePools, onDicePoolsChange, rollDie]
  );

  // Lock/unlock a die
  const toggleDieLock = useCallback(
    (dieId: string) => {
      onDicePoolsChange(
        dicePools.map((pool) => ({
          ...pool,
          dice: pool.dice.map((die) =>
            die.id === dieId ? { ...die, isLocked: !die.isLocked } : die
          ),
        }))
      );
    },
    [dicePools, onDicePoolsChange]
  );

  // Modify a die value
  const modifyDieValue = useCallback(
    (dieId: string, modification: 'increment' | 'decrement' | 'flip' | { setValue: FaceValue }) => {
      onDicePoolsChange(
        dicePools.map((pool) => ({
          ...pool,
          dice: pool.dice.map((die) => {
            if (die.id !== dieId) return die;

            let newValue = die.currentValue;

            if (modification === 'increment' && typeof newValue === 'number') {
              const definition = getDieDefinition(die.dieDefinitionId);
              const maxValue =
                definition && 'type' in definition
                  ? parseInt(definition.type.substring(1))
                  : 6;
              newValue = Math.min((newValue || 0) + 1, maxValue);
            } else if (modification === 'decrement' && typeof newValue === 'number') {
              newValue = Math.max((newValue || 0) - 1, 1);
            } else if (modification === 'flip' && typeof newValue === 'number') {
              const definition = getDieDefinition(die.dieDefinitionId);
              const maxValue =
                definition && 'type' in definition
                  ? parseInt(definition.type.substring(1))
                  : 6;
              newValue = maxValue - (newValue || 0) + 1;
            } else if (typeof modification === 'object' && 'setValue' in modification) {
              newValue = modification.setValue;
            }

            return {
              ...die,
              currentValue: newValue,
              isModified: true,
              originalValue: die.originalValue ?? die.currentValue ?? undefined,
            };
          }),
        }))
      );
    },
    [dicePools, onDicePoolsChange, getDieDefinition]
  );

  return {
    dicePools,
    rollPool,
    rollSingleDie,
    toggleDieLock,
    modifyDieValue,
  };
}
