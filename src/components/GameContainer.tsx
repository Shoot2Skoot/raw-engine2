import { useEffect } from 'react';
import type { GameConfig } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import { Sheet } from './sheet/Sheet';
import { DicePool } from './dice/DicePool';
import { ToolPalette } from './ui/ToolPalette';
import { Save, RotateCcw } from 'lucide-react';

interface GameContainerProps {
  config: GameConfig;
}

export function GameContainer({ config }: GameContainerProps) {
  const engine = useGameEngine(config);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        engine.undo();
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        engine.redo();
      }

      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        engine.saveGame();
      }

      // Number keys 1-9 for tool selection
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const tool = config.toolPalette.availableTools[index];
        if (tool) {
          engine.setSelectedTool(tool);
        }
      }

      // Escape to deselect tool
      if (e.key === 'Escape') {
        engine.setSelectedTool(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, config.toolPalette.availableTools]);

  const currentSheetState = engine.gameState.sheets.find(
    (s) => s.sheetId === engine.gameState.currentSheetId
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => engine.saveGame()}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Save size={18} />
              Save Game
            </button>

            <button
              onClick={() => engine.resetGame()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/* Sheet tabs */}
        {config.sheets.length > 1 && (
          <div className="flex gap-2 mt-4">
            {config.sheets.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => engine.setCurrentSheet(sheet.id)}
                className={`
                  px-4 py-2 rounded transition-colors
                  ${
                    engine.gameState.currentSheetId === sheet.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="flex gap-6">
        {/* Left sidebar - Tools and controls */}
        <aside className="w-64 flex-shrink-0 space-y-4">
          <ToolPalette
            availableTools={config.toolPalette.availableTools}
            selectedTool={engine.gameState.selectedTool}
            onSelectTool={engine.setSelectedTool}
            onUndo={engine.undo}
            onRedo={engine.redo}
            canUndo={engine.canUndo}
            canRedo={engine.canRedo}
          />

          {/* Dice pools */}
          {engine.gameState.dicePools.map((pool) => (
            <DicePool
              key={pool.id}
              pool={pool}
              dieDefinitions={config.diceDefinitions}
              onRoll={(diceIds) => engine.rollDicePool(pool.id, diceIds)}
              onLockDie={(dieId, locked) => engine.lockDie(pool.id, dieId, locked)}
            />
          ))}
        </aside>

        {/* Main content - Sheet */}
        <main className="flex-1">
          {engine.currentSheet && currentSheetState && (
            <Sheet
              sheet={engine.currentSheet}
              marks={currentSheetState.marks}
              selectedTool={engine.gameState.selectedTool}
              onPlaceMark={(mark) =>
                engine.placeMark(engine.currentSheet!.id, mark)
              }
              onRemoveMark={(markId) =>
                engine.removeMark(engine.currentSheet!.id, markId)
              }
            />
          )}
        </main>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600 border border-gray-300">
        <div className="font-bold mb-1">Keyboard Shortcuts</div>
        <div>Ctrl/Cmd + Z: Undo</div>
        <div>Ctrl/Cmd + Shift + Z: Redo</div>
        <div>Ctrl/Cmd + S: Save</div>
        <div>1-9: Select tool</div>
        <div>Esc: Deselect tool</div>
      </div>
    </div>
  );
}
