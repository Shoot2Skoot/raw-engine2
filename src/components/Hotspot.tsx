import { Hotspot as HotspotType, Mark, CheckboxState, CircleState } from '../types'
import { useGame } from '../context/GameContext'
import { generateMarkId } from '../utils/id'
import { MarkRenderer } from './marks'

interface HotspotProps {
  hotspot: HotspotType
  marks: Mark[]
}

export function Hotspot({ hotspot, marks }: HotspotProps) {
  const { state, addMark, removeMark, updateMark } = useGame()

  const selectedTool = state.tools.availableTools.find(
    (t) => t.id === state.tools.selectedToolId
  )

  if (!selectedTool) return null

  const isEnabled = hotspot.constraints.enabled !== false
  const isReadOnly = hotspot.constraints.readOnly === true
  const canInteract = isEnabled && !isReadOnly

  // Check if this mark type is allowed
  const isAllowed = hotspot.constraints.allowedMarkTypes.includes(selectedTool.type)

  // Check max marks constraint
  const hasReachedMaxMarks =
    hotspot.constraints.maxMarks !== undefined &&
    marks.length >= hotspot.constraints.maxMarks

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!canInteract || !isAllowed || hasReachedMaxMarks) {
      return
    }

    // Handle different mark types
    switch (selectedTool.type) {
      case 'checkbox':
        handleCheckboxClick()
        break
      case 'number':
        handleNumberClick()
        break
      case 'color':
        handleColorClick()
        break
      case 'circle':
        handleCircleClick()
        break
      case 'text':
        handleTextClick()
        break
      case 'symbol':
        handleSymbolClick()
        break
      default:
        break
    }
  }

  const handleCheckboxClick = () => {
    const existingMark = marks.find((m) => m.type === 'checkbox')

    if (existingMark && existingMark.type === 'checkbox') {
      // Cycle through states
      const states: CheckboxState[] = ['empty', 'checked', 'crossed']
      const currentIndex = states.indexOf(existingMark.state)
      const nextIndex = (currentIndex + 1) % states.length

      if (nextIndex === 0) {
        // Remove mark when cycling back to empty
        removeMark(existingMark.id)
      } else {
        updateMark(existingMark.id, { state: states[nextIndex] })
      }
    } else {
      // Create new checkbox mark
      const mark: Mark = {
        id: generateMarkId(),
        type: 'checkbox',
        hotspotId: hotspot.id,
        state: 'checked',
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  const handleNumberClick = () => {
    const value = prompt('Enter a number:')
    if (value === null) return

    const num = parseInt(value, 10)
    if (isNaN(num)) return

    // Check constraints
    if (hotspot.constraints.minValue !== undefined && num < hotspot.constraints.minValue) {
      alert(`Minimum value is ${hotspot.constraints.minValue}`)
      return
    }
    if (hotspot.constraints.maxValue !== undefined && num > hotspot.constraints.maxValue) {
      alert(`Maximum value is ${hotspot.constraints.maxValue}`)
      return
    }

    const existingMark = marks.find((m) => m.type === 'number')

    if (existingMark) {
      updateMark(existingMark.id, { value: num })
    } else {
      const mark: Mark = {
        id: generateMarkId(),
        type: 'number',
        hotspotId: hotspot.id,
        value: num,
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  const handleColorClick = () => {
    const color = selectedTool.config?.color || '#3b82f6'
    const opacity = selectedTool.config?.opacity || 0.5

    const existingMark = marks.find((m) => m.type === 'color')

    if (existingMark) {
      removeMark(existingMark.id)
    } else {
      const mark: Mark = {
        id: generateMarkId(),
        type: 'color',
        hotspotId: hotspot.id,
        color,
        opacity,
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  const handleCircleClick = () => {
    const existingMark = marks.find((m) => m.type === 'circle')

    if (existingMark && existingMark.type === 'circle') {
      const states: CircleState[] = ['empty', 'half', 'full']
      const currentIndex = states.indexOf(existingMark.state)
      const nextIndex = (currentIndex + 1) % states.length

      if (nextIndex === 0) {
        removeMark(existingMark.id)
      } else {
        updateMark(existingMark.id, { state: states[nextIndex] })
      }
    } else {
      const mark: Mark = {
        id: generateMarkId(),
        type: 'circle',
        hotspotId: hotspot.id,
        state: 'half',
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  const handleTextClick = () => {
    const text = prompt('Enter text:')
    if (text === null || text === '') return

    const existingMark = marks.find((m) => m.type === 'text')

    if (existingMark) {
      updateMark(existingMark.id, { text })
    } else {
      const mark: Mark = {
        id: generateMarkId(),
        type: 'text',
        hotspotId: hotspot.id,
        text,
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  const handleSymbolClick = () => {
    const symbol = selectedTool.config?.symbol || 'star'

    const existingMark = marks.find((m) => m.type === 'symbol')

    if (existingMark) {
      removeMark(existingMark.id)
    } else {
      const mark: Mark = {
        id: generateMarkId(),
        type: 'symbol',
        hotspotId: hotspot.id,
        symbol,
        permanence: selectedTool.permanence || 'pen',
        timestamp: Date.now(),
      }
      addMark(mark)
    }
  }

  // Render hotspot based on shape
  const renderHotspot = () => {
    const { shape } = hotspot

    switch (shape.type) {
      case 'rectangle': {
        const { position, size } = shape
        return (
          <g>
            {/* Background */}
            <rect
              x={position.x}
              y={position.y}
              width={size.width}
              height={size.height}
              fill={hotspot.backgroundColor || 'transparent'}
              stroke={hotspot.borderColor || '#e5e7eb'}
              strokeWidth={hotspot.borderWidth || 1}
              className={`
                ${canInteract && isAllowed ? 'cursor-pointer hover:fill-gray-100' : ''}
                transition-colors
              `}
              onClick={handleClick}
            />

            {/* Render marks */}
            {marks.map((mark) => (
              <svg
                key={mark.id}
                x={position.x}
                y={position.y}
                width={size.width}
                height={size.height}
                viewBox={`0 0 ${size.width} ${size.height}`}
              >
                <MarkRenderer mark={mark} size={Math.min(size.width, size.height)} />
              </svg>
            ))}
          </g>
        )
      }

      case 'circle': {
        const { center, radius } = shape
        return (
          <g>
            <circle
              cx={center.x}
              cy={center.y}
              r={radius}
              fill={hotspot.backgroundColor || 'transparent'}
              stroke={hotspot.borderColor || '#e5e7eb'}
              strokeWidth={hotspot.borderWidth || 1}
              className={`
                ${canInteract && isAllowed ? 'cursor-pointer hover:fill-gray-100' : ''}
                transition-colors
              `}
              onClick={handleClick}
            />

            {/* Render marks */}
            {marks.map((mark) => (
              <svg
                key={mark.id}
                x={center.x - radius}
                y={center.y - radius}
                width={radius * 2}
                height={radius * 2}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
              >
                <MarkRenderer mark={mark} size={radius * 2} />
              </svg>
            ))}
          </g>
        )
      }

      case 'polygon': {
        const points = shape.vertices.map((v) => `${v.x},${v.y}`).join(' ')
        return (
          <g>
            <polygon
              points={points}
              fill={hotspot.backgroundColor || 'transparent'}
              stroke={hotspot.borderColor || '#e5e7eb'}
              strokeWidth={hotspot.borderWidth || 1}
              className={`
                ${canInteract && isAllowed ? 'cursor-pointer hover:fill-gray-100' : ''}
                transition-colors
              `}
              onClick={handleClick}
            />
          </g>
        )
      }

      default:
        return null
    }
  }

  return <>{renderHotspot()}</>
}
