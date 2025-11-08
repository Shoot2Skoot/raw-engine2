/**
 * Hotspot Component
 * Interactive region on a sheet where marks can be placed
 */

import { useState } from 'react';
import { Hotspot as HotspotType, Mark, Tool } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';
import { generateId } from '../../utils/gameEngine';

interface HotspotProps {
  hotspot: HotspotType;
  marks: Mark[];
  currentTool: Tool | null;
  onPlaceMark: (mark: Mark) => void;
  onRemoveMark: (markId: string) => void;
}

export function Hotspot({
  hotspot,
  marks,
  currentTool,
  onPlaceMark,
  onRemoveMark,
}: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showValuePicker, setShowValuePicker] = useState(false);

  const handleClick = () => {
    if (!currentTool) return;

    // Check if this mark type is allowed
    if (!hotspot.constraints.allowedMarkTypes.includes(currentTool.type)) {
      return;
    }

    // Check if max marks reached
    if (
      hotspot.constraints.maxMarks !== undefined &&
      marks.length >= hotspot.constraints.maxMarks
    ) {
      // If max is 1, replace the existing mark
      if (hotspot.constraints.maxMarks === 1 && marks.length === 1) {
        onRemoveMark(marks[0].id);
      } else {
        return;
      }
    }

    // For tools that need value selection, show picker
    if (
      currentTool.type === 'number' ||
      currentTool.type === 'color' ||
      currentTool.type === 'symbol'
    ) {
      setShowValuePicker(true);
      return;
    }

    // For checkbox and circle, cycle through states
    if (currentTool.type === 'checkbox') {
      const existingMark = marks.find((m) => m.type === 'checkbox');
      if (existingMark && existingMark.type === 'checkbox') {
        onRemoveMark(existingMark.id);
        const nextState =
          existingMark.state === 'empty'
            ? 'checked'
            : existingMark.state === 'checked'
            ? 'crossed'
            : 'empty';
        if (nextState !== 'empty') {
          onPlaceMark({
            id: generateId(),
            type: 'checkbox',
            hotspotId: hotspot.id,
            state: nextState,
            timestamp: Date.now(),
          });
        }
      } else {
        onPlaceMark({
          id: generateId(),
          type: 'checkbox',
          hotspotId: hotspot.id,
          state: 'checked',
          timestamp: Date.now(),
        });
      }
      return;
    }

    if (currentTool.type === 'circle') {
      const existingMark = marks.find((m) => m.type === 'circle');
      if (existingMark && existingMark.type === 'circle') {
        onRemoveMark(existingMark.id);
        const nextState =
          existingMark.state === 'empty'
            ? 'half'
            : existingMark.state === 'half'
            ? 'full'
            : 'empty';
        if (nextState !== 'empty') {
          onPlaceMark({
            id: generateId(),
            type: 'circle',
            hotspotId: hotspot.id,
            state: nextState,
            timestamp: Date.now(),
          });
        }
      } else {
        onPlaceMark({
          id: generateId(),
          type: 'circle',
          hotspotId: hotspot.id,
          state: 'half',
          timestamp: Date.now(),
        });
      }
      return;
    }
  };

  const handleValueSelect = (value: number | string) => {
    if (!currentTool) return;

    if (currentTool.type === 'number') {
      onPlaceMark({
        id: generateId(),
        type: 'number',
        hotspotId: hotspot.id,
        value: value as number,
        timestamp: Date.now(),
      });
    } else if (currentTool.type === 'color') {
      onPlaceMark({
        id: generateId(),
        type: 'color',
        hotspotId: hotspot.id,
        color: value as string,
        timestamp: Date.now(),
      });
    } else if (currentTool.type === 'symbol') {
      onPlaceMark({
        id: generateId(),
        type: 'symbol',
        hotspotId: hotspot.id,
        symbol: value as string,
        timestamp: Date.now(),
      });
    }

    setShowValuePicker(false);
  };

  // Render hotspot shape
  const renderShape = () => {
    const isInteractive = currentTool !== null;
    const strokeColor = isHovered && isInteractive ? '#3b82f6' : '#d1d5db';
    const strokeWidth = isHovered && isInteractive ? 2 : 1;
    const cursor = isInteractive ? 'pointer' : 'default';

    if (hotspot.shape === 'rectangle') {
      return (
        <rect
          x={hotspot.x}
          y={hotspot.y}
          width={hotspot.width}
          height={hotspot.height}
          fill="white"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{ cursor }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="touch-manipulation no-tap-highlight"
        />
      );
    }

    if (hotspot.shape === 'circle') {
      return (
        <circle
          cx={hotspot.cx}
          cy={hotspot.cy}
          r={hotspot.r}
          fill="white"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{ cursor }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="touch-manipulation no-tap-highlight"
        />
      );
    }

    if (hotspot.shape === 'polygon') {
      const points = hotspot.points.map((p) => `${p.x},${p.y}`).join(' ');
      return (
        <polygon
          points={points}
          fill="white"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{ cursor }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="touch-manipulation no-tap-highlight"
        />
      );
    }

    return null;
  };

  // Get bounding box for marks
  const getBounds = () => {
    if (hotspot.shape === 'rectangle') {
      return { x: hotspot.x, y: hotspot.y, width: hotspot.width, height: hotspot.height };
    }
    if (hotspot.shape === 'circle') {
      return {
        x: hotspot.cx - hotspot.r,
        y: hotspot.cy - hotspot.r,
        width: hotspot.r * 2,
        height: hotspot.r * 2,
      };
    }
    // For polygon, compute bounding box
    const xs = hotspot.points.map((p) => p.x);
    const ys = hotspot.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  const bounds = getBounds();

  return (
    <g>
      {renderShape()}
      {marks.map((mark) => (
        <g key={mark.id} transform={`translate(${bounds.x}, ${bounds.y})`}>
          <MarkRenderer mark={mark} size={Math.min(bounds.width, bounds.height)} />
        </g>
      ))}
      {showValuePicker && currentTool && (
        <ValuePicker
          tool={currentTool}
          bounds={bounds}
          onSelect={handleValueSelect}
          onClose={() => setShowValuePicker(false)}
        />
      )}
    </g>
  );
}

