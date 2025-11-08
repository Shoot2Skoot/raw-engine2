/**
 * Game Engine - Core State Management
 *
 * This file provides the main game engine context and hooks for managing game state.
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameDefinition,
  Mark,
  Tool,
  DieRollResult,
  SheetState,
  DicePool,
  DeckState,
} from '../types';
import {
  generateMarkId,
  autoSaveGame,
  loadAutoSave,
  shuffle,
  rollStandardDie,
  weightedRandomElement,
} from '../utils';

// ============================================================================
// GAME ENGINE CONTEXT
// ============================================================================

interface GameEngineContextValue {
  state: GameState;
  addMark: (sheetId: string, mark: Omit<Mark, 'id' | 'createdAt'>) => void;
  removeMark: (sheetId: string, markId: string) => void;
  modifyMark: (sheetId: string, markId: string, updates: Partial<Mark>) => void;
  rollDicePool: (poolId: string, diceIds?: string[]) => void;
  lockDie: (poolId: string, dieId: string) => void;
  unlockDie: (poolId: string, dieId: string) => void;
  modifyDie: (poolId: string, dieId: string, newValue: number | string) => void;
  drawCard: (deckId: string) => void;
  discardCard: (deckId: string) => void;
  shuffleDeck: (deckId: string) => void;
  reshuffleDeck: (deckId: string) => void;
  splitDeck: (deckId: string, numberOfPiles: number) => string[];
  setCurrentSheet: (sheetId: string) => void;
  setCurrentTool: (tool: Tool) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: () => void;
  resetSheet: (sheetId: string) => void;
}

const GameEngineContext = createContext<GameEngineContextValue | null>(null);

// ============================================================================
// GAME ENGINE REDUCER
// ============================================================================

type EngineAction =
  | { type: 'ADD_MARK'; sheetId: string; mark: Mark }
  | { type: 'REMOVE_MARK'; sheetId: string; markId: string }
  | { type: 'MODIFY_MARK'; sheetId: string; markId: string; updates: Partial<Mark> }
  | { type: 'ROLL_DICE'; poolId: string; results: DieRollResult[] }
  | { type: 'LOCK_DIE'; poolId: string; dieId: string }
  | { type: 'UNLOCK_DIE'; poolId: string; dieId: string }
  | { type: 'MODIFY_DIE'; poolId: string; dieId: string; newValue: number | string }
  | { type: 'DRAW_CARD'; deckId: string }
  | { type: 'DISCARD_CARD'; deckId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'RESHUFFLE_DECK'; deckId: string }
  | { type: 'SPLIT_DECK'; deckId: string; numberOfPiles: number; newDeckIds: string[] }
  | { type: 'SET_CURRENT_SHEET'; sheetId: string }
  | { type: 'SET_CURRENT_TOOL'; tool: Tool }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'RESET_SHEET'; sheetId: string }
  | { type: 'LOAD_STATE'; state: GameState };

function gameEngineReducer(state: GameState, action: EngineAction): GameState {
  const now = Date.now();

  switch (action.type) {
    case 'ADD_MARK': {
      const sheetState = state.sheetStates.find((s) => s.sheetId === action.sheetId);
      if (!sheetState) return state;

      const newSheetStates = state.sheetStates.map((s) =>
        s.sheetId === action.sheetId
          ? { ...s, marks: [...s.marks, action.mark] }
          : s
      );

      return {
        ...state,
        sheetStates: newSheetStates,
        updatedAt: now,
      };
    }

    case 'REMOVE_MARK': {
      const sheetState = state.sheetStates.find((s) => s.sheetId === action.sheetId);
      if (!sheetState) return state;

      const newSheetStates = state.sheetStates.map((s) =>
        s.sheetId === action.sheetId
          ? { ...s, marks: s.marks.filter((m) => m.id !== action.markId) }
          : s
      );

      return {
        ...state,
        sheetStates: newSheetStates,
        updatedAt: now,
      };
    }

    case 'MODIFY_MARK': {
      const sheetState = state.sheetStates.find((s) => s.sheetId === action.sheetId);
      if (!sheetState) return state;

      const newSheetStates = state.sheetStates.map((s) =>
        s.sheetId === action.sheetId
          ? {
              ...s,
              marks: s.marks.map((m) =>
                m.id === action.markId ? ({ ...m, ...action.updates } as Mark) : m
              ),
            }
          : s
      );

      return {
        ...state,
        sheetStates: newSheetStates,
        updatedAt: now,
      };
    }

    case 'ROLL_DICE': {
      const pool = state.dicePools.find((p) => p.id === action.poolId);
      if (!pool) return state;

      const newDicePools = state.dicePools.map((p) => {
        if (p.id !== action.poolId) return p;

        const updatedDice = p.dice.map((die) => {
          const result = action.results.find((r) => r.dieId === die.id);
          if (!result || die.isLocked) return die;

          if (die.type === 'standard') {
            return { ...die, currentValue: result.value as number };
          } else {
            return { ...die, currentFace: result.face };
          }
        });

        return { ...p, dice: updatedDice };
      });

      return {
        ...state,
        dicePools: newDicePools,
        updatedAt: now,
      };
    }

    case 'LOCK_DIE': {
      const newDicePools = state.dicePools.map((p) => {
        if (p.id !== action.poolId) return p;
        return {
          ...p,
          dice: p.dice.map((d) =>
            d.id === action.dieId ? { ...d, isLocked: true } : d
          ),
        };
      });

      return {
        ...state,
        dicePools: newDicePools,
        updatedAt: now,
      };
    }

    case 'UNLOCK_DIE': {
      const newDicePools = state.dicePools.map((p) => {
        if (p.id !== action.poolId) return p;
        return {
          ...p,
          dice: p.dice.map((d) =>
            d.id === action.dieId ? { ...d, isLocked: false } : d
          ),
        };
      });

      return {
        ...state,
        dicePools: newDicePools,
        updatedAt: now,
      };
    }

    case 'DRAW_CARD': {
      const deck = state.decks.find((d) => d.id === action.deckId);
      if (!deck || deck.drawPile.length === 0) return state;

      const [drawnCard, ...remainingDraw] = deck.drawPile;

      const newDecks = state.decks.map((d) =>
        d.id === action.deckId
          ? { ...d, drawPile: remainingDraw, currentCard: drawnCard }
          : d
      );

      return {
        ...state,
        decks: newDecks,
        updatedAt: now,
      };
    }

    case 'DISCARD_CARD': {
      const deck = state.decks.find((d) => d.id === action.deckId);
      if (!deck || !deck.currentCard) return state;

      const newDecks = state.decks.map((d) =>
        d.id === action.deckId
          ? {
              ...d,
              discardPile: [...d.discardPile, d.currentCard!],
              currentCard: undefined,
            }
          : d
      );

      return {
        ...state,
        decks: newDecks,
        updatedAt: now,
      };
    }

    case 'SHUFFLE_DECK': {
      const deck = state.decks.find((d) => d.id === action.deckId);
      if (!deck) return state;

      const newDecks = state.decks.map((d) =>
        d.id === action.deckId
          ? { ...d, drawPile: shuffle(d.drawPile) }
          : d
      );

      return {
        ...state,
        decks: newDecks,
        updatedAt: now,
      };
    }

    case 'RESHUFFLE_DECK': {
      const deck = state.decks.find((d) => d.id === action.deckId);
      if (!deck) return state;

      const allCards = [...deck.drawPile, ...deck.discardPile];
      const shuffledCards = shuffle(allCards);

      const newDecks = state.decks.map((d) =>
        d.id === action.deckId
          ? { ...d, drawPile: shuffledCards, discardPile: [] }
          : d
      );

      return {
        ...state,
        decks: newDecks,
        updatedAt: now,
      };
    }

    case 'SET_CURRENT_SHEET': {
      return {
        ...state,
        currentSheetId: action.sheetId,
        updatedAt: now,
      };
    }

    case 'SET_CURRENT_TOOL': {
      return {
        ...state,
        currentTool: action.tool,
        updatedAt: now,
      };
    }

    case 'RESET_SHEET': {
      const newSheetStates = state.sheetStates.map((s) =>
        s.sheetId === action.sheetId ? { ...s, marks: [] } : s
      );

      return {
        ...state,
        sheetStates: newSheetStates,
        updatedAt: now,
      };
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}

// ============================================================================
// GAME ENGINE PROVIDER
// ============================================================================

interface GameEngineProviderProps {
  definition: GameDefinition;
  children: React.ReactNode;
}

export function GameEngineProvider({ definition, children }: GameEngineProviderProps) {
  // Try to load auto-saved state first
  const initialState = (() => {
    const autoSaved = loadAutoSave();
    if (autoSaved && autoSaved.id === definition.id) {
      return autoSaved;
    }

    // Create new game state from definition
    const now = Date.now();
    const sheetStates: SheetState[] = definition.sheets.map((sheet) => ({
      sheetId: sheet.id,
      marks: [],
    }));

    const dicePools: DicePool[] = definition.dicePools || [];
    const decks: DeckState[] =
      definition.decks?.map((deckConfig) => ({
        id: deckConfig.id,
        label: deckConfig.label,
        drawPile: shuffle([...deckConfig.cards]),
        discardPile: [],
        currentCard: undefined,
        metadata: deckConfig.metadata,
      })) || [];

    const newState: GameState = {
      id: definition.id,
      name: definition.name,
      sheets: definition.sheets,
      sheetStates,
      dicePools,
      decks,
      currentSheetId: definition.sheets[0]?.id || '',
      currentTool: definition.defaultTool || { type: 'number' },
      history: [],
      historyIndex: -1,
      createdAt: now,
      updatedAt: now,
      metadata: definition.metadata,
    };

    return newState;
  })();

  const [state, dispatch] = useReducer(gameEngineReducer, initialState);

  // Auto-save on state changes
  useEffect(() => {
    autoSaveGame(state);
  }, [state]);

  // Actions
  const addMark = useCallback((sheetId: string, mark: Omit<Mark, 'id' | 'createdAt'>) => {
    const fullMark = {
      ...mark,
      id: generateMarkId(),
      createdAt: Date.now(),
    } as Mark;
    dispatch({ type: 'ADD_MARK', sheetId, mark: fullMark });
  }, []);

  const removeMark = useCallback((sheetId: string, markId: string) => {
    dispatch({ type: 'REMOVE_MARK', sheetId, markId });
  }, []);

  const modifyMark = useCallback(
    (sheetId: string, markId: string, updates: Partial<Mark>) => {
      dispatch({ type: 'MODIFY_MARK', sheetId, markId, updates });
    },
    []
  );

  const rollDicePool = useCallback(
    (poolId: string, diceIds?: string[]) => {
      const pool = state.dicePools.find((p) => p.id === poolId);
      if (!pool) return;

      const diceToRoll = diceIds
        ? pool.dice.filter((d) => diceIds.includes(d.id) && !d.isLocked)
        : pool.dice.filter((d) => !d.isLocked);

      const results: DieRollResult[] = diceToRoll.map((die) => {
        if (die.type === 'standard') {
          const sides = parseInt(die.dieType.substring(1));
          const value = rollStandardDie(sides);
          return { dieId: die.id, value, timestamp: Date.now() };
        } else {
          // Custom die
          const weights = die.faces.map((f) => f.weight || 1);
          const face = weightedRandomElement(die.faces, weights);
          return { dieId: die.id, value: face.value, face, timestamp: Date.now() };
        }
      });

      dispatch({ type: 'ROLL_DICE', poolId, results });
    },
    [state.dicePools]
  );

  const lockDie = useCallback((poolId: string, dieId: string) => {
    dispatch({ type: 'LOCK_DIE', poolId, dieId });
  }, []);

  const unlockDie = useCallback((poolId: string, dieId: string) => {
    dispatch({ type: 'UNLOCK_DIE', poolId, dieId });
  }, []);

  const modifyDie = useCallback((poolId: string, dieId: string, newValue: number | string) => {
    dispatch({ type: 'MODIFY_DIE', poolId, dieId, newValue });
  }, []);

  const drawCard = useCallback((deckId: string) => {
    dispatch({ type: 'DRAW_CARD', deckId });
  }, []);

  const discardCard = useCallback((deckId: string) => {
    dispatch({ type: 'DISCARD_CARD', deckId });
  }, []);

  const shuffleDeck = useCallback((deckId: string) => {
    dispatch({ type: 'SHUFFLE_DECK', deckId });
  }, []);

  const reshuffleDeck = useCallback((deckId: string) => {
    dispatch({ type: 'RESHUFFLE_DECK', deckId });
  }, []);

  const splitDeck = useCallback((_deckId: string, _numberOfPiles: number): string[] => {
    // This is a simplified version - in a full implementation,
    // would create new deck states for each pile
    return [];
  }, []);

  const setCurrentSheet = useCallback((sheetId: string) => {
    dispatch({ type: 'SET_CURRENT_SHEET', sheetId });
  }, []);

  const setCurrentTool = useCallback((tool: Tool) => {
    dispatch({ type: 'SET_CURRENT_TOOL', tool });
  }, []);

  const undo = useCallback(() => {
    // Simplified - full undo/redo requires maintaining action history
    console.log('Undo not yet implemented');
  }, []);

  const redo = useCallback(() => {
    // Simplified - full undo/redo requires maintaining action history
    console.log('Redo not yet implemented');
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const resetSheet = useCallback((sheetId: string) => {
    dispatch({ type: 'RESET_SHEET', sheetId });
  }, []);

  const value: GameEngineContextValue = {
    state,
    addMark,
    removeMark,
    modifyMark,
    rollDicePool,
    lockDie,
    unlockDie,
    modifyDie,
    drawCard,
    discardCard,
    shuffleDeck,
    reshuffleDeck,
    splitDeck,
    setCurrentSheet,
    setCurrentTool,
    undo,
    redo,
    canUndo: false, // Simplified
    canRedo: false, // Simplified
    reset,
    resetSheet,
  };

  return (
    <GameEngineContext.Provider value={value}>
      {children}
    </GameEngineContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook to access the game engine
 */
export function useGameEngine() {
  const context = useContext(GameEngineContext);
  if (!context) {
    throw new Error('useGameEngine must be used within a GameEngineProvider');
  }
  return context;
}

/**
 * Hook to get the current sheet
 */
export function useCurrentSheet() {
  const { state } = useGameEngine();
  return state.sheets.find((s) => s.id === state.currentSheetId);
}

/**
 * Hook to get marks for a specific sheet
 */
export function useSheetMarks(sheetId: string) {
  const { state } = useGameEngine();
  const sheetState = state.sheetStates.find((s) => s.sheetId === sheetId);
  return sheetState?.marks || [];
}

/**
 * Hook to get a specific dice pool
 */
export function useDicePool(poolId: string) {
  const { state } = useGameEngine();
  return state.dicePools.find((p) => p.id === poolId);
}

/**
 * Hook to get a specific deck
 */
export function useDeck(deckId: string) {
  const { state } = useGameEngine();
  return state.decks.find((d) => d.id === deckId);
}
