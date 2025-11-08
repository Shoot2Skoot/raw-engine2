/**
 * Game Engine Utilities
 * Core functions for managing game state, marks, dice, and cards
 */

import {
  GameState,
  GameConfig,
  Mark,
  DieResult,
  Sheet,
  Hotspot,
  GridLayoutConfig,
} from '../types';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create initial game state from configuration
 */
export function createGameState(config: GameConfig): GameState {
  return {
    id: generateId(),
    name: config.name,
    sheets: config.sheets.map((sheet) => ({
      ...sheet,
      marks: [],
    })),
    currentSheetId: config.initialSheetId || config.sheets[0]?.id || '',
    dicePools: config.dicePools || [],
    decks: config.decks || [],
    timestamp: Date.now(),
  };
}

/**
 * Generate hotspots from grid layout configuration
 */
export function generateGridHotspots(grid: GridLayoutConfig): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const cellSize = grid.cellSize || 60;
  const gap = grid.gap || 2;
  const offsetX = grid.x || 0;
  const offsetY = grid.y || 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const id = `${row}-${col}`;
      const x = offsetX + col * (cellSize + gap);
      const y = offsetY + row * (cellSize + gap);

      hotspots.push({
        id,
        shape: 'rectangle',
        x,
        y,
        width: cellSize,
        height: cellSize,
        constraints: grid.defaultConstraints,
        label: grid.cellLabels?.[id],
      });
    }
  }

  return hotspots;
}

/**
 * Add mark to sheet
 */
export function addMark(state: GameState, sheetId: string, mark: Mark): GameState {
  return {
    ...state,
    sheets: state.sheets.map((sheet) =>
      sheet.id === sheetId
        ? {
            ...sheet,
            marks: [...sheet.marks, mark],
          }
        : sheet
    ),
    timestamp: Date.now(),
  };
}

/**
 * Remove mark from sheet
 */
export function removeMark(state: GameState, sheetId: string, markId: string): GameState {
  return {
    ...state,
    sheets: state.sheets.map((sheet) =>
      sheet.id === sheetId
        ? {
            ...sheet,
            marks: sheet.marks.filter((m) => m.id !== markId),
          }
        : sheet
    ),
    timestamp: Date.now(),
  };
}

/**
 * Get marks for a specific hotspot
 */
