/**
 * Memory Manager for WebSocket
 * 
 * Manages memory usage for WebSocket connections:
 * - Limits event history to prevent memory leaks
 * - Automatically cleans up old listeners
 * - Monitors memory usage
 * - Provides cleanup utilities
 */

import { wsLogger } from './logger';

/**
 * Configuration for memory management
 */
export interface MemoryManagerConfig {
  maxEventHistory: number;
  maxListeners: number;
  cleanupInterval: number; // milliseconds
  maxEventAge: number; // milliseconds
  enableAutoCleanup: boolean;
}

/**
 * Default memory manager configuration
 */
const DEFAULT_CONFIG: MemoryManagerConfig = {
  maxEventHistory: 100,
  maxListeners: 50,
  cleanupInterval: 60000, // 1 minute
  maxEventAge: 300000, // 5 minutes
  enableAutoCleanup: true,
};

/**
 * Event listener tracking
 */
interface ListenerInfo {
  event: string;
  callback: Function;
  addedAt: number;
  componentId?: string;
}

/**
 * Memory Manager Class
 */
export class MemoryManager {
  private config: MemoryManagerConfig;
  private listeners: Map<string, ListenerInfo[]> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;
  private eventCounts: Map<string, number> = new Map();

  constructor(config?: Partial<MemoryManagerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (this.config.enableAutoCleanup) {
      this.startAutoCleanup();
    }
  }

  /**
   * Register a listener for tracking
   */
  registerListener(
    event: string,
    callback: Function,
    componentId?: string
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const listeners = this.listeners.get(event)!;
    
    // Check if we're exceeding max listeners
    if (listeners.length >= this.config.maxListeners) {
      wsLogger.logAdvertencia(
        `Max listeners (${this.config.maxListeners}) reached for event: ${event}`,
        { event, listenerCount: listeners.length }
      );
      
      // Remove oldest listener
      const oldest = listeners.shift();
      if (oldest) {
        wsLogger.logInfo('Removed oldest listener to make room', {
          event,
          componentId: oldest.componentId,
        });
      }
    }

    listeners.push({
      event,
      callback,
      addedAt: Date.now(),
      componentId,
    });

    this.incrementEventCount(event);
  }

  /**
   * Unregister a listener
   */
  unregisterListener(event: string, callback?: Function): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;

    if (callback) {
      // Remove specific callback
      const index = listeners.findIndex((l) => l.callback === callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    } else {
      // Remove all listeners for this event
      this.listeners.delete(event);
    }

    this.decrementEventCount(event);
  }

  /**
   * Unregister all listeners for a component
   */
  unregisterComponentListeners(componentId: string): void {
    let removedCount = 0;

    this.listeners.forEach((listeners, event) => {
      const filtered = listeners.filter((l) => {
        if (l.componentId === componentId) {
          removedCount++;
          return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        this.listeners.delete(event);
      } else {
        this.listeners.set(event, filtered);
      }
    });

    if (removedCount > 0) {
      wsLogger.logInfo(`Cleaned up ${removedCount} listeners for component`, {
        componentId,
      });
    }
  }

  /**
   * Get listener statistics
   */
  getListenerStats(): {
    totalListeners: number;
    listenersByEvent: Record<string, number>;
    oldestListener: { event: string; age: number } | null;
  } {
    let totalListeners = 0;
    const listenersByEvent: Record<string, number> = {};
    let oldestListener: { event: string; age: number } | null = null;
    const now = Date.now();

    this.listeners.forEach((listeners, event) => {
      totalListeners += listeners.length;
      listenersByEvent[event] = listeners.length;

      listeners.forEach((listener) => {
        const age = now - listener.addedAt;
        if (!oldestListener || age > oldestListener.age) {
          oldestListener = { event, age };
        }
      });
    });

    return {
      totalListeners,
      listenersByEvent,
      oldestListener,
    };
  }

  /**
   * Clean up old listeners
   */
  cleanupOldListeners(): void {
    const now = Date.now();
    let removedCount = 0;

    this.listeners.forEach((listeners, event) => {
      const filtered = listeners.filter((listener) => {
        const age = now - listener.addedAt;
        if (age > this.config.maxEventAge) {
          removedCount++;
          return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        this.listeners.delete(event);
      } else {
        this.listeners.set(event, filtered);
      }
    });

    if (removedCount > 0) {
      wsLogger.logInfo(`Cleaned up ${removedCount} old listeners`, {
        maxAge: this.config.maxEventAge,
      });
    }
  }

  /**
   * Start automatic cleanup
   */
  startAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupOldListeners();
      this.logMemoryStats();
    }, this.config.cleanupInterval);

    wsLogger.logInfo('Started automatic memory cleanup', {
      interval: this.config.cleanupInterval,
    });
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
      wsLogger.logInfo('Stopped automatic memory cleanup');
    }
  }

