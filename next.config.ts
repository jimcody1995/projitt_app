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
    // Add your package names here, for example:
    // 'three', 'some-other-lib'
  ],
};

export default nextConfig;
