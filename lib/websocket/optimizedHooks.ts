/**
 * Optimized WebSocket Hooks
 * 
 * Performance-optimized hooks for WebSocket event handling
 * - Prevents unnecessary re-renders
 * - Throttles UI updates to 60fps
 * - Uses memoization for expensive computations
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { throttleRAF, createEventBuffer } from './performanceUtils';
import type { EventEntry } from './performanceUtils';

/**
 * Optimized hook for listening to WebSocket events with throttling
 * Automatically throttles updates to 60fps using requestAnimationFrame
 * 
 * @param evento - Event name to listen to
 * @param onData - Callback when data is received (throttled)
 * @param deps - Dependencies for the callback
 */
export function useWebSocketThrottled<T = any>(
  evento: string,
  onData: (data: T) => void,
  deps: React.DependencyList = []
) {
  // Memoize the throttled handler
  const throttledHandler = useMemo(
    () => throttleRAF(onData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useWebSocket(evento, throttledHandler);
}

/**
 * Hook for managing event history with automatic memory management
 * Keeps only the most recent N events in memory
 * 
 * @param evento - Event name to listen to
 * @param maxEvents - Maximum number of events to keep (default: 100)
 * @param autoCleanup - Enable automatic cleanup of old events
 * @returns Event history and management functions
 */
export function useWebSocketHistory<T = any>(
  evento: string,
  maxEvents: number = 100,
  autoCleanup: boolean = true
) {
  const [events, setEvents] = useState<EventEntry<T>[]>([]);
  const bufferRef = useRef(
    createEventBuffer<T>({
      maxSize: maxEvents,
      cleanupInterval: 60000, // Cleanup every minute
    })
  );

  useEffect(() => {
    const buffer = bufferRef.current;

    if (autoCleanup) {
      // Clean up events older than 5 minutes
      buffer.startAutoCleanup(5 * 60 * 1000);
    }

    return () => {
      buffer.stopAutoCleanup();
      buffer.clear();
    };
  }, [autoCleanup]);

  // Throttled state update to prevent excessive re-renders
  const updateState = useMemo(
    () =>
      throttleRAF(() => {
        setEvents(bufferRef.current.getAll());
      }),
    []
  );

  const handleEvent = useCallback(
    (data: T) => {
      bufferRef.current.add(data);
      updateState();
    },
    [updateState]
  );

  useWebSocket(evento, handleEvent);

  // Memoized helper functions
  const getRecent = useCallback(
    (timeWindowMs: number) => {
      return bufferRef.current.getRecent(timeWindowMs);
    },
    []
  );

  const clear = useCallback(() => {
    bufferRef.current.clear();
    setEvents([]);
  }, []);

  return {
    events,
    getRecent,
    clear,
    size: events.length,
  };
}

/**
 * Hook for aggregating rapid events into a single state update
 * Useful for sensor data that arrives very frequently
 * 
 * @param evento - Event name to listen to
 * @param aggregator - Function to aggregate multiple events
 * @param windowMs - Time window for aggregation (default: 100ms)
 * @returns Aggregated data
 */
export function useWebSocketAggregated<T = any, R = T>(
  evento: string,
  aggregator: (events: T[]) => R,
  windowMs: number = 100
) {
  const [aggregatedData, setAggregatedData] = useState<R | null>(null);
  const eventsBuffer = useRef<T[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const processBuffer = useCallback(() => {
    if (eventsBuffer.current.length > 0) {
      const result = aggregator(eventsBuffer.current);
      setAggregatedData(result);
      eventsBuffer.current = [];
    }
    timerRef.current = null;
  }, [aggregator]);

  const handleEvent = useCallback(
    (data: T) => {
      eventsBuffer.current.push(data);

      if (!timerRef.current) {
        timerRef.current = setTimeout(processBuffer, windowMs);
      }
    },
    [processBuffer, windowMs]
  );

  useWebSocket(evento, handleEvent);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return aggregatedData;
}

/**
 * Hook for latest event data with automatic stale data detection
 * Only triggers re-render when data actually changes
 * 
 * @param evento - Event name to listen to
 * @param staleTimeMs - Time after which data is considered stale (default: 30s)
 * @returns Latest data and metadata
 */
export function useWebSocketLatest<T = any>(
  evento: string,
  staleTimeMs: number = 30000
) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [isStale, setIsStale] = useState(false);

  // Throttled update to prevent excessive re-renders
  const handleEvent = useMemo(
    () =>
      throttleRAF((newData: T) => {
        setData(newData);
        setLastUpdate(Date.now());
        setIsStale(false);
      }),
    []
  );

  useWebSocket(evento, handleEvent);

  // Check for stale data
  useEffect(() => {
    if (lastUpdate === 0) return;

    const checkStale = () => {
      const now = Date.now();
      const timeSinceUpdate = now - lastUpdate;
      setIsStale(timeSinceUpdate > staleTimeMs);
    };

    const interval = setInterval(checkStale, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastUpdate, staleTimeMs]);

  return {
    data,
    lastUpdate,
    isStale,
    timeSinceUpdate: lastUpdate ? Date.now() - lastUpdate : null,
  };
}

/**
 * Hook for batched WebSocket events
 * Collects multiple events and processes them in batches
 * 
 * @param evento - Event name to listen to
 * @param onBatch - Callback for processing batches
 * @param batchSize - Maximum batch size (default: 10)
 * @param maxWaitMs - Maximum wait time before processing (default: 100ms)
 */
export function useWebSocketBatched<T = any>(
  evento: string,
  onBatch: (batch: T[]) => void,
  batchSize: number = 10,
  maxWaitMs: number = 100
) {
  const batchRef = useRef<T[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (batchRef.current.length > 0) {
      onBatch([...batchRef.current]);
      batchRef.current = [];
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [onBatch]);

  const handleEvent = useCallback(
    (data: T) => {
      batchRef.current.push(data);

      // Flush if batch is full
      if (batchRef.current.length >= batchSize) {
        flush();
        return;
      }

      // Set timer to flush after max wait time
      if (!timerRef.current) {
        timerRef.current = setTimeout(flush, maxWaitMs);
      }
    },
    [batchSize, maxWaitMs, flush]
  );

  useWebSocket(evento, handleEvent);

  useEffect(() => {
    return () => {
      flush();
    };
  }, [flush]);
}

/**
 * Hook for conditional WebSocket listening
 * Only subscribes to events when condition is met
 * Prevents unnecessary event processing
 * 
 * @param evento - Event name to listen to
 * @param onData - Callback when data is received
 * @param condition - Whether to listen to events
 */
export function useWebSocketConditional<T = any>(
  evento: string,
  onData: (data: T) => void,
  condition: boolean
) {
  const { escuchar, dejarDeEscuchar } = useWebSocket();

  useEffect(() => {
    if (!condition) return;

    escuchar(evento, onData);

    return () => {
      dejarDeEscuchar(evento);
    };
  }, [evento, onData, condition, escuchar, dejarDeEscuchar]);
}
