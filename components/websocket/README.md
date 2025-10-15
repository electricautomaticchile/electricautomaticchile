# Componentes UI de WebSocket

Este directorio contiene componentes React para integrar funcionalidad WebSocket en la interfaz de usuario de ElectricAutomaticChile.

## Componentes Disponibles

### 1. IndicadorEstadoConexion

Componente que muestra el estado actual de la conexión WebSocket con indicadores visuales y información detallada.

#### Características

- **Indicador visual**: Punto de color que indica el estado (verde/amarillo/rojo)
- **Estados soportados**:
  - Conectado (verde)
  - Conectando (amarillo animado)
  - Reconectando (amarillo con contador)
  - Desconectado (rojo)
- **Tooltip informativo**: Muestra latencia, última conexión, intentos de reconexión
- **Reconexión manual**: Botón para forzar reconexión cuando está desconectado
- **Mensajes de error**: Muestra errores de conexión cuando ocurren

#### Uso Básico

```tsx
import { IndicadorEstadoConexion } from '@/components/websocket';

// Solo icono (compacto)
<IndicadorEstadoConexion />

// Con texto
<IndicadorEstadoConexion mostrarTexto />

// Sin botón de reconexión
<IndicadorEstadoConexion mostrarBotonReconectar={false} />
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `mostrarTexto` | `boolean` | `false` | Mostrar texto del estado junto al indicador |
| `className` | `string` | - | Clases CSS adicionales |
| `mostrarBotonReconectar` | `boolean` | `true` | Mostrar botón de reconexión manual |

#### Ejemplo en Header

```tsx
// En el header de un dashboard
<header className="flex items-center justify-between p-4">
  <h1>Dashboard</h1>
  <IndicadorEstadoConexion mostrarTexto />
</header>
```

---

### 2. VisualizacionDatosEnTiempoReal

Componente contenedor para mostrar datos en tiempo real con indicadores de estado de conexión y timestamps.

#### Características

- **Indicador de conexión**: Badge que muestra si los datos son en vivo u offline
- **Timestamp**: Muestra cuándo fue la última actualización
- **Estados de carga**: Maneja estados de carga con spinner
- **Degradación graceful**: Funciona sin WebSocket mostrando último estado conocido
- **Variantes de estilo**: Default, card, minimal
- **Mensaje sin datos**: Personalizable cuando no hay contenido

#### Uso Básico

```tsx
import { VisualizacionDatosEnTiempoReal, ValorEnTiempoReal } from '@/components/websocket';
import { Zap } from 'lucide-react';

// Ejemplo con datos de consumo eléctrico
<VisualizacionDatosEnTiempoReal
  titulo="Consumo Actual"
  ultimaActualizacion={new Date()}
  variante="card"
>
  <div className="grid grid-cols-3 gap-4">
    <ValorEnTiempoReal
      etiqueta="Voltaje"
      valor={220}
      unidad="V"
      icono={<Zap className="h-4 w-4" />}
    />
    <ValorEnTiempoReal
      etiqueta="Corriente"
      valor={15.5}
      unidad="A"
    />
    <ValorEnTiempoReal
      etiqueta="Potencia"
      valor={3410}
      unidad="W"
    />
  </div>
</VisualizacionDatosEnTiempoReal>
```

#### Props - VisualizacionDatosEnTiempoReal

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `titulo` | `string` | - | Título del componente |
| `children` | `ReactNode` | - | Contenido a mostrar (datos) |
| `ultimaActualizacion` | `Date \| string \| null` | - | Timestamp de última actualización |
| `cargando` | `boolean` | `false` | Indica si los datos están cargando |
| `mensajeSinDatos` | `string` | `'No hay datos disponibles'` | Mensaje cuando no hay datos |
| `mostrarIndicadorConexion` | `boolean` | `true` | Mostrar badge de conexión |
| `mostrarTimestamp` | `boolean` | `true` | Mostrar timestamp de actualización |
| `className` | `string` | - | Clases CSS adicionales |
| `variante` | `'default' \| 'card' \| 'minimal'` | `'default'` | Variante de estilo |

#### Props - ValorEnTiempoReal

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `etiqueta` | `string` | - | Etiqueta del valor |
| `valor` | `string \| number` | - | Valor a mostrar |
| `unidad` | `string` | - | Unidad del valor (opcional) |
| `icono` | `ReactNode` | - | Icono (opcional) |
| `className` | `string` | - | Clases CSS adicionales |

#### Ejemplo Completo con WebSocket

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { VisualizacionDatosEnTiempoReal, ValorEnTiempoReal } from '@/components/websocket';
import type { ActualizacionPotenciaDispositivo } from '@/lib/websocket/tipos';

export function ConsumoEnTiempoReal({ idDispositivo }: { idDispositivo: string }) {
  const [datos, setDatos] = useState<ActualizacionPotenciaDispositivo | null>(null);
  const [cargando, setCargando] = useState(true);

  // Escuchar eventos de actualización de potencia
  useWebSocket<ActualizacionPotenciaDispositivo>(
    'dispositivo:actualizacion_potencia',
    (nuevoDatos) => {
      if (nuevoDatos.idDispositivo === idDispositivo) {
        setDatos(nuevoDatos);
        setCargando(false);
      }
    }
  );

  return (
    <VisualizacionDatosEnTiempoReal
      titulo="Consumo Eléctrico"
      ultimaActualizacion={datos?.marcaTiempo}
      cargando={cargando}
      variante="card"
    >
      {datos && (
        <div className="grid grid-cols-2 gap-4">
          <ValorEnTiempoReal
            etiqueta="Potencia Activa"
            valor={datos.potenciaActiva.toFixed(2)}
            unidad="W"
          />
          <ValorEnTiempoReal
            etiqueta="Energía Consumida"
            valor={datos.energia.toFixed(2)}
            unidad="kWh"
          />
          {datos.costo && (
            <ValorEnTiempoReal
              etiqueta="Costo Estimado"
              valor={`$${datos.costo.toFixed(0)}`}
            />
          )}
        </div>
      )}
    </VisualizacionDatosEnTiempoReal>
  );
}
```

