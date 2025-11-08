/**
 * Region component - renders a region with all its hotspots
 */


import type { Region as RegionType } from '../types';
import { Hotspot } from './Hotspot';

interface RegionProps {
  region: RegionType;
  sheetId: string;
  onHotspotClick: (sheetId: string, hotspotId: string) => void;
}

export function Region({ region, sheetId, onHotspotClick }: RegionProps) {
  return (
    <div
      className="absolute"
      style={{
        zIndex: region.zIndex ?? 1,
        backgroundColor: region.backgroundColor,
        border: region.borderColor ? `1px solid ${region.borderColor}` : undefined
      }}
    >
      {/* Render all hotspots in this region */}
      {region.hotspots.map(hotspot => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          onClick={() => onHotspotClick(sheetId, hotspot.id)}
        />
      ))}
    </div>
  );
}
