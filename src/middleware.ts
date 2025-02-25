import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface EnvironmentConfig {
  API_URL: string | undefined;
  RAG_API: string | undefined;
  DOMAIN: string;
  NODE_ENV: string;
  isDev: boolean;
  NONCE: string;
}

const getEnvironmentConfig = (req: NextRequest): EnvironmentConfig => {
  const API_URL = process.env.API || "http://ishabackend:8080";
  const RAG_API = process.env.RAG_API || "http://ishabackend:8080";
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDev = NODE_ENV === "development";

  // 生成唯一的 nonce 值用於腳本和樣式
  const NONCE = Buffer.from(crypto.randomUUID()).toString('base64');

  return {
    API_URL,
    RAG_API,
    DOMAIN,
    NODE_ENV,
    isDev,
    NONCE
  };
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const env = getEnvironmentConfig(req);

  // 從請求 URL 中提取具體域名
  const apiUrl = new URL(env.API_URL || '').hostname;
  const ragApiUrl = new URL(env.RAG_API || '').hostname;
  const domain = new URL(env.DOMAIN).hostname;

  // 定義 CSP 指令，避免使用通配符
  const cspDirectives = {
    // 開發環境配置
    development: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        `'nonce-${env.NONCE}'`,
        // 避免使用 unsafe-inline，用 nonce 替代
        apiUrl && `https://${apiUrl}`,
        domain && `https://${domain}`
      ].filter(Boolean),
      'style-src': [
        "'self'",
        `'nonce-${env.NONCE}'`,
        // 替代 unsafe-inline
        apiUrl && `https://${apiUrl}`,
        domain && `https://${domain}`
      ].filter(Boolean),
      'img-src': ["'self'", "data:", "blob:", domain && `https://${domain}`].filter(Boolean),
      'font-src': ["'self'", domain && `https://${domain}`].filter(Boolean),
      'connect-src': [
        "'self'",
        apiUrl && `https://${apiUrl}`,
        ragApiUrl && `https://${ragApiUrl}`,
        "ws://localhost:*",
        "wss://localhost:*"
      ].filter(Boolean),
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'frame-ancestors':["'none'"],
      'form-action': ["'self'"]
    },
    // 生產環境配置
    production: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        `'nonce-${env.NONCE}'`
        // 移除 unsafe-inline
      ].filter(Boolean),
      'style-src': [
        "'self'",
        `'nonce-${env.NONCE}'`,
        domain && `https://${domain}`
        // 移除 unsafe-inline
      ].filter(Boolean),
      'img-src': ["'self'", "data:", "blob:", domain && `https://${domain}`].filter(Boolean),
      'font-src': ["'self'", domain && `https://${domain}`].filter(Boolean),
      'connect-src': [
        "'self'",
        apiUrl && `https://${apiUrl}`,
        ragApiUrl && `https://${ragApiUrl}`
      ].filter(Boolean),
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
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 移除 X-Powered-By 頭以防止信息洩露
  res.headers.delete('X-Powered-By');

  // 將 nonce 值添加到響應中，這樣 Next.js 和其他腳本可以使用它
  res.headers.set('x-nonce', env.NONCE);

  return res;
}

export const config = {
  matcher: '/:path*',
};
