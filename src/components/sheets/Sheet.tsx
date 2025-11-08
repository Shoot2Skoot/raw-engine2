/**
 * Sheet Component - Renders a game sheet with hotspots and marks
 */

import React, { useState, useRef } from 'react';
import type { Sheet as SheetType, Hotspot, Mark } from '../../types';
import { useGame } from '../../context/GameContext';
import { MarkRenderer } from '../marks/MarkRenderer';
import { findHotspotAtPoint } from '../../utils/gameState';

interface SheetProps {
  sheet: SheetType;
  marks: Mark[];
}

export function Sheet({ sheet, marks }: SheetProps) {
  const { state, addMark } = useGame();
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSheetDimensions = () => {
    if (sheet.layout.type === 'grid') {
      const layout = sheet.layout;
      const cellWidth = layout.cellWidth || 60;
      const cellHeight = layout.cellHeight || 60;
      return {
        width: layout.offsetX + layout.columns * (cellWidth + layout.gap),
        height: layout.offsetY + layout.rows * (cellHeight + layout.gap),
      };
    } else if (sheet.layout.type === 'image') {
      return {
        width: sheet.layout.width,
        height: sheet.layout.height,
      };
    } else if (sheet.layout.type === 'freeform') {
      return {
        width: sheet.layout.width,
        height: sheet.layout.height,
      };
    }
    return { width: 800, height: 600 };
  };

  const dimensions = getSheetDimensions();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const hotspot = findHotspotAtPoint({ x, y }, sheet.hotspots);

    if (hotspot) {
      handleHotspotClick(hotspot, event.clientX, event.clientY);
    }
  };

  const handleHotspotClick = (hotspot: Hotspot, clientX: number, clientY: number) => {
    const toolType = state.activeTool.config.type;

    if (toolType === 'number') {
      // Show number input dialog
      setSelectedHotspot(hotspot);
      setInputPosition({ x: clientX, y: clientY });
      setShowInput(true);
    } else if (toolType === 'checkbox') {
      // Toggle checkbox state
      const existingMark = marks.find(
        (m) => m.hotspotId === hotspot.id && m.type === 'checkbox'
      );

      if (existingMark) {
        // Cycle through states: empty → checked → crossed → empty
        const currentState = (existingMark as any).state;
        let newState: 'empty' | 'checked' | 'crossed' = 'checked';

        if (currentState === 'empty') newState = 'checked';
        else if (currentState === 'checked') newState = 'crossed';
        else newState = 'empty';

        // For now, we'll remove and add a new mark
        // In a full implementation, we'd use modifyMark
        addMark({
          type: 'checkbox',
          hotspotId: hotspot.id,
          state: newState,
          permanence: state.activeTool.permanence,
        } as any);
      } else {
        addMark({
          type: 'checkbox',
          hotspotId: hotspot.id,
          state: 'checked',
          permanence: state.activeTool.permanence,
        } as any);
      }
    } else if (toolType === 'color') {
      const color = state.activeTool.selectedColor || '#3b82f6';
      addMark({
        type: 'color',
        hotspotId: hotspot.id,
        color,
        opacity: 0.5,
        permanence: state.activeTool.permanence,
      } as any);
    }
  };

  const handleNumberSubmit = (value: number) => {
    if (selectedHotspot) {
      addMark({
        type: 'number',
        hotspotId: selectedHotspot.id,
        value,
        permanence: state.activeTool.permanence,
      } as any);
    }
    setShowInput(false);
    setSelectedHotspot(null);
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full border border-gray-300 bg-white cursor-pointer"
        onClick={handleClick}
      >
        {/* Background */}
        {sheet.layout.type === 'grid' && sheet.layout.backgroundColor && (
          <rect
            x={sheet.layout.offsetX}
            y={sheet.layout.offsetY}
            width={dimensions.width - sheet.layout.offsetX}
            height={dimensions.height - sheet.layout.offsetY}
            fill={sheet.layout.backgroundColor}
          />
        )}

        {/* Render hotspots */}
        {sheet.hotspots.map((hotspot) => (
          <g key={hotspot.id}>
            {renderHotspot(hotspot, hoveredHotspot === hotspot.id)}
          </g>
        ))}

        {/* Render marks */}
        {marks.map((mark) => {
          const hotspot = sheet.hotspots.find((h) => h.id === mark.hotspotId);
          if (!hotspot) return null;
          return <MarkRenderer key={mark.id} mark={mark} hotspot={hotspot} />;
        })}
      </svg>

      {/* Number input dialog */}
      {showInput && (
        <NumberInputDialog
          position={inputPosition}
          onSubmit={handleNumberSubmit}
          onCancel={() => setShowInput(false)}
        />
      )}
    </div>
  );
}

function renderHotspot(hotspot: Hotspot, isHovered: boolean) {
  const { shape } = hotspot;
  const fillColor = isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
  const strokeColor = isHovered ? '#3b82f6' : '#d1d5db';
  const strokeWidth = isHovered ? 2 : 1;

  if (shape.type === 'rect') {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  } else if (shape.type === 'circle') {
    return (
      <circle
        cx={shape.center.x}
        cy={shape.center.y}
        r={shape.radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  } else if (shape.type === 'polygon') {
    const points = shape.vertices.map((v) => `${v.x},${v.y}`).join(' ');
    return (
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  return null;
}

interface NumberInputDialogProps {
  position: { x: number; y: number };
  onSubmit: (value: number) => void;
  onCancel: () => void;
}

function NumberInputDialog({ position, onSubmit, onCancel }: NumberInputDialogProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value);
    if (!isNaN(num)) {
      onSubmit(num);
    }
  };

  return (
    <div
      className="fixed bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 z-50"
      style={{ left: position.x, top: position.y }}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter number"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
