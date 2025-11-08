/**
 * HotspotCell - renders a single interactive hotspot with its marks
 */

import React from 'react';
import type { Hotspot, Mark } from '../types';
import { MarkRenderer } from './marks/MarkRenderer';

interface HotspotCellProps {
  hotspot: Hotspot;
  marks: Mark[];
  onClick: () => void;
  isHighlighted?: boolean;
}

export const HotspotCell: React.FC<HotspotCellProps> = ({
  hotspot,
  marks,
  onClick,
  isHighlighted = false,
}) => {
  // Get position and dimensions based on shape
  const getStyle = (): React.CSSProperties => {
    if (hotspot.shape.shape === 'rect') {
      return {
        position: 'absolute',
        left: hotspot.shape.x,
        top: hotspot.shape.y,
        width: hotspot.shape.width,
        height: hotspot.shape.height,
      };
    }

    if (hotspot.shape.shape === 'circle') {
      return {
        position: 'absolute',
        left: hotspot.shape.centerX - hotspot.shape.radius,
        top: hotspot.shape.centerY - hotspot.shape.radius,
        width: hotspot.shape.radius * 2,
        height: hotspot.shape.radius * 2,
        borderRadius: '50%',
      };
    }

    return {
      position: 'absolute',
    };
  };

  const handleClick = () => {
    if (!hotspot.readOnly) {
      onClick();
    }
  };

  return (
    <div
      className={`
        border border-gray-300
        ${!hotspot.readOnly ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
        ${isHighlighted ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-100
        flex items-center justify-center
        overflow-hidden
      `}
      style={getStyle()}
      onClick={handleClick}
      role={hotspot.readOnly ? 'presentation' : 'button'}
      tabIndex={hotspot.readOnly ? -1 : 0}
      aria-label={hotspot.label}
    >
      {/* Render all marks in this hotspot */}
      <div className="relative w-full h-full">
        {marks.map((mark) => (
          <MarkRenderer key={mark.id} mark={mark} />
        ))}
      </div>

      {/* Show label in debug mode */}
      {hotspot.label && import.meta.env.DEV && (
        <div className="absolute top-0 left-0 text-[8px] text-gray-400 pointer-events-none">
          {hotspot.label}
        </div>
      )}
    </div>
  );
};
