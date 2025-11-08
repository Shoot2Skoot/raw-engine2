/**
 * Card deck component - displays and manages a deck of cards
 */

import type { Deck } from '../../types';
import { useGame } from '../../state/GameContext';
import { Shuffle, ChevronRight, RotateCcw } from 'lucide-react';

interface CardDeckProps {
  deck: Deck;
}

export function CardDeck({ deck }: CardDeckProps) {
  const { dispatch } = useGame();

  const handleShuffle = () => {
    dispatch({ type: 'SHUFFLE_DECK', deckId: deck.id });
  };

  const handleDraw = () => {
    dispatch({ type: 'DRAW_CARD', deckId: deck.id, count: 1 });
  };

  const handleDiscard = () => {
    if (deck.currentCard) {
      dispatch({ type: 'DISCARD_CARD', deckId: deck.id, cardId: deck.currentCard.id });
    }
  };

  const handleReshuffle = () => {
    dispatch({ type: 'RESHUFFLE_DISCARD', deckId: deck.id });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{deck.name}</h3>

      {/* Current card */}
      {deck.currentCard && (
        <div className="mb-4 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Card</h4>
          <div className="space-y-1">
            {deck.currentCard.fields.map((field, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">{field.name}:</span>
                <span className="font-bold text-gray-900">{field.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleDiscard}
            className="mt-3 w-full px-3 py-1.5 rounded bg-gray-500 text-white text-sm hover:bg-gray-600 transition-colors"
          >
            Discard
          </button>
        </div>
      )}

      {/* Deck info */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Draw pile:</span>
          <span className="font-bold text-gray-900">{deck.cards.length} cards</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discard pile:</span>
          <span className="font-bold text-gray-900">{deck.discard.length} cards</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            disabled={deck.cards.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle size={16} />
            <span className="text-sm font-medium">Shuffle</span>
          </button>

          <button
            onClick={handleDraw}
            disabled={deck.cards.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
            <span className="text-sm font-medium">Draw</span>
          </button>
        </div>

        {deck.discard.length > 0 && (
          <button
            onClick={handleReshuffle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reshuffle Discard</span>
          </button>
        )}
      </div>
    </div>
  );
}
