/**
 * Main game engine component - orchestrates all game systems
 */

import { useEffect } from 'react';
import type { GameConfig } from '../types';
import { useGameState } from '../hooks/useGameState';
import { SheetRenderer } from './SheetRenderer';
import { ToolPalette } from './ToolPalette';
import { ControlPanel } from './ControlPanel';

interface GameEngineProps {
  config: GameConfig;
}

export function GameEngine({ config }: GameEngineProps) {
  const {
    state,
    currentSheet,
    switchSheet,
    switchTool,
    handleHotspotClick,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useGameState(config);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Shift+Z (or Cmd+Shift+Z on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }

      // Tool shortcuts (1-9 for first 9 tools)
      const digit = parseInt(e.key);
      if (digit >= 1 && digit <= 9 && digit <= config.tools.length) {
        const tool = config.tools[digit - 1];
        if (tool) {
          switchTool(tool);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, config.tools, switchTool]);

  const handleSave = () => {
    const saveData = {
      config: state.config,
      state: {
        currentSheetId: state.currentSheetId,
        currentToolType: state.currentTool.type,
        sheets: state.config.sheets.map((sheet) => ({
          id: sheet.id,
          hotspots: sheet.hotspots.map((h) => ({
            id: h.id,
            marks: h.marks,
          })),
        })),
      },
      metadata: {
        version: '1.0.0',
        timestamp: Date.now(),
        gameName: config.name,
      },
    };

    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentSheet) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-red-500 text-lg">No sheet available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
        {config.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </div>

      {/* Control panel */}
      <ControlPanel
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
        onSave={handleSave}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tool palette */}
        <ToolPalette
          tools={config.tools}
          currentTool={state.currentTool}
          onSelectTool={switchTool}
        />

        {/* Sheet area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sheet tabs (if multiple sheets) */}
          {config.sheets.length > 1 && (
            <div className="bg-white border-b border-gray-200 px-4 flex gap-2">
              {config.sheets.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => switchSheet(sheet.id)}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors
                    ${
                      sheet.id === state.currentSheetId
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          )}

          {/* Sheet renderer */}
          <div className="flex-1 overflow-auto">
            <SheetRenderer
              sheet={currentSheet}
              onHotspotClick={handleHotspotClick}
            />
          </div>
        </div>
      </div>

      {/* Footer with help text */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 text-xs text-gray-500">
        <span className="font-medium">Tips:</span> Use 1-9 keys to switch tools • Ctrl+Z to undo • Ctrl+Shift+Z to redo
      </div>
    </div>
  );
}
