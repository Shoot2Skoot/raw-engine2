/**
 * Core game engine hook - manages all game state and interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  GameState,
  GameDefinition,
  Mark,
  Tool,
  Action,
} from '../types';
import { generateId, shuffleArray } from '../utils/helpers';

export function useGameEngine(gameDefinition: GameDefinition) {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem(`game-${gameDefinition.id}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return parsed;
      } catch {
        // Fall through to create new state
      }
    }

    return {
      gameId: gameDefinition.id,
      gameName: gameDefinition.name,
      sheets: gameDefinition.sheets,
      marks: {},
      dicePool: gameDefinition.dicePool || [],
      decks: gameDefinition.decks || [],
      currentSheetId: gameDefinition.sheets[0]?.id || '',
      currentTool: {
        type: gameDefinition.defaultTool || 'checkbox',
        isPencilMode: false,
      },
      history: [],
      historyIndex: -1,
      colorPalette: gameDefinition.colorPalette || [
        '#ef4444',
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#ec4899',
      ],
      symbolPalette: gameDefinition.symbolPalette || [],
      timestamp: Date.now(),
    };
  });

  // Auto-save to localStorage
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      localStorage.setItem(`game-${gameDefinition.id}`, JSON.stringify(gameState));
    }, 500); // Debounce saves

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, gameDefinition.id]);

  // Add action to history (helper function to be used inside setState)
  const createHistoryAction = (
    prev: GameState,
    action: Omit<Action, 'id' | 'timestamp'>
  ): GameState => {
    const newHistory = prev.history.slice(0, prev.historyIndex + 1);
    const newAction: Action = {
      ...action,
      id: generateId(),
      timestamp: Date.now(),
    };
    return {
      ...prev,
      history: [...newHistory, newAction],
      historyIndex: newHistory.length,
    };
  };

  // Place a mark on a hotspot
  const placeMark = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sheetId: string, hotspotId: string, mark: any) => {
      setGameState((prev) => {
        const sheetMarks = prev.marks[sheetId] || [];
        const newMark: Mark = {
          ...mark,
          id: generateId(),
          hotspotId,
          timestamp: Date.now(),
          isPencil: prev.currentTool.isPencilMode,
        } as Mark;

        const withHistory = createHistoryAction(prev, {
          type: 'place-mark',
          data: { sheetId, mark: newMark },
          sheetId,
        });

        return {
          ...withHistory,
          marks: {
            ...prev.marks,
            [sheetId]: [...sheetMarks, newMark],
          },
          timestamp: Date.now(),
        };
      });
    },
    []
  );

  // Remove a mark
  const removeMark = useCallback(
    (sheetId: string, markId: string) => {
      setGameState((prev) => {
        const sheetMarks = prev.marks[sheetId] || [];
        const mark = sheetMarks.find((m) => m.id === markId);

        let newState = prev;
        if (mark) {
          newState = createHistoryAction(prev, {
            type: 'remove-mark',
            data: { sheetId, mark },
            sheetId,
          });
        }

        return {
          ...newState,
          marks: {
            ...prev.marks,
            [sheetId]: sheetMarks.filter((m) => m.id !== markId),
          },
          timestamp: Date.now(),
        };
      });
    },
    []
  );

  // Update current tool
  const setTool = useCallback((tool: Tool) => {
    setGameState((prev) => ({
      ...prev,
      currentTool: tool,
      timestamp: Date.now(),
    }));
  }, []);

  // Switch to a different sheet
  const switchSheet = useCallback((sheetId: string) => {
    setGameState((prev) => ({
      ...prev,
      currentSheetId: sheetId,
      timestamp: Date.now(),
    }));
  }, []);

  // Undo last action
  const undo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex < 0) return prev;

      const action = prev.history[prev.historyIndex];
      let newState = { ...prev, historyIndex: prev.historyIndex - 1 };

      // Reverse the action
      if (action.type === 'place-mark' && action.sheetId) {
        const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
        newState.marks = {
          ...newState.marks,
          [sheetId]: (newState.marks[sheetId] || []).filter((m) => m.id !== mark.id),
        };
      } else if (action.type === 'remove-mark' && action.sheetId) {
        const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
        newState.marks = {
          ...newState.marks,
          [sheetId]: [...(newState.marks[sheetId] || []), mark],
        };
      }

      return { ...newState, timestamp: Date.now() };
    });
  }, []);

  // Redo last undone action
  const redo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const nextIndex = prev.historyIndex + 1;
      const action = prev.history[nextIndex];
      let newState = { ...prev, historyIndex: nextIndex };

      // Reapply the action
      if (action.type === 'place-mark' && action.sheetId) {
        const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
        newState.marks = {
          ...newState.marks,
          [sheetId]: [...(newState.marks[sheetId] || []), mark],
        };
      } else if (action.type === 'remove-mark' && action.sheetId) {
        const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
        newState.marks = {
          ...newState.marks,
          [sheetId]: (newState.marks[sheetId] || []).filter((m) => m.id !== mark.id),
        };
      }

      return { ...newState, timestamp: Date.now() };
    });
  }, []);

  // Roll dice in a pool
  const rollDice = useCallback((poolId: string, dieIds?: string[]) => {
    setGameState((prev) => {
      const pool = prev.dicePool.find((p) => p.id === poolId);
      if (!pool) return prev;

      const updatedDice = pool.dice.map((die) => {
        // Skip if not in the list of dice to roll (or roll all if no list)
        if (dieIds && !dieIds.includes(die.id)) return die;
        if (die.locked) return die;

        if (die.type === 'standard') {
          return {
            ...die,
            currentValue: Math.floor(Math.random() * die.sides) + 1,
          };
        } else {
          return {
            ...die,
            currentFaceIndex: Math.floor(Math.random() * die.faces.length),
          };
        }
      });

      const withHistory = createHistoryAction(prev, {
        type: 'roll-dice',
        data: { poolId, dieIds },
      });

      return {
        ...withHistory,
        dicePool: prev.dicePool.map((p) =>
          p.id === poolId ? { ...p, dice: updatedDice } : p
        ),
        timestamp: Date.now(),
      };
    });
  }, []);

  // Lock/unlock a die
  const toggleDieLock = useCallback((poolId: string, dieId: string) => {
    setGameState((prev) => ({
      ...prev,
      dicePool: prev.dicePool.map((pool) =>
        pool.id === poolId
          ? {
              ...pool,
              dice: pool.dice.map((die) =>
                die.id === dieId ? { ...die, locked: !die.locked } : die
              ),
            }
          : pool
      ),
      timestamp: Date.now(),
    }));
  }, []);

  // Shuffle a deck
  const shuffleDeck = useCallback((deckId: string) => {
    setGameState((prev) => ({
      ...prev,
      decks: prev.decks.map((deck) =>
        deck.id === deckId
          ? { ...deck, drawPile: shuffleArray([...deck.drawPile]) }
          : deck
      ),
      timestamp: Date.now(),
    }));
  }, []);

  // Draw a card from deck
  const drawCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deck = prev.decks.find((d) => d.id === deckId);
      if (!deck || deck.drawPile.length === 0) return prev;

      const [drawnCard, ...remaining] = deck.drawPile;

      const withHistory = createHistoryAction(prev, {
        type: 'draw-card',
        data: { deckId, card: drawnCard },
      });

      return {
        ...withHistory,
        decks: prev.decks.map((d) =>
          d.id === deckId
            ? { ...d, drawPile: remaining, currentCard: drawnCard }
            : d
        ),
        timestamp: Date.now(),
      };
    });
  }, []);

  // Discard current card
  const discardCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deck = prev.decks.find((d) => d.id === deckId);
      if (!deck || !deck.currentCard) return prev;

      const withHistory = createHistoryAction(prev, {
        type: 'discard-card',
        data: { deckId, card: deck.currentCard },
      });

      return {
        ...withHistory,
        decks: prev.decks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                discardPile: [...d.discardPile, deck.currentCard!],
                currentCard: undefined,
              }
            : d
        ),
        timestamp: Date.now(),
      };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      setGameState({
        gameId: gameDefinition.id,
        gameName: gameDefinition.name,
        sheets: gameDefinition.sheets,
        marks: {},
        dicePool: gameDefinition.dicePool || [],
        decks: gameDefinition.decks || [],
        currentSheetId: gameDefinition.sheets[0]?.id || '',
        currentTool: {
          type: gameDefinition.defaultTool || 'checkbox',
          isPencilMode: false,
        },
        history: [],
        historyIndex: -1,
        colorPalette: gameDefinition.colorPalette || [],
        symbolPalette: gameDefinition.symbolPalette || [],
        timestamp: Date.now(),
      });
    }
  }, [gameDefinition]);

  // Export game state as JSON
  const exportGame = useCallback(() => {
    const saveData = {
      version: '1.0.0',
      gameDefinition,
      gameState,
      timestamp: Date.now(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameDefinition.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gameDefinition, gameState]);

  // Import game state from JSON
  const importGame = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.gameState) {
          setGameState(data.gameState);
        }
      } catch (error) {
        console.error('Failed to import game:', error);
        alert('Failed to import game file');
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    gameState,
    placeMark,
    removeMark,
    setTool,
    switchSheet,
    undo,
    redo,
    rollDice,
    toggleDieLock,
    shuffleDeck,
    drawCard,
    discardCard,
    resetGame,
    exportGame,
    importGame,
  };
}
