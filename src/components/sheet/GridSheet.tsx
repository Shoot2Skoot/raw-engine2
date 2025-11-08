/**
 * Grid Sheet Component - Renders grid-based sheet layouts
 */

import { useCallback, useMemo } from 'react';
import type { GridLayout, CheckboxState, CircleState } from '../../types';
import { useGameEngine, useSheetMarks } from '../../core/GameEngine';
import { MarkRenderer } from '../marks/MarkRenderer';

interface GridSheetProps {
  sheetId: string;
  layout: GridLayout;
}

export function GridSheet({ sheetId, layout }: GridSheetProps) {
  const { state, addMark } = useGameEngine();
  const marks = useSheetMarks(sheetId);

  const cellSize = layout.cellSize || { width: 60, height: 60 };
  const gap = layout.gap || 4;
  const offset = layout.offset || { x: 0, y: 0 };

  // Generate grid cells
  const cells = useMemo(() => {
    const generatedCells = [];
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const customCell = layout.cells?.find(
          (c) => c.row === row && c.col === col
        );

        generatedCells.push({
          row,
          col,
          id: `${sheetId}_cell_${row}_${col}`,
          allowedMarkTypes:
            customCell?.allowedMarkTypes || layout.defaultAllowedMarkTypes,
          isDisabled: customCell?.isDisabled || false,
          label: customCell?.label,
          metadata: customCell?.metadata,
        });
      }
    }
    return generatedCells;
  }, [layout, sheetId]);

  const handleCellClick = useCallback(
    (cellId: string) => {
      const cell = cells.find((c) => c.id === cellId);
      if (!cell || cell.isDisabled) return;

      const tool = state.currentTool;
      const existingMarks = marks.filter((m) => m.hotspotId === cellId);

      // Check if tool type is allowed
      if (!cell.allowedMarkTypes.includes(tool.type)) {
        console.warn(`Mark type ${tool.type} not allowed in this cell`);
        return;
      }

      // Handle different mark types
      if (tool.type === 'checkbox') {
        const existingCheckbox = existingMarks.find((m) => m.type === 'checkbox');
        if (existingCheckbox) {
          // Cycle through states
          const states: CheckboxState[] = ['empty', 'checked', 'crossed'];
          const currentIndex = states.indexOf(
            (existingCheckbox as any).state
          );
          const nextState = states[(currentIndex + 1) % states.length];

          addMark(sheetId, {
            type: 'checkbox',
            hotspotId: cellId,
            state: nextState,
          } as any);
        } else {
          addMark(sheetId, {
            type: 'checkbox',
            hotspotId: cellId,
            state: 'checked',
          } as any);
        }
      } else if (tool.type === 'number') {
        // Prompt for number input (simplified - in production use a modal/input)
        const value = prompt('Enter number:');
        if (value !== null) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            addMark(sheetId, {
              type: 'number',
              hotspotId: cellId,
              value: numValue,
            } as any);
          }
        }
      } else if (tool.type === 'color') {
        const color = (tool.config as any)?.color || '#3b82f6';
        addMark(sheetId, {
          type: 'color',
          hotspotId: cellId,
          color,
          opacity: 0.5,
        } as any);
      } else if (tool.type === 'circle') {
        const existingCircle = existingMarks.find((m) => m.type === 'circle');
        if (existingCircle) {
          const states: CircleState[] = ['empty', 'half', 'full'];
          const currentIndex = states.indexOf((existingCircle as any).state);
          const nextState = states[(currentIndex + 1) % states.length];

          addMark(sheetId, {
            type: 'circle',
            hotspotId: cellId,
            state: nextState,
          } as any);
        } else {
          addMark(sheetId, {
            type: 'circle',
            hotspotId: cellId,
            state: 'half',
          } as any);
        }
      } else if (tool.type === 'symbol') {
        const symbol = (tool.config as any)?.symbol || '⭐';
        addMark(sheetId, {
          type: 'symbol',
          hotspotId: cellId,
          symbol,
        } as any);
      } else if (tool.type === 'text') {
        const text = prompt('Enter text:');
        if (text !== null) {
          addMark(sheetId, {
            type: 'text',
            hotspotId: cellId,
            text,
          } as any);
        }
      }
    },
    [cells, state.currentTool, marks, addMark, sheetId]
  );

  return (
    <div
      className="relative game-sheet"
      style={{
        width: `${layout.cols * cellSize.width + (layout.cols - 1) * gap}px`,
        height: `${layout.rows * cellSize.height + (layout.rows - 1) * gap}px`,
        backgroundColor: layout.backgroundColor || 'transparent',
      }}
    >
      {cells.map((cell) => {
        const x = offset.x + cell.col * (cellSize.width + gap);
        const y = offset.y + cell.row * (cellSize.height + gap);
        const cellMarks = marks.filter((m) => m.hotspotId === cell.id);

        return (
          <div
            key={cell.id}
            className={`absolute border-2 transition-all ${
              cell.isDisabled
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : 'border-gray-400 bg-white hover:border-blue-500 hover:bg-blue-50 cursor-pointer hotspot'
            }`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${cellSize.width}px`,
              height: `${cellSize.height}px`,
            }}
            onClick={() => handleCellClick(cell.id)}
          >
            {cell.label && (
              <div className="absolute top-0 left-0 text-xs text-gray-500 px-1">
                {cell.label}
              </div>
            )}
            {cellMarks.map((mark) => (
              <MarkRenderer
                key={mark.id}
                mark={mark}
                size={Math.min(cellSize.width, cellSize.height)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
