import React, { useState } from 'react';
import type {
  Hotspot as HotspotType,
  RectHotspot,
  CircleHotspot,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
} from '../types';
import { useGame } from '../context/GameContext';
import { MarkRenderer } from './MarkRenderer';

interface HotspotProps {
  hotspot: HotspotType;
}

export const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const { state, addMark, removeMark, updateMark } = useGame();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Get marks for this hotspot
  const marks = state.marks.filter((m) => m.hotspotId === hotspot.id);

  // Check if we can add more marks
  const canAddMark =
    !hotspot.disabled &&
    !hotspot.readonly &&
    (hotspot.maxMarks === undefined || marks.length < hotspot.maxMarks);

  // Handle click
  const handleClick = () => {
    if (!canAddMark) return;

    const currentTool = state.currentTool;

    // Check if this tool is allowed
    if (!hotspot.allowedMarkTypes.includes(currentTool)) {
      return;
    }

    switch (currentTool) {
      case 'checkbox': {
        // Cycle through checkbox states
        const existingCheckbox = marks.find((m) => m.type === 'checkbox') as
          | CheckboxMark
          | undefined;
        if (existingCheckbox) {
          const nextState =
            existingCheckbox.state === 'empty'
              ? 'checked'
              : existingCheckbox.state === 'checked'
              ? 'crossed'
              : 'empty';
          if (nextState === 'empty') {
            removeMark(existingCheckbox.id);
          } else {
            updateMark(existingCheckbox.id, { state: nextState });
          }
        } else {
          const newMark: CheckboxMark = {
            id: crypto.randomUUID(),
            hotspotId: hotspot.id,
            type: 'checkbox',
            state: 'checked',
            createdAt: Date.now(),
          };
          addMark(newMark);
        }
        break;
      }

      case 'number': {
        // Show input for number entry
        setShowInput(true);
        break;
      }

      case 'color': {
        // For now, use a default color (will be improved with color palette)
        const existingColor = marks.find((m) => m.type === 'color') as
          | ColorMark
          | undefined;
        if (existingColor) {
          removeMark(existingColor.id);
        } else {
          const newMark: ColorMark = {
            id: crypto.randomUUID(),
            hotspotId: hotspot.id,
            type: 'color',
            color: '#3b82f6',
            opacity: 0.3,
            createdAt: Date.now(),
          };
          addMark(newMark);
        }
        break;
      }

      case 'circle': {
        // Cycle through circle states
        const existingCircle = marks.find((m) => m.type === 'circle') as
          | CircleMark
          | undefined;
        if (existingCircle) {
          const nextFill =
            existingCircle.fill === 'empty'
              ? 'half'
              : existingCircle.fill === 'half'
              ? 'full'
              : 'empty';
          if (nextFill === 'empty') {
            removeMark(existingCircle.id);
          } else {
            updateMark(existingCircle.id, { fill: nextFill });
          }
        } else {
          const newMark: CircleMark = {
            id: crypto.randomUUID(),
            hotspotId: hotspot.id,
            type: 'circle',
            fill: 'half',
            createdAt: Date.now(),
          };
          addMark(newMark);
        }
        break;
      }
    }
  };

  // Handle number input
  const handleNumberSubmit = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      const existingNumber = marks.find((m) => m.type === 'number');
      if (existingNumber) {
        updateMark(existingNumber.id, { value });
      } else {
        const newMark: NumberMark = {
          id: crypto.randomUUID(),
          hotspotId: hotspot.id,
          type: 'number',
          value,
          createdAt: Date.now(),
        };
        addMark(newMark);
      }
    }
    setShowInput(false);
    setInputValue('');
  };

  // Get position and size
  const getStyle = (): React.CSSProperties => {
    if (hotspot.shape === 'rect') {
      const rect = hotspot as RectHotspot;
      return {
        position: 'absolute',
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      };
    } else if (hotspot.shape === 'circle') {
      const circle = hotspot as CircleHotspot;
      return {
        position: 'absolute',
        left: `${circle.cx - circle.radius}px`,
        top: `${circle.cy - circle.radius}px`,
        width: `${circle.radius * 2}px`,
        height: `${circle.radius * 2}px`,
        borderRadius: '50%',
      };
    }
    // Polygon - approximate with bounding box for now
    return { position: 'absolute' };
  };

  return (
    <>
      <div
        className={`no-tap-highlight ${
          !hotspot.disabled && !hotspot.readonly ? 'cursor-pointer hover:bg-blue-50' : ''
        } transition-colors flex items-center justify-center relative`}
        style={getStyle()}
        onClick={handleClick}
      >
        {/* Render marks */}
        {marks.map((mark) => (
          <MarkRenderer key={mark.id} mark={mark} hotspot={hotspot} />
        ))}

        {/* Number input overlay */}
        {showInput && (
          <div
            className="absolute inset-0 bg-white border-2 border-blue-500 z-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="number"
              className="w-full h-full text-center text-2xl outline-none"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNumberSubmit();
                if (e.key === 'Escape') {
                  setShowInput(false);
                  setInputValue('');
                }
              }}
              onBlur={handleNumberSubmit}
            />
          </div>
        )}
      </div>
    </>
  );
};
