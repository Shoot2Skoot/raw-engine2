import { ColorMark as ColorMarkType } from '../../types'

interface ColorMarkProps {
  mark: ColorMarkType
  size?: number
  shape?: 'rectangle' | 'circle'
}

export function ColorMark({ mark, size = 40, shape = 'rectangle' }: ColorMarkProps) {
  const opacity = mark.permanence === 'pencil' ? (mark.opacity || 0.5) * 0.5 : (mark.opacity || 0.5)

  if (shape === 'circle') {
    return (
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size * 0.4}
        fill={mark.color}
        opacity={opacity}
      />
    )
  }

  return (
    <rect
      x={size * 0.05}
      y={size * 0.05}
      width={size * 0.9}
      height={size * 0.9}
      fill={mark.color}
      opacity={opacity}
      rx={size * 0.05}
    />
  )
}
