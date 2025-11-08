/**
 * Card Types - Card-based mechanics and deck management
 */

/**
 * Field value types
 */
export type FieldValue = number | string | boolean;

/**
 * Card field definition
 */
export interface CardField {
  /** Field name/key */
  name: string;
  /** Field value */
  value: FieldValue;
  /** Display properties */
  display?: {
    label?: string;
    icon?: string;
    color?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    size?: 'small' | 'medium' | 'large';
  };
}

/**
 * Card definition
 */
export interface Card {
  /** Unique identifier for this specific card instance */
  id: string;
  /** Card type/template ID */
  typeId: string;
  /** Card fields */
  fields: CardField[];
  /** Optional background image */
  backgroundImage?: string;
  /** Optional background color */
  backgroundColor?: string;
  /** Card back design (for face-down display) */
  backDesign?: {
    image?: string;
    color?: string;
    pattern?: string;
  };
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Card type template (defines structure of cards)
 */
export interface CardType {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Field definitions */
  fieldDefinitions: Array<{
    name: string;
    type: 'number' | 'text' | 'symbol' | 'color' | 'boolean';
    label?: string;
    /** Default value */
    defaultValue?: FieldValue;
    /** For number fields */
    range?: { min: number; max: number };
    /** For choice fields */
    options?: FieldValue[];
  }>;
  /** Visual template */
  template?: {
    width: number;
    height: number;
    backgroundImage?: string;
    backgroundColor?: string;
    layout?: 'compact' | 'spacious' | 'custom';
  };
}

/**
 * Deck of cards
 */
export interface Deck {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Cards in draw pile (top = last element) */
  drawPile: Card[];
  /** Cards in discard pile (top = last element) */
  discardPile: Card[];
  /** Currently active/revealed card */
  activeCard?: Card;
  /** Is deck face-up or face-down? */
  faceUp: boolean;
  /** Shuffle behavior */
  shuffleConfig?: {
    /** Auto-reshuffle when draw pile is empty? */
    autoReshuffle: boolean;
    /** Include discard pile in reshuffle? */
    reshuffleDiscard: boolean;
  };
}

/**
 * Deck action types
 */
export type DeckAction =
  | { type: 'shuffle'; deckId: string }
  | { type: 'draw'; deckId: string; count?: number }
  | { type: 'discard'; deckId: string; cardId: string }
  | { type: 'discardActive'; deckId: string }
  | { type: 'reshuffle'; deckId: string }
  | { type: 'peek'; deckId: string; count: number }
  | { type: 'returnToDeck'; deckId: string; cardId: string; position?: 'top' | 'bottom' }
  | { type: 'split'; deckId: string; pileCount: number };

/**
 * Result of peeking at cards
 */
export interface PeekResult {
  deckId: string;
  cards: Card[];
  /** Don't modify deck when peeking */
  temporary: true;
}

/**
 * Result of splitting a deck
 */
export interface SplitResult {
  /** Original deck ID */
  originalDeckId: string;
  /** New deck IDs created from split */
  newDecks: Array<{
    id: string;
    name: string;
    cards: Card[];
  }>;
}
