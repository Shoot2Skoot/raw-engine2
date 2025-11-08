/**
 * Main game application component
 */

import { useCallback } from 'react';
import type { GameConfig } from '../types';
import { GameProvider, useGame, useCurrentSheet, useCurrentSheetState } from '../state/GameContext';
import { Sheet } from './sheet/Sheet';
import { ToolPalette } from './ui/ToolPalette';
import { Controls } from './ui/Controls';
import { DicePool } from './dice/DicePool';
import { CardDeck } from './cards/CardDeck';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import {
  createCheckboxMark,
  createNumberMark,
  createColorMark,
  createCircleMark,
  createSymbolMark,
  createTextMark,
  cycleCheckboxState,
  cycleCircleState,
} from '../utils/marks';

interface GameAppContentProps {
  config: GameConfig;
}

function GameAppContent({ config }: GameAppContentProps) {
  const { state, dispatch } = useGame();
  const currentSheet = useCurrentSheet();
  const currentSheetState = useCurrentSheetState();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      const existingMarks = currentSheetState.marks.get(hotspotId) || [];

      // Handle different mark types based on selected tool
      switch (state.selectedTool) {
        case 'checkbox': {
          // Cycle checkbox states or add new checkbox
          const lastCheckbox = existingMarks
            .filter(m => m.type === 'checkbox')
            .pop();

          if (lastCheckbox && lastCheckbox.type === 'checkbox') {
            const newState = cycleCheckboxState(lastCheckbox.state);
            if (newState === 'empty') {
              // Remove checkbox when cycling back to empty
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: lastCheckbox.id,
              });
            } else {
              // Update checkbox state
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: lastCheckbox.id,
              });
              dispatch({
                type: 'PLACE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                mark: createCheckboxMark(newState, state.permanence),
              });
            }
          } else {
            // Create new checkbox
            dispatch({
              type: 'PLACE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              mark: createCheckboxMark('checked', state.permanence),
            });
          }
          break;
        }

        case 'number': {
          // Prompt for number
          const value = prompt('Enter a number:');
          if (value !== null && !isNaN(Number(value))) {
            // Remove existing number marks first
            existingMarks.filter(m => m.type === 'number').forEach(mark => {
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: mark.id,
              });
            });

            // Add new number
            dispatch({
              type: 'PLACE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              mark: createNumberMark(Number(value), state.permanence),
            });
          }
          break;
        }

        case 'color': {
          const color = state.selectedColor || '#3b82f6';

          // Remove existing color marks first
          existingMarks.filter(m => m.type === 'color').forEach(mark => {
            dispatch({
              type: 'REMOVE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              markId: mark.id,
            });
          });

          // Add color mark
          dispatch({
            type: 'PLACE_MARK',
            sheetId: currentSheet.id,
            hotspotId,
            mark: createColorMark(color, 0.5, state.permanence),
          });
          break;
        }

        case 'circle': {
          // Cycle circle states
          const lastCircle = existingMarks
            .filter(m => m.type === 'circle')
            .pop();

          if (lastCircle && lastCircle.type === 'circle') {
            const newState = cycleCircleState(lastCircle.state);
            if (newState === 'empty') {
              // Remove when cycling back to empty
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: lastCircle.id,
              });
            } else {
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: lastCircle.id,
              });
              dispatch({
                type: 'PLACE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                mark: createCircleMark(newState, state.permanence),
              });
            }
          } else {
            dispatch({
              type: 'PLACE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              mark: createCircleMark('half', state.permanence),
            });
          }
          break;
        }

        case 'symbol': {
          const symbol = state.selectedSymbol || 'star';

          // Remove existing symbol marks first
          existingMarks.filter(m => m.type === 'symbol').forEach(mark => {
            dispatch({
              type: 'REMOVE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              markId: mark.id,
            });
          });

          dispatch({
            type: 'PLACE_MARK',
            sheetId: currentSheet.id,
            hotspotId,
            mark: createSymbolMark(symbol, undefined, state.permanence),
          });
          break;
        }

        case 'text': {
          const text = prompt('Enter text:');
          if (text !== null && text.trim()) {
            // Remove existing text marks first
            existingMarks.filter(m => m.type === 'text').forEach(mark => {
              dispatch({
                type: 'REMOVE_MARK',
                sheetId: currentSheet.id,
                hotspotId,
                markId: mark.id,
              });
            });

            dispatch({
              type: 'PLACE_MARK',
              sheetId: currentSheet.id,
              hotspotId,
              mark: createTextMark(text, state.permanence),
            });
          }
          break;
        }

        default:
          break;
      }
    },
    [state.selectedTool, state.permanence, state.selectedColor, state.selectedSymbol, currentSheet.id, currentSheetState, dispatch]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
          {config.description && (
            <p className="text-gray-600 mt-1">{config.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main sheet area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sheet tabs */}
            {state.sheets.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {state.sheets.map((sheet, index) => (
                  <button
                    key={sheet.id}
                    onClick={() => dispatch({ type: 'SWITCH_SHEET', sheetIndex: index })}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      index === state.currentSheetIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {sheet.name}
                  </button>
                ))}
              </div>
            )}

            {/* Current sheet */}
            <Sheet
              sheet={currentSheet}
              sheetState={currentSheetState}
              onHotspotClick={handleHotspotClick}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <ToolPalette
              colorPalette={config.colorPalette}
              symbolSet={config.symbolSet}
            />

            <Controls />

            {/* Dice pools */}
            {state.dicePools.map(pool => (
              <DicePool key={pool.id} pool={pool} />
            ))}

            {/* Card decks */}
            {state.decks.map(deck => (
              <CardDeck key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameAppProps {
  config: GameConfig;
  autoSave?: boolean;
}

export function GameApp({ config, autoSave = true }: GameAppProps) {
  return (
    <GameProvider config={config} autoSave={autoSave}>
      <GameAppContent config={config} />
    </GameProvider>
  );
}
