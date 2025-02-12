import type { NextConfig } from "next";


const API_URL = process.env.API || "http://ishabackend.local:8080";
const isDev = process.env.NODE_ENV === "development";
const Mydomain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const RAG_API = process.env.RAG_API || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  output: 'standalone',

  async headers() {
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline' 'unsafe-eval'"; // 在生產環境也允許內聯腳本

    const csp = `
      default-src 'self';
      script-src ${scriptSrc};
      style-src 'self' 'unsafe-inline' ${Mydomain};
      img-src 'self' data: blob: ${Mydomain};
      font-src 'self' ${Mydomain};
     connect-src 'self' ${API_URL} ${RAG_API} ${isDev ? 'ws: wss:' : ''};
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // 其他配置維持不變
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Home',
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${API_URL}/:path*`,
        basePath: false,
        locale: false,
      },
      {
        source: "/app/:path*",
        destination: `${RAG_API}/:path*`,
        basePath: false,
        locale: false,
      },
              // 添加靜態文件的代理
      {
        source: "/static/:path*",
        destination: `${RAG_API}/static/:path*`,
      }
    ];
  },
};

export default nextConfig;
