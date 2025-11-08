/**
 * Card Types - Card deck management system
 */

/**
 * Card field value types
 */
export type CardFieldValue = string | number | string[]

/**
 * Card field definition
 */
export interface CardField {
  name: string
  value: CardFieldValue
  display?: string // custom display format
  color?: string
  symbol?: string
  imageUrl?: string
}

/**
 * Card definition
 */
export interface Card {
  id: string
  fields: CardField[]
  imageUrl?: string
  backgroundColor?: string
  metadata?: Record<string, unknown>
}

/**
 * Card in a deck with instance ID
 */
export interface DeckCard {
  cardId: string
  instanceId: string // unique ID for this instance (for duplicates)
}

/**
 * Deck configuration
 */
export interface DeckDefinition {
  id: string
  label: string
  cards: Card[]

  /** How many of each card (by cardId) */
  quantities: Record<string, number>

  /** Should deck auto-reshuffle when empty */
  autoReshuffle?: boolean

  /** Card back image URL */
  cardBackUrl?: string
}

/**
 * Deck state (runtime)
 */
export interface DeckState {
  definition: DeckDefinition
  drawPile: DeckCard[]
  discardPile: DeckCard[]
  currentCard?: DeckCard
  drawCount: number
  reshuffleCount: number
}

/**
 * Multiple deck states
 */
export interface MultiDeckState {
  decks: Record<string, DeckState>
  activeDeckId?: string
}

/**
 * Draw options
 */
export interface DrawOptions {
  /** Number of cards to draw */
  count?: number

  /** Peek without removing from deck */
  peek?: boolean

  /** Draw from specific position (default: top) */
  position?: 'top' | 'bottom' | number
}
