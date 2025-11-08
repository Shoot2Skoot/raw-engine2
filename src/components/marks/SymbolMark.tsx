import { SymbolMark as SymbolMarkType } from '../../types'
import { Star, Square, Circle, Triangle, Heart, Diamond, type LucideIcon } from 'lucide-react'

interface SymbolMarkProps {
  mark: SymbolMarkType
  size?: number
}

const SYMBOL_ICONS: Record<string, LucideIcon> = {
  star: Star,
  square: Square,
  circle: Circle,
  triangle: Triangle,
  heart: Heart,
  diamond: Diamond,
}

export function SymbolMark({ mark, size = 40 }: SymbolMarkProps) {
  const opacity = mark.permanence === 'pencil' ? 0.5 : 1
  const iconSize = size * 0.7

  const IconComponent = SYMBOL_ICONS[mark.symbol.toLowerCase()]

  if (IconComponent) {
    return (
      <g opacity={opacity}>
        <foreignObject x={size * 0.15} y={size * 0.15} width={iconSize} height={iconSize}>
          <IconComponent size={iconSize} color={mark.color || 'currentColor'} />
        </foreignObject>
      </g>
    )
  }

  // Fallback: render as text/unicode
  return (
    <text
      x={size / 2}
      y={size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size * 0.6}
      fill={mark.color || 'currentColor'}
      opacity={opacity}
      className="select-none"
    >
      {mark.symbol}
    </text>
  )
}
