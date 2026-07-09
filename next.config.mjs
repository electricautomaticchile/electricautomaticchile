const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          ...(!isDev ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }] : []),
          // La Content-Security-Policy se define por-request (con nonce) en el
          // middleware proxy.ts, para poder eliminar 'unsafe-inline' de script-src.
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagenes-perfil.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "documentos-formulario.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "electricautomaticchile-images.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      // Notion hosted images (uploaded files)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      // Notion external images — MED-06: Restringir wildcard
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  output: "standalone",
  trailingSlash: true,
  staticPageGenerationTimeout: 120,
  serverExternalPackages: [
    "mongoose",
    "mongodb",
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['warn'],
    } : false,
  },
  generateBuildId: async () => {
    return "build-id-" + Date.now();
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
