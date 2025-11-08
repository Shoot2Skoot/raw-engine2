/**
 * Sheet component - Renders a complete game sheet with hotspots and marks
 */

import React from 'react';
import type { Sheet as SheetType, Mark, Hotspot as HotspotType } from '../../types';
import { Hotspot } from './Hotspot';
import { MarkRenderer } from './MarkRenderer';
import { getMarksForHotspot } from '../../lib/marks';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  onHotspotClick: (hotspot: HotspotType) => void;
  activeHotspotId?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  sheet,
  marks,
  onHotspotClick,
  activeHotspotId,
}) => {
  // Calculate SVG dimensions based on layout
  const { width, height } = calculateSheetDimensions(sheet);

  return (
    <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
      <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="border border-gray-300 bg-white shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Background */}
          {sheet.backgroundColor && (
            <rect width={width} height={height} fill={sheet.backgroundColor} />
          )}

          {sheet.backgroundImage && (
            <image
              href={sheet.backgroundImage}
              width={width}
              height={height}
              preserveAspectRatio="xMidYMid meet"
            />
          )}

          {/* Grid lines for grid layouts */}
          {sheet.layout.type === 'grid' && (
            <GridLines config={sheet.layout} />
          )}

          {/* Render hotspots with marks */}
          {sheet.hotspots.map((hotspot) => {
            const hotspotMarks = getMarksForHotspot(hotspot.id, marks);

            return (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                onClick={() => onHotspotClick(hotspot)}
                isActive={hotspot.id === activeHotspotId}
              >
                {hotspotMarks.map((mark) => (
                  <MarkRenderer key={mark.id} mark={mark} hotspot={hotspot} />
                ))}
              </Hotspot>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

function calculateSheetDimensions(sheet: SheetType): { width: number; height: number } {
  const layout = sheet.layout;

  if (layout.type === 'grid') {
    const cellSize = layout.cellSize || 50;
    const gap = layout.gap || 2;
    const width = layout.columns * cellSize + (layout.columns - 1) * gap + (layout.offsetX || 0) * 2;
    const height = layout.rows * cellSize + (layout.rows - 1) * gap + (layout.offsetY || 0) * 2;
    return { width: width + 20, height: height + 20 }; // Add padding
  }

  if (layout.type === 'image') {
    return { width: layout.width, height: layout.height };
  }

  if (layout.type === 'track') {
    const spaceSize = layout.spaceSize || 30;
    const gap = layout.gap || 5;

    if (layout.orientation === 'vertical') {
      const height = layout.spaces * spaceSize + (layout.spaces - 1) * gap + 40;
      return { width: spaceSize + 40, height };
    } else {
      const width = layout.spaces * spaceSize + (layout.spaces - 1) * gap + 40;
      return { width, height: spaceSize + 40 };
    }
  }

  // Default dimensions
  return { width: 800, height: 600 };
}

const GridLines: React.FC<{ config: any }> = ({ config }) => {
  const cellSize = config.cellSize || 50;
  const gap = config.gap || 2;
  const offsetX = config.offsetX || 0;
  const offsetY = config.offsetY || 0;

  const lines: JSX.Element[] = [];

  // Vertical lines
  for (let col = 0; col <= config.columns; col++) {
    const x = offsetX + col * (cellSize + gap);
    lines.push(
      <line
        key={`v-${col}`}
        x1={x}
        y1={offsetY}
        x2={x}
        y2={offsetY + config.rows * cellSize + (config.rows - 1) * gap}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  // Horizontal lines
  for (let row = 0; row <= config.rows; row++) {
    const y = offsetY + row * (cellSize + gap);
    lines.push(
      <line
        key={`h-${row}`}
        x1={offsetX}
        y1={y}
        x2={offsetX + config.columns * cellSize + (config.columns - 1) * gap}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  return <g>{lines}</g>;
};
