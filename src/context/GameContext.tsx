import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { GameState, GameConfig, Action, Mark, ToolPaletteState } from '../types'
import { generateId, generateActionId } from '../utils/id'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage'

/**
 * Game Context for managing global game state
 */

type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: GameConfig }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'ADD_MARK'; payload: Mark }
  | { type: 'REMOVE_MARK'; payload: string }
  | { type: 'UPDATE_MARK'; payload: { id: string; mark: Partial<Mark> } }
  | { type: 'CHANGE_SHEET'; payload: number }
  | { type: 'SELECT_TOOL'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_SHEET'; payload: number }
  | { type: 'RESET_GAME' }

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  addMark: (mark: Mark) => void
  removeMark: (markId: string) => void
  updateMark: (markId: string, updates: Partial<Mark>) => void
  changeSheet: (index: number) => void
  selectTool: (toolId: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  resetSheet: (sheetIndex: number) => void
  resetGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

/**
 * Create initial game state
 */
function createInitialState(config: GameConfig): GameState {
  const defaultTools: ToolPaletteState = {
    availableTools: [
      {
        id: 'checkbox',
        type: 'checkbox',
        label: 'Checkbox',
        permanence: 'pen',
      },
      {
        id: 'number',
        type: 'number',
        label: 'Number',
        permanence: 'pen',
      },
      {
        id: 'color',
        type: 'color',
        label: 'Color',
        permanence: 'pen',
      },
    ],
    selectedToolId: 'checkbox',
    recentlyUsed: [],
  }

  return {
    gameId: generateId('game'),
    gameName: config.name,
    version: '1.0.0',
    createdAt: Date.now(),
    lastModified: Date.now(),
    sheets: config.sheets,
    currentSheetIndex: 0,
    marks: {},
    dice: config.dice,
    cards: config.cards,
    tools: config.tools || defaultTools,
    history: {
      past: [],
      future: [],
      maxSize: 50,
    },
    customData: config.customData,
  }
}

/**
 * Game state reducer
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return createInitialState(action.payload)

    case 'LOAD_GAME': {
      const loadedState = action.payload as unknown as GameState
      return {
        ...loadedState,
        history: {
          past: [],
          future: [],
          maxSize: 50,
        },
      }
    }

    case 'ADD_MARK': {
      const mark = action.payload
      const newState = {
        ...state,
        marks: {
          ...state.marks,
          [mark.id]: mark,
        },
        sheets: state.sheets.map((sheet, idx) =>
          idx === state.currentSheetIndex
            ? { ...sheet, markIds: [...sheet.markIds, mark.id] }
            : sheet
        ),
        lastModified: Date.now(),
      }

      // Add to history
      const historyAction: Action = {
        id: generateActionId(),
        type: 'ADD_MARK',
        timestamp: Date.now(),
        data: mark,
      }

      return {
        ...newState,
        history: {
          ...state.history,
          past: [...state.history.past, historyAction].slice(-state.history.maxSize),
          future: [], // Clear redo stack
        },
      }
    }

    case 'REMOVE_MARK': {
      const markId = action.payload
      const mark = state.marks[markId]
      if (!mark) return state

      const { [markId]: removed, ...remainingMarks } = state.marks

      const newState = {
        ...state,
        marks: remainingMarks,
        sheets: state.sheets.map((sheet) => ({
          ...sheet,
          markIds: sheet.markIds.filter((id) => id !== markId),
        })),
        lastModified: Date.now(),
      }

      // Add to history
      const historyAction: Action = {
        id: generateActionId(),
        type: 'REMOVE_MARK',
        timestamp: Date.now(),
        data: { markId, mark },
      }

      return {
        ...newState,
        history: {
          ...state.history,
          past: [...state.history.past, historyAction].slice(-state.history.maxSize),
          future: [],
        },
      }
    }

    case 'UPDATE_MARK': {
      const { id, mark: updates } = action.payload
      const existingMark = state.marks[id]
      if (!existingMark) return state

      const updatedMark = { ...existingMark, ...updates } as Mark

      const newState: GameState = {
        ...state,
        marks: {
          ...state.marks,
          [id]: updatedMark,
        },
        lastModified: Date.now(),
      }

      const historyAction: Action = {
        id: generateActionId(),
        type: 'UPDATE_MARK',
        timestamp: Date.now(),
        data: { id, old: existingMark, new: updates },
      }

      return {
        ...newState,
        history: {
          ...state.history,
          past: [...state.history.past, historyAction].slice(-state.history.maxSize),
          future: [],
        },
      }
    }

    case 'CHANGE_SHEET': {
      const index = action.payload
      if (index < 0 || index >= state.sheets.length) return state

      return {
        ...state,
        currentSheetIndex: index,
        lastModified: Date.now(),
      }
    }

    case 'SELECT_TOOL': {
      const toolId = action.payload
      const tool = state.tools.availableTools.find((t) => t.id === toolId)
      if (!tool) return state

      return {
        ...state,
        tools: {
          ...state.tools,
          selectedToolId: toolId,
          recentlyUsed: [
            toolId,
            ...state.tools.recentlyUsed.filter((id) => id !== toolId),
          ].slice(0, 5),
        },
        lastModified: Date.now(),
      }
    }

    case 'UNDO': {
      const { past, future } = state.history
      if (past.length === 0) return state

      const previousAction = past[past.length - 1]!
      const newPast = past.slice(0, -1)

      // Reverse the action
      let newState = { ...state }
      if (previousAction.type === 'ADD_MARK') {
        const mark = previousAction.data as Mark
        const { [mark.id]: removed, ...remainingMarks } = state.marks
        newState = {
          ...newState,
          marks: remainingMarks,
          sheets: state.sheets.map((sheet) => ({
            ...sheet,
            markIds: sheet.markIds.filter((id) => id !== mark.id),
          })),
        }
      } else if (previousAction.type === 'REMOVE_MARK') {
        const { mark, markId } = previousAction.data as { mark: Mark; markId: string }
        newState = {
          ...newState,
          marks: {
            ...state.marks,
            [markId]: mark,
          },
          sheets: state.sheets.map((sheet, idx) =>
            idx === state.currentSheetIndex
              ? { ...sheet, markIds: [...sheet.markIds, markId] }
              : sheet
          ),
        }
      }

      return {
        ...newState,
        history: {
          ...state.history,
          past: newPast,
          future: [previousAction, ...future],
        },
        lastModified: Date.now(),
      }
    }

    case 'REDO': {
      const { past, future } = state.history
      if (future.length === 0) return state

      const nextAction = future[0]!
      const newFuture = future.slice(1)

      // Replay the action
      let newState = { ...state }
      if (nextAction.type === 'ADD_MARK') {
        const mark = nextAction.data as Mark
        newState = {
          ...newState,
          marks: {
            ...state.marks,
            [mark.id]: mark,
          },
          sheets: state.sheets.map((sheet, idx) =>
            idx === state.currentSheetIndex
              ? { ...sheet, markIds: [...sheet.markIds, mark.id] }
              : sheet
          ),
        }
      } else if (nextAction.type === 'REMOVE_MARK') {
        const { markId } = nextAction.data as { markId: string; mark: Mark }
        const { [markId]: removed, ...remainingMarks } = state.marks
        newState = {
          ...newState,
          marks: remainingMarks,
          sheets: state.sheets.map((sheet) => ({
            ...sheet,
            markIds: sheet.markIds.filter((id) => id !== markId),
          })),
        }
      }

      return {
        ...newState,
        history: {
          ...state.history,
          past: [...past, nextAction],
          future: newFuture,
        },
        lastModified: Date.now(),
      }
    }

    case 'RESET_SHEET': {
      const sheetIndex = action.payload
      if (sheetIndex < 0 || sheetIndex >= state.sheets.length) return state

      const sheet = state.sheets[sheetIndex]
      const markIdsToRemove = sheet?.markIds || []

      const newMarks = { ...state.marks }
      markIdsToRemove.forEach((id) => {
        delete newMarks[id]
      })

      return {
        ...state,
        marks: newMarks,
        sheets: state.sheets.map((s, idx) =>
          idx === sheetIndex ? { ...s, markIds: [] } : s
        ),
        lastModified: Date.now(),
      }
    }

    case 'RESET_GAME': {
      return {
        ...state,
        marks: {},
        sheets: state.sheets.map((sheet) => ({ ...sheet, markIds: [] })),
        history: {
          past: [],
          future: [],
          maxSize: 50,
        },
        lastModified: Date.now(),
      }
    }

    default:
      return state
  }
}

/**
 * Game Provider Component
 */
export function GameProvider({ children, config }: { children: React.ReactNode; config: GameConfig }) {
  const [state, dispatch] = useReducer(gameReducer, config, createInitialState)

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(state)
    }, 1000) // Debounce saves by 1 second

    return () => clearTimeout(timer)
  }, [state])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      dispatch({ type: 'LOAD_GAME', payload: saved as unknown as GameState })
    }
  }, [])

  const addMark = useCallback((mark: Mark) => {
    dispatch({ type: 'ADD_MARK', payload: mark })
  }, [])

  const removeMark = useCallback((markId: string) => {
    dispatch({ type: 'REMOVE_MARK', payload: markId })
  }, [])

  const updateMark = useCallback((markId: string, updates: Partial<Mark>) => {
    dispatch({ type: 'UPDATE_MARK', payload: { id: markId, mark: updates } })
  }, [])

  const changeSheet = useCallback((index: number) => {
    dispatch({ type: 'CHANGE_SHEET', payload: index })
  }, [])

  const selectTool = useCallback((toolId: string) => {
    dispatch({ type: 'SELECT_TOOL', payload: toolId })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const resetSheet = useCallback((sheetIndex: number) => {
    dispatch({ type: 'RESET_SHEET', payload: sheetIndex })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const canUndo = state.history.past.length > 0
  const canRedo = state.history.future.length > 0

  const value: GameContextValue = {
    state,
    dispatch,
    addMark,
    removeMark,
    updateMark,
    changeSheet,
    selectTool,
    undo,
    redo,
    canUndo,
    canRedo,
    resetSheet,
    resetGame,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

/**
 * Hook to use game context
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
