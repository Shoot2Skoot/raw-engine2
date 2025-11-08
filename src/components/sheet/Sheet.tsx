import React from 'react';
import { Sheet as SheetType, Mark } from '../../types';
import { GridLayout } from './GridLayout';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  debugMode?: boolean;
  onHotspotClick?: (hotspotId: string) => void;
}

/**
 * Main sheet component - renders different layout types
 */
export function Sheet({ sheet, marks, debugMode, onHotspotClick }: SheetProps) {
  const renderLayout = () => {
    switch (sheet.layout.type) {
      case 'grid':
        return (
          <GridLayout
            layout={sheet.layout}
            marks={marks}
            debugMode={debugMode}
            onHotspotClick={onHotspotClick}
          />
        );

      case 'image':
        // TODO: Implement image layout
        return <div>Image layout not yet implemented</div>;

      case 'track':
        // TODO: Implement track layout
        return <div>Track layout not yet implemented</div>;

      case 'territory':
        // TODO: Implement territory layout
        return <div>Territory layout not yet implemented</div>;

      case 'connection':
        // TODO: Implement connection layout
        return <div>Connection layout not yet implemented</div>;

      case 'techtree':
        // TODO: Implement tech tree layout
        return <div>Tech tree layout not yet implemented</div>;

      case 'freeform':
        // TODO: Implement freeform layout
        return <div>Freeform layout not yet implemented</div>;

      case 'composite':
        // TODO: Implement composite layout
        return <div>Composite layout not yet implemented</div>;

      default:
        return <div>Unknown layout type</div>;
    }
  };

  return (
    <div
      className="relative overflow-auto"
      style={{
        width: `${sheet.dimensions.width}px`,
        height: `${sheet.dimensions.height}px`,
        backgroundColor: sheet.backgroundColor || '#ffffff',
        backgroundImage: sheet.backgroundImage ? `url(${sheet.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {renderLayout()}
    </div>
  );
}
