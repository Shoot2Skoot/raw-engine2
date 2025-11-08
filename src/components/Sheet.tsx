/**
 * Sheet component - renders a game sheet with all its regions and hotspots
 */


import type { SheetState } from '../types';
import { Region } from './Region';

interface SheetProps {
  sheet: SheetState;
  onHotspotClick: (sheetId: string, hotspotId: string) => void;
}

export function Sheet({ sheet, onHotspotClick }: SheetProps) {
  const { config } = sheet;

  return (
    <div
      className="relative bg-white shadow-lg rounded-lg overflow-hidden"
      style={{
        width: config.width,
        height: config.height
      }}
    >
      {/* Background image if present */}
      {config.background && (
        <img
          src={config.background.src}
          alt="Sheet background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            objectFit: config.background.maintainAspectRatio ? 'contain' : 'cover'
          }}
        />
      )}

      {/* Regions */}
      {config.regions.map(region => (
        <Region
          key={region.id}
          region={region}
          sheetId={sheet.id}
          onHotspotClick={onHotspotClick}
        />
      ))}
    </div>
  );
}