  /**
   * Clear all tracked listeners
   */
  clearAll(): void {
    const stats = this.getListenerStats();
    this.listeners.clear();
    this.eventCounts.clear();
    
    wsLogger.logInfo('Cleared all tracked listeners', {
      removedCount: stats.totalListeners,
    });
  }

  /**
   * Get memory usage estimate (rough approximation)
   */
  getMemoryEstimate(): {
    listeners: number;
    events: number;
    totalKB: number;
  } {
    const stats = this.getListenerStats();
    
    // Rough estimates:
    // - Each listener: ~1KB (function + metadata)
    // - Each event name: ~0.1KB
    const listenersKB = stats.totalListeners * 1;
    const eventsKB = this.listeners.size * 0.1;
    const totalKB = listenersKB + eventsKB;

    return {
      listeners: stats.totalListeners,
      events: this.listeners.size,
      totalKB: Math.round(totalKB * 100) / 100,
    };
  }

  /**
   * Log memory statistics
   */
  logMemoryStats(): void {
    const stats = this.getListenerStats();
    const memory = this.getMemoryEstimate();

    wsLogger.logInfo('WebSocket Memory Stats', {
      totalListeners: stats.totalListeners,
      uniqueEvents: this.listeners.size,
      estimatedMemoryKB: memory.totalKB,
      oldestListenerAge: stats.oldestListener
        ? Math.round(stats.oldestListener.age / 1000)
        : 0,
    });
  }

  /**
   * Check if memory limits are being exceeded
   */
  checkMemoryLimits(): {
    isHealthy: boolean;
    warnings: string[];
  } {
    const stats = this.getListenerStats();
    const warnings: string[] = [];
    let isHealthy = true;

    // Check total listeners
    if (stats.totalListeners > this.config.maxListeners * 2) {
      warnings.push(
        `Total listeners (${stats.totalListeners}) exceeds recommended limit`
      );
      isHealthy = false;
    }

    // Check for events with too many listeners
    Object.entries(stats.listenersByEvent).forEach(([event, count]) => {
      if (count > 20) {
        warnings.push(`Event "${event}" has ${count} listeners (high)`);
        isHealthy = false;
      }
    });

    // Check oldest listener age
    if (stats.oldestListener && stats.oldestListener.age > this.config.maxEventAge * 2) {
      warnings.push(
        `Oldest listener is ${Math.round(stats.oldestListener.age / 1000)}s old (very old)`
      );
      isHealthy = false;
    }

    return { isHealthy, warnings };
  }

  /**
   * Increment event count
   */
  private incrementEventCount(event: string): void {
    const count = this.eventCounts.get(event) || 0;
    this.eventCounts.set(event, count + 1);
  }

  /**
   * Decrement event count
   */
  private decrementEventCount(event: string): void {
    const count = this.eventCounts.get(event) || 0;
    if (count > 0) {
      this.eventCounts.set(event, count - 1);
    }
  }

  /**
   * Destroy the memory manager
   */
  destroy(): void {
    this.stopAutoCleanup();
    this.clearAll();
  }
}

/**
 * Global memory manager instance
 */
let globalMemoryManager: MemoryManager | null = null;

/**
 * Get or create global memory manager
 */
export function getMemoryManager(
  config?: Partial<MemoryManagerConfig>
): MemoryManager {
  if (!globalMemoryManager) {
    globalMemoryManager = new MemoryManager(config);
  }
  return globalMemoryManager;
}

/**
 * Reset global memory manager
 */
export function resetMemoryManager(): void {
  if (globalMemoryManager) {
    globalMemoryManager.destroy();
    globalMemoryManager = null;
  }
}

/**
 * React hook for automatic listener cleanup
 */
export function useListenerCleanup(componentId: string) {
  if (typeof window === 'undefined') return;

  const manager = getMemoryManager();

  // Cleanup on unmount
  return () => {
    manager.unregisterComponentListeners(componentId);
  };
}
