/**
 * Card Deck Component
 * Displays and manages a deck of cards
 */

import { Deck, Card, CardField } from '../../types';
import { Shuffle, ArrowRight, RotateCcw } from 'lucide-react';

interface CardDeckProps {
  deck: Deck;
  onDraw: () => void;
  onDiscard: () => void;
  onShuffle: () => void;
  onReshuffle: () => void;
}

export function CardDeck({
  deck,
  onDraw,
  onDiscard,
  onShuffle,
  onReshuffle,
}: CardDeckProps) {
  const canDraw = deck.drawPile.length > 0;
  const canDiscard = deck.currentCard !== undefined;
  const canReshuffle = deck.discardPile.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{deck.label}</h3>

      <div className="flex gap-4 mb-4">
        {/* Draw Pile */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-32 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-700">
              {deck.drawPile.length}
            </span>
          </div>
          <span className="text-xs text-gray-600">Draw Pile</span>
        </div>

        {/* Current Card */}
        <div className="flex flex-col items-center gap-2">
          {deck.currentCard ? (
            <CardDisplay card={deck.currentCard} />
          ) : (
            <div className="w-24 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-400">No Card</span>
            </div>
          )}
          <span className="text-xs text-gray-600">Current</span>
        </div>

        {/* Discard Pile */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-32 bg-gray-100 border-2 border-gray-400 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
              {deck.discardPile.length}
            </span>
          </div>
          <span className="text-xs text-gray-600">Discard</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onDraw}
          disabled={!canDraw}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors touch-manipulation no-tap-highlight
            ${
              canDraw
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ArrowRight size={16} />
          <span className="text-sm font-medium">Draw</span>
        </button>

        <button
          onClick={onDiscard}
          disabled={!canDiscard}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors touch-manipulation no-tap-highlight
            ${
              canDiscard
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ArrowRight size={16} />
          <span className="text-sm font-medium">Discard</span>
        </button>

        <button
          onClick={onShuffle}
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors touch-manipulation no-tap-highlight"
        >
          <Shuffle size={16} />
          <span className="text-sm font-medium">Shuffle</span>
        </button>

        <button
          onClick={onReshuffle}
          disabled={!canReshuffle}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors touch-manipulation no-tap-highlight
            ${
              canReshuffle
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw size={16} />
          <span className="text-sm font-medium">Reshuffle</span>
        </button>
      </div>
    </div>
  );
}

function CardDisplay({ card }: { card: Card }) {
  return (
    <div className="w-24 h-32 bg-white border-2 border-gray-700 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
      {card.fields.map((field, index) => (
        <CardFieldDisplay key={index} field={field} />
      ))}
    </div>
  );
}

function CardFieldDisplay({ field }: { field: CardField }) {
  if (field.type === 'number') {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{field.value}</div>
        <div className="text-xs text-gray-500">{field.name}</div>
      </div>
    );
  }

  if (field.type === 'symbol') {
    return (
      <div className="text-center">
        <div className="text-xl">{field.value}</div>
        <div className="text-xs text-gray-500">{field.name}</div>
      </div>
    );
  }

  if (field.type === 'color') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className="w-8 h-8 rounded border border-gray-300"
          style={{ backgroundColor: field.value as string }}
        />
        <div className="text-xs text-gray-500">{field.name}</div>
      </div>
    );
  }

  if (field.type === 'text') {
    return (
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">{field.value}</div>
        <div className="text-xs text-gray-500">{field.name}</div>
      </div>
    );
  }

  return null;
}
