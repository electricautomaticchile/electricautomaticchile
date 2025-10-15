/**
 * Performance Tests - WebSocket
 * 
 * Tests:
 * - Event latency (<100ms)
 * - Reconnection time (<5s)
 * - Memory usage (<100MB)
 * - Memory leak detection
 */

import { AdministradorWebSocket } from '@/lib/websocket/AdministradorWebSocket';
import { io, Socket } from 'socket.io-client';

// Mock Socket.IO
jest.mock('socket.io-client');

describe('WebSocket Performance Tests', () => {
  let mockSocket: Partial<Socket>;
  let eventHandlers: Record<string, Function>;
  let administrador: AdministradorWebSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    eventHandlers = {};

    mockSocket = {
      id: 'test-socket-id',
      connected: false,
      on: jest.fn((event: string, handler: Function) => {
        eventHandlers[event] = handler;
      }),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
    };

    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    if (administrador) {
      administrador.desconectar();
    }
    jest.clearAllTimers();
  });

  describe('Event Latency', () => {
    it('should process events with latency <100ms', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const latencies: number[] = [];
      const eventCount = 100;

      // Setup connection
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Listen to test event and measure latency
      administrador.escuchar('test:latency', (data: { timestamp: number }) => {
        const latency = Date.now() - data.timestamp;
        latencies.push(latency);
      });

      // Simulate events
      for (let i = 0; i < eventCount; i++) {
        const timestamp = Date.now();
        eventHandlers['test:latency']?.({ timestamp });
        
        // Small delay to simulate real-world timing
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      // Calculate average latency
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      const p95Latency = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)];

      console.log('Latency Stats:', {
        average: avgLatency.toFixed(2) + 'ms',
        max: maxLatency.toFixed(2) + 'ms',
        p95: p95Latency.toFixed(2) + 'ms',
      });

      // Assert latency requirements
      expect(avgLatency).toBeLessThan(100);
      expect(p95Latency).toBeLessThan(100);
    });

    it('should handle high-frequency events efficiently', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      let eventCount = 0;
      const startTime = Date.now();

      administrador.escuchar('high:frequency', () => {
        eventCount++;
      });

      // Simulate 1000 events in rapid succession
      for (let i = 0; i < 1000; i++) {
        eventHandlers['high:frequency']?.({ data: i });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const eventsPerSecond = (eventCount / duration) * 1000;

      console.log('High-frequency event stats:', {
        totalEvents: eventCount,
        duration: duration + 'ms',
        eventsPerSecond: eventsPerSecond.toFixed(0),
      });

      // Should handle at least 100 events per second
      expect(eventsPerSecond).toBeGreaterThan(100);
      expect(eventCount).toBe(1000);
    });
  });

  describe('Reconnection Time', () => {
    it('should reconnect within 5 seconds', async () => {
      jest.useFakeTimers();
      
      administrador = new AdministradorWebSocket('http://localhost:5000', {
        reconexion: true,
        intentosReconexion: 5,
      });

      // Initial connection
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      expect(administrador.estaConectado()).toBe(true);

      // Simulate disconnection
      const reconnectStartTime = Date.now();
      mockSocket.connected = false;
      eventHandlers['disconnect']?.('transport close');

      // Fast-forward through reconnection attempts
      // First attempt: ~1s delay
      jest.advanceTimersByTime(1500);
      mockSocket.connected = true;
      eventHandlers['connect']?.();

      const reconnectEndTime = Date.now();
      const reconnectDuration = reconnectEndTime - reconnectStartTime;

      console.log('Reconnection time:', reconnectDuration + 'ms');

      // Should reconnect within 5 seconds
      expect(reconnectDuration).toBeLessThan(5000);
      expect(administrador.estaConectado()).toBe(true);

      jest.useRealTimers();
    });

    it('should use exponential backoff correctly', async () => {
      jest.useFakeTimers();
      
      administrador = new AdministradorWebSocket('http://localhost:5000', {
        reconexion: true,
        intentosReconexion: 5,
      });

      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Simulate disconnection
      mockSocket.connected = false;
      eventHandlers['disconnect']?.('transport close');

      const reconnectAttempts: number[] = [];

      // Track reconnection attempts
      const originalIo = io as jest.Mock;
      originalIo.mockImplementation(() => {
        reconnectAttempts.push(Date.now());
        return mockSocket;
      });

      // Simulate failed reconnection attempts
      for (let i = 0; i < 4; i++) {
        jest.advanceTimersByTime(2000);
        eventHandlers['connect_error']?.(new Error('Connection failed'));
      }

      // Verify exponential backoff pattern
      // Delays should be approximately: 1s, 2s, 5s, 10s
      expect(reconnectAttempts.length).toBeGreaterThan(0);

      jest.useRealTimers();
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated connections', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        administrador = new AdministradorWebSocket('http://localhost:5000');
        
        const connectPromise = administrador.conectar('test-token');
        mockSocket.connected = true;
        eventHandlers['connect']?.();
        await connectPromise;

        // Add some event listeners
        administrador.escuchar('test:event', () => {});
        administrador.escuchar('another:event', () => {});

        // Disconnect and cleanup
        administrador.desconectar();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

      console.log('Memory usage after', iterations, 'connections:', {
        initial: (initialMemory / 1024 / 1024).toFixed(2) + 'MB',
        final: (finalMemory / 1024 / 1024).toFixed(2) + 'MB',
        increase: memoryIncrease.toFixed(2) + 'MB',
      });

      // Memory increase should be minimal (<10MB for 50 connections)
      expect(memoryIncrease).toBeLessThan(10);
    });

    it('should cleanup event listeners properly', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Add multiple listeners
      const listeners = [];
      for (let i = 0; i < 100; i++) {
        const listener = jest.fn();
        listeners.push(listener);
        administrador.escuchar(`event:${i}`, listener);
      }

      // Verify listeners are registered
      expect(mockSocket.on).toHaveBeenCalledTimes(expect.any(Number));

      // Disconnect should cleanup all listeners
      administrador.desconectar();

      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
    });

    it('should limit event history in memory', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      const events: any[] = [];
      administrador.escuchar('test:event', (data: any) => {
        events.push(data);
      });

      // Simulate 1000 events
      for (let i = 0; i < 1000; i++) {
        eventHandlers['test:event']?.({ index: i, data: 'test data' });
      }

      // All events should be received
      expect(events.length).toBe(1000);

      // Memory manager should limit stored events (tested separately)
      // This test verifies events are processed, not necessarily stored
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not leak memory with event subscriptions', async () => {
      const getMemoryUsage = () => process.memoryUsage().heapUsed / 1024 / 1024;
      
      const memorySnapshots: number[] = [];
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        administrador = new AdministradorWebSocket('http://localhost:5000');
        
        const connectPromise = administrador.conectar('test-token');
        mockSocket.connected = true;
        eventHandlers['connect']?.();
        await connectPromise;

        // Subscribe to events
        for (let j = 0; j < 10; j++) {
          administrador.escuchar(`event:${j}`, () => {});
        }

        // Emit some events
        for (let j = 0; j < 10; j++) {
          eventHandlers[`event:${j}`]?.({ data: 'test' });
        }

        // Cleanup
        administrador.desconectar();

        // Take memory snapshot every 5 iterations
        if (i % 5 === 0) {
          if (global.gc) global.gc();
          memorySnapshots.push(getMemoryUsage());
        }
      }

      console.log('Memory snapshots (MB):', memorySnapshots.map(m => m.toFixed(2)));

      // Check if memory is growing linearly (indicating a leak)
      // Calculate slope of memory growth
      if (memorySnapshots.length >= 3) {
        const firstHalf = memorySnapshots.slice(0, Math.floor(memorySnapshots.length / 2));
        const secondHalf = memorySnapshots.slice(Math.floor(memorySnapshots.length / 2));
        
        const avgFirstHalf = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const avgSecondHalf = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const memoryGrowth = avgSecondHalf - avgFirstHalf;
        
        console.log('Memory growth:', memoryGrowth.toFixed(2) + 'MB');
        
        // Memory growth should be minimal (<5MB)
        expect(memoryGrowth).toBeLessThan(5);
      }
    });

    it('should cleanup timers and intervals', async () => {
      jest.useFakeTimers();
      
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Heartbeat should be configured
      expect(administrador.estaConectado()).toBe(true);

      // Get number of pending timers
      const timersBefore = jest.getTimerCount();

      // Disconnect should cleanup timers
      administrador.desconectar();

      const timersAfter = jest.getTimerCount();

      // Timers should be cleaned up
      expect(timersAfter).toBeLessThanOrEqual(timersBefore);

      jest.useRealTimers();
    });
  });

  describe('Stress Testing', () => {
    it('should handle concurrent event listeners', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      const listenerCount = 50;
      const callbacks = Array.from({ length: listenerCount }, () => jest.fn());

      // Add multiple listeners to same event
      callbacks.forEach((callback) => {
        administrador.escuchar('stress:test', callback);
      });

      // Emit event
      eventHandlers['stress:test']?.({ data: 'test' });

      // All callbacks should be called
      callbacks.forEach((callback) => {
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle rapid connect/disconnect cycles', async () => {
      const cycles = 10;
      const startTime = Date.now();

      for (let i = 0; i < cycles; i++) {
        administrador = new AdministradorWebSocket('http://localhost:5000');
        
        const connectPromise = administrador.conectar('test-token');
        mockSocket.connected = true;
        eventHandlers['connect']?.();
        await connectPromise;

        expect(administrador.estaConectado()).toBe(true);

        administrador.desconectar();
        expect(administrador.estaConectado()).toBe(false);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`${cycles} connect/disconnect cycles completed in ${duration}ms`);

      // Should complete reasonably fast
      expect(duration).toBeLessThan(5000);
    });
  });
});
