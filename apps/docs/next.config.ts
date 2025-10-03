import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return [
        {
          source: '/dashboard',
          destination: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
        {
          source: '/dashboard/:path*',
          destination: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/:path*`,
        },
      ]
    }
    return await []
  },
  transpilePackages: ['@rememr/ui'],
}

export default nextConfig
