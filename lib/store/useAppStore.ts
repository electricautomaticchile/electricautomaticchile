import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Tipos para el store
interface User {
  id: string;
  nombre: string;
  email: string;
  role: string;
  tipoUsuario: "superadmin" | "empresa" | "cliente";
  ultimoAcceso?: string;
}

interface Device {
  _id: string;
  idDispositivo: string;
  modelo: string;
  fabricante: string;
  tipoDispositivo: string;
  estado: "activo" | "inactivo" | "mantenimiento" | "fallo";
  cliente: string;
  fechaUltimaConexion?: string;
}

interface Alert {
  id: string;
  deviceId: string;
  tipoAlerta: string;
  mensaje: string;
  timestamp: string;
  esResuelta: boolean;
}

interface ConnectionStatus {
  api: boolean;
  websocket: boolean;
  lastCheck: string;
}

interface AppState {
  // Estados de autenticación
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Estados de dispositivos
  devices: Device[];
  selectedDevice: Device | null;
  alerts: Alert[];

  // Estados de UI
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  loading: {
    devices: boolean;
    statistics: boolean;
    auth: boolean;
  };

  // Estados de conexión
  connectionStatus: ConnectionStatus;

  // Cache de datos
  statisticsCache: Record<
    string,
    {
      data: any;
      timestamp: number;
      ttl: number;
    }
  >;
}

interface AppActions {
  // Acciones de autenticación
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  // Acciones de dispositivos
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  removeDevice: (deviceId: string) => void;
  selectDevice: (device: Device | null) => void;

  // Acciones de alertas
  addAlert: (alert: Alert) => void;
  resolveAlert: (alertId: string) => void;
  clearAlerts: () => void;

  // Acciones de UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLoading: (key: keyof AppState["loading"], loading: boolean) => void;

  // Acciones de conexión
  updateConnectionStatus: (status: Partial<ConnectionStatus>) => void;

  // Acciones de cache
  setStatisticsCache: (key: string, data: any, ttl?: number) => void;
  getStatisticsCache: (key: string) => any | null;
  clearStatisticsCache: (key?: string) => void;
}

type AppStore = AppState & AppActions;

