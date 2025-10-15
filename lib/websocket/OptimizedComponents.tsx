/**
 * Optimized WebSocket Components
 * 
 * Performance-optimized React components for WebSocket data display
 * - Uses React.memo to prevent unnecessary re-renders
 * - Implements shouldComponentUpdate logic
 * - Optimizes chart and graph updates
 */

'use client';

import React, { memo, useMemo } from 'react';
import { useWebSocketLatest, useWebSocketThrottled } from './optimizedHooks';

/**
 * Props for RealtimeValue component
 */
interface RealtimeValueProps {
  evento: string;
  label: string;
  formatter?: (value: any) => string;
  unit?: string;
  className?: string;
  staleTimeMs?: number;
}

/**
 * Optimized component for displaying a single real-time value
 * Uses memo to prevent re-renders when props don't change
 */
export const RealtimeValue = memo<RealtimeValueProps>(
  ({ evento, label, formatter, unit, className, staleTimeMs = 30000 }) => {
    const { data, isStale, timeSinceUpdate } = useWebSocketLatest(
      evento,
      staleTimeMs
    );

    const displayValue = useMemo(() => {
      if (data === null) return '--';
      return formatter ? formatter(data) : String(data);
    }, [data, formatter]);

    return (
      <div className={className}>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`text-2xl font-bold ${isStale ? 'opacity-50' : ''}`}>
          {displayValue}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </div>
        {timeSinceUpdate !== null && (
          <div className="text-xs text-muted-foreground">
            {isStale ? 'Stale data' : `Updated ${Math.floor(timeSinceUpdate / 1000)}s ago`}
          </div>
        )}
      </div>
    );
  },
  // Custom comparison function - only re-render if these props change
  (prevProps, nextProps) => {
    return (
      prevProps.evento === nextProps.evento &&
      prevProps.label === nextProps.label &&
      prevProps.unit === nextProps.unit &&
      prevProps.staleTimeMs === nextProps.staleTimeMs &&
      prevProps.className === nextProps.className
    );
  }
);

RealtimeValue.displayName = 'RealtimeValue';

/**
 * Props for RealtimeChart component
 */
interface RealtimeChartProps {
  evento: string;
  maxDataPoints?: number;
  updateInterval?: number;
  children: (data: any[]) => React.ReactNode;
}

/**
 * Optimized wrapper for real-time charts
 * Throttles updates to prevent excessive re-renders
 */
export const RealtimeChart = memo<RealtimeChartProps>(
  ({ evento, maxDataPoints = 50, updateInterval = 1000, children }) => {
    const [chartData, setChartData] = React.useState<any[]>([]);

    // Throttle chart updates to prevent performance issues
    useWebSocketThrottled(
      evento,
      (data: any) => {
        setChartData((prev) => {
          const newData = [...prev, data];
          // Keep only recent data points
          if (newData.length > maxDataPoints) {
            return newData.slice(-maxDataPoints);
          }
          return newData;
        });
      },
      [maxDataPoints]
    );

    // Memoize the rendered chart to prevent unnecessary recalculations
    const renderedChart = useMemo(() => {
      return children(chartData);
    }, [chartData, children]);

    return <>{renderedChart}</>;
  }
);

RealtimeChart.displayName = 'RealtimeChart';

/**
 * Props for ConnectionQualityIndicator
 */
interface ConnectionQualityIndicatorProps {
  className?: string;
}

/**
 * Optimized connection quality indicator
 * Shows latency and connection stability
 */
export const ConnectionQualityIndicator = memo<ConnectionQualityIndicatorProps>(
  ({ className }) => {
    const { data: latency } = useWebSocketLatest<number>('connection:latency', 5000);

    const quality = useMemo(() => {
      if (latency === null) return { label: 'Unknown', color: 'gray' };
      if (latency < 50) return { label: 'Excellent', color: 'green' };
      if (latency < 100) return { label: 'Good', color: 'blue' };
      if (latency < 200) return { label: 'Fair', color: 'yellow' };
      return { label: 'Poor', color: 'red' };
    }, [latency]);

    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full bg-${quality.color}-500`}
            aria-label={`Connection quality: ${quality.label}`}
          />
          <span className="text-sm">{quality.label}</span>
          {latency !== null && (
            <span className="text-xs text-muted-foreground">
              ({latency}ms)
            </span>
          )}
        </div>
      </div>
    );
  }
);

ConnectionQualityIndicator.displayName = 'ConnectionQualityIndicator';

/**
 * HOC for optimizing WebSocket-connected components
 * Wraps component with memo and adds performance optimizations
 */
export function withWebSocketOptimization<P extends object>(
  Component: React.ComponentType<P>,
  compareProps?: (prevProps: P, nextProps: P) => boolean
) {
  const OptimizedComponent = memo(Component, compareProps);
  OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return OptimizedComponent;
}

/**
 * Hook for optimizing list rendering with WebSocket data
 * Uses virtualization concepts for large lists
 */
export function useOptimizedList<T extends { id: string | number }>(
  items: T[],
  visibleRange?: { start: number; end: number }
) {
  return useMemo(() => {
    if (!visibleRange) return items;
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);
}
