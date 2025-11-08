/**
 * GameEngine - main container component that brings everything together
 */

import React, { useCallback } from 'react';
import { Undo, Redo, RotateCcw, Download, Upload } from 'lucide-react';
import type { GameDefinition } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import { Sheet } from './Sheet';
import { ToolPalette } from './ToolPalette';
import { DicePanel } from './DicePanel';
import { CardPanel } from './CardPanel';

interface GameEngineProps {
  gameDefinition: GameDefinition;
}

export const GameEngine: React.FC<GameEngineProps> = ({ gameDefinition }) => {
  const {
    gameState,
    placeMark,
    removeMark,
    setTool,
    switchSheet,
    undo,
    redo,
    rollDice,
    toggleDieLock,
    shuffleDeck,
    drawCard,
    discardCard,
    resetGame,
    exportGame,
    importGame,
  } = useGameEngine(gameDefinition);

  const currentSheet = gameState.sheets.find(
    (s) => s.id === gameState.currentSheetId
  );

  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      if (!currentSheet) return;

      const hotspot = currentSheet.hotspots.find((h) => h.id === hotspotId);
      if (!hotspot) return;

      // Check if tool is allowed on this hotspot
      if (!hotspot.allowedMarkTypes.includes(gameState.currentTool.type)) {
        alert(`${gameState.currentTool.type} marks are not allowed on this hotspot`);
        return;
      }

      // Handle different mark types
      const sheetId = currentSheet.id;

      if (gameState.currentTool.type === 'checkbox') {
        // Get existing mark and cycle through states
        const existingMark = gameState.marks[sheetId]?.find(
          (m) => m.hotspotId === hotspotId && m.type === 'checkbox'
        );

        if (existingMark && existingMark.type === 'checkbox') {
          // Remove old mark
          removeMark(sheetId, existingMark.id);

          // Add new mark with next state
          const nextState =
            existingMark.state === 'empty'
              ? 'checked'
              : existingMark.state === 'checked'
              ? 'crossed'
              : 'empty';

          if (nextState !== 'empty') {
            placeMark(sheetId, hotspotId, {
              type: 'checkbox',
              state: nextState,
            });
          }
        } else {
          // First click - mark as checked
          placeMark(sheetId, hotspotId, {
            type: 'checkbox',
            state: 'checked',
          });
        }
      } else if (gameState.currentTool.type === 'number') {
        const value = gameState.currentTool.value as number | undefined;
        if (value !== undefined) {
          placeMark(sheetId, hotspotId, {
            type: 'number',
            value,
          });
        } else {
          // Prompt for number
          const input = prompt('Enter a number:');
          if (input !== null) {
            const num = parseInt(input, 10);
            if (!isNaN(num)) {
              placeMark(sheetId, hotspotId, {
                type: 'number',
                value: num,
              });
            }
          }
        }
      } else if (gameState.currentTool.type === 'color') {
        const color = gameState.currentTool.value as string;
        if (color) {
          placeMark(sheetId, hotspotId, {
            type: 'color',
            color,
          });
        }
      } else if (gameState.currentTool.type === 'circle') {
        // Cycle through circle states
        const existingMark = gameState.marks[sheetId]?.find(
          (m) => m.hotspotId === hotspotId && m.type === 'circle'
        );

        if (existingMark && existingMark.type === 'circle') {
          removeMark(sheetId, existingMark.id);

          const nextLevel =
            existingMark.fillLevel === 'empty'
              ? 'half'
              : existingMark.fillLevel === 'half'
              ? 'full'
              : 'empty';

          if (nextLevel !== 'empty') {
            placeMark(sheetId, hotspotId, {
              type: 'circle',
              fillLevel: nextLevel,
            });
          }
        } else {
          placeMark(sheetId, hotspotId, {
            type: 'circle',
            fillLevel: 'half',
          });
        }
      } else if (gameState.currentTool.type === 'symbol') {
        const symbolId = gameState.currentTool.value as string;
        if (symbolId) {
          placeMark(sheetId, hotspotId, {
            type: 'symbol',
            symbolId,
          });
        }
      } else if (gameState.currentTool.type === 'text') {
        const text = prompt('Enter text:');
        if (text !== null) {
          placeMark(sheetId, hotspotId, {
            type: 'text',
            value: text,
          });
        }
      }
    },
    [currentSheet, gameState, placeMark, removeMark]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importGame(file);
    }
  };

  if (!currentSheet) {
    return <div>No sheet selected</div>;
  }

  const canUndo = gameState.historyIndex >= 0;
  const canRedo = gameState.historyIndex < gameState.history.length - 1;

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{gameState.gameName}</h1>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="w-5 h-5" />
            </button>

            {/* Export/Import */}
            <button
              onClick={exportGame}
              className="p-2 rounded hover:bg-gray-100"
              title="Export game"
            >
              <Download className="w-5 h-5" />
            </button>
            <label className="p-2 rounded hover:bg-gray-100 cursor-pointer" title="Import game">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            {/* Reset */}
            <button
              onClick={resetGame}
              className="p-2 rounded hover:bg-gray-100 text-red-600"
              title="Reset game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sheet tabs */}
        {gameState.sheets.length > 1 && (
          <div className="flex gap-2 mt-3">
            {gameState.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => switchSheet(sheet.id)}
                className={`
                  px-4 py-2 rounded-t-lg border-b-2 transition-colors
                  ${
                    sheet.id === gameState.currentSheetId
                      ? 'bg-white border-blue-500 text-blue-600 font-medium'
                      : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-64 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Tools</h2>
          <ToolPalette
            currentTool={gameState.currentTool}
            onToolChange={setTool}
            colorPalette={gameState.colorPalette}
            symbolPalette={gameState.symbolPalette}
          />

          {/* Dice panel */}
          {gameState.dicePool.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Dice</h2>
              {gameState.dicePool.map((pool) => (
                <DicePanel
                  key={pool.id}
                  pool={pool}
                  onRoll={(dieIds) => rollDice(pool.id, dieIds)}
                  onToggleLock={(dieId) => toggleDieLock(pool.id, dieId)}
                />
              ))}
            </div>
          )}

          {/* Card panel */}
          {gameState.decks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Cards</h2>
              {gameState.decks.map((deck) => (
                <CardPanel
                  key={deck.id}
                  deck={deck}
                  onShuffle={() => shuffleDeck(deck.id)}
                  onDraw={() => drawCard(deck.id)}
                  onDiscard={() => discardCard(deck.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Center - Sheet */}
        <div className="flex-1 overflow-auto">
          <Sheet
            sheet={currentSheet}
            marks={gameState.marks[currentSheet.id] || []}
            onHotspotClick={handleHotspotClick}
          />
        </div>
      </div>
    </div>
  );
};
