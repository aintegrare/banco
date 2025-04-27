/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Adicionar configuração para lidar com erros
  onDemandEntries: {
    // Período em ms em que a página será mantida em buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que devem ser mantidas em buffer
    pagesBufferLength: 2,
  },
}

export default nextConfig
