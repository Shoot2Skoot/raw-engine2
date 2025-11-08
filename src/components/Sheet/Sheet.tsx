
import type { SheetDefinition, Mark, Hotspot } from '../../types';
import { GridSheet } from './GridSheet';

interface SheetProps {
  definition: SheetDefinition;
  marks: Mark[];
  selectedHotspotId?: string;
  onHotspotClick?: (hotspot: Hotspot) => void;
}

/**
 * Main Sheet component - renders different layout types
 */
export function Sheet({
  definition,
  marks,
  selectedHotspotId,
  onHotspotClick,
}: SheetProps) {
  const layout = definition.layout;

  switch (layout.type) {
    case 'grid':
      return (
        <GridSheet
          sheetId={definition.id}
          layout={layout}
          marks={marks}
          selectedHotspotId={selectedHotspotId}
          onHotspotClick={onHotspotClick}
        />
      );

    case 'image-overlay':
      // TODO: Implement image overlay layout
      return <div>Image Overlay Layout - Coming Soon</div>;

    case 'freeform':
      // TODO: Implement freeform layout
      return <div>Freeform Layout - Coming Soon</div>;

    case 'mixed':
      // TODO: Implement mixed layout
      return <div>Mixed Layout - Coming Soon</div>;

    default:
      return <div>Unknown layout type</div>;
  }
}
