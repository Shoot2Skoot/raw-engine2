/**
 * Sheet component - renders a complete game sheet with all regions
 */

import type { Sheet as SheetType, SheetState } from '../../types';
import { GridRegion } from './GridRegion';

interface SheetProps {
  sheet: SheetType;
  sheetState: SheetState;
  onHotspotClick: (hotspotId: string) => void;
}

export function Sheet({ sheet, sheetState, onHotspotClick }: SheetProps) {
  return (
    <div className="relative bg-gray-50 rounded-lg shadow-lg p-4 overflow-auto">
      <svg
        width={sheet.width}
        height={sheet.height}
        className="bg-white rounded border border-gray-300"
        style={{
          backgroundImage: sheet.backgroundImage ? `url(${sheet.backgroundImage})` : undefined,
          backgroundSize: 'cover',
        }}
      >
        {/* Render all regions */}
        {sheet.regions.map(region => {
          switch (region.type) {
            case 'grid':
              return (
                <GridRegion
                  key={region.id}
                  region={region}
                  marks={sheetState.marks}
                  onHotspotClick={onHotspotClick}
                />
              );

            // Add other region types here as they're implemented
            case 'track':
            case 'territory':
            case 'connection':
            case 'techTree':
            case 'freeform':
              // TODO: Implement these region types
              return null;

            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
}
