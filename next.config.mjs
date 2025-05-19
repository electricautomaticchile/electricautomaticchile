/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  // Desactivar la exportación estática
  output: 'standalone',
  // Configuración específica para Amplify
  generateBuildId: async () => {
    return 'build-id-' + Date.now()
  }
}

export default nextConfig 