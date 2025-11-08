/**
 * Deck Display - Shows and controls a card deck
 */

import { useDeck, useGameEngine } from '../../core/GameEngine';
import { Shuffle, ChevronRight, RotateCcw } from 'lucide-react';
import type { Card } from '../../types';

interface DeckDisplayProps {
  deckId: string;
}

export function DeckDisplay({ deckId }: DeckDisplayProps) {
  const deck = useDeck(deckId);
  const { drawCard, discardCard, shuffleDeck, reshuffleDeck } = useGameEngine();

  if (!deck) return null;

  const handleDraw = () => {
    if (deck.drawPile.length === 0) {
      // Auto-reshuffle if deck is empty
      reshuffleDeck(deckId);
      setTimeout(() => drawCard(deckId), 100);
    } else {
      drawCard(deckId);
    }
  };

  const handleDiscard = () => {
    if (deck.currentCard) {
      discardCard(deckId);
    }
  };

  const handleShuffle = () => {
    shuffleDeck(deckId);
  };

  const handleReshuffle = () => {
    reshuffleDeck(deckId);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{deck.label}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleReshuffle}
            className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Reshuffle discard into deck"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-3">
        <div className="text-sm text-gray-600">
          Draw pile: <span className="font-semibold">{deck.drawPile.length}</span>
        </div>
        <div className="text-sm text-gray-600">
          Discard: <span className="font-semibold">{deck.discardPile.length}</span>
        </div>
      </div>

      {deck.currentCard ? (
        <div className="space-y-3">
          <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Current Card
            </div>
            <CardDisplay card={deck.currentCard} />
          </div>
          <button
            onClick={handleDiscard}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Discard Card
          </button>
        </div>
      ) : (
        <button
          onClick={handleDraw}
          disabled={deck.drawPile.length === 0 && deck.discardPile.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Draw Card
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface CardDisplayProps {
  card: Card;
}

function CardDisplay({ card }: CardDisplayProps) {
  return (
    <div className="space-y-2">
      {card.fields.map((field, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{field.name}:</span>
          <span className="text-lg font-bold text-gray-900">{field.value}</span>
        </div>
      ))}
    </div>
  );
}
