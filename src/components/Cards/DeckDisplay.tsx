import { Shuffle, ArrowDown } from 'lucide-react';
import type { Deck, CardField } from '../../types';

interface DeckDisplayProps {
  deck: Deck;
  onShuffle: () => void;
  onDraw: () => void;
  onDiscard: () => void;
}

export function DeckDisplay({ deck, onShuffle, onDraw, onDiscard }: DeckDisplayProps) {
  const renderCardField = (field: CardField) => {
    return (
      <div key={field.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
        <span className="font-medium text-sm text-gray-600">{field.name}:</span>
        <span className="font-bold text-lg">{field.value}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{deck.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={onShuffle}
            className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            disabled={deck.drawPile.length === 0}
          >
            <Shuffle size={16} />
            Shuffle
          </button>
          <button
            onClick={onDraw}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            disabled={deck.drawPile.length === 0}
          >
            <ArrowDown size={16} />
            Draw
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-gray-600">Draw pile:</span>{' '}
          <span className="font-bold">{deck.drawPile.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Discard:</span>{' '}
          <span className="font-bold">{deck.discardPile.length}</span>
        </div>
      </div>

      {deck.currentCard && (
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <h4 className="font-bold mb-3">Current Card</h4>
          <div className="space-y-2">
            {deck.currentCard.fields.map((field) => renderCardField(field))}
          </div>
          <button
            onClick={onDiscard}
            className="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Discard
          </button>
        </div>
      )}
    </div>
  );
}
