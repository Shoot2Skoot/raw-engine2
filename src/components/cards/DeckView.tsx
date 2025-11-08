/**
 * Deck view component - Display and interact with card decks
 */

import React from 'react';
import type { DeckState, Card } from '../../types';
import { Shuffle, ArrowDown, RotateCcw } from 'lucide-react';

interface DeckViewProps {
  deck: DeckState;
  onDraw: () => void;
  onShuffle: () => void;
  onDiscard: () => void;
  onReshuffle: () => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deck,
  onDraw,
  onShuffle,
  onDiscard,
  onReshuffle,
}) => {
  const canDraw = deck.drawPile.length > 0;
  const canReshuffle = deck.discardPile.length > 0;
  const hasCurrentCard = !!deck.currentCard;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Deck</h3>
        <div className="flex gap-2">
          <button
            onClick={onShuffle}
            disabled={deck.drawPile.length === 0}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Shuffle deck"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>
          <button
            onClick={onReshuffle}
            disabled={!canReshuffle}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reshuffle discard pile"
          >
            <RotateCcw size={14} />
            <span>Reshuffle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Draw pile */}
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Draw</div>
          <div className="w-full aspect-[2/3] bg-blue-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl">
            {deck.drawPile.length}
          </div>
        </div>

        {/* Current card */}
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Current</div>
          {hasCurrentCard && deck.currentCard ? (
            <CardDisplay card={deck.currentCard} />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
              None
            </div>
          )}
        </div>

        {/* Discard pile */}
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Discard</div>
          <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-700 font-bold text-xl">
            {deck.discardPile.length}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDraw}
          disabled={!canDraw}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown size={18} />
          <span>Draw Card</span>
        </button>
        {hasCurrentCard && (
          <button
            onClick={onDiscard}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Discard
          </button>
        )}
      </div>
    </div>
  );
};

interface CardDisplayProps {
  card: Card;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <div className="w-full aspect-[2/3] bg-white rounded-lg shadow-lg border-2 border-gray-300 p-2 flex flex-col items-center justify-center gap-1">
      {card.fields.map((field) => (
        <div key={field.id} className="text-center">
          <div className="text-xs text-gray-500">{field.name}</div>
          <div className="font-bold text-lg text-gray-800">
            {field.type === 'number' ? field.value : field.value}
          </div>
        </div>
      ))}
    </div>
  );
};
