/**
 * Card and deck management utilities
 */

import type { Card, Deck } from '../types';

/** Fisher-Yates shuffle algorithm */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Shuffle a deck */
export function shuffleDeck(deck: Deck): Deck {
  return {
    ...deck,
    cards: shuffleArray(deck.cards),
  };
}

/** Draw a card from the top of the deck */
export function drawCard(deck: Deck): { deck: Deck; card: Card | null } {
  if (deck.cards.length === 0) {
    return { deck, card: null };
  }

  const [drawnCard, ...remainingCards] = deck.cards;

  return {
    deck: {
      ...deck,
      cards: remainingCards,
      currentCard: drawnCard,
    },
    card: drawnCard,
  };
}

/** Draw multiple cards from the deck */
export function drawCards(deck: Deck, count: number): { deck: Deck; cards: Card[] } {
  const drawnCards: Card[] = [];
  let currentDeck = deck;

  for (let i = 0; i < count; i++) {
    const result = drawCard(currentDeck);
    if (result.card) {
      drawnCards.push(result.card);
      currentDeck = result.deck;
    } else {
      break; // No more cards to draw
    }
  }

  return { deck: currentDeck, cards: drawnCards };
}

/** Discard the current card */
export function discardCurrentCard(deck: Deck): Deck {
  if (!deck.currentCard) {
    return deck;
  }

  return {
    ...deck,
    discardPile: [...deck.discardPile, deck.currentCard],
    currentCard: undefined,
  };
}

/** Discard a specific card */
export function discardCard(deck: Deck, card: Card): Deck {
  return {
    ...deck,
    discardPile: [...deck.discardPile, card],
  };
}

/** Reshuffle discard pile back into deck */
export function reshuffleDiscard(deck: Deck): Deck {
  const combinedCards = [...deck.cards, ...deck.discardPile];
  const shuffled = shuffleArray(combinedCards);

  return {
    ...deck,
    cards: shuffled,
    discardPile: [],
  };
}

/** Reshuffle when deck is empty (auto-reshuffle) */
export function drawWithReshuffle(deck: Deck): { deck: Deck; card: Card | null } {
  // If deck is empty, reshuffle discard pile first
  let currentDeck = deck;
  if (deck.cards.length === 0 && deck.discardPile.length > 0) {
    currentDeck = reshuffleDiscard(deck);
  }

  return drawCard(currentDeck);
}

/** Split deck into multiple equal piles */
export function splitDeck(deck: Deck, numPiles: number): Deck[] {
  const cards = [...deck.cards];
  const pileSize = Math.ceil(cards.length / numPiles);
  const piles: Deck[] = [];

  for (let i = 0; i < numPiles; i++) {
    const start = i * pileSize;
    const end = Math.min(start + pileSize, cards.length);
    const pileCards = cards.slice(start, end);

    piles.push({
      ...deck,
      id: `${deck.id}-pile-${i + 1}`,
      name: `${deck.name} - Pile ${i + 1}`,
      cards: pileCards,
      discardPile: [],
      currentCard: undefined,
    });
  }

  return piles;
}

/** Peek at the top N cards without drawing them */
export function peekCards(deck: Deck, count: number): Card[] {
  return deck.cards.slice(0, count);
}

/** Get the top card without drawing it */
export function peekTopCard(deck: Deck): Card | null {
  return deck.cards[0] || null;
}

/** Count remaining cards in deck */
export function countCardsRemaining(deck: Deck): number {
  return deck.cards.length;
}

/** Count cards in discard pile */
export function countCardsDiscarded(deck: Deck): number {
  return deck.discardPile.length;
}

/** Get total number of cards (deck + discard) */
export function countTotalCards(deck: Deck): number {
  return deck.cards.length + deck.discardPile.length;
}

/** Add a card to the bottom of the deck */
export function addCardToBottom(deck: Deck, card: Card): Deck {
  return {
    ...deck,
    cards: [...deck.cards, card],
  };
}

/** Add a card to the top of the deck */
export function addCardToTop(deck: Deck, card: Card): Deck {
  return {
    ...deck,
    cards: [card, ...deck.cards],
  };
}

/** Remove a specific card from the deck */
export function removeCard(deck: Deck, cardId: string): Deck {
  return {
    ...deck,
    cards: deck.cards.filter(c => c.id !== cardId),
  };
}
