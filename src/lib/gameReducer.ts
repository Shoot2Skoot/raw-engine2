import { GameState, GameAction, Mark } from '../types';
import { nanoid } from 'nanoid';

/**
 * Game state reducer - handles all state updates
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  const newState = { ...state, metadata: { ...state.metadata, modified: Date.now() } };

  switch (action.type) {
    case 'PLACE_MARK': {
      const sheetId = state.activeSheetId;
      const sheetMarks = state.marks[sheetId] || [];

      return {
        ...newState,
        marks: {
          ...state.marks,
          [sheetId]: [...sheetMarks, action.mark],
        },
        history: {
          past: [...state.history.past, action],
          future: [], // Clear redo history on new action
        },
      };
    }

    case 'REMOVE_MARK': {
      const sheetId = state.activeSheetId;
      const sheetMarks = state.marks[sheetId] || [];

      return {
        ...newState,
        marks: {
          ...state.marks,
          [sheetId]: sheetMarks.filter(m => m.id !== action.markId),
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'MODIFY_MARK': {
      const sheetId = state.activeSheetId;
      const sheetMarks = state.marks[sheetId] || [];

      return {
        ...newState,
        marks: {
          ...state.marks,
          [sheetId]: sheetMarks.map(m =>
            m.id === action.markId ? { ...m, ...action.changes } as Mark : m
          ),
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'ROLL_DICE': {
      const pools = state.dice.pools.map(pool =>
        pool.id === action.poolId
          ? { ...pool, results: action.results }
          : pool
      );

      return {
        ...newState,
        dice: {
          ...state.dice,
          pools,
          history: [
            {
              timestamp: Date.now(),
              poolId: action.poolId,
              results: action.results,
            },
            ...state.dice.history.slice(0, 9), // Keep last 10
          ],
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'LOCK_DIE': {
      const pools = state.dice.pools.map(pool => {
        if (pool.id === action.poolId && pool.results) {
          return {
            ...pool,
            results: pool.results.map((r, i) =>
              i === action.dieIndex ? { ...r, locked: true } : r
            ),
          };
        }
        return pool;
      });

      return {
        ...newState,
        dice: { ...state.dice, pools },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'UNLOCK_DIE': {
      const pools = state.dice.pools.map(pool => {
        if (pool.id === action.poolId && pool.results) {
          return {
            ...pool,
            results: pool.results.map((r, i) =>
              i === action.dieIndex ? { ...r, locked: false } : r
            ),
          };
        }
        return pool;
      });

      return {
        ...newState,
        dice: { ...state.dice, pools },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'DRAW_CARD': {
      const deck = state.cards.decks[action.deckId];
      if (!deck) return state;

      const newDrawPile = deck.drawPile.filter(id => id !== action.cardId);

      return {
        ...newState,
        cards: {
          ...state.cards,
          decks: {
            ...state.cards.decks,
            [action.deckId]: {
              ...deck,
              drawPile: newDrawPile,
              activeCard: action.cardId,
            },
          },
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'DISCARD_CARD': {
      const deck = state.cards.decks[action.deckId];
      if (!deck) return state;

      return {
        ...newState,
        cards: {
          ...state.cards,
          decks: {
            ...state.cards.decks,
            [action.deckId]: {
              ...deck,
              discardPile: [...deck.discardPile, action.cardId],
              activeCard: undefined,
            },
          },
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    case 'SHUFFLE_DECK': {
      const deck = state.cards.decks[action.deckId];
      if (!deck) return state;

      // Fisher-Yates shuffle
      const shuffled = [...deck.drawPile];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return {
        ...newState,
        cards: {
          ...state.cards,
          decks: {
            ...state.cards.decks,
            [action.deckId]: {
              ...deck,
              drawPile: shuffled,
            },
          },
        },
        history: {
          past: [...state.history.past, action],
          future: [],
        },
      };
    }

    default:
      return state;
  }
}
