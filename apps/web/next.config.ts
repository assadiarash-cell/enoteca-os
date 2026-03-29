import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@enoteca-os/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
    ],
  },
};

export default nextConfig;
