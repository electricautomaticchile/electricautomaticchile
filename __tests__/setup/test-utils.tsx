import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Providers necesarios para los tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

// Custom render function que incluye los providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar todo de testing-library
export * from "@testing-library/react";

// Override render method
export { customRender as render };

// Utilities para testing
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: "1",
  email: "test@example.com",
  nombre: "Test User",
  rol: "cliente",
  tipoUsuario: "cliente",
  ...overrides,
});

export const createMockApiResponse = (
  data: any = {},
  success: boolean = true
) => ({
  success,
  data,
  error: success ? null : "Error de prueba",
});

// Mock para localStorage
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock para window.matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock para IntersectionObserver
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Mock para fetch
export const mockFetch = (response: any, ok: boolean = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  });
};

// Helper para simular delay en pruebas asíncronas
export const waitForTimeout = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock para next/router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: "/",
  query: {},
  asPath: "/",
  route: "/",
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Mock para next/navigation
export const mockNavigation = {
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    toString: jest.fn(),
  }),
  usePathname: () => "/",
};

// Helper para testing de formularios
export const fillForm = (fields: { [key: string]: string }) => {
  const {
    getByLabelText,
    getByPlaceholderText,
    getByDisplayValue,
  } = require("@testing-library/react");
  const { fireEvent } = require("@testing-library/react");

  Object.entries(fields).forEach(([key, value]) => {
    let input;
    try {
      input = getByLabelText(key);
    } catch {
      try {
        input = getByPlaceholderText(key);
      } catch {
        input = getByDisplayValue("");
      }
    }

    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });
};

// Configuración para tests que requieren autenticación
export const withAuthContext = (user: any = null) => {
  const AuthContext = React.createContext({ user, loading: false });

  return ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{ user, loading: false, login: jest.fn(), logout: jest.fn() }}
    >
      <AllTheProviders>{children}</AllTheProviders>
    </AuthContext.Provider>
  );
};
