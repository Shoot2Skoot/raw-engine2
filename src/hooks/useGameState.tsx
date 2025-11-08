/**
 * Game State Hook with Undo/Redo Support
 */

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  GameState,
  GameConfig,
  Mark,
  Tool,
} from '../types';
import {
  createGameState,
  addMark,
  removeMark,
  rollDicePool,
  lockDie,
  unlockDie,
  drawCard,
  discardCard,
  shuffleDeck,
  reshuffleDiscard,
  changeSheet,
  resetGame as resetGameState,
  resetSheet as resetSheetState,
  saveToLocalStorage,
  loadFromLocalStorage,
  getLastGameId,
} from '../utils/gameEngine';

interface GameContextState {
  present: GameState;
  past: GameState[];
  future: GameState[];
  config: GameConfig;
  currentTool: Tool | null;
}

interface GameContextValue extends GameContextState {
  // Actions
  placeMark: (sheetId: string, mark: Mark) => void;
  removeMark: (sheetId: string, markId: string) => void;
  rollDice: (poolId: string) => void;
  lockDie: (poolId: string, dieId: string) => void;
  unlockDie: (poolId: string, dieId: string) => void;
  drawCard: (deckId: string) => void;
  discardCard: (deckId: string) => void;
  shuffleDeck: (deckId: string) => void;
  reshuffleDiscard: (deckId: string) => void;
  changeSheet: (sheetId: string) => void;
  resetGame: () => void;
  resetSheet: (sheetId: string) => void;
  setCurrentTool: (tool: Tool | null) => void;
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // State management
  loadGame: (state: GameState) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

type ReducerAction =
  | { type: 'SET_STATE'; state: GameState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_TOOL'; tool: Tool | null };

function gameReducer(
  state: GameContextState,
  action: ReducerAction
): GameContextState {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        past: [...state.past, state.present],
        present: action.state,
        future: [], // Clear future when new action occurs
      };

    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };

    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };

    case 'SET_TOOL':
      return {
        ...state,
        currentTool: action.tool,
      };

    default:
      return state;
  }
}

interface GameProviderProps {
  config: GameConfig;
  children: ReactNode;
}

export function GameProvider({ config, children }: GameProviderProps) {
  const initialState = createGameState(config);

  // Try to load from localStorage
  const lastGameId = getLastGameId();
  const savedState = lastGameId ? loadFromLocalStorage(lastGameId) : null;
  const startState = savedState && savedState.name === config.name ? savedState : initialState;

  const [state, dispatch] = useReducer(gameReducer, {
    present: startState,
    past: [],
    future: [],
    config,
    currentTool: config.tools[0] || null,
  });

  // Auto-save to localStorage on state change
  useEffect(() => {
    saveToLocalStorage(state.present);
  }, [state.present]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      // Sheet navigation: 1-9 keys
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < state.present.sheets.length) {
          dispatch({
            type: 'SET_STATE',
            state: changeSheet(state.present, state.present.sheets[index].id),
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.present]);

  const value: GameContextValue = {
    ...state,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,

    placeMark: (sheetId, mark) => {
      dispatch({ type: 'SET_STATE', state: addMark(state.present, sheetId, mark) });
    },

    removeMark: (sheetId, markId) => {
      dispatch({ type: 'SET_STATE', state: removeMark(state.present, sheetId, markId) });
    },

    rollDice: (poolId) => {
      dispatch({ type: 'SET_STATE', state: rollDicePool(state.present, poolId) });
    },

    lockDie: (poolId, dieId) => {
      dispatch({ type: 'SET_STATE', state: lockDie(state.present, poolId, dieId) });
    },

    unlockDie: (poolId, dieId) => {
      dispatch({ type: 'SET_STATE', state: unlockDie(state.present, poolId, dieId) });
    },

    drawCard: (deckId) => {
      dispatch({ type: 'SET_STATE', state: drawCard(state.present, deckId) });
    },

    discardCard: (deckId) => {
      dispatch({ type: 'SET_STATE', state: discardCard(state.present, deckId) });
    },

    shuffleDeck: (deckId) => {
      dispatch({ type: 'SET_STATE', state: shuffleDeck(state.present, deckId) });
    },

    reshuffleDiscard: (deckId) => {
      dispatch({ type: 'SET_STATE', state: reshuffleDiscard(state.present, deckId) });
    },

    changeSheet: (sheetId) => {
      dispatch({ type: 'SET_STATE', state: changeSheet(state.present, sheetId) });
    },

    resetGame: () => {
      if (confirm('Are you sure you want to reset the entire game? This cannot be undone.')) {
        dispatch({ type: 'SET_STATE', state: resetGameState(config) });
      }
    },

    resetSheet: (sheetId) => {
      if (confirm('Are you sure you want to reset this sheet? This cannot be undone.')) {
        dispatch({ type: 'SET_STATE', state: resetSheetState(state.present, sheetId) });
      }
    },

    setCurrentTool: (tool) => {
      dispatch({ type: 'SET_TOOL', tool });
    },

    undo: () => {
      dispatch({ type: 'UNDO' });
    },

    redo: () => {
      dispatch({ type: 'REDO' });
    },

    loadGame: (loadedState) => {
      dispatch({ type: 'SET_STATE', state: loadedState });
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
