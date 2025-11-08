/**
 * Card Types
 * Defines card structure and deck management
 */

/** Card field types */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/** Card field value */
export type CardFieldValue =
  | { type: 'number'; value: number }
  | { type: 'text'; text: string }
  | { type: 'symbol'; symbol: string; color?: string }
  | { type: 'color'; color: string }
  | { type: 'image'; url: string };

/** Card field definition */
export interface CardField {
  name: string; // field identifier (e.g., 'action', 'resource', 'value')
  value: CardFieldValue;
  displayProperties?: {
    size?: 'small' | 'medium' | 'large';
    position?: { x: number; y: number };
    color?: string;
  };
}

/** Card definition */
export interface Card {
  id: string;
  fields: CardField[];
  metadata?: Record<string, unknown>; // custom data
}

/** Deck configuration */
export interface DeckConfig {
  id: string;
  label: string;
  cards: Card[];
  initialShuffle?: boolean; // shuffle on creation
}

/** Deck instance */
export interface DeckInstance {
  id: string;
  configId: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard: Card | null; // currently revealed card
  splitPiles?: Card[][]; // for games that split deck into multiple piles
}

/** Card actions */
export type CardAction =
  | { type: 'draw' }
  | { type: 'draw-multiple'; count: number }
  | { type: 'discard'; cardId?: string } // discard current or specific card
  | { type: 'shuffle' }
  | { type: 'shuffle-discard-into-deck' }
  | { type: 'split'; pileCount: number }
  | { type: 'peek'; count: number }
  | { type: 'reveal-card'; cardId: string };
