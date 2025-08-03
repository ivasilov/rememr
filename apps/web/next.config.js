/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: '/',
      destination: '/bookmarks',
      permanent: false,
    },
  ],
  transpilePackages: ['@rememr/ui'],
}

module.exports = nextConfig
