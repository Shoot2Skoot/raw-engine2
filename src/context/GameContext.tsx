import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  GameState,
  GameConfig,
  Mark,
  MarkType,
  Die,
  Card,
  HistoryEntry,
} from '../types';

// ============================================================================
// ACTION TYPES
// ============================================================================

type GameAction =
  | { type: 'INIT_GAME'; payload: GameConfig }
  | { type: 'SET_CURRENT_SHEET'; payload: string }
  | { type: 'SET_CURRENT_TOOL'; payload: MarkType }
  | { type: 'ADD_MARK'; payload: Mark }
  | { type: 'REMOVE_MARK'; payload: string }
  | { type: 'UPDATE_MARK'; payload: { id: string; updates: Partial<Mark> } }
  | { type: 'ROLL_DICE'; payload: { poolId: string; diceResults: Die[] } }
  | { type: 'LOCK_DIE'; payload: { poolId: string; dieId: string; locked: boolean } }
  | { type: 'DRAW_CARD'; payload: { deckId: string; card: Card } }
  | { type: 'DISCARD_CARD'; payload: { deckId: string } }
  | { type: 'SHUFFLE_DECK'; payload: { deckId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_SHEET'; payload: string }
  | { type: 'LOAD_STATE'; payload: GameState };

// ============================================================================
// CONTEXT
// ============================================================================

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  addMark: (mark: Mark) => void;
  removeMark: (markId: string) => void;
  updateMark: (markId: string, updates: Partial<Mark>) => void;
  setCurrentSheet: (sheetId: string) => void;
  setCurrentTool: (tool: MarkType) => void;
  rollDice: (poolId: string) => void;
  lockDie: (poolId: string, dieId: string, locked: boolean) => void;
  drawCard: (deckId: string) => void;
  discardCard: (deckId: string) => void;
  shuffleDeck: (deckId: string) => void;
  undo: () => void;
  redo: () => void;
  resetGame: () => void;
  resetSheet: (sheetId: string) => void;
  saveToFile: () => void;
  loadFromFile: (file: File) => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (config: GameConfig): GameState => ({
  id: crypto.randomUUID(),
  name: config.name,
  sheets: config.sheets,
  currentSheetId: config.sheets[0]?.id || '',
  marks: [],
  dicePools: config.dicePools || [],
  decks: config.decks || [],
  currentTool: config.defaultTool || 'checkbox',
  history: [],
  historyIndex: -1,
});

// ============================================================================
// REDUCER
// ============================================================================

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INIT_GAME':
      return createInitialState(action.payload);

    case 'SET_CURRENT_SHEET':
      return { ...state, currentSheetId: action.payload };

    case 'SET_CURRENT_TOOL':
      return { ...state, currentTool: action.payload };

    case 'ADD_MARK': {
      const newHistory: HistoryEntry = {
        type: 'add-mark',
        timestamp: Date.now(),
        data: action.payload,
      };
      return {
        ...state,
        marks: [...state.marks, action.payload],
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_MARK': {
      const markToRemove = state.marks.find((m) => m.id === action.payload);
      const newHistory: HistoryEntry = {
        type: 'remove-mark',
        timestamp: Date.now(),
        data: markToRemove,
      };
      return {
        ...state,
        marks: state.marks.filter((m) => m.id !== action.payload),
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_MARK': {
      const oldMark = state.marks.find((m) => m.id === action.payload.id);
      const newHistory: HistoryEntry = {
        type: 'modify-mark',
        timestamp: Date.now(),
        data: { id: action.payload.id, old: oldMark, new: action.payload.updates },
      };
      return {
        ...state,
        marks: state.marks.map((m) =>
          m.id === action.payload.id ? ({ ...m, ...action.payload.updates } as Mark) : m
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'ROLL_DICE': {
      const newHistory: HistoryEntry = {
        type: 'roll-dice',
        timestamp: Date.now(),
        data: { poolId: action.payload.poolId, results: action.payload.diceResults },
      };
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.payload.poolId
            ? { ...pool, dice: action.payload.diceResults }
            : pool
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'LOCK_DIE': {
      return {
        ...state,
        dicePools: state.dicePools.map((pool) =>
          pool.id === action.payload.poolId
            ? {
                ...pool,
                dice: pool.dice.map((die) =>
                  die.id === action.payload.dieId
                    ? { ...die, locked: action.payload.locked }
                    : die
                ),
              }
            : pool
        ),
      };
    }

    case 'DRAW_CARD': {
      const newHistory: HistoryEntry = {
        type: 'draw-card',
        timestamp: Date.now(),
        data: { deckId: action.payload.deckId, card: action.payload.card },
      };
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.payload.deckId
            ? {
                ...deck,
                drawPile: deck.drawPile.slice(1),
                currentCard: action.payload.card,
              }
            : deck
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'DISCARD_CARD': {
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.payload.deckId && deck.currentCard
            ? {
                ...deck,
                discardPile: [...deck.discardPile, deck.currentCard],
                currentCard: undefined,
              }
            : deck
        ),
      };
    }

    case 'SHUFFLE_DECK': {
      return {
        ...state,
        decks: state.decks.map((deck) => {
          if (deck.id === action.payload.deckId) {
            const shuffled = [...deck.drawPile].sort(() => Math.random() - 0.5);
            return { ...deck, drawPile: shuffled };
          }
          return deck;
        }),
      };
    }

    case 'UNDO': {
      if (state.historyIndex < 0) return state;
      const entry = state.history[state.historyIndex];
      let newState = { ...state, historyIndex: state.historyIndex - 1 };

      switch (entry.type) {
        case 'add-mark':
          newState.marks = newState.marks.filter((m) => m.id !== (entry.data as Mark).id);
          break;
        case 'remove-mark':
          newState.marks = [...newState.marks, entry.data as Mark];
          break;
        // Add more undo logic as needed
      }

      return newState;
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const entry = state.history[state.historyIndex + 1];
      let newState = { ...state, historyIndex: state.historyIndex + 1 };

      switch (entry.type) {
        case 'add-mark':
          newState.marks = [...newState.marks, entry.data as Mark];
          break;
        case 'remove-mark':
          newState.marks = newState.marks.filter((m) => m.id !== (entry.data as Mark).id);
          break;
        // Add more redo logic as needed
      }

      return newState;
    }

    case 'RESET_GAME': {
      return {
        ...state,
        marks: [],
        history: [],
        historyIndex: -1,
      };
    }

    case 'RESET_SHEET': {
      // For now, this is a placeholder - full implementation would require
      // tracking which sheet each mark belongs to
      return state;
    }

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface GameProviderProps {
  config: GameConfig;
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ config, children }) => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(config));

  // Auto-save to localStorage
  useEffect(() => {
    const saveKey = `rollwrite-game-${state.id}`;
    localStorage.setItem(saveKey, JSON.stringify(state));
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedGames = Object.keys(localStorage).filter((key) =>
      key.startsWith('rollwrite-game-')
    );
    if (savedGames.length > 0) {
      const latestKey = savedGames[savedGames.length - 1];
      const savedState = localStorage.getItem(latestKey);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        } catch (e) {
          console.error('Failed to load saved state:', e);
        }
      }
    }
  }, []);

  // Helper functions
  const addMark = (mark: Mark) => dispatch({ type: 'ADD_MARK', payload: mark });
  const removeMark = (markId: string) => dispatch({ type: 'REMOVE_MARK', payload: markId });
  const updateMark = (markId: string, updates: Partial<Mark>) =>
    dispatch({ type: 'UPDATE_MARK', payload: { id: markId, updates } });
  const setCurrentSheet = (sheetId: string) =>
    dispatch({ type: 'SET_CURRENT_SHEET', payload: sheetId });
  const setCurrentTool = (tool: MarkType) =>
    dispatch({ type: 'SET_CURRENT_TOOL', payload: tool });

  const rollDice = (poolId: string) => {
    const pool = state.dicePools.find((p) => p.id === poolId);
    if (!pool) return;

    const newDice = pool.dice.map((die) => {
      if (die.locked) return die;

      if (die.type === 'numeric') {
        return {
          ...die,
          currentValue: Math.floor(Math.random() * die.sides) + 1,
        };
      } else {
        const totalWeight = die.faces.reduce((sum, face) => sum + (face.weight || 1), 0);
        let random = Math.random() * totalWeight;
        let faceIndex = 0;

        for (let i = 0; i < die.faces.length; i++) {
          random -= die.faces[i].weight || 1;
          if (random <= 0) {
            faceIndex = i;
            break;
          }
        }

        return {
          ...die,
          currentFaceIndex: faceIndex,
        };
      }
    });

    dispatch({ type: 'ROLL_DICE', payload: { poolId, diceResults: newDice } });
  };

  const lockDie = (poolId: string, dieId: string, locked: boolean) =>
    dispatch({ type: 'LOCK_DIE', payload: { poolId, dieId, locked } });

  const drawCard = (deckId: string) => {
    const deck = state.decks.find((d) => d.id === deckId);
    if (!deck || deck.drawPile.length === 0) return;

    const card = deck.drawPile[0];
    dispatch({ type: 'DRAW_CARD', payload: { deckId, card } });
  };

  const discardCard = (deckId: string) =>
    dispatch({ type: 'DISCARD_CARD', payload: { deckId } });

  const shuffleDeck = (deckId: string) =>
    dispatch({ type: 'SHUFFLE_DECK', payload: { deckId } });

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const resetSheet = (sheetId: string) =>
    dispatch({ type: 'RESET_SHEET', payload: sheetId });

  const saveToFile = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load file:', error);
      }
    };
    reader.readAsText(file);
  };

  const value: GameContextValue = {
    state,
    dispatch,
    addMark,
    removeMark,
    updateMark,
    setCurrentSheet,
    setCurrentTool,
    rollDice,
    lockDie,
    drawCard,
    discardCard,
    shuffleDeck,
    undo,
    redo,
    resetGame,
    resetSheet,
    saveToFile,
    loadFromFile,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
