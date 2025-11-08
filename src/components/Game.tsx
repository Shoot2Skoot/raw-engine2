/**
 * Main Game Component
 *
 * Orchestrates the entire game UI
 */

import { SheetRenderer } from './SheetRenderer';
import { ToolPalette } from './ToolPalette';
import { DiceRoller } from './DiceRoller';
import { GameControls } from './GameControls';
import { useGameState } from '../hooks/useGameState';

export function Game() {
  const { state } = useGameState();

  const activeSheet = state.sheets.find(s => s.id === state.activeSheetId);

  if (!activeSheet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Active Sheet</h1>
          <p className="text-gray-600">Unable to find the active sheet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">{state.name}</h1>
          <p className="text-sm text-gray-600">Roll-and-Write Game Engine</p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Left side: Sheet */}
          <div className="flex flex-col gap-4">
            {/* Sheet tabs (if multiple sheets) */}
            {state.sheets.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2 overflow-x-auto">
                {state.sheets.map(sheet => (
                  <button
                    key={sheet.id}
                    onClick={() => {
                      // TODO: Switch active sheet
                    }}
                    className={`
                      px-4 py-2 rounded-md whitespace-nowrap transition-all text-sm font-medium
                      ${
                        sheet.id === state.activeSheetId
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

            {/* Sheet renderer */}
            <div className="flex justify-center">
              <SheetRenderer sheet={activeSheet} />
            </div>
          </div>

          {/* Right sidebar: Tools and controls */}
          <div className="flex flex-col gap-4">
            {/* Tool palette */}
            <ToolPalette />

            {/* Dice pools */}
            {state.dicePools?.map(pool => (
              <DiceRoller key={pool.id} pool={pool} />
            ))}

            {/* Game controls */}
            <GameControls />
          </div>
        </div>
      </div>
    </div>
  );
}
