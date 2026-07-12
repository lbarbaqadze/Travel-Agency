import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['output-anywhere-blunt.ngrok-free.dev', '*.ngrok-free.dev'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    const apiPort = process.env.API_PROXY_PORT || '3002';
    return [
      {
        source: '/api/:path*',
        destination: `http://127.0.0.1:${apiPort}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
