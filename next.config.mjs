/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuración para SSR
  output: 'standalone',
  // Asegurar que todas las rutas terminen con slash
  trailingSlash: true,
  // Evitar exportación estática para todas las rutas
  staticPageGenerationTimeout: 1000,
  // Configuración experimental
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