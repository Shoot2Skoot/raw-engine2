/**
 * Game Context
 * Central state management for the game engine
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  GameState,
  GameConfig,
  GameStateSnapshot,
  GameAction,
  HistoryEntry,
  Sheet,
  ActiveTool,
  Mark,
  DicePool,
  Deck,
} from '../types';
import { rollDicePool } from '../utils/diceUtils';
import { discardAndDraw, shuffleDeck } from '../utils/cardUtils';

interface GameContextType {
  gameState: GameState;
  currentSheet: Sheet | null;
  placeMark: (sheetId: string, hotspotId: string, mark: Mark) => void;
  removeMark: (sheetId: string, hotspotId: string, markId: string) => void;
  selectTool: (tool: ActiveTool) => void;
  switchSheet: (sheetId: string) => void;
  rollDice: (poolId: string) => void;
  toggleDieLock: (poolId: string, dieId: string) => void;
  drawCard: (deckId: string) => void;
  shuffleDeckAction: (deckId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveGame: () => string;
  loadGame: (saveData: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  config: GameConfig;
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ config, children }) => {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(`game-${config.metadata.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }

    // Create initial state
    const sheetsMap: Record<string, Sheet> = {};
    config.sheets.forEach((sheet) => {
      sheetsMap[sheet.id] = sheet;
    });

    const dicePoolsMap: Record<string, DicePool> = {};
    config.dice?.pools.forEach((pool) => {
      dicePoolsMap[pool.id] = pool;
    });

    const decksMap: Record<string, Deck> = {};
    config.decks?.forEach((deck) => {
      decksMap[deck.id] = deck;
    });

    const initialSnapshot: GameStateSnapshot = {
      sheets: sheetsMap,
      dicePools: dicePoolsMap,
      decks: decksMap,
      rollHistory: [],
      activeSheetId: config.sheets[0]?.id || '',
      activeTool: {
        type: 'number',
        config: { mode: 'pen' },
      },
      timestamp: Date.now(),
    };

    return {
      game: config.metadata,
      current: initialSnapshot,
      history: [],
      historyIndex: -1,
    };
  });

  // Auto-save on state change
  useEffect(() => {
    const autoSaveInterval = config.ui?.autoSaveInterval || 5000;
    if (autoSaveInterval > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem(`game-${config.metadata.id}`, JSON.stringify(gameState));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, config.metadata.id, config.ui?.autoSaveInterval]);

  const currentSheet = gameState.current.sheets[gameState.current.activeSheetId] || null;

  // Create history entry
  const createHistoryEntry = useCallback(
    (action: GameAction, previousState: GameStateSnapshot): HistoryEntry => {
      return {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        timestamp: Date.now(),
        previousState,
      };
    },
    []
  );

  // Update state with history
  // Note: This helper is defined but not currently used - each action manages history inline
  // Keeping it here for future refactoring
  // const updateStateWithHistory = useCallback(
  //   (newSnapshot: GameStateSnapshot, action: GameAction) => {
  //     setGameState((prev) => {
  //       const historyEntry = createHistoryEntry(action, prev.current);
  //       const newHistory = prev.history.slice(0, prev.historyIndex + 1);
  //       newHistory.push(historyEntry);
  //
  //       return {
  //         ...prev,
  //         current: newSnapshot,
  //         history: newHistory.slice(-50), // Keep last 50 entries
  //         historyIndex: Math.min(newHistory.length - 1, 49),
  //       };
  //     });
  //   },
  //   [createHistoryEntry]
  // );

  const placeMark = useCallback(
    (sheetId: string, hotspotId: string, mark: Mark) => {
      setGameState((prev) => {
        const sheet = prev.current.sheets[sheetId];
        if (!sheet) return prev;

        const hotspotIndex = sheet.hotspots.findIndex((h) => h.id === hotspotId);
        if (hotspotIndex === -1) return prev;

        const hotspot = sheet.hotspots[hotspotIndex];
        const updatedHotspot = {
          ...hotspot,
          marks: [...hotspot.marks, mark],
        };

        const updatedHotspots = [...sheet.hotspots];
        updatedHotspots[hotspotIndex] = updatedHotspot;

        const updatedSheet = {
          ...sheet,
          hotspots: updatedHotspots,
        };

        const newSnapshot: GameStateSnapshot = {
          ...prev.current,
          sheets: {
            ...prev.current.sheets,
            [sheetId]: updatedSheet,
          },
          timestamp: Date.now(),
        };

        const historyEntry = createHistoryEntry(
          { type: 'place-mark', sheetId, hotspotId, markId: mark.id },
          prev.current
        );
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(historyEntry);

        return {
          ...prev,
          current: newSnapshot,
          history: newHistory.slice(-50),
          historyIndex: Math.min(newHistory.length - 1, 49),
        };
      });
    },
    [createHistoryEntry]
  );

  const removeMark = useCallback(
    (sheetId: string, hotspotId: string, markId: string) => {
      setGameState((prev) => {
        const sheet = prev.current.sheets[sheetId];
        if (!sheet) return prev;

        const hotspotIndex = sheet.hotspots.findIndex((h) => h.id === hotspotId);
        if (hotspotIndex === -1) return prev;

        const hotspot = sheet.hotspots[hotspotIndex];
        const updatedHotspot = {
          ...hotspot,
          marks: hotspot.marks.filter((m) => m.id !== markId),
        };

        const updatedHotspots = [...sheet.hotspots];
        updatedHotspots[hotspotIndex] = updatedHotspot;

        const updatedSheet = {
          ...sheet,
          hotspots: updatedHotspots,
        };

        const newSnapshot: GameStateSnapshot = {
          ...prev.current,
          sheets: {
            ...prev.current.sheets,
            [sheetId]: updatedSheet,
          },
          timestamp: Date.now(),
        };

        const historyEntry = createHistoryEntry(
          { type: 'remove-mark', sheetId, hotspotId, markId },
          prev.current
        );
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(historyEntry);

        return {
          ...prev,
          current: newSnapshot,
          history: newHistory.slice(-50),
          historyIndex: Math.min(newHistory.length - 1, 49),
        };
      });
    },
    [createHistoryEntry]
  );

  const selectTool = useCallback((tool: ActiveTool) => {
    setGameState((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        activeTool: tool,
      },
    }));
  }, []);

  const switchSheet = useCallback((sheetId: string) => {
    setGameState((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        activeSheetId: sheetId,
      },
    }));
  }, []);

  const rollDice = useCallback((poolId: string) => {
    setGameState((prev) => {
      const pool = prev.current.dicePools[poolId];
      if (!pool) return prev;

      const { pool: rolledPool, result } = rollDicePool(pool);

      const newSnapshot: GameStateSnapshot = {
        ...prev.current,
        dicePools: {
          ...prev.current.dicePools,
          [poolId]: rolledPool,
        },
        rollHistory: [...prev.current.rollHistory, result].slice(-20),
        timestamp: Date.now(),
      };

      const historyEntry = createHistoryEntry(
        { type: 'roll-dice', poolId },
        prev.current
      );
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(historyEntry);

      return {
        ...prev,
        current: newSnapshot,
        history: newHistory.slice(-50),
        historyIndex: Math.min(newHistory.length - 1, 49),
      };
    });
  }, [createHistoryEntry]);

  const toggleDieLock = useCallback((poolId: string, dieId: string) => {
    setGameState((prev) => {
      const pool = prev.current.dicePools[poolId];
      if (!pool) return prev;

      const updatedDice = pool.dice.map((die) =>
        die.id === dieId ? { ...die, locked: !die.locked } : die
      );

      return {
        ...prev,
        current: {
          ...prev.current,
          dicePools: {
            ...prev.current.dicePools,
            [poolId]: { ...pool, dice: updatedDice },
          },
        },
      };
    });
  }, []);

  const drawCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deck = prev.current.decks[deckId];
      if (!deck) return prev;

      const { deck: updatedDeck } = discardAndDraw(deck);

      return {
        ...prev,
        current: {
          ...prev.current,
          decks: {
            ...prev.current.decks,
            [deckId]: updatedDeck,
          },
        },
      };
    });
  }, []);

  const shuffleDeckAction = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deck = prev.current.decks[deckId];
      if (!deck) return prev;

      const shuffled = shuffleDeck(deck);

      return {
        ...prev,
        current: {
          ...prev.current,
          decks: {
            ...prev.current.decks,
            [deckId]: shuffled,
          },
        },
      };
    });
  }, []);

  const undo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex < 0) return prev;

      const historyEntry = prev.history[prev.historyIndex];
      return {
        ...prev,
        current: historyEntry.previousState,
        historyIndex: prev.historyIndex - 1,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      // We need to apply the action from the next history entry
      // For now, redo isn't fully implemented
      // TODO: Implement full redo by re-applying the next history action
      return prev;
    });
  }, []);

  const canUndo = gameState.historyIndex >= 0;
  const canRedo = gameState.historyIndex < gameState.history.length - 1;

  const saveGame = useCallback(() => {
    const saveData = JSON.stringify(gameState);
    localStorage.setItem(`game-${config.metadata.id}`, saveData);
    return saveData;
  }, [gameState, config.metadata.id]);

  const loadGame = useCallback((saveData: string) => {
    try {
      const loaded = JSON.parse(saveData);
      setGameState(loaded);
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(`game-${config.metadata.id}`);
    window.location.reload();
  }, [config.metadata.id]);

  const value: GameContextType = {
    gameState,
    currentSheet,
    placeMark,
    removeMark,
    selectTool,
    switchSheet,
    rollDice,
    toggleDieLock,
    drawCard,
    shuffleDeckAction,
    undo,
    redo,
    canUndo,
    canRedo,
    saveGame,
    loadGame,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
