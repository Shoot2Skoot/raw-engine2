import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  GameConfig,
  GameState,
  Mark,
  Action,
  DicePool,
  DieInstance,
  DeckInstance,
  MarkType,
  SaveFile,
  SheetState,
} from '../types';
import {
  generateId,
  shuffle,
  rollDie,
  rollWeightedDie,
  saveToLocalStorage,
  loadFromLocalStorage,
  downloadJSON,
} from '../utils/helpers';

const AUTOSAVE_KEY = 'raw-engine-autosave';
const AUTOSAVE_INTERVAL = 1000; // Save every second

/**
 * Main game engine hook - manages all game state
 */
export function useGameEngine(config: GameConfig) {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from autosave
    const saved = loadFromLocalStorage<SaveFile>(AUTOSAVE_KEY);
    if (saved && saved.config.id === config.id) {
      return saved.state;
    }

    // Initialize new game state
    return initializeGameState(config);
  });

  const autosaveTimerRef = useRef<number | undefined>(undefined);

  // Auto-save to localStorage
  useEffect(() => {
    autosaveTimerRef.current = setInterval(() => {
      const saveFile: SaveFile = {
        version: '1.0.0',
        config,
        state: gameState,
        savedAt: Date.now(),
      };
      saveToLocalStorage(AUTOSAVE_KEY, saveFile);
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [config, gameState]);

  // ========================================================================
  // MARK OPERATIONS
  // ========================================================================

  const placeMark = useCallback((sheetId: string, mark: Mark) => {
    setGameState((prev) => {
      const action: Action = {
        id: generateId(),
        type: 'PLACE_MARK',
        timestamp: Date.now(),
        sheetId,
        mark,
      };

      const sheets = prev.sheets.map((sheet) => {
        if (sheet.sheetId === sheetId) {
          // Check if mark already exists for this hotspot
          const existingIndex = sheet.marks.findIndex(
            (m) => m.hotspotId === mark.hotspotId && m.id === mark.id
          );

          if (existingIndex >= 0) {
            // Replace existing mark
            const newMarks = [...sheet.marks];
            newMarks[existingIndex] = mark;
            return { ...sheet, marks: newMarks };
          } else {
            // Add new mark
            return { ...sheet, marks: [...sheet.marks, mark] };
          }
        }
        return sheet;
      });

      // Truncate history if we're not at the end
      const newHistory =
        prev.historyIndex < prev.history.length - 1
          ? prev.history.slice(0, prev.historyIndex + 1)
          : prev.history;

      return {
        ...prev,
        sheets,
        history: [...newHistory, action],
        historyIndex: newHistory.length,
      };
    });
  }, []);

  const removeMark = useCallback((sheetId: string, markId: string) => {
    setGameState((prev) => {
      const sheet = prev.sheets.find((s) => s.sheetId === sheetId);
      const mark = sheet?.marks.find((m) => m.id === markId);

      if (!mark) return prev;

      const action: Action = {
        id: generateId(),
        type: 'REMOVE_MARK',
        timestamp: Date.now(),
        sheetId,
        markId,
        previousMark: mark,
      };

      const sheets = prev.sheets.map((s) => {
        if (s.sheetId === sheetId) {
          return {
            ...s,
            marks: s.marks.filter((m) => m.id !== markId),
          };
        }
        return s;
      });

      const newHistory =
        prev.historyIndex < prev.history.length - 1
          ? prev.history.slice(0, prev.historyIndex + 1)
          : prev.history;

      return {
        ...prev,
        sheets,
        history: [...newHistory, action],
        historyIndex: newHistory.length,
      };
    });
  }, []);

  const getMarksForHotspot = useCallback(
    (sheetId: string, hotspotId: string): Mark[] => {
      const sheet = gameState.sheets.find((s) => s.sheetId === sheetId);
      return sheet?.marks.filter((m) => m.hotspotId === hotspotId) || [];
    },
    [gameState.sheets]
  );

  // ========================================================================
  // DICE OPERATIONS
  // ========================================================================

  const rollDicePool = useCallback((poolId: string, diceIds?: string[]) => {
    setGameState((prev) => {
      const pool = prev.dicePools.find((p) => p.id === poolId);
      if (!pool) return prev;

      const diceToRoll = diceIds
        ? pool.dice.filter((d) => diceIds.includes(d.id) && !d.isLocked)
        : pool.dice.filter((d) => !d.isLocked);

      const results: { dieId: string; face: number }[] = [];

      const updatedDicePools = prev.dicePools.map((p) => {
        if (p.id === poolId) {
          const updatedDice = p.dice.map((die) => {
            if (diceToRoll.find((d) => d.id === die.id)) {
              // Get die definition
              const def = config.diceDefinitions?.find(
                (d) => d.id === die.definitionId
              );

              let newFace: number;
              if (def) {
                // Custom die with potentially weighted faces
                const weights = def.faces.map((f) => f.weight || 1);
                newFace = rollWeightedDie(weights);
              } else {
                // Standard die
                const faceCount = getFaceCount(die.definitionId);
                newFace = rollDie(faceCount);
              }

              results.push({ dieId: die.id, face: newFace });

              return {
                ...die,
                currentFace: newFace,
                isModified: false,
              };
            }
            return die;
          });

          return { ...p, dice: updatedDice };
        }
        return p;
      });

      const action: Action = {
        id: generateId(),
        type: 'ROLL_DICE',
        timestamp: Date.now(),
        poolId,
        results,
      };

      const newHistory =
        prev.historyIndex < prev.history.length - 1
          ? prev.history.slice(0, prev.historyIndex + 1)
          : prev.history;

      return {
        ...prev,
        dicePools: updatedDicePools,
        history: [...newHistory, action],
        historyIndex: newHistory.length,
      };
    });
  }, [config.diceDefinitions]);

  const lockDie = useCallback((poolId: string, dieId: string, locked: boolean) => {
    setGameState((prev) => {
      const updatedPools = prev.dicePools.map((pool) => {
        if (pool.id === poolId) {
          return {
            ...pool,
            dice: pool.dice.map((die) =>
              die.id === dieId ? { ...die, isLocked: locked } : die
            ),
          };
        }
        return pool;
      });

      return { ...prev, dicePools: updatedPools };
    });
  }, []);

  const modifyDie = useCallback(
    (poolId: string, dieId: string, newFace: number) => {
      setGameState((prev) => {
        const updatedPools = prev.dicePools.map((pool) => {
          if (pool.id === poolId) {
            return {
              ...pool,
              dice: pool.dice.map((die) =>
                die.id === dieId
                  ? { ...die, currentFace: newFace, isModified: true }
                  : die
              ),
            };
          }
          return pool;
        });

        return { ...prev, dicePools: updatedPools };
      });
    },
    []
  );

  // ========================================================================
  // CARD OPERATIONS
  // ========================================================================

  const shuffleDeck = useCallback((deckId: string) => {
    setGameState((prev) => {
      const updatedDecks = prev.decks.map((deck) => {
        if (deck.id === deckId) {
          // Combine draw pile, discard pile, and current card, then shuffle
          const allCards = [
            ...deck.drawPile,
            ...deck.discardPile,
            ...(deck.currentCard ? [deck.currentCard] : []),
          ];
          const shuffled = shuffle(allCards);

          return {
            ...deck,
            drawPile: shuffled,
            discardPile: [],
            currentCard: null,
          };
        }
        return deck;
      });

      return { ...prev, decks: updatedDecks };
    });
  }, []);

  const drawCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const updatedDecks = prev.decks.map((deck) => {
        if (deck.id === deckId) {
          if (deck.drawPile.length === 0) {
            // Auto-reshuffle discard pile if draw pile is empty
            if (deck.discardPile.length === 0) {
              console.warn('No cards to draw');
              return deck;
            }

            const shuffled = shuffle(deck.discardPile);
            const [newCard, ...remaining] = shuffled;

            return {
              ...deck,
              drawPile: remaining,
              discardPile: [],
              currentCard: newCard,
            };
          }

          const [newCard, ...remaining] = deck.drawPile;
          const newDiscard = deck.currentCard
            ? [...deck.discardPile, deck.currentCard]
            : deck.discardPile;

          return {
            ...deck,
            drawPile: remaining,
            discardPile: newDiscard,
            currentCard: newCard,
          };
        }
        return deck;
      });

      return { ...prev, decks: updatedDecks };
    });
  }, []);

  const discardCurrentCard = useCallback((deckId: string) => {
    setGameState((prev) => {
      const updatedDecks = prev.decks.map((deck) => {
        if (deck.id === deckId && deck.currentCard) {
          return {
            ...deck,
            discardPile: [...deck.discardPile, deck.currentCard],
            currentCard: null,
          };
        }
        return deck;
      });

      return { ...prev, decks: updatedDecks };
    });
  }, []);

  // ========================================================================
  // UNDO/REDO
  // ========================================================================

  const canUndo = gameState.historyIndex > 0;
  const canRedo = gameState.historyIndex < gameState.history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setGameState((prev) => {
      const action = prev.history[prev.historyIndex - 1];
      const newState = applyUndoAction(prev, action);
      return {
        ...newState,
        historyIndex: prev.historyIndex - 1,
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setGameState((prev) => {
      const action = prev.history[prev.historyIndex];
      const newState = applyRedoAction(prev, action);
      return {
        ...newState,
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, [canRedo]);

  // ========================================================================
  // SHEET NAVIGATION
  // ========================================================================

  const setCurrentSheet = useCallback((sheetId: string) => {
    setGameState((prev) => ({ ...prev, currentSheetId: sheetId }));
  }, []);

  // ========================================================================
  // TOOL SELECTION
  // ========================================================================

  const setSelectedTool = useCallback((tool: MarkType | null) => {
    setGameState((prev) => ({ ...prev, selectedTool: tool }));
  }, []);

  // ========================================================================
  // SAVE/LOAD
  // ========================================================================

  const saveGame = useCallback((filename?: string) => {
    const saveFile: SaveFile = {
      version: '1.0.0',
      config,
      state: gameState,
      savedAt: Date.now(),
    };

    const name = filename || `${config.name}-${Date.now()}.json`;
    downloadJSON(saveFile, name);
  }, [config, gameState]);

  const resetGame = useCallback(() => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset the game? This cannot be undone.'
    );

    if (confirmReset) {
      setGameState(initializeGameState(config));
    }
  }, [config]);

  const resetSheet = useCallback((sheetId: string) => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset this sheet? This cannot be undone.'
    );

    if (confirmReset) {
      setGameState((prev) => ({
        ...prev,
        sheets: prev.sheets.map((sheet) =>
          sheet.sheetId === sheetId ? { sheetId, marks: [] } : sheet
        ),
      }));
    }
  }, []);

  return {
    // State
    gameState,
    currentSheet: config.sheets.find((s) => s.id === gameState.currentSheetId),

    // Mark operations
    placeMark,
    removeMark,
    getMarksForHotspot,

    // Dice operations
    rollDicePool,
    lockDie,
    modifyDie,

    // Card operations
    shuffleDeck,
    drawCard,
    discardCurrentCard,

    // History
    undo,
    redo,
    canUndo,
    canRedo,

    // Navigation
    setCurrentSheet,

    // Tools
    setSelectedTool,

    // Save/Load
    saveGame,
    resetGame,
    resetSheet,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function initializeGameState(config: GameConfig): GameState {
  // Initialize sheets
  const sheets: SheetState[] = config.sheets.map((sheet) => ({
    sheetId: sheet.id,
    marks: [],
  }));

  // Initialize dice pools
  const dicePools: DicePool[] = [];

  if (config.standardDice) {
    config.standardDice.forEach((spec) => {
      const dice: DieInstance[] = [];
      for (let i = 0; i < spec.count; i++) {
        dice.push({
          id: generateId(),
          definitionId: spec.type,
          currentFace: 0,
          isLocked: false,
          isModified: false,
        });
      }

      dicePools.push({
        id: generateId(),
        name: `${spec.count}${spec.type}`,
        dice,
      });
    });
  }

  // Initialize decks
  const decks: DeckInstance[] = [];

  if (config.deckDefinitions) {
    config.deckDefinitions.forEach((deckDef) => {
      const cardIds = deckDef.cards.map((c) => c.id);
      const shuffled = shuffle(cardIds);

      decks.push({
        id: generateId(),
        definitionId: deckDef.id,
        drawPile: shuffled,
        discardPile: [],
        currentCard: null,
      });
    });
  }

  return {
    gameId: generateId(),
    sheets,
    dicePools,
    decks,
    history: [],
    historyIndex: 0,
    currentSheetId: config.sheets[0]?.id || '',
    selectedTool: null,
  };
}

function getFaceCount(definitionId: string): number {
  const match = definitionId.match(/d(\d+)/);
  return match ? parseInt(match[1]) : 6;
}

function applyUndoAction(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'PLACE_MARK': {
      const typedAction = action as any;
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.sheetId === typedAction.sheetId
            ? {
                ...sheet,
                marks: sheet.marks.filter(
                  (m) => m.id !== typedAction.mark.id
                ),
              }
            : sheet
        ),
      };
    }

    case 'REMOVE_MARK': {
      const typedAction = action as any;
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.sheetId === typedAction.sheetId
            ? {
                ...sheet,
                marks: [...sheet.marks, typedAction.previousMark],
              }
            : sheet
        ),
      };
    }

    default:
      return state;
  }
}

function applyRedoAction(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'PLACE_MARK': {
      const typedAction = action as any;
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.sheetId === typedAction.sheetId
            ? {
                ...sheet,
                marks: [...sheet.marks, typedAction.mark],
              }
            : sheet
        ),
      };
    }

    case 'REMOVE_MARK': {
      const typedAction = action as any;
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.sheetId === typedAction.sheetId
            ? {
                ...sheet,
                marks: sheet.marks.filter((m) => m.id !== typedAction.markId),
              }
            : sheet
        ),
      };
    }

    default:
      return state;
  }
}
