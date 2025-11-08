import { GameState, GameConfig, SavedGame } from '../types';

const SAVE_VERSION = '1.0.0';

/**
 * Export game state to JSON file
 */
export function exportGame(state: GameState, config: GameConfig): void {
  const savedGame: SavedGame = {
    config,
    state,
    saveMetadata: {
      savedAt: Date.now(),
      version: SAVE_VERSION,
    },
  };

  const json = JSON.stringify(savedGame, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${config.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import game state from JSON file
 */
export function importGame(file: File): Promise<SavedGame> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const savedGame = JSON.parse(json) as SavedGame;

        // Validate the save file
        if (!savedGame.config || !savedGame.state || !savedGame.saveMetadata) {
          throw new Error('Invalid save file format');
        }

        resolve(savedGame);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get save file size estimate in bytes
 */
export function estimateSaveSize(state: GameState): number {
  const json = JSON.stringify(state);
  return new Blob([json]).size;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
