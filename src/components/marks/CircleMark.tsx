import { CircleMark as CircleMarkType } from '../../types'

interface CircleMarkProps {
  mark: CircleMarkType
  size?: number
}

export function CircleMark({ mark, size = 40 }: CircleMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1
  const strokeWidth = size > 30 ? 2 : 1.5
  const radius = size * 0.35

  return (
    <g opacity={opacity}>
      {/* Circle outline */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* Half fill */}
      {mark.state === 'half' && (
        <path
          d={`
            M ${size / 2} ${size / 2 - radius}
            A ${radius} ${radius} 0 0 1 ${size / 2} ${size / 2 + radius}
            Z
          `}
          fill="currentColor"
        />
      )}

      {/* Full fill */}
      {mark.state === 'full' && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="currentColor"
        />
      )}
    </g>
  )
}
