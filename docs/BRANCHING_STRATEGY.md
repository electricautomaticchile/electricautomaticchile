# Estrategia de Branching - Electric Automatic Chile Frontend

## 📋 Resumen

Este documento define la estrategia de branching para el proyecto Frontend de Electric Automatic Chile, basada en Git Flow con adaptaciones específicas para desarrollo con Next.js.

## 🌿 Estructura de Ramas

### Ramas Principales

#### `main`

- **Propósito**: Contiene el código en producción
- **Protecciones**:
  - Requiere revisión de código (Pull Request)
  - Requiere que pasen todos los tests
  - Solo administradores pueden hacer merge
- **Deploy**: Automático a producción (Vercel/AWS)

#### `develop`

- **Propósito**: Rama de desarrollo principal donde se integran las nuevas características
- **Protecciones**: Requiere revisión de código
- **Deploy**: Automático a entorno de desarrollo

#### `staging`

- **Propósito**: Pruebas de integración antes de producción
- **Protecciones**: Requiere revisión de código
- **Deploy**: Automático a entorno de staging

### Ramas de Trabajo

#### `feature/*`

- **Propósito**: Desarrollo de nuevas características
- **Convención**: `feature/[nombre-caracteristica]`
- **Ejemplos**:
  - `feature/dashboard-cliente`
  - `feature/payment-integration`
  - `feature/device-monitoring`
  - `feature/user-profile`
- **Flujo**:
  1. Se crea desde `develop`
  2. Se trabaja en la característica
  3. Se hace Pull Request a `develop`
  4. Se elimina después del merge

#### `bugfix/*`

- **Propósito**: Corrección de errores no críticos
- **Convención**: `bugfix/[numero-issue]-[descripcion-breve]`
- **Ejemplos**:
  - `bugfix/123-form-validation`
  - `bugfix/456-responsive-layout`
  - `bugfix/789-chart-rendering`
- **Flujo**:
  1. Se crea desde `develop`
  2. Se corrige el error
  3. Se hace Pull Request a `develop`

#### `hotfix/*`

- **Propósito**: Correcciones urgentes en producción
- **Convención**: `hotfix/[numero-issue]-[descripcion]`
- **Ejemplos**:
  - `hotfix/012-login-redirect`
  - `hotfix/345-security-vulnerability`
- **Flujo**:
  1. Se crea desde `main`
  2. Se corrige el error crítico
  3. Se hace Pull Request a `main` Y `develop`

#### `ui/*`

- **Propósito**: Cambios específicos de interfaz de usuario
- **Convención**: `ui/[componente-o-seccion]`
- **Ejemplos**:
  - `ui/navigation-redesign`
  - `ui/dashboard-improvements`
  - `ui/mobile-responsive`

#### `release/*`

- **Propósito**: Preparar nuevas versiones
- **Convención**: `release/v[X.Y.Z]`
- **Ejemplos**:
  - `release/v1.1.0`
  - `release/v2.0.0`

#### `test/*`

- **Propósito**: Pruebas específicas o experimentales
- **Convención**: `test/[nombre-prueba]`
- **Ejemplos**:
  - `test/e2e-automation`
  - `test/performance-optimization`

## 🔄 Flujos de Trabajo

### Desarrollo de Componente/Página

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/nuevo-componente

# 3. Desarrollar y commitear
git add .
git commit -m "feat: add new component with tests"

# 4. Subir rama
git push -u origin feature/nuevo-componente

# 5. Crear Pull Request a develop
```

### Mejoras de UI/UX

```bash
# 1. Crear rama de UI
git checkout develop
git pull origin develop
git checkout -b ui/dashboard-improvements

# 2. Implementar mejoras
git add .
git commit -m "ui: improve dashboard layout and responsiveness"

# 3. Subir y crear PR
git push -u origin ui/dashboard-improvements
```

### Corrección de Bug

```bash
# 1. Crear rama de bugfix
git checkout develop
git pull origin develop
git checkout -b bugfix/123-form-validation

# 2. Corregir y commitear
git add .
git commit -m "fix: resolve form validation issues"

