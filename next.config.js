/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/AIResume' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/AIResume/' : '',
  trailingSlash: true,
}

module.exports = nextConfig 