/**
 * Sheet Renderer Component
 *
 * Renders a complete sheet with all regions and hotspots
 */

import { useState, useRef } from 'react';
import type { Sheet, Hotspot, Mark } from '../types';
import { HotspotRenderer } from './HotspotRenderer';
import { findHotspotAtPoint } from '../utils/geometry';
import { useGameState } from '../hooks/useGameState';
import { generateMarkId } from '../utils/helpers';

interface SheetRendererProps {
  sheet: Sheet;
}

export function SheetRenderer({ sheet }: SheetRendererProps) {
  const { state, addMark } = useGameState();
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Get all hotspots from all regions
  const allHotspots: Hotspot[] = sheet.regions.flatMap(region => region.hotspots);

  // Handle click on the sheet
  const handleSheetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sheetRef.current) return;

    const rect = sheetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find which hotspot was clicked
    const clickedHotspot = findHotspotAtPoint({ x, y }, allHotspots);

    if (clickedHotspot) {
      handleHotspotClick(clickedHotspot);
    }
  };

  // Handle mouse move for hover effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sheetRef.current) return;

    const rect = sheetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredHotspot = findHotspotAtPoint({ x, y }, allHotspots);
    setHoveredHotspotId(hoveredHotspot?.id || null);
  };

  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    const { selectedTool } = state;

    // Check if this mark type is allowed
    if (!hotspot.constraints.allowedMarkTypes.includes(selectedTool.markType)) {
      console.warn(`Mark type ${selectedTool.markType} not allowed on this hotspot`);
      return;
    }

    // Check max marks constraint
    if (
      hotspot.constraints.maxMarks !== undefined &&
      hotspot.marks.length >= hotspot.constraints.maxMarks
    ) {
      console.warn('Maximum marks reached for this hotspot');
      return;
    }

    // Find which region this hotspot belongs to
    let regionId = '';
    for (const region of sheet.regions) {
      if (region.hotspots.some(h => h.id === hotspot.id)) {
        regionId = region.id;
        break;
      }
    }

    // Create the mark based on selected tool
    const mark = createMarkFromTool(selectedTool);

    // Add the mark
    addMark(sheet.id, regionId, hotspot.id, mark);
  };

  return (
    <div
      ref={sheetRef}
      className="relative bg-white shadow-lg rounded-lg overflow-hidden"
      style={{
        width: sheet.width,
        height: sheet.height,
        backgroundImage: sheet.backgroundImage ? `url(${sheet.backgroundImage})` : undefined,
        backgroundSize: sheet.scaleMode === 'fill' ? 'cover' : 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={handleSheetClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredHotspotId(null)}
    >
      {/* Render all regions and their hotspots */}
      {sheet.regions.map(region => (
        <div
          key={region.id}
          className="absolute"
          style={{
            left: region.offsetX || 0,
            top: region.offsetY || 0,
            backgroundColor: region.backgroundColor,
            border: region.border,
          }}
        >
          {region.hotspots.map(hotspot => (
            <HotspotRenderer
              key={hotspot.id}
              hotspot={hotspot}
              isHovered={hotspot.id === hoveredHotspotId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createMarkFromTool(
  selectedTool: { markType: string; selectedColor?: string; selectedSymbol?: string; isPencilMode?: boolean }
): Mark {
  const baseMark: Mark = {
    id: generateMarkId(),
    type: selectedTool.markType as any,
    isPencil: selectedTool.isPencilMode || false,
  };

  switch (selectedTool.markType) {
    case 'checkbox':
      return { ...baseMark, checkboxState: 'checked' };

    case 'number':
      // For now, default to 0 - in a full implementation, would show number picker
      return { ...baseMark, numberValue: 0 };

    case 'color':
      return { ...baseMark, colorValue: selectedTool.selectedColor || '#3b82f6' };

    case 'circle':
      return { ...baseMark, circleState: 'full' };

    case 'symbol':
      return { ...baseMark, symbolId: selectedTool.selectedSymbol || 'star' };

    case 'text':
      // For now, empty text - in a full implementation, would show text input
      return { ...baseMark, textValue: '' };

    default:
      return baseMark;
  }
}
