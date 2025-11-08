/**
 * Game state context with undo/redo support
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { GameState, Action, GameConfig, SheetState } from '../types';
import { gameReducer } from './reducer';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

interface HistoryState {
  past: GameState[];
  present: GameState;
  future: GameState[];
}

type HistoryAction =
  | { type: 'PERFORM'; action: Action }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; initialState: GameState };

/**
 * Reducer that adds undo/redo support to the game reducer
 */
function historyReducer(historyState: HistoryState, historyAction: HistoryAction): HistoryState {
  switch (historyAction.type) {
    case 'PERFORM': {
      const { action } = historyAction;

      // Don't add to history for UNDO/REDO actions
      if (action.type === 'UNDO' || action.type === 'REDO') {
        return historyState;
      }

      // Don't add to history for tool/color/symbol selection (UI state only)
      if (
        action.type === 'SELECT_TOOL' ||
        action.type === 'SELECT_COLOR' ||
        action.type === 'SELECT_SYMBOL' ||
        action.type === 'SET_PERMANENCE' ||
        action.type === 'SWITCH_SHEET'
      ) {
        return {
          ...historyState,
          present: gameReducer(historyState.present, action),
        };
      }

      const newPresent = gameReducer(historyState.present, action);

      return {
        past: [...historyState.past, historyState.present],
        present: newPresent,
        future: [], // Clear future when new action is performed
      };
    }

    case 'UNDO': {
      if (historyState.past.length === 0) {
        return historyState;
      }

      const previous = historyState.past[historyState.past.length - 1];
      const newPast = historyState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [historyState.present, ...historyState.future],
      };
    }

    case 'REDO': {
      if (historyState.future.length === 0) {
        return historyState;
      }

      const next = historyState.future[0];
      const newFuture = historyState.future.slice(1);

      return {
        past: [...historyState.past, historyState.present],
        present: next,
        future: newFuture,
      };
    }

    case 'RESET': {
      return {
        past: [],
        present: historyAction.initialState,
        future: [],
      };
    }

    default:
      return historyState;
  }
}

/**
 * Create initial game state from config
 */
function createInitialState(config: GameConfig): GameState {
  const sheetStates: SheetState[] = config.sheets.map(sheet => ({
    sheetId: sheet.id,
    marks: new Map(),
  }));

  return {
    gameId: config.id,
    sheets: config.sheets,
    currentSheetIndex: 0,
    sheetStates,
    dicePools: config.dicePools || [],
    diceHistory: [],
    decks: config.decks || [],
    selectedTool: config.defaultTool || 'checkbox',
    permanence: 'pen',
    metadata: config.metadata,
  };
}

interface GameProviderProps {
  config: GameConfig;
  autoSave?: boolean;
  children: React.ReactNode;
}

/**
 * Game state provider with undo/redo support and auto-save
 */
export function GameProvider({ config, autoSave = true, children }: GameProviderProps) {
  const initialState = createInitialState(config);

  // Try to load saved state on mount
  const loadedState = loadFromLocalStorage(config.id);
  const startState = loadedState || initialState;

  const [historyState, historyDispatch] = useReducer(historyReducer, {
    past: [],
    present: startState,
    future: [],
  });

  const dispatch = useCallback((action: Action) => {
    historyDispatch({ type: 'PERFORM', action });
  }, []);

  const undo = useCallback(() => {
    historyDispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    historyDispatch({ type: 'REDO' });
  }, []);

  const reset = useCallback(() => {
    historyDispatch({ type: 'RESET', initialState });
  }, [initialState]);

  // Auto-save to localStorage
  useEffect(() => {
    if (autoSave) {
      saveToLocalStorage(config.id, historyState.present);
    }
  }, [historyState.present, config.id, autoSave]);

  const contextValue: GameContextValue = {
    state: historyState.present,
    dispatch,
    undo,
    redo,
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0,
    reset,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}

/**
 * Hook to access game state and actions
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/**
 * Hook to get current sheet
 */
export function useCurrentSheet() {
  const { state } = useGame();
  return state.sheets[state.currentSheetIndex];
}

/**
 * Hook to get current sheet state
 */
export function useCurrentSheetState() {
  const { state } = useGame();
  return state.sheetStates[state.currentSheetIndex];
}

/**
 * Hook to get marks for a specific hotspot
 */
export function useHotspotMarks(hotspotId: string) {
  const sheetState = useCurrentSheetState();
  return sheetState.marks.get(hotspotId) || [];
}
