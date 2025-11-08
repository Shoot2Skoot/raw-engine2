/**
 * Card Engine
 * Core logic for deck management and card operations
 */

import { Card, DeckInstance, DeckConfig } from '../../types';
import { shuffle, generateId, deepClone } from '../../utils/common';

/**
 * Create a new deck instance from configuration
 */
export function createDeckInstance(config: DeckConfig): DeckInstance {
  const cards = deepClone(config.cards);
  const drawPile = config.initialShuffle ? shuffle(cards) : cards;

  return {
    id: generateId(),
    configId: config.id,
    drawPile,
    discardPile: [],
    currentCard: null,
    splitPiles: undefined,
  };
}

/**
 * Shuffle the draw pile
 */
export function shuffleDeck(deck: DeckInstance): void {
  deck.drawPile = shuffle(deck.drawPile);
}

/**
 * Draw a card from the deck
 */
export function drawCard(deck: DeckInstance): Card | null {
  if (deck.drawPile.length === 0) {
    return null;
  }

  const card = deck.drawPile[0];
  deck.drawPile = deck.drawPile.slice(1);
  deck.currentCard = card;

  return card;
}

/**
 * Draw multiple cards
 */
export function drawCards(deck: DeckInstance, count: number): Card[] {
  const drawn: Card[] = [];

  for (let i = 0; i < count; i++) {
    const card = drawCard(deck);
    if (card) {
      drawn.push(card);
    } else {
      break;
    }
  }

  return drawn;
}

/**
 * Discard current card
 */
export function discardCurrentCard(deck: DeckInstance): void {
  if (deck.currentCard) {
    deck.discardPile.push(deck.currentCard);
    deck.currentCard = null;
  }
}

/**
 * Discard a specific card
 */
export function discardCard(deck: DeckInstance, card: Card): void {
  deck.discardPile.push(card);
}

/**
 * Reshuffle discard pile into draw pile
 */
export function reshuffleDiscard(deck: DeckInstance): void {
  deck.drawPile = [...deck.drawPile, ...shuffle(deck.discardPile)];
  deck.discardPile = [];
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(deck: DeckInstance, count: number): Card[] {
  return deck.drawPile.slice(0, count);
}

/**
 * Split deck into multiple piles
 */
export function splitDeck(deck: DeckInstance, pileCount: number): void {
  const piles: Card[][] = Array.from({ length: pileCount }, () => []);
  const cards = [...deck.drawPile];

  // Distribute cards evenly
  for (let i = 0; i < cards.length; i++) {
    piles[i % pileCount].push(cards[i]);
  }

  deck.splitPiles = piles;
  deck.drawPile = [];
}

/**
 * Select a split pile to use as draw pile
 */
export function selectSplitPile(deck: DeckInstance, pileIndex: number): void {
  if (!deck.splitPiles || pileIndex >= deck.splitPiles.length) {
    throw new Error('Invalid pile index');
  }

  deck.drawPile = deck.splitPiles[pileIndex];
  deck.splitPiles = undefined;
}

/**
 * Combine all split piles back into draw pile
 */
export function combineSplitPiles(deck: DeckInstance): void {
  if (!deck.splitPiles) return;

  deck.drawPile = deck.splitPiles.flat();
  deck.splitPiles = undefined;
}

/**
 * Get deck statistics
 */
export function getDeckStats(deck: DeckInstance) {
  return {
    drawPileSize: deck.drawPile.length,
    discardPileSize: deck.discardPile.length,
    splitPilesSizes: deck.splitPiles?.map((pile) => pile.length),
    totalCards:
      deck.drawPile.length +
      deck.discardPile.length +
      (deck.currentCard ? 1 : 0) +
      (deck.splitPiles?.flat().length ?? 0),
  };
}
