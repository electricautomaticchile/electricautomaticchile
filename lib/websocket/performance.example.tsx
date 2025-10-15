/**
 * Performance Optimization Examples
 * 
 * This file demonstrates how to use the performance optimization features
 * in real-world scenarios.
 */

'use client';

import React, { useState } from 'react';
import {
  useWebSocketThrottled,
  useWebSocketHistory,
  useWebSocketLatest,
  useWebSocketAggregated,
  RealtimeValue,
  RealtimeChart,
  getMemoryManager,
} from '@/lib/websocket';

/**
 * Example 1: Debounced Sensor Updates
 * 
 * Sensor data arrives very rapidly (>10/second).
 * Debouncing reduces processing to once every 200ms.
 */
export function DebouncedSensorDisplay() {
  const [sensorData, setSensorData] = useState<any>(null);

  // Automatically debounced based on event type
  useWebSocketThrottled(
    'hardware:actualizacion_sensor',
    (data) => {
      setSensorData(data);
    },
    [setSensorData]
  );

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Sensor Data (Debounced)</h3>
      {sensorData && (
        <div>
          <p>Temperature: {sensorData.temperatura}°C</p>
          <p>Humidity: {sensorData.humedad}%</p>
          <p>Pressure: {sensorData.presion} hPa</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Throttled Chart Updates
 * 
 * Power data updates frequently. Throttling ensures
 * chart updates at most 60 times per second.
 */
export function ThrottledPowerChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useWebSocketThrottled(
    'dispositivo:actualizacion_potencia',
    (data) => {
      setChartData((prev) => {
        const newData = [...prev, data];
        // Keep only last 50 points
        return newData.slice(-50);
      });
    },
    [setChartData]
  );

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Power Chart (Throttled to 60fps)</h3>
      <RealtimeChart
        evento="dispositivo:actualizacion_potencia"
        maxDataPoints={50}
      >
        {(data) => (
          <div>
            {/* Your chart component here */}
            <p>Data points: {data.length}</p>
          </div>
        )}
      </RealtimeChart>
    </div>
  );
}

/**
 * Example 3: Event History with Memory Management
 * 
 * Keeps last 100 events with automatic cleanup.
 */
export function EventHistoryDisplay() {
  const { events, getRecent, clear, size } = useWebSocketHistory(
    'dispositivo:actualizacion',
    100, // Max 100 events
    true // Enable auto-cleanup
  );

  // Get events from last 5 minutes
  const recentEvents = getRecent(5 * 60 * 1000);

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Event History</h3>
        <button
          onClick={clear}
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
        >
          Clear
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Total: {size} | Recent (5min): {recentEvents.length}
      </p>
      <div className="max-h-64 overflow-y-auto">
        {events.slice(-10).map((event, i) => (
          <div key={i} className="text-xs border-b py-1">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Latest Value with Stale Detection
 * 
 * Shows only the latest value and detects when data is stale.
 */
export function LatestVoltageDisplay() {
  const { data, isStale, timeSinceUpdate } = useWebSocketLatest(
    'dispositivo:actualizacion_voltaje',
    30000 // Consider stale after 30 seconds
  );

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Current Voltage</h3>
      <div className={isStale ? 'opacity-50' : ''}>
        <p className="text-3xl font-bold">
          {data?.voltaje?.toFixed(2) || '--'} V
        </p>
        <p className="text-xs text-gray-600">
          {isStale ? (
            <span className="text-red-500">Stale data</span>
          ) : (
            `Updated ${Math.floor((timeSinceUpdate || 0) / 1000)}s ago`
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * Example 5: Aggregated Events
 * 
 * Aggregates multiple power readings into average.
 */
export function AveragePowerDisplay() {
  const avgPower = useWebSocketAggregated(
    'dispositivo:actualizacion_potencia',
    (events) => {
      if (events.length === 0) return null;
      const sum = events.reduce((acc, e) => acc + e.potenciaActiva, 0);
      return sum / events.length;
    },
    100 // Aggregate every 100ms
  );

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Average Power (100ms window)</h3>
      <p className="text-2xl font-bold">
        {avgPower?.toFixed(2) || '--'} W
      </p>
    </div>
  );
}

/**
 * Example 6: Using Optimized Components
 * 
 * Pre-built components with performance optimizations.
 */
export function OptimizedDashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <RealtimeValue
        evento="dispositivo:actualizacion_voltaje"
        label="Voltage"
        unit="V"
        formatter={(value) => value.voltaje.toFixed(2)}
        staleTimeMs={30000}
      />
      
      <RealtimeValue
        evento="dispositivo:actualizacion_corriente"
        label="Current"
        unit="A"
        formatter={(value) => value.corriente.toFixed(2)}
        staleTimeMs={30000}
      />
      
      <RealtimeValue
        evento="dispositivo:actualizacion_potencia"
        label="Power"
        unit="W"
        formatter={(value) => value.potenciaActiva.toFixed(2)}
        staleTimeMs={30000}
      />
    </div>
  );
}

/**
 * Example 7: Memory Monitoring
 * 
 * Monitor memory usage and listener statistics.
 */
export function MemoryMonitor() {
  const [stats, setStats] = useState<any>(null);

  const updateStats = () => {
    const manager = getMemoryManager();
    const listenerStats = manager.getListenerStats();
    const memoryEstimate = manager.getMemoryEstimate();
    const health = manager.checkMemoryLimits();

    setStats({
      listeners: listenerStats,
      memory: memoryEstimate,
      health,
    });
  };

  React.useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Memory Monitor</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Total Listeners:</strong> {stats.listeners.totalListeners}
        </div>
        
        <div>
          <strong>Unique Events:</strong>{' '}
          {Object.keys(stats.listeners.listenersByEvent).length}
        </div>
        
        <div>
          <strong>Memory Usage:</strong> ~{stats.memory.totalKB} KB
        </div>
        
        <div>
          <strong>Health:</strong>{' '}
          <span
            className={
              stats.health.isHealthy ? 'text-green-500' : 'text-red-500'
            }
          >
            {stats.health.isHealthy ? 'Healthy' : 'Issues Detected'}
          </span>
        </div>
        
        {stats.health.warnings.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-100 rounded">
            <strong>Warnings:</strong>
            <ul className="list-disc list-inside">
              {stats.health.warnings.map((warning: string, i: number) => (
                <li key={i} className="text-xs">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <button
        onClick={updateStats}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Refresh
      </button>
    </div>
  );
}

/**
 * Example 8: Complete Dashboard with All Optimizations
 */
export function CompleteDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Performance Optimized Dashboard
      </h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <OptimizedDashboard />
        <MemoryMonitor />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DebouncedSensorDisplay />
        <LatestVoltageDisplay />
        <AveragePowerDisplay />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ThrottledPowerChart />
        <EventHistoryDisplay />
      </div>
    </div>
  );
}
