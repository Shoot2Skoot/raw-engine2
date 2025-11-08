import { GameState, SerializableGameState } from '../types'

/**
 * Storage utilities for saving and loading game state
 */

const STORAGE_KEY = 'roll-write-game-state'
const STORAGE_VERSION = '1.0'

/**
 * Save game state to localStorage
 */
export function saveToLocalStorage(state: GameState): void {
  try {
    const serializable: SerializableGameState = {
      ...state,
      historySize: state.history.past.length,
    }

    const data = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      state: serializable,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * Load game state from localStorage
 */
export function loadFromLocalStorage(): SerializableGameState | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return null

    const data = JSON.parse(json)

    // Version check
    if (data.version !== STORAGE_VERSION) {
      console.warn('Saved state version mismatch, ignoring')
      return null
    }

    return data.state as SerializableGameState
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

/**
 * Clear saved game state
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * Export game state to JSON file
 */
export function exportToFile(state: GameState, filename?: string): void {
  try {
    const serializable: SerializableGameState = {
      ...state,
      historySize: state.history.past.length,
    }

    const json = JSON.stringify(serializable, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${state.gameName}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export to file:', error)
  }
}

/**
 * Import game state from JSON file
 */
export function importFromFile(file: File): Promise<SerializableGameState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const state = JSON.parse(json) as SerializableGameState
        resolve(state)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    return false
  }
}
