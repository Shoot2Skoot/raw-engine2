/**
 * Dice Types - Random number/symbol generation
 */

/**
 * Standard die types
 */
export type StandardDieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

/**
 * Die face content types
 */
export type DieFaceContent = {
  type: 'number' | 'symbol' | 'text' | 'color' | 'mixed'
  value: string | number
  display?: string // custom display override
  color?: string
  symbol?: string
}

/**
 * Custom die face definition
 */
export interface DieFace {
  id: string
  content: DieFaceContent
  weight?: number // for weighted probability (default 1)
}

/**
 * Standard numeric die definition
 */
export interface StandardDie {
  type: 'standard'
  dieType: StandardDieType
  id: string
  label?: string
  color?: string
}

/**
 * Custom die definition with arbitrary faces
 */
export interface CustomDie {
  type: 'custom'
  id: string
  label?: string
  faces: DieFace[]
  color?: string
}

/**
 * Union of die types
 */
export type Die = StandardDie | CustomDie

/**
 * Die roll result
 */
export interface DieResult {
  dieId: string
  faceId?: string // for custom dice
  value: number | string
  display?: string
  timestamp: number
  isLocked?: boolean
  isModified?: boolean // has been manually changed
}

/**
 * Dice pool - a collection of dice that can be rolled together
 */
export interface DicePool {
  id: string
  label: string
  dice: Die[]
  results: DieResult[]
  rollCount?: number // number of times rolled
}

/**
 * Dice state for the entire game
 */
export interface DiceState {
  pools: DicePool[]
  rollHistory: DieResult[][] // history of previous rolls
  maxHistorySize?: number
}

/**
 * Dice roll options
 */
export interface RollOptions {
  /** Reroll only unlocked dice */
  respectLocks?: boolean

  /** Reroll specific dice by ID */
  specificDice?: string[]

  /** Roll all dice in pool */
  rollAll?: boolean
}
