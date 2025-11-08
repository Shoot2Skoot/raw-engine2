import React, { useState } from 'react';
import type { Hotspot as HotspotType, Mark, MarkType } from '../../types';
import { MarkRenderer } from '../marks/MarkRenderer';
import { generateId } from '../../utils/helpers';

interface HotspotProps {
  hotspot: HotspotType;
  marks: Mark[];
  selectedTool: MarkType | null;
  onPlaceMark: (mark: Mark) => void;
  onRemoveMark: (markId: string) => void;
}

export function Hotspot({
  hotspot,
  marks,
  selectedTool,
  onPlaceMark,
  onRemoveMark,
}: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showValuePicker, setShowValuePicker] = useState(false);

  const isReadonly = hotspot.constraints.readonly;
  const canInteract = !isReadonly && selectedTool !== null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isReadonly || !selectedTool) return;

    // Check if tool is allowed
    if (!hotspot.constraints.allowedMarkTypes.includes(selectedTool)) {
      console.warn(`Tool ${selectedTool} not allowed on this hotspot`);
      return;
    }

    // Check mark limit
    if (
      hotspot.constraints.maxMarks > 0 &&
      marks.length >= hotspot.constraints.maxMarks
    ) {
      console.warn('Maximum marks reached for this hotspot');
      return;
    }

    // Handle different mark types
    switch (selectedTool) {
      case 'checkbox':
        handleCheckboxClick();
        break;

      case 'number':
        setShowValuePicker(true);
        break;

      case 'color':
        handleColorClick('#3b82f6'); // Default blue
        break;

      case 'circle':
        handleCircleClick();
        break;

      case 'symbol':
        handleSymbolClick('star');
        break;

      case 'text':
        handleTextClick();
        break;

      default:
        break;
    }
  };

  const handleCheckboxClick = () => {
    const existingCheckbox = marks.find((m) => m.type === 'checkbox');

    if (existingCheckbox && existingCheckbox.type === 'checkbox') {
      // Cycle through states
      const nextState =
        existingCheckbox.state === 'empty'
          ? 'checked'
          : existingCheckbox.state === 'checked'
          ? 'crossed'
          : 'empty';

      if (nextState === 'empty' && hotspot.constraints.canUnmark) {
        onRemoveMark(existingCheckbox.id);
      } else {
        const updatedMark: Mark = {
          ...existingCheckbox,
          state: nextState,
          timestamp: Date.now(),
        };
        onPlaceMark(updatedMark);
      }
    } else {
      // Place new checkbox
      const mark: Mark = {
        id: generateId(),
        hotspotId: hotspot.id,
        type: 'checkbox',
        state: 'checked',
        isPencil: false,
        timestamp: Date.now(),
      };
      onPlaceMark(mark);
    }
  };

  const handleNumberClick = (value: number) => {
    const mark: Mark = {
      id: generateId(),
      hotspotId: hotspot.id,
      type: 'number',
      value,
      isPencil: false,
      timestamp: Date.now(),
    };
    onPlaceMark(mark);
    setShowValuePicker(false);
  };

  const handleColorClick = (color: string) => {
    const mark: Mark = {
      id: generateId(),
      hotspotId: hotspot.id,
      type: 'color',
      color,
      opacity: 0.3,
      isPencil: false,
      timestamp: Date.now(),
    };
    onPlaceMark(mark);
  };

  const handleCircleClick = () => {
    const existingCircle = marks.find((m) => m.type === 'circle');

    if (existingCircle && existingCircle.type === 'circle') {
      const nextState =
        existingCircle.state === 'empty'
          ? 'half'
          : existingCircle.state === 'half'
          ? 'full'
          : 'empty';

      if (nextState === 'empty' && hotspot.constraints.canUnmark) {
        onRemoveMark(existingCircle.id);
      } else {
        const updatedMark: Mark = {
          ...existingCircle,
          state: nextState,
          timestamp: Date.now(),
        };
        onPlaceMark(updatedMark);
      }
    } else {
      const mark: Mark = {
        id: generateId(),
        hotspotId: hotspot.id,
        type: 'circle',
        state: 'full',
        isPencil: false,
        timestamp: Date.now(),
      };
      onPlaceMark(mark);
    }
  };

  const handleSymbolClick = (symbol: string) => {
    const mark: Mark = {
      id: generateId(),
      hotspotId: hotspot.id,
      type: 'symbol',
      symbol,
      isPencil: false,
      timestamp: Date.now(),
    };
    onPlaceMark(mark);
  };

  const handleTextClick = () => {
    const text = prompt('Enter text:');
    if (text) {
      const mark: Mark = {
        id: generateId(),
        hotspotId: hotspot.id,
        type: 'text',
        text,
        isPencil: false,
        timestamp: Date.now(),
      };
      onPlaceMark(mark);
    }
  };

  // Render hotspot based on shape
  const renderHotspot = () => {
    const baseStyles = `
      absolute
      transition-all
      ${canInteract ? 'cursor-pointer hover:bg-blue-100/30' : ''}
      ${isHovered && canInteract ? 'ring-2 ring-blue-400' : ''}
    `;

    switch (hotspot.shape) {
      case 'rectangle': {
        const { position, dimensions } = hotspot;
        return (
          <div
            className={`${baseStyles} border border-gray-300 bg-white rounded`}
            style={{
              left: position.x,
              top: position.y,
              width: dimensions.width,
              height: dimensions.height,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Render marks */}
            <div className="relative w-full h-full">
              {marks.map((mark) => (
                <div
                  key={mark.id}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MarkRenderer mark={mark} size={dimensions.height * 0.6} />
                </div>
              ))}
            </div>

            {/* Number picker overlay */}
            {showValuePicker && (
              <NumberPicker
                min={hotspot.constraints.numberRange?.min || 0}
                max={hotspot.constraints.numberRange?.max || 99}
                onSelect={handleNumberClick}
                onCancel={() => setShowValuePicker(false)}
              />
            )}
          </div>
        );
      }

      case 'circle': {
        const { position, radius } = hotspot;
        const diameter = radius * 2;
        return (
          <div
            className={`${baseStyles} border border-gray-300 bg-white rounded-full`}
            style={{
              left: position.x - radius,
              top: position.y - radius,
              width: diameter,
              height: diameter,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full">
              {marks.map((mark) => (
                <div
                  key={mark.id}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MarkRenderer mark={mark} size={radius * 1.2} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'polygon': {
        const { vertices } = hotspot;
        // Calculate bounding box
        const xs = vertices.map((v) => v.x);
        const ys = vertices.map((v) => v.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        const width = maxX - minX;
        const height = maxY - minY;

        // Create SVG path
        const pathData = vertices
          .map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x - minX} ${v.y - minY}`)
          .join(' ') + ' Z';

        return (
          <div
            className="absolute"
            style={{
              left: minX,
              top: minY,
              width,
              height,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg
              width={width}
              height={height}
              className={canInteract ? 'cursor-pointer' : ''}
            >
              <path
                d={pathData}
                fill="white"
                stroke="#d1d5db"
                strokeWidth={1}
                className={`transition-all ${
                  isHovered && canInteract ? 'fill-blue-100/30' : ''
                }`}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {marks.map((mark) => (
                <div key={mark.id} className="absolute">
                  <MarkRenderer mark={mark} size={Math.min(width, height) * 0.6} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return renderHotspot();
}

// ============================================================================
// NUMBER PICKER COMPONENT
// ============================================================================

interface NumberPickerProps {
  min: number;
  max: number;
  onSelect: (value: number) => void;
  onCancel: () => void;
}

function NumberPicker({ min, max, onSelect, onCancel }: NumberPickerProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= min && value <= max) {
      onSelect(value);
    }
  };

  // Quick number buttons for common ranges
  const showQuickButtons = max - min <= 20;
  const quickNumbers = showQuickButtons
    ? Array.from({ length: Math.min(max - min + 1, 12) }, (_, i) => min + i)
    : [];

  return (
    <div
      className="absolute inset-0 bg-white border-2 border-blue-500 rounded z-50 p-2 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex gap-1 mb-2">
          <input
            type="number"
            min={min}
            max={max}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            placeholder={`${min}-${max}`}
            autoFocus
          />
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            OK
          </button>
        </form>

        {showQuickButtons && (
          <div className="grid grid-cols-4 gap-1 flex-1">
            {quickNumbers.map((num) => (
              <button
                key={num}
                onClick={() => onSelect(num)}
                className="px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-sm font-medium"
              >
                {num}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onCancel}
          className="mt-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
