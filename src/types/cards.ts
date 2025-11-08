/**
 * Card Types - Defines cards, decks, and card management
 */

export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

export interface CardField {
  id: string;
  name: string; // Field name (e.g., "action", "resource", "value")
  type: CardFieldType;
  value: string | number; // Actual value of the field
  displaySize?: 'small' | 'medium' | 'large';
  displayPosition?: 'top' | 'center' | 'bottom' | 'corner';
}

export interface Card {
  id: string;
  fields: CardField[];
}

export interface DeckDefinition {
  id: string;
  name: string;
  cards: Card[];
  shuffleOnSetup?: boolean; // Auto-shuffle when initializing
  reshuffleWhenEmpty?: boolean; // Auto-reshuffle discard into draw pile
}

export interface DeckState {
  id: string;
  definitionId: string;
  drawPile: Card[];
  discardPile: Card[];
  currentCard?: Card; // Currently revealed/active card
  subDecks?: SubDeck[]; // For split deck scenarios
}

export interface SubDeck {
  id: string;
  name: string;
  cards: Card[];
}
