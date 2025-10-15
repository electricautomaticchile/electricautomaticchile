/**
 * Performance Utilities for WebSocket Event Handling
 * 
 * This module provides utilities for optimizing WebSocket event processing:
 * - debounce: Delays execution until events stop arriving
 * - throttle: Limits execution frequency
 * - createEventBuffer: Manages event history with memory limits
 */

/**
 * Debounce function - delays execution until events stop arriving
 * Useful for sensor events that arrive very rapidly (>10/second)
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds (recommended: 100-300ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function - limits execution frequency
 * Ensures function is called at most once per specified interval
 * 
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        // Execute with last received args if any arrived during throttle
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      // Store last args to execute after throttle period
      lastArgs = args;
    }
  };
}

/**
 * RequestAnimationFrame-based throttle for UI updates
 * Ensures updates happen at most once per frame (60fps)
 * 
 * @param func - Function to throttle
 * @returns RAF-throttled function
 */
export function throttleRAF<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function throttledRAF(...args: Parameters<T>) {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
        rafId = null;
      });
    }
  };
}

/**
 * Event buffer configuration
 */
export interface EventBufferConfig {
  maxSize: number;
  cleanupInterval?: number; // milliseconds
}

/**
 * Event buffer entry
 */
export interface EventEntry<T = any> {
  timestamp: number;
  data: T;
}

/**
 * Creates a managed event buffer with automatic cleanup
 * Limits memory usage by keeping only recent events
 * 
 * @param config - Buffer configuration
 * @returns Event buffer manager
 */
export function createEventBuffer<T = any>(config: EventBufferConfig) {
  const { maxSize, cleanupInterval = 60000 } = config;
  const buffer: EventEntry<T>[] = [];
  let cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Add event to buffer
   */
  const add = (data: T): void => {
    buffer.push({
      timestamp: Date.now(),
      data,
    });

    // Remove oldest if exceeds max size
    if (buffer.length > maxSize) {
      buffer.shift();
    }
  };

  /**
   * Get all events in buffer
   */
  const getAll = (): EventEntry<T>[] => {
    return [...buffer];
  };

  /**
   * Get recent events (within time window)
   */
  const getRecent = (timeWindowMs: number): EventEntry<T>[] => {
    const cutoff = Date.now() - timeWindowMs;
    return buffer.filter((entry) => entry.timestamp >= cutoff);
  };

  /**
   * Clear old events
   */
  const cleanup = (maxAgeMs: number): void => {
    const cutoff = Date.now() - maxAgeMs;
    let removeCount = 0;

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i].timestamp < cutoff) {
        removeCount++;
      } else {
        break;
      }
    }

    if (removeCount > 0) {
      buffer.splice(0, removeCount);
    }
  };

  /**
   * Clear all events
   */
  const clear = (): void => {
    buffer.length = 0;
  };

  /**
   * Get buffer size
   */
  const size = (): number => {
    return buffer.length;
  };

  /**
   * Start automatic cleanup
   */
  const startAutoCleanup = (maxAgeMs: number): void => {
    if (cleanupTimer) {
      clearInterval(cleanupTimer);
    }

    cleanupTimer = setInterval(() => {
      cleanup(maxAgeMs);
    }, cleanupInterval);
  };

  /**
   * Stop automatic cleanup
   */
  const stopAutoCleanup = (): void => {
    if (cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  };

  return {
    add,
    getAll,
    getRecent,
    cleanup,
    clear,
    size,
    startAutoCleanup,
    stopAutoCleanup,
  };
}

/**
 * Debounced event handler factory for WebSocket events
 * Automatically applies appropriate debounce delays based on event type
 * 
 * @param eventType - Type of WebSocket event
 * @param handler - Event handler function
 * @returns Debounced handler
 */
export function createDebouncedEventHandler<T = any>(
  eventType: string,
  handler: (data: T) => void
): (data: T) => void {
  // Configure debounce delays based on event type
  const delays: Record<string, number> = {
    // Sensor events - arrive very rapidly
    'hardware:actualizacion_sensor': 200,
    'dispositivo:actualizacion_voltaje': 150,
    'dispositivo:actualizacion_corriente': 150,
    'dispositivo:actualizacion_potencia': 200,
    
    // Less frequent events - shorter delay
    'dispositivo:actualizacion_conexion': 100,
    'iot:alerta:nueva': 100,
    'notificacion:recibida': 100,
    
    // Default for unknown events
    default: 150,
  };

  const delay = delays[eventType] || delays.default;
  return debounce(handler, delay);
}

/**
 * Throttled event handler factory for UI updates
 * Uses RAF for smooth 60fps updates
 * 
 * @param handler - Event handler function
 * @returns Throttled handler
 */
export function createThrottledUIHandler<T = any>(
  handler: (data: T) => void
): (data: T) => void {
  return throttleRAF(handler);
}

/**
 * Batch processor for multiple events
 * Collects events and processes them in batches
 */
export function createBatchProcessor<T = any>(
  processor: (batch: T[]) => void,
  batchSize: number = 10,
  maxWaitMs: number = 100
) {
  const batch: T[] = [];
  let timer: NodeJS.Timeout | null = null;

  const flush = () => {
    if (batch.length > 0) {
      processor([...batch]);
      batch.length = 0;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const add = (item: T) => {
    batch.push(item);

    // Flush if batch is full
    if (batch.length >= batchSize) {
      flush();
      return;
    }

    // Set timer to flush after max wait time
    if (!timer) {
      timer = setTimeout(flush, maxWaitMs);
    }
  };

  return {
    add,
    flush,
  };
}
