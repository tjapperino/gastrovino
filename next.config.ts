import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.gastrovinoshop.nl' },
      { protocol: 'https', hostname: 'www.gastrovinorotterdam.nl' },
    ],
  },
}

export default nextConfig
