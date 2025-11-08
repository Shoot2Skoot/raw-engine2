import {
  CheckSquare,
  Hash,
  Palette,
  Circle,
  Type,
  Star,
  Minus,
  Undo2,
  Redo2,
  type LucideIcon,
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import { MarkType } from '../types'

const TOOL_ICONS: Record<MarkType, LucideIcon> = {
  checkbox: CheckSquare,
  number: Hash,
  color: Palette,
  circle: Circle,
  text: Type,
  symbol: Star,
  line: Minus,
}

export function ToolPalette() {
  const { state, selectTool, undo, redo, canUndo, canRedo } = useGame()

  const handleToolClick = (toolId: string) => {
    selectTool(toolId)
  }

  const handleUndo = () => {
    if (canUndo) {
      undo()
    }
  }

  const handleRedo = () => {
    if (canRedo) {
      redo()
    }
  }

  return (
    <div className="bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
      {/* Tools Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>
        <div className="flex flex-col gap-2">
          {state.tools.availableTools.map((tool) => {
            const Icon = TOOL_ICONS[tool.type]
            const isSelected = state.tools.selectedToolId === tool.id

            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  transition-colors touch-manipulation
                  ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={isSelected}
              >
                {Icon && <Icon size={20} />}
                <span className="text-sm font-medium">{tool.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Undo/Redo Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">History</h3>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`
              flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg
              transition-colors touch-manipulation
              ${
                canUndo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={18} />
            <span className="text-xs">Undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`
              flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg
              transition-colors touch-manipulation
              ${
                canRedo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={18} />
            <span className="text-xs">Redo</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Marks: {Object.keys(state.marks).length}</p>
          <p>Sheet: {state.sheets[state.currentSheetIndex]?.definition.name || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
