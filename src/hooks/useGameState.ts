import { useState, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameConfig,
  Mark,
  Action,
  DieFace,
} from '../types';
import {
  generateId,
  shuffle,
  rollStandardDie,
  rollCustomDie,
  saveToLocalStorage,
  loadFromLocalStorage,
  downloadJSON,
} from '../utils/helpers';

/**
 * Main hook for managing game state
 */
export function useGameState(config: GameConfig) {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved state
    const saved = loadFromLocalStorage<GameState>(`game-${config.name}`);
    if (saved) {
      return saved;
    }

    // Initialize new game state
    return {
      gameId: generateId(),
      gameName: config.name,
      sheets: config.sheets,
      currentSheetId: config.sheets[0]?.id || '',
      marks: Object.fromEntries(config.sheets.map((sheet) => [sheet.id, []])),
      dicePools: config.dicePools || [],
      decks: config.decks || [],
      history: [],
      historyIndex: -1,
    };
  });

  // Auto-save to localStorage
  useEffect(() => {
    saveToLocalStorage(`game-${config.name}`, {
      ...gameState,
      lastSaved: Date.now(),
    });
  }, [gameState, config.name]);

  // ============================================================================
  // Sheet Management
  // ============================================================================

  const setCurrentSheet = useCallback((sheetId: string) => {
    setGameState((prev) => ({
      ...prev,
      currentSheetId: sheetId,
    }));
  }, []);

  // ============================================================================
  // Mark Management
  // ============================================================================

  const addMark = useCallback((sheetId: string, mark: Mark) => {
    setGameState((prev) => {
      const newMarks = {
        ...prev.marks,
        [sheetId]: [...(prev.marks[sheetId] || []), mark],
      };

      const action: Action = {
        id: generateId(),
        type: 'mark-placed',
        timestamp: Date.now(),
        data: { sheetId, mark },
        sheetId,
      };

      return {
        ...prev,
        marks: newMarks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const removeMark = useCallback((sheetId: string, markId: string) => {
    setGameState((prev) => {
      const mark = prev.marks[sheetId]?.find((m) => m.id === markId);
      if (!mark) return prev;

      const newMarks = {
        ...prev.marks,
        [sheetId]: prev.marks[sheetId].filter((m) => m.id !== markId),
      };

      const action: Action = {
        id: generateId(),
        type: 'mark-removed',
        timestamp: Date.now(),
        data: { sheetId, mark },
        sheetId,
      };

      return {
        ...prev,
        marks: newMarks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const updateMark = useCallback((sheetId: string, markId: string, updates: Partial<Mark>) => {
    setGameState((prev) => {
      const markIndex = prev.marks[sheetId]?.findIndex((m) => m.id === markId);
      if (markIndex === -1 || markIndex === undefined) return prev;

      const oldMark = prev.marks[sheetId][markIndex];
      const newMark = { ...oldMark, ...updates } as Mark;

      const newMarks = {
        ...prev.marks,
        [sheetId]: [
          ...prev.marks[sheetId].slice(0, markIndex),
          newMark,
          ...prev.marks[sheetId].slice(markIndex + 1),
        ],
      };

      const action: Action = {
        id: generateId(),
        type: 'mark-modified',
        timestamp: Date.now(),
        data: { sheetId, oldMark, newMark },
        sheetId,
      };

      return {
        ...prev,
        marks: newMarks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const getMarksForHotspot = useCallback(
    (sheetId: string, hotspotId: string) => {
      return gameState.marks[sheetId]?.filter((m) => m.hotspotId === hotspotId) || [];
    },
    [gameState.marks]
  );

  // ============================================================================
  // Dice Management
  // ============================================================================

  const rollDice = useCallback((poolId: string, diceIds?: string[]) => {
    setGameState((prev) => {
      const poolIndex = prev.dicePools.findIndex((p) => p.id === poolId);
      if (poolIndex === -1) return prev;

      const pool = prev.dicePools[poolIndex];
      const newDice = pool.dice.map((die) => {
        // Skip if specific dice were requested and this isn't one
        if (diceIds && !diceIds.includes(die.id)) return die;
        // Skip locked dice
        if (die.locked) return die;

        // Roll the die
        let currentFace: DieFace | number;
        if (die.dieConfig.type === 'standard') {
          currentFace = rollStandardDie(die.dieConfig.sides);
        } else {
          currentFace = rollCustomDie(die.dieConfig.faces);
        }

        return {
          ...die,
          currentFace,
          modified: false,
        };
      });

      const newPool = { ...pool, dice: newDice };
      const newPools = [
        ...prev.dicePools.slice(0, poolIndex),
        newPool,
        ...prev.dicePools.slice(poolIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'dice-rolled',
        timestamp: Date.now(),
        data: { poolId, diceIds },
      };

      return {
        ...prev,
        dicePools: newPools,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const toggleDieLock = useCallback((poolId: string, dieId: string) => {
    setGameState((prev) => {
      const poolIndex = prev.dicePools.findIndex((p) => p.id === poolId);
      if (poolIndex === -1) return prev;

      const pool = prev.dicePools[poolIndex];
      const dieIndex = pool.dice.findIndex((d) => d.id === dieId);
      if (dieIndex === -1) return prev;

      const die = pool.dice[dieIndex];
      const newDie = { ...die, locked: !die.locked };

      const newDice = [
        ...pool.dice.slice(0, dieIndex),
        newDie,
        ...pool.dice.slice(dieIndex + 1),
      ];

      const newPool = { ...pool, dice: newDice };
      const newPools = [
        ...prev.dicePools.slice(0, poolIndex),
        newPool,
        ...prev.dicePools.slice(poolIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'die-locked',
        timestamp: Date.now(),
        data: { poolId, dieId, locked: newDie.locked },
      };

      return {
        ...prev,
        dicePools: newPools,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const modifyDieValue = useCallback(
    (poolId: string, dieId: string, newValue: DieFace | number) => {
      setGameState((prev) => {
        const poolIndex = prev.dicePools.findIndex((p) => p.id === poolId);
        if (poolIndex === -1) return prev;

        const pool = prev.dicePools[poolIndex];
        const dieIndex = pool.dice.findIndex((d) => d.id === dieId);
        if (dieIndex === -1) return prev;

        const die = pool.dice[dieIndex];
        const newDie = {
          ...die,
          currentFace: newValue,
          modified: true,
        };

        const newDice = [
          ...pool.dice.slice(0, dieIndex),
          newDie,
          ...pool.dice.slice(dieIndex + 1),
        ];

        const newPool = { ...pool, dice: newDice };
        const newPools = [
          ...prev.dicePools.slice(0, poolIndex),
          newPool,
          ...prev.dicePools.slice(poolIndex + 1),
        ];

        const action: Action = {
          id: generateId(),
          type: 'die-modified',
          timestamp: Date.now(),
          data: { poolId, dieId, newValue },
        };

        return {
          ...prev,
          dicePools: newPools,
          history: [...prev.history.slice(0, prev.historyIndex + 1), action],
          historyIndex: prev.historyIndex + 1,
        };
      });
    },
    []
  );

  // ============================================================================
  // Card/Deck Management
  // ============================================================================

  const shuffleDeck = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const deck = prev.decks[deckIndex];
      const shuffledPile = shuffle(deck.drawPile);
      const newDeck = { ...deck, drawPile: shuffledPile };

      const newDecks = [
        ...prev.decks.slice(0, deckIndex),
        newDeck,
        ...prev.decks.slice(deckIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'deck-shuffled',
        timestamp: Date.now(),
        data: { deckId },
      };

      return {
        ...prev,
        decks: newDecks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const drawCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const deck = prev.decks[deckIndex];
      if (deck.drawPile.length === 0) return prev;

      const [drawnCard, ...remainingPile] = deck.drawPile;
      const newDeck = {
        ...deck,
        drawPile: remainingPile,
        currentCard: drawnCard,
      };

      const newDecks = [
        ...prev.decks.slice(0, deckIndex),
        newDeck,
        ...prev.decks.slice(deckIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'card-drawn',
        timestamp: Date.now(),
        data: { deckId, card: drawnCard },
      };

      return {
        ...prev,
        decks: newDecks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const discardCurrentCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const deck = prev.decks[deckIndex];
      if (!deck.currentCard) return prev;

      const newDeck = {
        ...deck,
        discardPile: [...deck.discardPile, deck.currentCard],
        currentCard: undefined,
      };

      const newDecks = [
        ...prev.decks.slice(0, deckIndex),
        newDeck,
        ...prev.decks.slice(deckIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'card-discarded',
        timestamp: Date.now(),
        data: { deckId, card: deck.currentCard },
      };

      return {
        ...prev,
        decks: newDecks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  const reshuffleDiscard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const deckIndex = prev.decks.findIndex((d) => d.id === deckId);
      if (deckIndex === -1) return prev;

      const deck = prev.decks[deckIndex];
      const shuffledDiscard = shuffle(deck.discardPile);
      const newDeck = {
        ...deck,
        drawPile: [...deck.drawPile, ...shuffledDiscard],
        discardPile: [],
      };

      const newDecks = [
        ...prev.decks.slice(0, deckIndex),
        newDeck,
        ...prev.decks.slice(deckIndex + 1),
      ];

      const action: Action = {
        id: generateId(),
        type: 'deck-shuffled',
        timestamp: Date.now(),
        data: { deckId, reshuffled: true },
      };

      return {
        ...prev,
        decks: newDecks,
        history: [...prev.history.slice(0, prev.historyIndex + 1), action],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  // ============================================================================
  // Undo/Redo
  // ============================================================================

  const undo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex < 0) return prev;

      const action = prev.history[prev.historyIndex];
      let newState = { ...prev, historyIndex: prev.historyIndex - 1 };

      // Revert the action
      switch (action.type) {
        case 'mark-placed': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          newState.marks = {
            ...newState.marks,
            [sheetId]: newState.marks[sheetId].filter((m) => m.id !== mark.id),
          };
          break;
        }
        case 'mark-removed': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          newState.marks = {
            ...newState.marks,
            [sheetId]: [...newState.marks[sheetId], mark],
          };
          break;
        }
        case 'mark-modified': {
          const { sheetId, oldMark } = action.data as {
            sheetId: string;
            oldMark: Mark;
            newMark: Mark;
          };
          const markIndex = newState.marks[sheetId].findIndex((m) => m.id === oldMark.id);
          if (markIndex !== -1) {
            newState.marks = {
              ...newState.marks,
              [sheetId]: [
                ...newState.marks[sheetId].slice(0, markIndex),
                oldMark,
                ...newState.marks[sheetId].slice(markIndex + 1),
              ],
            };
          }
          break;
        }
        // Add more action reversals as needed
      }

      return newState;
    });
  }, []);

  const redo = useCallback(() => {
    setGameState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const action = prev.history[prev.historyIndex + 1];
      let newState = { ...prev, historyIndex: prev.historyIndex + 1 };

      // Re-apply the action
      switch (action.type) {
        case 'mark-placed': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          newState.marks = {
            ...newState.marks,
            [sheetId]: [...newState.marks[sheetId], mark],
          };
          break;
        }
        case 'mark-removed': {
          const { sheetId, mark } = action.data as { sheetId: string; mark: Mark };
          newState.marks = {
            ...newState.marks,
            [sheetId]: newState.marks[sheetId].filter((m) => m.id !== mark.id),
          };
          break;
        }
        case 'mark-modified': {
          const { sheetId, newMark } = action.data as {
            sheetId: string;
            oldMark: Mark;
            newMark: Mark;
          };
          const markIndex = newState.marks[sheetId].findIndex((m) => m.id === newMark.id);
          if (markIndex !== -1) {
            newState.marks = {
              ...newState.marks,
              [sheetId]: [
                ...newState.marks[sheetId].slice(0, markIndex),
                newMark,
                ...newState.marks[sheetId].slice(markIndex + 1),
              ],
            };
          }
          break;
        }
        // Add more action re-applications as needed
      }

      return newState;
    });
  }, []);

  // ============================================================================
  // Save/Load
  // ============================================================================

  const saveGame = useCallback(() => {
    const filename = `${gameState.gameName}-${Date.now()}.json`;
    downloadJSON(filename, gameState);
  }, [gameState]);

  const loadGame = useCallback((data: GameState) => {
    setGameState(data);
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      gameId: generateId(),
      gameName: config.name,
      sheets: config.sheets,
      currentSheetId: config.sheets[0]?.id || '',
      marks: Object.fromEntries(config.sheets.map((sheet) => [sheet.id, []])),
      dicePools: config.dicePools || [],
      decks: config.decks || [],
      history: [],
      historyIndex: -1,
    });
  }, [config]);

  return {
    gameState,
    // Sheet management
    setCurrentSheet,
    // Mark management
    addMark,
    removeMark,
    updateMark,
    getMarksForHotspot,
    // Dice management
    rollDice,
    toggleDieLock,
    modifyDieValue,
    // Card/deck management
    shuffleDeck,
    drawCard,
    discardCurrentCard,
    reshuffleDiscard,
    // History
    undo,
    redo,
    canUndo: gameState.historyIndex >= 0,
    canRedo: gameState.historyIndex < gameState.history.length - 1,
    // Save/load
    saveGame,
    loadGame,
    resetGame,
  };
}
