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
  const API_URL = process.env.API || "http://ishabackend:8080";
  const RAG_API = process.env.RAG_API || "http://ishabackend:8080";
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://test-app.isafe.org.tw";
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

const getRoutingConfig = (env: EnvironmentConfig) => ({

  redirects: async () => [
    {
      source: "/",
      destination: "/Login",
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

    return {
      beforeFiles: rules,
      afterFiles: rules,
      fallback: rules
    };
  },
});

const env = getEnvironmentConfig();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/**': [
      './config/**/*',
      './public/**/*',
    ],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  publicRuntimeConfig: {
    staticFolder: '/static',
  },

  transpilePackages: ['next'],

  ...getRoutingConfig(env),

  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
      allowedOrigins: ['*']
    },
  },
};

export default nextConfig;
