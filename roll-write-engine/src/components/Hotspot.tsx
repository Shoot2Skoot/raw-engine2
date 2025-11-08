/**
 * Hotspot rendering and interaction component
 */

import React from 'react';
import type { Hotspot as HotspotType } from '../types';
import { Mark } from './Mark';

interface HotspotProps {
  hotspot: HotspotType;
  customSymbols: Record<string, string>;
  onClick: () => void;
  showBorders?: boolean;
}

export const Hotspot: React.FC<HotspotProps> = ({ hotspot, customSymbols, onClick, showBorders = false }) => {
  const enabled = hotspot.enabled !== false;

  const renderShape = () => {
    switch (hotspot.shape) {
      case 'rectangle':
        return (
          <rect
            x={hotspot.x}
            y={hotspot.y}
            width={hotspot.width}
            height={hotspot.height}
            fill="transparent"
            stroke={showBorders ? '#94a3b8' : 'transparent'}
            strokeWidth={showBorders ? 1 : 0}
            strokeDasharray={showBorders ? '4 2' : '0'}
            className={enabled ? 'cursor-pointer hover:fill-blue-100/20' : 'cursor-not-allowed'}
            onClick={enabled ? onClick : undefined}
          />
        );

      case 'circle':
        return (
          <circle
            cx={hotspot.cx}
            cy={hotspot.cy}
            r={hotspot.radius}
            fill="transparent"
            stroke={showBorders ? '#94a3b8' : 'transparent'}
            strokeWidth={showBorders ? 1 : 0}
            strokeDasharray={showBorders ? '4 2' : '0'}
            className={enabled ? 'cursor-pointer hover:fill-blue-100/20' : 'cursor-not-allowed'}
            onClick={enabled ? onClick : undefined}
          />
        );

      case 'polygon':
        const points = hotspot.points.map((p) => `${p.x},${p.y}`).join(' ');
        return (
          <polygon
            points={points}
            fill="transparent"
            stroke={showBorders ? '#94a3b8' : 'transparent'}
            strokeWidth={showBorders ? 1 : 0}
            strokeDasharray={showBorders ? '4 2' : '0'}
            className={enabled ? 'cursor-pointer hover:fill-blue-100/20' : 'cursor-not-allowed'}
            onClick={enabled ? onClick : undefined}
          />
        );
    }
  };

  const renderMarks = () => {
    if (!hotspot.marks || hotspot.marks.length === 0) return null;

    let width: number, height: number;
    if (hotspot.shape === 'rectangle') {
      width = hotspot.width;
      height = hotspot.height;
    } else if (hotspot.shape === 'circle') {
      width = height = hotspot.radius * 2;
    } else {
      // For polygons, calculate bounding box
      const xs = hotspot.points.map((p) => p.x);
      const ys = hotspot.points.map((p) => p.y);
      width = Math.max(...xs) - Math.min(...xs);
      height = Math.max(...ys) - Math.min(...ys);
    }

    return (
      <g>
        {hotspot.marks.map((mark, index) => {
          if (mark.type === 'line') {
            // Lines are rendered separately
            return null;
          }

          const x = hotspot.shape === 'rectangle' ? hotspot.x : hotspot.shape === 'circle' ? hotspot.cx - hotspot.radius : Math.min(...hotspot.points.map((p) => p.x));
          const y = hotspot.shape === 'rectangle' ? hotspot.y : hotspot.shape === 'circle' ? hotspot.cy - hotspot.radius : Math.min(...hotspot.points.map((p) => p.y));

          return (
            <g key={index} transform={`translate(${x}, ${y})`}>
              <Mark mark={mark} width={width} height={height} customSymbols={customSymbols} />
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <g>
      {renderShape()}
      {renderMarks()}
    </g>
  );
};
