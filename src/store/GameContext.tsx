/**
 * Game state management using React Context
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  GameState,
  GameDefinition,
  Action,
  PlacedMark,
  ID,
  DicePoolState,
  DeckState,
} from '../types';
import { ActionType, MarkType } from '../types';
import { generateId } from '../utils/id';

/**
 * Game context value
 */
interface GameContextValue {
  state: GameState;
  definition: GameDefinition;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  placeMark: (sheetId: ID, hotspotId: ID, mark: PlacedMark) => void;
  removeMark: (markId: ID) => void;
  setActiveTool: (markType: MarkType, config?: any) => void;
  togglePencilMode: () => void;
  setActiveSheet: (sheetId: ID) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveGame: () => void;
  loadGame: (savedState: GameState) => void;
  resetGame: () => void;
}

/**
 * Game actions
 */
export type GameAction =
  | { type: 'PLACE_MARK'; payload: { sheetId: ID; hotspotId: ID; mark: PlacedMark } }
  | { type: 'REMOVE_MARK'; payload: { markId: ID } }
  | { type: 'MODIFY_MARK'; payload: { markId: ID; mark: PlacedMark } }
  | { type: 'SET_ACTIVE_TOOL'; payload: { markType: MarkType; config?: any } }
  | { type: 'TOGGLE_PENCIL_MODE' }
  | { type: 'SET_ACTIVE_SHEET'; payload: { sheetId: ID } }
  | { type: 'ROLL_DICE'; payload: { poolId: ID; results: DicePoolState } }
  | { type: 'DRAW_CARD'; payload: { deckId: ID; newState: DeckState } }
  | { type: 'SHUFFLE_DECK'; payload: { deckId: ID; newState: DeckState } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: { state: GameState } }
  | { type: 'RESET' };

/**
 * Create initial game state from definition
 */
function createInitialState(definition: GameDefinition): GameState {
  const now = Date.now();
  const sessionId = generateId();

  // Initialize sheet states
  const sheets: Record<ID, any> = {};
  definition.sheets.forEach((sheet) => {
    sheets[sheet.id] = {
      sheetId: sheet.id,
      marks: [],
      lastModified: now,
    };
  });

  // Initialize dice pool states
  const dicePools: Record<ID, DicePoolState> = {};
  definition.dice?.forEach((pool) => {
    dicePools[pool.id] = {
      poolId: pool.id,
      results: [],
      rollCount: 0,
    };
  });

  // Initialize deck states
  const decks: Record<ID, DeckState> = {};
  definition.decks?.forEach((deck: any) => {
    const allCards = deck.cards.flatMap((entry: any) =>
      Array(entry.quantity).fill(entry.card)
    );
    decks[deck.id] = {
      deckId: deck.id,
      drawPile: [...allCards],
      discardPile: [],
      shuffleCount: 0,
    };
  });

  return {
    gameId: definition.id,
    sessionId,
    sheets,
    dicePools,
    decks,
    activeSheetId: definition.sheets[0]?.id || '',
    activeTool: undefined,
    pencilMode: false,
    history: {
      past: [],
      future: [],
      maxSize: 50,
      currentTurn: 1,
    },
    diceHistory: [],
    cardHistory: [],
    startTime: now,
    metadata: {},
  };
}

