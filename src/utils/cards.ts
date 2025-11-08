/**
 * Utility functions for working with cards and decks
 */

import type { Card, CardField, Deck } from '../types';

/**
 * Generate a unique ID for cards
 */
export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a card
 */
export function createCard(fields: CardField[]): Card {
  return {
    id: generateCardId(),
    fields,
  };
}

/**
 * Create multiple copies of a card
 */
export function createCards(fields: CardField[], count: number): Card[] {
  return Array.from({ length: count }, () => createCard(fields));
}

/**
 * Fisher-Yates shuffle algorithm
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
 * Create a deck
 */
export function createDeck(name: string, cards: Card[], faceDown: boolean = false): Deck {
  return {
    id: `deck_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    name,
    cards: shuffle(cards),
    discard: [],
    faceDown,
  };
}

/**
 * Shuffle a deck's draw pile
 */
export function shuffleDeck(deck: Deck): Deck {
  return {
    ...deck,
    cards: shuffle(deck.cards),
  };
}

/**
 * Draw one or more cards from a deck
 */
export function drawCards(deck: Deck, count: number = 1): [Deck, Card[]] {
  if (deck.cards.length === 0) {
    return [deck, []];
  }

  const actualCount = Math.min(count, deck.cards.length);
  const drawn = deck.cards.slice(0, actualCount);
  const remaining = deck.cards.slice(actualCount);

  const newDeck: Deck = {
    ...deck,
    cards: remaining,
    currentCard: drawn[drawn.length - 1],
  };

  return [newDeck, drawn];
}

/**
 * Discard the current card
 */
export function discardCurrentCard(deck: Deck): Deck {
  if (!deck.currentCard) return deck;

  return {
    ...deck,
    discard: [...deck.discard, deck.currentCard],
    currentCard: undefined,
  };
}

/**
 * Discard a specific card (if it's the current card)
 */
export function discardCard(deck: Deck, cardId: string): Deck {
  if (deck.currentCard?.id === cardId) {
    return discardCurrentCard(deck);
  }
  return deck;
}

/**
 * Reshuffle discard pile back into deck
 */
export function reshuffleDiscard(deck: Deck): Deck {
  const allCards = [...deck.cards, ...deck.discard];

  return {
    ...deck,
    cards: shuffle(allCards),
    discard: [],
  };
}

/**
 * Auto-reshuffle if deck is empty
 */
export function autoReshuffle(deck: Deck): Deck {
  if (deck.cards.length === 0 && deck.discard.length > 0) {
    return reshuffleDiscard(deck);
  }
  return deck;
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(deck: Deck, count: number = 1): Card[] {
  return deck.cards.slice(0, Math.min(count, deck.cards.length));
}

/**
 * Split deck into multiple piles
 */
export function splitDeck(deck: Deck, pileCount: number): Deck[] {
  const allCards = shuffle(deck.cards);
  const piles: Card[][] = Array.from({ length: pileCount }, () => []);

  // Distribute cards evenly
  allCards.forEach((card, index) => {
    piles[index % pileCount].push(card);
  });

  return piles.map((cards, index) =>
    createDeck(`${deck.name} - Pile ${index + 1}`, cards, deck.faceDown)
  );
}

/**
 * Get a field value from a card
 */
export function getCardField(card: Card, fieldName: string): number | string | undefined {
  const field = card.fields.find(f => f.name === fieldName);
  return field?.value;
}

/**
 * Check if deck needs reshuffle
 */
export function needsReshuffle(deck: Deck): boolean {
  return deck.cards.length === 0 && deck.discard.length > 0;
}

/**
 * Get total cards in deck (draw + discard)
 */
export function getTotalCardCount(deck: Deck): number {
  return deck.cards.length + deck.discard.length + (deck.currentCard ? 1 : 0);
}
