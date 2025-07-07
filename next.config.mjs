/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  // Configuración para SSR
  output: "standalone",
  // Asegurar que todas las rutas terminen con slash
  trailingSlash: true,
  // Evitar exportación estática para todas las rutas
  staticPageGenerationTimeout: 1000,
  // Configuración experimental
  experimental: {
    serverComponentsExternalPackages: [
      "mongoose",
      "mongodb",
      "serialport",
      "@serialport/bindings-cpp",
    ],
    esmExternals: "loose",
  },

  // Configuración webpack para módulos nativos
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("serialport", "@serialport/bindings-cpp");
    }
    return config;
  },
  // Generar ID único para cada build
  generateBuildId: async () => {
    return "build-id-" + Date.now();
  },
};

export default nextConfig;
