/**
 * Game state management using React Context and useReducer
 */

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GameState, GameConfig, GameAction } from './types';
import { createInitialGameState } from './utils/gameInitializer';
import { saveGameToLocalStorage } from './utils/storage';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: (data: string) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const GameContext = createContext<GameContextValue | undefined>(undefined);

// ============================================================================
// REDUCER
// ============================================================================

function gameReducer(state: GameState, action: GameAction): GameState {
  // Add action to history (for undo/redo)
  const newHistory = [
    ...state.actionHistory.slice(0, state.historyIndex + 1),
    action
  ];

  let newState = { ...state };

  switch (action.type) {
    case 'ADD_MARK': {
      const sheets = state.sheets.map(sheet => {
        if (sheet.id !== action.sheetId) return sheet;

        return {
          ...sheet,
          config: {
            ...sheet.config,
            regions: sheet.config.regions.map(region => ({
              ...region,
              hotspots: region.hotspots.map(hotspot => {
                if (hotspot.id !== action.hotspotId) return hotspot;

                // Check if we can add more marks
                const maxMarks = hotspot.constraints.maxMarks ?? 1;
                if (hotspot.marks.length >= maxMarks) {
                  // Replace last mark if at limit
                  return {
                    ...hotspot,
                    marks: [...hotspot.marks.slice(0, -1), action.mark]
                  };
                }

                return {
                  ...hotspot,
                  marks: [...hotspot.marks, action.mark]
                };
              })
            }))
          }
        };
      });

      newState = { ...state, sheets };
      break;
    }

    case 'REMOVE_MARK': {
      const sheets = state.sheets.map(sheet => {
        if (sheet.id !== action.sheetId) return sheet;

        return {
          ...sheet,
          config: {
            ...sheet.config,
            regions: sheet.config.regions.map(region => ({
              ...region,
              hotspots: region.hotspots.map(hotspot => {
                if (hotspot.id !== action.hotspotId) return hotspot;

                return {
                  ...hotspot,
                  marks: hotspot.marks.filter((_, index) => index !== action.markIndex)
                };
              })
            }))
          }
        };
      });

      newState = { ...state, sheets };
      break;
    }

    case 'UPDATE_MARK': {
      const sheets = state.sheets.map(sheet => {
        if (sheet.id !== action.sheetId) return sheet;

        return {
          ...sheet,
          config: {
            ...sheet.config,
            regions: sheet.config.regions.map(region => ({
              ...region,
              hotspots: region.hotspots.map(hotspot => {
                if (hotspot.id !== action.hotspotId) return hotspot;

                return {
                  ...hotspot,
                  marks: hotspot.marks.map((mark, index) =>
                    index === action.markIndex ? action.mark : mark
                  )
                };
              })
            }))
          }
        };
      });

      newState = { ...state, sheets };
      break;
    }

    case 'ROLL_DICE': {
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== action.poolId) return pool;

        return {
          ...pool,
          dice: pool.dice.map(die => {
            const result = action.results.find(r => r.dieId === die.id);
            if (!result || die.locked) return die;

            return {
              ...die,
              currentFace: result.result
            };
          })
        };
      });

      const diceHistory = [
        ...state.diceHistory,
        {
          timestamp: Date.now(),
          poolId: action.poolId,
          results: action.results
        }
      ];

      newState = { ...state, dicePools, diceHistory };
      break;
    }

    case 'LOCK_DIE': {
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== action.poolId) return pool;

        return {
          ...pool,
          dice: pool.dice.map(die =>
            die.id === action.dieId ? { ...die, locked: true } : die
          )
        };
      });

      newState = { ...state, dicePools };
      break;
    }

    case 'UNLOCK_DIE': {
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== action.poolId) return pool;

        return {
          ...pool,
          dice: pool.dice.map(die =>
            die.id === action.dieId ? { ...die, locked: false } : die
          )
        };
      });

      newState = { ...state, dicePools };
      break;
    }

    case 'MODIFY_DIE': {
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== action.poolId) return pool;

        return {
          ...pool,
          dice: pool.dice.map(die =>
            die.id === action.dieId
              ? { ...die, currentFace: action.newValue, modified: true }
              : die
          )
        };
      });

      newState = { ...state, dicePools };
      break;
    }

    case 'DRAW_CARD': {
      const decks = state.decks.map(deck => {
        if (deck.id !== action.deckId) return deck;

        return {
          ...deck,
          currentCard: action.card,
          drawPile: deck.drawPile.filter(c => c.id !== action.card.id)
        };
      });

      newState = { ...state, decks };
      break;
    }

    case 'DISCARD_CARD': {
      const decks = state.decks.map(deck => {
        if (deck.id !== action.deckId) return deck;

        return {
          ...deck,
          currentCard: undefined,
          discardPile: [...deck.discardPile, action.card]
        };
      });

      newState = { ...state, decks };
      break;
    }

    case 'SHUFFLE_DECK': {
      const decks = state.decks.map(deck => {
        if (deck.id !== action.deckId) return deck;

        const shuffled = [...deck.drawPile];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return {
          ...deck,
          drawPile: shuffled
        };
      });

      newState = { ...state, decks };
      break;
    }

    case 'RESHUFFLE_DISCARD': {
      const decks = state.decks.map(deck => {
        if (deck.id !== action.deckId) return deck;

        const combined = [...deck.drawPile, ...deck.discardPile];
        // Fisher-Yates shuffle
        for (let i = combined.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combined[i], combined[j]] = [combined[j], combined[i]];
        }

        return {
          ...deck,
          drawPile: combined,
          discardPile: []
        };
      });

      newState = { ...state, decks };
      break;
    }

    default:
      return state;
  }

  // Update history
  return {
    ...newState,
    actionHistory: newHistory,
    historyIndex: newHistory.length - 1
  };
}

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  config: GameConfig;
  children: ReactNode;
}

export function GameProvider({ config, children }: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    config,
    createInitialGameState
  );

  // Auto-save to localStorage on state changes
  useEffect(() => {
    saveGameToLocalStorage(state, config);
  }, [state, config]);

  // Helper functions
  const undo = () => {
    if (state.historyIndex > 0) {
      // Re-apply actions from the beginning up to historyIndex - 1
      // const newIndex = state.historyIndex - 1;
      // This is simplified - in a real implementation, we'd need to store
      // snapshots or implement proper undo by reversing actions
      // For now, we'll just track that undo was requested
    }
  };

  const redo = () => {
    if (state.historyIndex < state.actionHistory.length - 1) {
      // Re-apply the next action
      const nextAction = state.actionHistory[state.historyIndex + 1];
      if (nextAction) {
        dispatch(nextAction);
      }
    }
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.actionHistory.length - 1;

  const resetGame = () => {
    // const initialState = createInitialGameState(config);
    // We'll need to implement a RESET action type
    // For now, this is a placeholder
  };

  const saveGame = () => {
    const savedData = JSON.stringify({
      version: '1.0.0',
      timestamp: Date.now(),
      config,
      state
    });

    const blob = new Blob([savedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadGame = (_data: string) => {
    try {
      // const parsed = JSON.parse(data);
      // We'd need to validate and load this
      // For now, this is a placeholder
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  };

  const value: GameContextValue = {
    state,
    dispatch,
    undo,
    redo,
    canUndo,
    canRedo,
    resetGame,
    saveGame,
    loadGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
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
