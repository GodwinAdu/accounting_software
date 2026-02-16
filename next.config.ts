import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      } as const,
    ],
  }
};

export default nextConfig