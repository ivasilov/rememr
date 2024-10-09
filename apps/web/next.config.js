/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/bookmarks',
        permanent: true,
      },
    ]
  },
  transpilePackages: ['@rememr/ui'],
}

module.exports = nextConfig
