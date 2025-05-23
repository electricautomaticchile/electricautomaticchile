/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true // Mejor para Amplify
  },
  
  // Configuración específica para AWS Amplify con API routes
  output: 'standalone',
  trailingSlash: true,
  
  // Configuración de cache
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  
  // Headers para controlar cache
  async headers() {
    return [
      {
        source: '/((?!api/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Configuración experimental para Amplify
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
    esmExternals: 'loose'
  },
  
  // Generar ID único para cada build para forzar invalidación de cache
  generateBuildId: async () => {
    return 'amplify-build-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  },
  
  // Configuración adicional para evitar problemas de cache
  poweredByHeader: false,
  compress: true,
  
  // Configurar rewrites para manejar rutas dinámicas
  async rewrites() {
    return [
      {
        source: '/dashboard-:type',
        destination: '/dashboard-:type',
      },
    ];
  },
}

export default nextConfig 