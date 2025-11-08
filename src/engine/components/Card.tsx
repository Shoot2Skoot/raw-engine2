/**
 * Card Component
 * Renders a single card with its fields
 */

import React from 'react';
import type { Card as CardType, CardField } from '../types';
import { Star, Diamond, Heart, Square, Circle } from 'lucide-react';

interface CardProps {
  card: CardType;
  faceUp?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const CardComponent: React.FC<CardProps> = ({
  card,
  faceUp = true,
  size = 'medium',
  onClick,
}) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-48 h-72',
    large: 'w-64 h-96',
  };

  const renderFieldValue = (field: CardField) => {
    if (field.type === 'number') {
      return (
        <div
          className={`font-bold ${
            field.displayProps?.size === 'large'
              ? 'text-4xl'
              : field.displayProps?.size === 'small'
              ? 'text-lg'
              : 'text-2xl'
          }`}
          style={{ color: field.displayProps?.color }}
        >
          {field.value}
        </div>
      );
    }

    if (field.type === 'text') {
      return (
        <div
          className={`font-medium ${
            field.displayProps?.size === 'large'
              ? 'text-2xl'
              : field.displayProps?.size === 'small'
              ? 'text-sm'
              : 'text-lg'
          }`}
          style={{ color: field.displayProps?.color }}
        >
          {field.value}
        </div>
      );
    }

    if (field.type === 'symbol') {
      const symbolIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
        star: Star,
        diamond: Diamond,
        heart: Heart,
        square: Square,
        circle: Circle,
      };

      const Icon = symbolIcons[field.value as string] || Star;
      const iconSize =
        field.displayProps?.size === 'large' ? 48 : field.displayProps?.size === 'small' ? 24 : 32;

      return <Icon size={iconSize} color={field.displayProps?.color || '#1f2937'} />;
    }

    if (field.type === 'color') {
      return (
        <div
          className="w-12 h-12 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: field.value as string }}
        />
      );
    }

    if (field.type === 'image') {
      return (
        <img
          src={field.value as string}
          alt={field.name}
          className="max-w-full max-h-full object-contain"
        />
      );
    }

    return null;
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden
        ${onClick ? 'cursor-pointer hover:border-blue-400 transition-colors' : ''}
      `}
      onClick={onClick}
    >
      {faceUp ? (
        // Front side - show card fields
        card.frontImage ? (
          <img src={card.frontImage} alt="Card" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full p-4 flex flex-col gap-3">
            {card.fields.map((field, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-center
                  ${
                    field.displayProps?.position === 'top'
                      ? 'self-start'
                      : field.displayProps?.position === 'bottom'
                      ? 'self-end'
                      : ''
                  }
                `}
              >
                {renderFieldValue(field)}
              </div>
            ))}
          </div>
        )
      ) : (
        // Back side
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
          {card.backImage ? (
            <img src={card.backImage} alt="Card back" className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-bold text-white opacity-50">?</div>
          )}
        </div>
      )}
    </div>
  );
};
