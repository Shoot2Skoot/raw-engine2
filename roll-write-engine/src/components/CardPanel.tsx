/**
 * Card and deck management component
 */

import React from 'react';
import { Layers, Shuffle, ArrowRight, Eye } from 'lucide-react';
import type { Deck, Card } from '../types';
import { useGame } from '../gameState';

interface CardDisplayProps {
  card: Card;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-slate-300 p-4 min-w-[200px] shadow-md">
      <div className="space-y-2">
        {card.fields.map((field, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">{field.name}:</span>
            <span className="text-lg font-bold">
              {field.type === 'symbol' ? (
                <span className="text-2xl">{field.value}</span>
              ) : field.type === 'color' ? (
                <div
                  className="w-8 h-8 rounded border-2 border-slate-300"
                  style={{ backgroundColor: field.value.toString() }}
                />
              ) : (
                <span>{field.value}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DeckDisplayProps {
  deck: Deck;
}

const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  const { drawCard, discardCard, shuffleDeck } = useGame();

  const handleDraw = () => {
    if (deck.drawPile.length > 0) {
      drawCard(deck.id);
    } else if (deck.discardPile.length > 0) {
      // Auto-reshuffle if draw pile is empty
      shuffleDeck(deck.id);
      drawCard(deck.id);
    }
  };

  const handleDiscard = () => {
    if (deck.currentCard) {
      discardCard(deck.id);
    }
  };

  const handleShuffle = () => {
    shuffleDeck(deck.id);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg">{deck.name}</h4>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            title="Shuffle deck"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Draw Pile */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-slate-600 mb-2">Draw Pile</div>
          <button
            onClick={handleDraw}
            disabled={deck.drawPile.length === 0 && deck.discardPile.length === 0}
            className={`relative w-24 h-32 rounded-lg border-2 flex items-center justify-center ${
              deck.drawPile.length > 0
                ? 'bg-blue-100 border-blue-400 hover:bg-blue-200 cursor-pointer'
                : deck.discardPile.length > 0
                ? 'bg-amber-100 border-amber-400 hover:bg-amber-200 cursor-pointer'
                : 'bg-slate-100 border-slate-300 cursor-not-allowed'
            }`}
          >
            <Layers size={32} className="text-slate-400" />
            <div className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border border-slate-300">
              {deck.drawPile.length}
            </div>
          </button>
          {deck.drawPile.length === 0 && deck.discardPile.length > 0 && (
            <div className="text-xs text-amber-600 mt-1">Will reshuffle</div>
          )}
        </div>

        {/* Current Card */}
        <div className="flex flex-col items-center flex-1">
          <div className="text-sm text-slate-600 mb-2">Current Card</div>
          {deck.currentCard ? (
            <div>
              <CardDisplay card={deck.currentCard} />
              <button
                onClick={handleDiscard}
                className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-1 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
              >
                <ArrowRight size={14} />
                <span>Discard</span>
              </button>
            </div>
          ) : (
            <div className="w-24 h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              <Eye size={32} />
            </div>
          )}
        </div>

        {/* Discard Pile */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-slate-600 mb-2">Discard</div>
          <div className="relative w-24 h-32 rounded-lg border-2 bg-slate-100 border-slate-300 flex items-center justify-center">
            {deck.discardPile.length > 0 && deck.discardPile[deck.discardPile.length - 1] && (
              <div className="absolute inset-0 p-2 text-xs overflow-hidden">
                <CardDisplay card={deck.discardPile[deck.discardPile.length - 1]} />
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border border-slate-300">
              {deck.discardPile.length}
            </div>
          </div>
        </div>
      </div>

      {deck.cards.length === 0 && (
        <div className="text-center text-slate-400 py-4">No cards in this deck</div>
      )}
    </div>
  );
};

export const CardPanel: React.FC = () => {
  const { state } = useGame();

  if (state.decks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 border-t border-slate-300 p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Layers size={20} />
        Cards
      </h3>
      <div className="space-y-4">
        {state.decks.map((deck) => (
          <DeckDisplay key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
};
