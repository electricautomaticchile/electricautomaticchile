// Importar el extend-expect de Testing Library
import "@testing-library/jest-dom";

// Configuración global para los tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock para window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para fetch
global.fetch = jest.fn();

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

// Aumentar el timeout para tests que lo necesiten
jest.setTimeout(30000);
