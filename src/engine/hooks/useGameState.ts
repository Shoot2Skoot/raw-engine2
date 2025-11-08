/**
 * useGameState - Main game state management hook
 * Handles marks, dice, cards, undo/redo, and auto-save
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  GameState,
  GameConfig,
  GameAction,
  Tool,
  Mark,
  SavedGame,
} from '../types';
import { rollDice, toggleLock } from '../utils/dice-utils';
import {
  drawCards,
  discardActiveCard,
  shuffleDeck,
} from '../utils/card-utils';

const SAVE_KEY_PREFIX = 'roll-write-game-';
const AUTO_SAVE_DELAY = 1000; // Auto-save after 1 second of inactivity

/**
 * Initialize game state from config
 */
function initializeGameState(config: GameConfig): GameState {
  return {
    gameId: config.id,
    gameName: config.name,
    version: config.version,
    sheets: config.sheets,
    activeSheetId: config.defaultSheet || config.sheets[0]?.id || '',
    marks: {},
    dicePools: config.dicePools || [],
    decks: config.decks || [],
    selectedTool: config.defaultTool,
    history: {
      past: [],
      future: [],
    },
    metadata: {},
    lastModified: Date.now(),
  };
}

export function useGameState(config: GameConfig) {
  // Try to load saved state from localStorage
  const getSavedState = (): GameState | null => {
    try {
      const saved = localStorage.getItem(`${SAVE_KEY_PREFIX}${config.id}`);
      if (saved) {
        const parsedState: SavedGame = JSON.parse(saved);
        // Verify it's the same version
        if (parsedState.config.version === config.version) {
          return parsedState.state;
        }
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
    return null;
  };

  const [state, setState] = useState<GameState>(() => {
    const saved = getSavedState();
    return saved || initializeGameState(config);
  });

  const saveTimeoutRef = useRef<number | null>(null);

  // Auto-save to localStorage
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const savedGame: SavedGame = {
          config,
          state: { ...state, lastSaved: Date.now() },
          savedAt: Date.now(),
          saveVersion: '1.0.0',
        };
        localStorage.setItem(`${SAVE_KEY_PREFIX}${config.id}`, JSON.stringify(savedGame));
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, AUTO_SAVE_DELAY);
  }, [config, state]);

  // Auto-save whenever state changes
  useEffect(() => {
    autoSave();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, autoSave]);

  // === MARK ACTIONS ===

  const placeMark = useCallback(
    (sheetId: string, hotspotId: string, mark: Mark) => {
      setState((prev) => {
        const sheetMarks = prev.marks[sheetId] || {};
        const hotspotMarks = sheetMarks[hotspotId] || [];

        const action: GameAction = {
          type: 'PLACE_MARK',
          sheetId,
          hotspotId,
          mark,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          marks: {
            ...prev.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: [...hotspotMarks, mark],
            },
          },
          history: {
            past: [...prev.history.past, { action }],
            future: [], // Clear redo history when new action taken
          },
          lastModified: Date.now(),
        };
      });
    },
    []
  );

  const removeMark = useCallback(
    (sheetId: string, hotspotId: string, markIndex: number) => {
      setState((prev) => {
        const sheetMarks = prev.marks[sheetId] || {};
        const hotspotMarks = sheetMarks[hotspotId] || [];

        if (markIndex < 0 || markIndex >= hotspotMarks.length) {
          return prev;
        }

        const previousMark = hotspotMarks[markIndex];
        const newHotspotMarks = hotspotMarks.filter((_, i) => i !== markIndex);

        const action: GameAction = {
          type: 'REMOVE_MARK',
          sheetId,
          hotspotId,
          markIndex,
          previousMark,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          marks: {
            ...prev.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: newHotspotMarks,
            },
          },
          history: {
            past: [...prev.history.past, { action }],
            future: [],
          },
          lastModified: Date.now(),
        };
      });
    },
    []
  );

  const updateMark = useCallback(
    (sheetId: string, hotspotId: string, markIndex: number, newMark: Mark) => {
      setState((prev) => {
        const sheetMarks = prev.marks[sheetId] || {};
        const hotspotMarks = sheetMarks[hotspotId] || [];

        if (markIndex < 0 || markIndex >= hotspotMarks.length) {
          return prev;
        }

        const previousMark = hotspotMarks[markIndex];
        const newHotspotMarks = [...hotspotMarks];
        newHotspotMarks[markIndex] = newMark;

        const action: GameAction = {
          type: 'UPDATE_MARK',
          sheetId,
          hotspotId,
          markIndex,
          previousMark,
          newMark,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          marks: {
            ...prev.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: newHotspotMarks,
            },
          },
          history: {
            past: [...prev.history.past, { action }],
            future: [],
          },
          lastModified: Date.now(),
        };
      });
    },
    []
  );

  const clearHotspot = useCallback((sheetId: string, hotspotId: string) => {
    setState((prev) => {
      const sheetMarks = prev.marks[sheetId] || {};

      return {
        ...prev,
        marks: {
          ...prev.marks,
          [sheetId]: {
            ...sheetMarks,
            [hotspotId]: [],
          },
        },
        lastModified: Date.now(),
      };
    });
  }, []);

  // === DICE ACTIONS ===

  const rollDicePool = useCallback((poolId: string) => {
    setState((prev) => {
      const poolIndex = prev.dicePools.findIndex((p) => p.id === poolId);
      if (poolIndex === -1) return prev;

      const pool = prev.dicePools[poolIndex];

      // Re-roll unlocked dice
      const newResults = pool.dice.map((die) => {
        const existing = pool.results?.find((r) => r.dieId === die.id);
        if (existing && existing.locked) {
          return existing;
        }
        return rollDice([die])[0];
      });

      const newPools = [...prev.dicePools];
      newPools[poolIndex] = {
        ...pool,
        results: newResults,
        history: [
          ...(pool.history || []),
          {
            timestamp: Date.now(),
            results: newResults,
          },
        ],
      };

      return {
        ...prev,
        dicePools: newPools,
        lastModified: Date.now(),
      };
    });
  }, []);

  const lockDie = useCallback((poolId: string, resultId: string) => {
    setState((prev) => {
      const poolIndex = prev.dicePools.findIndex((p) => p.id === poolId);
      if (poolIndex === -1) return prev;

      const pool = prev.dicePools[poolIndex];
      if (!pool.results) return prev;

      const newResults = pool.results.map((r) =>
        r.resultId === resultId ? toggleLock(r) : r
      );

      const newPools = [...prev.dicePools];
      newPools[poolIndex] = { ...pool, results: newResults };

      return {
        ...prev,
        dicePools: newPools,
        lastModified: Date.now(),
      };
    });
  }, []);

  // === CARD/DECK ACTIONS ===

  const shuffleCardDeck = useCallback((deckId: string) => {
    setState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const newDecks = [...prev.decks];
      newDecks[deckIndex] = shuffleDeck(prev.decks[deckIndex]);

      return {
        ...prev,
        decks: newDecks,
        lastModified: Date.now(),
      };
    });
  }, []);

  const drawCard = useCallback((deckId: string, count: number = 1) => {
    setState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const { deck: newDeck } = drawCards(prev.decks[deckIndex], count);

      const newDecks = [...prev.decks];
      newDecks[deckIndex] = newDeck;

      return {
        ...prev,
        decks: newDecks,
        lastModified: Date.now(),
      };
    });
  }, []);

  const discardCard = useCallback((deckId: string) => {
    setState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const newDecks = [...prev.decks];
      newDecks[deckIndex] = discardActiveCard(prev.decks[deckIndex]);

      return {
        ...prev,
        decks: newDecks,
        lastModified: Date.now(),
      };
    });
  }, []);

  // === TOOL ACTIONS ===

  const selectTool = useCallback((tool: Tool) => {
    setState((prev) => ({
      ...prev,
      selectedTool: tool,
      lastModified: Date.now(),
    }));
  }, []);

  // === SHEET NAVIGATION ===

  const switchSheet = useCallback((sheetId: string) => {
    setState((prev) => ({
      ...prev,
      activeSheetId: sheetId,
      lastModified: Date.now(),
    }));
  }, []);

  // === UNDO/REDO ===

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.history.past.length === 0) return prev;

      const lastEntry = prev.history.past[prev.history.past.length - 1];
      const newPast = prev.history.past.slice(0, -1);

      // Reverse the action
      let newState = { ...prev };

      switch (lastEntry.action.type) {
        case 'PLACE_MARK': {
          const { sheetId, hotspotId } = lastEntry.action;
          const sheetMarks = newState.marks[sheetId] || {};
          const hotspotMarks = (sheetMarks[hotspotId] || []).slice(0, -1);
          newState.marks = {
            ...newState.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: hotspotMarks,
            },
          };
          break;
        }
        case 'REMOVE_MARK': {
          const { sheetId, hotspotId, markIndex, previousMark } = lastEntry.action;
          const sheetMarks = newState.marks[sheetId] || {};
          const hotspotMarks = [...(sheetMarks[hotspotId] || [])];
          hotspotMarks.splice(markIndex, 0, previousMark);
          newState.marks = {
            ...newState.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: hotspotMarks,
            },
          };
          break;
        }
        // Add other undo cases as needed
      }

      return {
        ...newState,
        history: {
          past: newPast,
          future: [lastEntry, ...prev.history.future],
        },
        lastModified: Date.now(),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.history.future.length === 0) return prev;

      const nextEntry = prev.history.future[0];
      const newFuture = prev.history.future.slice(1);

      // Re-apply the action
      let newState = { ...prev };

      switch (nextEntry.action.type) {
        case 'PLACE_MARK': {
          const { sheetId, hotspotId, mark } = nextEntry.action;
          const sheetMarks = newState.marks[sheetId] || {};
          const hotspotMarks = sheetMarks[hotspotId] || [];
          newState.marks = {
            ...newState.marks,
            [sheetId]: {
              ...sheetMarks,
              [hotspotId]: [...hotspotMarks, mark],
            },
          };
          break;
        }
        // Add other redo cases as needed
      }

      return {
        ...newState,
        history: {
          past: [...prev.history.past, nextEntry],
          future: newFuture,
        },
        lastModified: Date.now(),
      };
    });
  }, []);

  // === SAVE/LOAD/RESET ===

  const saveToFile = useCallback(() => {
    const savedGame: SavedGame = {
      config,
      state,
      savedAt: Date.now(),
      saveVersion: '1.0.0',
    };

    const json = JSON.stringify(savedGame, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name}-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [config, state]);

  const loadFromFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const savedGame: SavedGame = JSON.parse(e.target?.result as string);
          setState(savedGame.state);
        } catch (error) {
          console.error('Failed to load game:', error);
          alert('Failed to load game file');
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const resetGame = useCallback(() => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      setState(initializeGameState(config));
    }
  }, [config]);

  const resetSheet = useCallback(
    (sheetId: string) => {
      setState((prev) => ({
        ...prev,
        marks: {
          ...prev.marks,
          [sheetId]: {},
        },
        lastModified: Date.now(),
      }));
    },
    []
  );

  return {
    state,
    // Mark actions
    placeMark,
    removeMark,
    updateMark,
    clearHotspot,
    // Dice actions
    rollDicePool,
    lockDie,
    // Card actions
    shuffleCardDeck,
    drawCard,
    discardCard,
    // Tool actions
    selectTool,
    // Sheet navigation
    switchSheet,
    // Undo/redo
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
    // Save/load/reset
    saveToFile,
    loadFromFile,
    resetGame,
    resetSheet,
  };
}
