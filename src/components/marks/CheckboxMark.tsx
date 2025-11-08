import { Check, X } from 'lucide-react'
import { CheckboxMark as CheckboxMarkType } from '../../types'

interface CheckboxMarkProps {
  mark: CheckboxMarkType
  size?: number
}

export function CheckboxMark({ mark, size = 40 }: CheckboxMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1
  const strokeWidth = size > 30 ? 2 : 1.5

  return (
    <g opacity={opacity}>
      {/* Box outline */}
      <rect
        x={size * 0.1}
        y={size * 0.1}
        width={size * 0.8}
        height={size * 0.8}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        rx={size * 0.1}
      />

      {/* Checkmark */}
      {mark.state === 'checked' && (
        <Check
          size={size * 0.7}
          strokeWidth={strokeWidth + 0.5}
          style={{
            position: 'absolute',
            left: size * 0.15,
            top: size * 0.15,
          }}
        />
      )}

      {/* X mark */}
      {mark.state === 'crossed' && (
        <X
          size={size * 0.7}
          strokeWidth={strokeWidth + 0.5}
          style={{
            position: 'absolute',
            left: size * 0.15,
            top: size * 0.15,
          }}
        />
      )}
    </g>
  )
}
