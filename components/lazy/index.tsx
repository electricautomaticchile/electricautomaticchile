import dynamic from 'next/dynamic';
import { LoadingState } from '@/components/shared';

export const LazyGestionClientes = dynamic(
  () => import('../../app/(dashboard)/empresa/features/clientes').then(mod => mod.GestionClientes),
  {
    loading: () => <LoadingState message="Cargando gestión de clientes..." />,
    ssr: false,
  }
);

export const LazyDispositivosActivos = dynamic(
  () => import('../../app/(dashboard)/empresa/features/dispositivos').then(mod => mod.DispositivosActivos),
  {
    loading: () => <LoadingState message="Cargando dispositivos..." />,
    ssr: false,
  }
);

export const LazyAlertasSistema = dynamic(
  () => import('../../app/(dashboard)/empresa/features/alertas').then(mod => mod.AlertasSistema),
  {
    loading: () => <LoadingState message="Cargando alertas..." />,
    ssr: false,
  }
);

export const LazyGestionTarifas = dynamic(
  () => import('../../app/(dashboard)/empresa/features/tarifas/GestionTarifas').then(mod => mod.GestionTarifas),
  {
    loading: () => <LoadingState message="Cargando tarifas..." />,
    ssr: false,
  }
);

export const LazyEstadisticasAvanzadas = dynamic(
  () => import('../../app/(dashboard)/empresa/features/estadisticas/EstadisticasAvanzadas').then(mod => mod.EstadisticasAvanzadas),
  {
    loading: () => <LoadingState message="Cargando estadísticas..." />,
    ssr: false,
  }
);

export const LazyMapaInteractivo = dynamic(
  () => import('../../app/(dashboard)/empresa/features/gestion-geografica/MapaInteractivo').then(mod => mod.MapaInteractivo),
  {
    loading: () => <LoadingState message="Cargando mapa..." />,
    ssr: false,
  }
);

export const LazySistemaAntifraude = dynamic(
  () => import('../../app/(dashboard)/empresa/features/gestion-geografica/antifraude').then(mod => mod.SistemaAntifraude),
  {
    loading: () => <LoadingState message="Cargando sistema antifraude..." />,
    ssr: false,
  }
);

export const LazyGestionTickets = dynamic(
  () => import('../features/dashboard-empresa/gestion-tickets').then(mod => mod.GestionTickets),
  {
    loading: () => <LoadingState message="Cargando tickets..." />,
    ssr: false,
  }
);

export const LazyConfiguracionEmpresa = dynamic(
  () => import('../../app/(dashboard)/empresa/features/configuracion').then(mod => mod.ConfiguracionEmpresa),
  {
    loading: () => <LoadingState message="Cargando configuración..." />,
    ssr: false,
  }
);

export const LazyGestionUsuarios = dynamic(
  () => import('../../app/(dashboard)/empresa/usuarios/page'),
  {
    loading: () => <LoadingState message="Cargando usuarios..." />,
    ssr: false,
  }
);
