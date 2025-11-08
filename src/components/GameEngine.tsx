import { useState, useCallback, useEffect } from 'react';
import { Undo2, Redo2, RotateCcw, Download } from 'lucide-react';
import type { GameConfig, MarkType, CheckboxState, CircleState } from '../types';
import { useGameState } from '../hooks/useGameState';
import { SheetRenderer } from './Sheet/SheetRenderer';
import { ToolPalette } from './Tools/ToolPalette';
import { NumberInput } from './Tools/NumberInput';
import { ColorPicker } from './Tools/ColorPicker';
import { DicePoolComponent } from './Dice/DicePool';
import { DeckDisplay } from './Cards/DeckDisplay';
import { generateId } from '../utils/helpers';

interface GameEngineProps {
  config: GameConfig;
}

const DEFAULT_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#000000', // black
];

export function GameEngine({ config }: GameEngineProps) {
  const {
    gameState,
    setCurrentSheet,
    addMark,
    removeMark,
    updateMark,
    getMarksForHotspot,
    rollDice,
    toggleDieLock,
    shuffleDeck,
    drawCard,
    discardCurrentCard,
    undo,
    redo,
    canUndo,
    canRedo,
    saveGame,
    resetGame,
  } = useGameState(config);

  const [selectedTool, setSelectedTool] = useState<MarkType | 'erase'>('checkbox');
  const [markStyle, setMarkStyle] = useState<'pencil' | 'pen'>('pen');
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingHotspotId, setPendingHotspotId] = useState<string | undefined>();

  const currentSheet = gameState.sheets.find((s) => s.id === gameState.currentSheetId);
  const currentMarks = gameState.marks[gameState.currentSheetId] || [];

  const colors = config.colorPalette || DEFAULT_COLORS;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
      // Tool shortcuts
      else if (e.key === 'c') setSelectedTool('checkbox');
      else if (e.key === 'n') setSelectedTool('number');
      else if (e.key === 'f') setSelectedTool('color');
      else if (e.key === 'o') setSelectedTool('circle');
      else if (e.key === 't') setSelectedTool('text');
      else if (e.key === 'e') setSelectedTool('erase');
      // Style toggle
      else if (e.key === 'p') setMarkStyle((prev) => (prev === 'pen' ? 'pencil' : 'pen'));
      // Sheet navigation (1-9)
      else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (gameState.sheets[index]) {
          setCurrentSheet(gameState.sheets[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setCurrentSheet, gameState.sheets]);

  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      if (selectedTool === 'erase') {
        // Remove all marks from this hotspot
        const marks = getMarksForHotspot(gameState.currentSheetId, hotspotId);
        marks.forEach((mark) => removeMark(gameState.currentSheetId, mark.id));
        return;
      }

      if (selectedTool === 'number') {
        setPendingHotspotId(hotspotId);
        setShowNumberInput(true);
        return;
      }

      if (selectedTool === 'color') {
        setPendingHotspotId(hotspotId);
        setShowColorPicker(true);
        return;
      }

      // For checkbox and circle, cycle through states
      if (selectedTool === 'checkbox') {
        const existingMarks = getMarksForHotspot(gameState.currentSheetId, hotspotId);
        const checkboxMark = existingMarks.find((m) => m.type === 'checkbox');

        if (checkboxMark && checkboxMark.type === 'checkbox') {
          // Cycle through states
          const states: CheckboxState[] = ['empty', 'checked', 'crossed'];
          const currentIndex = states.indexOf(checkboxMark.state);
          const nextState = states[(currentIndex + 1) % states.length];

          if (nextState === 'empty') {
            removeMark(gameState.currentSheetId, checkboxMark.id);
          } else {
            updateMark(gameState.currentSheetId, checkboxMark.id, { state: nextState });
          }
        } else {
          // Add new checkbox
          addMark(gameState.currentSheetId, {
            id: generateId(),
            type: 'checkbox',
            hotspotId,
            style: markStyle,
            timestamp: Date.now(),
            state: 'checked',
          });
        }
        return;
      }

      if (selectedTool === 'circle') {
        const existingMarks = getMarksForHotspot(gameState.currentSheetId, hotspotId);
        const circleMark = existingMarks.find((m) => m.type === 'circle');

        if (circleMark && circleMark.type === 'circle') {
          // Cycle through states
          const states: CircleState[] = ['empty', 'half', 'full'];
          const currentIndex = states.indexOf(circleMark.state);
          const nextState = states[(currentIndex + 1) % states.length];

          if (nextState === 'empty') {
            removeMark(gameState.currentSheetId, circleMark.id);
          } else {
            updateMark(gameState.currentSheetId, circleMark.id, { state: nextState });
          }
        } else {
          // Add new circle
          addMark(gameState.currentSheetId, {
            id: generateId(),
            type: 'circle',
            hotspotId,
            style: markStyle,
            timestamp: Date.now(),
            state: 'half',
          });
        }
        return;
      }
    },
    [
      selectedTool,
      markStyle,
      gameState.currentSheetId,
      getMarksForHotspot,
      addMark,
      removeMark,
      updateMark,
    ]
  );

  const handleNumberSubmit = useCallback(
    (value: number) => {
      if (pendingHotspotId) {
        // Remove existing number marks
        const existingMarks = getMarksForHotspot(gameState.currentSheetId, pendingHotspotId);
        existingMarks.filter((m) => m.type === 'number').forEach((m) => {
          removeMark(gameState.currentSheetId, m.id);
        });

        // Add new number mark
        addMark(gameState.currentSheetId, {
          id: generateId(),
          type: 'number',
          hotspotId: pendingHotspotId,
          style: markStyle,
          timestamp: Date.now(),
          value,
        });
      }
      setShowNumberInput(false);
      setPendingHotspotId(undefined);
    },
    [pendingHotspotId, gameState.currentSheetId, markStyle, addMark, removeMark, getMarksForHotspot]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      if (pendingHotspotId) {
        // Remove existing color marks
        const existingMarks = getMarksForHotspot(gameState.currentSheetId, pendingHotspotId);
        existingMarks.filter((m) => m.type === 'color').forEach((m) => {
          removeMark(gameState.currentSheetId, m.id);
        });

        // Add new color mark
        addMark(gameState.currentSheetId, {
          id: generateId(),
          type: 'color',
          hotspotId: pendingHotspotId,
          style: markStyle,
          timestamp: Date.now(),
          color,
        });
      }
      setShowColorPicker(false);
      setPendingHotspotId(undefined);
    },
    [pendingHotspotId, gameState.currentSheetId, markStyle, addMark, removeMark, getMarksForHotspot]
  );

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      resetGame();
    }
  }, [resetGame]);

  if (!currentSheet) {
    return <div className="p-8 text-center">No sheets configured</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">{gameState.gameName}</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={20} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={20} />
            </button>
            <button
              onClick={saveGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              title="Save game"
            >
              <Download size={20} />
              Save
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Reset game"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Sheet tabs */}
        {gameState.sheets.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {gameState.sheets.map((sheet, index) => (
              <button
                key={sheet.id}
                onClick={() => setCurrentSheet(sheet.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  sheet.id === gameState.currentSheetId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {sheet.name} ({index + 1})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main sheet area */}
        <div className="lg:col-span-3">
          <SheetRenderer
            sheet={currentSheet}
            marks={currentMarks}
            onHotspotClick={handleHotspotClick}
            
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ToolPalette
            selectedTool={selectedTool}
            markStyle={markStyle}
            onToolSelect={setSelectedTool}
            onMarkStyleToggle={() => setMarkStyle((prev) => (prev === 'pen' ? 'pencil' : 'pen'))}
          />

          {/* Dice pools */}
          {gameState.dicePools.map((pool) => (
            <DicePoolComponent
              key={pool.id}
              pool={pool}
              onRoll={() => rollDice(pool.id)}
              onToggleLock={(dieId) => toggleDieLock(pool.id, dieId)}
            />
          ))}

          {/* Decks */}
          {gameState.decks.map((deck) => (
            <DeckDisplay
              key={deck.id}
              deck={deck}
              onShuffle={() => shuffleDeck(deck.id)}
              onDraw={() => drawCard(deck.id)}
              onDiscard={() => discardCurrentCard(deck.id)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showNumberInput && (
        <NumberInput
          onSubmit={handleNumberSubmit}
          onCancel={() => {
            setShowNumberInput(false);
            setPendingHotspotId(undefined);
          }}
        />
      )}

      {showColorPicker && (
        <ColorPicker
          colors={colors}
          onSelect={handleColorSelect}
          onCancel={() => {
            setShowColorPicker(false);
            setPendingHotspotId(undefined);
          }}
        />
      )}
    </div>
  );
}
