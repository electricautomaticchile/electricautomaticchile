/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  // Configuración para SSR
  output: 'standalone',
  // Asegurar que todas las rutas terminen con slash
  trailingSlash: true,
  // Evitar exportación estática para todas las rutas
  staticPageGenerationTimeout: 1000,
  // Forzar el modo SSR para las API routes
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
    esmExternals: 'loose',
    // Deshabilitar pre-renderizado estático para rutas de API
    appDir: true
  },
  // Generar ID único para cada build
  generateBuildId: async () => {
    return 'build-id-' + Date.now()
  }
}

export default nextConfig 