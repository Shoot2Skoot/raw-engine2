import { TextMark as TextMarkType } from '../../types'

interface TextMarkProps {
  mark: TextMarkType
  size?: number
}

export function TextMark({ mark, size = 40 }: TextMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1
  const fontSize = mark.fontSize || size * 0.4

  const alignment = mark.alignment || 'center'
  let textAnchor: 'start' | 'middle' | 'end' = 'middle'
  let x = size / 2

  if (alignment === 'left') {
    textAnchor = 'start'
    x = size * 0.1
  } else if (alignment === 'right') {
    textAnchor = 'end'
    x = size * 0.9
  }

  return (
    <text
      x={x}
      y={size / 2}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={fontSize}
      fill="currentColor"
      opacity={opacity}
      className="select-none"
    >
      {mark.text}
    </text>
  )
}
