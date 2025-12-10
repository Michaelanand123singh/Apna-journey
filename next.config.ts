import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  images: {
    // Allow images from any domain (RSS feeds can come from anywhere)
    // Use unoptimized mode for external images to avoid domain restrictions
    unoptimized: true,
    // Keep remotePatterns for specific known domains (optional optimization)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Keep domains for backward compatibility
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  eslint: {
    // Speed up CI and avoid build failing on lint issues during scaffolding
    ignoreDuringBuilds: true,
  },
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig