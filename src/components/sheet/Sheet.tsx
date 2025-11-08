/**
 * Sheet Component
 * Renders a game sheet with hotspots and marks
 */

import { useMemo } from 'react';
import {
  Sheet as SheetType,
  LayoutConfig,
  GridLayoutConfig,
  Hotspot as HotspotType,
  Mark,
  Tool,
} from '../../types';
import { Hotspot } from './Hotspot';
import { generateGridHotspots, getMarksForHotspot } from '../../utils/gameEngine';

interface SheetProps {
  sheet: SheetType;
  currentTool: Tool | null;
  onPlaceMark: (mark: Mark) => void;
  onRemoveMark: (markId: string) => void;
}

export function Sheet({ sheet, currentTool, onPlaceMark, onRemoveMark }: SheetProps) {
  const { hotspots, dimensions } = useMemo(() => {
    return getLayoutInfo(sheet.layout);
  }, [sheet.layout]);

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-4">
      <div className="flex items-center justify-center min-h-full">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="bg-white shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {sheet.layout.type === 'image-overlay' && (
            <image
              href={sheet.layout.imageUrl}
              width={dimensions.width}
              height={dimensions.height}
              preserveAspectRatio={
                sheet.layout.maintainAspectRatio ? 'xMidYMid meet' : 'none'
              }
            />
          )}
          {sheet.layout.type === 'grid' && sheet.layout.backgroundColor && (
            <rect
              x={sheet.layout.x || 0}
              y={sheet.layout.y || 0}
              width={dimensions.width}
              height={dimensions.height}
              fill={sheet.layout.backgroundColor}
            />
          )}
          {hotspots.map((hotspot) => {
            const marks = getMarksForHotspot(sheet, hotspot.id);
            return (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                marks={marks}
                currentTool={currentTool}
                onPlaceMark={onPlaceMark}
                onRemoveMark={onRemoveMark}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function getLayoutInfo(layout: LayoutConfig): {
  hotspots: HotspotType[];
  dimensions: { width: number; height: number };
} {
  if (layout.type === 'grid') {
    return getGridLayoutInfo(layout);
  }

  if (layout.type === 'image-overlay') {
    return {
      hotspots: layout.hotspots,
      dimensions: { width: layout.width, height: layout.height },
    };
  }

  if (layout.type === 'freeform') {
    return {
      hotspots: layout.hotspots,
      dimensions: { width: layout.width, height: layout.height },
    };
  }

  if (layout.type === 'mixed') {
    // Combine all hotspots from all regions
    const allHotspots: HotspotType[] = [];
    layout.regions.forEach((region) => {
      const info = getLayoutInfo(region);
      allHotspots.push(...info.hotspots);
    });
    return {
      hotspots: allHotspots,
      dimensions: { width: layout.width, height: layout.height },
    };
  }

  return { hotspots: [], dimensions: { width: 800, height: 600 } };
}

function getGridLayoutInfo(grid: GridLayoutConfig): {
  hotspots: HotspotType[];
  dimensions: { width: number; height: number };
} {
  const hotspots = generateGridHotspots(grid);
  const cellSize = grid.cellSize || 60;
  const gap = grid.gap || 2;

  const width = grid.cols * cellSize + (grid.cols - 1) * gap + (grid.x || 0) * 2;
  const height = grid.rows * cellSize + (grid.rows - 1) * gap + (grid.y || 0) * 2;

  return {
    hotspots,
    dimensions: { width, height },
  };
}
