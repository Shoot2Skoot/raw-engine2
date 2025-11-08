/**
 * Card utilities - Deck management, shuffling, drawing
 */

import type { Card, DeckDefinition, DeckState, SubDeck } from '../types';

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Initialize a deck state from its definition
 */
export function initializeDeck(definition: DeckDefinition): DeckState {
  const drawPile = definition.shuffleOnSetup
    ? shuffleArray(definition.cards)
    : [...definition.cards];

  return {
    id: crypto.randomUUID(),
    definitionId: definition.id,
    drawPile,
    discardPile: [],
    currentCard: undefined,
    subDecks: undefined,
  };
}

/**
 * Shuffle the draw pile
 */
export function shuffleDeck(state: DeckState): DeckState {
  return {
    ...state,
    drawPile: shuffleArray(state.drawPile),
  };
}

/**
 * Draw a card from the deck
 */
export function drawCard(state: DeckState, reshuffleIfEmpty: boolean = true): DeckState {
  // If draw pile is empty, reshuffle discard pile if allowed
  if (state.drawPile.length === 0 && reshuffleIfEmpty && state.discardPile.length > 0) {
    const newDrawPile = shuffleArray(state.discardPile);
    return drawCard(
      {
        ...state,
        drawPile: newDrawPile,
        discardPile: [],
      },
      false
    );
  }

  // If still empty, can't draw
  if (state.drawPile.length === 0) {
    console.warn('Cannot draw from empty deck');
    return state;
  }

  const [drawnCard, ...remainingCards] = state.drawPile;

  return {
    ...state,
    drawPile: remainingCards,
    currentCard: drawnCard,
  };
}

/**
 * Draw multiple cards
 */
export function drawCards(
  state: DeckState,
  count: number,
  reshuffleIfEmpty: boolean = true
): { state: DeckState; cards: Card[] } {
  let currentState = state;
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    currentState = drawCard(currentState, reshuffleIfEmpty);
    if (currentState.currentCard) {
      cards.push(currentState.currentCard);
    }
  }

  return { state: currentState, cards };
}

/**
 * Discard the current card
 */
export function discardCurrentCard(state: DeckState): DeckState {
  if (!state.currentCard) {
    console.warn('No current card to discard');
    return state;
  }

  return {
    ...state,
    discardPile: [...state.discardPile, state.currentCard],
    currentCard: undefined,
  };
}

/**
 * Discard a specific card (not current)
 */
export function discardCard(state: DeckState, card: Card): DeckState {
  return {
    ...state,
    discardPile: [...state.discardPile, card],
  };
}

/**
 * Reshuffle discard pile back into draw pile
 */
export function reshuffleDiscard(state: DeckState): DeckState {
  const newDrawPile = shuffleArray([...state.drawPile, ...state.discardPile]);

  return {
    ...state,
    drawPile: newDrawPile,
    discardPile: [],
  };
}

/**
 * Split deck into N equal sub-decks
 */
export function splitDeck(
  state: DeckState,
  count: number,
  names: string[] = []
): DeckState {
  const cardsPerDeck = Math.floor(state.drawPile.length / count);
  const remainder = state.drawPile.length % count;

  const subDecks: SubDeck[] = [];
  let currentIndex = 0;

  for (let i = 0; i < count; i++) {
    const size = cardsPerDeck + (i < remainder ? 1 : 0);
    const deckCards = state.drawPile.slice(currentIndex, currentIndex + size);

    subDecks.push({
      id: crypto.randomUUID(),
      name: names[i] || `Deck ${i + 1}`,
      cards: deckCards,
    });

    currentIndex += size;
  }

  return {
    ...state,
    drawPile: [],
    subDecks,
  };
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(state: DeckState, count: number): Card[] {
  return state.drawPile.slice(0, count);
}

/**
 * Get remaining card count in draw pile
 */
export function getRemainingCount(state: DeckState): number {
  return state.drawPile.length;
}

/**
 * Get total card count (draw + discard)
 */
export function getTotalCardCount(state: DeckState): number {
  return state.drawPile.length + state.discardPile.length;
}
