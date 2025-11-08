/**
 * Game state management with React Context
 * Provides centralized state and auto-save to localStorage
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameConfig,
  GameAction,
  Mark,
  DicePool,
  ToolState,
} from '../types';

// ============================================================================
// ACTION TYPES
// ============================================================================

type StateAction =
  | { type: 'INIT_GAME'; payload: GameConfig }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'SWITCH_SHEET'; payload: string }
  | { type: 'ADD_MARK'; payload: { sheetId: string; mark: Mark } }
  | { type: 'REMOVE_MARK'; payload: { sheetId: string; markId: string } }
  | { type: 'UPDATE_MARK'; payload: { sheetId: string; markId: string; mark: Partial<Mark> } }
  | { type: 'ROLL_DICE'; payload: { poolId: string; results: DicePool['results'] } }
  | { type: 'LOCK_DIE'; payload: { poolId: string; dieIndex: number; locked: boolean } }
  | { type: 'DRAW_CARD'; payload: { deckId: string; cardId: string } }
  | { type: 'DISCARD_CARD'; payload: { deckId: string; cardId: string } }
  | { type: 'SHUFFLE_DECK'; payload: { deckId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_SHEET'; payload: string }
  | { type: 'RESET_GAME' };

// ============================================================================
// CONTEXT
// ============================================================================

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<StateAction>;
  toolState: ToolState;
  setToolState: React.Dispatch<React.SetStateAction<ToolState>>;

  // Helper methods
  addMark: (sheetId: string, mark: Mark) => void;
  removeMark: (sheetId: string, markId: string) => void;
  switchSheet: (sheetId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Persistence
  saveToFile: () => void;
  loadFromFile: (file: File) => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

// ============================================================================
// REDUCER
// ============================================================================

function gameReducer(state: GameState, action: StateAction): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        config: action.payload,
        currentSheetId: action.payload.sheets[0]?.id || '',
        marks: {},
        dicePools: action.payload.dicePools || [],
        decks: action.payload.decks || [],
        history: [],
        historyIndex: -1,
      };

    case 'LOAD_STATE':
      return action.payload;

    case 'SWITCH_SHEET':
      return {
        ...state,
        currentSheetId: action.payload,
      };

    case 'ADD_MARK': {
      const { sheetId, mark } = action.payload;
      const sheetMarks = state.marks[sheetId] || [];

      // Create action for history
      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'mark_place',
        timestamp: Date.now(),
        data: { sheetId, mark },
        sheetId,
      };

      return {
        ...state,
        marks: {
          ...state.marks,
          [sheetId]: [...sheetMarks, mark],
        },
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_MARK': {
      const { sheetId, markId } = action.payload;
      const sheetMarks = state.marks[sheetId] || [];
      const removedMark = sheetMarks.find(m => m.id === markId);

      if (!removedMark) return state;

      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'mark_remove',
        timestamp: Date.now(),
        data: { sheetId, mark: removedMark },
        sheetId,
      };

      return {
        ...state,
        marks: {
          ...state.marks,
          [sheetId]: sheetMarks.filter(m => m.id !== markId),
        },
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_MARK': {
      const { sheetId, markId, mark: updates } = action.payload;
      const sheetMarks = state.marks[sheetId] || [];
      const existingMark = sheetMarks.find(m => m.id === markId);

      if (!existingMark) return state;

      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'mark_modify',
        timestamp: Date.now(),
        data: { sheetId, markId, oldMark: existingMark, updates },
        sheetId,
      };

      return {
        ...state,
        marks: {
          ...state.marks,
          [sheetId]: sheetMarks.map(m =>
            m.id === markId ? { ...m, ...updates } as Mark : m
          ),
        },
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'ROLL_DICE': {
      const { poolId, results } = action.payload;

      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'dice_roll',
        timestamp: Date.now(),
        data: { poolId, results },
      };

      return {
        ...state,
        dicePools: state.dicePools.map(pool =>
          pool.id === poolId ? { ...pool, results } : pool
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'LOCK_DIE': {
      const { poolId, dieIndex, locked } = action.payload;

      return {
        ...state,
        dicePools: state.dicePools.map(pool =>
          pool.id === poolId
            ? {
                ...pool,
                results: pool.results.map((result, idx) =>
                  idx === dieIndex ? { ...result, locked } : result
                ),
              }
            : pool
        ),
      };
    }

    case 'DRAW_CARD': {
      const { deckId, cardId } = action.payload;

      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'card_draw',
        timestamp: Date.now(),
        data: { deckId, cardId },
      };

      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === deckId
            ? {
                ...deck,
                drawPile: deck.drawPile.filter(id => id !== cardId),
                currentCard: cardId,
              }
            : deck
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'DISCARD_CARD': {
      const { deckId, cardId } = action.payload;

      const gameAction: GameAction = {
        id: `action-${Date.now()}`,
        type: 'card_discard',
        timestamp: Date.now(),
        data: { deckId, cardId },
      };

      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === deckId
            ? {
                ...deck,
                discardPile: [...deck.discardPile, cardId],
                currentCard: deck.currentCard === cardId ? undefined : deck.currentCard,
              }
            : deck
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), gameAction],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SHUFFLE_DECK': {
      const { deckId } = action.payload;

      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === deckId
            ? {
                ...deck,
                drawPile: shuffleArray([...deck.drawPile]),
              }
            : deck
        ),
      };
    }

    case 'UNDO': {
      if (state.historyIndex < 0) return state;

      const action = state.history[state.historyIndex];
      let newState = { ...state, historyIndex: state.historyIndex - 1 };

      // Reverse the action
      switch (action.type) {
        case 'mark_place': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          const sheetMarks = newState.marks[sheetId] || [];
          newState.marks = {
            ...newState.marks,
            [sheetId]: sheetMarks.filter(m => m.id !== mark.id),
          };
          break;
        }
        case 'mark_remove': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          const sheetMarks = newState.marks[sheetId] || [];
          newState.marks = {
            ...newState.marks,
            [sheetId]: [...sheetMarks, mark],
          };
          break;
        }
        // Add more undo logic for other action types as needed
      }

      return newState;
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;

      const action = state.history[state.historyIndex + 1];
      let newState = { ...state, historyIndex: state.historyIndex + 1 };

      // Reapply the action
      switch (action.type) {
        case 'mark_place': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          const sheetMarks = newState.marks[sheetId] || [];
          newState.marks = {
            ...newState.marks,
            [sheetId]: [...sheetMarks, mark],
          };
          break;
        }
        case 'mark_remove': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          const sheetMarks = newState.marks[sheetId] || [];
          newState.marks = {
            ...newState.marks,
            [sheetId]: sheetMarks.filter(m => m.id !== (mark as Mark).id),
          };
          break;
        }
        // Add more redo logic for other action types as needed
      }

      return newState;
    }

    case 'RESET_SHEET': {
      const sheetId = action.payload;
      return {
        ...state,
        marks: {
          ...state.marks,
          [sheetId]: [],
        },
      };
    }

    case 'RESET_GAME': {
      return {
        ...state,
        marks: {},
        history: [],
        historyIndex: -1,
        dicePools: state.config.dicePools || [],
        decks: state.config.decks || [],
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const STORAGE_KEY = 'raw-engine-state';

function saveStateToStorage(state: GameState) {
  try {
    const serialized = JSON.stringify({
      ...state,
      lastSaved: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

function loadStateFromStorage(): GameState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  children: React.ReactNode;
  initialConfig?: GameConfig;
}

export function GameProvider({ children, initialConfig }: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialConfig,
    (config) => {
      // Try to load from storage first
      const saved = loadStateFromStorage();
      if (saved && saved.config.id === config?.id) {
        return saved;
      }

      // Initialize new game
      return config ? {
        config,
        currentSheetId: config.sheets[0]?.id || '',
        marks: {},
        dicePools: config.dicePools || [],
        decks: config.decks || [],
        history: [],
        historyIndex: -1,
      } : {} as GameState;
    }
  );

  const [toolState, setToolState] = React.useState<ToolState>({
    currentMarkType: 'checkbox',
    permanence: 'pen',
  });

  // Auto-save to localStorage on state changes
  useEffect(() => {
    if (state.config) {
      saveStateToStorage(state);
    }
  }, [state]);

  // Helper methods
  const addMark = useCallback((sheetId: string, mark: Mark) => {
    dispatch({ type: 'ADD_MARK', payload: { sheetId, mark } });
  }, []);

  const removeMark = useCallback((sheetId: string, markId: string) => {
    dispatch({ type: 'REMOVE_MARK', payload: { sheetId, markId } });
  }, []);

  const switchSheet = useCallback((sheetId: string) => {
    dispatch({ type: 'SWITCH_SHEET', payload: sheetId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const saveToFile = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.config.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const loadFromFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const loadedState = JSON.parse(text) as GameState;
      dispatch({ type: 'LOAD_STATE', payload: loadedState });
    } catch (error) {
      console.error('Failed to load file:', error);
      throw error;
    }
  }, []);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: GameContextType = {
    state,
    dispatch,
    toolState,
    setToolState,
    addMark,
    removeMark,
    switchSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToFile,
    loadFromFile,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
