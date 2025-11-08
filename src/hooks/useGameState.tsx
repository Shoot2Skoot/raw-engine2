/**
 * Game State Management Hook
 *
 * Provides centralized state management with auto-save and undo/redo
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, DieResult, Mark } from '../types';
import { saveGameState } from '../utils/storage';
import { debounce } from '../utils/helpers';

// ============================================================================
// ACTION TYPES
// ============================================================================

type Action =
  | { type: 'SET_GAME'; payload: GameState }
  | { type: 'SET_ACTIVE_SHEET'; payload: string }
  | { type: 'ADD_MARK'; payload: { sheetId: string; regionId: string; hotspotId: string; mark: Mark } }
  | { type: 'REMOVE_MARK'; payload: { sheetId: string; regionId: string; hotspotId: string; markId: string } }
  | { type: 'UPDATE_MARK'; payload: { sheetId: string; regionId: string; hotspotId: string; markId: string; mark: Partial<Mark> } }
  | { type: 'SET_SELECTED_TOOL'; payload: GameState['selectedTool'] }
  | { type: 'ROLL_DICE_POOL'; payload: { poolId: string; results: DieResult[] } }
  | { type: 'LOCK_DIE'; payload: { poolId: string; dieId: string } }
  | { type: 'DRAW_CARD'; payload: { deckId: string } }
  | { type: 'DISCARD_CARD'; payload: { deckId: string } }
  | { type: 'SHUFFLE_DECK'; payload: { deckId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_SHEET'; payload: { sheetId: string } }
  | { type: 'RESET_GAME' };

// ============================================================================
// REDUCER
// ============================================================================

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_GAME':
      return action.payload;

    case 'SET_ACTIVE_SHEET':
      return {
        ...state,
        activeSheetId: action.payload,
      };

    case 'ADD_MARK': {
      const { sheetId, regionId, hotspotId, mark } = action.payload;
      return {
        ...state,
        sheets: state.sheets.map(sheet =>
          sheet.id === sheetId
            ? {
                ...sheet,
                regions: sheet.regions.map(region =>
                  region.id === regionId
                    ? {
                        ...region,
                        hotspots: region.hotspots.map(hotspot =>
                          hotspot.id === hotspotId
                            ? {
                                ...hotspot,
                                marks: [...hotspot.marks, mark],
                              }
                            : hotspot
                        ),
                      }
                    : region
                ),
              }
            : sheet
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), {
          type: 'addMark',
          timestamp: Date.now(),
          data: action.payload,
        }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_MARK': {
      const { sheetId, regionId, hotspotId, markId } = action.payload;
      return {
        ...state,
        sheets: state.sheets.map(sheet =>
          sheet.id === sheetId
            ? {
                ...sheet,
                regions: sheet.regions.map(region =>
                  region.id === regionId
                    ? {
                        ...region,
                        hotspots: region.hotspots.map(hotspot =>
                          hotspot.id === hotspotId
                            ? {
                                ...hotspot,
                                marks: hotspot.marks.filter(m => m.id !== markId),
                              }
                            : hotspot
                        ),
                      }
                    : region
                ),
              }
            : sheet
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), {
          type: 'removeMark',
          timestamp: Date.now(),
          data: action.payload,
        }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_MARK': {
      const { sheetId, regionId, hotspotId, markId, mark } = action.payload;
      return {
        ...state,
        sheets: state.sheets.map(sheet =>
          sheet.id === sheetId
            ? {
                ...sheet,
                regions: sheet.regions.map(region =>
                  region.id === regionId
                    ? {
                        ...region,
                        hotspots: region.hotspots.map(hotspot =>
                          hotspot.id === hotspotId
                            ? {
                                ...hotspot,
                                marks: hotspot.marks.map(m =>
                                  m.id === markId ? { ...m, ...mark } : m
                                ),
                              }
                            : hotspot
                        ),
                      }
                    : region
                ),
              }
            : sheet
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), {
          type: 'updateMark',
          timestamp: Date.now(),
          data: action.payload,
        }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SET_SELECTED_TOOL':
      return {
        ...state,
        selectedTool: action.payload,
      };

    case 'ROLL_DICE_POOL': {
      const { poolId, results } = action.payload;
      return {
        ...state,
        dicePools: state.dicePools?.map(pool =>
          pool.id === poolId
            ? {
                ...pool,
                results,
                history: [
                  ...pool.history,
                  {
                    timestamp: Date.now(),
                    results,
                  },
                ],
              }
            : pool
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), {
          type: 'rollDice',
          timestamp: Date.now(),
          data: action.payload,
        }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'LOCK_DIE': {
      const { poolId, dieId } = action.payload;
      return {
        ...state,
        dicePools: state.dicePools?.map(pool =>
          pool.id === poolId
            ? {
                ...pool,
                results: pool.results.map(result =>
                  result.id === dieId
                    ? { ...result, isLocked: !result.isLocked }
                    : result
                ),
              }
            : pool
        ),
      };
    }

    case 'UNDO':
      if (state.historyIndex > 0) {
        // TODO: Implement proper undo logic by reversing actions
        return {
          ...state,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        // TODO: Implement proper redo logic
        return {
          ...state,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    case 'RESET_SHEET': {
      const { sheetId } = action.payload;
      return {
        ...state,
        sheets: state.sheets.map(sheet =>
          sheet.id === sheetId
            ? {
                ...sheet,
                regions: sheet.regions.map(region => ({
                  ...region,
                  hotspots: region.hotspots.map(hotspot => ({
                    ...hotspot,
                    marks: [],
                  })),
                })),
              }
            : sheet
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), {
          type: 'rollDice', // Using rollDice as placeholder
          timestamp: Date.now(),
          data: action.payload,
        }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'RESET_GAME': {
      // Reset all sheets and dice pools
      return {
        ...state,
        sheets: state.sheets.map(sheet => ({
          ...sheet,
          regions: sheet.regions.map(region => ({
            ...region,
            hotspots: region.hotspots.map(hotspot => ({
              ...hotspot,
              marks: [],
            })),
          })),
        })),
        dicePools: state.dicePools?.map(pool => ({
          ...pool,
          results: [],
          history: [],
        })),
        history: [],
        historyIndex: 0,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  // Convenience methods
  setActiveSheet: (sheetId: string) => void;
  addMark: (sheetId: string, regionId: string, hotspotId: string, mark: Mark) => void;
  removeMark: (sheetId: string, regionId: string, hotspotId: string, markId: string) => void;
  updateMark: (sheetId: string, regionId: string, hotspotId: string, markId: string, mark: Partial<Mark>) => void;
  setSelectedTool: (tool: GameState['selectedTool']) => void;
  rollDicePool: (poolId: string, results: DieResult[]) => void;
  lockDie: (poolId: string, dieId: string) => void;
  undo: () => void;
  redo: () => void;
  resetSheet: (sheetId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  initialState: GameState;
  children: ReactNode;
  autoSave?: boolean;
}

export function GameProvider({ initialState, children, autoSave = true }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (autoSave) {
      const debouncedSave = debounce(() => {
        saveGameState(state);
      }, 1000);

      debouncedSave();
    }
  }, [state, autoSave]);

  // Convenience methods
  const contextValue: GameContextValue = {
    state,
    dispatch,
    setActiveSheet: (sheetId: string) => dispatch({ type: 'SET_ACTIVE_SHEET', payload: sheetId }),
    addMark: (sheetId: string, regionId: string, hotspotId: string, mark: Mark) =>
      dispatch({ type: 'ADD_MARK', payload: { sheetId, regionId, hotspotId, mark } }),
    removeMark: (sheetId: string, regionId: string, hotspotId: string, markId: string) =>
      dispatch({ type: 'REMOVE_MARK', payload: { sheetId, regionId, hotspotId, markId } }),
    updateMark: (sheetId: string, regionId: string, hotspotId: string, markId: string, mark: Partial<Mark>) =>
      dispatch({ type: 'UPDATE_MARK', payload: { sheetId, regionId, hotspotId, markId, mark } }),
    setSelectedTool: (tool: GameState['selectedTool']) =>
      dispatch({ type: 'SET_SELECTED_TOOL', payload: tool }),
    rollDicePool: (poolId: string, results: DieResult[]) =>
      dispatch({ type: 'ROLL_DICE_POOL', payload: { poolId, results } }),
    lockDie: (poolId: string, dieId: string) =>
      dispatch({ type: 'LOCK_DIE', payload: { poolId, dieId } }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    resetSheet: (sheetId: string) => dispatch({ type: 'RESET_SHEET', payload: { sheetId } }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}
