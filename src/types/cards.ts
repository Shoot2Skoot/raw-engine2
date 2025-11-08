/**
 * Card and Deck Types - For managing card-based game mechanics
 */

/** A field on a card */
export interface CardField {
  /** Field name/identifier */
  name: string;
  /** Field value (can be number, text, symbol, color, etc.) */
  value: number | string;
  /** Display properties */
  display?: {
    label?: string;
    size?: 'small' | 'medium' | 'large';
    position?: { x: number; y: number };
    color?: string;
  };
}

/** A game card with multiple fields */
export interface Card {
  /** Unique card identifier */
  id: string;
  /** Card fields (e.g., number, symbol, action, etc.) */
  fields: CardField[];
  /** Optional card name */
  name?: string;
  /** Optional image URL */
  imageUrl?: string;
}

/** A deck of cards */
export interface Deck {
  /** Deck identifier */
  id: string;
  /** Display name */
  name: string;
  /** Draw pile (cards not yet drawn) */
  drawPile: Card[];
  /** Discard pile (cards that have been played) */
  discardPile: Card[];
  /** Current/active card (if any) */
  currentCard?: Card;
  /** Whether discard pile is face up */
  discardFaceUp?: boolean;
}

/** Complete card state */
export interface CardState {
  /** All decks in the game */
  decks: Deck[];
}
