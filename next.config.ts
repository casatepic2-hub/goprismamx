import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dizqzbndz/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.*.fcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'external.*.fcdn.net',
      },
    ],
  },
}

export default nextConfig
