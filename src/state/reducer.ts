/**
 * Game state reducer with undo/redo support
 */

import type { GameState, Action, SheetState } from '../types';
import { rollDice, lockDie, unlockDie, modifyStandardDie, modifyCustomDie } from '../utils/dice';
import { shuffleDeck, drawCards, discardCard, reshuffleDiscard, autoReshuffle } from '../utils/cards';

/**
 * Main game state reducer
 */
export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'PLACE_MARK': {
      const { sheetId, hotspotId, mark } = action;
      const sheetStates = state.sheetStates.map(sheetState => {
        if (sheetState.sheetId !== sheetId) return sheetState;

        const marks = new Map(sheetState.marks);
        const currentMarks = marks.get(hotspotId) || [];
        marks.set(hotspotId, [...currentMarks, mark]);

        return { ...sheetState, marks };
      });

      return { ...state, sheetStates };
    }

    case 'REMOVE_MARK': {
      const { sheetId, hotspotId, markId } = action;
      const sheetStates = state.sheetStates.map(sheetState => {
        if (sheetState.sheetId !== sheetId) return sheetState;

        const marks = new Map(sheetState.marks);
        const currentMarks = marks.get(hotspotId) || [];
        marks.set(
          hotspotId,
          currentMarks.filter(m => m.id !== markId)
        );

        return { ...sheetState, marks };
      });

      return { ...state, sheetStates };
    }

    case 'CLEAR_HOTSPOT': {
      const { sheetId, hotspotId } = action;
      const sheetStates = state.sheetStates.map(sheetState => {
        if (sheetState.sheetId !== sheetId) return sheetState;

        const marks = new Map(sheetState.marks);
        marks.delete(hotspotId);

        return { ...sheetState, marks };
      });

      return { ...state, sheetStates };
    }

    case 'SWITCH_SHEET': {
      return {
        ...state,
        currentSheetIndex: Math.max(
          0,
          Math.min(action.sheetIndex, state.sheets.length - 1)
        ),
      };
    }

    case 'SELECT_TOOL': {
      return { ...state, selectedTool: action.tool };
    }

    case 'SELECT_COLOR': {
      return { ...state, selectedColor: action.color };
    }

    case 'SELECT_SYMBOL': {
      return { ...state, selectedSymbol: action.symbol };
    }

    case 'SET_PERMANENCE': {
      return { ...state, permanence: action.permanence };
    }

    case 'ROLL_DICE': {
      const { poolId, diceIds } = action;
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== poolId) return pool;

        const dicesToRoll = diceIds
          ? pool.dice.filter(d => diceIds.includes(d.id))
          : pool.dice;

        const rolledDice = rollDice(dicesToRoll);

        // Merge rolled dice back into pool
        const dice = pool.dice.map(die => {
          const rolled = rolledDice.find(d => d.id === die.id);
          return rolled || die;
        });

        return { ...pool, dice };
      });

      // Add to history
      const diceHistory = [
        ...state.diceHistory,
        {
          timestamp: Date.now(),
          poolId,
          results: dicePools
            .find(p => p.id === poolId)!
            .dice.map(die => ({
              dieId: die.id,
              value: 'currentValue' in die ? die.currentValue : die.currentValue,
            }))
            .filter((r): r is { dieId: string; value: number | import('../types').DieFace } => r.value !== undefined),
        },
      ];

      return { ...state, dicePools, diceHistory };
    }

    case 'LOCK_DIE': {
      const { poolId, dieId } = action;
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== poolId) return pool;

        const dice = pool.dice.map(die =>
          die.id === dieId ? lockDie(die) : die
        );

        return { ...pool, dice };
      });

      return { ...state, dicePools };
    }

    case 'UNLOCK_DIE': {
      const { poolId, dieId } = action;
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== poolId) return pool;

        const dice = pool.dice.map(die =>
          die.id === dieId ? unlockDie(die) : die
        );

        return { ...pool, dice };
      });

      return { ...state, dicePools };
    }

    case 'MODIFY_DIE': {
      const { poolId, dieId, newValue } = action;
      const dicePools = state.dicePools.map(pool => {
        if (pool.id !== poolId) return pool;

        const dice = pool.dice.map(die => {
          if (die.id !== dieId) return die;

          if ('type' in die && typeof newValue === 'number') {
            return modifyStandardDie(die, newValue);
          } else if ('faces' in die && typeof newValue !== 'number') {
            return modifyCustomDie(die, newValue);
          }

          return die;
        });

        return { ...pool, dice };
      });

      return { ...state, dicePools };
    }

    case 'SHUFFLE_DECK': {
      const { deckId } = action;
      const decks = state.decks.map(deck =>
        deck.id === deckId ? shuffleDeck(deck) : deck
      );

      return { ...state, decks };
    }

    case 'DRAW_CARD': {
      const { deckId, count = 1 } = action;
      const decks = state.decks.map(deck => {
        if (deck.id !== deckId) return deck;

        // Auto-reshuffle if needed
        const deckToUse = autoReshuffle(deck);
        const [newDeck] = drawCards(deckToUse, count);
        return newDeck;
      });

      return { ...state, decks };
    }

    case 'DISCARD_CARD': {
      const { deckId, cardId } = action;
      const decks = state.decks.map(deck =>
        deck.id === deckId ? discardCard(deck, cardId) : deck
      );

      return { ...state, decks };
    }

    case 'RESHUFFLE_DISCARD': {
      const { deckId } = action;
      const decks = state.decks.map(deck =>
        deck.id === deckId ? reshuffleDiscard(deck) : deck
      );

      return { ...state, decks };
    }

    case 'RESET_SHEET': {
      const { sheetId } = action;
      const sheetStates = state.sheetStates.map(sheetState =>
        sheetState.sheetId === sheetId
          ? { sheetId, marks: new Map() }
          : sheetState
      );

      return { ...state, sheetStates };
    }

    case 'RESET_GAME': {
      const sheetStates: SheetState[] = state.sheets.map(sheet => ({
        sheetId: sheet.id,
        marks: new Map(),
      }));

      return {
        ...state,
        currentSheetIndex: 0,
        sheetStates,
        diceHistory: [],
      };
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}
