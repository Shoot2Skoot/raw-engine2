import { NumberMark as NumberMarkType } from '../../types'

interface NumberMarkProps {
  mark: NumberMarkType
  size?: number
}

export function NumberMark({ mark, size = 40 }: NumberMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1
  const fontSize = size * 0.6

  return (
    <text
      x={size / 2}
      y={size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight="600"
      fill="currentColor"
      opacity={opacity}
      className="select-none"
    >
      {mark.value}
    </text>
  )
}
