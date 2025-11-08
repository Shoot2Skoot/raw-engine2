/**
 * Utility functions for card and deck management
 */

import type { CardInstance, CardDefinition, DeckDefinition } from '../types';
import { generateId } from './hotspots';

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
 * Create a deck of card instances from a definition
 */
export function createDeck(definition: DeckDefinition): CardInstance[] {
  const cards: CardInstance[] = [];

  definition.cards.forEach(cardDef => {
    for (let i = 0; i < cardDef.quantity; i++) {
      cards.push({
        id: generateId(),
        definitionId: cardDef.definitionId,
        deckId: definition.id,
        position: 'deck',
      });
    }
  });

  return shuffle(cards);
}

/**
 * Draw cards from the top of a deck
 */
export function drawCards(
  deck: CardInstance[],
  count: number = 1
): {
  drawn: CardInstance[];
  remaining: CardInstance[];
} {
  const drawn = deck.slice(0, count).map(card => ({
    ...card,
    position: 'drawn' as const,
  }));
  const remaining = deck.slice(count);

  return { drawn, remaining };
}

/**
 * Discard a card
 */
export function discardCard(card: CardInstance): CardInstance {
  return {
    ...card,
    position: 'discard',
  };
}

/**
 * Reshuffle discard pile back into deck
 */
export function reshuffleDiscard(
  deck: CardInstance[],
  discard: CardInstance[]
): CardInstance[] {
  const combined = [
    ...deck,
    ...discard.map(card => ({ ...card, position: 'deck' as const })),
  ];
  return shuffle(combined);
}

/**
 * Split a deck into multiple equal piles
 */
export function splitDeck(
  deck: CardInstance[],
  pileCount: number
): CardInstance[][] {
  const piles: CardInstance[][] = Array.from({ length: pileCount }, () => []);

  deck.forEach((card, index) => {
    const pileIndex = index % pileCount;
    piles[pileIndex].push(card);
  });

  return piles;
}

/**
 * Peek at top N cards without drawing
 */
export function peekCards(
  deck: CardInstance[],
  count: number = 1
): CardInstance[] {
  return deck.slice(0, count);
}

/**
 * Get card field value by name
 */
export function getCardFieldValue(
  card: CardDefinition,
  fieldName: string
): number | string | undefined {
  const field = card.fields.find(f => f.name === fieldName);
  return field?.value;
}

/**
 * Format card for display (short summary)
 */
export function formatCard(card: CardDefinition): string {
  const mainFields = card.fields.slice(0, 2);
  return mainFields.map(f => `${f.name}: ${f.value}`).join(', ');
}
