import type { NextConfig } from 'next'

type Redirect = Awaited<
  ReturnType<NonNullable<NextConfig['redirects']>>
>[number]

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const nextConfig: NextConfig = {
  basePath,
  redirects: async () => {
    const redirs: Redirect[] = [
      {
        source: '/',
        destination: '/bookmarks',
        permanent: false,
      },
    ]

    // needed to support multi zone deployments on Vercel
    if (basePath) {
      redirs.push({
        source: '/',
        destination: basePath,
        basePath: false,
        permanent: false,
      })
    }

    return await redirs
  },
  transpilePackages: ['@rememr/ui'],
}

export default nextConfig
