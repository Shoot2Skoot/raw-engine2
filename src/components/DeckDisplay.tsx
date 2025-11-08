import React from 'react';
import type { Deck } from '../types';
import { useGame } from '../context/GameContext';
import { CreditCard, Shuffle } from 'lucide-react';

interface DeckDisplayProps {
  deck: Deck;
}

export const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  const { drawCard, discardCard, shuffleDeck } = useGame();

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{deck.label}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => shuffleDeck(deck.id)}
            className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs font-medium"
            title="Shuffle deck"
          >
            <Shuffle className="w-3 h-3" />
          </button>
          <button
            onClick={() => drawCard(deck.id)}
            disabled={deck.drawPile.length === 0}
            className={`
              flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-xs font-medium
              ${
                deck.drawPile.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <CreditCard className="w-3 h-3" />
            Draw
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Draw pile */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Draw Pile</div>
          <div className="w-20 h-28 rounded-md border-2 border-gray-300 bg-blue-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {deck.drawPile.length}
          </div>
        </div>

        {/* Current card */}
        {deck.currentCard && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">Current Card</div>
            <div className="w-24 h-28 rounded-md border-2 border-blue-600 bg-white p-2 flex flex-col justify-center">
              {Object.entries(deck.currentCard.fields).map(([key, field]) => (
                <div key={key} className="text-center mb-1">
                  <div className="text-xs text-gray-500">{field.name}</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: field.color || '#000' }}
                  >
                    {field.symbol || field.value}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => discardCard(deck.id)}
              className="mt-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs"
            >
              Discard
            </button>
          </div>
        )}

        {/* Discard pile */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Discard</div>
          <div className="w-20 h-28 rounded-md border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {deck.discardPile.length}
          </div>
        </div>
      </div>
    </div>
  );
};
