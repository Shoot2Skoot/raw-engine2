/**
 * Game Component
 * Main game container that orchestrates all components
 */

import React, { useCallback, useEffect } from 'react';
import { GameConfig, NumberMark } from '../types';
import { useGameState } from '../engine/state/useGameState';
import { SheetRenderer } from './sheets/SheetRenderer';
import { Toolbar } from './ui/Toolbar';
import { DiceDisplay } from './dice/DiceDisplay';
import { rollDice, lockDie, unlockDie } from '../engine/dice/diceEngine';

interface GameProps {
  config: GameConfig;
}

export const Game: React.FC<GameProps> = ({ config }) => {
  const {
    state,
    setState,
    addMark,
    removeMarksFromHotspot,
    selectTool,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useGameState(config);

  // Get current sheet
  const currentSheet = config.sheets.find(
    (s) => s.id === state.currentSheetId
  );

  // Handle hotspot click
  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      const hotspot = currentSheet?.hotspots.find((h) => h.id === hotspotId);
      if (!hotspot) return;

      if (state.selectedTool.type === 'eraser') {
        // Remove marks from hotspot
        removeMarksFromHotspot(hotspotId);
      } else if (state.selectedTool.type === 'number') {
        // Prompt for number
        const value = prompt('Enter a number:');
        if (value) {
          const numberValue = parseInt(value, 10);
          if (!isNaN(numberValue)) {
            const mark: NumberMark = {
              type: 'number',
              value: numberValue,
              isPermanent: state.selectedTool.isPermanent,
            };
            addMark(hotspotId, mark);
          }
        }
      }
    },
    [currentSheet, state.selectedTool, addMark, removeMarksFromHotspot]
  );

  // Handle dice roll
  const handleDiceRoll = useCallback(() => {
    setState((current) => {
      const newState = { ...current };
      const pool = newState.dicePools[0];
      if (!pool) return current;

      const diceConfigs = config.dicePools?.[0]?.diceConfigs ?? [];
      const results = rollDice(pool.dice, diceConfigs);

      // Update roll history
      pool.rollHistory = [...pool.rollHistory, results];

      return newState;
    });
  }, [config.dicePools, setState]);

  // Handle die lock
  const handleDieLock = useCallback(
    (dieId: string) => {
      setState((current) => {
        const newState = { ...current };
        const pool = newState.dicePools[0];
        if (!pool) return current;

        const die = pool.dice.find((d) => d.id === dieId);
        if (die) {
          lockDie(die);
        }

        return newState;
      });
    },
    [setState]
  );

  // Handle die unlock
  const handleDieUnlock = useCallback(
    (dieId: string) => {
      setState((current) => {
        const newState = { ...current };
        const pool = newState.dicePools[0];
        if (!pool) return current;

        const die = pool.dice.find((d) => d.id === dieId);
        if (die) {
          unlockDie(die);
        }

        return newState;
      });
    },
    [setState]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Handle reset with confirmation
  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      reset();
    }
  }, [reset]);

  if (!currentSheet) {
    return <div>No sheet found</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <Toolbar
        tools={config.tools}
        selectedTool={state.selectedTool}
        onToolSelect={selectTool}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={handleReset}
      />

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4 overflow-auto">
        {/* Sheet */}
        <div className="flex-shrink-0">
          <SheetRenderer
            sheet={currentSheet}
            marks={state.marks}
            onHotspotClick={handleHotspotClick}
          />
        </div>

        {/* Side panel */}
        <div className="flex-shrink-0 space-y-4">
          {/* Dice */}
          {state.dicePools.length > 0 && (
            <DiceDisplay
              pool={state.dicePools[0]}
              configs={config.dicePools?.[0]?.diceConfigs ?? []}
              onRoll={handleDiceRoll}
              onLock={handleDieLock}
              onUnlock={handleDieUnlock}
            />
          )}
        </div>
      </div>
    </div>
  );
};
