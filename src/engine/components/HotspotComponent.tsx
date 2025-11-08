/**
 * Hotspot Component - Interactive region that can be marked
 */

import React, { useState } from 'react';
import type { Hotspot, Mark, Tool, Rectangle } from '../types';
import { isRectangle } from '../types';
import { getShapeCenter } from '../utils/geometry-utils';
import { MarkRenderer } from './MarkRenderer';

interface HotspotComponentProps {
  hotspot: Hotspot;
  marks: Mark[];
  selectedTool: Tool;
  onMark: (mark: Mark) => void;
  onRemoveMark: (index: number) => void;
}

export const HotspotComponent: React.FC<HotspotComponentProps> = ({
  hotspot,
  marks,
  selectedTool,
  onMark,
  onRemoveMark,
}) => {
  const [showNumberInput, setShowNumberInput] = useState(false);

  // Get shape bounds for positioning
  let bounds: Rectangle;
  if (isRectangle(hotspot.shape)) {
    bounds = hotspot.shape;
  } else {
    bounds = {
      x: getShapeCenter(hotspot.shape).x - 25,
      y: getShapeCenter(hotspot.shape).y - 25,
      width: 50,
      height: 50,
    };
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Eraser is always allowed (it removes marks, doesn't place them)
    if (selectedTool.type !== 'eraser') {
      // Check if this mark type is allowed
      if (!hotspot.constraints.allowedMarkTypes.includes(selectedTool.type)) {
        return;
      }
    }

    // Check max marks constraint
    if (
      hotspot.constraints.maxMarks !== undefined &&
      marks.length >= hotspot.constraints.maxMarks
    ) {
      // If at max, cycle or replace
      if (selectedTool.type === 'checkbox' && marks.length > 0) {
        // Cycle checkbox state
        const lastMark = marks[marks.length - 1];
        if (lastMark.type === 'checkbox') {
          onRemoveMark(marks.length - 1);
          const nextState =
            lastMark.state === 'empty'
              ? 'checked'
              : lastMark.state === 'checked'
              ? 'crossed'
              : 'empty';

          if (nextState !== 'empty') {
            onMark({
              type: 'checkbox',
              state: nextState,
              permanence: 'pen',
            });
          }
        }
      }
      return;
    }

    // Create mark based on selected tool
    switch (selectedTool.type) {
      case 'checkbox':
        onMark({
          type: 'checkbox',
          state: 'checked',
          permanence: 'pen',
        });
        break;

      case 'number':
        setShowNumberInput(true);
        break;

      case 'color':
        onMark({
          type: 'color',
          color: selectedTool.palette[0],
          permanence: 'pen',
        });
        break;

      case 'circle':
        onMark({
          type: 'circle',
          state: 'full',
          permanence: 'pen',
        });
        break;

      case 'eraser':
        if (marks.length > 0) {
          onRemoveMark(marks.length - 1);
        }
        break;

      default:
        break;
    }
  };

  const handleNumberSubmit = (value: number) => {
    onMark({
      type: 'number',
      value,
      permanence: 'pen',
    });
    setShowNumberInput(false);
  };

  return (
    <>
      <div
        className="absolute cursor-pointer border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        style={{
          left: bounds.x,
          top: bounds.y,
          width: bounds.width,
          height: bounds.height,
          backgroundColor: hotspot.style?.backgroundColor || 'transparent',
          borderWidth: hotspot.style?.borderWidth || 1,
          borderColor: hotspot.style?.borderColor || '#d1d5db',
          zIndex: hotspot.zIndex || 1,
        }}
        onClick={handleClick}
      >
        {/* Render marks */}
        <div className="relative w-full h-full">
          {marks.map((mark, index) => (
            <div key={index} className="absolute inset-0">
              <MarkRenderer mark={mark} size={Math.min(bounds.width, bounds.height)} />
            </div>
          ))}
        </div>

        {/* Label (optional) */}
        {hotspot.label && (
          <div className="absolute top-0 left-0 text-xs text-gray-500 px-1">{hotspot.label}</div>
        )}
      </div>

      {/* Number input modal */}
      {showNumberInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Enter Number</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-xl font-bold"
                  onClick={() => handleNumberSubmit(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowNumberInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
