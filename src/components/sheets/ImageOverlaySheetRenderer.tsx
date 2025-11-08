/**
 * ImageOverlaySheetRenderer
 * Renders image-based sheets with hotspot overlays
 */

import React from 'react';
import type { ImageOverlaySheet } from '../../types';
import { HotspotRenderer } from '../hotspots/HotspotRenderer';

interface ImageOverlaySheetRendererProps {
  sheet: ImageOverlaySheet;
  selectedHotspotId?: string;
  onHotspotSelect?: (hotspotId: string) => void;
  debug?: boolean;
}

export const ImageOverlaySheetRenderer: React.FC<ImageOverlaySheetRendererProps> = ({
  sheet,
  selectedHotspotId,
  onHotspotSelect,
  debug = false,
}) => {
  const { image, dimensions } = sheet;

  return (
    <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
      {/* Background Image */}
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: image.fit,
          left: image.position?.x || 0,
          top: image.position?.y || 0,
        }}
      />

      {/* SVG Overlay for Hotspots */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
      >
        <g className="pointer-events-auto">
          {sheet.hotspots.map((hotspot) => (
            <HotspotRenderer
              key={hotspot.id}
              hotspot={hotspot}
              isSelected={hotspot.id === selectedHotspotId}
              onSelect={onHotspotSelect}
              debug={debug}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
