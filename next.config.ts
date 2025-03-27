import {withSentryConfig} from "@sentry/nextjs";
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
    console.debug("系統的環境變數:")
    console.debug(`後端位置: ${API_URL || "undefined"}`);
    console.debug(`AI 工具位置: ${RAG_API || "undefined"}`);
    console.debug(`主機域名: ${DOMAIN}`);
    console.debug(`目前伺服器環境為: ${NODE_ENV}`);
  } else {
    console.debug("系統的環境變數:")
    console.debug(`後端位置: ${API_URL || "undefined"}`);
    console.debug(`AI 工具位置: ${RAG_API || "undefined"}`);
    console.debug(`主機域名: ${DOMAIN}`);
    console.debug(`目前伺服器環境為: ${NODE_ENV}`);
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

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "isha-tn",
project: "ishaapp",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});
