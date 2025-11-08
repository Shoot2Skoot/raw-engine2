/**
 * Card Types
 * Card system with multi-field cards and deck management
 */

/** Card field types */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/** Card field definition */
export interface CardField {
  name: string;
  type: CardFieldType;
  value: number | string;
  displayProps?: {
    size?: 'small' | 'medium' | 'large';
    position?: 'top' | 'center' | 'bottom' | 'left' | 'right';
    color?: string;
  };
}

/** Card definition */
export interface Card {
  id: string;
  fields: CardField[];
  backImage?: string; // Card back design
  frontImage?: string; // Optional full card image
}

/** Card instance in a deck */
export interface CardInstance {
  id: string;
  cardDefinitionId: string;
  deckId: string;
}

/** Deck configuration */
export interface Deck {
  id: string;
  name: string;
  cards: CardInstance[];
  showBackImage?: boolean; // Show card backs when face down
  backImage?: string;
}

/** Deck pile (draw pile, discard pile, etc.) */
export interface DeckPile {
  id: string;
  name: string;
  cards: CardInstance[];
  faceUp: boolean; // Are cards in this pile face up?
  order: 'top' | 'bottom'; // Which end to draw from
}

/** Deck state */
export interface DeckState {
  deckId: string;
  drawPile: DeckPile;
  discardPile: DeckPile;
  currentCard: CardInstance | null; // Currently revealed card
  additionalPiles?: DeckPile[]; // Custom piles (e.g., for split decks)
}

/** Card deck configuration */
export interface CardDeckConfig {
  decks: Deck[];
  cardDefinitions: Card[];
  initialStates: DeckState[];
}

/** Card operations */
export type CardOperation =
  | { type: 'draw'; deckId: string; count?: number }
  | { type: 'discard'; deckId: string; cardId: string }
  | { type: 'shuffle'; deckId: string; pileId: string }
  | { type: 'reshuffleDiscard'; deckId: string }
  | { type: 'split'; deckId: string; pileCount: number }
  | { type: 'peek'; deckId: string; count: number }
  | { type: 'moveBetweenPiles'; cardId: string; fromPileId: string; toPileId: string };
