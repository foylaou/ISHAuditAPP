import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'http://localhost:5238/:path*',  // 會把 /proxy/login 轉發到 http://localhost:5238/login
        basePath: false,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
