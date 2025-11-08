/**
 * Hotspot Component - Interactive region for placing marks
 */

import { useCallback } from 'react';
import type { Hotspot as HotspotType, Mark } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';

interface HotspotProps {
  hotspot: HotspotType;
  marks: Mark[];
  onClick?: () => void;
}

export function Hotspot({ hotspot, marks, onClick }: HotspotProps) {

  const handleClick = useCallback(() => {
    if (hotspot.isDisabled) return;
    onClick?.();
  }, [hotspot.isDisabled, onClick]);

  // Calculate position and size based on shape
  const style: React.CSSProperties = {};

  if (hotspot.shape === 'rectangle') {
    style.left = `${hotspot.bounds.x}px`;
    style.top = `${hotspot.bounds.y}px`;
    style.width = `${hotspot.bounds.width}px`;
    style.height = `${hotspot.bounds.height}px`;
  } else if (hotspot.shape === 'circle') {
    const { center, radius } = hotspot.bounds;
    style.left = `${center.x - radius}px`;
    style.top = `${center.y - radius}px`;
    style.width = `${radius * 2}px`;
    style.height = `${radius * 2}px`;
    style.borderRadius = '50%';
  }

  const isDisabled = hotspot.isDisabled;
  const className = `absolute border-2 border-gray-300 bg-white transition-all ${
    isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:border-blue-500 hover:bg-blue-50 cursor-pointer hotspot'
  }`;

  return (
    <div className={className} style={style} onClick={handleClick}>
      {marks.map((mark) => (
        <MarkRenderer
          key={mark.id}
          mark={mark}
          size={hotspot.shape === 'rectangle' ? hotspot.bounds.width : (hotspot.shape === 'circle' ? hotspot.bounds.radius * 2 : 40)}
        />
      ))}
      {marks.length === 0 && !isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
          {/* Empty state - could show hint */}
        </div>
      )}
    </div>
  );
}
