/**
 * Card and Deck Utility Functions
 */

import type { Card, Deck, CardField } from '../types/cards';

/**
 * Fisher-Yates shuffle algorithm (in-place)
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
export function shuffleDeck(deck: Deck): Deck {
  return {
    ...deck,
    drawPile: shuffle(deck.drawPile),
  };
}

/**
 * Draw card(s) from top of deck
 */
export function drawCards(deck: Deck, count: number = 1): {
  deck: Deck;
  drawnCards: Card[];
} {
  if (deck.drawPile.length === 0) {
    // Handle empty deck
    if (deck.shuffleConfig?.autoReshuffle && deck.shuffleConfig?.reshuffleDiscard) {
      // Auto-reshuffle discard pile back into draw pile
      const reshuffledDeck = reshuffleDiscard(deck);
      return drawCards(reshuffledDeck, count);
    }
    return { deck, drawnCards: [] };
  }

  const actualCount = Math.min(count, deck.drawPile.length);
  const drawnCards = deck.drawPile.slice(-actualCount);
  const remainingDraw = deck.drawPile.slice(0, -actualCount);

  // Set the last drawn card as active
  const activeCard = drawnCards[drawnCards.length - 1];

  return {
    deck: {
      ...deck,
      drawPile: remainingDraw,
      activeCard,
    },
    drawnCards,
  };
}

/**
 * Discard the active card
 */
export function discardActiveCard(deck: Deck): Deck {
  if (!deck.activeCard) {
    return deck;
  }

  return {
    ...deck,
    discardPile: [...deck.discardPile, deck.activeCard],
    activeCard: undefined,
  };
}

/**
 * Discard a specific card
 */
export function discardCard(deck: Deck, cardId: string): Deck {
  // Find and remove card from draw pile
  const cardIndex = deck.drawPile.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return deck;
  }

  const card = deck.drawPile[cardIndex];
  const newDrawPile = [...deck.drawPile];
  newDrawPile.splice(cardIndex, 1);

  return {
    ...deck,
    drawPile: newDrawPile,
    discardPile: [...deck.discardPile, card],
  };
}

/**
 * Reshuffle discard pile back into draw pile
 */
export function reshuffleDiscard(deck: Deck): Deck {
  const combinedPile = [...deck.drawPile, ...deck.discardPile];
  const shuffledPile = shuffle(combinedPile);

  return {
    ...deck,
    drawPile: shuffledPile,
    discardPile: [],
  };
}

/**
 * Peek at top N cards without drawing them
 */
export function peekCards(deck: Deck, count: number): Card[] {
  const actualCount = Math.min(count, deck.drawPile.length);
  return deck.drawPile.slice(-actualCount);
}

/**
 * Return a card to the deck (top or bottom)
 */
export function returnCardToDeck(
  deck: Deck,
  card: Card,
  position: 'top' | 'bottom' = 'top'
): Deck {
  const newDrawPile = position === 'top' ? [...deck.drawPile, card] : [card, ...deck.drawPile];

  return {
    ...deck,
    drawPile: newDrawPile,
  };
}

/**
 * Split deck into multiple equal piles
 */
export function splitDeck(deck: Deck, pileCount: number): Deck[] {
  if (pileCount <= 1) {
    return [deck];
  }

  const allCards = [...deck.drawPile];
  const pileSize = Math.floor(allCards.length / pileCount);
  const remainder = allCards.length % pileCount;

  const piles: Deck[] = [];

  let currentIndex = 0;
  for (let i = 0; i < pileCount; i++) {
    // Distribute remainder cards one per pile starting from first
    const thisSize = pileSize + (i < remainder ? 1 : 0);
    const pileCards = allCards.slice(currentIndex, currentIndex + thisSize);

    piles.push({
      id: `${deck.id}-split-${i + 1}`,
      name: `${deck.name} (${i + 1}/${pileCount})`,
      drawPile: pileCards,
      discardPile: [],
      faceUp: deck.faceUp,
      shuffleConfig: deck.shuffleConfig,
    });

    currentIndex += thisSize;
  }

  return piles;
}

/**
 * Get card field value by name
 */
export function getCardFieldValue(card: Card, fieldName: string): string | number | boolean | undefined {
  const field = card.fields.find((f) => f.name === fieldName);
  return field?.value;
}

/**
 * Get card field
 */
export function getCardField(card: Card, fieldName: string): CardField | undefined {
  return card.fields.find((f) => f.name === fieldName);
}

/**
 * Create a new card with specific fields
 */
export function createCard(
  typeId: string,
  fields: Array<{ name: string; value: string | number | boolean }>,
  options?: {
    backgroundImage?: string;
    backgroundColor?: string;
  }
): Card {
  return {
    id: `${typeId}-${Date.now()}-${Math.random()}`,
    typeId,
    fields: fields.map((f) => ({ name: f.name, value: f.value })),
    backgroundImage: options?.backgroundImage,
    backgroundColor: options?.backgroundColor,
  };
}

/**
 * Create a deck from an array of cards
 */
export function createDeck(
  id: string,
  name: string,
  cards: Card[],
  options?: {
    shuffleOnCreate?: boolean;
    faceUp?: boolean;
    autoReshuffle?: boolean;
  }
): Deck {
  const drawPile = options?.shuffleOnCreate ? shuffle(cards) : cards;

  return {
    id,
    name,
    drawPile,
    discardPile: [],
    faceUp: options?.faceUp ?? false,
    shuffleConfig: {
      autoReshuffle: options?.autoReshuffle ?? true,
      reshuffleDiscard: true,
    },
  };
}

/**
 * Get total cards in deck (draw + discard + active)
 */
export function getTotalCardCount(deck: Deck): number {
  return deck.drawPile.length + deck.discardPile.length + (deck.activeCard ? 1 : 0);
}

/**
 * Check if deck is empty
 */
export function isDeckEmpty(deck: Deck): boolean {
  return deck.drawPile.length === 0;
}

/**
 * Get cards remaining in draw pile
 */
export function getCardsRemaining(deck: Deck): number {
  return deck.drawPile.length;
}
