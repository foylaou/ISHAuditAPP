import type { NextConfig } from "next";
import type { Rewrite } from "next/dist/lib/load-custom-routes";

interface EnvironmentConfig {
  API_URL: string | undefined;
  RAG_API: string | undefined;
  DOMAIN: string;
  NODE_ENV: string;
  isDev: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const API_URL = process.env.API || "https://7267-61-216-117-67.ngrok-free.app";
  const RAG_API = process.env.RAG_API || "https://7267-61-216-117-67.ngrok-free.app";
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDev = NODE_ENV === "development";

  if (isDev) {
    console.log("Environment Configuration:");
    console.log(`API URL: ${API_URL || "undefined"}`);
    console.log(`RAG API: ${RAG_API || "undefined"}`);
    console.log(`Domain: ${DOMAIN}`);
    console.log(`Environment: ${NODE_ENV}`);
  } else {
    console.log("Environment Configuration:");
    console.log(`API URL: ${API_URL || "undefined"}`);
    console.log(`RAG API: ${RAG_API || "undefined"}`);
    console.log(`Domain: ${DOMAIN}`);
    console.log(`Environment: ${NODE_ENV}`);
  }

  return {
    API_URL,
    RAG_API,
    DOMAIN,
    NODE_ENV,
    isDev,
  };
};

const getSecurityHeaders = (env: EnvironmentConfig) => {
  const scriptSrc = env.isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline' 'unsafe-eval'";

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' ${env.DOMAIN};
    img-src 'self' data: blob: ${env.DOMAIN};
    font-src 'self' ${env.DOMAIN};
    connect-src 'self' ${env.API_URL || ''} ${env.RAG_API || ''} ${
    env.isDev ? "ws: wss:" : ""
  };
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

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
};

const getRoutingConfig = (env: EnvironmentConfig) => ({
  redirects: async () => [
    {
      source: "/",
      destination: "/Home",
      permanent: false,
    },
  ],

  rewrites: async () => {
    const rules: Rewrite[] = [
      {
        source: "/proxy/:path*",
        destination: `${env.API_URL}/:path*`,
      },
      {
        source: "/app/:path*",
        destination: `${env.RAG_API}/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${env.RAG_API}/static/:path*`,
      },
    ];

    return rules;
  },
});

const env = getEnvironmentConfig();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
      '/**': [
          './config/**/*',  // 包含所有配置文件
          './public/**/*',  // 包含所有公共文件（包括圖片）
      ],  // 確保配置文件被包含
    },
  // 確保靜態文件被正確處理
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  // 明確定義公共資源文件夾
  publicRuntimeConfig: {
    staticFolder: '/static',
  },

  // 處理靜態資源
  transpilePackages: ['next'],

  headers: async () => getSecurityHeaders(env),
  ...getRoutingConfig(env),

  experimental: {

    serverActions: {
  bodySizeLimit: '50mb', // 可選，設置請求體大小限制
  allowedOrigins: ['*'] // 可選，設置允許的來源
},

  },
};

export default nextConfig;
