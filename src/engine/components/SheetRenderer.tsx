/**
 * Sheet Renderer - Renders a complete sheet with all hotspots
 */

import React from 'react';
import type { Sheet, Hotspot, Mark, Tool } from '../types';
import { generateGridHotspots } from '../utils/grid-utils';
import { HotspotComponent } from './HotspotComponent';

interface SheetRendererProps {
  sheet: Sheet;
  marks: Record<string, Mark[]>;
  selectedTool: Tool;
  onPlaceMark: (hotspotId: string, mark: Mark) => void;
  onRemoveMark: (hotspotId: string, markIndex: number) => void;
}

export const SheetRenderer: React.FC<SheetRendererProps> = ({
  sheet,
  marks,
  selectedTool,
  onPlaceMark,
  onRemoveMark,
}) => {
  // Collect all hotspots from regions
  const allHotspots: Hotspot[] = [];

  for (const region of sheet.regions) {
    if (region.layout.type === 'grid') {
      const gridHotspots = generateGridHotspots(region.layout);
      // Offset by region position
      const offsetHotspots = gridHotspots.map((h) => ({
        ...h,
        shape: {
          ...(h.shape as any),
          x: (h.shape as any).x + region.position.x,
          y: (h.shape as any).y + region.position.y,
        },
      }));
      allHotspots.push(...offsetHotspots);
    } else if (region.layout.type === 'freeform') {
      // Offset freeform hotspots by region position
      const offsetHotspots = region.layout.hotspots.map((h) => ({
        ...h,
        shape: {
          ...(h.shape as any),
          x: (h.shape as any).x + region.position.x,
          y: (h.shape as any).y + region.position.y,
        },
      }));
      allHotspots.push(...offsetHotspots);
    }
  }

  // Add sheet-level hotspots
  if (sheet.hotspots) {
    allHotspots.push(...sheet.hotspots);
  }

  return (
    <div
      className="relative"
      style={{
        width: sheet.width,
        height: sheet.height,
        backgroundColor: sheet.backgroundColor || '#f3f4f6',
      }}
    >
      {/* Background image */}
      {sheet.backgroundImage && (
        <img
          src={sheet.backgroundImage}
          alt={sheet.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Render all hotspots */}
      {allHotspots.map((hotspot) => (
        <HotspotComponent
          key={hotspot.id}
          hotspot={hotspot}
          marks={marks[hotspot.id] || []}
          selectedTool={selectedTool}
          onMark={(mark) => onPlaceMark(hotspot.id, mark)}
          onRemoveMark={(index) => onRemoveMark(hotspot.id, index)}
        />
      ))}
    </div>
  );
};
