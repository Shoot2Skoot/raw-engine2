// engine/EventBus.ts - Event system for game logic hooks

import type { EngineEvent } from './types';

type EventCallback = (event: EngineEvent) => void;

/**
 * EventBus provides a simple pub/sub system for game logic to hook into engine events
 * This allows games to implement validation, scoring, and other logic without modifying the engine
 */
export class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to an event type
   * @param eventType - The type of event to listen for
   * @param callback - Function to call when event is emitted
   * @returns Unsubscribe function
   */
  on(eventType: EngineEvent['type'], callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => this.off(eventType, callback);
  }

  /**
   * Unsubscribe from an event type
   * @param eventType - The type of event to stop listening for
   * @param callback - The callback to remove
   */
  off(eventType: EngineEvent['type'], callback: EventCallback): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  /**
   * Emit an event to all subscribers
   * @param event - The event to emit
   */
  emit(event: EngineEvent): void {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(event));
    }
  }

  /**
   * Clear all listeners (useful for cleanup)
   */
  clear(): void {
    this.listeners.clear();
  }
}
