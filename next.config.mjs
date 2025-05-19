/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  // Desactivar la exportación estática
  output: 'standalone',
  // Deshabilitar exportación estática de rutas de API
  exportPathMap: async (defaultPathMap) => {
    return {
      ...defaultPathMap,
      // Excluir rutas API de la exportación estática
      '/api/notificaciones/listar': { page: '/404' },
      '/api/cotizaciones': { page: '/404' },
      '/api/actividad/listar': { page: '/404' },
    };
  },
  // Forzar el modo SSR para las API routes
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
    esmExternals: 'loose',
  },
  // Generar ID único para cada build
  generateBuildId: async () => {
    return 'build-id-' + Date.now()
  }
}

export default nextConfig 