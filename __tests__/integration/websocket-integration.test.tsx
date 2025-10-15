/**
 * Integration Tests - WebSocket Complete Flow
 * 
 * Tests:
 * - Login → WebSocket connection → Events → Logout flow
 * - Dashboard Cliente with real-time data
 * - Dashboard Empresa with device control
 * - Dashboard Superadmin with global metrics
 * - Alert notifications
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ProveedorWebSocket } from '@/lib/websocket/ProveedorWebSocket';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { TokenManager } from '@/lib/api/utils/tokenManager';
import { io, Socket } from 'socket.io-client';

// Mock Socket.IO
jest.mock('socket.io-client');

// Mock TokenManager
jest.mock('@/lib/api/utils/tokenManager', () => ({
  TokenManager: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('WebSocket Integration Tests', () => {
  let mockSocket: Partial<Socket>;
  let eventHandlers: Record<string, Function>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    eventHandlers = {};

    // Create mock socket
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

    // Mock io to return our mock socket
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Complete Flow: Login → Connection → Events → Logout', () => {
    it('should establish WebSocket connection after login', async () => {
      // Simulate user login
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      // Render provider
      const { rerender } = render(
        <ProveedorWebSocket>
          <div>Test App</div>
        </ProveedorWebSocket>
      );

      // Wait for connection attempt
      await waitFor(() => {
        expect(io).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            auth: { token: mockToken },
          })
        );
      });

      // Simulate successful connection
      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Verify connection is established
      await waitFor(() => {
        expect(mockSocket.connected).toBe(true);
      });
    });

    it('should disconnect WebSocket on logout', async () => {
      // Setup connected state
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const { rerender } = render(
        <ProveedorWebSocket>
          <div>Test App</div>
        </ProveedorWebSocket>
      );

      // Simulate connection
      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate logout (token removed)
      (TokenManager.getToken as jest.Mock).mockReturnValue(null);

      // Wait for disconnection
      await waitFor(() => {
        expect(mockSocket.disconnect).toHaveBeenCalled();
      }, { timeout: 6000 });
    });

    it('should handle events during active session', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const eventCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      const { result } = renderHook(() => useWebSocket('test:event', eventCallback), {
        wrapper,
      });

      // Wait for connection
      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate event received
      const testData = { message: 'test data' };
      act(() => {
        eventHandlers['test:event']?.(testData);
      });

      // Verify callback was called
      await waitFor(() => {
        expect(eventCallback).toHaveBeenCalledWith(testData);
      });
    });
  });

  describe('Dashboard Cliente - Real-time Data', () => {
    it('should receive and handle power updates', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const powerUpdateCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(
        () => useWebSocket('dispositivo:actualizacion_potencia', powerUpdateCallback),
        { wrapper }
      );

      // Wait for connection
      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate power update event
      const powerData = {
        idDispositivo: 'device-123',
        potenciaActiva: 1500,
        energia: 45.5,
        costo: 12.5,
        marcaTiempo: new Date().toISOString(),
      };

      act(() => {
        eventHandlers['dispositivo:actualizacion_potencia']?.(powerData);
      });

      // Verify callback received data
      await waitFor(() => {
        expect(powerUpdateCallback).toHaveBeenCalledWith(powerData);
      });
    });

    it('should receive and handle voltage updates', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const voltageUpdateCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(
        () => useWebSocket('dispositivo:actualizacion_voltaje', voltageUpdateCallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate voltage update
      const voltageData = {
        idDispositivo: 'device-123',
        voltaje: 220,
        fase: 'L1',
        calidad: 'buena' as const,
        marcaTiempo: new Date().toISOString(),
      };

      act(() => {
        eventHandlers['dispositivo:actualizacion_voltaje']?.(voltageData);
      });

      await waitFor(() => {
        expect(voltageUpdateCallback).toHaveBeenCalledWith(voltageData);
      });
    });
  });

  describe('Dashboard Empresa - Device Control', () => {
    it('should handle hardware command results', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const commandResultCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      const { result } = renderHook(
        () => useWebSocket('hardware:resultado_comando', commandResultCallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate command result
      const commandResult = {
        idComando: 'cmd-456',
        idDispositivo: 'device-123',
        exitoso: true,
        resultado: { estado: 'encendido' },
        tiempoEjecucion: 150,
      };

      act(() => {
        eventHandlers['hardware:resultado_comando']?.(commandResult);
      });

      await waitFor(() => {
        expect(commandResultCallback).toHaveBeenCalledWith(commandResult);
      });
    });

    it('should handle sensor updates', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const sensorUpdateCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(
        () => useWebSocket('hardware:actualizacion_sensor', sensorUpdateCallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate sensor update
      const sensorData = {
        idDispositivo: 'device-123',
        tipo: 'temperatura',
        valor: 25.5,
        unidad: '°C',
        marcaTiempo: new Date().toISOString(),
      };

      act(() => {
        eventHandlers['hardware:actualizacion_sensor']?.(sensorData);
      });

      await waitFor(() => {
        expect(sensorUpdateCallback).toHaveBeenCalledWith(sensorData);
      });
    });

    it('should handle device connection status updates', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const connectionUpdateCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(
        () => useWebSocket('dispositivo:actualizacion_conexion', connectionUpdateCallback),
        { wrapper }
      );

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate device going offline
      const connectionData = {
        idDispositivo: 'device-123',
        estado: 'desconectado' as const,
        ultimaVez: new Date(),
        marcaTiempo: new Date().toISOString(),
      };

      act(() => {
        eventHandlers['dispositivo:actualizacion_conexion']?.(connectionData);
      });

      await waitFor(() => {
        expect(connectionUpdateCallback).toHaveBeenCalledWith(connectionData);
      });
    });
  });

  describe('Dashboard Superadmin - Global Metrics', () => {
    it('should receive system-wide metrics', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const metricsCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(() => useWebSocket('sistema:metricas', metricsCallback), { wrapper });

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate system metrics
      const metricsData = {
        dispositivosConectados: 150,
        eventosPorSegundo: 45,
        latenciaPromedio: 85,
        alertasActivas: 3,
        marcaTiempo: new Date().toISOString(),
      };

      act(() => {
        eventHandlers['sistema:metricas']?.(metricsData);
      });

      await waitFor(() => {
        expect(metricsCallback).toHaveBeenCalledWith(metricsData);
      });
    });
  });

  describe('Alert Notifications', () => {
    it('should receive and handle IoT alerts', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const alertCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(() => useWebSocket('iot:alerta:nueva', alertCallback), { wrapper });

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate critical alert
      const alertData = {
        id: 'alert-789',
        idDispositivo: 'device-123',
        tipo: 'umbral' as const,
        severidad: 'critica' as const,
        titulo: 'Sobrecarga detectada',
        mensaje: 'El dispositivo ha excedido el límite de potencia',
        marcaTiempo: new Date().toISOString(),
        resuelta: false,
      };

      act(() => {
        eventHandlers['iot:alerta:nueva']?.(alertData);
      });

      await waitFor(() => {
        expect(alertCallback).toHaveBeenCalledWith(alertData);
      });
    });

    it('should handle multiple alerts correctly', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const alertCallback = jest.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      renderHook(() => useWebSocket('iot:alerta:nueva', alertCallback), { wrapper });

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // Simulate multiple alerts
      const alerts = [
        {
          id: 'alert-1',
          idDispositivo: 'device-1',
          tipo: 'umbral' as const,
          severidad: 'alta' as const,
          titulo: 'Alert 1',
          mensaje: 'Message 1',
          marcaTiempo: new Date().toISOString(),
          resuelta: false,
        },
        {
          id: 'alert-2',
          idDispositivo: 'device-2',
          tipo: 'anomalia' as const,
          severidad: 'media' as const,
          titulo: 'Alert 2',
          mensaje: 'Message 2',
          marcaTiempo: new Date().toISOString(),
          resuelta: false,
        },
      ];

      act(() => {
        alerts.forEach((alert) => {
          eventHandlers['iot:alerta:nueva']?.(alert);
        });
      });

      await waitFor(() => {
        expect(alertCallback).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Connection State Indicators', () => {
    it('should accurately reflect connection state', async () => {
      const mockToken = 'mock-jwt-token';
      (TokenManager.getToken as jest.Mock).mockReturnValue(mockToken);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProveedorWebSocket>{children}</ProveedorWebSocket>
      );

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      // Initial state should be disconnected or connecting (since auto-connect is enabled)
      expect(['desconectado', 'conectando']).toContain(result.current.estadoConexion);

      // Wait for connection attempt
      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      // Simulate connection
      act(() => {
        mockSocket.connected = true;
        eventHandlers['connect']?.();
      });

      // State should update to connected
      await waitFor(() => {
        expect(result.current.estaConectado).toBe(true);
        expect(result.current.estadoConexion).toBe('conectado');
      });

      // Simulate disconnection
      act(() => {
        mockSocket.connected = false;
        eventHandlers['disconnect']?.('transport close');
      });

      // State should update to disconnected/reconnecting
      await waitFor(() => {
        expect(result.current.estaConectado).toBe(false);
      });
    });
  });
});
