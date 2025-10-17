import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  eslint: {
    // Speed up CI and avoid build failing on lint issues during scaffolding
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
