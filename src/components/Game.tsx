/**
 * Main Game Component - integrates all game systems
 */

import { useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { useGameActions } from '../hooks/useGameActions';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { Hotspot, Mark } from '../types';
import { saveToFile, loadFromFile } from '../types';
import { SheetRenderer } from './sheet';
import { DicePool } from './dice/DicePool';
import { ToolPalette } from './ui/ToolPalette';
import { GameControls } from './ui/GameControls';

export function Game() {
  const { state, canUndo, canRedo } = useGameContext();
  const {
    placeMark,
    removeMark,
    rollDicePool,
    rerollDicePool,
    toggleDieLock,
    switchSheet,
    selectTool,
    toggleMarkMode,
    undo,
    redo,
    reset,
  } = useGameActions();

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle hotspot click - place or remove mark based on current tool
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      const currentSheet = state.sheets[state.activeSheetIndex];
      const hotspotState = currentSheet.hotspots.get(hotspot.id);

      if (!hotspotState) return;

      const currentTool = state.tools.currentTool;

      // Eraser tool - remove last mark
      if (currentTool.type === 'eraser') {
        if (hotspotState.marks.length > 0) {
          const lastMark = hotspotState.marks[hotspotState.marks.length - 1];
          removeMark(currentSheet.sheet.id, hotspot.id, lastMark.id);
        }
        return;
      }

      // Select tool - just for selection, no marking
      if (currentTool.type === 'select') {
        return;
      }

      // Check if this mark type is allowed (currentTool.type is now guaranteed to be a MarkType)
      if (!hotspot.allowedMarkTypes.includes(currentTool.type as any)) {
        console.warn(
          `Mark type ${currentTool.type} not allowed on this hotspot`
        );
        return;
      }

      // Check max marks limit
      if (
        hotspot.maxMarks !== undefined &&
        hotspotState.marks.length >= hotspot.maxMarks
      ) {
        console.warn('Maximum marks reached for this hotspot');
        return;
      }

      // Create mark based on tool type
      const baseMark = {
        id: `${hotspot.id}-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        mode: state.tools.markMode,
      };

      let mark: Mark | null = null;

      switch (currentTool.type) {
        case 'checkbox':
          mark = {
            ...baseMark,
            type: 'checkbox',
            state: 'empty',
          };
          break;

        case 'number':
          // For demo, just use a random number 1-6
          // In real game, would show number input
          mark = {
            ...baseMark,
            type: 'number',
            value: Math.floor(Math.random() * 6) + 1,
          };
          break;

        case 'color':
          // Use first color from palette
          const colors = currentTool.settings?.colorPalette || ['#3B82F6'];
          mark = {
            ...baseMark,
            type: 'color',
            color: colors[0],
            opacity: 0.5,
          };
          break;

        case 'circle':
          mark = {
            ...baseMark,
            type: 'circle',
            state: 'empty',
          };
          break;

        case 'symbol':
          // Use first symbol from palette
          const symbols = currentTool.settings?.symbolPalette || ['star'];
          mark = {
            ...baseMark,
            type: 'symbol',
            symbol: symbols[0],
          };
          break;

        case 'text':
          mark = {
            ...baseMark,
            type: 'text',
            text: 'Text',
          };
          break;
      }

      if (mark) {
        placeMark(currentSheet.sheet.id, hotspot.id, mark);
      }
    },
    [state, placeMark, removeMark]
  );

  // Save game to file
  const handleSave = useCallback(() => {
    saveToFile(state);
  }, [state]);

  // Load game from file
  const handleLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loadedState = await loadFromFile(file);
      // TODO: dispatch SET_STATE action to load the game
      console.log('Loaded state:', loadedState);
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentSheet = state.sheets[state.activeSheetIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {state.config.name}
          </h1>
          <p className="text-sm text-gray-600">
            Version {state.config.version}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main sheet area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sheet tabs */}
            {state.sheets.length > 1 && (
              <div className="bg-white rounded-lg shadow-md p-2 flex gap-2 overflow-x-auto">
                {state.sheets.map((sheet, index) => (
                  <button
                    key={sheet.sheet.id}
                    onClick={() => switchSheet(index)}
                    className={`px-4 py-2 rounded font-medium whitespace-nowrap transition-colors ${
                      index === state.activeSheetIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sheet.sheet.name}
                  </button>
                ))}
              </div>
            )}

            {/* Sheet renderer */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="overflow-auto">
                <SheetRenderer
                  sheetState={currentSheet}
                  onHotspotClick={handleHotspotClick}
                  showDebug={false}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game Controls */}
            <GameControls
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onReset={reset}
              onSave={handleSave}
              onLoad={handleLoad}
            />

            {/* Tool Palette */}
            <ToolPalette
              toolState={state.tools}
              onSelectTool={selectTool}
              onToggleMode={toggleMarkMode}
            />

            {/* Dice Pools */}
            {state.dicePools.map((poolState) => (
              <DicePool
                key={poolState.pool.id}
                poolState={poolState}
                onRoll={() => rollDicePool(poolState.pool.id)}
                onReroll={() => rerollDicePool(poolState.pool.id)}
                onToggleLock={(index) =>
                  toggleDieLock(poolState.pool.id, index)
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file input for loading games */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
