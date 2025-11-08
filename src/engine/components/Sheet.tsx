/**
 * Sheet Component
 * Main game board/scorecard that renders hotspots and marks
 */

import React, { useMemo } from 'react';
import type { Sheet as SheetType, Hotspot as HotspotType, Mark, GridLayout } from '../types';
import { Hotspot } from './Hotspot';
import { MarkRenderer } from './MarkRenderer';
import { generateGrid } from '../utils/gridGenerator';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  selectedHotspotId: string | null;
  onHotspotClick: (hotspotId: string) => void;
}

export const Sheet: React.FC<SheetProps> = ({
  sheet,
  marks,
  selectedHotspotId,
  onHotspotClick,
}) => {
  // Generate hotspots based on layout type
  const hotspots = useMemo(() => {
    const layout = sheet.layout;

    if (layout.type === 'grid') {
      const gridLayout = layout as GridLayout;
      return generateGrid({
        rows: gridLayout.rows,
        columns: gridLayout.columns,
        cellSize: gridLayout.cellSize || 60,
        gap: gridLayout.gap || 4,
        startX: gridLayout.startPosition?.x || 20,
        startY: gridLayout.startPosition?.y || 20,
        defaultConstraints: gridLayout.defaultConstraints,
      });
    }

    if (layout.type === 'freeform') {
      return layout.hotspots || [];
    }

    if (layout.type === 'image-overlay') {
      return layout.hotspots || [];
    }

    if (layout.type === 'mixed') {
      const allHotspots: HotspotType[] = [];

      // Add grids
      if (layout.grids) {
        layout.grids.forEach((grid) => {
          const gridHotspots = generateGrid({
            rows: grid.rows,
            columns: grid.columns,
            cellSize: grid.cellSize || 60,
            gap: grid.gap || 4,
            startX: grid.position.x,
            startY: grid.position.y,
            defaultConstraints: grid.defaultConstraints,
          });
          allHotspots.push(...gridHotspots);
        });
      }

      // Add freeform hotspots
      if (layout.hotspots) {
        allHotspots.push(...layout.hotspots);
      }

      return allHotspots;
    }

    return [];
  }, [sheet.layout]);

  // Calculate sheet dimensions
  const dimensions = useMemo(() => {
    if (sheet.layout.type === 'grid') {
      const layout = sheet.layout as GridLayout;
      const cellSize = layout.cellSize || 60;
      const gap = layout.gap || 4;
      const startX = layout.startPosition?.x || 20;
      const startY = layout.startPosition?.y || 20;

      const width = startX + layout.columns * cellSize + (layout.columns - 1) * gap + 20;
      const height = startY + layout.rows * cellSize + (layout.rows - 1) * gap + 20;

      return { width, height };
    }

    if (sheet.layout.type === 'freeform') {
      return sheet.layout.dimensions;
    }

    if (sheet.layout.type === 'image-overlay') {
      return sheet.layout.imageSize;
    }

    if (sheet.layout.type === 'mixed') {
      return sheet.layout.dimensions;
    }

    return { width: 800, height: 600 };
  }, [sheet.layout]);

  // Get marks for a specific hotspot
  const getMarksForHotspot = (hotspotId: string): Mark[] => {
    return marks.filter((mark) => mark.hotspotId === hotspotId);
  };

  // Render background image if applicable
  const backgroundImage =
    sheet.layout.type === 'image-overlay'
      ? sheet.layout.backgroundImage
      : sheet.layout.type === 'mixed'
      ? sheet.layout.backgroundImage
      : undefined;

  return (
    <div className="flex justify-center p-8">
      <div
        className="relative bg-gray-50 border-2 border-gray-300 rounded-lg shadow-lg"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Render all hotspots */}
        {hotspots.map((hotspot) => {
          const hotspotMarks = getMarksForHotspot(hotspot.id);
          const isSelected = hotspot.id === selectedHotspotId;

          return (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              marks={hotspotMarks}
              isSelected={isSelected}
              onClick={onHotspotClick}
            >
              {/* Render marks inside this hotspot */}
              {hotspotMarks.map((mark) => (
                <MarkRenderer
                  key={mark.id}
                  mark={mark}
                  size={
                    hotspot.type === 'gridcell' || hotspot.type === 'rect'
                      ? hotspot.dimensions.width
                      : hotspot.type === 'circle' || hotspot.type === 'node'
                      ? hotspot.radius * 2
                      : 40
                  }
                />
              ))}
            </Hotspot>
          );
        })}

        {/* Render line marks (connections between hotspots) */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {marks
            .filter((mark) => mark.type === 'line')
            .map((mark) => {
              if (mark.type !== 'line') return null;

              const fromHotspot = hotspots.find((h) => h.id === mark.fromHotspotId);
              const toHotspot = hotspots.find((h) => h.id === mark.toHotspotId);

              if (!fromHotspot || !toHotspot) return null;

              const fromX = fromHotspot.position.x;
              const fromY = fromHotspot.position.y;
              const toX = toHotspot.position.x;
              const toY = toHotspot.position.y;

              return (
                <line
                  key={mark.id}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={mark.lineColor || '#1f2937'}
                  strokeWidth={mark.lineWidth || 2}
                  strokeDasharray={
                    mark.lineStyle === 'dashed'
                      ? '5,5'
                      : mark.lineStyle === 'dotted'
                      ? '2,3'
                      : undefined
                  }
                  opacity={mark.isPencil ? 0.5 : 1}
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
};
