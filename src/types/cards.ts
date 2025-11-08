/**
 * Card Types
 * Defines cards and deck management
 */

/** Card field value types */
export type CardFieldValue = number | string | boolean | CardFieldValue[];

/** Card field definition */
export interface CardField {
  /** Field name/key */
  name: string;
  /** Field value */
  value: CardFieldValue;
  /** Display configuration */
  display?: {
    /** Display label */
    label?: string;
    /** Icon/symbol */
    icon?: string;
    /** Color */
    color?: string;
    /** Font size multiplier */
    size?: number;
  };
}

/** Card definition */
export interface Card {
  /** Unique identifier */
  id: string;
  /** Card fields */
  fields: CardField[];
  /** Optional card image */
  image?: string;
  /** Optional card back image */
  backImage?: string;
  /** Card metadata */
  metadata?: Record<string, unknown>;
}

/** Deck of cards */
export interface Deck {
  /** Unique identifier */
  id: string;
  /** Deck name */
  name: string;
  /** Cards currently in draw pile */
  drawPile: Card[];
  /** Cards in discard pile */
  discardPile: Card[];
  /** Currently active/revealed card */
  currentCard: Card | null;
  /** Deck configuration */
  config: DeckConfig;
}

/** Deck configuration */
export interface DeckConfig {
  /** Whether to auto-reshuffle when deck is empty */
  autoReshuffle: boolean;
  /** Whether discard pile is face-up */
  discardFaceUp: boolean;
  /** Whether to show remaining card count */
  showCount: boolean;
  /** Custom card back image */
  cardBack?: string;
}

/** Deck action types */
export type DeckAction =
  | { type: 'shuffle'; deckId: string }
  | { type: 'draw'; deckId: string; count?: number }
  | { type: 'discard'; deckId: string; cardId: string }
  | { type: 'reshuffle'; deckId: string }
  | { type: 'split'; deckId: string; piles: number }
  | { type: 'peek'; deckId: string; count: number }
  | { type: 'return-to-deck'; deckId: string; cardId: string; position?: 'top' | 'bottom' | 'random' };

/** Card draw result */
export interface DrawResult {
  /** Deck drawn from */
  deckId: string;
  /** Cards drawn */
  cards: Card[];
  /** Remaining cards in deck */
  remaining: number;
  /** Timestamp */
  timestamp: number;
}

/** Deck state snapshot */
export interface DeckSnapshot {
  /** Deck ID */
  deckId: string;
  /** Order of card IDs in draw pile */
  drawPileOrder: string[];
  /** Order of card IDs in discard pile */
  discardPileOrder: string[];
  /** Current card ID */
  currentCardId: string | null;
  /** Timestamp */
  timestamp: number;
}
