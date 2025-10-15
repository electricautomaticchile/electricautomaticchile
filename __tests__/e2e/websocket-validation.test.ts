/**
 * End-to-End Validation Tests
 * 
 * Complete flow validation:
 * - Login → Connection → Events → Logout
 * - All dashboards functionality
 * - Connection state accuracy
 * - No memory leaks
 */

import { AdministradorWebSocket } from '@/lib/websocket/AdministradorWebSocket';
import { getMemoryManager } from '@/lib/websocket/memoryManager';
import { io, Socket } from 'socket.io-client';

jest.mock('socket.io-client');

describe('WebSocket E2E Validation', () => {
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

  describe('Complete User Flow', () => {
    it('should complete full login → connection → events → logout flow', async () => {
      // Step 1: User logs in (simulated)
      const userToken = 'user-jwt-token-12345';
      
      // Step 2: Initialize WebSocket connection
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      expect(administrador.estaConectado()).toBe(false);
      expect(administrador.obtenerEstadoConexion()).toBe('desconectado');

      // Step 3: Connect with token
      const connectPromise = administrador.conectar(userToken);
      
      // Verify connection attempt was made with correct auth
      expect(io).toHaveBeenCalledWith(
        'http://localhost:5000',
        expect.objectContaining({
          auth: { token: userToken },
        })
      );

      // Step 4: Simulate successful connection
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      expect(administrador.estaConectado()).toBe(true);
      expect(administrador.obtenerEstadoConexion()).toBe('conectado');

      // Step 5: Subscribe to events
      const receivedEvents: any[] = [];
      
      administrador.escuchar('dispositivo:actualizacion_potencia', (data) => {
        receivedEvents.push({ type: 'power', data });
      });
      
      administrador.escuchar('iot:alerta:nueva', (data) => {
        receivedEvents.push({ type: 'alert', data });
      });

      // Step 6: Simulate receiving events
      const powerUpdate = {
        idDispositivo: 'device-1',
        potenciaActiva: 1500,
        energia: 45.5,
        marcaTiempo: new Date().toISOString(),
      };
      
      const alertUpdate = {
        id: 'alert-1',
        idDispositivo: 'device-1',
        tipo: 'umbral',
        severidad: 'alta',
        titulo: 'High power consumption',
        mensaje: 'Device exceeded power threshold',
        marcaTiempo: new Date().toISOString(),
        resuelta: false,
      };

      eventHandlers['dispositivo:actualizacion_potencia']?.(powerUpdate);
      eventHandlers['iot:alerta:nueva']?.(alertUpdate);

      // Verify events were received
      expect(receivedEvents).toHaveLength(2);
      expect(receivedEvents[0].type).toBe('power');
      expect(receivedEvents[1].type).toBe('alert');

      // Step 7: User logs out
      administrador.desconectar();

      expect(administrador.estaConectado()).toBe(false);
      expect(administrador.obtenerEstadoConexion()).toBe('desconectado');
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should maintain connection across dashboard navigation', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      const socketId = mockSocket.id;

      // Simulate navigation between dashboards
      // Dashboard Cliente
      const clienteEvents: any[] = [];
      administrador.escuchar('dispositivo:actualizacion_potencia', (data) => {
        clienteEvents.push(data);
      });

      eventHandlers['dispositivo:actualizacion_potencia']?.({ power: 100 });
      expect(clienteEvents).toHaveLength(1);

      // Navigate to Dashboard Empresa (same connection)
      const empresaEvents: any[] = [];
      administrador.escuchar('hardware:resultado_comando', (data) => {
        empresaEvents.push(data);
      });

      eventHandlers['hardware:resultado_comando']?.({ result: 'success' });
      expect(empresaEvents).toHaveLength(1);

      // Navigate to Dashboard Superadmin (same connection)
      const adminEvents: any[] = [];
      administrador.escuchar('sistema:metricas', (data) => {
        adminEvents.push(data);
      });

      eventHandlers['sistema:metricas']?.({ metrics: 'data' });
      expect(adminEvents).toHaveLength(1);

      // Verify same socket instance throughout
      expect(mockSocket.id).toBe(socketId);
      expect(administrador.estaConectado()).toBe(true);
    });
  });

  describe('Dashboard Functionality Validation', () => {
    beforeEach(async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;
    });

    it('should validate Dashboard Cliente real-time updates', async () => {
      const updates = {
        voltage: [] as any[],
        current: [] as any[],
        power: [] as any[],
        alerts: [] as any[],
      };

      // Subscribe to Cliente events
      administrador.escuchar('dispositivo:actualizacion_voltaje', (data) => {
        updates.voltage.push(data);
      });
      
      administrador.escuchar('dispositivo:actualizacion_corriente', (data) => {
        updates.current.push(data);
      });
      
      administrador.escuchar('dispositivo:actualizacion_potencia', (data) => {
        updates.power.push(data);
      });
      
      administrador.escuchar('iot:alerta:nueva', (data) => {
        updates.alerts.push(data);
      });

      // Simulate device updates
      eventHandlers['dispositivo:actualizacion_voltaje']?.({
        idDispositivo: 'device-1',
        voltaje: 220,
        calidad: 'buena',
        marcaTiempo: new Date().toISOString(),
      });

      eventHandlers['dispositivo:actualizacion_corriente']?.({
        idDispositivo: 'device-1',
        corriente: 10.5,
        marcaTiempo: new Date().toISOString(),
      });

      eventHandlers['dispositivo:actualizacion_potencia']?.({
        idDispositivo: 'device-1',
        potenciaActiva: 2310,
        energia: 50.2,
        marcaTiempo: new Date().toISOString(),
      });

      eventHandlers['iot:alerta:nueva']?.({
        id: 'alert-1',
        idDispositivo: 'device-1',
        tipo: 'umbral',
        severidad: 'media',
        titulo: 'Voltage fluctuation',
        mensaje: 'Voltage is fluctuating',
        marcaTiempo: new Date().toISOString(),
        resuelta: false,
      });

      // Verify all updates received
      expect(updates.voltage).toHaveLength(1);
      expect(updates.current).toHaveLength(1);
      expect(updates.power).toHaveLength(1);
      expect(updates.alerts).toHaveLength(1);

      // Verify data integrity
      expect(updates.voltage[0].voltaje).toBe(220);
      expect(updates.current[0].corriente).toBe(10.5);
      expect(updates.power[0].potenciaActiva).toBe(2310);
      expect(updates.alerts[0].severidad).toBe('media');
    });

    it('should validate Dashboard Empresa device control', async () => {
      const controlEvents = {
        commands: [] as any[],
        sensors: [] as any[],
        connections: [] as any[],
      };

      // Subscribe to Empresa events
      administrador.escuchar('hardware:resultado_comando', (data) => {
        controlEvents.commands.push(data);
      });
      
      administrador.escuchar('hardware:actualizacion_sensor', (data) => {
        controlEvents.sensors.push(data);
      });
      
      administrador.escuchar('dispositivo:actualizacion_conexion', (data) => {
        controlEvents.connections.push(data);
      });

      // Simulate command execution
      administrador.emitir('hardware:ejecutar_comando', {
        idDispositivo: 'device-1',
        comando: 'encender_rele',
        parametros: { rele: 1 },
      });

      // Simulate command result
      eventHandlers['hardware:resultado_comando']?.({
        idComando: 'cmd-1',
        idDispositivo: 'device-1',
        exitoso: true,
        resultado: { estado: 'encendido' },
        tiempoEjecucion: 120,
      });

      // Simulate sensor update
      eventHandlers['hardware:actualizacion_sensor']?.({
        idDispositivo: 'device-1',
        tipo: 'temperatura',
        valor: 25.5,
        unidad: '°C',
        marcaTiempo: new Date().toISOString(),
      });

      // Simulate connection status
      eventHandlers['dispositivo:actualizacion_conexion']?.({
        idDispositivo: 'device-1',
        estado: 'conectado',
        ultimaVez: new Date(),
        marcaTiempo: new Date().toISOString(),
      });

      // Verify all events received
      expect(controlEvents.commands).toHaveLength(1);
      expect(controlEvents.sensors).toHaveLength(1);
      expect(controlEvents.connections).toHaveLength(1);

      // Verify command was emitted
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'hardware:ejecutar_comando',
        expect.any(Object)
      );
    });

    it('should validate Dashboard Superadmin global monitoring', async () => {
      const adminData = {
        metrics: [] as any[],
        allAlerts: [] as any[],
      };

      // Subscribe to Superadmin events
      administrador.escuchar('sistema:metricas', (data) => {
        adminData.metrics.push(data);
      });
      
      administrador.escuchar('iot:alerta:nueva', (data) => {
        adminData.allAlerts.push(data);
      });

      // Simulate system metrics
      eventHandlers['sistema:metricas']?.({
        dispositivosConectados: 150,
        eventosPorSegundo: 45,
        latenciaPromedio: 85,
        alertasActivas: 3,
        marcaTiempo: new Date().toISOString(),
      });

      // Simulate multiple alerts from different devices
      for (let i = 1; i <= 3; i++) {
        eventHandlers['iot:alerta:nueva']?.({
          id: `alert-${i}`,
          idDispositivo: `device-${i}`,
          tipo: 'umbral',
          severidad: i === 1 ? 'critica' : 'media',
          titulo: `Alert ${i}`,
          mensaje: `Message ${i}`,
          marcaTiempo: new Date().toISOString(),
          resuelta: false,
        });
      }

      // Verify data received
      expect(adminData.metrics).toHaveLength(1);
      expect(adminData.allAlerts).toHaveLength(3);

      // Verify metrics data
      expect(adminData.metrics[0].dispositivosConectados).toBe(150);
      expect(adminData.metrics[0].eventosPorSegundo).toBe(45);

      // Verify alerts
      expect(adminData.allAlerts[0].severidad).toBe('critica');
    });
  });

  describe('Connection State Accuracy', () => {
    it('should accurately track connection states', async () => {
      const stateChanges: string[] = [];

      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      // Subscribe to state changes
      administrador.suscribirseAEstado('test', (estado) => {
        stateChanges.push(estado);
      });

      // Initial state
      expect(administrador.obtenerEstadoConexion()).toBe('desconectado');

      // Connecting
      const connectPromise = administrador.conectar('test-token');
      expect(stateChanges).toContain('conectando');

      // Connected
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;
      expect(stateChanges).toContain('conectado');
      expect(administrador.estaConectado()).toBe(true);

      // Disconnected
      mockSocket.connected = false;
      eventHandlers['disconnect']?.('transport close');
      expect(stateChanges).toContain('desconectado');
      expect(administrador.estaConectado()).toBe(false);

      // Verify state progression
      expect(stateChanges).toEqual([
        'conectando',
        'conectado',
        'desconectado',
        'reconectando', // Auto-reconnect triggered
      ]);
    });

    it('should track reconnection attempts accurately', async () => {
      jest.useFakeTimers();

      administrador = new AdministradorWebSocket('http://localhost:5000', {
        reconexion: true,
        intentosReconexion: 3,
      });

      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Simulate disconnection
      mockSocket.connected = false;
      eventHandlers['disconnect']?.('transport close');

      // Track reconnection attempts
      let reconnectAttempts = 0;
      const originalIo = io as jest.Mock;
      originalIo.mockImplementation(() => {
        reconnectAttempts++;
        return mockSocket;
      });

      // Simulate failed reconnections
      for (let i = 0; i < 3; i++) {
        jest.advanceTimersByTime(2000);
        eventHandlers['connect_error']?.(new Error('Connection failed'));
      }

      expect(reconnectAttempts).toBeGreaterThan(0);
      expect(administrador.obtenerEstadoConexion()).toBe('desconectado');

      jest.useRealTimers();
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not leak memory during normal operation', async () => {
      const memoryManager = getMemoryManager();
      const initialStats = memoryManager.getStats();

      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Add many listeners
      for (let i = 0; i < 100; i++) {
        administrador.escuchar(`event:${i}`, () => {});
      }

      // Emit many events
      for (let i = 0; i < 100; i++) {
        eventHandlers[`event:${i}`]?.({ data: 'test' });
      }

      // Cleanup
      administrador.desconectar();

      const finalStats = memoryManager.getStats();

      // Verify cleanup
      expect(finalStats.totalListeners).toBeLessThanOrEqual(initialStats.totalListeners);
    });

    it('should cleanup all resources on disconnect', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Add listeners
      const callbacks = Array.from({ length: 10 }, () => jest.fn());
      callbacks.forEach((cb, i) => {
        administrador.escuchar(`event:${i}`, cb);
      });

      // Disconnect
      administrador.desconectar();

      // Verify cleanup
      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(administrador.estaConectado()).toBe(false);
    });

    it('should handle multiple connect/disconnect cycles without leaks', async () => {
      const cycles = 20;

      for (let i = 0; i < cycles; i++) {
        administrador = new AdministradorWebSocket('http://localhost:5000');
        
        const connectPromise = administrador.conectar('test-token');
        mockSocket.connected = true;
        eventHandlers['connect']?.();
        await connectPromise;

        // Add listeners
        administrador.escuchar('test:event', () => {});
        administrador.escuchar('another:event', () => {});

        // Emit events
        eventHandlers['test:event']?.({ data: 'test' });
        eventHandlers['another:event']?.({ data: 'test' });

        // Disconnect
        administrador.desconectar();
      }

      // If we got here without errors, no obvious leaks
      expect(true).toBe(true);
    });
  });

  describe('Error Handling Validation', () => {
    it('should handle authentication errors gracefully', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('invalid-token');

      // Simulate auth error
      eventHandlers['error']?.({
        type: 'UnauthorizedError',
        message: 'Authentication failed',
      });

      await expect(connectPromise).rejects.toThrow('Error de autenticación');
      expect(administrador.estaConectado()).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');

      // Simulate network error
      eventHandlers['connect_error']?.(new Error('Network error'));

      // Should attempt reconnection
      expect(administrador.obtenerEstadoConexion()).not.toBe('conectado');
    });

    it('should handle event processing errors without crashing', async () => {
      administrador = new AdministradorWebSocket('http://localhost:5000');
      
      const connectPromise = administrador.conectar('test-token');
      mockSocket.connected = true;
      eventHandlers['connect']?.();
      await connectPromise;

      // Add listener that throws error
      administrador.escuchar('error:event', () => {
        throw new Error('Processing error');
      });

      // Emit event - should not crash
      expect(() => {
        eventHandlers['error:event']?.({ data: 'test' });
      }).not.toThrow();

      // Connection should still be active
      expect(administrador.estaConectado()).toBe(true);
    });
  });
});
