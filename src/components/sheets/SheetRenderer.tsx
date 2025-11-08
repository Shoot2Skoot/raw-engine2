/**
 * SheetRenderer
 * Main sheet renderer that delegates to specific sheet type renderers
 */

import React from 'react';
import type { Sheet } from '../../types';
import { GridSheetRenderer } from './GridSheetRenderer';
import { ImageOverlaySheetRenderer } from './ImageOverlaySheetRenderer';

interface SheetRendererProps {
  sheet: Sheet;
  selectedHotspotId?: string;
  onHotspotSelect?: (hotspotId: string) => void;
  debug?: boolean;
}

export const SheetRenderer: React.FC<SheetRendererProps> = ({
  sheet,
  selectedHotspotId,
  onHotspotSelect,
  debug = false,
}) => {
  switch (sheet.layoutType) {
    case 'grid':
      return (
        <GridSheetRenderer
          sheet={sheet}
          selectedHotspotId={selectedHotspotId}
          onHotspotSelect={onHotspotSelect}
          debug={debug}
        />
      );

    case 'image-overlay':
      return (
        <ImageOverlaySheetRenderer
          sheet={sheet}
          selectedHotspotId={selectedHotspotId}
          onHotspotSelect={onHotspotSelect}
          debug={debug}
        />
      );

    case 'mixed':
      // TODO: Implement MixedSheetRenderer
      return <div className="p-4 text-gray-500">Mixed layout not yet implemented</div>;

    case 'custom':
      // TODO: Support custom renderers
      return <div className="p-4 text-gray-500">Custom layout not yet implemented</div>;

    default:
      return <div className="p-4 text-red-500">Unknown sheet type</div>;
  }
};
