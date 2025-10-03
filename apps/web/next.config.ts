import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: () => [
    {
      source: '/',
      destination: '/bookmarks',
      permanent: false,
    },
  ],
  transpilePackages: ['@rememr/ui'],
}

export default nextConfig