# 3. Subir y crear PR
git push -u origin bugfix/123-form-validation
```

## 📝 Convenciones de Commits

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/) adaptada para frontend:

- `feat:` Nueva característica o componente
- `fix:` Corrección de bug
- `ui:` Cambios de interfaz de usuario
- `style:` Cambios de estilos CSS/Tailwind
- `refactor:` Refactoring de código
- `test:` Agregar o modificar tests
- `docs:` Cambios en documentación
- `chore:` Tareas de mantenimiento
- `perf:` Mejoras de performance

### Ejemplos:

```
feat: add user profile component with avatar upload
fix: resolve responsive layout issues on mobile
ui: redesign navigation bar with improved UX
style: update color scheme and typography
refactor: optimize component render performance
test: add unit tests for payment component
perf: implement lazy loading for dashboard widgets
chore: update Next.js and dependencies
```

## 🧪 Testing y Quality Assurance

### Antes de cada PR:

```bash
# Ejecutar todos los tests
npm run test

# Verificar linting
npm run lint

# Verificar build
npm run build

# Verificar types
npm run type-check
```

### Tests requeridos:

- ✅ Unit tests para componentes
- ✅ Integration tests para páginas
- ✅ E2E tests para flujos críticos
- ✅ Visual regression tests
- ✅ Accessibility tests

## 📱 Consideraciones Específicas de Next.js

### Estructura de commits para Next.js:

```
feat(pages): add new dashboard page
feat(components): create reusable button component
feat(api): add API route for user data
fix(middleware): resolve authentication middleware
style(globals): update global CSS variables
```

### Archivos importantes para versionar:

- `package.json` - Dependencies y scripts
- `next.config.mjs` - Configuración de Next.js
- `tailwind.config.ts` - Configuración de Tailwind
- `tsconfig.json` - Configuración de TypeScript
- `middleware.ts` - Middleware de Next.js

## 🚀 Deployment Strategy

### Automatic Deployments:

- **develop** → Deploy a Development Environment
- **staging** → Deploy a Staging Environment
- **main** → Deploy a Production Environment

### Preview Deployments:

- Cada PR genera un preview deployment automático
- URL de preview compartida en el PR para revisión
- Tests automáticos ejecutados en el preview

## 🔧 Herramientas y Scripts

### Package.json scripts relevantes:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "cypress run",
    "type-check": "tsc --noEmit"
  }
}
```

### Pre-commit hooks (Husky):

```bash
# Instalar husky si no está configurado
npm install --save-dev husky
npx husky install

# Pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

## 📋 Lista de Verificación para Pull Requests

### Antes de crear el PR:

- [ ] El código está actualizado con la rama base
- [ ] Todos los tests pasan (`npm run test`)
- [ ] El linting pasa (`npm run lint`)
- [ ] El build es exitoso (`npm run build`)
- [ ] Los types están correctos (`npm run type-check`)
- [ ] Se probó en diferentes dispositivos/navegadores
- [ ] Se agregaron tests para nuevos componentes
- [ ] Se actualizó documentación si es necesario

### Template de PR para Frontend:

```markdown
## Descripción

Descripción breve de los cambios realizados.

## Tipo de cambio

- [ ] Nueva característica/componente
- [ ] Corrección de bug
- [ ] Mejora de UI/UX
- [ ] Refactoring
- [ ] Actualización de dependencias

## Screenshots/Videos

<!-- Agregar capturas de pantalla o videos de los cambios -->

## Dispositivos/Navegadores probados

- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile
- [ ] Safari Mobile

## Checklist:

- [ ] Mi código sigue las convenciones del proyecto
- [ ] He probado los cambios en diferentes dispositivos
- [ ] Los componentes son accesibles (a11y)
- [ ] He agregado tests para nuevos componentes
- [ ] La performance no se ve afectada negativamente
- [ ] Los estilos son responsivos
```

## 🎨 Convenciones de Código

### Naming Conventions:

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase starting with 'use' (`useUserData.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Pages**: kebab-case folders (`dashboard-cliente/`)
- **CSS Classes**: kebab-case siguiendo Tailwind

### File Structure:

```
components/
  ├── ui/              # Componentes base reutilizables
  ├── forms/           # Componentes de formularios
  ├── layout/          # Componentes de layout
  └── feature-specific/ # Componentes específicos de características

hooks/
  ├── useAuth.ts       # Hooks de autenticación
  ├── useApi.ts        # Hooks de API
  └── useDevice.ts     # Hooks específicos

lib/
  ├── utils.ts         # Utilidades generales
  ├── api/            # Configuración de API
  └── types/          # Definiciones de tipos
```

---

**Última actualización**: $(date)
**Versión del documento**: 1.0.0
**Proyecto**: Electric Automatic Chile Frontend