---

## Integración en Dashboards

### Dashboard Cliente

```tsx
// app/dashboard-cliente/page.tsx
import { IndicadorEstadoConexion } from '@/components/websocket';

export default function DashboardCliente() {
  return (
    <div>
      <header className="flex justify-between items-center">
        <h1>Mi Dashboard</h1>
        <IndicadorEstadoConexion mostrarTexto />
      </header>
      {/* Resto del contenido */}
    </div>
  );
}
```

### Dashboard Empresa

```tsx
// app/dashboard-empresa/page.tsx
import { IndicadorEstadoConexion } from '@/components/websocket';

export default function DashboardEmpresa() {
  return (
    <div>
      <nav className="flex items-center gap-4">
        <span>Dashboard Empresa</span>
        <IndicadorEstadoConexion />
      </nav>
      {/* Resto del contenido */}
    </div>
  );
}
```

---

## Estilos y Temas

Los componentes utilizan el sistema de diseño de shadcn/ui y respetan el tema (light/dark) configurado en la aplicación.

### Colores de Estado

- **Verde** (`bg-green-500`): Conectado
- **Amarillo** (`bg-yellow-500`): Conectando/Reconectando
- **Rojo** (`bg-red-500`): Desconectado
- **Gris** (`bg-gray-500`): Estado desconocido

### Animaciones

- **Pulse**: Usado en estados de conectando/reconectando
- **Spin**: Usado en loaders

---

## Mejores Prácticas

### 1. Ubicación del Indicador

Coloca el `IndicadorEstadoConexion` en lugares visibles pero no intrusivos:
- Header/navbar de dashboards
- Sidebar
- Footer (menos recomendado)

### 2. Uso de VisualizacionDatosEnTiempoReal

- Usa `variante="card"` para datos importantes que necesitan destacar
- Usa `variante="minimal"` para listas o tablas
- Siempre proporciona `ultimaActualizacion` para que el usuario sepa qué tan recientes son los datos

### 3. Manejo de Estados

```tsx
// Siempre maneja los tres estados
const [datos, setDatos] = useState(null);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);

// Muestra el estado apropiado
<VisualizacionDatosEnTiempoReal
  cargando={cargando}
  mensajeSinDatos={error ? error.message : 'No hay datos'}
>
  {datos && <MostrarDatos datos={datos} />}
</VisualizacionDatosEnTiempoReal>
```

### 4. Performance

- Los componentes ya están optimizados para re-renders
- No necesitas `memo` a menos que tengas casos muy específicos
- El hook `useWebSocket` maneja la limpieza automáticamente

---

## Troubleshooting

### El indicador siempre muestra "Desconectado"

Verifica que:
1. El `ProveedorWebSocket` esté en el nivel superior de tu app
2. El usuario esté autenticado (tiene token JWT)
3. El WebSocket API esté corriendo en el puerto correcto

### Los datos no se actualizan

Verifica que:
1. Estés escuchando el evento correcto
2. El `idDispositivo` coincida con el del evento
3. El WebSocket esté conectado (usa el indicador para verificar)

### Errores de TypeScript

Asegúrate de importar los tipos correctos:
```tsx
import type { ActualizacionPotenciaDispositivo } from '@/lib/websocket/tipos';
```

---

## Dependencias

Estos componentes dependen de:

- `@/lib/websocket/useWebSocket` - Hook de WebSocket
- `@/components/ui/*` - Componentes de shadcn/ui
- `lucide-react` - Iconos
- `class-variance-authority` - Variantes de estilos
- `@radix-ui/react-popover` - Popover para tooltip

---

## Próximos Pasos

Una vez que estos componentes estén integrados, puedes:

1. Agregar más variantes de estilo según necesites
2. Crear componentes especializados para tipos específicos de datos
3. Agregar animaciones más elaboradas para transiciones de datos
4. Implementar gráficos en tiempo real usando estos componentes como base

