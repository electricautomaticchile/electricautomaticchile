/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  // Desactivar la exportación estática
  output: 'standalone',
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