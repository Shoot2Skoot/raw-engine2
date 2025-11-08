/**
 * Card and Deck Utilities
 * Helper functions for card and deck management
 */

import type { Card, Deck, DeckConfig, CardField, DrawResult } from '../types';

/**
 * Shuffle an array using Fisher-Yates algorithm
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
 * Create a card
 */
export function createCard(
  fields: CardField[],
  id?: string,
  metadata?: Record<string, unknown>
): Card {
  return {
    id: id || `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fields,
    metadata,
  };
}

/**
 * Create a deck
 */
export function createDeck(
  name: string,
  cards: Card[],
  config?: Partial<DeckConfig>,
  id?: string
): Deck {
  const defaultConfig: DeckConfig = {
    autoReshuffle: false,
    discardFaceUp: true,
    showCount: true,
    ...config,
  };

  return {
    id: id || `deck-${Date.now()}`,
    name,
    drawPile: [...cards],
    discardPile: [],
    currentCard: null,
    config: defaultConfig,
  };
}

/**
 * Shuffle a deck
 */
export function shuffleDeck(deck: Deck): Deck {
  return {
    ...deck,
    drawPile: shuffleArray(deck.drawPile),
  };
}

/**
 * Draw card(s) from deck
 */
export function drawCards(deck: Deck, count: number = 1): { deck: Deck; result: DrawResult } {
  const drawnCards: Card[] = [];
  let newDrawPile = [...deck.drawPile];

  for (let i = 0; i < count; i++) {
    if (newDrawPile.length === 0) {
      if (deck.config.autoReshuffle && deck.discardPile.length > 0) {
        // Reshuffle discard pile into draw pile
        newDrawPile = shuffleArray([...deck.discardPile]);
        deck = { ...deck, discardPile: [] };
      } else {
        break; // No more cards to draw
      }
    }

    const card = newDrawPile.shift();
    if (card) {
      drawnCards.push(card);
    }
  }

  const result: DrawResult = {
    deckId: deck.id,
    cards: drawnCards,
    remaining: newDrawPile.length,
    timestamp: Date.now(),
  };

  return {
    deck: {
      ...deck,
      drawPile: newDrawPile,
      currentCard: drawnCards.length > 0 ? drawnCards[drawnCards.length - 1] : deck.currentCard,
    },
    result,
  };
}

/**
 * Discard a card
 */
export function discardCard(deck: Deck, cardId: string): Deck {
  if (deck.currentCard?.id === cardId) {
    return {
      ...deck,
      discardPile: [...deck.discardPile, deck.currentCard],
      currentCard: null,
    };
  }
  return deck;
}

/**
 * Discard current card and draw next
 */
export function discardAndDraw(deck: Deck): { deck: Deck; result: DrawResult } {
  let updatedDeck = deck;

  // Discard current card if exists
  if (deck.currentCard) {
    updatedDeck = discardCard(deck, deck.currentCard.id);
  }

  // Draw next card
  return drawCards(updatedDeck, 1);
}

/**
 * Reshuffle discard pile into draw pile
 */
export function reshuffleDiscard(deck: Deck): Deck {
  const combinedCards = [...deck.drawPile, ...deck.discardPile];
  const shuffled = shuffleArray(combinedCards);

  return {
    ...deck,
    drawPile: shuffled,
    discardPile: [],
  };
}

/**
 * Split deck into multiple piles
 */
export function splitDeck(deck: Deck, numberOfPiles: number): Card[][] {
  const shuffled = shuffleArray([...deck.drawPile]);
  const piles: Card[][] = Array.from({ length: numberOfPiles }, () => []);

  shuffled.forEach((card, index) => {
    const pileIndex = index % numberOfPiles;
    piles[pileIndex].push(card);
  });

  return piles;
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(deck: Deck, count: number): Card[] {
  return deck.drawPile.slice(0, count);
}

/**
 * Return a card to deck
 */
export function returnCardToDeck(
  deck: Deck,
  card: Card,
  position: 'top' | 'bottom' | 'random' = 'bottom'
): Deck {
  const newDrawPile = [...deck.drawPile];

  switch (position) {
    case 'top':
      newDrawPile.unshift(card);
      break;
    case 'bottom':
      newDrawPile.push(card);
      break;
    case 'random':
      const randomIndex = Math.floor(Math.random() * (newDrawPile.length + 1));
      newDrawPile.splice(randomIndex, 0, card);
      break;
  }

  return {
    ...deck,
    drawPile: newDrawPile,
  };
}
