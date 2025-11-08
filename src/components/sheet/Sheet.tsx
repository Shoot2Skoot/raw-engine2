/**
 * Main Sheet component - renders a game sheet with hotspots and marks
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Sheet as SheetType, Hotspot, Mark, Region } from '../../types';
import { getHotspotsFromRegion } from '../../engine/regions';
import { HotspotRenderer } from './HotspotRenderer';
import { MarkRenderer } from '../marks/MarkRenderer';
import { useGame } from '../../engine/GameContext';
import { generateId } from '../../types';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  onMarkAdd?: (mark: Mark) => void;
  onMarkRemove?: (markId: string) => void;
  isDebugMode?: boolean;
}

export function Sheet({
  sheet,
  marks,
  onMarkAdd,
  onMarkRemove,
  isDebugMode = false,
}: SheetProps) {
  const { toolState } = useGame();
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  // Collect all hotspots from all regions
  const hotspots = useMemo(() => {
    const allHotspots: Hotspot[] = [];
    for (const region of sheet.regions) {
      allHotspots.push(...getHotspotsFromRegion(region));
    }
    return allHotspots;
  }, [sheet.regions]);

  // Handle clicking on a hotspot
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      if (hotspot.readonly || !onMarkAdd) return;

      // Check if this mark type is allowed
      if (!hotspot.allowedMarkTypes.includes(toolState.currentMarkType)) {
        console.warn('Mark type not allowed on this hotspot');
        return;
      }

      // Get existing marks for this hotspot
      const existingMarks = marks.filter(m => m.hotspotId === hotspot.id);

      // Check max marks limit
      if (hotspot.maxMarks && existingMarks.length >= hotspot.maxMarks) {
        // Remove oldest mark first
        if (onMarkRemove && existingMarks.length > 0) {
          onMarkRemove(existingMarks[0].id);
        }
      }

      // Create new mark based on current tool
      const baseMark = {
        id: generateId(),
        hotspotId: hotspot.id,
        permanence: toolState.permanence,
        timestamp: Date.now(),
      };

      let newMark: Mark;

      switch (toolState.currentMarkType) {
        case 'checkbox':
          // Cycle through checkbox states if there's an existing checkbox
          const existingCheckbox = existingMarks.find(m => m.type === 'checkbox') as Extract<Mark, { type: 'checkbox' }> | undefined;
          if (existingCheckbox) {
            const states: Array<'empty' | 'checked' | 'crossed'> = ['empty', 'checked', 'crossed'];
            const currentIndex = states.indexOf(existingCheckbox.state);
            const nextState = states[(currentIndex + 1) % states.length];

            // Remove the old checkbox
            if (onMarkRemove) {
              onMarkRemove(existingCheckbox.id);
            }

            // If cycling back to empty, don't add a new mark
            if (nextState === 'empty') {
              return;
            }

            newMark = {
              ...baseMark,
              type: 'checkbox',
              state: nextState,
            };
          } else {
            newMark = {
              ...baseMark,
              type: 'checkbox',
              state: 'checked',
            };
          }
          break;

        case 'number':
          newMark = {
            ...baseMark,
            type: 'number',
            value: toolState.numberValue || 0,
          };
          break;

        case 'color':
          newMark = {
            ...baseMark,
            type: 'color',
            color: toolState.selectedColor || '#3b82f6',
          };
          break;

        case 'circle':
          // Cycle through circle states
          const existingCircle = existingMarks.find(m => m.type === 'circle') as Extract<Mark, { type: 'circle' }> | undefined;
          if (existingCircle) {
            const states: Array<'empty' | 'half' | 'full'> = ['empty', 'half', 'full'];
            const currentIndex = states.indexOf(existingCircle.state);
            const nextState = states[(currentIndex + 1) % states.length];

            if (onMarkRemove) {
              onMarkRemove(existingCircle.id);
            }

            if (nextState === 'empty') {
              return;
            }

            newMark = {
              ...baseMark,
              type: 'circle',
              state: nextState,
            };
          } else {
            newMark = {
              ...baseMark,
              type: 'circle',
              state: 'half',
            };
          }
          break;

        case 'symbol':
          newMark = {
            ...baseMark,
            type: 'symbol',
            symbolId: toolState.selectedSymbol || 'star',
          };
          break;

        case 'text':
          newMark = {
            ...baseMark,
            type: 'text',
            text: prompt('Enter text:') || '',
          };
          break;

        default:
          return;
      }

      onMarkAdd(newMark);
    },
    [toolState, marks, onMarkAdd, onMarkRemove]
  );

  // Render grid lines for grid regions
  const renderGridLines = (region: Region) => {
    if (region.type !== 'grid') return null;

    const { rows, columns, cellWidth, cellHeight, gap = 0, offsetX = 0, offsetY = 0 } = region;
    const lines: React.ReactElement[] = [];

    const totalWidth = columns * cellWidth + (columns - 1) * gap;
    const totalHeight = rows * cellHeight + (rows - 1) * gap;

    // Vertical lines
    for (let i = 0; i <= columns; i++) {
      const x = offsetX + i * (cellWidth + gap);
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={offsetY}
          x2={x}
          y2={offsetY + totalHeight}
          stroke={region.borderColor || '#cbd5e1'}
          strokeWidth={region.borderWidth || 1}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = offsetY + i * (cellHeight + gap);
      lines.push(
        <line
          key={`h-${i}`}
          x1={offsetX}
          y1={y}
          x2={offsetX + totalWidth}
          y2={y}
          stroke={region.borderColor || '#cbd5e1'}
          strokeWidth={region.borderWidth || 1}
        />
      );
    }

    return <g key={region.id}>{lines}</g>;
  };

  // Render background for grid regions
  const renderGridBackground = (region: Region) => {
    if (region.type !== 'grid') return null;

    const { rows, columns, cellWidth, cellHeight, gap = 0, offsetX = 0, offsetY = 0 } = region;
    const totalWidth = columns * cellWidth + (columns - 1) * gap;
    const totalHeight = rows * cellHeight + (rows - 1) * gap;

    return (
      <rect
        key={`${region.id}-bg`}
        x={offsetX}
        y={offsetY}
        width={totalWidth}
        height={totalHeight}
        fill={region.backgroundColor || 'transparent'}
      />
    );
  };

  return (
    <div className="sheet-container w-full h-full overflow-auto">
      <svg
        width={sheet.width}
        height={sheet.height}
        viewBox={`0 0 ${sheet.width} ${sheet.height}`}
        className="border border-gray-300 bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {/* Background */}
        {sheet.backgroundColor && (
          <rect
            x={0}
            y={0}
            width={sheet.width}
            height={sheet.height}
            fill={sheet.backgroundColor}
          />
        )}

        {/* Background image */}
        {sheet.backgroundImage && (
          <image
            href={sheet.backgroundImage}
            x={0}
            y={0}
            width={sheet.width}
            height={sheet.height}
            preserveAspectRatio="xMidYMid meet"
          />
        )}

        {/* Grid backgrounds */}
        {sheet.regions.map(region => renderGridBackground(region))}

        {/* Grid lines */}
        {sheet.regions.map(region => renderGridLines(region))}

        {/* Color marks (rendered behind everything) */}
        {marks
          .filter(m => m.type === 'color')
          .map(mark => {
            const hotspot = hotspots.find(h => h.id === mark.hotspotId);
            if (!hotspot) return null;
            return <MarkRenderer key={mark.id} mark={mark} hotspot={hotspot} />;
          })}

        {/* Hotspots */}
        {hotspots.map(hotspot => (
          <HotspotRenderer
            key={hotspot.id}
            hotspot={hotspot}
            isDebugMode={isDebugMode}
            isHovered={hoveredHotspotId === hotspot.id}
            onClick={() => handleHotspotClick(hotspot)}
            onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
            onMouseLeave={() => setHoveredHotspotId(null)}
          />
        ))}

        {/* Non-color marks (rendered on top) */}
        {marks
          .filter(m => m.type !== 'color' && m.type !== 'line')
          .map(mark => {
            const hotspot = hotspots.find(h => h.id === mark.hotspotId);
            if (!hotspot) return null;
            return <MarkRenderer key={mark.id} mark={mark} hotspot={hotspot} />;
          })}

        {/* Line marks (rendered on top) */}
        {marks
          .filter(m => m.type === 'line')
          .map(mark => {
            const lineMark = mark as Extract<Mark, { type: 'line' }>;
            const fromHotspot = hotspots.find(h => h.id === lineMark.fromHotspotId);
            const toHotspot = hotspots.find(h => h.id === lineMark.toHotspotId);
            if (!fromHotspot || !toHotspot) return null;

            const from = getHotspotCenter(fromHotspot);
            const to = getHotspotCenter(toHotspot);

            return (
              <line
                key={mark.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={lineMark.color || 'currentColor'}
                strokeWidth={lineMark.thickness || 2}
                strokeDasharray={
                  lineMark.style === 'dashed' ? '5,5' :
                  lineMark.style === 'dotted' ? '2,2' :
                  undefined
                }
              />
            );
          })}
      </svg>
    </div>
  );
}

// Import getHotspotCenter
import { getHotspotCenter } from '../../engine/regions';
