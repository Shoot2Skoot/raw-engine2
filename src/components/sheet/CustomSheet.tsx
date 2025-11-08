/**
 * Custom Sheet Component - renders a custom layout sheet with manually defined hotspots
 */

import { useMemo } from 'react';
import type { CustomSheet as CustomSheetType, SheetState, Hotspot as HotspotType } from '../../types';
import { generateTrackHotspots } from '../../types';
import { Hotspot } from './Hotspot';

interface CustomSheetProps {
  sheetState: SheetState;
  onHotspotClick?: (hotspot: HotspotType) => void;
  showDebug?: boolean;
}

export function CustomSheet({
  sheetState,
  onHotspotClick,
  showDebug = false,
}: CustomSheetProps) {
  const sheet = sheetState.sheet as CustomSheetType;

  // Generate hotspots from tracks if any
  const trackHotspots = useMemo(() => {
    if (!sheet.tracks) return [];
    return sheet.tracks.flatMap((track) => generateTrackHotspots(track));
  }, [sheet.tracks]);

  // Combine all hotspots
  const allHotspots = useMemo(() => {
    return [...sheet.hotspots, ...trackHotspots];
  }, [sheet.hotspots, trackHotspots]);

  // Get hotspots with state
  const hotspotsWithState = allHotspots.map((hotspot) => {
    const existingState = sheetState.hotspots.get(hotspot.id);
    return existingState || { hotspot, marks: [] };
  });

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
      {/* Render regions (visual groupings) */}
      {showDebug && sheet.regions?.map((region) => (
        <div
          key={region.id}
          className="absolute pointer-events-none"
          style={{
            border: region.borderColor
              ? `${region.borderWidth || 2}px solid ${region.borderColor}`
              : 'none',
            backgroundColor: region.backgroundColor || 'transparent',
          }}
        >
          <div className="text-xs bg-black text-white px-1">
            {region.name}
          </div>
        </div>
      ))}

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
