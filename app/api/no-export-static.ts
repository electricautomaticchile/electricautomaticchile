// Este archivo asegura que todas las rutas de API sean dinámicas
// y no se intente exportarlas estáticamente

// Opcional: fuerza a que todas las rutas de API en esta carpeta sean dinámicas
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs'; 