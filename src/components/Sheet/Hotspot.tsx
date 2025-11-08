import { useMemo } from 'react';
import type { Hotspot, Mark } from '../../types';
import { MarkRenderer } from '../Marks/MarkRenderer';

interface HotspotProps {
  hotspot: Hotspot;
  marks: Mark[];
  onClick: () => void;
}

export function HotspotComponent({ hotspot, marks, onClick }: HotspotProps) {
  const style = useMemo(() => {
    switch (hotspot.shape) {
      case 'rectangle':
        return {
          left: `${hotspot.x}px`,
          top: `${hotspot.y}px`,
          width: `${hotspot.width}px`,
          height: `${hotspot.height}px`,
        };
      case 'circle':
        return {
          left: `${hotspot.cx - hotspot.r}px`,
          top: `${hotspot.cy - hotspot.r}px`,
          width: `${hotspot.r * 2}px`,
          height: `${hotspot.r * 2}px`,
          borderRadius: '50%',
        };
      default:
        return {};
    }
  }, [hotspot]);

  const polygonPath = useMemo(() => {
    if (hotspot.shape === 'polygon') {
      return hotspot.points.map((p) => `${p.x},${p.y}`).join(' ');
    }
    return '';
  }, [hotspot]);

  if (hotspot.shape === 'polygon') {
    // For polygon hotspots, we need to calculate bounding box
    const xs = hotspot.points.map((p) => p.x);
    const ys = hotspot.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return (
      <div
        className="absolute cursor-pointer"
        style={{
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${maxX - minX}px`,
          height: `${maxY - minY}px`,
        }}
        onClick={onClick}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${maxX - minX} ${maxY - minY}`}
        >
          <polygon
            points={polygonPath}
            fill="transparent"
            stroke='transparent'
            strokeWidth="2"
            className={`transition-all ${
              hotspot.disabled ? 'opacity-50' : 'hover:fill-blue-50'
            }`}
          />
        </svg>
        <MarkRenderer marks={marks} />
      </div>
    );
  }

  return (
    <div
      className={`absolute border-2 transition-all ${
        'border-transparent'
      } ${
        hotspot.disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
      } ${hotspot.readOnly ? 'cursor-default' : ''}`}
      style={style}
      onClick={hotspot.disabled || hotspot.readOnly ? undefined : onClick}
    >
      <MarkRenderer marks={marks} />
    </div>
  );
}
