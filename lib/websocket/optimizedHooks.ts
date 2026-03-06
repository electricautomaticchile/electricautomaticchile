import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { throttleRAF, createEventBuffer } from './performanceUtils';
import type { EventEntry } from './performanceUtils';
import type { WSMessage } from './useWebSocket';

export function useWebSocketThrottled<T = any>(
  evento: string,
  onData: (data: T) => void,
  deps: React.DependencyList = []
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandler = useMemo(() => throttleRAF(onData), deps);

  useWebSocket({
    onMessage: (msg: WSMessage) => {
      if (msg.type === evento) throttledHandler(msg.data as T);
    },
  });
}

export function useWebSocketHistory<T = any>(
  evento: string,
  maxEvents: number = 100,
  autoCleanup: boolean = true
) {
  const [events, setEvents] = useState<EventEntry<T>[]>([]);
  const bufferRef = useRef(createEventBuffer<T>({ maxSize: maxEvents, cleanupInterval: 60000 }));

  useEffect(() => {
    const buffer = bufferRef.current;
    if (autoCleanup) buffer.startAutoCleanup(5 * 60 * 1000);
    return () => { buffer.stopAutoCleanup(); buffer.clear(); };
  }, [autoCleanup]);

  const updateState = useMemo(() => throttleRAF(() => setEvents(bufferRef.current.getAll())), []);

  const handleEvent = useCallback((data: T) => { bufferRef.current.add(data); updateState(); }, [updateState]);

  useWebSocket({ onMessage: (msg: WSMessage) => { if (msg.type === evento) handleEvent(msg.data as T); } });

  const getRecent = useCallback((timeWindowMs: number) => bufferRef.current.getRecent(timeWindowMs), []);
  const clear = useCallback(() => { bufferRef.current.clear(); setEvents([]); }, []);

  return { events, getRecent, clear, size: events.length };
}

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
      setAggregatedData(aggregator(eventsBuffer.current));
      eventsBuffer.current = [];
    }
    timerRef.current = null;
  }, [aggregator]);

  const handleEvent = useCallback((data: T) => {
    eventsBuffer.current.push(data);
    if (!timerRef.current) timerRef.current = setTimeout(processBuffer, windowMs);
  }, [processBuffer, windowMs]);

  useWebSocket({ onMessage: (msg: WSMessage) => { if (msg.type === evento) handleEvent(msg.data as T); } });

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return aggregatedData;
}

export function useWebSocketLatest<T = any>(evento: string, staleTimeMs: number = 30000) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [isStale, setIsStale] = useState(false);

  const handleEvent = useMemo(() => throttleRAF((newData: T) => {
    setData(newData); setLastUpdate(Date.now()); setIsStale(false);
  }), []);

  useWebSocket({ onMessage: (msg: WSMessage) => { if (msg.type === evento) handleEvent(msg.data as T); } });

  useEffect(() => {
    if (lastUpdate === 0) return;
    const interval = setInterval(() => setIsStale(Date.now() - lastUpdate > staleTimeMs), 5000);
    return () => clearInterval(interval);
  }, [lastUpdate, staleTimeMs]);

  return { data, lastUpdate, isStale, timeSinceUpdate: lastUpdate ? Date.now() - lastUpdate : null };
}

export function useWebSocketBatched<T = any>(
  evento: string,
  onBatch: (batch: T[]) => void,
  batchSize: number = 10,
  maxWaitMs: number = 100
) {
  const batchRef = useRef<T[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (batchRef.current.length > 0) { onBatch([...batchRef.current]); batchRef.current = []; }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, [onBatch]);

  const handleEvent = useCallback((data: T) => {
    batchRef.current.push(data);
    if (batchRef.current.length >= batchSize) { flush(); return; }
    if (!timerRef.current) timerRef.current = setTimeout(flush, maxWaitMs);
  }, [batchSize, maxWaitMs, flush]);

  useWebSocket({ onMessage: (msg: WSMessage) => { if (msg.type === evento) handleEvent(msg.data as T); } });

  useEffect(() => () => { flush(); }, [flush]);
}

export function useWebSocketConditional<T = any>(
  evento: string,
  onData: (data: T) => void,
  condition: boolean
) {
  useWebSocket({
    enabled: condition,
    onMessage: (msg: WSMessage) => { if (msg.type === evento) onData(msg.data as T); },
  });
}
