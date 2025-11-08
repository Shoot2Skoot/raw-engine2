/**
 * Card Types - Card mechanics and deck management
 */

/**
 * Field value type
 */
export type FieldValue = string | number | string[];

/**
 * Card field definition
 */
export interface CardField {
  /** Field name */
  name: string;
  /** Field value */
  value: FieldValue;
  /** Display properties */
  display?: {
    /** Position on card */
    position?: { x: number; y: number };
    /** Font size */
    fontSize?: number;
    /** Color */
    color?: string;
  };
}

/**
 * Card definition
 */
export interface Card {
  /** Unique identifier */
  id: string;
  /** Fields on this card */
  fields: CardField[];
  /** Card image (optional) */
  imageSrc?: string;
}

/**
 * Deck configuration
 */
export interface DeckConfig {
  /** Unique identifier */
  id: string;
  /** Deck name/label */
  name: string;
  /** Card definitions with quantities */
  cards: Array<{
    card: Card;
    /** Number of copies in deck */
    quantity: number;
  }>;
  /** Whether cards are face-up when discarded */
  discardFaceUp: boolean;
  /** Auto-reshuffle when deck is empty */
  autoReshuffle: boolean;
}

/**
 * Current deck state
 */
export interface DeckState {
  /** Deck configuration */
  config: DeckConfig;
  /** Draw pile (array of card IDs) */
  drawPile: string[];
  /** Discard pile (array of card IDs) */
  discardPile: string[];
  /** Currently revealed/active card */
  activeCard?: string;
  /** All card instances (map of ID to Card) */
  cardInstances: Record<string, Card>;
}

/**
 * Complete card state (all decks)
 */
export interface CardState {
  /** All decks */
  decks: Record<string, DeckState>;
}
