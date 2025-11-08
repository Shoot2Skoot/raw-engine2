/**
 * Sheet Renderer Component
 * Renders a game sheet with all its hotspots and marks
 */

import React from 'react';
import { SheetDefinition, PlacedMark } from '../../types';
import { Hotspot } from './Hotspot';

interface SheetRendererProps {
  sheet: SheetDefinition;
  marks: PlacedMark[];
  onHotspotClick: (hotspotId: string) => void;
}

export const SheetRenderer: React.FC<SheetRendererProps> = ({
  sheet,
  marks,
  onHotspotClick,
}) => {
  // Get marks for a specific hotspot
  const getHotspotMarks = (hotspotId: string) => {
    return marks.filter((m) => m.hotspotId === hotspotId);
  };

  return (
    <div
      className="relative border-2 border-gray-400 bg-white"
      style={{
        width: sheet.dimensions.width,
        height: sheet.dimensions.height,
        backgroundColor:
          typeof sheet.background === 'string'
            ? sheet.background
            : 'white',
      }}
    >
      {/* Background image if present */}
      {sheet.background && typeof sheet.background !== 'string' && (
        <img
          src={sheet.background.url}
          alt={sheet.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectFit: sheet.background.maintainAspectRatio ? 'contain' : 'fill',
          }}
        />
      )}

      {/* Render all hotspots */}
      {sheet.hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          marks={getHotspotMarks(hotspot.id)}
          onClick={onHotspotClick}
        />
      ))}
    </div>
  );
};
