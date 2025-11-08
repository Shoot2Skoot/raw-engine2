import React from 'react';
import type {
  Mark,
  CheckboxMark,
  NumberMark,
  ColorMark,
  CircleMark,
  SymbolMark,
  TextMark,
  Hotspot,
} from '../types';
import { Check, X } from 'lucide-react';

interface MarkRendererProps {
  mark: Mark;
  hotspot: Hotspot;
}

export const MarkRenderer: React.FC<MarkRendererProps> = ({ mark, hotspot }) => {
  // Common styling for pencil marks
  const pencilStyle = mark.isPencil
    ? { opacity: 0.5, filter: 'grayscale(50%)' }
    : {};

  switch (mark.type) {
    case 'checkbox': {
      const checkboxMark = mark as CheckboxMark;
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={pencilStyle}
        >
          {checkboxMark.state === 'checked' && (
            <Check className="w-3/4 h-3/4 text-green-600 stroke-[3]" />
          )}
          {checkboxMark.state === 'crossed' && (
            <X className="w-3/4 h-3/4 text-red-600 stroke-[3]" />
          )}
        </div>
      );
    }

    case 'number': {
      const numberMark = mark as NumberMark;
      return (
        <div
          className="absolute inset-0 flex items-center justify-center font-bold text-gray-900"
          style={{
            fontSize: '1.5rem',
            ...pencilStyle,
          }}
        >
          {numberMark.value}
        </div>
      );
    }

    case 'color': {
      const colorMark = mark as ColorMark;
      return (
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundColor: colorMark.color,
            opacity: colorMark.opacity || 0.3,
            ...pencilStyle,
          }}
        />
      );
    }

    case 'circle': {
      const circleMark = mark as CircleMark;
      const isCircleHotspot = hotspot.shape === 'circle';

      if (circleMark.fill === 'empty') {
        return (
          <div
            className="absolute inset-0 border-4 border-gray-400"
            style={{
              borderRadius: isCircleHotspot ? '50%' : '4px',
              ...pencilStyle,
            }}
          />
        );
      }

      if (circleMark.fill === 'half') {
        return (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: isCircleHotspot ? '50%' : '4px',
            }}
          >
            <div
              className="absolute inset-0 bg-blue-600"
              style={{
                clipPath: isCircleHotspot
                  ? 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)'
                  : 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
                opacity: 0.7,
                ...pencilStyle,
              }}
            />
          </div>
        );
      }

      if (circleMark.fill === 'full') {
        return (
          <div
            className="absolute inset-0 bg-blue-600"
            style={{
              borderRadius: isCircleHotspot ? '50%' : '4px',
              opacity: 0.7,
              ...pencilStyle,
            }}
          />
        );
      }
      return null;
    }

    case 'symbol': {
      const symbolMark = mark as SymbolMark;
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: '2rem',
            color: symbolMark.color || '#000',
            ...pencilStyle,
          }}
        >
          {symbolMark.symbol}
        </div>
      );
    }

    case 'text': {
      const textMark = mark as TextMark;
      return (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm font-medium px-1"
          style={{
            wordBreak: 'break-word',
            ...pencilStyle,
          }}
        >
          {textMark.text}
        </div>
      );
    }

    case 'line': {
      // Lines are rendered differently, at the sheet level
      return null;
    }

    default:
      return null;
  }
};
