/**
 * Game Context - Central state management for the game engine
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  GameState,
  GameConfig,
  Mark,
  GameAction,
  DieResult,
  Card,
  ActiveTool,
  GameEvent,
  GameEventHandler,
} from '../types';
import {
  createInitialGameState,
  generateId,
  rollDie,
  shuffleArray,
  createInverseAction,
  canPlaceMark,
} from '../utils/gameState';

interface GameContextType {
  state: GameState;
  addMark: (mark: Omit<Mark, 'id' | 'timestamp'>) => void;
  removeMark: (markId: string) => void;
  modifyMark: (markId: string, updates: Partial<Mark>) => void;
  rollDicePool: (poolId: string, diceIndices?: number[]) => void;
  lockDie: (poolId: string, dieIndex: number) => void;
  unlockDie: (poolId: string, dieIndex: number) => void;
  modifyDieResult: (poolId: string, dieIndex: number, modification: 'increment' | 'decrement' | 'flip' | number) => void;
  drawCard: (deckId: string) => void;
  discardCard: (deckId: string) => void;
  shuffleDeck: (deckId: string, includeDiscard?: boolean) => void;
  splitDeck: (deckId: string, pileCount: number) => string[];
  setActiveTool: (tool: ActiveTool) => void;
  switchSheet: (sheetId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (sheetId?: string) => void;
  addEventListener: (handler: GameEventHandler) => () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  config: GameConfig;
  children: React.ReactNode;
}

type GameReducerAction =
  | { type: 'ADD_MARK'; mark: Mark }
  | { type: 'REMOVE_MARK'; markId: string }
  | { type: 'MODIFY_MARK'; markId: string; updates: Partial<Mark> }
  | { type: 'ROLL_DICE_POOL'; poolId: string; results: DieResult[] }
  | { type: 'LOCK_DIE'; poolId: string; dieIndex: number }
  | { type: 'UNLOCK_DIE'; poolId: string; dieIndex: number }
  | { type: 'MODIFY_DIE_RESULT'; poolId: string; dieIndex: number; newResult: any }
  | { type: 'DRAW_CARD'; deckId: string; card: Card }
  | { type: 'DISCARD_CARD'; deckId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string; newDrawPile: Card[] }
  | { type: 'SET_ACTIVE_TOOL'; tool: ActiveTool }
  | { type: 'SWITCH_SHEET'; sheetId: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; sheetId?: string }
  | { type: 'ADD_TO_HISTORY'; action: GameAction };

function gameReducer(state: GameState, action: GameReducerAction): GameState {
  switch (action.type) {
    case 'ADD_MARK':
      return {
        ...state,
        marks: [...state.marks, action.mark],
        lastModified: Date.now(),
      };

    case 'REMOVE_MARK':
      return {
        ...state,
        marks: state.marks.filter((m) => m.id !== action.markId),
        lastModified: Date.now(),
      };

    case 'MODIFY_MARK':
      return {
        ...state,
        marks: state.marks.map((m) =>
          m.id === action.markId ? ({ ...m, ...action.updates } as Mark) : m
        ),
        lastModified: Date.now(),
      };

    case 'ROLL_DICE_POOL':
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId ? { ...pool, results: action.results } : pool
        ),
        diceRollHistory: [
          ...state.diceRollHistory,
          {
            timestamp: Date.now(),
            poolId: action.poolId,
            results: action.results,
          },
        ],
        lastModified: Date.now(),
      };

    case 'LOCK_DIE':
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId
            ? {
                ...pool,
                results: pool.results.map((r, i) =>
                  i === action.dieIndex ? { ...r, locked: true } : r
                ),
              }
            : pool
        ),
      };

    case 'UNLOCK_DIE':
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId
            ? {
                ...pool,
                results: pool.results.map((r, i) =>
                  i === action.dieIndex ? { ...r, locked: false } : r
                ),
              }
            : pool
        ),
      };

    case 'MODIFY_DIE_RESULT':
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.poolId
            ? {
                ...pool,
                results: pool.results.map((r, i) =>
                  i === action.dieIndex
                    ? { ...r, result: action.newResult, modified: true }
                    : r
                ),
              }
            : pool
        ),
      };

    case 'DRAW_CARD':
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.deckId
            ? {
                ...deck,
                drawPile: deck.drawPile.slice(1),
                currentCard: action.card,
              }
            : deck
        ),
        lastModified: Date.now(),
      };

    case 'DISCARD_CARD':
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.deckId && deck.currentCard
            ? {
                ...deck,
                discardPile: [...deck.discardPile, deck.currentCard],
                currentCard: undefined,
              }
            : deck
        ),
      };

    case 'SHUFFLE_DECK':
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.deckId
            ? { ...deck, drawPile: action.newDrawPile }
            : deck
        ),
      };

    case 'SET_ACTIVE_TOOL':
      return {
        ...state,
        activeTool: action.tool,
      };

    case 'SWITCH_SHEET':
      return {
        ...state,
        currentSheetId: action.sheetId,
      };

    case 'ADD_TO_HISTORY':
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        history: [...newHistory, action.action],
        historyIndex: newHistory.length,
      };

    case 'UNDO':
      if (state.historyIndex < 0) return state;
      const undoAction = state.history[state.historyIndex];
      return {
        ...state,
        historyIndex: state.historyIndex - 1,
      };

    case 'REDO':
      if (state.historyIndex >= state.history.length - 1) return state;
      return {
        ...state,
        historyIndex: state.historyIndex + 1,
      };

    case 'RESET':
      if (action.sheetId) {
        // Reset specific sheet
        return {
          ...state,
          marks: state.marks.filter((m) => {
            const sheet = state.sheets.find((s) => s.id === action.sheetId);
            return !sheet?.hotspots.some((h) => h.id === m.hotspotId);
          }),
          lastModified: Date.now(),
        };
      } else {
        // Reset entire game
        return {
          ...state,
          marks: [],
          dicePools: state.dicePools.map((pool) => ({ ...pool, results: [] })),
          decks: state.decks.map((deck) => ({
            ...deck,
            drawPile: shuffleArray([...deck.cards]),
            discardPile: [],
            currentCard: undefined,
          })),
          history: [],
          historyIndex: -1,
          diceRollHistory: [],
          lastModified: Date.now(),
        };
      }

    default:
      return state;
  }
}

export function GameProvider({ config, children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialGameState(config));
  const eventListeners = React.useRef<GameEventHandler[]>([]);

  const emitEvent = useCallback((event: GameEvent) => {
    eventListeners.current.forEach((handler) => handler(event));
  }, []);

  const addMark = useCallback(
    (mark: Omit<Mark, 'id' | 'timestamp'>) => {
      const completeMark: Mark = {
        ...mark,
        id: generateId(),
        timestamp: Date.now(),
      } as Mark;

      // Validate mark placement
      const sheet = state.sheets.find((s) => s.id === state.currentSheetId);
      const hotspot = sheet?.hotspots.find((h) => h.id === mark.hotspotId);

      if (hotspot) {
        const validation = canPlaceMark(hotspot, completeMark, state.marks);
        if (!validation.allowed) {
          console.warn('Cannot place mark:', validation.reason);
          return;
        }
      }

      dispatch({ type: 'ADD_MARK', mark: completeMark });

      const action: GameAction = {
        id: generateId(),
        type: 'addMark',
        timestamp: Date.now(),
        data: { mark: completeMark },
      };
      dispatch({ type: 'ADD_TO_HISTORY', action });
      emitEvent({ type: 'markAdded', mark: completeMark });
    },
    [state.sheets, state.currentSheetId, state.marks, emitEvent]
  );

  const removeMark = useCallback(
    (markId: string) => {
      const removedMark = state.marks.find((m) => m.id === markId);
      if (!removedMark) return;

      dispatch({ type: 'REMOVE_MARK', markId });

      const action: GameAction = {
        id: generateId(),
        type: 'removeMark',
        timestamp: Date.now(),
        data: { markId, removedMark },
      };
      dispatch({ type: 'ADD_TO_HISTORY', action });
      emitEvent({ type: 'markRemoved', markId });
    },
    [state.marks, emitEvent]
  );

  const modifyMark = useCallback(
    (markId: string, updates: Partial<Mark>) => {
      const mark = state.marks.find((m) => m.id === markId);
      if (!mark) return;

      dispatch({ type: 'MODIFY_MARK', markId, updates });

      const action: GameAction = {
        id: generateId(),
        type: 'modifyMark',
        timestamp: Date.now(),
        data: { markId, previousState: mark, newState: { ...mark, ...updates } },
      };
      dispatch({ type: 'ADD_TO_HISTORY', action });
      emitEvent({ type: 'markModified', mark: { ...mark, ...updates } as Mark });
    },
    [state.marks, emitEvent]
  );

  const rollDicePool = useCallback(
    (poolId: string, diceIndices?: number[]) => {
      const pool = state.dicePools.find((p) => p.id === poolId);
      if (!pool) return;

      const results: DieResult[] = pool.dice.map((dieConfig, index) => {
        // Check if this die should be re-rolled
        const shouldReroll = !diceIndices || diceIndices.includes(index);
        const existingResult = pool.results[index];

        if (!shouldReroll && existingResult?.locked) {
          return existingResult;
        }

        const result = rollDie(dieConfig);
        return {
          dieId: generateId(),
          config: dieConfig,
          result,
          locked: false,
          modified: false,
        };
      });

      dispatch({ type: 'ROLL_DICE_POOL', poolId, results });
      emitEvent({ type: 'diceRolled', poolId, results });
    },
    [state.dicePools, emitEvent]
  );

  const lockDie = useCallback((poolId: string, dieIndex: number) => {
    dispatch({ type: 'LOCK_DIE', poolId, dieIndex });
  }, []);

  const unlockDie = useCallback((poolId: string, dieIndex: number) => {
    dispatch({ type: 'UNLOCK_DIE', poolId, dieIndex });
  }, []);

  const modifyDieResult = useCallback(
    (poolId: string, dieIndex: number, modification: 'increment' | 'decrement' | 'flip' | number) => {
      const pool = state.dicePools.find((p) => p.id === poolId);
      if (!pool || !pool.results[dieIndex]) return;

      const current = pool.results[dieIndex];
      let newResult = current.result;

      if (typeof modification === 'number') {
        newResult = modification;
      } else if (current.config.type === 'standard') {
        const sides = parseInt(current.config.dieType.substring(1));
        const currentValue = current.result as number;

        if (modification === 'increment') {
          newResult = currentValue < sides ? currentValue + 1 : currentValue;
        } else if (modification === 'decrement') {
          newResult = currentValue > 1 ? currentValue - 1 : currentValue;
        } else if (modification === 'flip') {
          newResult = sides - currentValue + 1;
        }
      }

      dispatch({ type: 'MODIFY_DIE_RESULT', poolId, dieIndex, newResult });
    },
    [state.dicePools]
  );

  const drawCard = useCallback(
    (deckId: string) => {
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck || deck.drawPile.length === 0) return;

      const card = deck.drawPile[0];
      dispatch({ type: 'DRAW_CARD', deckId, card });
      emitEvent({ type: 'cardDrawn', deckId, card });
    },
    [state.decks, emitEvent]
  );

  const discardCard = useCallback((deckId: string) => {
    dispatch({ type: 'DISCARD_CARD', deckId });
  }, []);

  const shuffleDeck = useCallback(
    (deckId: string, includeDiscard = false) => {
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck) return;

      const cardsToShuffle = includeDiscard
        ? [...deck.drawPile, ...deck.discardPile]
        : [...deck.drawPile];

      const newDrawPile = shuffleArray(cardsToShuffle);
      dispatch({ type: 'SHUFFLE_DECK', deckId, newDrawPile });

      if (includeDiscard) {
        // Clear discard pile
        const updatedDeck = state.decks.find((d) => d.id === deckId);
        if (updatedDeck) {
          updatedDeck.discardPile = [];
        }
      }

      emitEvent({ type: 'deckShuffled', deckId });
    },
    [state.decks, emitEvent]
  );

  const splitDeck = useCallback(
    (deckId: string, pileCount: number): string[] => {
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck) return [];

      const pileSize = Math.floor(deck.drawPile.length / pileCount);
      const pileIds: string[] = [];

      for (let i = 0; i < pileCount; i++) {
        const start = i * pileSize;
        const end = i === pileCount - 1 ? deck.drawPile.length : start + pileSize;
        // const pileCards = deck.drawPile.slice(start, end);

        const newPileId = `${deckId}-pile-${i}`;
        pileIds.push(newPileId);

        // This would require adding new decks to state - simplified for now
        // In a real implementation, we'd dispatch an action to create new deck entries
      }

      return pileIds;
    },
    [state.decks]
  );

  const setActiveTool = useCallback((tool: ActiveTool) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', tool });
    emitEvent({ type: 'toolChanged', tool });
  }, [emitEvent]);

  const switchSheet = useCallback((sheetId: string) => {
    dispatch({ type: 'SWITCH_SHEET', sheetId });
    emitEvent({ type: 'sheetChanged', sheetId });
  }, [emitEvent]);

  const undo = useCallback(() => {
    if (state.historyIndex < 0) return;

    const action = state.history[state.historyIndex];
    const inverseAction = createInverseAction(action);

    // Apply inverse action
    if (inverseAction.type === 'addMark') {
      dispatch({ type: 'ADD_MARK', mark: inverseAction.data.mark });
    } else if (inverseAction.type === 'removeMark') {
      dispatch({ type: 'REMOVE_MARK', markId: inverseAction.data.markId });
    }

    dispatch({ type: 'UNDO' });
    emitEvent({ type: 'undo', action });
  }, [state.history, state.historyIndex, emitEvent]);

  const redo = useCallback(() => {
    if (state.historyIndex >= state.history.length - 1) return;

    const action = state.history[state.historyIndex + 1];

    // Apply action
    if (action.type === 'addMark') {
      dispatch({ type: 'ADD_MARK', mark: action.data.mark });
    } else if (action.type === 'removeMark') {
      dispatch({ type: 'REMOVE_MARK', markId: action.data.markId });
    }

    dispatch({ type: 'REDO' });
    emitEvent({ type: 'redo', action });
  }, [state.history, state.historyIndex, emitEvent]);

  const reset = useCallback((sheetId?: string) => {
    if (window.confirm('Are you sure you want to reset? This cannot be undone.')) {
      dispatch({ type: 'RESET', sheetId });
    }
  }, []);

  const addEventListener = useCallback((handler: GameEventHandler) => {
    eventListeners.current.push(handler);
    return () => {
      eventListeners.current = eventListeners.current.filter((h) => h !== handler);
    };
  }, []);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: GameContextType = {
    state,
    addMark,
    removeMark,
    modifyMark,
    rollDicePool,
    lockDie,
    unlockDie,
    modifyDieResult,
    drawCard,
    discardCard,
    shuffleDeck,
    splitDeck,
    setActiveTool,
    switchSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    addEventListener,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
