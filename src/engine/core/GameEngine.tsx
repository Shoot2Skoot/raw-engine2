/**
 * GameEngine Component
 * Main component that orchestrates the entire game
 */

import React, { useState, useCallback } from 'react';
import type { GameConfig } from '../types';
import { Sheet } from '../components/Sheet';
import { ToolPalette } from '../components/ToolPalette';
import { ValuePicker } from '../components/ValuePicker';
import { DicePool } from '../components/DicePool';
import { Deck } from '../components/Deck';
import { ControlBar } from '../components/ControlBar';
import { useGameState } from '../hooks/useGameState';
import { useDice } from '../hooks/useDice';
import { useCards } from '../hooks/useCards';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { exportToFile, loadFromLocalStorage } from '../utils/storage';

interface GameEngineProps {
  config: GameConfig;
}

export const GameEngine: React.FC<GameEngineProps> = ({ config }) => {
  // Game state management
  const {
    state,
    setState,
    addMark,
    removeMark,
    setCurrentTool,
    togglePencilMode,
    switchSheet,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useGameState(config);

  // Dice management
  const { rollPool, toggleDieLock, rollSingleDie } = useDice({
    dicePools: state.dicePools || [],
    customDice: config.dice?.customDice,
    standardDice: config.dice?.standardDice,
    onDicePoolsChange: (pools) => setState((prev) => ({ ...prev, dicePools: pools })),
  });

  // Card management
  const { drawCard, shufflePile, reshuffleDiscard } = useCards({
    deckStates: state.deckStates || [],
    onDeckStatesChange: (deckStates) => setState((prev) => ({ ...prev, deckStates })),
  });

  // UI state
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [showValuePicker, setShowValuePicker] = useState(false);
  const [pendingHotspotId, setPendingHotspotId] = useState<string | null>(null);

  // Current sheet
  const currentSheet = config.sheets.sheets.find((s) => s.id === state.currentSheetId);
  const currentSheetState = state.sheets.find((s) => s.sheetId === state.currentSheetId);

  // Handle hotspot click
  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      setSelectedHotspotId(hotspotId);

      const tool = state.toolState.currentTool;

      // Eraser: remove marks from this hotspot
      if (tool === 'eraser') {
        const marksToRemove = currentSheetState?.marks.filter((m) => m.hotspotId === hotspotId) || [];
        marksToRemove.forEach((mark) => removeMark(mark.id));
        return;
      }

      // Checkbox: cycle through states
      if (tool === 'checkbox') {
        const existingMark = currentSheetState?.marks.find(
          (m) => m.type === 'checkbox' && m.hotspotId === hotspotId
        );

        if (existingMark && existingMark.type === 'checkbox') {
          const nextState =
            existingMark.state === 'empty'
              ? 'checked'
              : existingMark.state === 'checked'
              ? 'crossed'
              : 'empty';

          if (nextState === 'empty') {
            removeMark(existingMark.id);
          } else {
            // We'd need an updateMark function here
            removeMark(existingMark.id);
            addMark({
              type: 'checkbox',
              hotspotId,
              state: nextState,
              isPencil: state.toolState.isPencilMode,
            });
          }
        } else {
          addMark({
            type: 'checkbox',
            hotspotId,
            state: 'checked',
            isPencil: state.toolState.isPencilMode,
          });
        }
        return;
      }

      // Circle: cycle through fill levels
      if (tool === 'circle') {
        const existingMark = currentSheetState?.marks.find(
          (m) => m.type === 'circle' && m.hotspotId === hotspotId
        );

        if (existingMark && existingMark.type === 'circle') {
          const nextFill =
            existingMark.fillLevel === 'empty'
              ? 'half'
              : existingMark.fillLevel === 'half'
              ? 'full'
              : 'empty';

          if (nextFill === 'empty') {
            removeMark(existingMark.id);
          } else {
            removeMark(existingMark.id);
            addMark({
              type: 'circle',
              hotspotId,
              fillLevel: nextFill,
              isPencil: state.toolState.isPencilMode,
            });
          }
        } else {
          addMark({
            type: 'circle',
            hotspotId,
            fillLevel: 'half',
            isPencil: state.toolState.isPencilMode,
          });
        }
        return;
      }

      // Tools that need value selection
      if (['number', 'color', 'symbol', 'text'].includes(tool)) {
        setPendingHotspotId(hotspotId);
        setShowValuePicker(true);
        return;
      }
    },
    [state, currentSheetState, addMark, removeMark]
  );

  // Handle value selection
  const handleValueSelect = useCallback(
    (value: number | string) => {
      if (!pendingHotspotId) return;

      const tool = state.toolState.currentTool;

      if (tool === 'number') {
        addMark({
          type: 'number',
          hotspotId: pendingHotspotId,
          value: value as number,
          isPencil: state.toolState.isPencilMode,
        });
      } else if (tool === 'color') {
        addMark({
          type: 'color',
          hotspotId: pendingHotspotId,
          color: value as string,
          isPencil: state.toolState.isPencilMode,
        });
      } else if (tool === 'symbol') {
        addMark({
          type: 'symbol',
          hotspotId: pendingHotspotId,
          symbol: value as string,
          isPencil: state.toolState.isPencilMode,
        });
      } else if (tool === 'text') {
        addMark({
          type: 'text',
          hotspotId: pendingHotspotId,
          text: value as string,
          isPencil: state.toolState.isPencilMode,
        });
      }

      setShowValuePicker(false);
      setPendingHotspotId(null);
    },
    [pendingHotspotId, state.toolState, addMark]
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onTogglePencilMode: togglePencilMode,
    onSwitchSheet: (index) => {
      const sheet = config.sheets.sheets[index];
      if (sheet) switchSheet(sheet.id);
    },
  });

  // Save/Load handlers
  const handleSave = useCallback(() => {
    if (config.autoSave?.enabled) {
      alert('Game saved to browser storage!');
    }
  }, [config.autoSave]);

  const handleLoad = useCallback(() => {
    if (config.autoSave?.enabled) {
      const saved = loadFromLocalStorage(config.autoSave.storageKey);
      if (saved) {
        setState(saved.state);
        alert('Game loaded from browser storage!');
      } else {
        alert('No saved game found.');
      }
    }
  }, [config.autoSave, setState]);

  const handleExport = useCallback(() => {
    exportToFile(state, config.metadata.name);
  }, [state, config.metadata.name]);

  if (!currentSheet || !currentSheetState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header with sheet tabs */}
        {config.sheets.sheets.length > 1 && (
          <div className="mb-4 bg-white rounded-lg shadow p-2 flex gap-2">
            {config.sheets.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => switchSheet(sheet.id)}
                className={`
                  px-4 py-2 rounded-lg transition-colors font-medium
                  ${
                    sheet.id === state.currentSheetId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-[auto_1fr_auto] gap-4">
          {/* Left sidebar - Tools */}
          <div className="space-y-4">
            <ToolPalette
              currentTool={state.toolState.currentTool}
              isPencilMode={state.toolState.isPencilMode}
              onToolChange={setCurrentTool}
              onPencilModeToggle={togglePencilMode}
            />

            <ControlBar
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onSave={handleSave}
              onLoad={handleLoad}
              onExport={handleExport}
              onReset={reset}
              gameName={config.metadata.name}
            />
          </div>

          {/* Center - Sheet */}
          <div className="flex justify-center">
            <Sheet
              sheet={currentSheet}
              marks={currentSheetState.marks}
              selectedHotspotId={selectedHotspotId}
              onHotspotClick={handleHotspotClick}
            />
          </div>

          {/* Right sidebar - Dice and Cards */}
          <div className="space-y-4">
            {/* Dice pools */}
            {state.dicePools?.map((pool) => (
              <DicePool
                key={pool.id}
                pool={pool}
                onRoll={rollPool}
                onLockToggle={toggleDieLock}
                onRerollDie={rollSingleDie}
              />
            ))}

            {/* Card decks */}
            {state.deckStates?.map((deckState) => (
              <Deck
                key={deckState.deckId}
                deckState={deckState}
                cardDefinitions={config.cards?.cardDefinitions || []}
                onDraw={drawCard}
                onShuffle={(deckId) => shufflePile(deckId, 'draw')}
                onReshuffleDiscard={reshuffleDiscard}
              />
            ))}
          </div>
        </div>

        {/* Value picker modal */}
        {showValuePicker && (
          <ValuePicker
            tool={state.toolState.currentTool}
            onSelect={handleValueSelect}
            onCancel={() => {
              setShowValuePicker(false);
              setPendingHotspotId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
