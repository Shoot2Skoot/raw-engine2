/**
 * Card display component
 */

import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import type { Deck, Card } from '../../types';
import { getCurrentCard } from '../../engine/cards';
import { useGame } from '../../engine/GameContext';

interface CardDisplayProps {
  deck: Deck;
}

export function CardDisplay({ deck }: CardDisplayProps) {
  const { dispatch } = useGame();

  const currentCard = getCurrentCard(deck);

  const handleDraw = () => {
    if (deck.drawPile.length === 0) {
      return;
    }

    const cardId = deck.drawPile[0];
    dispatch({
      type: 'DRAW_CARD',
      payload: { deckId: deck.id, cardId },
    });
  };

  const handleDiscard = () => {
    if (!currentCard) return;

    dispatch({
      type: 'DISCARD_CARD',
      payload: { deckId: deck.id, cardId: currentCard.id },
    });
  };

  const handleShuffle = () => {
    dispatch({
      type: 'SHUFFLE_DECK',
      payload: { deckId: deck.id },
    });
  };

  const canDraw = deck.drawPile.length > 0;
  const canDiscard = currentCard !== null;

  return (
    <div className="card-display bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{deck.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle size={14} />
            Shuffle
          </button>
        </div>
      </div>

      {/* Current card */}
      {currentCard ? (
        <div className="mb-3">
          <CardRenderer card={currentCard} />
        </div>
      ) : (
        <div className="mb-3 aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          No card drawn
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleDiscard}
          disabled={!canDiscard}
          className={`
            flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
            ${canDiscard
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft size={16} />
          Discard
        </button>
        <button
          onClick={handleDraw}
          disabled={!canDraw}
          className={`
            flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
            ${canDraw
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Draw
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Deck info */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Draw: {deck.drawPile.length}</span>
          <span>Discard: {deck.discardPile.length}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARD RENDERER
// ============================================================================

interface CardRendererProps {
  card: Card;
}

function CardRenderer({ card }: CardRendererProps) {
  return (
    <div className="aspect-[3/4] bg-white border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-3">
      {card.fields.map((field, index) => (
        <div key={index} className="text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {field.name}
          </div>
          <div className={`
            font-bold
            ${field.type === 'number' ? 'text-4xl' : 'text-2xl'}
          `}>
            {renderFieldValue(field)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderFieldValue(field: Card['fields'][0]): React.ReactNode {
  switch (field.type) {
    case 'number':
      return field.value;

    case 'text':
      return field.value;

    case 'symbol':
      return getSymbolIcon(String(field.value));

    case 'color':
      return (
        <div
          className="w-12 h-12 rounded-full mx-auto border-2 border-gray-300"
          style={{ backgroundColor: String(field.value) }}
        />
      );

    case 'image':
      return (
        <img
          src={String(field.value)}
          alt={field.name}
          className="w-16 h-16 object-contain"
        />
      );

    default:
      return field.value;
  }
}

function getSymbolIcon(symbolId: string): string {
  const symbols: Record<string, string> = {
    astronaut: '👨‍🚀',
    plant: '🌱',
    robot: '🤖',
    water: '💧',
    star: '★',
    diamond: '◆',
    heart: '❤',
  };

  return symbols[symbolId] || symbolId;
}
