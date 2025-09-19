/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Domain and image configuration
  images: {
    domains: [
      'localhost',
      'api.kairoquantum.com',
      'www.kairoquantum.com',
      'kairoquantum.com',
      'cdn.kairoquantum.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.kairoquantum.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.kairoquantum.com',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.kairoquantum.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.kairoquantum.com',
  },
  
  // API rewrites for backend integration
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kairoquantum.com';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  
  // Redirects for domain management
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;