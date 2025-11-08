/**
 * CardPanel - displays and manages card deck
 */

import React from 'react';
import { Shuffle, ArrowDown, Trash2 } from 'lucide-react';
import type { Deck } from '../types';

interface CardPanelProps {
  deck: Deck;
  onShuffle: () => void;
  onDraw: () => void;
  onDiscard: () => void;
}

export const CardPanel: React.FC<CardPanelProps> = ({
  deck,
  onShuffle,
  onDraw,
  onDiscard,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3">
      <h3 className="font-medium text-gray-900 mb-3">{deck.name}</h3>

      {/* Current card */}
      {deck.currentCard && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs font-medium text-blue-800 mb-1">Current Card</div>
          {deck.currentCard.fields.map((field, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">{field.name}:</span>
              <span className="text-gray-900">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Deck stats */}
      <div className="flex gap-3 text-sm text-gray-600 mb-3">
        <div>
          <span className="font-medium">Draw:</span> {deck.drawPile.length}
        </div>
        <div>
          <span className="font-medium">Discard:</span> {deck.discardPile.length}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onShuffle}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>
        <button
          onClick={onDraw}
          disabled={deck.drawPile.length === 0}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <ArrowDown className="w-4 h-4" />
          Draw Card
        </button>
        {deck.currentCard && (
          <button
            onClick={onDiscard}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>
        )}
      </div>
    </div>
  );
};
