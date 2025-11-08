/**
 * Sheet renderer - dispatches to appropriate sheet component based on layout type
 */

import type { Sheet } from '../types';
import { GridSheet } from './sheets/GridSheet';
import { ImageSheet } from './sheets/ImageSheet';

interface SheetRendererProps {
  sheet: Sheet;
  onHotspotClick?: (hotspotId: string) => void;
}

export function SheetRenderer({ sheet, onHotspotClick }: SheetRendererProps) {
  switch (sheet.layout.type) {
    case 'grid':
      return <GridSheet sheet={sheet} onHotspotClick={onHotspotClick} />;

    case 'image':
      return <ImageSheet sheet={sheet} onHotspotClick={onHotspotClick} />;

    // TODO: Implement other layout types
    case 'track':
    case 'region':
    case 'connection':
    case 'composite':
      return (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          Layout type "{sheet.layout.type}" not yet implemented
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center w-full h-full text-red-500">
          Unknown layout type
        </div>
      );
  }
}
