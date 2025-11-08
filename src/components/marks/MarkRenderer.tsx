import { Mark } from '../../types'
import { CheckboxMark } from './CheckboxMark'
import { NumberMark } from './NumberMark'
import { ColorMark } from './ColorMark'
import { CircleMark } from './CircleMark'
import { TextMark } from './TextMark'
import { SymbolMark } from './SymbolMark'

interface MarkRendererProps {
  mark: Mark
  size?: number
}

/**
 * Main mark renderer - delegates to specific mark components based on type
 */
export function MarkRenderer({ mark, size = 40 }: MarkRendererProps) {
  switch (mark.type) {
    case 'checkbox':
      return <CheckboxMark mark={mark} size={size} />
    case 'number':
      return <NumberMark mark={mark} size={size} />
    case 'color':
      return <ColorMark mark={mark} size={size} />
    case 'circle':
      return <CircleMark mark={mark} size={size} />
    case 'text':
      return <TextMark mark={mark} size={size} />
    case 'symbol':
      return <SymbolMark mark={mark} size={size} />
    case 'line':
      // Lines are rendered differently (not in individual cells)
      return null
    default:
      return null
  }
}
