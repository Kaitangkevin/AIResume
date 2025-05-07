/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/AIResume',
  assetPrefix: '/AIResume/',
}

module.exports = nextConfig 