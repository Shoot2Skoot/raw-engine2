import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, GameAction, GameConfig } from '../types';
import { gameReducer } from '../lib/gameReducer';
import { createInitialState } from '../lib/gameInitializer';

/**
 * Game Context - Provides game state and dispatch to all components
 */

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  config: GameConfig;
  children: ReactNode;
  autoSave?: boolean;
  storageKey?: string;
}

/**
 * Game Provider - Wraps the app and provides game state
 */
export function GameProvider({
  config,
  children,
  autoSave = true,
  storageKey = 'raw-engine-game-state'
}: GameProviderProps) {
  // Try to load saved state from localStorage
  const loadSavedState = (): GameState | null => {
    if (!autoSave) return null;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify it's for the same game/version
        if (parsed.metadata.name === config.name && parsed.metadata.version === config.version) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved state:', error);
    }
    return null;
  };

  const initialState = loadSavedState() || createInitialState(config);
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (autoSave) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    }
  }, [state, autoSave, storageKey]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to access game state and dispatch
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/**
 * Hook to access just the state (for read-only components)
 */
export function useGameState() {
  const { state } = useGame();
  return state;
}

/**
 * Hook to access just the dispatch (for action components)
 */
export function useGameDispatch() {
  const { dispatch } = useGame();
  return dispatch;
}
