/**
 * Card and deck management utilities
 */

import type { Card, Deck, CardField } from '../types';

/**
 * Shuffle an array using Fisher-Yates algorithm
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
 * Create a new shuffled deck
 */
export function createDeck(id: string, name: string, cards: Card[]): Deck {
  const cardIds = cards.map(c => c.id);

  return {
    id,
    name,
    cards,
    drawPile: shuffleArray(cardIds),
    discardPile: [],
  };
}

/**
 * Shuffle the draw pile
 */
export function shuffleDeck(deck: Deck): Deck {
  return {
    ...deck,
    drawPile: shuffleArray(deck.drawPile),
  };
}

/**
 * Draw the top card from the deck
 */
export function drawCard(deck: Deck): { deck: Deck; card: Card | null } {
  if (deck.drawPile.length === 0) {
    // Auto-reshuffle if enabled
    if (deck.autoReshuffle && deck.discardPile.length > 0) {
      const reshuffled = {
        ...deck,
        drawPile: shuffleArray(deck.discardPile),
        discardPile: [],
      };
      return drawCard(reshuffled);
    }

    return { deck, card: null };
  }

  const [cardId, ...remainingDraw] = deck.drawPile;
  const card = deck.cards.find(c => c.id === cardId) || null;

  return {
    deck: {
      ...deck,
      drawPile: remainingDraw,
      currentCard: cardId,
    },
    card,
  };
}

/**
 * Discard the current card
 */
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

/**
 * Discard a specific card
 */
export function discardCard(deck: Deck, cardId: string): Deck {
  return {
    ...deck,
    discardPile: [...deck.discardPile, cardId],
    currentCard: deck.currentCard === cardId ? undefined : deck.currentCard,
  };
}

/**
 * Reshuffle discard pile into draw pile
 */
export function reshuffleDiscard(deck: Deck): Deck {
  return {
    ...deck,
    drawPile: shuffleArray([...deck.drawPile, ...deck.discardPile]),
    discardPile: [],
  };
}

/**
 * Split deck into multiple piles
 */
export function splitDeck(deck: Deck, numPiles: number): Deck[] {
  const pileSize = Math.floor(deck.drawPile.length / numPiles);
  const remainder = deck.drawPile.length % numPiles;

  const piles: Deck[] = [];
  let currentIndex = 0;

  for (let i = 0; i < numPiles; i++) {
    const size = pileSize + (i < remainder ? 1 : 0);
    const pileCards = deck.drawPile.slice(currentIndex, currentIndex + size);

    piles.push({
      ...deck,
      id: `${deck.id}-pile-${i + 1}`,
      name: `${deck.name} - Pile ${i + 1}`,
      drawPile: pileCards,
      discardPile: [],
      currentCard: undefined,
    });

    currentIndex += size;
  }

  return piles;
}

/**
 * Peek at the top N cards without drawing
 */
export function peekCards(deck: Deck, count: number): Card[] {
  const cardIds = deck.drawPile.slice(0, count);
  return cardIds
    .map(id => deck.cards.find(c => c.id === id))
    .filter((c): c is Card => c !== undefined);
}

/**
 * Get a card by ID
 */
export function getCard(deck: Deck, cardId: string): Card | undefined {
  return deck.cards.find(c => c.id === cardId);
}

/**
 * Get current card
 */
export function getCurrentCard(deck: Deck): Card | null {
  if (!deck.currentCard) {
    return null;
  }
  return getCard(deck, deck.currentCard) || null;
}

/**
 * Get field value from a card
 */
export function getCardField(
  card: Card,
  fieldName: string
): string | number | undefined {
  const field = card.fields.find(f => f.name === fieldName);
  return field?.value;
}

/**
 * Format card for display
 */
export function formatCard(card: Card): string {
  return card.fields
    .map(field => `${field.name}: ${field.value}`)
    .join(', ');
}

/**
 * Create a simple card
 */
export function createCard(
  id: string,
  fields: Array<{ name: string; type: CardField['type']; value: string | number }>
): Card {
  return {
    id,
    fields: fields.map(f => ({
      name: f.name,
      type: f.type,
      value: f.value,
    })),
  };
}

/**
 * Create multiple copies of a card
 */
export function createCardCopies(baseCard: Card, count: number): Card[] {
  return Array.from({ length: count }, (_, i) => ({
    ...baseCard,
    id: `${baseCard.id}-copy-${i + 1}`,
  }));
}
