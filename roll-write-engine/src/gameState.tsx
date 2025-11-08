/**
 * Game State Management with Undo/Redo Support
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  GameState,
  GameConfig,
  AnyAction,
  Sheet,
  Hotspot,
  AnyMark,
  Tool,
} from './types';

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (config: GameConfig): GameState => {
  return {
    sheets: config.sheets,
    dicePools: config.dicePools || [],
    decks: config.decks || [],
    currentSheetId: config.sheets[0]?.id || '',
    currentTool: config.defaultTool || {
      type: 'checkbox',
      isPermanent: true,
    },
    history: [],
    historyIndex: -1,
    customDice: config.customDice || [],
    customSymbols: config.symbolPalette
      ? Object.entries(config.symbolPalette).reduce((acc, [id, def]) => {
          acc[id] = def.svg || def.emoji || def.unicode || '';
          return acc;
        }, {} as Record<string, string>)
      : {},
    colorPalette: config.colorPalette || [
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ],
  };
};

// ============================================================================
// REDUCER
// ============================================================================

type StateAction =
  | { type: 'PLACE_MARK'; sheetId: string; hotspotId: string; mark: AnyMark }
  | { type: 'REMOVE_MARK'; sheetId: string; hotspotId: string; markIndex: number }
  | { type: 'ROLL_DICE'; poolId: string; diceIds?: string[]; results: Array<{ dieId: string; value: number | string }> }
  | { type: 'LOCK_DIE'; poolId: string; dieId: string; locked: boolean }
  | { type: 'MODIFY_DIE'; poolId: string; dieId: string; value: number | string }
  | { type: 'DRAW_CARD'; deckId: string }
  | { type: 'DISCARD_CARD'; deckId: string }
  | { type: 'SHUFFLE_DECK'; deckId: string }
  | { type: 'SPLIT_DECK'; deckId: string; pileCount: number }
  | { type: 'SET_TOOL'; tool: Tool }
  | { type: 'SET_SHEET'; sheetId: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_GAME'; config: GameConfig }
  | { type: 'RESET_SHEET'; sheetId: string; config: GameConfig }
  | { type: 'LOAD_STATE'; state: GameState };

const gameReducer = (state: GameState, action: StateAction): GameState => {
  switch (action.type) {
    case 'PLACE_MARK': {
      const newState = { ...state };
      const sheet = newState.sheets.find((s) => s.id === action.sheetId);
      if (!sheet) return state;

      // Find hotspot in the sheet's layout
      const hotspot = findHotspot(sheet, action.hotspotId);
      if (!hotspot) return state;

      // Check constraints
      const constraints = hotspot.constraints;
      if (!constraints.allowedMarkTypes.includes(action.mark.type)) return state;
      if (constraints.maxMarks && hotspot.marks.length >= constraints.maxMarks) return state;
      if (constraints.readOnly) return state;

      // Add mark
      hotspot.marks.push(action.mark);

      // Add to history
      const historyAction: AnyAction = {
        type: 'PLACE_MARK',
        timestamp: Date.now(),
        sheetId: action.sheetId,
        hotspotId: action.hotspotId,
        mark: action.mark,
      };
      newState.history = [...newState.history.slice(0, newState.historyIndex + 1), historyAction];
      newState.historyIndex = newState.history.length - 1;

      return newState;
    }

    case 'REMOVE_MARK': {
      const newState = { ...state };
      const sheet = newState.sheets.find((s) => s.id === action.sheetId);
      if (!sheet) return state;

      const hotspot = findHotspot(sheet, action.hotspotId);
      if (!hotspot) return state;
      if (hotspot.constraints.readOnly) return state;
      if (!hotspot.constraints.canUnmark && hotspot.constraints.canUnmark !== undefined) return state;

      hotspot.marks.splice(action.markIndex, 1);

      const historyAction: AnyAction = {
        type: 'REMOVE_MARK',
        timestamp: Date.now(),
        sheetId: action.sheetId,
        hotspotId: action.hotspotId,
        markIndex: action.markIndex,
      };
      newState.history = [...newState.history.slice(0, newState.historyIndex + 1), historyAction];
      newState.historyIndex = newState.history.length - 1;

      return newState;
    }

    case 'ROLL_DICE': {
      const newState = { ...state };
      const pool = newState.dicePools.find((p) => p.id === action.poolId);
      if (!pool) return state;

      action.results.forEach(({ dieId, value }) => {
        const die = pool.dice.find((d) => d.id === dieId);
        if (die && !die.locked) {
          die.currentValue = value;
          die.modified = false;
        }
      });

      const historyAction: AnyAction = {
        type: 'ROLL_DICE',
        timestamp: Date.now(),
        poolId: action.poolId,
        diceIds: action.diceIds,
        results: action.results,
      };
      newState.history = [...newState.history.slice(0, newState.historyIndex + 1), historyAction];
      newState.historyIndex = newState.history.length - 1;

      return newState;
    }

    case 'LOCK_DIE': {
      const newState = { ...state };
      const pool = newState.dicePools.find((p) => p.id === action.poolId);
      if (!pool) return state;

      const die = pool.dice.find((d) => d.id === action.dieId);
      if (die) {
        die.locked = action.locked;
      }

      return newState;
    }

    case 'MODIFY_DIE': {
      const newState = { ...state };
      const pool = newState.dicePools.find((p) => p.id === action.poolId);
      if (!pool) return state;

      const die = pool.dice.find((d) => d.id === action.dieId);
      if (die) {
        die.currentValue = action.value;
        die.modified = true;
      }

      return newState;
    }

    case 'DRAW_CARD': {
      const newState = { ...state };
      const deck = newState.decks.find((d) => d.id === action.deckId);
      if (!deck || deck.drawPile.length === 0) return state;

      const card = deck.drawPile[0];
      deck.drawPile = deck.drawPile.slice(1);
      deck.currentCard = card;

      return newState;
    }

    case 'DISCARD_CARD': {
      const newState = { ...state };
      const deck = newState.decks.find((d) => d.id === action.deckId);
      if (!deck || !deck.currentCard) return state;

      deck.discardPile.push(deck.currentCard);
      deck.currentCard = undefined;

      return newState;
    }

    case 'SHUFFLE_DECK': {
      const newState = { ...state };
      const deck = newState.decks.find((d) => d.id === action.deckId);
      if (!deck) return state;

      // Combine discard and draw piles
      const allCards = [...deck.drawPile, ...deck.discardPile];
      deck.drawPile = shuffleArray(allCards);
      deck.discardPile = [];

      return newState;
    }

    case 'SET_TOOL':
      return { ...state, currentTool: action.tool };

    case 'SET_SHEET':
      return { ...state, currentSheetId: action.sheetId };

    case 'UNDO': {
      if (state.historyIndex < 0) return state;

      const newState = { ...state };
      const actionToUndo = state.history[state.historyIndex];

      // Reverse the action
      if (actionToUndo.type === 'PLACE_MARK') {
        const sheet = newState.sheets.find((s) => s.id === actionToUndo.sheetId);
        if (sheet) {
          const hotspot = findHotspot(sheet, actionToUndo.hotspotId);
          if (hotspot) {
            hotspot.marks.pop();
          }
        }
      } else if (actionToUndo.type === 'REMOVE_MARK') {
        // Note: Full undo would require storing removed mark
        // For now, we'll keep it simple
      }

      newState.historyIndex = state.historyIndex - 1;
      return newState;
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;

      const newState = { ...state };
      const actionToRedo = state.history[state.historyIndex + 1];

      // Re-apply the action
      if (actionToRedo.type === 'PLACE_MARK') {
        const sheet = newState.sheets.find((s) => s.id === actionToRedo.sheetId);
        if (sheet) {
          const hotspot = findHotspot(sheet, actionToRedo.hotspotId);
          if (hotspot) {
            hotspot.marks.push(actionToRedo.mark);
          }
        }
      }

      newState.historyIndex = state.historyIndex + 1;
      return newState;
    }

    case 'RESET_GAME':
      return createInitialState(action.config);

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const findHotspot = (sheet: Sheet, hotspotId: string): Hotspot | null => {
  const layout = sheet.layout;

  if (layout.type === 'grid') {
    // Grid layouts auto-generate hotspots, we'll handle this in the renderer
    return null;
  } else if (layout.type === 'image-overlay') {
    return layout.hotspots.find((h) => h.id === hotspotId) || null;
  } else if (layout.type === 'freeform') {
    return layout.hotspots.find((h) => h.id === hotspotId) || null;
  } else if (layout.type === 'mixed') {
    for (const region of layout.regions) {
      const hotspot = region.hotspots.find((h) => h.id === hotspotId);
      if (hotspot) return hotspot;
    }
  }

  return null;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ============================================================================
// CONTEXT
// ============================================================================

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<StateAction>;
  placeMark: (sheetId: string, hotspotId: string, mark: AnyMark) => void;
  removeMark: (sheetId: string, hotspotId: string, markIndex: number) => void;
  rollDice: (poolId: string, diceIds?: string[]) => void;
  lockDie: (poolId: string, dieId: string, locked: boolean) => void;
  drawCard: (deckId: string) => void;
  discardCard: (deckId: string) => void;
  shuffleDeck: (deckId: string) => void;
  setTool: (tool: Tool) => void;
  setSheet: (sheetId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveGame: () => void;
  loadGame: (file: File) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  config: GameConfig;
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ config, children }) => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(config));

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      gameName: config.name,
      state,
    };
    localStorage.setItem(`roll-write-game-${config.name}`, JSON.stringify(saveData));
  }, [state, config.name]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`roll-write-game-${config.name}`);
    if (saved) {
      try {
        const saveData = JSON.parse(saved);
        if (saveData.state) {
          dispatch({ type: 'LOAD_STATE', state: saveData.state });
        }
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, [config.name]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if (e.key >= '1' && e.key <= '9') {
        const sheetIndex = parseInt(e.key) - 1;
        if (sheetIndex < state.sheets.length) {
          dispatch({ type: 'SET_SHEET', sheetId: state.sheets[sheetIndex].id });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.sheets]);

  // Helper functions
  const placeMark = useCallback((sheetId: string, hotspotId: string, mark: AnyMark) => {
    dispatch({ type: 'PLACE_MARK', sheetId, hotspotId, mark });
  }, []);

  const removeMark = useCallback((sheetId: string, hotspotId: string, markIndex: number) => {
    dispatch({ type: 'REMOVE_MARK', sheetId, hotspotId, markIndex });
  }, []);

  const rollDice = useCallback((poolId: string, diceIds?: string[]) => {
    const pool = state.dicePools.find((p) => p.id === poolId);
    if (!pool) return;

    const diceToRoll = diceIds
      ? pool.dice.filter((d) => diceIds.includes(d.id) && !d.locked)
      : pool.dice.filter((d) => !d.locked);

    const results = diceToRoll.map((die) => {
      let value: number | string = 0;

      if (die.type.startsWith('d')) {
        // Standard die
        const sides = parseInt(die.type.substring(1));
        value = Math.floor(Math.random() * sides) + 1;
      } else {
        // Custom die
        const customDie = state.customDice.find((cd) => cd.id === die.type);
        if (customDie) {
          const totalWeight = customDie.faces.reduce((sum, face) => sum + (face.weight || 1), 0);
          let random = Math.random() * totalWeight;

          for (const face of customDie.faces) {
            random -= face.weight || 1;
            if (random <= 0) {
              value = face.value;
              break;
            }
          }

          if (value === undefined) {
            value = customDie.faces[0].value;
          }
        } else {
          value = 0;
        }
      }

      return { dieId: die.id, value };
    });

    dispatch({ type: 'ROLL_DICE', poolId, diceIds, results });
  }, [state.dicePools, state.customDice]);

  const lockDie = useCallback((poolId: string, dieId: string, locked: boolean) => {
    dispatch({ type: 'LOCK_DIE', poolId, dieId, locked });
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

  const setTool = useCallback((tool: Tool) => {
    dispatch({ type: 'SET_TOOL', tool });
  }, []);

  const setSheet = useCallback((sheetId: string) => {
    dispatch({ type: 'SET_SHEET', sheetId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const saveGame = useCallback(() => {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      gameName: config.name,
      state,
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state, config.name]);

  const loadGame = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target?.result as string);
        if (saveData.state) {
          dispatch({ type: 'LOAD_STATE', state: saveData.state });
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: GameContextType = {
    state,
    dispatch,
    placeMark,
    removeMark,
    rollDice,
    lockDie,
    drawCard,
    discardCard,
    shuffleDeck,
    setTool,
    setSheet,
    undo,
    redo,
    canUndo,
    canRedo,
    saveGame,
    loadGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
