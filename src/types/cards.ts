/**
 * Card Types - Card drawing, deck management
 */

/**
 * Card field types
 */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/**
 * Card field definition
 */
export interface CardField {
  name: string;
  type: CardFieldType;
  value: number | string;
  displaySize?: 'small' | 'medium' | 'large';
  position?: 'top' | 'center' | 'bottom' | 'custom';
  color?: string;
}

/**
 * Card definition
 */
export interface CardDefinition {
  id: string;
  name?: string;
  fields: CardField[];
  backgroundImage?: string;
  backgroundColor?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Card instance
 */
export interface CardInstance {
  id: string;
  definitionId: string;
  deckId?: string;
  position?: 'deck' | 'drawn' | 'discard' | 'hand' | 'active';
}

/**
 * Deck definition
 */
export interface DeckDefinition {
  id: string;
  name: string;
  cards: {
    definitionId: string;
    quantity: number;
  }[];
  size?: number; // Total cards (validation)
  backImage?: string;
  backColor?: string;
}

/**
 * Deck state (runtime)
 */
export interface DeckState {
  id: string;
  drawPile: CardInstance[];
  discardPile: CardInstance[];
  currentCard?: CardInstance;
  isShuffled: boolean;
  drawHistory: CardDrawHistory[];
}

/**
 * Card draw history
 */
export interface CardDrawHistory {
  timestamp: number;
  deckId: string;
  cardId: string;
}

/**
 * Deck action types
 */
export type DeckAction =
  | { type: 'shuffle'; deckId: string }
  | { type: 'draw'; deckId: string; count?: number }
  | { type: 'discard'; deckId: string; cardId: string }
  | { type: 'reshuffleDiscard'; deckId: string }
  | { type: 'split'; deckId: string; pileCount: number }
  | { type: 'peek'; deckId: string; count: number };
