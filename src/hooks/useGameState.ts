/**
 * useGameState hook - React hook for managing game state
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameConfig,
  Hotspot,
  MarkType,
  AddMarkAction,
} from '../types';
import {
  createInitialGameState,
  applyAction,
  undo as undoAction,
  redo as redoAction,
  changeSheet,
  updateToolState,
  resetGameState,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '../lib/gameState';
import {
  createCheckboxMark,
  createNumberMark,
  createColorMark,
  createCircleMark,
  createSymbolMark,
  createTextMark,
  cycleCheckboxState,
  cycleCircleState,
  getMarksForHotspot,
  canAddMark,
  isMarkTypeAllowed,
} from '../lib/marks';
import { rerollDice, toggleDieLock as toggleLock } from '../lib/dice';
import { drawCard, discardCurrentCard, shuffleDeck, reshuffleDiscard } from '../lib/cards';

export function useGameState(config: GameConfig, autoSaveKey?: string) {
  const [state, setState] = useState<GameState>(() => {
    // Try to load from localStorage if key provided
    if (autoSaveKey) {
      const saved = loadFromLocalStorage(autoSaveKey);
      if (saved && saved.config.id === config.id) {
        return saved;
      }
    }
    return createInitialGameState(config);
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (autoSaveKey) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(state, autoSaveKey);
      }, 500); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [state, autoSaveKey]);

  // Handle hotspot click - add or cycle marks
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      const existingMarks = getMarksForHotspot(hotspot.id, state.marks);
      const selectedTool = state.tools.selectedTool;

      // Check if we can add a mark
      if (!isMarkTypeAllowed(hotspot, selectedTool)) {
        console.warn(`Mark type \${selectedTool} not allowed on this hotspot`);
        return;
      }

      // For cycling marks (checkbox, circle), check if we should cycle existing mark
      const existingMarkOfType = existingMarks.find((m) => m.type === selectedTool);

      if (existingMarkOfType) {
        // Cycle existing mark
        if (selectedTool === 'checkbox' && existingMarkOfType.type === 'checkbox') {
          const newState = cycleCheckboxState(existingMarkOfType.state);
          const updatedMark = { ...existingMarkOfType, state: newState };
          const action: any = {
            type: 'UPDATE_MARK',
            markId: existingMarkOfType.id,
            newMark: updatedMark,
            previousMark: existingMarkOfType,
            timestamp: Date.now(),
          };
          setState((s) => applyAction(s, action));
        } else if (selectedTool === 'circle' && existingMarkOfType.type === 'circle') {
          const newState = cycleCircleState(existingMarkOfType.state);
          const updatedMark = { ...existingMarkOfType, state: newState };
          const action: any = {
            type: 'UPDATE_MARK',
            markId: existingMarkOfType.id,
            newMark: updatedMark,
            previousMark: existingMarkOfType,
            timestamp: Date.now(),
          };
          setState((s) => applyAction(s, action));
        }
        return;
      }

      // Check if we can add more marks
      if (!canAddMark(hotspot, existingMarks)) {
        console.warn('Hotspot is full');
        return;
      }

      // Create new mark based on selected tool
      let newMark: any = null;

      switch (selectedTool) {
        case 'checkbox':
          newMark = createCheckboxMark(hotspot.id, 'checked', state.tools.isPencilMode);
          break;
        case 'number':
          // For now, default to 1. In a real app, would show number picker
          newMark = createNumberMark(hotspot.id, 1, state.tools.isPencilMode);
          break;
        case 'color':
          newMark = createColorMark(hotspot.id, '#3b82f6', state.tools.isPencilMode);
          break;
        case 'circle':
          newMark = createCircleMark(hotspot.id, 'full', state.tools.isPencilMode);
          break;
        case 'symbol':
          newMark = createSymbolMark(hotspot.id, 'star', state.tools.isPencilMode);
          break;
        case 'text':
          newMark = createTextMark(hotspot.id, 'X', state.tools.isPencilMode);
          break;
      }

      if (newMark) {
        const action: AddMarkAction = {
          type: 'ADD_MARK',
          mark: newMark,
          timestamp: Date.now(),
        };
        setState((s) => applyAction(s, action));
      }
    },
    [state.marks, state.tools]
  );

  // Undo
  const undo = useCallback(() => {
    setState((s) => undoAction(s));
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState((s) => redoAction(s));
  }, []);

  // Change sheet
  const switchSheet = useCallback((index: number) => {
    setState((s) => changeSheet(s, index));
  }, []);

  // Select tool
  const selectTool = useCallback((tool: MarkType) => {
    setState((s) => updateToolState(s, { selectedTool: tool }));
  }, []);

  // Toggle pencil mode
  const togglePencilMode = useCallback(() => {
    setState((s) => updateToolState(s, { isPencilMode: !s.tools.isPencilMode }));
  }, []);

  // Reset
  const reset = useCallback((marksOnly: boolean = false) => {
    setState((s) => resetGameState(s, marksOnly));
  }, []);

  // Roll dice in a pool
  const rollDice = useCallback((poolId: string) => {
    setState((s) => {
      const pool = s.dicePools.find((p) => p.id === poolId);
      if (!pool) return s;

      const definitionsMap = new Map(
        s.config.diceDefinitions?.map((d) => [d.id, d]) || []
      );

      const newResults = rerollDice(pool.dice, definitionsMap);

      const action: any = {
        type: 'ROLL_DICE',
        poolId,
        previousResults: pool.dice,
        newResults,
        timestamp: Date.now(),
      };

      return applyAction(s, action);
    });
  }, []);

  // Toggle die lock
  const toggleDieLock = useCallback((poolId: string, dieId: string) => {
    setState((s) => {
      const newPools = s.dicePools.map((pool) => {
        if (pool.id !== poolId) return pool;

        return {
          ...pool,
          dice: pool.dice.map((die) =>
            die.id === dieId ? toggleLock(die) : die
          ),
        };
      });

      return { ...s, dicePools: newPools };
    });
  }, []);

  // Draw card
  const drawCardFromDeck = useCallback((deckId: string) => {
    setState((s) => {
      const newDecks = s.decks.map((deck) => {
        if (deck.id !== deckId) return deck;
        const definition = s.config.deckDefinitions?.find(
          (d) => d.id === deck.definitionId
        );
        return drawCard(deck, definition?.reshuffleWhenEmpty);
      });

      return { ...s, decks: newDecks };
    });
  }, []);

  // Discard current card
  const discardCard = useCallback((deckId: string) => {
    setState((s) => {
      const newDecks = s.decks.map((deck) =>
        deck.id === deckId ? discardCurrentCard(deck) : deck
      );
      return { ...s, decks: newDecks };
    });
  }, []);

  // Shuffle deck
  const shuffleDeckAction = useCallback((deckId: string) => {
    setState((s) => {
      const newDecks = s.decks.map((deck) =>
        deck.id === deckId ? shuffleDeck(deck) : deck
      );
      return { ...s, decks: newDecks };
    });
  }, []);

  // Reshuffle discard
  const reshuffleDiscardAction = useCallback((deckId: string) => {
    setState((s) => {
      const newDecks = s.decks.map((deck) =>
        deck.id === deckId ? reshuffleDiscard(deck) : deck
      );
      return { ...s, decks: newDecks };
    });
  }, []);

  return {
    state,
    handleHotspotClick,
    undo,
    redo,
    switchSheet,
    selectTool,
    togglePencilMode,
    reset,
    rollDice,
    toggleDieLock,
    drawCard: drawCardFromDeck,
    discardCard,
    shuffleDeck: shuffleDeckAction,
    reshuffleDiscard: reshuffleDiscardAction,
  };
}
