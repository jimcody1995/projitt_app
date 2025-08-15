import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Packages that should be treated as external for server builds
  serverExternalPackages: [
    'pdfjs-dist',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle PDF.js worker for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
