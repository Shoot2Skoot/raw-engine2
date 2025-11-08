/**
 * Card and deck utilities
 */

import type { Card, DeckState } from '../types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle a deck's draw pile
 */
export function shuffleDeck(deckState: DeckState): DeckState {
  return {
    ...deckState,
    drawPile: shuffle(deckState.drawPile),
    shuffleCount: deckState.shuffleCount + 1,
  };
}

/**
 * Draw a card from deck
 */
export function drawCard(deckState: DeckState): DeckState | null {
  if (deckState.drawPile.length === 0) {
    return null; // No cards to draw
  }

  const [drawnCard, ...remainingCards] = deckState.drawPile;

  return {
    ...deckState,
    drawPile: remainingCards,
    currentCard: drawnCard,
    lastDrawTime: Date.now(),
  };
}

/**
 * Draw multiple cards from deck
 */
export function drawCards(deckState: DeckState, count: number): {
  newState: DeckState;
  cards: Card[];
} | null {
  if (deckState.drawPile.length < count) {
    return null; // Not enough cards
  }

  const drawnCards = deckState.drawPile.slice(0, count);
  const remainingCards = deckState.drawPile.slice(count);

  return {
    newState: {
      ...deckState,
      drawPile: remainingCards,
      lastDrawTime: Date.now(),
    },
    cards: drawnCards,
  };
}

/**
 * Discard current card
 */
export function discardCurrentCard(deckState: DeckState): DeckState {
  if (!deckState.currentCard) {
    return deckState;
  }

  return {
    ...deckState,
    discardPile: [deckState.currentCard, ...deckState.discardPile],
    currentCard: undefined,
  };
}

/**
 * Discard a specific card
 */
export function discardCard(deckState: DeckState, card: Card): DeckState {
  return {
    ...deckState,
    discardPile: [card, ...deckState.discardPile],
  };
}

/**
 * Reshuffle discard pile into draw pile
 */
export function reshuffleDiscard(deckState: DeckState): DeckState {
  const allCards = [...deckState.drawPile, ...deckState.discardPile];
  return {
    ...deckState,
    drawPile: shuffle(allCards),
    discardPile: [],
    shuffleCount: deckState.shuffleCount + 1,
  };
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(deckState: DeckState, count: number): Card[] {
  return deckState.drawPile.slice(0, count);
}

/**
 * Split deck into N piles
 */
export function splitDeck(
  deckState: DeckState,
  pileCount: number
): Card[][] {
  const cards = [...deckState.drawPile];
  const piles: Card[][] = Array(pileCount)
    .fill(null)
    .map(() => []);

  cards.forEach((card, index) => {
    piles[index % pileCount].push(card);
  });

  return piles;
}
