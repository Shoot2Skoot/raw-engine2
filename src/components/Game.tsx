import React, { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useGame, useGameState, useGameDispatch } from '../contexts/GameContext';
import { Sheet } from './sheet/Sheet';
import { ToolPalette } from './ui/ToolPalette';
import { DicePanel } from './dice/DicePanel';
import { Tool, Mark } from '../types';
import { rollDice, rerollDice } from '../lib/diceRoller';

/**
 * Main game component
 */
export function Game() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  // Get current sheet
  const currentSheet = state.sheets.find(s => s.id === state.activeSheetId);
  const currentMarks = state.marks[state.activeSheetId] || [];

  // Handle hotspot click to place marks
  const handleHotspotClick = useCallback((hotspotId: string) => {
    const tool = state.currentTool;

    // Don't place marks with erase tool
    if (tool.type === 'erase') {
      // Find and remove the most recent mark from this hotspot
      const marksAtHotspot = currentMarks.filter(m => m.hotspotId === hotspotId);
      if (marksAtHotspot.length > 0) {
        const lastMark = marksAtHotspot[marksAtHotspot.length - 1];
        dispatch({ type: 'REMOVE_MARK', markId: lastMark.id });
      }
      return;
    }

    // Create mark based on tool type
    let mark: Mark | null = null;
    const baseMark = {
      id: nanoid(),
      hotspotId,
      permanence: tool.permanence,
      timestamp: Date.now(),
    };

    switch (tool.type) {
      case 'checkbox':
        mark = {
          ...baseMark,
          type: 'checkbox',
          state: 'checked',
        } as Mark;
        break;

      case 'number':
        mark = {
          ...baseMark,
          type: 'number',
          value: tool.numberValue || 0,
        } as Mark;
        break;

      case 'color':
        mark = {
          ...baseMark,
          type: 'color',
          color: tool.color || '#3b82f6',
          opacity: 50,
        } as Mark;
        break;

      case 'circle':
        mark = {
          ...baseMark,
          type: 'circle',
          state: 'full',
        } as Mark;
        break;

      case 'text':
        // TODO: Show text input dialog
        mark = {
          ...baseMark,
          type: 'text',
          text: 'Text',
        } as Mark;
        break;
    }

    if (mark) {
      dispatch({ type: 'PLACE_MARK', mark });
    }
  }, [state.currentTool, currentMarks, dispatch]);

  // Handle tool changes
  const handleToolChange = useCallback((changes: Partial<Tool>) => {
    // TODO: Update current tool in state
    // For now, this is a placeholder
    console.log('Tool change:', changes);
  }, []);

  // Handle dice rolling
  const handleRollDice = useCallback((poolId: string) => {
    const pool = state.dice.pools.find(p => p.id === poolId);
    if (!pool) return;

    const results = pool.results
      ? rerollDice(pool.dice, pool.results)
      : rollDice(pool.dice);

    dispatch({ type: 'ROLL_DICE', poolId, results });
  }, [state.dice.pools, dispatch]);

  const handleLockDie = useCallback((poolId: string, index: number) => {
    dispatch({ type: 'LOCK_DIE', poolId, dieIndex: index });
  }, [dispatch]);

  const handleUnlockDie = useCallback((poolId: string, index: number) => {
    dispatch({ type: 'UNLOCK_DIE', poolId, dieIndex: index });
  }, [dispatch]);

  if (!currentSheet) {
    return <div>No sheet selected</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - Tools */}
      <div className="w-64 p-4 bg-gray-50 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{state.metadata.name}</h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tools</h3>
          <ToolPalette
            currentTool={state.currentTool}
            onToolChange={handleToolChange}
          />
        </div>

        {/* Dice panels */}
        {state.dice.pools.map(pool => (
          <div key={pool.id} className="mb-4">
            <DicePanel
              pool={pool}
              onRoll={() => handleRollDice(pool.id)}
              onLockDie={(index) => handleLockDie(pool.id, index)}
              onUnlockDie={(index) => handleUnlockDie(pool.id, index)}
            />
          </div>
        ))}
      </div>

      {/* Main area - Sheet */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-center">
          <Sheet
            sheet={currentSheet}
            marks={currentMarks}
            debugMode={state.ui.debugMode}
            onHotspotClick={handleHotspotClick}
          />
        </div>
      </div>
    </div>
  );
}
