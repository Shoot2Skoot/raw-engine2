/**
 * Deck Component
 * Manages draw pile, discard pile, and current card
 */

import React from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import type { DeckState, Card } from '../types';
import { CardComponent } from './Card';

interface DeckProps {
  deckState: DeckState;
  cardDefinitions: Card[];
  onDraw: (deckId: string) => void;
  onShuffle: (deckId: string) => void;
  onReshuffleDiscard: (deckId: string) => void;
}

export const Deck: React.FC<DeckProps> = ({
  deckState,
  cardDefinitions,
  onDraw,
  onShuffle,
  onReshuffleDiscard,
}) => {
  const getCurrentCardDefinition = (): Card | null => {
    if (!deckState.currentCard) return null;
    return cardDefinitions.find((c) => c.id === deckState.currentCard!.cardDefinitionId) || null;
  };

  const currentCard = getCurrentCardDefinition();
  const drawPileCount = deckState.drawPile.cards.length;
  const discardPileCount = deckState.discardPile.cards.length;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      {/* Deck header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Card Deck</h3>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Draw: {drawPileCount}</span>
          <span>Discard: {discardPileCount}</span>
        </div>
      </div>

      {/* Current card display */}
      {currentCard && (
        <div className="mb-4 flex justify-center">
          <CardComponent card={currentCard} size="medium" faceUp={true} />
        </div>
      )}

      {!currentCard && (
        <div className="mb-4 h-72 flex items-center justify-center text-gray-400">
          No card drawn
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onDraw(deckState.deckId)}
          disabled={drawPileCount === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Play size={20} />
          <span className="font-medium">Draw Card</span>
        </button>

        <button
          onClick={() => onShuffle(deckState.deckId)}
          disabled={drawPileCount === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          <Shuffle size={18} />
          <span className="text-sm font-medium">Shuffle Draw Pile</span>
        </button>

        <button
          onClick={() => onReshuffleDiscard(deckState.deckId)}
          disabled={discardPileCount === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={18} />
          <span className="text-sm font-medium">Reshuffle Discard</span>
        </button>
      </div>
    </div>
  );
};
