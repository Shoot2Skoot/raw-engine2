/**
 * Card display component - shows current card, deck status, and controls
 */

import React from 'react';
import { CreditCard, Shuffle, ArrowRight, RotateCcw } from 'lucide-react';
import type { DeckState, CardFieldValue } from '../types';

interface CardDisplayProps {
  decks: DeckState[];
  onDrawCard: (deckId: string) => void;
  onDiscardCard: (deckId: string) => void;
  onShuffleDeck: (deckId: string) => void;
  onReshuffleDiscard: (deckId: string) => void;
}

export function CardDisplay({
  decks,
  onDrawCard,
  onDiscardCard,
  onShuffleDeck,
  onReshuffleDiscard
}: CardDisplayProps) {
  if (decks.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Cards
      </h3>

      {decks.map(deck => (
        <DeckDisplay
          key={deck.id}
          deck={deck}
          onDraw={() => onDrawCard(deck.id)}
          onDiscard={() => onDiscardCard(deck.id)}
          onShuffle={() => onShuffleDeck(deck.id)}
          onReshuffle={() => onReshuffleDiscard(deck.id)}
        />
      ))}
    </div>
  );
}

interface DeckDisplayProps {
  deck: DeckState;
  onDraw: () => void;
  onDiscard: () => void;
  onShuffle: () => void;
  onReshuffle: () => void;
}

function DeckDisplay({ deck, onDraw, onDiscard, onShuffle, onReshuffle }: DeckDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">{deck.name}</h4>
        <div className="flex gap-2">
          <button
            onClick={onShuffle}
            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          {deck.discardPile.length > 0 && (
            <button
              onClick={onReshuffle}
              className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              title="Reshuffle discard into deck"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Deck stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Draw: {deck.drawPile.length}</div>
        <div>Discard: {deck.discardPile.length}</div>
      </div>

      {/* Current card display */}
      {deck.currentCard ? (
        <div className="space-y-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 min-h-32">
            <div className="space-y-2">
              {Object.entries(deck.currentCard.fields).map(([fieldName, fieldValue]) => (
                <CardFieldDisplay key={fieldName} name={fieldName} value={fieldValue} />
              ))}
            </div>
          </div>

          <button
            onClick={onDiscard}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            Discard
          </button>
        </div>
      ) : (
        <button
          onClick={onDraw}
          disabled={deck.drawPile.length === 0}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4" />
          {deck.drawPile.length > 0 ? 'Draw Card' : 'Deck Empty'}
        </button>
      )}
    </div>
  );
}

interface CardFieldDisplayProps {
  name: string;
  value: CardFieldValue;
}

function CardFieldDisplay({ name, value }: CardFieldDisplayProps) {
  let content: React.ReactNode = null;

  switch (value.type) {
    case 'number':
      content = (
        <div className="text-3xl font-bold text-gray-800">{value.value}</div>
      );
      break;

    case 'text':
      content = (
        <div className="text-lg font-medium text-gray-700">{value.value}</div>
      );
      break;

    case 'symbol':
      content = (
        <div
          className="text-3xl"
          style={{ color: value.color }}
        >
          {value.value}
        </div>
      );
      break;

    case 'color':
      content = (
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300"
          style={{ backgroundColor: value.value }}
        />
      );
      break;

    case 'image':
      content = (
        <img
          src={value.src}
          alt={name}
          className="w-16 h-16 object-contain"
        />
      );
      break;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-20">
        {name}
      </div>
      {content}
    </div>
  );
}
