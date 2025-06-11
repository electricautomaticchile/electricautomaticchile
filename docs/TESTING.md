# 🧪 Guía de Testing - Electric Automatic Chile

## 📋 Índice

- [Configuración](#configuración)
- [Estructura de Tests](#estructura-de-tests)
- [Tipos de Tests](#tipos-de-tests)
- [Comandos Disponibles](#comandos-disponibles)
- [Utilidades de Testing](#utilidades-de-testing)
- [Mejores Prácticas](#mejores-prácticas)
- [Cobertura](#cobertura)

## ⚙️ Configuración

### Dependencias de Testing

```json
{
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.3.0",
  "@types/jest": "^29.5.14",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

### Configuración Jest

- **Archivo**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Entorno**: jsdom (para componentes React)
- **Mapeo de rutas**: Soporte para aliases `@/`

## 📁 Estructura de Tests

```
__tests__/
├── components/
│   ├── ui/
│   │   ├── button.test.tsx
│   │   └── input.test.tsx
│   └── ...
├── hooks/
│   └── useAuth.test.tsx
├── middleware/
│   └── auth.test.ts
├── pages/
│   └── login.test.tsx
├── setup/
│   └── test-utils.tsx
└── utils/
    └── validation.test.ts
```

## 🧪 Tipos de Tests

### 1. Tests Unitarios

**Ubicación**: `__tests__/components/`, `__tests__/utils/`, `__tests__/hooks/`

**Propósito**: Probar funciones, hooks y componentes de forma aislada.

```typescript
// Ejemplo: Button Component Test
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });
});
```

### 2. Tests de Integración

**Ubicación**: `__tests__/pages/`, `__tests__/middleware/`

**Propósito**: Probar interacciones entre componentes y flujos completos.

```typescript
// Ejemplo: Login Page Test
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/auth/login/page";

describe("Login Page", () => {
  it("handles successful login", async () => {
    // Test de flujo completo de login
  });
});
```

### 3. Tests de Hooks

**Ubicación**: `__tests__/hooks/`

**Propósito**: Probar hooks personalizados.

```typescript
// Ejemplo: useAuth Hook Test
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/lib/hooks/useAuth";

describe("useAuth Hook", () => {
  it("initializes with null user", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});
```

## 🚀 Comandos Disponibles

### Scripts NPM

```bash
# Tests básicos
npm test                    # Todos los tests
npm run test:watch         # Modo watch (desarrollo)
npm run test:coverage      # Con reporte de cobertura

# Tests específicos
npm run test:unit          # Solo tests unitarios
npm run test:integration   # Solo tests de integración
npm run test:auth          # Solo tests de autenticación
npm run test:ui            # Solo tests de componentes UI
```

### Test Runner Personalizado

```bash
# Usando nuestro script personalizado
npm run test:runner        # Todos los tests
npm run test:runner unit   # Tests unitarios
npm run test:runner auth   # Tests de autenticación
npm run test:runner --help # Ayuda

# O directamente
node scripts/test-runner.js coverage
```

## 🛠️ Utilidades de Testing

### Test Utils (`__tests__/setup/test-utils.tsx`)

#### Render Personalizado

```typescript
import { render } from "__tests__/setup/test-utils";
// Incluye automáticamente ThemeProvider y otros providers necesarios
```

#### Mocks Predefinidos

```typescript
import {
  createMockUser,
  createMockApiResponse,
  mockLocalStorage,
  mockFetch,
} from "__tests__/setup/test-utils";

// Usuario mock
const user = createMockUser({ rol: "admin" });

// Respuesta API mock
const response = createMockApiResponse({ token: "abc123" });

// localStorage mock
const localStorage = mockLocalStorage();
```

#### Context Helpers

```typescript
import { withAuthContext } from "__tests__/setup/test-utils";

// Renderizar con contexto de autenticación
const AuthWrapper = withAuthContext(mockUser);
render(<Component />, { wrapper: AuthWrapper });
```

## 📝 Mejores Prácticas

### 1. Naming Convention

```typescript
// ✅ Descriptivo
it("redirects to dashboard after successful login");

// ❌ Poco claro
it("works correctly");
```

### 2. Arrange-Act-Assert Pattern

```typescript
it("validates email format", () => {
  // Arrange
  const invalidEmail = "invalid-email";

  // Act
  const result = validateEmail(invalidEmail);

  // Assert
  expect(result).toBe(false);
});
```

### 3. Mocking Apropiado

```typescript
// ✅ Mock externo, test interno
jest.mock("@/lib/api/apiService");

// ✅ Mock específico
const mockLogin = jest.fn();
(apiService.login as jest.Mock) = mockLogin;
```

### 4. Async Testing

```typescript
// ✅ Con waitFor
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});

// ✅ Con findBy (implícito waitFor)
const element = await screen.findByText("Success");
```

### 5. Cleanup

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

## 📊 Cobertura

### Configuración de Cobertura

```javascript
// jest.config.js
collectCoverageFrom: [
  "**/*.{js,jsx,ts,tsx}",
  "!**/*.d.ts",
  "!**/node_modules/**",
  "!<rootDir>/out/**",
  "!<rootDir>/.next/**",
];
```

### Objetivos de Cobertura

- **Componentes críticos**: >90%
- **Hooks personalizados**: >95%
- **Utilities**: >95%
- **Middleware**: >85%
- **Páginas**: >75%

### Reporte de Cobertura

```bash
npm run test:coverage
```

Genera reportes en:

- Terminal (resumen)
- `coverage/lcov-report/index.html` (detallado)

## 🎯 Tests Implementados

### ✅ Completados

- [x] **Button Component** - Tests de rendering, eventos, variants
- [x] **Input Component** - Tests de valores, validaciones, estados
- [x] **useAuth Hook** - Tests de login, logout, estados
- [x] **Login Page** - Tests de formulario, validaciones, redirecciones
- [x] **Auth Middleware** - Tests de protección de rutas, roles
- [x] **Validation Utils** - Tests de validaciones de formularios

### 🔄 Por Implementar

- [ ] **Dashboard Components** - Tests de gráficos, tablas
- [ ] **Form Components** - Tests de formularios complejos
- [ ] **API Routes** - Tests de endpoints
- [ ] **Theme Components** - Tests de modo oscuro/claro
- [ ] **Error Boundaries** - Tests de manejo de errores

## 🐛 Debugging Tests

### Logs en Tests

```typescript
// Para debugging
import { screen } from "@testing-library/react";
screen.debug(); // Muestra el DOM actual
```

### Variables de Entorno para Tests

```bash
# En .env.test
NODE_ENV=test
NEXTAUTH_SECRET=test-secret
```

### Timeout para Tests Lentos

```typescript
// Para tests específicos
it("slow test", async () => {
  // test code
}, 10000); // 10 segundos

// Globalmente en jest.setup.js
jest.setTimeout(30000);
```

## 🎭 Mocking Strategies

### Next.js Components

```typescript
// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));
```

### External APIs

```typescript
// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ data: "test" }),
});
```

### Environment Variables

```typescript
// Backup y restore
const originalEnv = process.env.NODE_ENV;
process.env.NODE_ENV = "test";
// ... test
process.env.NODE_ENV = originalEnv;
```

## 📈 Métricas y CI/CD

### GitHub Actions (Futuro)

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

### Quality Gates

- Tests deben pasar antes de merge
- Cobertura mínima del 80%
- No tests con `.skip()` o `.only()`

---

## 🚀 Quick Start

1. **Instalar dependencias** (ya están instaladas)
2. **Ejecutar tests**:
   ```bash
   npm test
   ```
3. **Ver cobertura**:
   ```bash
   npm run test:coverage
   ```
4. **Desarrollo con watch**:
   ```bash
   npm run test:watch
   ```

¡Los tests están listos para usar! 🎉
