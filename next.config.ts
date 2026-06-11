import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.gastrovinoshop.nl' },
    ],
  },
}

export default nextConfig
