import type { Sheet, Mark } from '../../types';
import { GridSheet } from './GridSheet';

interface SheetRendererProps {
  sheet: Sheet;
  marks: Mark[];
  onHotspotClick: (hotspotId: string) => void;
}

export function SheetRenderer({
  sheet,
  marks,
  onHotspotClick,
  
}: SheetRendererProps) {
  const renderLayout = () => {
    switch (sheet.layout.type) {
      case 'grid':
        return (
          <GridSheet
            layout={sheet.layout}
            marks={marks}
            onHotspotClick={onHotspotClick}
          />
        );
      // Add more layout types as needed
      default:
        return <div>Unsupported layout type</div>;
    }
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: sheet.backgroundColor || '#F9FAFB' }}
    >
      <h2 className="text-xl font-bold mb-4">{sheet.name}</h2>
      {renderLayout()}
    </div>
  );
}
