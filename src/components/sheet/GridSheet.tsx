/**
 * Grid Sheet Component - renders a grid-based sheet with auto-generated hotspots
 */

import { useMemo } from 'react';
import type { GridSheet as GridSheetType, SheetState, Hotspot as HotspotType } from '../../types';
import { generateGridHotspots } from '../../types';
import { Hotspot } from './Hotspot';

interface GridSheetProps {
  sheetState: SheetState;
  onHotspotClick?: (hotspot: HotspotType) => void;
  showDebug?: boolean;
}

export function GridSheet({ sheetState, onHotspotClick, showDebug = false }: GridSheetProps) {
  const sheet = sheetState.sheet as GridSheetType;

  // Generate grid hotspots if not already in state
  const gridHotspots = useMemo(() => {
    const generated = generateGridHotspots(sheet.gridConfig);

    // Merge with custom hotspots if any
    const customHotspots = sheet.customHotspots || [];
    return [...generated, ...customHotspots];
  }, [sheet]);

  // Ensure all hotspots have state entries
  const hotspotsWithState = useMemo(() => {
    return gridHotspots.map((hotspot) => {
      const existingState = sheetState.hotspots.get(hotspot.id);
      return existingState || { hotspot, marks: [] };
    });
  }, [gridHotspots, sheetState.hotspots]);

  return (
    <div
      className="relative"
      style={{
        width: sheet.width,
        height: sheet.height,
        backgroundColor: sheet.backgroundColor || '#FFFFFF',
        backgroundImage: sheet.backgroundImage
          ? `url(${sheet.backgroundImage})`
          : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Grid background lines (optional visual aid) */}
      {showDebug && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: sheet.width, height: sheet.height }}
        >
          {/* Vertical lines */}
          {Array.from({ length: sheet.gridConfig.columns + 1 }).map((_, i) => {
            const cellWidth =
              sheet.gridConfig.cellWidth === 'auto'
                ? 50
                : sheet.gridConfig.cellWidth;
            const x =
              sheet.gridConfig.offsetX + i * (cellWidth + sheet.gridConfig.gap);
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={sheet.gridConfig.offsetY}
                x2={x}
                y2={
                  sheet.gridConfig.offsetY +
                  sheet.gridConfig.rows * (cellWidth + sheet.gridConfig.gap)
                }
                stroke="#CBD5E1"
                strokeWidth={1}
              />
            );
          })}
          {/* Horizontal lines */}
          {Array.from({ length: sheet.gridConfig.rows + 1 }).map((_, i) => {
            const cellHeight =
              sheet.gridConfig.cellHeight === 'auto'
                ? 50
                : sheet.gridConfig.cellHeight;
            const y =
              sheet.gridConfig.offsetY +
              i * (cellHeight + sheet.gridConfig.gap);
            return (
              <line
                key={`h-${i}`}
                x1={sheet.gridConfig.offsetX}
                y1={y}
                x2={
                  sheet.gridConfig.offsetX +
                  sheet.gridConfig.columns *
                    ((sheet.gridConfig.cellWidth === 'auto'
                      ? 50
                      : sheet.gridConfig.cellWidth) +
                      sheet.gridConfig.gap)
                }
                y2={y}
                stroke="#CBD5E1"
                strokeWidth={1}
              />
            );
          })}
        </svg>
      )}

      {/* Render all hotspots */}
      {hotspotsWithState.map((hotspotState) => (
        <Hotspot
          key={hotspotState.hotspot.id}
          hotspotState={hotspotState}
          onClick={onHotspotClick}
          showDebug={showDebug}
        />
      ))}
    </div>
  );
}