export function getMarksForHotspot(sheet: Sheet, hotspotId: string): Mark[] {
  return sheet.marks.filter((mark) => mark.hotspotId === hotspotId);
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle deck
 */
export function shuffleDeck(state: GameState, deckId: string): GameState {
  return {
    ...state,
    decks: state.decks.map((deck) =>
      deck.id === deckId
        ? {
            ...deck,
            drawPile: shuffleArray(deck.drawPile),
          }
        : deck
    ),
    timestamp: Date.now(),
  };
}

/**
 * Draw card from deck
 */
export function drawCard(state: GameState, deckId: string): GameState {
  return {
    ...state,
    decks: state.decks.map((deck) => {
      if (deck.id !== deckId) return deck;

      if (deck.drawPile.length === 0) {
        return deck; // Cannot draw from empty deck
      }

      const [cardId, ...remainingDrawPile] = deck.drawPile;
      const card = deck.cards.find((c) => c.id === cardId);

      return {
        ...deck,
        drawPile: remainingDrawPile,
        currentCard: card,
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Discard current card
 */
export function discardCard(state: GameState, deckId: string): GameState {
  return {
    ...state,
    decks: state.decks.map((deck) => {
      if (deck.id !== deckId || !deck.currentCard) return deck;

      return {
        ...deck,
        discardPile: [...deck.discardPile, deck.currentCard.id],
        currentCard: undefined,
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Reshuffle discard pile into deck
 */
export function reshuffleDiscard(state: GameState, deckId: string): GameState {
  return {
    ...state,
    decks: state.decks.map((deck) => {
      if (deck.id !== deckId) return deck;

      return {
        ...deck,
        drawPile: shuffleArray([...deck.drawPile, ...deck.discardPile]),
        discardPile: [],
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Roll standard die (d4, d6, d8, d10, d12, d20)
 */
function rollStandardDie(type: string): number {
  const sides = parseInt(type.substring(1));
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll all dice in a pool
 */
export function rollDicePool(state: GameState, poolId: string): GameState {
  return {
    ...state,
    dicePools: state.dicePools.map((pool) => {
      if (pool.id !== poolId) return pool;

      const newResults: DieResult[] = pool.dice.map((die) => {
        // Keep locked dice results
        const existingResult = pool.results.find((r) => r.dieId === die.id);
        if (existingResult?.isLocked) {
          return existingResult;
        }

        // Roll unlocked dice
        let faceIndex: number;
        let value: number | string;

        if (die.type === 'custom' && die.faces) {
          // Custom die with weighted faces
          const totalWeight = die.faces.reduce((sum, face) => sum + (face.weight || 1), 0);
          let random = Math.random() * totalWeight;
          faceIndex = 0;

          for (let i = 0; i < die.faces.length; i++) {
            random -= die.faces[i].weight || 1;
            if (random <= 0) {
              faceIndex = i;
              break;
            }
          }

          value = die.faces[faceIndex].value;
        } else {
          // Standard die
          const rolled = rollStandardDie(die.type);
          faceIndex = rolled - 1;
          value = rolled;
        }

        return {
          dieId: die.id,
          faceIndex,
          value,
          isLocked: false,
          timestamp: Date.now(),
        };
      });

      return {
        ...pool,
        results: newResults,
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Lock a die result
 */
export function lockDie(state: GameState, poolId: string, dieId: string): GameState {
  return {
    ...state,
    dicePools: state.dicePools.map((pool) => {
      if (pool.id !== poolId) return pool;

      return {
        ...pool,
        results: pool.results.map((result) =>
          result.dieId === dieId ? { ...result, isLocked: true } : result
        ),
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Unlock a die result
 */
export function unlockDie(state: GameState, poolId: string, dieId: string): GameState {
  return {
    ...state,
    dicePools: state.dicePools.map((pool) => {
      if (pool.id !== poolId) return pool;

      return {
        ...pool,
        results: pool.results.map((result) =>
          result.dieId === dieId ? { ...result, isLocked: false } : result
        ),
      };
    }),
    timestamp: Date.now(),
  };
}

/**
 * Change current sheet
 */
export function changeSheet(state: GameState, sheetId: string): GameState {
  return {
    ...state,
    currentSheetId: sheetId,
    timestamp: Date.now(),
  };
}

/**
 * Reset entire game
 */
export function resetGame(config: GameConfig): GameState {
  return createGameState(config);
}

/**
 * Reset single sheet
 */
export function resetSheet(state: GameState, sheetId: string): GameState {
  return {
    ...state,
    sheets: state.sheets.map((sheet) =>
      sheet.id === sheetId
        ? {
            ...sheet,
            marks: [],
          }
        : sheet
    ),
    timestamp: Date.now(),
  };
}

/**
 * Save game state to localStorage
 */
export function saveToLocalStorage(state: GameState): void {
  try {
    localStorage.setItem(`game-${state.id}`, JSON.stringify(state));
    localStorage.setItem('last-game-id', state.id);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadFromLocalStorage(gameId: string): GameState | null {
  try {
    const data = localStorage.getItem(`game-${gameId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Get last game ID
 */
export function getLastGameId(): string | null {
  return localStorage.getItem('last-game-id');
}

/**
 * Export game state as JSON file
 */
export function exportGameState(state: GameState): void {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.name}-${new Date().toISOString()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import game state from JSON file
 */
export function importGameState(file: File): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target?.result as string);
        resolve(state);
      } catch (error) {
        reject(new Error('Invalid game state file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
