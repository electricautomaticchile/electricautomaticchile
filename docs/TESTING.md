# Guía de Testing - Electricautomaticchile

## 🧪 Estrategia de Testing

El proyecto implementa una estrategia de testing completa con múltiples niveles de pruebas para garantizar la calidad y confiabilidad de la plataforma IoT.

## 📋 Estructura de Testing

```
__tests__/
├── components/           # Pruebas de componentes React
│   └── ui/              # Componentes de interfaz
├── hooks/               # Pruebas de custom hooks
├── middleware/          # Pruebas de middleware
├── pages/               # Pruebas de páginas
├── security/            # Pruebas de seguridad
├── setup/               # Configuración de testing
└── utils/               # Pruebas de utilidades
```

## 🛠️ Configuración de Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## 🔧 Scripts de Testing

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas con cobertura
npm run test:coverage

# Pruebas por categoría
npm run test:unit         # Componentes, hooks, utils
npm run test:integration  # Páginas, middleware
npm run test:auth        # Funcionalidades de autenticación
npm run test:ui          # Componentes de interfaz

# Pruebas en modo watch
npm run test:watch
```

## 🧩 Testing de Componentes

### Ejemplo: Testing de Button Component

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-destructive", "text-destructive-foreground");
  });

  it("is disabled when loading", () => {
    render(<Button disabled>Loading...</Button>);
    const button = screen.getByText("Loading...");
    expect(button).toBeDisabled();
  });
});
```

### Testing de Dashboard Components

```typescript
// __tests__/components/dashboard-cliente.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import DashboardCliente from "@/app/dashboard-cliente/page";
import { AuthProvider } from "@/lib/context/AuthContext";

// Mock de datos
const mockUserData = {
  id: "1",
  name: "Juan Pérez",
  email: "juan@test.cl",
  role: "cliente",
};

describe("Dashboard Cliente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dashboard with user data", async () => {
    render(
      <AuthProvider>
        <DashboardCliente />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Mi Panel de Control")).toBeInTheDocument();
    });
  });

  it("displays consumption data", async () => {
    render(
      <AuthProvider>
        <DashboardCliente />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Consumo actual/i)).toBeInTheDocument();
      expect(screen.getByText(/kWh/i)).toBeInTheDocument();
    });
  });
});
```

## 🔐 Testing de Autenticación

### Auth Hook Testing

```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

describe("useAuth Hook", () => {
  it("initializes with null user", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("handles successful login", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("handles login failure", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login("invalid@example.com", "wrongpassword");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## 🔒 Testing de Seguridad

### Security Configuration Testing

```typescript
// __tests__/security/security-config.test.ts
import { validateSecurityConfig } from "@/lib/config/security";

describe("Security Configuration", () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.JWT_SECRET;
    delete process.env.MONGODB_URI;
  });

  it("throws error when JWT_SECRET is missing", () => {
    expect(() => {
      validateSecurityConfig();
    }).toThrow("JWT_SECRET no está configurado");
  });

  it("throws error when JWT_SECRET is too short", () => {
    process.env.JWT_SECRET = "short";

    expect(() => {
      validateSecurityConfig();
    }).toThrow("JWT_SECRET debe tener al menos 32 caracteres");
  });

  it("validates successfully with proper configuration", () => {
    process.env.JWT_SECRET = "a".repeat(64);
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";

    expect(() => {
      validateSecurityConfig();
    }).not.toThrow();
  });
});
```

## 🌐 Testing de API

### API Route Testing

```typescript
// __tests__/api/devices.test.ts
import { POST } from "@/app/api/devices/route";
import { NextRequest } from "next/server";

// Mock de autenticación
jest.mock("@/lib/auth", () => ({
  validateToken: jest
    .fn()
    .mockResolvedValue({ userId: "1", role: "empresa_admin" }),
}));

describe("/api/devices", () => {
  it("creates device successfully", async () => {
    const request = new NextRequest("http://localhost/api/devices", {
      method: "POST",
      body: JSON.stringify({
        device_id: "ESP32_TEST_001",
        name: "Test Device",
        location: {
          latitude: -33.4489,
          longitude: -70.6693,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer valid_token",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.device_id).toBe("ESP32_TEST_001");
  });

  it("returns 401 for invalid token", async () => {
    const request = new NextRequest("http://localhost/api/devices", {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid_token",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
```

## 📱 Testing de IoT Integration

### Device Communication Testing

```typescript
// __tests__/iot/device-communication.test.ts
import { IoTDeviceController } from "@/lib/iot/device-controller";

describe("IoT Device Communication", () => {
  let deviceController: IoTDeviceController;

  beforeEach(() => {
    deviceController = new IoTDeviceController();
  });

  it("sends command to device successfully", async () => {
    const mockPublish = jest.fn().mockResolvedValue(true);
    deviceController.mqttClient = { publish: mockPublish } as any;

    await deviceController.sendSecureCommand("ESP32_001", {
      type: "CUT_SERVICE",
      parameters: { reason: "Test" },
    });

    expect(mockPublish).toHaveBeenCalledWith(
      "devices/ESP32_001/commands",
      expect.stringContaining("CUT_SERVICE")
    );
  });

  it("validates device permissions", async () => {
    await expect(
      deviceController.sendSecureCommand("UNAUTHORIZED_DEVICE", {
        type: "CUT_SERVICE",
      })
    ).rejects.toThrow("Device not authorized");
  });
});
```

## 📊 Testing de Performance

### Load Testing Example

```typescript
// __tests__/performance/load.test.ts
import { performance } from "perf_hooks";

describe("Performance Tests", () => {
  it("API response time should be under 200ms", async () => {
    const start = performance.now();

    const response = await fetch("/api/devices");
    await response.json();

    const end = performance.now();
    const responseTime = end - start;

    expect(responseTime).toBeLessThan(200);
  });

  it("handles 100 concurrent requests", async () => {
    const requests = Array(100)
      .fill(null)
      .map(() => fetch("/api/health"));

    const responses = await Promise.all(requests);
    const successfulResponses = responses.filter((r) => r.status === 200);

    expect(successfulResponses.length).toBe(100);
  });
});
```

## 📈 Coverage Reports

### Coverage Configuration

```json
{
  "collectCoverageFrom": [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "app/**/route.{js,ts}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**"
  ],
  "coverageReporters": ["html", "lcov", "text", "text-summary"]
}
```

## 🚀 CI/CD Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## 📋 Testing Checklist

### Pre-commit Testing

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Security tests passing
- [ ] Lint checks passing
- [ ] Type checking passing
- [ ] Coverage threshold met (80%)

### Pre-production Testing

- [ ] E2E tests in staging
- [ ] Performance tests
- [ ] Security penetration tests
- [ ] Load testing
- [ ] IoT device integration tests
- [ ] Payment system tests

---

**Cobertura Target**: 80% mínimo  
**Última ejecución**: Tests automáticos en cada commit
