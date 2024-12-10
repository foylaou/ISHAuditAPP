import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5238/:path*',
        basePath: false,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
