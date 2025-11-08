import { Mark } from './marks'
import { SheetState } from './sheets'
import { DiceState } from './dice'
import { MultiDeckState } from './cards'
import { ToolPaletteState } from './tools'

/**
 * Game State - Complete state of the game
 */

/**
 * Action types for undo/redo
 */
export type ActionType =
  | 'ADD_MARK'
  | 'REMOVE_MARK'
  | 'UPDATE_MARK'
  | 'ROLL_DICE'
  | 'LOCK_DIE'
  | 'UNLOCK_DIE'
  | 'DRAW_CARD'
  | 'DISCARD_CARD'
  | 'SHUFFLE_DECK'
  | 'CHANGE_SHEET'
  | 'RESET_SHEET'
  | 'RESET_GAME'

/**
 * Action for history tracking
 */
export interface Action {
  id: string
  type: ActionType
  timestamp: number
  data: unknown
  description?: string
}

/**
 * History state for undo/redo
 */
export interface HistoryState {
  past: Action[]
  future: Action[]
  maxSize: number
}

/**
 * Complete game state
 */
export interface GameState {
  /** Game metadata */
  gameId: string
  gameName: string
  version: string
  createdAt: number
  lastModified: number

  /** Sheets */
  sheets: SheetState[]
  currentSheetIndex: number

  /** Marks across all sheets */
  marks: Record<string, Mark>

  /** Dice state */
  dice?: DiceState

  /** Card decks state */
  cards?: MultiDeckState

  /** Tool palette */
  tools: ToolPaletteState

  /** History for undo/redo */
  history: HistoryState

  /** Custom game data */
  customData?: Record<string, unknown>
}

/**
 * Serializable game state (for save/load)
 */
export type SerializableGameState = Omit<GameState, 'history'> & {
  historySize: number
}

/**
 * Game configuration (initial setup)
 */
export interface GameConfig {
  name: string
  sheets: SheetState[]
  tools?: ToolPaletteState
  dice?: DiceState
  cards?: MultiDeckState
  customData?: Record<string, unknown>
}
