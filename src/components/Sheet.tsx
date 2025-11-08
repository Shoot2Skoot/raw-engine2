/**
 * Sheet component - renders a game sheet with all its layouts and hotspots
 */

import React from 'react';
import type { Sheet as SheetType, Mark } from '../types';
import { GridLayout } from './layouts/GridLayout';
import { ImageLayout } from './layouts/ImageLayout';
import { FreeformLayout } from './layouts/FreeformLayout';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
  onHotspotClick: (hotspotId: string) => void;
  highlightedHotspots?: string[];
}

export const Sheet: React.FC<SheetProps> = ({
  sheet,
  marks,
  onHotspotClick,
  highlightedHotspots = [],
}) => {
  return (
    <div className="relative w-full h-full overflow-auto bg-white">
      <div className="relative min-w-min min-h-min p-4">
        {sheet.layouts.map((layout, index) => {
          if (layout.type === 'grid') {
            return (
              <GridLayout
                key={`layout-${index}`}
                layout={layout}
                marks={marks}
                hotspots={sheet.hotspots}
                onHotspotClick={onHotspotClick}
                highlightedHotspots={highlightedHotspots}
              />
            );
          }

          if (layout.type === 'image') {
            return (
              <ImageLayout
                key={`layout-${index}`}
                layout={layout}
                marks={marks}
                onHotspotClick={onHotspotClick}
                highlightedHotspots={highlightedHotspots}
              />
            );
          }

          if (layout.type === 'freeform') {
            return (
              <FreeformLayout
                key={`layout-${index}`}
                layout={layout}
                marks={marks}
                onHotspotClick={onHotspotClick}
                highlightedHotspots={highlightedHotspots}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
