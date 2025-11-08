/**
 * Card and deck types for card-based game mechanics
 */

/** Field type on a card */
export type CardFieldType = 'number' | 'text' | 'symbol' | 'color' | 'image';

/** Card field definition */
export interface CardField {
  /** Field name/identifier */
  name: string;
  /** Field type */
  type: CardFieldType;
  /** Field value */
  value: string | number;
  /** Display color (optional) */
  color?: string;
  /** Display position/style (optional) */
  style?: {
    fontSize?: number;
    fontWeight?: string;
    position?: 'top' | 'center' | 'bottom';
  };
}

/** Card definition */
export interface Card {
  /** Unique identifier */
  id: string;
  /** Fields on this card */
  fields: CardField[];
  /** Optional background color */
  backgroundColor?: string;
  /** Optional background image */
  backgroundImage?: string;
}

/** Deck of cards */
export interface Deck {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** All cards in the deck (draw pile + discard pile) */
  cards: Card[];
  /** Whether deck is face up or face down */
  faceUp: boolean;
}

/** Deck state including current position */
export interface DeckState {
  /** The deck configuration */
  deck: Deck;
  /** Cards still in draw pile (top of array is next card) */
  drawPile: Card[];
  /** Cards in discard pile (top of array is most recent) */
  discardPile: Card[];
  /** Currently revealed/active card */
  currentCard?: Card;
  /** Draw history (for undo) */
  drawHistory: Card[];
}

/** Fisher-Yates shuffle algorithm */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Shuffle a deck */
export function shuffleDeck(deck: Deck): Card[] {
  return shuffleArray(deck.cards);
}

/** Draw a card from the deck */
export function drawCard(state: DeckState): DeckState | null {
  if (state.drawPile.length === 0) {
    return null; // No cards to draw
  }

  const [nextCard, ...remainingCards] = state.drawPile;

  return {
    ...state,
    drawPile: remainingCards,
    currentCard: nextCard,
    drawHistory: [...state.drawHistory, nextCard],
  };
}

/** Discard current card */
export function discardCurrentCard(state: DeckState): DeckState | null {
  if (!state.currentCard) {
    return null; // No card to discard
  }

  return {
    ...state,
    discardPile: [state.currentCard, ...state.discardPile],
    currentCard: undefined,
  };
}

/** Reshuffle discard pile back into draw pile */
export function reshuffleDiscard(state: DeckState): DeckState {
  const newDrawPile = shuffleArray([
    ...state.drawPile,
    ...state.discardPile,
  ]);

  return {
    ...state,
    drawPile: newDrawPile,
    discardPile: [],
  };
}

/** Split deck into N equal piles */
export function splitDeck(
  cards: Card[],
  pileCount: number
): Card[][] {
  const piles: Card[][] = Array.from({ length: pileCount }, () => []);

  cards.forEach((card, index) => {
    piles[index % pileCount].push(card);
  });

  return piles;
}

/** Peek at top N cards without drawing */
export function peekCards(state: DeckState, count: number): Card[] {
  return state.drawPile.slice(0, count);
}

/** Create a standard deck with numbered cards */
export function createNumberedDeck(
  id: string,
  name: string,
  min: number,
  max: number,
  copies: number = 1
): Deck {
  const cards: Card[] = [];

  for (let num = min; num <= max; num++) {
    for (let copy = 0; copy < copies; copy++) {
      cards.push({
        id: `${id}-${num}-${copy}`,
        fields: [
          {
            name: 'number',
            type: 'number',
            value: num,
          },
        ],
      });
    }
  }

  return {
    id,
    name,
    cards,
    faceUp: false,
  };
}

/** Helper to get field value from card */
export function getCardField(
  card: Card,
  fieldName: string
): CardField | undefined {
  return card.fields.find((f) => f.name === fieldName);
}

/** Helper to get field value as number */
export function getCardFieldNumber(
  card: Card,
  fieldName: string
): number | undefined {
  const field = getCardField(card, fieldName);
  return field && typeof field.value === 'number' ? field.value : undefined;
}

/** Helper to get field value as string */
export function getCardFieldString(
  card: Card,
  fieldName: string
): string | undefined {
  const field = getCardField(card, fieldName);
  return field ? String(field.value) : undefined;
}