// Store principal de la aplicación
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        token: null,
        devices: [],
        selectedDevice: null,
        alerts: [],
        sidebarOpen: true,
        theme: "system",
        loading: {
          devices: false,
          statistics: false,
          auth: false,
        },
        connectionStatus: {
          api: false,
          websocket: false,
          lastCheck: new Date().toISOString(),
        },
        statisticsCache: {},

        // Acciones de autenticación
        login: (user, token) => {
          set(
            {
              user,
              token,
              isAuthenticated: true,
            },
            false,
            "auth/login"
          );
        },

        logout: () => {
          // Limpiar localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }

          set(
            {
              user: null,
              token: null,
              isAuthenticated: false,
              devices: [],
              selectedDevice: null,
              alerts: [],
              statisticsCache: {},
            },
            false,
            "auth/logout"
          );
        },

        updateUser: (userUpdates) => {
          const currentUser = get().user;
          if (currentUser) {
            set(
              {
                user: { ...currentUser, ...userUpdates },
              },
              false,
              "auth/updateUser"
            );
          }
        },

        // Acciones de dispositivos
        setDevices: (devices) => {
          set({ devices }, false, "devices/setDevices");
        },

        addDevice: (device) => {
          set(
            (state) => ({
              devices: [...state.devices, device],
            }),
            false,
            "devices/addDevice"
          );
        },

        updateDevice: (deviceId, updates) => {
          set(
            (state) => ({
              devices: state.devices.map((device) =>
                device._id === deviceId || device.idDispositivo === deviceId
                  ? { ...device, ...updates }
                  : device
              ),
              selectedDevice:
                state.selectedDevice &&
                (state.selectedDevice._id === deviceId ||
                  state.selectedDevice.idDispositivo === deviceId)
                  ? { ...state.selectedDevice, ...updates }
                  : state.selectedDevice,
            }),
            false,
            "devices/updateDevice"
          );
        },

        removeDevice: (deviceId) => {
          set(
            (state) => ({
              devices: state.devices.filter(
                (device) =>
                  device._id !== deviceId && device.idDispositivo !== deviceId
              ),
              selectedDevice:
                state.selectedDevice &&
                (state.selectedDevice._id === deviceId ||
                  state.selectedDevice.idDispositivo === deviceId)
                  ? null
                  : state.selectedDevice,
            }),
            false,
            "devices/removeDevice"
          );
        },

        selectDevice: (device) => {
          set({ selectedDevice: device }, false, "devices/selectDevice");
        },

        // Acciones de alertas
        addAlert: (alert) => {
          set(
            (state) => {
              // Evitar duplicados
              const exists = state.alerts.some((a) => a.id === alert.id);
              if (exists) return state;

              return {
                alerts: [alert, ...state.alerts].slice(0, 100), // Mantener solo 100 alertas
              };
            },
            false,
            "alerts/addAlert"
          );
        },

        resolveAlert: (alertId) => {
          set(
            (state) => ({
              alerts: state.alerts.map((alert) =>
                alert.id === alertId ? { ...alert, esResuelta: true } : alert
              ),
            }),
            false,
            "alerts/resolveAlert"
          );
        },

        clearAlerts: () => {
          set({ alerts: [] }, false, "alerts/clearAlerts");
        },

        // Acciones de UI
        toggleSidebar: () => {
          set(
            (state) => ({
              sidebarOpen: !state.sidebarOpen,
            }),
            false,
            "ui/toggleSidebar"
          );
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, "ui/setSidebarOpen");
        },

        setTheme: (theme) => {
          set({ theme }, false, "ui/setTheme");
        },

        setLoading: (key, loading) => {
          set(
            (state) => ({
              loading: {
                ...state.loading,
                [key]: loading,
              },
            }),
            false,
            `loading/set${key.charAt(0).toUpperCase() + key.slice(1)}`
          );
        },

        // Acciones de conexión
        updateConnectionStatus: (status) => {
          set(
            (state) => ({
              connectionStatus: {
                ...state.connectionStatus,
                ...status,
                lastCheck: new Date().toISOString(),
              },
            }),
            false,
            "connection/updateStatus"
          );
        },

        // Acciones de cache
        setStatisticsCache: (key, data, ttl = 5 * 60 * 1000) => {
          // TTL por defecto: 5 minutos
          set(
            (state) => ({
              statisticsCache: {
                ...state.statisticsCache,
                [key]: {
                  data,
                  timestamp: Date.now(),
                  ttl,
                },
              },
            }),
            false,
            "cache/setStatistics"
          );
        },

        getStatisticsCache: (key) => {
          const cache = get().statisticsCache[key];
          if (!cache) return null;

          const now = Date.now();
          if (now - cache.timestamp > cache.ttl) {
            // Cache expirado
            get().clearStatisticsCache(key);
            return null;
          }

          return cache.data;
        },

        clearStatisticsCache: (key) => {
          if (key) {
            set(
              (state) => {
                const newCache = { ...state.statisticsCache };
                delete newCache[key];
                return { statisticsCache: newCache };
              },
              false,
              "cache/clearSpecific"
            );
          } else {
            set({ statisticsCache: {} }, false, "cache/clearAll");
          }
        },
      }),
      {
        name: "electricautomaticchile-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: "ElectricAutomaticChile Store",
    }
  )
);

// Hooks selectores para optimizar re-renders
export const useAuth = () =>
  useAppStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
  }));

export const useDevices = () =>
  useAppStore((state) => ({
    devices: state.devices,
    selectedDevice: state.selectedDevice,
    setDevices: state.setDevices,
    addDevice: state.addDevice,
    updateDevice: state.updateDevice,
    removeDevice: state.removeDevice,
    selectDevice: state.selectDevice,
  }));

export const useAlerts = () =>
  useAppStore((state) => ({
    alerts: state.alerts,
    addAlert: state.addAlert,
    resolveAlert: state.resolveAlert,
    clearAlerts: state.clearAlerts,
  }));

export const useUI = () =>
  useAppStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    theme: state.theme,
    loading: state.loading,
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    setTheme: state.setTheme,
    setLoading: state.setLoading,
  }));

export const useConnection = () =>
  useAppStore((state) => ({
    connectionStatus: state.connectionStatus,
    updateConnectionStatus: state.updateConnectionStatus,
  }));

export const useCache = () =>
  useAppStore((state) => ({
    setStatisticsCache: state.setStatisticsCache,
    getStatisticsCache: state.getStatisticsCache,
    clearStatisticsCache: state.clearStatisticsCache,
  }));
