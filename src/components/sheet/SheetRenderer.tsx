/**
 * Sheet Renderer - renders the appropriate sheet component based on sheet type
 */

import type { SheetState, Hotspot } from '../../types';
import { GridSheet } from './GridSheet';
import { ImageOverlaySheet } from './ImageOverlaySheet';
import { CustomSheet } from './CustomSheet';

interface SheetRendererProps {
  sheetState: SheetState;
  onHotspotClick?: (hotspot: Hotspot) => void;
  showDebug?: boolean;
}

export function SheetRenderer({
  sheetState,
  onHotspotClick,
  showDebug = false,
}: SheetRendererProps) {
  const { sheet } = sheetState;

  switch (sheet.type) {
    case 'grid':
      return (
        <GridSheet
          sheetState={sheetState}
          onHotspotClick={onHotspotClick}
          showDebug={showDebug}
        />
      );

    case 'image-overlay':
      return (
        <ImageOverlaySheet
          sheetState={sheetState}
          onHotspotClick={onHotspotClick}
          showDebug={showDebug}
        />
      );

    case 'custom':
      return (
        <CustomSheet
          sheetState={sheetState}
          onHotspotClick={onHotspotClick}
          showDebug={showDebug}
        />
      );

    default:
      return null;
  }
}
