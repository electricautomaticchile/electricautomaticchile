# Guía de Estilo - ElectricAutomaticChile

## Índice
1. [Introducción](#introducción)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Componentes](#componentes)
4. [Estado](#estado)
5. [Estilos](#estilos)
6. [API y Servicios](#api-y-servicios)
7. [Testing](#testing)
8. [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)

## Introducción

Esta guía de estilo define los estándares y mejores prácticas para el desarrollo en el proyecto ElectricAutomaticChile. Seguir estas pautas asegura coherencia, mantenibilidad y escalabilidad en todo el código base.

## Estructura de Directorios

```
electricautomaticchile/
├── app/              # App Router de Next.js
│   ├── api/          # API Routes
│   ├── auth/         # Rutas de autenticación
│   ├── dashboard/    # Área de dashboard de usuario 
│   ├── dashempresa/  # Área de dashboard empresarial
│   └── ...           # Otras rutas de la aplicación
├── components/       # Componentes reutilizables
│   ├── ui/           # Componentes de UI básicos
│   └── ...           # Componentes específicos
├── lib/              # Utilidades y servicios
│   ├── context/      # Contextos de React
│   ├── hooks/        # Hooks personalizados
│   ├── types/        # Tipos TypeScript
│   └── validation/   # Esquemas de validación
├── public/           # Archivos estáticos
├── styles/           # Estilos globales
├── tests/            # Tests de integración
└── docs/             # Documentación
```

## Componentes

### Estructura de un Componente

- Cada componente debe estar en su propio archivo
- Usar la extensión `.tsx` para componentes con TypeScript
- Añadir la directiva `"use client"` en la parte superior cuando sea necesario
- Exportar el componente como exportación nombrada
- Utilizar React.memo para componentes que no necesitan renderizarse frecuentemente

### Ejemplo de Componente

```tsx
"use client"

import { useState, useEffect } from 'react';
import { ComponentProps } from '@/lib/types';

export function MyComponent({ title, children }: ComponentProps) {
  // Estado y lógica

  return (
    <div className="my-component">
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </div>
  );
}
```

## Estado

### Gestión de Estado Global

- Usar el AppContext para estado compartido entre múltiples rutas
- Utilizar hooks personalizados para lógica reutilizable
- Evitar prop drilling más allá de 2 niveles de componentes

### Ejemplo de Uso de Contexto

```tsx
import { useAppContext } from '@/lib/context/AppContext';

function UserProfile() {
  const { user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) return <LoginPrompt />;
  
  return <ProfileDisplay user={user} />;
}
```

## Estilos

### Sistema de Diseño

- Utilizar Tailwind CSS para todos los estilos
- Seguir la metodología "utility-first"
- Extraer componentes para patrones repetitivos
- Usar variables CSS para valores consistentes

### Convenciones de Color

- Usar las variables de color definidas en `tailwind.config.ts`
- Mantener un ratio de contraste mínimo de 4.5:1 para accesibilidad

## API y Servicios

### Estructura de la API

- Seguir los patrones de App Router de Next.js
- Utilizar handlers estandarizados para errores
- Implementar validación de entrada con Zod
- Documentar todas las rutas con comentarios JSDoc

### Ejemplo de Ruta API

```tsx
/**
 * @swagger
 * /api/devices:
 *   get:
 *     description: Obtiene todos los dispositivos
 */
export async function GET(req: Request) {
  try {
    // Lógica para obtener datos
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Mensaje de error" },
      { status: 500 }
    );
  }
}
```

## Testing

### Estructura de Tests

- Colocar tests unitarios junto a los componentes o funciones que prueban
- Usar carpetas `__tests__` para agrupar tests relacionados
- Nombrar archivos de test con el patrón `[nombre].test.tsx`

### Ejemplo de Test

```tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Convenciones de Nomenclatura

### Archivos y Carpetas

- Componentes: PascalCase (ej. `UserProfile.tsx`)
- Hooks: camelCase con prefijo `use` (ej. `useDevice.ts`)
- Utilidades: camelCase (ej. `formatDate.ts`)
- Rutas de páginas: kebab-case (ej. `user-profile`)

### Variables y Funciones

- Variables: camelCase (ej. `userData`)
- Funciones: camelCase (ej. `fetchUserData`)
- Componentes: PascalCase (ej. `UserProfile`)
- Interfaces/Types: PascalCase (ej. `UserData`)
- Constantes globales: UPPER_SNAKE_CASE (ej. `MAX_RETRY_ATTEMPTS`) 