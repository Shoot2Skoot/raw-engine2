/**
 * Main App component - Roll-and-Write Game Engine
 */

import { useState } from 'react';
import { Undo, Redo, Save, RotateCcw } from 'lucide-react';
import { GameProvider, useGame } from './GameContext';
import { Sheet } from './components/Sheet';
import { ToolPalette } from './components/ToolPalette';
import { DiceDisplay } from './components/DiceDisplay';
import { CardDisplay } from './components/CardDisplay';
import type { GameConfig, Mark, ToolState } from './types';
import { rollDice } from './utils/dice';
import { yahtzeeConfig } from './games/yahtzee';

function GameEngine() {
  const { state, dispatch, canUndo, canRedo, undo, redo, saveGame } = useGame();

  const currentSheet = state.sheets.find(s => s.id === state.currentSheetId);

  const handleHotspotClick = (sheetId: string, hotspotId: string) => {
    // Find the hotspot
    const sheet = state.sheets.find(s => s.id === sheetId);
    if (!sheet) return;

    let hotspot = null;
    for (const region of sheet.config.regions) {
      const found = region.hotspots.find(h => h.id === hotspotId);
      if (found) {
        hotspot = found;
        break;
      }
    }

    if (!hotspot) return;

    // Check if tool type is allowed
    const tool = state.currentTool;
    if (!hotspot.constraints.allowedMarkTypes.includes(tool.markType)) {
      console.log('Tool not allowed on this hotspot');
      return;
    }

    // Create mark based on current tool
    let mark: Mark | null = null;

    switch (tool.markType) {
      case 'checkbox':
        // Cycle through checkbox states
        const existingCheckbox = hotspot.marks.find(m => m.type === 'checkbox');
        if (existingCheckbox && existingCheckbox.type === 'checkbox') {
          const nextState =
            existingCheckbox.state === 'empty' ? 'checked' :
            existingCheckbox.state === 'checked' ? 'crossed' : 'empty';
          mark = { type: 'checkbox', state: nextState, isPencil: tool.isPencilMode };
        } else {
          mark = { type: 'checkbox', state: 'checked', isPencil: tool.isPencilMode };
        }
        break;

      case 'number':
        mark = {
          type: 'number',
          value: tool.numberValue ?? 0,
          isPencil: tool.isPencilMode
        };
        break;

      case 'color':
        mark = {
          type: 'color',
          color: tool.colorValue ?? '#3B82F6'
        };
        break;

      case 'circle':
        const existingCircle = hotspot.marks.find(m => m.type === 'circle');
        if (existingCircle && existingCircle.type === 'circle') {
          const nextState =
            existingCircle.state === 'empty' ? 'half' :
            existingCircle.state === 'half' ? 'full' : 'empty';
          mark = { type: 'circle', state: nextState, isPencil: tool.isPencilMode };
        } else {
          mark = { type: 'circle', state: 'half', isPencil: tool.isPencilMode };
        }
        break;

      case 'symbol':
        mark = {
          type: 'symbol',
          symbol: tool.symbolValue ?? '★',
          color: tool.colorValue
        };
        break;

      case 'text':
        const text = prompt('Enter text:');
        if (text) {
          mark = { type: 'text', text, isPencil: tool.isPencilMode };
        }
        break;
    }

    if (mark) {
      dispatch({
        type: 'ADD_MARK',
        sheetId,
        hotspotId,
        mark
      });
    }
  };

  const handleToolChange = (_tool: ToolState) => {
    // Update tool in state (we'll need to add this action type)
    // For now, we'll just log it
  };

  const handleRollPool = (poolId: string) => {
    const pool = state.dicePools.find(p => p.id === poolId);
    if (!pool) return;

    const results = rollDice(pool.dice);
    dispatch({
      type: 'ROLL_DICE',
      poolId,
      results
    });
  };

  const handleLockDie = (poolId: string, dieId: string) => {
    dispatch({
      type: 'LOCK_DIE',
      poolId,
      dieId
    });
  };

  const handleUnlockDie = (poolId: string, dieId: string) => {
    dispatch({
      type: 'UNLOCK_DIE',
      poolId,
      dieId
    });
  };

  const handleDrawCard = (deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    if (!deck || deck.drawPile.length === 0) return;

    const card = deck.drawPile[0];
    dispatch({
      type: 'DRAW_CARD',
      deckId,
      card
    });
  };

  const handleDiscardCard = (deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    if (!deck || !deck.currentCard) return;

    dispatch({
      type: 'DISCARD_CARD',
      deckId,
      card: deck.currentCard
    });
  };

  const handleShuffleDeck = (deckId: string) => {
    dispatch({
      type: 'SHUFFLE_DECK',
      deckId
    });
  };

  const handleReshuffleDiscard = (deckId: string) => {
    dispatch({
      type: 'RESHUFFLE_DISCARD',
      deckId
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{state.name}</h1>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={saveGame}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50"
              title="Save game"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={() => confirm('Reset game?') && window.location.reload()}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50"
              title="Reset game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Tools */}
          <div className="lg:col-span-1 space-y-4">
            <ToolPalette
              currentTool={state.currentTool}
              onToolChange={handleToolChange}
            />

            {state.dicePools.length > 0 && (
              <DiceDisplay
                pools={state.dicePools}
                onRollPool={handleRollPool}
                onLockDie={handleLockDie}
                onUnlockDie={handleUnlockDie}
              />
            )}

            {state.decks.length > 0 && (
              <CardDisplay
                decks={state.decks}
                onDrawCard={handleDrawCard}
                onDiscardCard={handleDiscardCard}
                onShuffleDeck={handleShuffleDeck}
                onReshuffleDiscard={handleReshuffleDiscard}
              />
            )}
          </div>

          {/* Main content - Sheet */}
          <div className="lg:col-span-3">
            {currentSheet && (
              <Sheet
                sheet={currentSheet}
                onHotspotClick={handleHotspotClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedGame] = useState<GameConfig>(yahtzeeConfig);

  return (
    <GameProvider config={selectedGame}>
      <GameEngine />
    </GameProvider>
  );
}

export default App;