/**
 * Game reducer
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_MARK': {
      const { sheetId, hotspotId, mark } = action.payload;
      const sheetState = state.sheets[sheetId];
      if (!sheetState) return state;

      const newMark = { ...mark, hotspotId };
      const newMarks = [...sheetState.marks, newMark];

      // Create history action
      const historyAction: Action = {
        id: generateId(),
        type: ActionType.PlaceMark,
        timestamp: Date.now(),
        sheetId,
        turn: state.history.currentTurn,
      } as any;

      return {
        ...state,
        sheets: {
          ...state.sheets,
          [sheetId]: {
            ...sheetState,
            marks: newMarks,
            lastModified: Date.now(),
          },
        },
        history: {
          ...state.history,
          past: [...state.history.past, historyAction].slice(-state.history.maxSize),
          future: [], // Clear redo stack
        },
      };
    }

    case 'REMOVE_MARK': {
      const { markId } = action.payload;
      let updatedSheets = { ...state.sheets };
      let removed = false;

      Object.keys(updatedSheets).forEach((sheetId) => {
        const sheet = updatedSheets[sheetId];
        const markIndex = sheet.marks.findIndex((m: PlacedMark) => m.id === markId);
        if (markIndex !== -1) {
          updatedSheets[sheetId] = {
            ...sheet,
            marks: sheet.marks.filter((m: PlacedMark) => m.id !== markId),
            lastModified: Date.now(),
          };
          removed = true;
        }
      });

      if (!removed) return state;

      return {
        ...state,
        sheets: updatedSheets,
      };
    }

    case 'SET_ACTIVE_TOOL': {
      return {
        ...state,
        activeTool: {
          markType: action.payload.markType,
          config: action.payload.config,
        },
      };
    }

    case 'TOGGLE_PENCIL_MODE': {
      return {
        ...state,
        pencilMode: !state.pencilMode,
      };
    }

    case 'SET_ACTIVE_SHEET': {
      return {
        ...state,
        activeSheetId: action.payload.sheetId,
      };
    }

    case 'ROLL_DICE': {
      const { poolId, results } = action.payload;
      return {
        ...state,
        dicePools: {
          ...state.dicePools,
          [poolId]: results,
        },
        diceHistory: [
          ...state.diceHistory,
          {
            timestamp: Date.now(),
            poolId,
            results: results.results,
            turn: state.history.currentTurn,
          },
        ],
      };
    }

    case 'DRAW_CARD': {
      const { deckId, newState } = action.payload;
      return {
        ...state,
        decks: {
          ...state.decks,
          [deckId]: newState,
        },
        cardHistory: newState.currentCard
          ? [
              ...state.cardHistory,
              {
                timestamp: Date.now(),
                deckId,
                card: newState.currentCard,
                turn: state.history.currentTurn,
              },
            ]
          : state.cardHistory,
      };
    }

    case 'SHUFFLE_DECK': {
      const { deckId, newState } = action.payload;
      return {
        ...state,
        decks: {
          ...state.decks,
          [deckId]: newState,
        },
      };
    }

    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      // TODO: Implement proper undo logic
      return state;
    }

    case 'REDO': {
      if (state.history.future.length === 0) return state;
      // TODO: Implement proper redo logic
      return state;
    }

    case 'LOAD_STATE': {
      return action.payload.state;
    }

    case 'RESET': {
      // This would need the definition, handled in provider
      return state;
    }

    default:
      return state;
  }
}

/**
 * Game context
 */
const GameContext = createContext<GameContextValue | null>(null);

/**
 * Game provider props
 */
interface GameProviderProps {
  definition: GameDefinition;
  children: ReactNode;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

/**
 * Game provider component
 */
export function GameProvider({
  definition,
  children,
  autoSave = true,
  autoSaveInterval = 5000,
}: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    definition,
    createInitialState
  );

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      const key = `game-${definition.id}-autosave`;
      localStorage.setItem(key, JSON.stringify(state));
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [state, definition.id, autoSave, autoSaveInterval]);

  // Load saved game on mount
  useEffect(() => {
    const key = `game-${definition.id}-autosave`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { state: savedState } });
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, [definition.id]);

  // Helper functions
  const placeMark = (sheetId: ID, hotspotId: ID, mark: PlacedMark) => {
    dispatch({ type: 'PLACE_MARK', payload: { sheetId, hotspotId, mark } });
  };

  const removeMark = (markId: ID) => {
    dispatch({ type: 'REMOVE_MARK', payload: { markId } });
  };

  const setActiveTool = (markType: MarkType, config?: any) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: { markType, config } });
  };

  const togglePencilMode = () => {
    dispatch({ type: 'TOGGLE_PENCIL_MODE' });
  };

  const setActiveSheet = (sheetId: ID) => {
    dispatch({ type: 'SET_ACTIVE_SHEET', payload: { sheetId } });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const saveGame = () => {
    const key = `game-${definition.id}-manual-save-${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(state));
  };

  const loadGame = (savedState: GameState) => {
    dispatch({ type: 'LOAD_STATE', payload: { state: savedState } });
  };

  const resetGame = () => {
    const newState = createInitialState(definition);
    dispatch({ type: 'LOAD_STATE', payload: { state: newState } });
  };

  const value: GameContextValue = {
    state,
    definition,
    dispatch,
    placeMark,
    removeMark,
    setActiveTool,
    togglePencilMode,
    setActiveSheet,
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
    saveGame,
    loadGame,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to use game context
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
