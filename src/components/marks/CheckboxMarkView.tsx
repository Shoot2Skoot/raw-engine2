/**
 * CheckboxMarkView - renders checkbox marks
 */

import React from 'react';
import { Check, X } from 'lucide-react';
import type { CheckboxMark } from '../../types';

interface CheckboxMarkViewProps {
  mark: CheckboxMark;
  className?: string;
}

export const CheckboxMarkView: React.FC<CheckboxMarkViewProps> = ({
  mark,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      {mark.state === 'checked' && (
        <Check className="w-3/4 h-3/4 text-green-600 stroke-[3]" />
      )}
      {mark.state === 'crossed' && (
        <X className="w-3/4 h-3/4 text-red-600 stroke-[3]" />
      )}
    </div>
  );
};