interface ValuePickerProps {
  tool: Tool;
  bounds: { x: number; y: number; width: number; height: number };
  onSelect: (value: number | string) => void;
  onClose: () => void;
}

function ValuePicker({ tool, bounds, onSelect }: ValuePickerProps) {
  if (tool.type === 'number') {
    const range = tool.config?.numberRange || { min: 1, max: 9 };
    const numbers = Array.from(
      { length: range.max - range.min + 1 },
      (_, i) => range.min + i
    );

    return (
      <foreignObject
        x={bounds.x}
        y={bounds.y + bounds.height + 5}
        width={200}
        height={100}
      >
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onSelect(num)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded"
            >
              {num}
            </button>
          ))}
        </div>
      </foreignObject>
    );
  }

  if (tool.type === 'color') {
    const colors = tool.config?.colors || [
      '#ef4444',
      '#f59e0b',
      '#10b981',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
    ];

    return (
      <foreignObject
        x={bounds.x}
        y={bounds.y + bounds.height + 5}
        width={200}
        height={100}
      >
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className="w-12 h-12 rounded border-2 border-gray-300 hover:border-gray-500"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </foreignObject>
    );
  }

  if (tool.type === 'symbol') {
    const symbols = tool.config?.symbols || ['⭐', '💎', '❤️', '■', '●', '▲'];

    return (
      <foreignObject
        x={bounds.x}
        y={bounds.y + bounds.height + 5}
        width={200}
        height={100}
      >
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1">
          {symbols.map((symbol) => (
            <button
              key={symbol}
              onClick={() => onSelect(symbol)}
              className="bg-gray-100 hover:bg-gray-200 text-2xl py-2 px-3 rounded"
            >
              {symbol}
            </button>
          ))}
        </div>
      </foreignObject>
    );
  }

  return null;
}
