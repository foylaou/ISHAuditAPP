//src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDev = NODE_ENV === "development";

  return {
    API_URL,
    RAG_API,
    DOMAIN,
    NODE_ENV,
    isDev,
  };
};

export function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  const env = getEnvironmentConfig();

  // Define CSP directives based on environment
  const cspDirectives = {
    // 開發環境允許更寬鬆的設定
    development: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", env.DOMAIN],
      'img-src': ["'self'", "data:", "blob:", env.DOMAIN],
      'font-src': ["'self'", env.DOMAIN],
      'connect-src': ["'self'", env.API_URL, env.RAG_API, "ws:", "wss:"].filter(Boolean),
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    },
    // 生產環境使用更嚴格的設定
    production: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'", env.DOMAIN],
      'img-src': ["'self'", "data:", "blob:", env.DOMAIN],
      'font-src': ["'self'", env.DOMAIN],
      'connect-src': ["'self'", env.API_URL, env.RAG_API].filter(Boolean),
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': []
    }
  };

  // 選擇環境對應的 CSP 設定
  const directives = cspDirectives[env.isDev ? 'development' : 'production'];

  // 構建 CSP 字串
  const csp = Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');

  // 設定安全標頭
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Robots-Tag', "noindex,nofollow, noarchive, nosnippet, notranslate, noimageindex");

  return res;
}

export const config = {
  matcher: '/:path*',
};
