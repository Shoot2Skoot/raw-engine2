/**
 * Card and deck mechanics type definitions
 */

import type { Color, ID } from './core';

/**
 * Card field types
 */
export const CardFieldType = {
  Number: 'number',
  Text: 'text',
  Symbol: 'symbol',
  Color: 'color',
  Image: 'image',
} as const;

export type CardFieldType = (typeof CardFieldType)[keyof typeof CardFieldType];

/**
 * Card field definition
 */
export interface CardField {
  /** Field identifier */
  id: string;
  /** Field type */
  type: CardFieldType;
  /** Display label */
  label?: string;
  /** Field value */
  value: number | string | Color;
  /** Display configuration */
  display?: {
    position?: { x: number; y: number };
    size?: number;
    color?: Color;
    fontSize?: number;
  };
}

/**
 * Card definition
 */
export interface Card {
  /** Unique card identifier */
  id: ID;
  /** Card name/title */
  name?: string;
  /** All fields on this card */
  fields: CardField[];
  /** Optional background image */
  backgroundImage?: string;
  /** Custom styling */
  style?: {
    backgroundColor?: Color;
    borderColor?: Color;
    width?: number;
    height?: number;
  };
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Deck configuration
 */
export interface DeckConfig {
  /** Deck identifier */
  id: ID;
  /** Display name */
  name: string;
  /** All cards in the deck (with quantities) */
  cards: {
    card: Card;
    quantity: number;
  }[];
  /** Whether deck is face-up or face-down */
  faceUp?: boolean;
  /** Auto-reshuffle when empty */
  autoReshuffle?: boolean;
  /** Custom styling */
  style?: {
    backColor?: Color;
    backImage?: string;
  };
}

/**
 * Deck state during gameplay
 */
export interface DeckState {
  /** Which deck this state belongs to */
  deckId: ID;
  /** Cards remaining in draw pile (in order, top first) */
  drawPile: Card[];
  /** Cards in discard pile (in order, top first) */
  discardPile: Card[];
  /** Currently revealed/active card */
  currentCard?: Card;
  /** Number of times deck has been shuffled */
  shuffleCount: number;
  /** Timestamp of last draw */
  lastDrawTime?: number;
}

/**
 * Card draw history entry
 */
export interface CardDrawHistory {
  /** When the card was drawn */
  timestamp: number;
  /** Which deck */
  deckId: ID;
  /** The card that was drawn */
  card: Card;
  /** Turn or round number */
  turn?: number;
}

/**
 * Deck manipulation actions
 */
export const DeckAction = {
  Shuffle: 'shuffle',
  Draw: 'draw',
  DrawMultiple: 'draw-multiple',
  Discard: 'discard',
  Reshuffle: 'reshuffle',
  Peek: 'peek',
  Split: 'split',
} as const;

export type DeckAction = (typeof DeckAction)[keyof typeof DeckAction];

/**
 * Split deck configuration
 */
export interface SplitDeckConfig {
  /** Number of piles to split into */
  pileCount: number;
  /** Whether to shuffle each pile after splitting */
  shuffleAfterSplit?: boolean;
  /** Labels for each pile */
  labels?: string[];
}

/**
 * Split deck state
 */
export interface SplitDeckState {
  /** Original deck ID */
  originalDeckId: ID;
  /** Individual pile states */
  piles: {
    id: ID;
    label?: string;
    cards: Card[];
  }[];
  /** When the split occurred */
  splitTime: number;
}
