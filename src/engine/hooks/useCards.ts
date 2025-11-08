/**
 * useCards Hook
 * Manages card decks, drawing, shuffling, etc.
 */

import { useCallback } from 'react';
import type { DeckState } from '../types';
import { shuffle } from '../utils/shuffle';

interface UseCardsProps {
  deckStates: DeckState[];
  onDeckStatesChange: (states: DeckState[]) => void;
}

export function useCards({ deckStates, onDeckStatesChange }: UseCardsProps) {
  // Draw a card from a deck
  const drawCard = useCallback(
    (deckId: string) => {
      onDeckStatesChange(
        deckStates.map((deckState) => {
          if (deckState.deckId !== deckId) return deckState;

          const drawPile = deckState.drawPile;
          if (drawPile.cards.length === 0) {
            console.warn('Draw pile is empty');
            return deckState;
          }

          // Take card from appropriate end
          const cardIndex = drawPile.order === 'top' ? 0 : drawPile.cards.length - 1;
          const drawnCard = drawPile.cards[cardIndex];
          const newDrawPile = drawPile.cards.filter((_, i) => i !== cardIndex);

          // Move current card to discard if exists
          const newDiscardCards = deckState.currentCard
            ? [...deckState.discardPile.cards, deckState.currentCard]
            : deckState.discardPile.cards;

          return {
            ...deckState,
            drawPile: { ...drawPile, cards: newDrawPile },
            discardPile: { ...deckState.discardPile, cards: newDiscardCards },
            currentCard: drawnCard,
          };
        })
      );
    },
    [deckStates, onDeckStatesChange]
  );

  // Shuffle a specific pile in a deck
  const shufflePile = useCallback(
    (deckId: string, pileId: 'draw' | 'discard') => {
      onDeckStatesChange(
        deckStates.map((deckState) => {
          if (deckState.deckId !== deckId) return deckState;

          if (pileId === 'draw') {
            return {
              ...deckState,
              drawPile: {
                ...deckState.drawPile,
                cards: shuffle(deckState.drawPile.cards),
              },
            };
          } else {
            return {
              ...deckState,
              discardPile: {
                ...deckState.discardPile,
                cards: shuffle(deckState.discardPile.cards),
              },
            };
          }
        })
      );
    },
    [deckStates, onDeckStatesChange]
  );

  // Reshuffle discard pile back into draw pile
  const reshuffleDiscard = useCallback(
    (deckId: string) => {
      onDeckStatesChange(
        deckStates.map((deckState) => {
          if (deckState.deckId !== deckId) return deckState;

          const combinedCards = [
            ...deckState.drawPile.cards,
            ...deckState.discardPile.cards,
          ];

          return {
            ...deckState,
            drawPile: {
              ...deckState.drawPile,
              cards: shuffle(combinedCards),
            },
            discardPile: {
              ...deckState.discardPile,
              cards: [],
            },
          };
        })
      );
    },
    [deckStates, onDeckStatesChange]
  );

  // Split deck into multiple piles
  const splitDeck = useCallback(
    (deckId: string, pileCount: number) => {
      onDeckStatesChange(
        deckStates.map((deckState) => {
          if (deckState.deckId !== deckId) return deckState;

          const allCards = [...deckState.drawPile.cards];
          const pileSize = Math.floor(allCards.length / pileCount);
          const newPiles = [];

          for (let i = 0; i < pileCount; i++) {
            const start = i * pileSize;
            const end = i === pileCount - 1 ? allCards.length : start + pileSize;
            newPiles.push({
              id: `pile-${i}`,
              name: `Pile ${i + 1}`,
              cards: allCards.slice(start, end),
              faceUp: false,
              order: 'top' as const,
            });
          }

          return {
            ...deckState,
            drawPile: { ...deckState.drawPile, cards: [] },
            additionalPiles: newPiles,
          };
        })
      );
    },
    [deckStates, onDeckStatesChange]
  );

  // Discard current card
  const discardCurrentCard = useCallback(
    (deckId: string) => {
      onDeckStatesChange(
        deckStates.map((deckState) => {
          if (deckState.deckId !== deckId || !deckState.currentCard) return deckState;

          return {
            ...deckState,
            discardPile: {
              ...deckState.discardPile,
              cards: [...deckState.discardPile.cards, deckState.currentCard],
            },
            currentCard: null,
          };
        })
      );
    },
    [deckStates, onDeckStatesChange]
  );

  return {
    deckStates,
    drawCard,
    shufflePile,
    reshuffleDiscard,
    splitDeck,
    discardCurrentCard,
  };
}
