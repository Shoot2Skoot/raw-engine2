/**
 * Game Context - provides game state and actions to all components
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type {
  GameState,
  GameConfig,
  GameAction,
  Mark,
  DieResult,
  Card,
} from '../types';
import {
  createInitialGameState,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '../types';

/** Actions that can be dispatched to modify game state */
type GameStateAction =
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | {
      type: 'PLACE_MARK';
      payload: { sheetId: string; hotspotId: string; mark: Mark };
    }
  | {
      type: 'REMOVE_MARK';
      payload: { sheetId: string; hotspotId: string; markId: string };
    }
  | { type: 'ROLL_DICE'; payload: { poolId: string; results: DieResult[] } }
  | { type: 'TOGGLE_DIE_LOCK'; payload: { poolId: string; dieIndex: number } }
  | { type: 'DRAW_CARD'; payload: { deckId: string; card: Card } }
  | { type: 'DISCARD_CARD'; payload: { deckId: string } }
  | { type: 'SWITCH_SHEET'; payload: { sheetIndex: number } }
  | { type: 'SELECT_TOOL'; payload: { toolIndex: number } }
  | { type: 'TOGGLE_MARK_MODE' };

/** Game context value */
interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameStateAction>;
  canUndo: boolean;
  canRedo: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Create a game action for the undo/redo stack */
function createGameAction(
  type: GameAction['type'],
  previousState: Partial<GameState>,
  newState: Partial<GameState>,
  description: string
): GameAction {
  return {
    type,
    timestamp: Date.now(),
    previousState,
    newState,
    description,
  };
}

/** Game state reducer */
function gameReducer(state: GameState, action: GameStateAction): GameState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;

      const lastAction = state.undoStack[state.undoStack.length - 1];
      const newState = {
        ...state,
        ...lastAction.previousState,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, lastAction],
      };

      return newState;
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;

      const nextAction = state.redoStack[state.redoStack.length - 1];
      const newState = {
        ...state,
        ...nextAction.newState,
        undoStack: [...state.undoStack, nextAction],
        redoStack: state.redoStack.slice(0, -1),
      };

      return newState;
    }

    case 'RESET': {
      return createInitialGameState(state.config);
    }

    case 'PLACE_MARK': {
      const { sheetId, hotspotId, mark } = action.payload;
      const sheetIndex = state.sheets.findIndex((s) => s.sheet.id === sheetId);

      if (sheetIndex === -1) return state;

      const newSheets = [...state.sheets];
      const hotspotState = newSheets[sheetIndex].hotspots.get(hotspotId);

      if (!hotspotState) return state;

      const newHotspots = new Map(newSheets[sheetIndex].hotspots);
      newHotspots.set(hotspotId, {
        ...hotspotState,
        marks: [...hotspotState.marks, mark],
      });

      newSheets[sheetIndex] = {
        ...newSheets[sheetIndex],
        hotspots: newHotspots,
      };

      const gameAction = createGameAction(
        'PLACE_MARK',
        { sheets: state.sheets },
        { sheets: newSheets },
        `Place ${mark.type} mark`
      );

      return {
        ...state,
        sheets: newSheets,
        undoStack: [...state.undoStack, gameAction],
        redoStack: [], // Clear redo stack on new action
        lastSaved: Date.now(),
      };
    }

    case 'REMOVE_MARK': {
      const { sheetId, hotspotId, markId } = action.payload;
      const sheetIndex = state.sheets.findIndex((s) => s.sheet.id === sheetId);

      if (sheetIndex === -1) return state;

      const newSheets = [...state.sheets];
      const hotspotState = newSheets[sheetIndex].hotspots.get(hotspotId);

      if (!hotspotState) return state;

      const newHotspots = new Map(newSheets[sheetIndex].hotspots);
      newHotspots.set(hotspotId, {
        ...hotspotState,
        marks: hotspotState.marks.filter((m) => m.id !== markId),
      });

      newSheets[sheetIndex] = {
        ...newSheets[sheetIndex],
        hotspots: newHotspots,
      };

      const gameAction = createGameAction(
        'REMOVE_MARK',
        { sheets: state.sheets },
        { sheets: newSheets },
        'Remove mark'
      );

      return {
        ...state,
        sheets: newSheets,
        undoStack: [...state.undoStack, gameAction],
        redoStack: [],
        lastSaved: Date.now(),
      };
    }

    case 'ROLL_DICE': {
      const { poolId, results } = action.payload;
      const poolIndex = state.dicePools.findIndex((p) => p.pool.id === poolId);

      if (poolIndex === -1) return state;

      const newPools = [...state.dicePools];
      newPools[poolIndex] = {
        ...newPools[poolIndex],
        results,
        history: [
          ...newPools[poolIndex].history.slice(-9),
          results,
        ],
      };

      const gameAction = createGameAction(
        'ROLL_DICE',
        { dicePools: state.dicePools },
        { dicePools: newPools },
        'Roll dice'
      );

      return {
        ...state,
        dicePools: newPools,
        undoStack: [...state.undoStack, gameAction],
        redoStack: [],
        lastSaved: Date.now(),
      };
    }

    case 'TOGGLE_DIE_LOCK': {
      const { poolId, dieIndex } = action.payload;
      const poolIndex = state.dicePools.findIndex((p) => p.pool.id === poolId);

      if (poolIndex === -1 || !state.dicePools[poolIndex].results[dieIndex]) {
        return state;
      }

      const newPools = [...state.dicePools];
      const newResults = [...newPools[poolIndex].results];
      newResults[dieIndex] = {
        ...newResults[dieIndex],
        locked: !newResults[dieIndex].locked,
      };

      newPools[poolIndex] = {
        ...newPools[poolIndex],
        results: newResults,
      };

      return {
        ...state,
        dicePools: newPools,
        lastSaved: Date.now(),
      };
    }

    case 'SWITCH_SHEET': {
      const { sheetIndex } = action.payload;

      if (sheetIndex < 0 || sheetIndex >= state.sheets.length) {
        return state;
      }

      return {
        ...state,
        activeSheetIndex: sheetIndex,
      };
    }

    case 'SELECT_TOOL': {
      const { toolIndex } = action.payload;

      if (toolIndex < 0 || toolIndex >= state.tools.availableTools.length) {
        return state;
      }

      return {
        ...state,
        tools: {
          ...state.tools,
          currentTool: state.tools.availableTools[toolIndex],
        },
      };
    }

    case 'TOGGLE_MARK_MODE': {
      return {
        ...state,
        tools: {
          ...state.tools,
          markMode: state.tools.markMode === 'pen' ? 'pencil' : 'pen',
        },
      };
    }

    default:
      return state;
  }
}

/** Game Context Provider props */
interface GameProviderProps {
  children: ReactNode;
  initialConfig: GameConfig;
  autoSaveKey?: string;
}

/** Game Context Provider */
export function GameProvider({
  children,
  initialConfig,
  autoSaveKey = 'gameState',
}: GameProviderProps) {
  // Try to load saved state, fallback to initial config
  const loadInitialState = useCallback(() => {
    const savedState = loadFromLocalStorage(autoSaveKey);
    return savedState || createInitialGameState(initialConfig);
  }, [initialConfig, autoSaveKey]);

  const [state, dispatch] = useReducer(gameReducer, null, loadInitialState);

  // Auto-save to localStorage on state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(state, autoSaveKey);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [state, autoSaveKey]);

  const contextValue: GameContextValue = {
    state,
    dispatch,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

/** Hook to use game context */
export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
