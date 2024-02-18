/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
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
}

module.exports = nextConfig
