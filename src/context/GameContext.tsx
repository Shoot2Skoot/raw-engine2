import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  GameDefinition,
  GameState,
  GameAction,
  Mark,
  SheetState,
  DicePoolState,
  DeckState,
} from '../types';

/**
 * Game Context Type
 */
interface GameContextType {
  definition: GameDefinition;
  state: GameState;
  dispatch: React.Dispatch<GameAction>;

  // Convenience methods
  addMark: (mark: Mark) => void;
  removeMark: (markId: string) => void;
  updateMark: (markId: string, updates: Partial<Mark>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setCurrentSheet: (sheetId: string) => void;
  setCurrentTool: (toolType: string) => void;
  saveGame: () => void;
  loadGame: (savedState: GameState) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

/**
 * Initial game state factory
 */
function createInitialState(definition: GameDefinition): GameState {
  const sheets = new Map<string, SheetState>();
  definition.sheets.forEach(sheet => {
    sheets.set(sheet.id, {
      id: sheet.id,
      hotspots: [],
      marks: new Map(),
    });
  });

  const dicePools = new Map<string, DicePoolState>();
  definition.dicePools?.forEach(pool => {
    dicePools.set(pool.id, {
      id: pool.id,
      dice: [],
      rollHistory: [],
    });
  });

  const decks = new Map<string, DeckState>();
  definition.decks?.forEach(deck => {
    decks.set(deck.id, {
      id: deck.id,
      drawPile: [],
      discardPile: [],
      isShuffled: false,
      drawHistory: [],
    });
  });

  return {
    gameId: definition.id,
    sessionId: crypto.randomUUID(),
    startTime: Date.now(),
    currentSheetId: definition.sheets[0]?.id || '',
    currentTool: definition.tools[0]?.type || 'number',
    marks: [],
    sheets,
    dicePools,
    decks,
    history: [],
    historyIndex: -1,
    ui: {
      isPencilMode: false,
      zoom: 1,
      pan: { x: 0, y: 0 },
    },
  };
}

/**
 * Game reducer
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_MARK': {
      const newMarks = [...state.marks, action.mark];

      // Add history entry
      const historyEntry = {
        timestamp: Date.now(),
        action,
        inverseAction: { type: 'REMOVE_MARK' as const, markId: action.mark.id },
      };

      return {
        ...state,
        marks: newMarks,
        history: [...state.history.slice(0, state.historyIndex + 1), historyEntry],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_MARK': {
      const markToRemove = state.marks.find(m => m.id === action.markId);
      const newMarks = state.marks.filter(m => m.id !== action.markId);

      if (markToRemove) {
        const historyEntry = {
          timestamp: Date.now(),
          action,
          inverseAction: { type: 'ADD_MARK' as const, mark: markToRemove },
        };

        return {
          ...state,
          marks: newMarks,
          history: [...state.history.slice(0, state.historyIndex + 1), historyEntry],
          historyIndex: state.historyIndex + 1,
        };
      }

      return state;
    }

    case 'UPDATE_MARK': {
      const newMarks = state.marks.map(mark =>
        mark.id === action.markId ? { ...mark, ...action.updates } as Mark : mark
      );

      return {
        ...state,
        marks: newMarks,
      };
    }

    // Dice actions would go here
    case 'ROLL_DICE':
    case 'LOCK_DIE':
    case 'UNLOCK_DIE':
    case 'MODIFY_DIE':
      // TODO: Implement dice actions
      return state;

    // Card actions would go here
    case 'DRAW_CARD':
    case 'DISCARD_CARD':
    case 'SHUFFLE_DECK':
    case 'RESHUFFLE_DISCARD':
    case 'SPLIT_DECK':
      // TODO: Implement card actions
      return state;

    default:
      return state;
  }
}

/**
 * Game Provider Component
 */
interface GameProviderProps {
  definition: GameDefinition;
  children: React.ReactNode;
  initialState?: GameState;
}

export function GameProvider({ definition, children, initialState }: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState || createInitialState(definition)
  );

  // Auto-save to localStorage
  useEffect(() => {
    if (definition.settings?.autosave !== false) {
      const saveKey = `game_${definition.id}_${state.sessionId}`;
      localStorage.setItem(saveKey, JSON.stringify(state));

      // Also save to latest
      localStorage.setItem(`game_${definition.id}_latest`, JSON.stringify(state));
    }
  }, [state, definition.id, definition.settings?.autosave]);

  // Convenience methods
  const addMark = useCallback((mark: Mark) => {
    dispatch({ type: 'ADD_MARK', mark });
  }, []);

  const removeMark = useCallback((markId: string) => {
    dispatch({ type: 'REMOVE_MARK', markId });
  }, []);

  const updateMark = useCallback((markId: string, updates: Partial<Mark>) => {
    dispatch({ type: 'UPDATE_MARK', markId, updates });
  }, []);

  const undo = useCallback(() => {
    if (state.historyIndex >= 0) {
      const entry = state.history[state.historyIndex];
      dispatch(entry.inverseAction);
    }
  }, [state.historyIndex, state.history]);

  const redo = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      const entry = state.history[state.historyIndex + 1];
      dispatch(entry.action);
    }
  }, [state.historyIndex, state.history]);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const setCurrentSheet = useCallback((_sheetId: string) => {
    // This would be implemented as a dispatch action
    // For now, direct state update (we'll refactor)
  }, []);

  const setCurrentTool = useCallback((_toolType: string) => {
    // This would be implemented as a dispatch action
  }, []);

  const saveGame = useCallback(() => {
    const savedGame = {
      version: '1.0.0',
      gameDefinitionId: definition.id,
      gameState: state,
      savedAt: Date.now(),
    };

    const blob = new Blob([JSON.stringify(savedGame, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${definition.name}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [definition, state]);

  const loadGame = useCallback((_savedState: GameState) => {
    // This would restore the full state
    // For now, placeholder
  }, []);

  const resetGame = useCallback(() => {
    // Reset to initial state
    // const newState = createInitialState(definition);
    // Would need to update the reducer to handle RESET action
  }, [definition]);

  const contextValue: GameContextType = {
    definition,
    state,
    dispatch,
    addMark,
    removeMark,
    updateMark,
    undo,
    redo,
    canUndo,
    canRedo,
    setCurrentSheet,
    setCurrentTool,
    saveGame,
    loadGame,
    resetGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to use game context
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
