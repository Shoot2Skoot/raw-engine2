/**
 * Image Overlay Sheet Component - renders a sheet with background image and overlaid hotspots
 */

import type { ImageOverlaySheet as ImageOverlaySheetType, SheetState, Hotspot as HotspotType } from '../../types';
import { Hotspot } from './Hotspot';

interface ImageOverlaySheetProps {
  sheetState: SheetState;
  onHotspotClick?: (hotspot: HotspotType) => void;
  showDebug?: boolean;
}

export function ImageOverlaySheet({
  sheetState,
  onHotspotClick,
  showDebug = false,
}: ImageOverlaySheetProps) {
  const sheet = sheetState.sheet as ImageOverlaySheetType;

  // Get hotspots with state
  const hotspotsWithState = sheet.hotspots.map((hotspot) => {
    const existingState = sheetState.hotspots.get(hotspot.id);
    return existingState || { hotspot, marks: [] };
  });

  return (
    <div
      className="relative"
      style={{
        width: sheet.width,
        height: sheet.height,
        backgroundColor: sheet.backgroundColor || 'transparent',
      }}
    >
      {/* Background image */}
      <img
        src={sheet.imageConfig.imageUrl}
        alt={sheet.name}
        className="absolute inset-0"
        style={{
          width: sheet.imageConfig.width,
          height: sheet.imageConfig.height,
          objectFit: sheet.imageConfig.maintainAspectRatio ? 'contain' : 'fill',
        }}
      />

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
